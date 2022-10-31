import axios from "axios";
import { Censor } from "../index.js";

export default async function checkTimeout(user, channelName) {
    return await axios.get(`https://api.yfl.es/api/lastseen/find/${user}?channel=${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const res = data.data;

        if(res.message) return `${Censor(user)} nie był(a) jeszcze widziany(a) u ${channelName} aha`;

        if(data){
            return `${Censor(user)} ostatnio był(a) widziany(a) (${new Date(res.date).toLocaleString("pl")}) oho`;
        }else{
            return `${Censor(user)} nie był(a) jeszcze widziany(a) aha`;
        }

    })
    .catch(err => {
        //console.log(err)
        return `${Censor(user)} nie był(a) jeszcze widziany(a) u ${channelName} aha`;
    })
}