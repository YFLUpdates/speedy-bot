import tmi from "tmi.js";
import express from "express";
import dotenv from "dotenv";
import { promises as fs } from 'fs';

import { HugCom, SpitCom, LoveCom, KogutCom, EwronCom, YFLCom, KtoCom, KissCom, MarryCom, IleYFLCom, Top3watchtimeCom, WiekCom } from "./commands/index.js";
import { watchtimeAll, watchtimeGet, checkTimeout, callWebhook, missingAll, missing } from "./functions/requests/index.js";
import { checkSemps, sempTime } from "./functions/semps/index.js";
import insertToDatabase from "./components/insertToDatabase.js";
import lastSeenUpdate from "./components/lastSeenUpdate.js";
import check_if_user_in_channel from "./functions/lewus/index.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
const joinThem = [ 'adrian1g__', 'grubamruwa', 'xspeedyq', 'dobrypt' ];
//const joinThem = [ '3xanax' ];
const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD
	},
	channels: joinThem
    //channels: ['3xanax']
});
// " 󠀀"
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
    "#3xanax": {
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
    res.json(
        { 
            message: "Bot successfully started",
            build_name: process.env.npm_package_name,
            version: process.env.npm_package_version,
            channels: joinThem
        }
    );
});

app.listen(PORT, () =>
  console.log(`API Server listening on port ${PORT}`)
);

lastSeenUpdate(joinThem);

setTimeout(() => {
    lastSeenUpdate(joinThem)
}, 30 * 60 * 1000);

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
    const cleanChannel = channel.replaceAll("#", "");
    const argumentClean = args[0] ? (args[0].replaceAll("@", "").toLowerCase()):(null)

	if(command === 'opluj') {
        if(channel === "#adrian1g__") return;

        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the argumentClean variable and passing it to the SpitCom function. */
        const commands = await SpitCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
        
	}else if(command === 'love'){
        if(channel === "#grubamruwa") return;

        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the argumentClean variable and passing it to the LoveCom function. */
        const commands = await LoveCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(command === 'kogut'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the argumentClean variable and passing it to the KogutCom function. */
        const commands = await KogutCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(command === 'ewroniarz' || command === 'ewron'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await EwronCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);


    }else if(command === 'yflwatchtime' || command === 'yfl'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the argumentClean variable and passing it to the YFLCom function. */
        const commands = await YFLCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(command === 'kto'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the message from the user and sending it to the ktoCom function. */
        const commands = await KtoCom(cleanChannel, tags.username, argumentClean, znaniUsers);

        client.say(channel, commands);

    }else if(command === 'kiss' || command === "calus"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the message from the user and sending it to the kissCom function. */
        const commands = await KissCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(command === "ksiezniczki" || command === "topdupeczki" || command === "topsemp"){
        if (cooldowns[channel].longer > (Date.now() - 15000)) {
            return;
        }
        cooldowns[channel].longer = Date.now();

        if(args[0] && args[0] !== " "){
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

        if(args[0]  && args[0] !== " "){
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

        if(args[0] && args[0] !== " "){
            const watchtime = await watchtimeAll(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, watchtime);
        }else{
            const watchtime = await watchtimeAll(tags.username.toLowerCase());

            client.say(channel, watchtime);
        }

    }else if(command === "watchtime" || command === "xayopl"){
        if(channel === "#xspeedyq" && command === "watchtime" || channel === "#grubamruwa" && command === "watchtime" || channel === "#dobrypt" && command === "watchtime") return;

        if (cooldowns[channel].longer > (Date.now() - 15000)) {
            return;
        }
        cooldowns[channel].longer = Date.now();

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

        const commands = await HugCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(command === 'slub' || command === "marry"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the argumentClean variable and passing it to the LoveCom function. */
        const commands = await MarryCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(command === 'ilejeszcze' || command === "wruc"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();


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

    }else if(command === 'missingall' || command === "ostatnioall"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        if(args[0] === " ") return;

        if(args[0]){
            const whereMissing = await missingAll(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, whereMissing);
        }

    }else if(command === 'missing' || command === "ostatnio" || command === "lastseen" || command === "kiedy"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        if(args[0] === " ") return;

        if(args[0]){
            const whereMissing = await missing(args[0].replaceAll("@", "").toLowerCase(), cleanChannel);

            client.say(channel, whereMissing);
        }

    }else if(command === 'ileyfl'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the message from the user and sending it to the ktoCom function. */
        const commands = await IleYFLCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(command === 'wiek' || command === "ilemamlat"){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the message from the user and sending it to the ktoCom function. */
        const commands = await WiekCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(command === 'top3' || command === 'top3watchtime'){
        if (cooldowns[channel].last > (Date.now() - 4000)) {
            return;
        }
        cooldowns[channel].last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await Top3watchtimeCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
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

        client.say(channel, `!hug, !opluj, !love, !ewron, !yfl, !kogut, !watchtimeall, !watchtime, !ileogladalkobiet, !ksiezniczki, !kiss, !kto, !gdzie, !ilejeszcze, !missing, !missingall... więcej na https://yfl.es/bot ok`);
    }

});