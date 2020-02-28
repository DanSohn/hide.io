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
                <canvas ref="canvas" width={1200} height={800} />
            </div>
        )
    }
}

export default Game;