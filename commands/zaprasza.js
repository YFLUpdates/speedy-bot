import {Censor} from "../functions/index.js";
import {getRandomChatter} from "../functions/index.js"

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument && argument !== " "){
        return `${usernameSmall} zaprasza ${Censor(argument)} na kamerki jasperM  `;
    }else{
        return await getRandomChatter(channel, { skipList: [ usernameSmall ] })
        .then(user => {
            if(user === null) {
                return `${usernameSmall} zaprasza YFLUpdates na kamerki jasperLaskotanie  `;
            }
            else {
                let { name } = user;
                return `${usernameSmall} zaprasza ${name} na kamerki jasperM  `;
            }
        })
        // .catch(err => console.log(err));
        .catch(err => {
            return `${usernameSmall} zaprasza YFLUpdates na kamerki jasperLaskotanie  `;
        });
    }
}