import axios from "axios";
import {getChatters} from "./index.js";
import {randomNumber} from "../index.js";
import waitforme from "../../components/waitforme.js";

const botAccounts = ["socialstreamergrowth", "streamelements", "moobot", "discordstreamercommunity", "commanderroot", "smallstreamersdccommunity", 
"ssgdcserver", "yflupdates", "lewusbot", "official_tubebot", "creatisbot", "robohubby"];

function topN(arr, n){
    if(n > arr.length){
       return false;
    }
    return arr
    .slice()
    .sort((a, b) => {
       return b.count - a.count
    })
    .slice(0, n);
}

async function getWatchtime(user, channelName){

    return await axios.get(`https://xayo.pl/api/mostWatched/${user}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;

        const res = channels.find(x => x.streamer === channelName).count;

        return {
            name: user,
            count: res
        }
    })
    .catch(err => {
        console.log(err)

        return {
            name: user,
            count: 0
        }
    })
}

export default async function topChannelWatchtimes(channelName) {
    const chatters = await getChatters(channelName);
    let users = [];

    await Promise.all(
        chatters.map(async (i) => {
            if(botAccounts.includes(i.name) || i.name.includes("bot")) return;

            await waitforme(randomNumber(500, 1000));

            const watchtime = await getWatchtime(i.name, channelName);

            users.push(watchtime);

        })
    )
    // console.log(users)
    return topN(users, 5);

}