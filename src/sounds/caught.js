import React from 'react'

function caughtSound() {
    let soundButton = new Audio("https://www.myinstants.com/media/sounds/ha-got-eeem.mp3")
    return (
        soundButton.play()
    )
}

export default caughtSound;