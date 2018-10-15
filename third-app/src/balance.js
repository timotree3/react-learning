import React from 'react';
import ReactDOM from 'react-dom';
var user = {
    name: "Timo", 
    balance: {type: "USD", amount: 1337}
};
// var user = {first_name: "Timo", last_name: "Timo", };
ReactDOM.render(
    <h1>"Hello, {user.first_name}! Welcome to our service. Your account currently has {user.balance.amount} {(user.balance.type==="USD")?"dollar":"UNKNOWN"}{(user.balance.amount===1)?"":"s"}</h1>
    
    , document.getElementById('root'));
