import {Censor} from "../functions/index.js";
import {getRandomChatter} from "../functions/index.js"

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument === " "){
        return `${usernameSmall} daje całusa swojemu ego yoooo `;
    }else if(argument){
        return `${usernameSmall} daje całusa ${Censor(argument)} yoooo `;
    }else{
        return await getRandomChatter(channel, { skipList: [ usernameSmall ] })
        .then(user => {
            if(user === null) {
                return `${usernameSmall} daje całusa YFLUpdates yoooo `;
            }
            else {
                let { name } = user;
                return `${usernameSmall} daje całusa ${name} yoooo `;
            }
        })
        // .catch(err => console.log(err));
        .catch(err => {
            return `${usernameSmall} daje całusa YFLUpdates yoooo `;
        });
    }
}