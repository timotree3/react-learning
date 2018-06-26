import React from 'react';
import ReactDOM from 'react-dom';
class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        };
    }

    render() {
        return(
            <div class="calendar">
            <h1>January</h1>
                <table>
                    {makeRow(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])}
                    {/* <MonthDays date={this.state.date}/> */}
                    {/* {"{1+1}"} */}
                </table>
            </div>
        );
    }
}

// class MonthDays extends React.Component {
//     render() {

//     }
// }

const makeRow = function(items) {
    return (
        <tr><td>{items.join("</td><td>")}</td></tr>
    );
};

ReactDOM.render(
    <Calendar/>
    , document.getElementById('root'));
