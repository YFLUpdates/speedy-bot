import {randomNumber} from "../functions/index.js"

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();
    const procent = randomNumber(0, 100);

    if(procent === 0){
        return `${usernameSmall} ty moda? HAHAHA`;
    }else{
        return `${usernameSmall} szansa że dostaniesz moda wynosi ${procent}% TROLL `;
    }
}