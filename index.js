import tmi from "tmi.js";
import express from "express";
import dotenv from "dotenv";
import { promises as fs } from 'fs';
import { getRandomChatter, Censor, randomNumber, whosFamous, ratioSwitch } from "./functions/index.js";
import { checkEwron, checkYFL, watchtimeAll, watchtimeGet, checkTimeout, callWebhook } from "./functions/requests/index.js";
import { checkSemps, sempTime } from "./functions/semps/index.js";
import insertToDatabase from "./components/insertToDatabase.js";
import check_if_user_in_channel from "./functions/lewus/index.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD
	},
	channels: [ 'adrian1g__', 'grubamruwa', 'xspeedyq', 'dobrypt' ]
    //channels: ['3xanax']
});

const znaniUsers = JSON.parse(await fs.readFile('./channels.json', 'UTF-8'));
const cooldowns = {
    "#adrian1g__": {
        last: 0,
        longer: 0
    },
    "#grubamruwa": {
        last: 0,
        longer: 0
    },
    "#xspeedyq": {
        last: 0,
        longer: 0
    },
    "#xspeedyq": {
        last: 0,
        longer: 0
    },
    "#dobrypt": {
        last: 0,
        longer: 0
    }
}

app.set('json spaces', 2);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "xspeedyq, adrian1g__, grubamruwa bot okok" });
});

app.listen(PORT, () =>
  console.log(`API Server listening on port ${PORT}`)
);

client.connect();

client.on("ban", (channel, username, reason, userstate) => {

    insertToDatabase("bans" , {
        user: username,
        channel: channel,
        channel_group: "YFL",
        action: 'ban'
    })

});

client.on("timeout", (channel, username, reason, duration, userstate) => {

    insertToDatabase("bans" , {
        user: username,
        channel: channel,
        channel_group: "YFL",
        action: 'timeout',
        duration: duration
    })
    
});

client.on('message', async (channel, tags, message, self) => {
	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	if(command === 'opluj') {
        if(channel === "#adrian1g__") return;

        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            client.say(channel, `${tags.username} opluł(a) ${Censor(args[0])} Spit `);
        }else{
            await getRandomChatter(channel.replaceAll("#", ""), { skipList: [ tags.username ] })
            .then(user => {
                if(user === null) {
                    client.say(channel, `${tags.username} pluje na cały czat D: `);
                }
                else {
                    let { name } = user;
                    client.say(channel, `${tags.username} opluł(a) ${name} Spit `);
                }
            })
            // .catch(err => console.log(err));
            .catch(err => client.say(channel, `${tags.username} pluje na cały czat D: `));
        }
        
	}else if(command === 'love'){
        if(channel === "#grubamruwa") return;

        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            client.say(channel, `${tags.username} kochasz ${Censor(args[0])} na ${randomNumber(0, 100)}% <3  `);
        }else{
            client.say(channel, `${tags.username} kochasz ${tags.username} na ${randomNumber(0, 100)}% <3  `);
        }

    }else if(command === 'kogut'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            client.say(channel, `${tags.username} opierdolił(a) koguta ${Censor(args[0])} jasperGaleczka `);
        }else{
            await getRandomChatter(channel.replaceAll("#", ""), { skipList: [ tags.username ] })
            .then(user => {
                if(user === null) {
                    client.say(channel, `${tags.username} opierdolił(a) koguta YFLUpdates Glumlenie `);
                }
                else {
                    let { name } = user;
                    client.say(channel, `${tags.username} opierdolił(a) koguta ${name} jasperGaleczka `);
                }
            })
            .catch(err => client.say(channel, `${tags.username} opierdolił(a) koguta YFLUpdates Glumlenie `));
        }

    }else if(command === 'ewroniarz' || command === 'ewron'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            const ratio = await checkEwron(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, `${Censor(args[0])} ${ratioSwitch.ewron(ratio)} `);
        }else{
            const ratio = await checkEwron(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.ewron(ratio)} `);
        }


    }else if(command === 'kto'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        const cleanChannel = channel.replaceAll("#", "");
        const popularni = await whosFamous(cleanChannel, znaniUsers);
        let users = "";

        await Promise.all(
            popularni.map((i) => {
                users += i + ', '
            })
        )

        if(popularni.length === 0){
            return client.say(channel, `Nikt z listy nie oglada streama ${cleanChannel} jasperSad`);
        }

        if(users.length < 480 ){
            client.say(channel, `${users} oglada stream ${cleanChannel} ok`);
        }else{
            client.say(channel, `${cleanChannel} ogląda tyle osób, że nie da się ich wypisać na czacie. Sadge`);
        }

    }else if(command === 'yflwatchtime' || command === 'yfl'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            const ratio = await checkYFL(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, `${Censor(args[0])} ${ratioSwitch.yfl(ratio)} `);
        }else{
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }

    }else if(command === 'kiss' || command === "calus"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            client.say(channel, `${tags.username} daje całusa ${Censor(args[0])} yoooo `);
        }else{
            await getRandomChatter(channel.replaceAll("#", ""), { skipList: [ tags.username ] })
            .then(user => {
                if(user === null) {
                    client.say(channel, `${tags.username} daje całusa YFLUpdates yoooo `);
                }
                else {
                    let { name } = user;
                    client.say(channel, `${tags.username} daje całusa ${name} yoooo `);
                }
            })
            // .catch(err => console.log(err));
            .catch(err => client.say(channel, `${tags.username} daje całusa YFLUpdates yoooo `));
        }
    }else if(command === "ksiezniczki" || command === "topdupeczki" || command === "topsemp"){
        if (cooldowns[channel].longer > (Date.now() - 15000)) {
            return;
        }
        cooldowns[channel].longer = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            const semps = await checkSemps(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, semps);
        }else{
            const semps = await checkSemps(tags.username.toLowerCase());

            client.say(channel, semps);
        }

    }else if(command === "ileogladalkobiet" || command === "semp"){
        if (cooldowns[channel].longer > (Date.now() - 15000)) {
            return;
        }
        cooldowns[channel].longer = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            const semps = await sempTime(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, semps);
        }else{
            const semps = await sempTime(tags.username.toLowerCase());

            client.say(channel, semps);
        }

    }else if(command === "watchtimeall"){
        if (cooldowns[channel].longer > (Date.now() - 15000)) {
            return;
        }
        cooldowns[channel].longer = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            const watchtime = await watchtimeAll(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, watchtime);
        }else{
            const watchtime = await watchtimeAll(tags.username.toLowerCase());

            client.say(channel, watchtime);
        }

    }else if(command === "watchtime" || command === "xayopl"){
        if(channel === "#xspeedyq" || channel === "#grubamruwa") return;

        if (cooldowns[channel].longer > (Date.now() - 15000)) {
            return;
        }
        cooldowns[channel].longer = Date.now();

        const cleanChannel = channel.toLowerCase().replaceAll("#", "")
        if(args[0] === " "){
            //User requests his: Current channel on watchtime
            const watchtimeFunc = await watchtimeGet(tags.username.toLowerCase(), cleanChannel);

            client.say(channel, watchtimeFunc);

        }else if(args[0]){

             if(args[1]){
                //User requests: User X a watchtime on selected channel
                const watchtimeFunc = await watchtimeGet(args[0].replaceAll("@", "").toLowerCase(), args[1].replaceAll("@", "").toLowerCase());

                client.say(channel, watchtimeFunc);
             }else{
                //User requests: User X a watchtime on current channel
                const watchtimeFunc = await watchtimeGet(args[0].replaceAll("@", "").toLowerCase(), cleanChannel);

                client.say(channel, watchtimeFunc);
             }

        }else{
            //User requests his: Current channel on watchtime
            const watchtimeFunc = await watchtimeGet(tags.username.toLowerCase(), cleanChannel);

            client.say(channel, watchtimeFunc);
        }

    }else if(command === 'gdzie' || command === 'przesladowanie' || command === "where"){
        if (cooldowns[channel].longer > (Date.now() - 15000)) {
            return;
        }
        cooldowns[channel].longer = Date.now();

        if(args[0] === " "){
            const where = await check_if_user_in_channel(tags.username.toLowerCase());

            client.say(channel, where);
        }else if(args[0]){
            const where = await check_if_user_in_channel(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, where);
        }else{
            const where = await check_if_user_in_channel(tags.username.toLowerCase());

            client.say(channel, where);
        }

    }else if(command === 'hug' || command === "przytul"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        if(args[0] === " "){
            const ratio = await checkYFL(tags.username.toLowerCase());

            client.say(channel, `${tags.username} ${ratioSwitch.yfl(ratio)} `);
        }else if(args[0]){
            client.say(channel, `${tags.username} przytula ${Censor(args[0])} jasperKiss `);
        }else{
            await getRandomChatter(channel.replaceAll("#", ""), { skipList: [ tags.username ] })
            .then(user => {
                if(user === null) {
                    client.say(channel, `${tags.username} przytula YFLUpdates jasperKiss `);
                }
                else {
                    let { name } = user;
                    client.say(channel, `${tags.username} przytula ${name} jasperKiss `);
                }
            })
            // .catch(err => console.log(err));
            .catch(err => client.say(channel, `${tags.username} przytula YFLUpdates jasperKiss `));
        }

    }else if(command === 'ilejeszcze' || command === "wruc"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        const cleanChannel = channel.replaceAll("#", "");

        if(args[0] === " "){
            const whenEnds = await checkTimeout(tags.username.toLowerCase(), cleanChannel);

            client.say(channel, whenEnds);
        }else if(args[0]){
            const whenEnds = await checkTimeout(args[0].replaceAll("@", "").toLowerCase(), cleanChannel);

            client.say(channel, whenEnds);
        }else{
            const whenEnds = await checkTimeout(tags.username.toLowerCase(), cleanChannel);

            client.say(channel, whenEnds);
        }

    }else if(command === 'dodajznany'){
        if (cooldowns[channel].longer > (Date.now() - 7000)) {
            return;
        }
        cooldowns[channel].longer = Date.now();

        if(args[0] === " ") return;
        
        if(args[0]){
            callWebhook(args[0])

            client.say(channel, `${tags.username} zapisane ok`);
        }

    }else if(command === "help"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        client.say(channel, `!hug, !opluj, !love, !ewron, !yfl, !kogut, !watchtimeall, !watchtime, !ileogladalkobiet, !ksiezniczki, !kiss, !kto, !gdzie, !ilejeszcze okok Opisane na https://yfl.es/bot`);
    }

});