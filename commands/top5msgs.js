import {chatMessages} from "../functions/requests/index.js";

async function top5(channel, users){
    let num = 0
    let fav_streamer = []

    await Promise.all(
        users.map((i) => {
            if(num === 5) return;
            num += 1;
            fav_streamer.push(i.name);
        })
    )
    if(num > 0){
        return `BRUHBRUH Najwięcej wiadomości u ${channel} mają: ${fav_streamer.join(', ')}`;
    }else{
        return `Ranking ${channel} jest pusty aha`;
    }
}

export default async function hugC(channel, username, argument){

    if(argument && argument.length > 3){
        const channels = await chatMessages(argument);
        if(channels === null) return `${username} nie udało się pobrać danych jasperSad`;

        return await top5(argument, channels);
    }else{
        const channels = await chatMessages(channel);
        if(channels === null) return `${username} nie udało się pobrać danych jasperSad`;

        return await top5(channel, channels);
    }
}