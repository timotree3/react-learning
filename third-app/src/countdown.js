import React from 'react';
import ReactDOM from 'react-dom';

class Clock extends React.Component {
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
            <span>{countdown(this.state.now)}</span>
        );
    }
}

const countdown = function(now) {
    let electives = new Date();
    electives.setHours(14);
    electives.setMinutes(0);
    electives.setSeconds(0);
    const delay = electives.getTime() - now;
    console.log(delay);
    const seconds = Math.floor(delay/1000);
    const minutes = Math.floor(seconds/60);
    const hours = Math.floor(minutes/60);
    return `${hours}:${minutes%60}:${seconds%60}`;
}

ReactDOM.render(
    <h1><Clock/> until electives!</h1>
    , document.getElementById('root'));
