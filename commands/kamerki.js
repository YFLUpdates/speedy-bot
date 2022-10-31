import {getChatters} from "../functions/requests/index.js";
import getMultipleRandom from "../components/getMultipleRandom.js";

export default async function hugC(channel, username, argument){
    const chatters = await getChatters(channel);
    const getTwo = getMultipleRandom(chatters, 2);

    return `${getTwo[0].name} i ${getTwo[1].name} bawią się na kamerkach jasperBoobsy`
}