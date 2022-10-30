import {Censor} from "../functions/index.js";
import {getRandomChatter} from "../functions/index.js"

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    if(argument === " "){
        return `${usernameSmall} opierdolił(a) koguta samemu(a) sobie jasperGaleczka `;
    }else if(argument){
        return `${usernameSmall} opierdolił(a) koguta ${Censor(argument)} jasperGaleczka `;
    }else{
        return await getRandomChatter(channel, { skipList: [ usernameSmall ] })
        .then(user => {
            if(user === null) {
                return `${usernameSmall} opierdolił(a) koguta YFLUpdates Glumlenie `;
            }
            else {
                let { name } = user;
                return `${usernameSmall} opierdolił(a) koguta ${name} jasperGaleczka `;
            }
        })
        // .catch(err => console.log(err));
        .catch(err => {
            return `${usernameSmall} opierdolił(a) koguta YFLUpdates Glumlenie `;
        });
    }
}