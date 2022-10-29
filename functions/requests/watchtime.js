import axios from "axios";
import humanizeDuration from "humanize-duration";
import {Censor} from "../index.js"

export default async function getChatters(user, target_channel) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${user}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let time_all = 0

        await Promise.all(
            channels.map((i) => {
                if(i.streamer === target_channel){
                    time_all += i.count * 5
                }
            })
        )

        if(time_all === 0 ) return `MrDestructoid ${Censor(user)} nie oglądał(a) w ogóle kanału ${target_channel}.`;

        const time = humanizeDuration(time_all * 60000, { language: "pl" });

        return `MrDestructoid ${Censor(user)} ogladał(a) kanał ${target_channel} przez ${time}.`;
    })
    .catch(err => {
        console.log(err)
    })
}