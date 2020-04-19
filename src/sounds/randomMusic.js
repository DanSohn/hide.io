function getSong() {
    let songSelection = Math.floor(Math.random() * 5);
    let songURL;
    switch (songSelection) {
        case 0:
            songURL =
                //"https://downloads.khinsider.com/game-soundtracks/album/kingdom-hearts-ii-ost/1-01.%2520Dearly%2520Beloved.mp3";
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/tmpcuweg/1-01.%20Dearly%20Beloved.mp3";
            break;
        case 1:
            songURL =
                //"https://downloads.khinsider.com/game-soundtracks/album/kingdom-hearts-ii-ost/1-04.%2520Lazy%2520Afternoons.mp3";
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/qzqfsncc/1-04.%20Lazy%20Afternoons.mp3";
            break;
        case 2:
            songURL =
                //"https://downloads.khinsider.com/game-soundtracks/album/kingdom-hearts-ii-ost/1-15.%2520The%2520Afternoon%2520Streets.mp3";
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/tmesbrmj/1-15.%20The%20Afternoon%20Streets.mp3";
            break;
        case 3:
            songURL =
                //"https://downloads.khinsider.com/game-soundtracks/album/kingdom-hearts-ii-ost/1-10.%2520Kairi.mp3";
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/hvlkbefw/1-10.%20Kairi.mp3";
            break;
        case 4:
            songURL =
                //"https://downloads.khinsider.com/game-soundtracks/album/kingdom-hearts-ii-ost/1-17.%2520Friends%2520in%2520My%2520Heart.mp3";
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/vfvvemuh/1-17.%20Friends%20in%20My%20Heart.mp3";
            break;
    }
    return songURL;
}


export default getSong;
