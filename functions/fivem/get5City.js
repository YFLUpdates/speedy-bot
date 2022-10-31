import cfx from "cfx-api";
import { promises as fs } from 'fs';

const znaniHex = JSON.parse(await fs.readFile('./steam_hex.json', 'UTF-8'))

export default async function getFiveCity(user) {
    const fivecity = await cfx.fetchServer("ggoe6z");
    const onServer = fivecity.players.length;
    let streamers = 0;
    let random = [];

    await Promise.all(
        fivecity.players.map(async (i, index) => {
            if(znaniHex.includes(i.identifiers[0])){
                if(random.length < 3){
                    random.push(i.name.toLowerCase())
                }
                streamers += 1;
            }
        })
    )

    return `jasperTragedia ${user} na 5City aktualnie jest ${onServer} osób, z czego ${streamers} to znane osoby np. ${random.join(", ")} `
}