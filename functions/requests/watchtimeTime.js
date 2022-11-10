import axios from "axios";
import humanizeDuration from "humanize-duration";
import {Censor} from "../index.js"

export default async function getChatters(user, target_channel) {
    return await axios.get(`https://api.yfl.es/v1/user/find/${user}?channel=${target_channel}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const res = data.data;

        if(!res.watchtime) return `MrDestructoid ${Censor(user)} nie spędził ani sekundy na streamie.`;

        const time = humanizeDuration(res.watchtime * 10 * 60000, { language: "pl" });

        return `MrDestructoid ${Censor(user)} spędził ${time} na streamie.`;
    })
    .catch(err => {
        return `MrDestructoid ${Censor(user)} nie spędził ani sekundy na streamie.`;
        console.log(err)
    })
}