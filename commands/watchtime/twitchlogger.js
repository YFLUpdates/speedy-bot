import { twitchlogger } from "../../requests/watchtime/index.js";
import humanizeDuration from "humanize-duration";

export default async function twitchloggerCMD(channel, user_login, args){
    const request = await twitchlogger(args ? args : user_login);
    const channelName = args ? args : channel;

    if(request === null){
        return `Nie byłem w stanie sprawdzić kanału ${user_login} jasperSad`
    }

    const indexOfObject = request.channels.findIndex(object => {
        return object.broadcasterLogin === channelName;
    });

    if(indexOfObject === -1){
        return `MrDestructoid ${user_login} nie oglądał(a) w ogóle kanału ${channelName}.`;
    }

    const findCount = request.userChannels.findIndex(object => {
        return object.broadcasterId === request.channels[indexOfObject].broadcasterId;
    });

    const time = humanizeDuration((request.userChannels[findCount].count * 5) * 60000, { language: "pl" });

    return `MrDestructoid ${user_login} ogladał(a) kanał ${channelName} przez ${time}.`;
    
}