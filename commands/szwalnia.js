import getSzwalnia from "../functions/fivem/getSzwalnia.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    const data = await getSzwalnia(usernameSmall);

    return data;
}