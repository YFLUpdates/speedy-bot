const tmi = require('tmi.js');
const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios")
dotenv.config()

let lastOpluj = 0;
const app = express();
const PORT = process.env.PORT || 3000;

app.set('json spaces', 2);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "speedy.yfl.es" });
});

app.listen(PORT, () =>
  console.log(`API Server listening on port ${PORT}`)
);

async function getChatters(channelName, _attemptCount = 0) {
    return await axios.get(`https://tmi.twitch.tv/group/user/${channelName}/chatters`, {headers: {'Content-type': 'application/json'}})
    .then(data => {
        // console.log(data)
        return Object.entries(data.data.chatters)
            .reduce((p, [ type, list ]) => p.concat(list.map(name => {
                if(name === channelName) type = 'broadcaster';
                return { name, type };
            })), []);
    })
    .catch(err => {
        // console.log(err)
        if(_attemptCount < 3) {
            return getChatters(channelName, _attemptCount + 1);
        }
        throw err;
    })
}

async function getRandomChatter(channelName, opts = {}) {
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

const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD
	},
	channels: [ 'xspeedyq' ]
});

client.connect();

client.on('message', async (channel, tags, message, self) => {
	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	if(command === 'opluj') {
        if (lastOpluj > (Date.now() - 4000)) {
            return;
          }
        lastOpluj = Date.now();

        await getRandomChatter(channel.replaceAll("#", ""), { skipList: [ tags.username ] })
            .then(user => {
                if(user === null) {
                    client.say(channel, `${tags.username} pluje na cały czat D: `);
                }
                else {
                    let { name } = user;
                    client.say(channel, `${tags.username} pluje na ${name} `);
                }
            })
        .catch(err => client.say(channel, `${tags.username} pluje na cały czat D: `));
        //client.say(channel, `@${tags.username}, pluje na cały czat D: `)
	}
});