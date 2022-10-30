import {Censor} from "../functions/index.js";
import {randomNumber} from "../functions/index.js"

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument === " "){

        return `${usernameSmall} kochasz ${usernameSmall} na ${randomNumber(0, 100)}% <3  `;
    }else if(argument){
        return `${usernameSmall} kochasz ${Censor(argument)} na ${randomNumber(0, 100)}% <3  `;
    }else{
        return `${usernameSmall} kochasz ${usernameSmall} na ${randomNumber(0, 100)}% <3  `;
    }
}