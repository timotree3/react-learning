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
        let mismatched_bracket_location = tree.findParen();
        if (mismatched_bracket_location !== null) {
            return `error: MISMATCHED PARENTHESES`;
        }
        if (tree.error !== null) {
            return `error: ${tree.error}`;
        }
        tree.findMuls();
        if (tree.error !== null) {
            return `error: ${tree.error}`;
        }
        tree.findQuos();
        if (tree.error !== null) {
            return `error: ${tree.error}`;
        }
        tree.findAdds();
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

// const order = [
//     [Paren, CloseParen],
//     [Mul, Quo],
//     [Add]
// ];

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
        this.shrunkBy = 0;
    }

    addChild(newChild) {
        console.log("adding child");
        console.log(newChild);
        let nextChildren = [];
        for (let i = 0; i < newChild.startIndex; i++) {
            nextChildren.push(this.children[i]);
        }
        nextChildren.push(new Token("node", newChild));
        for (let i = newChild.endIndex+1; i < this.children.length; i++) {
            nextChildren.push(this.children[i]);
        }
        this.children = nextChildren;
    }

    // parse() {
    //     for (let tier of order) {
    //         for (let i = 0; i < this.children.length; i++) {
    //
    //             for (let type of tier) {
    //                 if (type.markedBy(this.children[i])) {
    //                     let newChild = new (type)(this.children.slice(), i);
    //                     this.addChild(newChild);
    //                     this.shrunkBy += newChild.endIndex - newChild.startIndex;
    //                     if (newChild.error !== null) {
    //                         this.error = `error while in type ${type}: ${newChild.error}`;
    //                         return null;
    //                     }
    //                     i = newChild.startIndex;
    //                 }
    //             }
    //             if (this.children[i].type === "node") {
    //                 this.children[i].content.parse();
    //             }
    //         }
    //     }
    // }

    // returns unexpected close parentheses if found
    findParen() {
        console.log(this.children.slice());
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].isOpenParen()) {
                let parens = new Parens(this.children.slice(), i);
                this.addChild(parens);
                this.shrunkBy += parens.endIndex - parens.startIndex;
                if (parens.error !== null) {
                    this.error = `parens error: ${parens.error}`;
                    return null;
                }
                i = parens.startIndex;
            } else if (this.children[i].isCloseParen()) {
                return i;
            }
            if (this.children[i].type === "node") {
                this.children[i].content.findParen();
            }
        }

        return null;

    }

    findMuls() {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].isStar()) {
                let mul = new Mul(this.children.slice(), i);
                this.addChild(mul);
                this.shrunkBy += mul.endIndex - mul.startIndex;
                if (mul.error !== null) {
                    this.error = `mul error: ${mul.error}`;
                    return;
                }
                i = mul.startIndex;
            }
            if (this.children[i].type === "node") {
                this.children[i].content.findMuls();
            }
        }
    }

    findQuos() {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].isSlash()) {
                let quo = new Quo(this.children.slice(), i);
                this.addChild(quo);
                this.shrunkBy += quo.endIndex - quo.startIndex;
                if (quo.error !== null) {
                    this.error = `quo error: ${quo.error}`;
                    return;
                }
                i = quo.startIndex;
            }
            if (this.children[i].type === "node") {
                this.children[i].content.findQuos();
            }
        }
    }

    findAdds() {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].isPlus()) {
                let add = new Add(this.children.slice(), i);
                this.addChild(add);
                this.shrunkBy += add.endIndex - add.startIndex;
                if (add.error !== null) {
                    this.error = `add error: ${add.error}`;
                    return;
                }
                i = add.startIndex;
            }
            if (this.children[i].type === "node") {
                this.children[i].content.findAdds();
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

class Parens extends Tree {
    constructor(tokens, index) {
        super(tokens);
        this.type = "PARENS";
        if (!this.children[index].isOpenParen()) {
            console.error("ERROR index isn't even parens");
        }
        // exclude all that comes before the open paren
        this.startIndex = index;
        this.children.splice(0, this.startIndex+1);
        this.shrunkBy += this.startIndex+1;

        let closeParenLocation = this.findParen();
        this.endIndex = this.shrunkBy+closeParenLocation;

        if (closeParenLocation === null) {
            this.error = "NO CLOSE PARENTHESES";
            return;
        }
        this.children.splice(closeParenLocation, this.children.length-closeParenLocation);
    }

    static markedBy(token) {
        return token.type === "marker" && token.content === "(";
    }
}

class Mul extends Tree {
    constructor(tokens, starLocation) {
        super(tokens);
        console.log(this.children.slice());
        console.log(starLocation);
        this.type = "MUL";
        if (!this.children[starLocation].isStar()) {
            console.error("ERROR starLocation isn't even star");
        }
        this.startIndex = starLocation-1;
        this.endIndex = starLocation+1;
        this.children.splice(0, this.startIndex);
        this.children.splice(1, 1);
        this.children.splice(2, this.children.length-2);
        if (this.children.length < 2) {
          this.error = "NOT ENOUGH OPERANDS";
          return;
        }
        if (this.children[0].type === "marker") {
            this.error = "FIRST OPERAND IS AN MARKER";
            return;
        }
        if (this.children[1].type === "marker") {
            this.error = "SECOND OPERAND IS AN MARKER";
            return;
        }
    }

    static markedBy(token) {
        return this.type === "marker" && this.content === "*";
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
        if (!this.children[slashLocation].isSlash()) {
            console.error("ERROR slashLocation isn't even slash");
        }
        this.slashtIndex = slashLocation-1;
        this.endIndex = slashLocation+1;
        this.children.splice(0, this.startIndex);
        this.children.splice(1, 1);
        this.children.splice(2, this.children.length-2);
        if (this.children.length < 2) {
          this.error = "NOT ENOUGH OPERANDS";
          return;
        }
        if (this.children[0].type === "marker") {
            this.error = "FIRST OPERAND IS AN MARKER";
            return;
        }
        if (this.children[1].type === "marker") {
            this.error = "SECOND OPERAND IS AN MARKER";
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
        if (!this.children[plusLocation].isPlus()) {
            console.error("ERROR plusLocation isn't even plus");
        }
        this.startIndex = plusLocation-1;
        this.endIndex = plusLocation+1;
        this.children.splice(0, this.startIndex);
        this.children.splice(1, 1);
        this.children.splice(2, this.children.length-2);
        if (this.children.length < 2) {
          this.error = "NOT ENOUGH OPERANDS";
          return;
        }
        if (this.children[0].type === "marker") {
            this.error = "FIRST OPERAND IS AN MARKER";
            return;
        }
        if (this.children[1].type === "marker") {
            this.error = "SECOND OPERAND IS AN MARKER";
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
