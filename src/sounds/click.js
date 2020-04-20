function click() {
    let soundButton = new Audio("https://vgmdownloads.com/soundtracks/nintendo-switch-sound-effects/xldszolu/Nock.mp3")
    soundButton.volume = 0.6;
    return (
        soundButton.play()
    )
}

export default click;