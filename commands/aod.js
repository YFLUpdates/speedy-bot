import getAOD from "../functions/fivem/getAOD.js";

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();

    const data = await getAOD(usernameSmall);

    return data;
}