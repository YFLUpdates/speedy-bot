import {Censor} from "../functions/index.js";
import {checkEwron} from "../functions/requests/index.js";
import {ratioSwitch} from "../functions/index.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument.length > 3){
        const ratio = await checkEwron(argument);

        return `${Censor(argument)} ${ratioSwitch.ewron(ratio)} `;
    }else{
        const ratio = await checkEwron(usernameSmall);

        return `${usernameSmall} ${ratioSwitch.ewron(ratio)} `;
    }
}