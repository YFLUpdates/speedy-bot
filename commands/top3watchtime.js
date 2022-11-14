import {Censor} from "../functions/index.js";
import {top3Watchtime} from "../functions/requests/index.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument.length > 3){
        const channels = await top3Watchtime(Censor(argument));

        return channels;
    }else{
        const channels = await top3Watchtime(usernameSmall);

        return channels;
    }
}