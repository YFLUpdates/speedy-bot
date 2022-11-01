import {Censor} from "../functions/index.js";
import {getPoints} from "../functions/requests/index.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument !== " "){
        const points = await getPoints(argument, channel);

        return `${Censor(argument)}, ma ${points} punktów ok`;
    }else{
        const points = await getPoints(usernameSmall, channel);

        return `${usernameSmall}, masz ${points} punktów ok`;
    }
}