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
async function request(channel, json){
    return await axios({
        url: `https://api.yfl.es/api/lastseen/duel/${channel}`,
        method: "put",
        data: json,
        headers: {
            'Content-type': 'application/json',
            'clientID': process.env.YFL_CLIENT_ID,
            'token': process.env.YFL_TOKEN
        }
    })
    .then(async (res) => {
        //console.log(data)
        return res.data;
    })
    .catch(err => {
        console.log(err)
    })
}

export default async function hugC(channel, username, argument, args){
    const usernameSmall = username.toLowerCase();

    if(argument === "ranking"){
        const topka = await getTop(channel);

        return `Najwięcej punktów mają: ${topka} - https://yfl.es/streamer/${channel}`;
    }else if(argument === "send"){
        //        args0  arg1   arg2
        //!points send {user} {kwota}
        if(!args[1] || args[1] == " ") return `${usernameSmall}, zapomniałeś podać osobe TPFufun `;
        if(!args[2] || !Number.isInteger(Number(args[2])) || Number(args[12]) === 0) return `${usernameSmall}, zapomniałeś podać kwote :| `;
        const receiver = args[1].replaceAll("@", "").toLowerCase();
        const ammount = Number(args[2]);
        const points = await getPoints(usernameSmall, channel);

        if(ammount > points) return `${usernameSmall} nie masz tylu punktów aha`;

        const req = await request(channel, {
            points: ammount,
            winner: receiver,
            loser: usernameSmall
        });

        return `${usernameSmall}, wysłałeś ${ammount} punktów do ${receiver} GIGACHAD`;

    }else if(argument && argument !== " "){
        const points = await getPoints(argument, channel);

        return `${Censor(argument)}, ma ${points} punktów ok`;
    }else{
        const points = await getPoints(usernameSmall, channel);

        return `${usernameSmall}, masz ${points} punktów ok`;
    }
}