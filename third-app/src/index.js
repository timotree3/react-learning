import React from 'react';
import ReactDOM from 'react-dom';

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "answer": "Please enter an expression."
        }
    }

    render() {
        return (
            <div>
                <input onChange={(e) => this.processChange(e)} type="text"/>
                <h1>{this.state.answer}</h1>
            </div>
        );
    }

    processChange(event) {
        console.clear();
        this.setState({
            ...this.state,
            "answer": "..."
        });
        this.setState({
            ...this.state,
            "answer": this.calculate(event.target.value)
        });
    }

    calculate(text) {
        let {tree, error} = tokenize(text);
        if (error !== null) {
            console.error(error);
            return "error! see developer console for more info.";
        }

        tree.parse();
        if (tree.error !== null) {
            return `error: ${tree.error}`;
        }
        console.log(tree);
        console.log(`STRING: ${tree.toString()}`);
        let val = tree.value();
        if (tree.error !== null) {
            return `error: ${tree.error}`;
        }
        return val;
    }
}

const tokenize = function(text) {
    let tokens = [];
    let char;
    let digitSequence = 0;
    for (let i = 0; i < text.length; i++) {
        char = text.charAt(i);
        if (/\s/.test(char)) {
            continue;
        }
        if (/\d/.test(char)) {
            digitSequence *= 10;
            digitSequence += Number(char);
            continue;
        }
        if (digitSequence !== 0) {
            tokens.push(new Token("value", digitSequence, tokens.length));
            digitSequence = 0;
        }
        if (/[()*/+-]/.test(char)) {
            tokens.push(new Token("marker", char, tokens.length));
            continue;
        }
        return {"tree": null, "error": `unexpected character: '${char}' at index ${i}`};
    }
    if (digitSequence !== 0) {
        tokens.push(new Token("value", digitSequence, tokens.length));
    }
    return {"tree": new Tree(tokens), "error": null};
}

class Token {
    constructor(type, content, index) {
        if (type !== "node" && type !== "marker" && type !== "value") {
            console.error("TOKEN MADE WITH INVALID TYPE");
            this.type = "ERROR ERROR";
            this.content = "ERROR ERROR";
            return;
        }
        this.type = type;
        this.content = content;
        this.index = index;
    }
}

class Tree {
    constructor(tokens) {
        this.error = null;
        this.children = tokens;
        this.startIndex = 0;
        this.endIndex = this.children.length-1;
        this.type = "TREE";
    }

    addChild(newChild) {
        console.log("adding child");
        console.log(newChild);
        this.children = [
            ...this.children.slice(0, newChild.startIndex),
            new Token("node", newChild),
            ...this.children.slice(newChild.endIndex + 1, this.children.length),
        ];
    }

    parse() {
        const order = [
            [Paren, CloseParen],
            [Mul, Quo],
            [Add]
        ];
        for (let tier of order) {
            console.log("starting next tier");
            for (let i = 0; i < this.children.length; i++) {

                for (let type of tier) {
                    console.log(`starting type ${type.name}`);
                    if (type.markedBy(this.children[i])) {
                        let newChild = new (type)(this.children.slice(), i);
                        this.addChild(newChild);
                        if (newChild.error !== null) {
                            this.error = `error while in type ${type.name}: ${newChild.error}`;
                            return;
                        }
                        i = newChild.startIndex;
                    }
                }
                if (this.children[i].type === "node") {
                    this.children[i].content.parse();
                    if (this.children[i].content.error !== null) {
                        this.error = `error in parsing child: ${this.children[i].content.error}`;
                        return;
                    }
                }
            }
        }
    }

    toString() {
        return `${this.type}(${this.children.map(
            (child) => `${(child.type==="node")?"":child.type}{${child.content.toString()}}`
        ).join()})`;
    }

    value() {
        if (this.children.length !== 1) {
            this.error = "wrong number of elements in group";
            return "ERROR";
        }
        if (this.children[0].type === "marker") {
            this.error = "main element is operator";
            return "ERROR";
        }
        if (this.children[0].type === "value") {
            return this.children[0].content;
        }
        let val = this.children[0].content.value();
        if (val === "ERROR") {
          this.error = `error evaluating child: ${this.children[0].content.error}`;
          return "ERROR";
        }
        return val;
    }
}

class Paren extends Tree {
    constructor(tokens, index) {
        super(tokens);
        this.type = "PAREN";
        if (Paren.markedBy(!this.children[index])) {
            console.error("ERROR index isn't even paren");
        }
        // exclude all that comes before the open paren
        this.startIndex = index;

        this.endIndex = this.findMatching();
        if (this.endIndex === null) {
            this.error = "NO CLOSE PARENTHESES";
            return;
        }
        this.children = this.children.slice(this.startIndex+1, this.endIndex);
    }

    static markedBy(token) {
        return token.type === "marker" && token.content === "(";
    }

    findMatching() {
        let starts = 0;
        for (let i = this.startIndex; i < this.children.length; i++) {
            if (Paren.markedBy(this.children[i])) {
                starts += 1;
            } else if (CloseParen.markedBy(this.children[i])) {
                starts -= 1;
            }
            if (starts === 0) {
                return i;
            }
        }
        return null;
    }

}

class CloseParen {
    constructor(tokens, index) {
        this.error = "MISMATCHED PARENTHESES";
        return;
    }

    static markedBy(token) {
        return token.type === "marker" && token.content === ")";
    }
}

class Mul extends Tree {
    constructor(tokens, starLocation) {
        super(tokens);
        console.log(this.children.slice());
        console.log(starLocation);
        this.type = "MUL";
        if (Mul.markedBy(!this.children[starLocation])) {
            console.error("ERROR starLocation isn't even star");
        }
        this.startIndex = starLocation-1;
        this.endIndex = starLocation+1;
        this.children = [
            this.children[this.startIndex],
            this.children[this.endIndex]
        ];
        if (this.children[0] === undefined || this.children[0].type === "marker") {
            this.error = "INVALID FIRST OPERAND";
            return;
        }
        if (this.children[1] === undefined || this.children[1].type === "marker") {
            this.error = "INVALID SECOND OPERAND";
            return;
        }
    }

    static markedBy(token) {
        return token.type === "marker" && token.content === "*";
    }

    value() {
        let val0;
        if (this.children[0].type === "value") {
            val0 = this.children[0].content;
        } else {
            val0 = this.children[0].content.value();
        }
        if (val0 === "ERROR") {
          this.error = `error evaluating first child: ${this.children[0].content.error}`;
          return "ERROR";
        }
        let val1;
        if (this.children[1].type === "value") {
            val1 = this.children[1].content;
        } else {
            val1 = this.children[1].content.value();
        }
        if (val1 === "ERROR") {
          this.error = `error evaluating first child: ${this.children[1].content.error}`;
          return "ERROR";
        }
        return val0 * val1;
    }
}

class Quo extends Tree {
    constructor(tokens, slashLocation) {
        super(tokens);
        console.log(this.children.slice());
        console.log(slashLocation);
        this.type = "QUO";
        if (Quo.markedBy(!this.children[slashLocation])) {
            console.error("ERROR slashLocation isn't even slash");
        }
        this.startIndex = slashLocation-1;
        this.endIndex = slashLocation+1;
        this.children = [
            this.children[this.startIndex],
            this.children[this.endIndex]
        ];
        if (this.children[0] === undefined || this.children[0].type === "marker") {
            this.error = "INVALID FIRST OPERAND";
            return;
        }
        if (this.children[1] === undefined || this.children[1].type === "marker") {
            this.error = "INVALID SECOND OPERAND";
            return;
        }
    }

    static markedBy(token) {
        return token.type === "marker" && token.content === "/";
    }

    value() {
        let val0;
        if (this.children[0].type === "value") {
            val0 = this.children[0].content;
        } else {
            val0 = this.children[0].content.value();
        }
        if (val0 === "ERROR") {
          this.error = `error evaluating first child: ${this.children[0].content.error}`;
          return "ERROR";
        }
        let val1;
        if (this.children[1].type === "value") {
            val1 = this.children[1].content;
        } else {
            val1 = this.children[1].content.value();
        }
        if (val1 === "ERROR") {
          this.error = `error evaluating first child: ${this.children[1].content.error}`;
          return "ERROR";
        }
        return val0 / val1;
    }
}

class Add extends Tree {
    constructor(tokens, plusLocation) {
        super(tokens);
        console.log(this.children.slice());
        console.log(plusLocation);
        this.type = "ADD";
        if (Add.markedBy(!this.children[plusLocation])) {
            console.error("ERROR plusLocation isn't even plus");
        }
        this.startIndex = plusLocation-1;
        this.endIndex = plusLocation+1;
        this.children = [
            this.children[this.startIndex],
            this.children[this.endIndex]
        ];
        if (this.children[0] === undefined || this.children[0].type === "marker") {
            this.error = "INVALID FIRST OPERAND";
            return;
        }
        if (this.children[1] === undefined || this.children[1].type === "marker") {
            this.error = "INVALID SECOND OPERAND";
            return;
        }
    }

    static markedBy(token) {
        return token.type === "marker" && token.content === "+";
    }

    value() {
        let val0;
        if (this.children[0].type === "value") {
            val0 = this.children[0].content;
        } else {
            val0 = this.children[0].content.value();
        }
        if (val0 === "ERROR") {
          this.error = `error evaluating first child: ${this.children[0].content.error}`;
          return "ERROR";
        }
        let val1;
        if (this.children[1].type === "value") {
            val1 = this.children[1].content;
        } else {
            val1 = this.children[1].content.value();
        }
        if (val1 === "ERROR") {
          this.error = `error evaluating first child: ${this.children[1].content.error}`;
          return "ERROR";
        }
        return val0 + val1;
    }
}

ReactDOM.render(
    <Calculator/>
    , document.getElementById('root'));
