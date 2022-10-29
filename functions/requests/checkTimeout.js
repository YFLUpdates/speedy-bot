import axios from "axios";
import humanizeDuration from "humanize-duration";
import { Censor } from "../index.js";

export default async function checkTimeout(user, channelName) {
    return await axios.get(`https://api.yfl.es/api/user/yflupdates/${user}?channel=${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const res = data.data;

        if(res.message) return `${Censor(user)} nie ma wykluczenia okok`;

        const banDate = new Date(res.created_at);
        const kiedySieKonczy = new Date(+banDate + (1000 * res.duration));
        const todaysDate = new Date();

        const diff = Math.abs(new Date() - kiedySieKonczy);
        const minutes = Math.floor((diff/1000)/60);
        const endsIn = humanizeDuration(minutes * 60000, { language: "pl" })

        if(kiedySieKonczy <= todaysDate) {
            return `${Censor(user)} nie ma już wykluczenia ok`;
        }else{
            return `${Censor(user)} jest wykluczony jeszcze na ${endsIn} jasperSad`;
        }
    })
    .catch(err => {
        //console.log(err)
        return `${Censor(user)} nie ma wykluczenia okok`;
    })
}