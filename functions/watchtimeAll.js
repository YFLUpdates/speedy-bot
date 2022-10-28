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
        // const today = new Date().toLocaleDateString('en-ca');
        // const xayopl_creation_date = new Date(2021, 7, 26).toLocaleDateString('en-ca');
        // const datediff_min = new Date(today - xayopl_creation_date).getDay() * 24 * 60;
        
        // const percentage = Math.round(time_all * 100 / datediff_min, 2);
        const time = humanizeDuration(time_all * 60000, { language: "pl" });

        // console.log(datediff_min, percentage, time)

        // return `${Censor(channelName)} spedził ${time} na PL twitch od 26 lipca, co daje ${percentage}% jego życia.`
        return `${Censor(channelName)} spedził ${time} na PL twitch od 26 lipca.`
    })
    .catch(err => {
        console.log(err)
    })
}