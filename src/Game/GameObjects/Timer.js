import React, { Component } from "react";
import { socket } from "../../assets/socket";

//Code that helped in building the timer from https://medium.com/better-programming/building-a-simple-countdown-timer-with-react-4ca32763dda7
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // minutes:props.minutes,
            //TODO: Depending on the role of the player, display a black screen for the first 15 seconds for hider, while seekers are hiding
            playerState: this.props.playerState,
            ingame_prompt:'',
            gamestage1: true,
            time: { minutes: this.props.gameDuration, seconds: 15 },
        };

        this.endCountdown = this.endCountdown.bind(this);
    }

    endCountdown(){
        console.log("Countdown completed");
        this.props.endCount();
    }

    updatePrompt(){
        if(this.state.playerState === "seeker" && this.state.gamestage1){
            this.setState({ingame_prompt:"They can't hide for long... We'll get them soon"});
        }
        else if(this.state.playerState === "hider" && this.state.gamestage1){
            this.setState({ingame_prompt:"Hurry! Run away before the seeker finds you!"});
        }
    }

    componentDidMount() {
        this.updatePrompt();

        socket.on("countdown ended", () => {
            console.log("Received event < countdown ended >");
            this.endCountdown();
        })

        socket.on("game in progress", (game_time) => {
            if (game_time.seconds === 0 && this.state.gamestage1) {
                this.setState({ gamestage1: false, ingame_prompt: "Time Remaining" });
            }

            if (game_time.minutes === 0 && game_time.seconds === 15 && this.state.playerState === "seeker") {
                this.setState({ ingame_prompt: "Hurry you don't have much time left!" });
            }

            if (game_time.minutes === 0 && game_time.seconds === 15 && this.state.playerState === "hider") {
                this.setState({ ingame_prompt: "You've almost made it!" });
            }
            this.setState({ time: game_time });
        });
    }

    componentWillUnmount() {
        socket.off("countdown ended");
        socket.off("game in progress");
    }

    render() {
        let comp;
        if (this.state.gamestage1) {
            comp = (
                <h1>
                    {this.state.ingame_prompt} ({this.state.time.seconds} seconds)
                </h1>
            );
        } else {
            // if we reach 0 min 0 sec, display times up. Else display prompt with M:SS
            comp = (
                <div>
                    {this.state.time.minutes === 0 && this.state.time.seconds === 0 ? (
                        <h1>Time's Up!</h1>
                    ) : (
                        <h1>
                            {this.state.ingame_prompt} {this.state.time.minutes}:
                            {this.state.time.seconds < 10
                                ? `0${this.state.time.seconds}`
                                : this.state.time.seconds}
                        </h1>
                    )}
                </div>
            );
        }
        return <React.Fragment>{comp}</React.Fragment>;
    }
}

export default Timer;
