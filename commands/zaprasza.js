import {Censor} from "../functions/index.js";
import {getRandomChatter} from "../functions/index.js"

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument !== " "){
        return `${usernameSmall} zaprasza na kamerki ${Censor(argument)} jasperM  `;
    }else{
        return await getRandomChatter(channel, { skipList: [ usernameSmall ] })
        .then(user => {
            if(user === null) {
                return `${usernameSmall} zaprasza na kamerki YFLUpdates jasperLaskotanie  `;
            }
            else {
                let { name } = user;
                return `${usernameSmall} zaprasza na kamerki ${name} jasperM  `;
            }
        })
        // .catch(err => console.log(err));
        .catch(err => {
            return `${usernameSmall} zaprasza na kamerki YFLUpdates jasperLaskotanie  `;
        });
    }
}