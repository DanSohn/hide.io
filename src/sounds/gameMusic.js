function getSong()
{
    let songSelection = Math.floor(Math.random() * 5);
    let songURL;
    switch (songSelection) {
        case 0:
            songURL =
                "https://vgmdownloads.com/soundtracks/mega-man-bass-gba/pxegwbro/04%20Robot%20Museum.mp3";
            break;
        case 1:
            songURL =
                "https://vgmdownloads.com/soundtracks/half-life-2-episode-two-rip-ost/itjbtwqb/03.%20Eon%20Trap.mp3";
            break;
        case 2:
            songURL =
                "https://vgmdownloads.com/soundtracks/uncharted-the-nathan-drake-collection/jpqzmvae/1-01.%20Nate%27s%20Theme.mp3";
            break;
        case 3:
            songURL =
                "https://vgmdownloads.com/soundtracks/super-smash-bros.-for-nintendo-3ds-and-wii-u-vol-02.-donkey-kong/lsdyorvy/19.%20Swinger%20Flinger.mp3";
            break;
        case 4:
            songURL =
                "https://vgmdownloads.com/soundtracks/uncharted-the-nathan-drake-collection/jpqzmvae/1-01.%20Nate%27s%20Theme.mp3";
            break;
    }
    return songURL;
}

export default getSong;