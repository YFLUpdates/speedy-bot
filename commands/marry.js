import {Censor} from "../functions/index.js";
import {randomNumber} from "../functions/index.js";
import humanizeDuration from "humanize-duration";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument === " "){

        return `${usernameSmall} nigdy nie weźmie ślubu xd `;
    }else if(argument){
        return `${usernameSmall} weźmie ślub z ${Censor(argument)} za ${humanizeDuration(randomNumber(1440, 1051200) * 60000, { language: "pl" })} jupijej  `;
    }else{
        return `${usernameSmall} ma w planach wzięcie ślubu z samym sobą aha `;
    }
}