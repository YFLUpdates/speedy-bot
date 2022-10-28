import getChatters from "./getChatters.js";

export default async function whosFamous(channelName, Users) {
    const users = await getChatters(channelName);
    let usersToReturn = [];

    await Promise.all(
        users.map((i) => {
            if(Users.includes(i.name)){
                if(i.name === channelName) return;
                
                usersToReturn.push(i.name)
            }
        })
    )

    return usersToReturn;
}