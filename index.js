import tmi from "tmi.js";
import express from "express";
import dotenv from "dotenv";
import getRandomChatter from "./functions/getRandomChatter.js";
import randomNumber from "./functions/randomNumber.js";
import censor from "./functions/Censor.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
let lastCommand = 0;
const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD
	},
	channels: [ 'xspeedyq' ]
});

app.set('json spaces', 2);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "xspeedyq.yfl.es" });
});

app.listen(PORT, () =>
  console.log(`API Server listening on port ${PORT}`)
);

client.connect();

client.on('message', async (channel, tags, message, self) => {
	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	if(command === 'opluj') {
        if (lastCommand > (Date.now() - 4000)) {
            return;
        }
        lastCommand = Date.now();

        if(args[0]){
            client.say(channel, `${tags.username} opluł ${censor(args[0])} Spit `);
        }else{
            await getRandomChatter(channel.replaceAll("#", ""), { skipList: [ tags.username ] })
            .then(user => {
                if(user === null) {
                    client.say(channel, `${tags.username} pluje na cały czat D: `);
                }
                else {
                    let { name } = user;
                    client.say(channel, `${tags.username} opluł ${name} Spit `);
                }
            })
            // .catch(err => console.log(err));
            .catch(err => client.say(channel, `${tags.username} pluje na cały czat D: `));
        }
        
	}else if(command === 'love'){
        if (lastCommand > (Date.now() - 4000)) {
            return;
        }
        lastCommand = Date.now();

        if(args[0]){
            client.say(channel, `${tags.username} kochasz ${censor(args[0])} na ${randomNumber(0, 100)}% <3  `);
        }else{
            client.say(channel, `${tags.username} kochasz ${tags.username} na ${randomNumber(0, 100)}% <3  `);
        }
    }
});