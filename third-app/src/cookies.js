import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);


        
        this.state = {
            cookies: 0,
            cps: 0,
            cpc: 1,
            timer: setInterval(
                () => {
                    this.setState({
                        ...this.state,
                        cookies: this.state.cookies + this.state.cps,
                    });
                }, 1000
            )
        };
    }
    
    render() {
        return (
            <div>
                <h1>Balance: {Math.floor(this.state.cookies)}</h1>
                <h2>Cookies per second: {this.state.cps}</h2>
                <Cookie onClick = {() => this.cookieClick()}/>
                <Shop onPurchase = {(purchase) => this.bought(purchase)} balance = {this.state.cookies}/>
            </div>
        );
    }

    cookieClick() {
        this.setState({
            ...this.state,
            cookies: this.state.cookies + this.state.cpc,
        });
    }

    bought(purchase) {
        this.setState({
            cookies: this.state.cookies - purchase.cost,
            cps: this.state.cps + purchase.cps,
            cpc: this.state.cpc + purchase.cpc
        });
    }
}

const Cookie = (props) => {
    return (
        <img alt = "cookie" src = "https://cdn.shopify.com/s/files/1/1463/8084/files/10212_Protein_Cookie_LandingPage_Intro_Cookie.png?7652470218512709090" onClick = {props.onClick} style = {{
            "width": "100px",
            "height": "100px"
        }}/>
    );
}

const Shop = (props) => {
    const item = {
        cost: 10,
        cps: 0.5,
        cpc: 0,
        name: "cursor"
    };
    return (
        <table>
            <tbody>
                <ShopItem onPurchaseAttempt = {() => {
                    if (props.balance - item.cost >= 0) {
                        props.onPurchase(
                            {
                                cost: item.cost,
                                cps: item.cps,
                                cpc: item.cpc
                            }
                        );
                    }
                }} name = {item.name} cost = {item.cost}/>
            </tbody>
        </table>
    );
}

const ShopItem = (props) => {
    return (
        <tr>
            <td
                onClick = {() => props.onPurchaseAttempt()}
                style = {{
                    "cursor": "pointer",
                    "backgroundColor": "tan"
                }}
            >Buy a {props.name}</td>
            <td>they cost {props.cost}</td>
        </tr>
    )
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
