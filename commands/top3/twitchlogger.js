import { twitchlogger } from "../../requests/watchtime/index.js";

export default async function twitchloggerTOP3(channel, user_login){
    const request = await twitchlogger(user_login);
    let num = 0;
    let fav_streamer = [];

    if(request === null){
        return `Nie byłem w stanie sprawdzić kanału ${user_login} jasperSad`
    }

    request.userChannels.sort((a, b) => {
        return b.count - a.count;
    });

    await Promise.all(
        request.userChannels.map((i) => {
            if(num === 3) return;
            num += 1;

            const indexOfObjectTop1 = request.channels.findIndex(object => {
                return object.broadcasterId === i.broadcasterId;
            });

            fav_streamer.push(request.channels[indexOfObjectTop1].broadcasterLogin);
        })
    )
    
    if(num > 0){
        return `BRUHBRUH Ulubieni streamerzy ${user_login}: ${fav_streamer.join(', ')}`;
    }

    return `${user_login} nigdy nie oglądał/a żadnego kanału twitch aha`;

}