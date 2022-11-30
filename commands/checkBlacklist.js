import {checkBL} from "../functions/yfles/index.js";

export default async function checkBlacklist(user_login){
    const data = await checkBL(user_login);

    if(data === null){
        return `${user_login}, nie jest zjebem jasperSerduszko`;
    }

    return `${user_login}, został zarejestrowany jako zjeb dnia ${new Date(data.when_added).toLocaleDateString("en-CA")} powód: ${data.associated}`;
}