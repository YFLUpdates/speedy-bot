import axios from "axios";
import humanizeDuration from "humanize-duration";
import {Censor} from "./index.js"

export default async function getChatters(channelName) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let time_all = 0

        await Promise.all(
            channels.map((i) => {
                time_all += i.count * 5
            })
        )
        const date_math = Math.abs(new Date() - new Date(2021, 7, 26));
        const datediff_min = Math.floor((date_math / 1000) / 60);
        
        const percentage = Math.round((time_all / datediff_min) * 100, 2);
        const time = humanizeDuration(time_all * 60000, { language: "pl" });

        return `${Censor(channelName)} spedził ${time} na PL twitch od 26 lipca, co daje ${percentage}% jego życia.`
        //return `${Censor(channelName)} spedził ${time} na PL twitch od 26 lipca.`
    })
    .catch(err => {
        console.log(err)
    })
}