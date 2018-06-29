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
        let tokens = new Tokens(text);
        if (tokens.error !== null) {
            console.error(tokens.error);
            return "error! see developer console for more info.";
        }
        return JSON.stringify(tokens);
    }
}

class Tokens {
    constructor(text) {
        this.tokens = [];
        this.error = null;
        let char;
        let digitSequence = 0;
        console.log(`TOKENS! ${text}`);
        for (let i = 0; i < text.length; i++) {
            console.log(`processing index ${i}`);
            char = text.charAt(i);
            console.log(`value: '${char}'`);
            if (/\s/.test(char)) {
                continue;
            }
            if (/\d/.test(char)) {
                digitSequence *= 10;
                digitSequence += Number(char);
                continue;
            }
            if (digitSequence !== 0) {
                this.tokens.push(new Token("value", digitSequence));
                digitSequence = 0;
            }
            if (/[()*/+-]/.test(char)) {
                this.tokens.push(new Token("operator", char));
                continue;
            }
            this.error = `unexpected character: '${char}' at index ${i}`;
            return;
        }
        if (digitSequence !== 0) {
            this.tokens.push(new Token("value", digitSequence));
        }
    }
}

class Token {
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
}
class Tree {
    constructor(tokens) {
        this.children = [];
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            if (token.type === "value") {
                this.children.push(new Child("value", token.content));
                continue;
            }
            if (token.type !== "operator") {
                console.error("ERROR SHOULD ALWAYS BE OPERATOR");
            }
            
        }
    }
}

class Child {
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
}

ReactDOM.render(
    <Calculator/>
    , document.getElementById('root'));
