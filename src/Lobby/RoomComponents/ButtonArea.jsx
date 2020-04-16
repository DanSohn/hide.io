import React from "react";

export default function ButtonArea(props) {
    let header = props.header,
        time = props.time,
        error = props.errorMsg,
        setting;

    if (time !== "") {
        setting = <h1 className="ff" style={{ fontSize: 110 }}>{time}</h1>;
    } else {
        setting = (
            <span
                onClick={() => {
                    props.timerCallback();
                    props.actionCallback();
                }}
                className='start-btn-green ff-20 width-250'
            >
                START GAME
            </span>
        )
    }
    if(error !== ""){
        setting = (
            <>
            <p className="errorMsg">{error}</p>
            {setting}
            </>
        )
    }
    return (
        <>
            <h5>{header}</h5>
            {setting}
        </>
    );
}