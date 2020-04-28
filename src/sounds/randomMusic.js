function getSong() {
    let songSelection = Math.floor(Math.random() * 4);
    let songURL;
    switch (songSelection) {
        case 0:
            songURL =
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/tmpcuweg/1-01.%20Dearly%20Beloved.mp3";
            break;
        case 1:
            songURL =
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/qzqfsncc/1-04.%20Lazy%20Afternoons.mp3";
            break;
        case 2:
            songURL =
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/tmesbrmj/1-15.%20The%20Afternoon%20Streets.mp3";
            break;
        case 3:
            songURL =
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/hvlkbefw/1-10.%20Kairi.mp3";
            break;
        default:
            songURL =
                "https://vgmdownloads.com/soundtracks/kingdom-hearts-ii-ost/vfvvemuh/1-17.%20Friends%20in%20My%20Heart.mp3";
            break;
    }
    return songURL;
}


export default getSong;
