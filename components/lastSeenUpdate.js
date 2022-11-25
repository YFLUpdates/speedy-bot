import axios from "axios";
import {getChatters} from "../functions/requests/index.js";
import getToken from "./getToken.js";
import waitforme from "./waitforme.js";
import dotenv from "dotenv";
import {randomNumber} from "../functions/index.js";
import updateUser from "../database/insert.js";

dotenv.config()

const botAccounts = ["socialstreamergrowth", "streamelements", "moobot", "discordstreamercommunity", "commanderroot", "smallstreamersdccommunity", 
"ssgdcserver", "yflupdates", "lewusbot", "official_tubebot", "creatisbot", "robohubby"];

async function isLive(){
    const channels = [
        "412834368", //speedy
        "244310065", //adrian
        "138649235", //josil
        "484019542", //grubamruwa
        "99854815", //3xanax,
        "720775570", //xkaleson
        "121329766", //neexcsgo
        "191099908" //sl3dziv
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
        //console.log(res.data)
        return res.data;
    })
    .catch(err => {
        console.log(err)
        return null;
    })
}

export default async function updateLastSeen(streamers) {

    await Promise.all(
        streamers.map(async (i) => {
            if(["#xmerghani", "#mrdzinold", "#mork", "#banduracartel"].includes(i)) return;

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

            await Promise.all(
                chatters.map(async (i) => {
                    if(botAccounts.includes(i.name)) return;

                    await waitforme(300)
                
                    updateUser(i.name,{
                        channel: cleanStreamer,
                        date: new Date().toJSON().slice(0, 19).replace('T', ' '),
                        watchtime: liveChannels.includes(cleanStreamer) ? true : null
                    })
                })
            );
        })
    )
}