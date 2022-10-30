import axios from "axios";
import { promises as fs } from 'fs';
import {Censor} from "../index.js"

const streamerki = JSON.parse(await fs.readFile('./girls.json', 'UTF-8'))

export default async function getChatters(channelName) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let num = 0
        let fav_streamer = []

        await Promise.all(
            channels.map((i) => {
                if(streamerki.includes(i.streamer) && i.count > 12){
                    if(num === 3) return;

                    num += 1;
                    fav_streamer.push(i.streamer);
                }
            })
        )
        if(num > 0){
            return `PogO Ulubione streamerki ${Censor(channelName)}: ${fav_streamer.join(', ')}`;
        }else{
            return `FIRE ${Censor(channelName)} nigdy nie oglądał żadnej polskiej streamerki GIGACHAD`;
        }
    })
    .catch(err => {
        console.log(err)
    })
}