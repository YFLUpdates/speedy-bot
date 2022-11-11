import {getChatters} from "../functions/requests/index.js";
export default async function hugC(channel, username, argument){
    const chatters = await getChatters(channel);

    return `Current Chatters: ${chatters.length}`
}