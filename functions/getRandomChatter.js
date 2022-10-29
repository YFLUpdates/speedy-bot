import {getChatters} from "./requests/index.js";

export default async function getRandomChatter(channelName, opts = {}) {
    let {
        onlyViewers = false,
        noBroadcaster = false,
        skipList = []
    } = opts;
    return await getChatters(channelName)
    .then(data => {
        let chatters = data
            .filter(({ name, type }) =>
                !(
                    (onlyViewers && type !== 'viewers') ||
                    (noBroadcaster && type === 'broadcaster') ||
                    skipList.includes(name)
                )
            );
        return chatters.length === 0 ?
            null :
            chatters[Math.floor(Math.random() * chatters.length)];
    });
}