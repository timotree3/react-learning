import React from 'react';
import ReactDOM from 'react-dom';

const millisPerSecond = 1000;
const millisPerMinute = 60 * millisPerSecond;
const millisPerHour = 60 * millisPerMinute;
const millisPerDay = 24 * millisPerHour;

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
            <h1>{this.state.date.toLocaleDateString('en-US', {month: 'long', year: "numeric"})}</h1>
                <table border="1" style={{"textAlign": "center"}}>
                    <thead>
                        {makeRow([<span onClick = {
                            (e) => {
                                let newDate = new Date(this.state.date.valueOf());
                                let newMonth = newDate.getMonth() - 1;
                                if (newMonth < 0) {
                                    newMonth += 12;
                                    newDate.setFullYear(newDate.getFullYear()-1);
                                }
                                newDate.setMonth(newMonth);
                                this.setState({date: newDate});
                            }
                        }>&lt;</span>, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", <span onClick = {
                            (e) => {
                                let newDate = new Date(this.state.date.valueOf());
                                let newMonth = newDate.getMonth() + 1;
                                if (newMonth > 11) {
                                    newMonth -= 12;
                                    newDate.setFullYear(newDate.getFullYear()+1)
                                }
                                newDate.setMonth(newMonth);
                                this.setState({date: newDate});
                            }
                        }>&gt;</span>])}
                    </thead>
                    <MonthDays date={this.state.date}/>
                </table>
            </div>
        );
    }
}

class MonthDays extends React.Component {
    render() {
        let date = new Date(this.props.date.valueOf());
        console.log("rendering new date: " + date);
        let month = date.getMonth();
        date.setDate(1);
        // JS week starts sunday. Reset start of week to monday.
        let weekday = ((date.getDay()-1) % 7 + 7) % 7;
        date.setTime(date.getTime()-weekday*millisPerDay);
        // reset date to the most recent monday
        let rows = [];
        let i = 0;
        while (true) {
            rows.push([""]);
            for (let j = 0; j < 7; j++) {
                rows[i].push(date.getDate());
                date.setTime(date.getTime()+millisPerDay);
            }
            rows[i].push("");
            if (date.getMonth() !== month) {
                break;
            }
            i++;
        }
        return (
            <tbody>
                {rows.map((row, i) => makeRow(row, i))}
            </tbody>
        );
    }
}

const makeRow = function(items, rowKey) {
    console.log("key: " + rowKey);
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
