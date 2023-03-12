import {registerToBL} from "../../functions/yfles/index.js";
import { twitchlogger } from "../../requests/watchtime/index.js";

async function getChannels(user_login, associated_channels){
    const request = await twitchlogger(user_login);
    let time_all = 0;
    let channels_time = 0;
    let top1 = "x";

    if (request === null) {
        return null;
    }

    request.userChannels.sort((a, b) => {
        return b.count - a.count;
    });

    await Promise.all(
        request.userChannels.map((i, index) => {
            time_all += i.count * 5;

            const indexOfObject = request.channels.findIndex((object) => {
                return object.broadcasterId === i.broadcasterId;
            });

            if(index === 0){
                top1 = request.channels[indexOfObject].broadcasterLogin;
            }

            if(associated_channels.includes(request.channels[indexOfObject].broadcasterLogin)){
                channels_time += i.count * 5
            }

        })
    )

    return {watchtime: channels_time / time_all, top1: top1 || "x"};
}
function messagesChannels(msgs, ratio, command_name, user){
    if (ratio.watchtime < 0.3){
        return msgs.not;
    }else if(ratio.watchtime < 0.5){
        if(command_name != "yfl"){
            registerToBL(user, {mark: null, reason: command_name, top1: ratio.top1, registrator: "SYSTEM"})
        }
        return msgs.fan;
    }else if(ratio.watchtime > 0.5){
        if(command_name != "yfl"){
            registerToBL(user, {mark: null, reason: command_name, top1: ratio.top1, registrator: "SYSTEM"})
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