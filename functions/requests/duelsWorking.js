import axios from "axios";
import {randomNumber} from "../index.js"

async function request(channel, json){
    return await axios({
        url: `https://api.yfl.es/v1/user/duel/${channel}`,
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

export default async function duelsWorking(channel, player1, player2, points){

    const number = randomNumber(1, 2);

    if(number === 1){
        const req = await request(channel, {
            points: points,
            winner: player1,
            loser: player2
        });

        return `${player1}, wygrałeś/aś pojedynek z ${player2}, zakład wynosił ${points * 2} punktów jasperczekoladka`
    }else{
        const req = await request(channel, {
            points: points,
            winner: player2,
            loser: player1
        });

        return `${player2}, wygrałeś/aś pojedynek z ${player1}, zakład wynosił ${points * 2} punktów jasperczekoladka`
    }
}