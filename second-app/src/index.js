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
            <div className="calendar">
            <h1>{this.state.date.toLocaleDateString('en-US', {month: 'long'})}</h1>
                <table border="1">
                    <thead>
                        {makeRow(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "ASDASD")}
                    </thead>
                    <MonthDays date={this.state.date}/>
                </table>
            </div>
        );
    }
}

class MonthDays extends React.Component {
    render() {
        let date = this.props.date;
        let month = date.getMonth();
        date.setDate(1);
        // JS week starts sunday. Reset start of week to monday.
        let weekday = ((date.getDay()-1) % 7 + 7) % 7;
        date.setTime(date.getTime()-weekday*(1000*60*60*24));
        // reset date to the most recent monday
        let rows = [];
        for (let i = 0; true; i++) {
            console.log(date);
            rows.push([]);
            for (let j = 0; j < 7; j++) {
                rows[i].push(date.getDate());
                date.setTime(date.getTime()+(1000*60*60*24));
            }
            if (date.getMonth() !== month) {
                console.log(date);
                console.log(month);
                console.log(`breaking at ${rows.length} rows`);
                break;
            }
        }
        return (
            <tbody>
                {rows.map((row, i) => makeRow(row, i))}
            </tbody>
        );
    }
}

const makeRow = function(items, rowKey) {
    console.log(rowKey);
    return (
        <tr key={rowKey}>
            {
                items.map(
                    (item, i)=><td key={i}>{item}</td>
                )
            }
        </tr>
    );
};

ReactDOM.render(
    <Calendar/>
    , document.getElementById('root'));
