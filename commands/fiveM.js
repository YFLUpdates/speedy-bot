import serverInfo from "../functions/fivem/modules/severInfo.js";
import { promises as fs } from 'fs';
import getMultipleRandom from "../components/getMultipleRandom.js";

const znaniHex = JSON.parse(await fs.readFile('./steam_hex.json', 'UTF-8'))

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();
    let server = null;
    let streamers = 0;
    let streamrsArray = [];

    if(!argument || argument && argument.length < 3) return `${usernameSmall} zapomniałeś/aś podać serwer (5city, notrp, cocorp, 77rp)`;

    switch (argument) {
        case "5city":
          server = await serverInfo("vp4rxq");
          break;
        case "notrp":
        case "nrp":
          server = await serverInfo("jqbq8m");
          break;
        case "coco":
        case "cocorp":
          server = await serverInfo("6d6rk8");
          break;
        case "77rp":
          server = await serverInfo("63blz4");
          break;
        default:
          server = null;
    }

    if(server === null) return `${usernameSmall} coś się popsuło z Fivem jasperTragedia`;

    await Promise.all(
        server.players.map(async (i, index) => {
            if(znaniHex.includes(i.identifiers[0])){
                streamrsArray.push(i.name.toLowerCase())
                streamers += 1;
            }
        })
    )
    const random = getMultipleRandom(streamrsArray, 3);
    
    return `ok ${usernameSmall} na ${argument} aktualnie jest ${server.players.length} osób${streamers ? (`, z czego ${streamers} to znane osoby np. ${random.join(", ")}`):("")}`
}