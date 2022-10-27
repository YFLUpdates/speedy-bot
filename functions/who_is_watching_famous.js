import getChatters from "./getChatters.js";

export default async function getRandomChatter(channelName, Users) {
    const users = await getChatters(channelName);
    let usersToReturn = [];

    await Promise.all(
        users.map((i) => {
            if(Users.includes(i.name)){
                usersToReturn.push(i.name)
            }
        })
    )

    return usersToReturn;
}