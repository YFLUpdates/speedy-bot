import {Censor} from "../functions/index.js";
import {getPoints} from "../functions/requests/index.js";
import axios from "axios";

async function getTop(channelName) {
    return await axios.get(`https://api.yfl.es/api/lastseen/ranking/points/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (res) => {
        return res.data.slice(0, 3).map((i) => { return (`${i.user_login}(${i.points})`) }).join(", ");
    })
    .catch(err => {
        console.log(err)
    })
}
export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument === "ranking"){
        const topka = await getTop(channel);

        return `Najwięcej punktów mają: ${topka} - https://yfl.es/streamer/${channel}`;
    }else if(argument && argument !== " "){
        const points = await getPoints(argument, channel);

        return `${Censor(argument)}, ma ${points} punktów ok`;
    }else{
        const points = await getPoints(usernameSmall, channel);

        return `${usernameSmall}, masz ${points} punktów ok`;
    }
}