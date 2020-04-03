import React, {Component} from 'react';
import {socket} from '../assets/socket';

//Code that helped in building the timer from https://medium.com/better-programming/building-a-simple-countdown-timer-with-react-4ca32763dda7
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // minutes:props.minutes,
            //TODO: Depending on the role of the player, display a black screen for the first 15 seconds for hider, while seekers are hiding
            player_role:'hider',
            blackoutscreen:false,
            minutes: 0,
            seconds: 15
        };
    }

    componentDidMount() {
        this.myInterval = setInterval(() => {
            const {seconds, minutes} = this.state;

            if (seconds > 0) {
                this.setState({seconds: seconds - 1});
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.myInterval);
                } else {
                    this.setState(({minutes}) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }));
                }
            }
        }, 1000);
    }

    render() {
        const {minutes, seconds} = this.state;
        return (
            <div>
                {minutes === 0 && seconds === 0 ? (
                    <h1>Busted!</h1>
                ) : (
                    <h1>
                        Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </h1>
                )}
            </div>
        );
    }
}

export default Timer;