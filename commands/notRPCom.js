import serverInfo from "../functions/fivem/modules/severInfo.js";
import { promises as fs } from 'fs';
import getMultipleRandom from "../components/getMultipleRandom.js";

const znaniHex = JSON.parse(await fs.readFile('./steam_hex.json', 'UTF-8'))

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();
    const server = await serverInfo("jqbq8m");

    if(!server) return `${usernameSmall} coś się popsuło z Fivem jasperTragedia`;

    const onServer = server.players.length;
    let streamers = 0;
    let streamrsArray = [];

    await Promise.all(
        server.players.map(async (i, index) => {
            if(znaniHex.includes(i.identifiers[0])){
                streamrsArray.push(i.name.toLowerCase())
                streamers += 1;
            }
        })
    )
    const random = getMultipleRandom(streamrsArray, 3);
    
    return `GIGACHAD ${usernameSmall} na NotRP aktualnie jest ${onServer} osób ${streamers ? (", z czego to znane osoby np."+random.join(", ")):("")}`
}