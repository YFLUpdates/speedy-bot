import {topChannelWatchtimes} from "../functions/requests/index.js";

export default async function hugC(channel, username, argument){
    const data = await topChannelWatchtimes(channel);

    if(data.length === 0) return `Nikt oglada streama ${channel} jasperSad`;

    const joinedStr = data.map((list) => list.name).join(", ")
    return `zyzzBass FIRE Najwięcej watchtimu aktualnie na streamie mają: ${joinedStr}`;
}