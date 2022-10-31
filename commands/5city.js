import get5City from "../functions/fivem/get5City.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    const data = await get5City(usernameSmall);

    return data;
}