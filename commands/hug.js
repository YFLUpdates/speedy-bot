import {Censor} from "../functions/index.js";
import {getRandomChatter} from "../functions/index.js"

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument === " "){
        return `${usernameSmall} przytula sam siebie, nie udacznik xd `;
    }else if(argument){
        return `${usernameSmall} przytula ${Censor(argument)} segz `;
    }else{
        return await getRandomChatter(channel, { skipList: [ usernameSmall ] })
        .then(user => {
            if(user === null) {
                return `${usernameSmall} przytula YFLUpdates segz `;
            }
            else {
                let { name } = user;
                return `${usernameSmall} przytula ${name} segz `;
            }
        })
        // .catch(err => console.log(err));
        .catch(err => {
            return `${usernameSmall} przytula YFLUpdates segz `;
        });
    }
}