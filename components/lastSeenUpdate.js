import axios from "axios";
import {getChatters} from "../functions/requests/index.js";
import getToken from "./getToken.js";
import waitforme from "./waitforme.js";
import dotenv from "dotenv";
import {randomNumber} from "../functions/index.js"

dotenv.config()

async function isLive(){
    const channels = [
        "412834368", //speedy
        "244310065", //adrian
        "138649235", //josil
        "484019542", //grubamruwa
        "99854815" //3xanax
    ]

    return await axios({
        url: `https://api.twitch.tv/helix/streams?user_id=${channels.join("&user_id=")}`,
        method: "get",
        headers: {
            'Client-ID': process.env.CLIENT_ID, 
            'Authorization': "Bearer " + await getToken(), 
            'Content-type': 'application/json'
        }
    })
    .then(async (res) => {
        return res.data;
    })
    .catch(err => {
        console.log(err)
        return null;
    })
}

async function updateUser(channelName, streamer, wt){
    return await axios({
        url: `https://api.yfl.es/api/lastseen/update/${channelName}`,
        method: "put",
        data: {
            date: new Date().toJSON().slice(0, 19).replace('T', ' '),
            channel: streamer,
            watchtime: wt
        },
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

export default async function updateLastSeen(streamers) {
    await Promise.all(
        streamers.map(async (i) => {
            await waitforme(randomNumber(60000, 240000))
            const cleanStreamer = i.replaceAll("#", "");

            const chatters = await getChatters(cleanStreamer);
            const streamerStatus = await isLive();
            let liveChannels = [];

            if(streamerStatus.data !== null){
                await Promise.all(
                    streamerStatus.data.map((i) => {
                        if(i.type === "live"){
                            liveChannels.push(i.user_login)
                        }
                    })
                );
            }

            for (var x = 0; x < chatters.length; ++x) {
                await waitforme(250)
                
                await updateUser(chatters[x].name, cleanStreamer, liveChannels.includes(cleanStreamer) ? true:null)
            }
        })
    )
}