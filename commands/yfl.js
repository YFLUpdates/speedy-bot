import {Censor} from "../functions/index.js";
import {checkYFL} from "../functions/requests/index.js";
import {ratioSwitch} from "../functions/index.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument !== " "){
        const ratio = await checkYFL(argument);

        return `${Censor(argument)} ${ratioSwitch.yfl(ratio)} `;
    }else{
        const ratio = await checkYFL(usernameSmall);

        return `${usernameSmall} ${ratioSwitch.yfl(ratio)} `;
    }
}