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
            console.error("MISMATCHED PARENS");
        }
        if (tree.error !== null) {
            console.error(`tree error: ${tree.error}`);
        }
        tree.findAdds();
        if (tree.error !== null) {
            console.error(`tree error: ${tree.error}`);
        }
        console.log(tree);
        return tree.toString();
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
            tokens.push(new Token("node", digitSequence, tokens.length));
            digitSequence = 0;
        }
        if (/[()*/+-]/.test(char)) {
            tokens.push(new Token("operator", char, tokens.length));
            continue;
        }
        return {"tree": null, "error": `unexpected character: '${char}' at index ${i}`};
    }
    if (digitSequence !== 0) {
        tokens.push(new Token("node", digitSequence, tokens.length));
    }
    return {"tree": new Tree(tokens), "error": null};
}

class Token {
    constructor(type, content, index) {
        if (type !== "node" && type !== "operator") {
            console.error("TOKEN MADE WITH INVALID TYPE");
            this.type = "ERROR ERROR";
            this.content = "ERROR ERROR";
            return;
        }
        this.type = type;
        this.content = content;
        this.index = index;
    }

    isOpenParen() {
        return this.type === "operator" && this.content === "(";
    }

    isCloseParen() {
        return this.type === "operator" && this.content === ")";
    }

    isPlus() {
        return this.type === "operator" && this.content === "+";
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


    // returns unexpected close parentheses if found
    findParen() {

        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child.isOpenParen()) {
                let parens = new Parens(this.children.slice(), i);
                if (parens.error !== null) {
                    this.error = `parens error: ${parens.error}`;
                    return null;
                }
                this.addChild(parens);
                this.shrunkBy += parens.endIndex - parens.startIndex;
                continue;
            }
            if (child.isCloseParen()) {
                return i;
            }
        }

        return null;
        
    }

    findAdds() {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child.isPlus()) {
                let add = new Add(this.children.slice(), i);
                if (add.error !== null) {
                    this.error = `add error: ${add.error}`;
                    return
                }
                this.addChild(add);
                this.shrunkBy += add.endIndex - add.startIndex;
            }
        }
    }

    toString() {
        return `${this.type}(${this.children.map(
            (child) => `${child.type}{${child.content.toString()}}`
        ).join()})`;
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
}

class Add extends Tree {
    constructor(tokens, index) {
        super(tokens);
        console.log(this.children.slice());
        console.log(index);
        this.type = "ADD";
        this.startIndex = index-1;
        this.endIndex = index+1;
        if (!this.children[index].isPlus()) {
            console.error("ERROR index isn't even plus");
        }
        if (!(index > 0 && this.children[index-1].type !== "node")) {
            this.error = "MISSING LEFT ADDITION ELEMENT";
            return;
        }
        if (!(this.children.length >= index && this.children[index+1].type === "node")) {
            this.error = "MISSION RIGHT ADDITION ELEMENT";
            return;
        }
        this.children.splice(0, this.startIndex);
        this.shrunkBy += this.startIndex;
        this.children.splice(2, this.children.length-2);
        this.children.splice(0);
    }
}

ReactDOM.render(
    <Calculator/>
    , document.getElementById('root'));
