import {getRandomChatter} from "../../functions/index.js"

export default async function RollOrMark(channel, username, argument, messages){
    const usernameSmall = username.toLowerCase();

    if(argument && argument.length > 3){
        return `${usernameSmall} ${messages.default.replaceAll("{user}", argument)}`;
    }else{
        return await getRandomChatter(channel, { skipList: [ usernameSmall ] })
        .then(user => {
            if(user === null) {
                return `${usernameSmall} ${messages.default.onerror}`;
            }else{
                let { name } = user;
                return `${usernameSmall} ${messages.default.replaceAll("{user}", name)}`;
            }
        })
        .catch(err => {
            return `${usernameSmall} ${messages.default.onerror}`;
        });
    }
}