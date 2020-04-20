
function timerSound() {
    let soundButton = new Audio("https://freesound.org/people/fordps3/sounds/186669/download/186669__fordps3__computer-boop.wav")
    soundButton.volume = 0.6;
    return (
        soundButton.play()
    )
}

export default timerSound