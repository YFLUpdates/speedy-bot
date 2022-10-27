import tmi from "tmi.js";
import express from "express";
import dotenv from "dotenv";
import { promises as fs } from 'fs';
import {getRandomChatter, Censor, randomNumber, checkEwron, who_is_watching_famous} from "./functions/index.js"

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

const znaniUsers = JSON.parse(await fs.readFile('./channels.json', 'UTF-8'));

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
            client.say(channel, `${tags.username} opluł ${Censor(args[0])} Spit `);
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
            client.say(channel, `${tags.username} kochasz ${Censor(args[0])} na ${randomNumber(0, 100)}% <3  `);
        }else{
            client.say(channel, `${tags.username} kochasz ${tags.username} na ${randomNumber(0, 100)}% <3  `);
        }
    }else if(command === 'kogut'){
        if (lastCommand > (Date.now() - 4000)) {
            return;
        }
        lastCommand = Date.now();

        if(args[0]){
            client.say(channel, `${tags.username} opierdolił(a) koguta ${Censor(args[0])} jasperGaleczka `);
        }else{
            await getRandomChatter(channel.replaceAll("#", ""), { skipList: [ tags.username ] })
            .then(user => {
                if(user === null) {
                    client.say(channel, `${tags.username} opierdolił(a) koguta xspeedyq jasperGaleczka `);
                }
                else {
                    let { name } = user;
                    client.say(channel, `${tags.username} opierdolił(a) koguta ${name} jasperGaleczka `);
                }
            })
            // .catch(err => console.log(err));
            .catch(err => client.say(channel, `${tags.username} opierdolił(a) koguta xspeedyq jasperGaleczka `));
        }
    }else if(command === 'ewroniarz' || command === 'ewron'){
        if (lastCommand > (Date.now() - 4000)) {
            return;
        }
        lastCommand = Date.now();

        //Kiedyś się zrobi switch okok
        if(args[0]){
            const ratio = await checkEwron(args[0].replaceAll("@", "").toLowerCase());

            if (ratio < 0.3){
                client.say(channel, `${Censor(args[0])} jest czysty(a) okok `);
            }else if(ratio < 0.5){
                client.say(channel, `${Censor(args[0])} jest widzem ewrona jasperSTARE`);
            }else if(ratio > 0.5){
                client.say(channel, `${Censor(args[0])} jest ultra zaklinowany(a) xddd`);
            }
        }else{
            const ratio = await checkEwron(tags.username.toLowerCase());

            if (ratio < 0.3){
                client.say(channel, `${tags.username} jesteś czysty(a) okok `);
            }else if(ratio < 0.5){
                client.say(channel, `${tags.username} jesteś widzem ewrona jasperSTARE`);
            }else if(ratio > 0.5){
                client.say(channel, `${tags.username} jesteś ultra zaklinowany(a) xddd`);
            }
        }
    }else if(command === 'kto'){
        const popularni = await who_is_watching_famous("xspeedyq", znaniUsers);
        let users = "";

        await Promise.all(
            popularni.map((i) => {
                users += i + ', '
            })
        )

        if(popularni.length === 0){
            return client.say(channel, `Nikt z listy nie oglada streama speediego jasperSad`);
        }

        if(users.length < 480 ){
            client.say(channel, `${users} oglada stream speediego ok`);
        }else{
            client.say(channel, `Speediego ogląda tyle osób, że nie da się ich wypisać na czat. Sadge`);
        }
    }
});