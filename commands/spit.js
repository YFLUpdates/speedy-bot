import {Censor} from "../functions/index.js";
import {getRandomChatter} from "../functions/index.js"

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument === " "){
        return `${usernameSmall} pluje na samego(ą) siebie Spit `;
    }else if(argument){
        return `${usernameSmall} pluje na ${Censor(argument)} Spit `;
    }else{
        return await getRandomChatter(channel, { skipList: [ usernameSmall ] })
        .then(user => {
            if(user === null) {
                return `${usernameSmall} pluje na cały czat D: `;
            }
            else {
                let { name } = user;
                return `${usernameSmall} pluje na ${name} Spit `;
            }
        })
        // .catch(err => console.log(err));
        .catch(err => {
            return `${usernameSmall} pluje na cały czat D: `;
        });
    }
}