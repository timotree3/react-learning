import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
    constructor(props) {
        super(props);
        let midnight = new Date();
        midnight.setHours(23);
        midnight.setMinutes(59);
        midnight.setSeconds(59);
        midnight.setMilliseconds(999);
        this.state = {
            countTo: midnight
        }
    }

    render() {
        return (
            <div id="app">
                <h1><Countdown CountTo={this.state.countTo}/> remaining.</h1>
                <Form date={this.state.countTo} callback={(nextTarget) => {this.setState({countTo: nextTarget});}}/>
            </div>
        )
    }
}


class Countdown extends React.Component {
    constructor(props) {
        super(props);
        const now = new Date();
        this.state = {aligned: false, now: now, timer_id: null};
        const nowUnix = now.getTime();
        console.log(nowUnix);
        const delay = 1000-nowUnix%1000;
        console.log(delay);
        setTimeout(() => {
            console.log(new Date().getTime());
            this.setState({...this.state, aligned: true, now: new Date()});
            setInterval(() => {
                this.setState({...this.state, now: new Date()});
            }, 1000)
        }, delay)
    }
    render() {
        return (
            <span>{renderDuration(durationBetween(this.state.now, this.props.CountTo))}</span>
        );
    }
}

const durationBetween = function(earlierTime, laterTime) {
    return laterTime.getTime()-earlierTime.getTime();
};

const renderDuration = function(millis) {
    const seconds = Math.floor(millis/(1000))%60;
    const minutes = Math.floor(millis/(1000*60))%60;
    const hours = Math.floor(millis/(1000*60*60))%60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

class Form extends React.Component {
    render() {
        return (
            <form>
                <label htmlFor="month">Month and Year</label>
                <input value={dateToMonthCode(this.props.date)} name="month" type="month" onChange={(e) => this.newMonth(e)}/>
                <label htmlFor="day">Day of Month</label>
                <input value={this.props.date.getDate()} name="day" type="number" onChange={(e) => this.newDay(e)}/>
                <label htmlFor="time">Time of day</label>
                <input value={dateToTimeCode(this.props.date)} name="time" type="time" onChange={(e) => this.newTime(e)}/>
            </form>
        )
    }

    newMonth(event) {
        let nextDate = new Date(this.props.date.valueOf());
        const monthCode = event.target.value;
        const year = Number(monthCode.substring(0, 4));
        nextDate.setFullYear(year);
        const month = Number(monthCode.substring(5, 7));
        nextDate.setMonth(month-1);
        this.props.callback(nextDate);
    }

    newDay(event) {
        let nextDate = new Date(this.props.date.valueOf());
        const day = Number(event.target.value);
        nextDate.setDate(day);
        this.props.callback(nextDate);
    }

    newTime(event) {
        let nextDate = new Date(this.props.date.valueOf());
        const timeCode = event.target.value;
        const hours = Number(timeCode.substring(0,2));
        nextDate.setHours(hours);
        const minutes = Number(timeCode.substring(3,5));
        nextDate.setMinutes(minutes);
        this.props.callback(nextDate);
    }
}

const dateToMonthCode = function(date) {
    return `${date.getFullYear().toString().padStart(4, "0")}-${(date.getMonth()+1).toString().padStart(2, "0")}`;
}

const dateToTimeCode = function(date) {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
