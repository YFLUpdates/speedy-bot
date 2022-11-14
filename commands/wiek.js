import {Censor} from "../functions/index.js";
import {howOld} from "../functions/requests/index.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument.length > 3){

        return await howOld(Censor(argument));
    }else{

        return await howOld(usernameSmall);
    }
}