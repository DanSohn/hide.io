import React from 'react'

function click() {
    let soundButton = new Audio("https://vgmdownloads.com/soundtracks/nintendo-switch-sound-effects/xldszolu/Nock.mp3")
    return (
        soundButton.play()
    )
}

export default click