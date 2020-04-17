function getGameSound()
{
    let songSelection = Math.floor(Math.random() * 3);
    let songURL;
    switch (songSelection) {
        case 0:
            songURL = "https://freesound.org/data/previews/34/34338_215874-lq.mp3";
            break;
        case 1:
            songURL =
                "./sounds/gameSound.wav";
            break;
        case 2:
            songURL =
                "./sounds/gameSound2.wav";
            break;
    }
    return "https://freesound.org/data/previews/34/34338_215874-lq.mp3";
}
export default getGameSound;