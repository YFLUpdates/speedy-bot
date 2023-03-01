import axios from "axios";
import humanizeDuration from "humanize-duration";
import { promises as fs } from 'fs';
import {Censor} from "../index.js"

const streamerki = JSON.parse(await fs.readFile('./girls.json', 'UTF-8'))

export default async function getChatters(channelName) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let time_all = 0
        let time_female = 0

        await Promise.all(
            channels.map((i) => {
                if(streamerki.includes(i.streamer)){
                    time_female += i.count * 5
                }else{
                    time_all += i.count * 5
                }
            })
        )
        const percentage = Math.round(time_female / time_all * 100, 2);
        const time = humanizeDuration(time_female* 60000, { language: "pl" });

        if(time_female === 0){
            return `FIRE ${Censor(channelName)} nigdy nie oglądał/a żadnej polskiej streamerki GIGACHAD`
        }else{
            return `PogO ${Censor(channelName)} oglądał/a streamerki przez ${time}, co sprawia, że oglądał/a streamerki przez ${percentage}% swojego czasu na PL Twitch.`
        }
    })
    .catch(err => {
        return `Nie byłem w stanie sprawdzić kanału ${channelName} jasperSad `
        console.log(err)
    })
}