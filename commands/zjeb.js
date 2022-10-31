import {randomNumber} from "../functions/index.js"

function roll(){
    const number = randomNumber(1, 2);

    if(number === 1){
        return "tak jasperSmiech"
    }else{
        return "nie jasperSerduszko"
    }
}

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();
    const rollMe = roll();

    return `${usernameSmall} ${rollMe}`;

}