import {Censor} from "../functions/index.js";
import {howOld} from "../functions/requests/index.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument !== " "){

        return await howOld(Censor(argument));
    }else{

        return await howOld(usernameSmall);
    }
}