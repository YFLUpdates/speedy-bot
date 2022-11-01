import {Censor} from "../functions/index.js";
import {offlineTime} from "../functions/requests/index.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument !== " "){
        const channels = await offlineTime(Censor(argument, channel));

        return channels;
    }else{
        const channels = await offlineTime(usernameSmall, channel);

        return channels;
    }
}