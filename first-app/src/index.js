import React from 'react';
import ReactDOM from 'react-dom';
class Calendar extends React.Component {
    render() {
        return(
            <div class="calendar">
            <h1>January</h1>
                <table>
                    <Weeklydays/>
                </table>
            </div>
        );
    }
}
class Weeklydays extends React.Component {
    render() {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return(
            <tr>{for (day of days) {"<td>"+day+"</td>"}}</tr>
        );
    }
}
ReactDOM.render(
    <Calendar/>
    , document.getElementById('root'));
