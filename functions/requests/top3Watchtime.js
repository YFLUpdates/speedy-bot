import axios from "axios";

export default async function getChatters(channelName) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let num = 0
        let fav_streamer = []

        await Promise.all(
            channels.map((i) => {
                if(num === 3) return;
                num += 1;
                fav_streamer.push(i.streamer);
            })
        )
        if(num > 0){
            return `BRUHBRUH Ulubieni streamerzy ${channelName}: ${fav_streamer.join(', ')}`;
        }else{
            return `${channelName} nigdy nie oglądał żadnego kanału twitch aha`;
        }
    })
    .catch(err => {
        return `Nie byłem w stanie sprawdzić kanału ${channelName} jasperSad `;
        //console.log(err)
    })
}