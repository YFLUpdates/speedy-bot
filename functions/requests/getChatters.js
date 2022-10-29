import axios from "axios";

export default async function getChatters(channelName, _attemptCount = 0) {
    return await axios.get(`https://tmi.twitch.tv/group/user/${channelName}/chatters`, {headers: {'Content-type': 'application/json'}})
    .then(data => {
        //console.log(data)
        return Object.entries(data.data.chatters)
            .reduce((p, [ type, list ]) => p.concat(list.map(name => {
                if(name === channelName) type = 'broadcaster';
                return { name, type };
            })), []);
    })
    .catch(err => {
        //console.log(err)
        if(_attemptCount < 3) {
            return getChatters(channelName, _attemptCount + 1);
        }
        throw err;
    })
}