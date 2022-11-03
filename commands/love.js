import {Censor} from "../functions/index.js";
import {randomNumber} from "../functions/index.js"

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument === " "){

        return `${usernameSmall} jest zakochany(a) na ${randomNumber(0, 100)}% w ${usernameSmall} <3  `;
    }else if(argument){
        return `${usernameSmall} jest zakochany(a) na ${randomNumber(0, 100)}% w ${Censor(argument)}<3  `;
    }else{
        return `${usernameSmall} jest zakochany(a) na ${randomNumber(0, 100)}% w ${usernameSmall} <3  `;
    }
}