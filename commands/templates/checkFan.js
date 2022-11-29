import axios from "axios";
import {registerToBL} from "../../functions/yfles/index.js";

async function getChannels(channelName, associated_channels){
    return await axios.get(`https://xayo.pl/api/watchtime/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let time_all = 0
        let channels_time = 0

        await Promise.all(
            channels.map((i) => {
                time_all += i.count * 5
                if(associated_channels.includes(i.streamer)){
                    channels_time += i.count * 5
                }
            })
        )
        return {watchtime: channels_time / time_all, top1: channels[0].streamer || "x"};
    })
    .catch(err => {
        return null;
    })
}
function messagesChannels(msgs, ratio, command_name, user){
    if (ratio.watchtime < 0.3){
        return msgs.not;
    }else if(ratio.watchtime < 0.5){
        if(command_name != "yfl"){
            registerToBL(user, {reason: command_name, top1: ratio.top1, registrator: "SYSTEM"})
        }
        return msgs.fan;
    }else if(ratio.watchtime > 0.5){
        if(command_name != "yfl"){
            registerToBL(user, {reason: command_name, top1: ratio.top1, registrator: "SYSTEM"})
        }
        return msgs.mega;
    }else{
        return msgs.not;
    }
}
export default async function checkFan(channel, username, argument, messages, associated_channels, command_name){
    const usernameSmall = username.toLowerCase();

    if(argument && argument.length > 3){
        const data = await getChannels(argument, associated_channels);

        if(data === null) return messages.onerror.replaceAll("{user}", argument);

        return `${argument} ${messagesChannels(messages, data, command_name, argument)}`;
    }else{
        const data = await getChannels(usernameSmall, associated_channels);

        if(data === null) return messages.onerror.replaceAll("{user}", usernameSmall);

        return `${usernameSmall} ${messagesChannels(messages, data, command_name, usernameSmall)}`;
    }
}