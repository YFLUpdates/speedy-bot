import {offlineTime} from "../functions/requests/index.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument.length > 3){
        const channels = await offlineTime(argument);

        return channels;
    }else{
        const channels = await offlineTime(usernameSmall, channel);

        return channels;
    }
}
