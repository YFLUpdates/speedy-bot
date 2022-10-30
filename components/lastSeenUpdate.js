import axios from "axios";
import {getChatters} from "../functions/requests/index.js";
import waitforme from "./waitforme.js";
import dotenv from "dotenv";
import {randomNumber} from "../functions/index.js"

dotenv.config()

async function updateUser(channelName, streamer){
    // console.log(channelName, streamer)
    return await axios({
        url: `https://api.yfl.es/api/lastseen/update/${channelName}`,
        method: "put",
        data: {
            date: new Date().toJSON().slice(0, 19).replace('T', ' '),
            channel: streamer
        },
        headers: {
            'Content-type': 'application/json',
            'clientID': process.env.YFL_CLIENT_ID,
            'token': process.env.YFL_TOKEN
        }
    })
    .then(async (data) => {
        return data;
    })
    .catch(err => {
        console.log(err)
    })
}

export default async function updateLastSeen(streamers) {
    await Promise.all(
        streamers.map(async (i) => {
            await waitforme(randomNumber(60000, 240000))
            const cleanStreamer = i.replaceAll("#", "");

            const chatters = await getChatters(cleanStreamer);

            for (var x = 0; x < chatters.length; ++x) {
                await waitforme(250)
                
                await updateUser(chatters[x].name, cleanStreamer)
            }
        })
    )
}