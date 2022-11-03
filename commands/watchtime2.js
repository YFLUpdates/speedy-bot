import {Censor} from "../functions/index.js";
import {watchtimeTime} from "../functions/requests/index.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument !== " "){
        const channels = await watchtimeTime(Censor(argument, channel));

        return channels;
    }else{
        const channels = await watchtimeTime(usernameSmall, channel);

        return channels;
    }
}