import {getChatters} from "../functions/requests/index.js"

export default async function hugC(channel, username, argument){
    const chatters = await getChatters(channel);

    let counter = 0;
    let message = [];

    await Promise.all(
        chatters.map((i) => {
            if(i.name.includes("yfl")){
                message.push(i.name);
                counter += 1;
            }
        })
    )

    if(message.length === 0){
        return `Nikt z YFL w nicku nie ogląda ${channel}`
    }else if(message.join(", ").length > 400){
        return `${counter} użytkowników mających w nicku YFL ogląda ${channel}. Nie da się wypisać za dużo ich EZ`
    }else{
        return `${message.join(", ")} oglądają stream ${channel}`
    }

}