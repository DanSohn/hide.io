import React, {Component} from 'react';

class Game extends Component{

    componentDidMount() {
        console.log("in game mounting");
        //console.log("socket" + socket);
        /*
        socket.on('hello', ()=>{
            console.log("hello!!!");
        });

         */
    }

    render(){
        console.log("in game rendering");
        return (
            <div>
                <canvas ref="canvas" style={{backgroundColor: 'yellow'}} width={1800} height={700} />
            </div>
        )
    }
}

export default Game;