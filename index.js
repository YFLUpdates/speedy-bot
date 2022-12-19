import tmi from "tmi.js";
import express from "express";
import dotenv from "dotenv";
import { promises as fs } from 'fs';

import {top5msgs, msgsCom, LoveCom, KtoCom, MarryCom, IleYFLCom, Top3watchtimeCom, WiekCom, 
    FivecityCom, ZjebCom, MogemodaCom, KamerkiCom, AODCom, SzwalniaCom, OfflinetimeCom, pointsCom, PogodaCom, ChattersCom, checkBlacklistCom} from "./commands/index.js";
import { watchtimeAll, watchtimeGet, checkTimeout, missingAll, missing, duelsWorking, getPoints, getWatchtime, getChatters } from "./functions/requests/index.js";
import {insertToDatabase, lastSeenUpdate, getMeCooldowns, getSubsPoints, getMultipleRandom} from "./components/index.js";
import { RollOrMark, checkFan } from "./commands/templates/index.js";
import { Truncate, topN, onlySpaces, getRandomChatter } from "./functions/index.js";
import { checkSemps, sempTime } from "./functions/semps/index.js";
import check_if_user_in_channel from "./functions/lewus/index.js";
import {registerToBL} from "./functions/yfles/index.js";
import subInsert from "./database/subInsert.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
const joinThem = [ 'adrian1g__', 'grubamruwa', 'xspeedyq', 'dobrypt', 'mrdzinold', "xmerghani", "xkaleson", "neexcsgo", "banduracartel", "sl3dziv", "xmevron" ];
//const joinThem = [ '3xanax' ];
let newOrder = 0;
const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD
	},
	channels: joinThem
});

const znaniUsers = JSON.parse(await fs.readFile('./channels.json', 'UTF-8'));
const bad_words = JSON.parse(await fs.readFile('./bad_words.json', 'UTF-8'));
const channels_data = JSON.parse(await fs.readFile('./channels_data.json', 'UTF-8'));
const commands = JSON.parse(await fs.readFile('./commands.json', 'UTF-8')).commands;

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

app.get("/jwt/:id", (req, res) => {
    if(!req.params && !req.params.id) return res.status(500).json({ status: 500, message: "channel is missing" });
    if(channels_data["#"+req.params.id]){
        res.status(200).json(channels_data["#"+req.params.id].watchtime_top);
    }else{
        res.status(404).json({status: 404, message: "channel not found" })
    }
});

app.post("/orders/take", async (req, res) => {
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    if(req.headers.id !== process.env.BOT_ID && req.headers.token !== process.env.TOKEN){
        return res.status(401).send({
            message: "Unauthorized. Invalid token!"
        });
    }

    res.status(200).send({
        message: "Success"
    });

    if (newOrder > (Date.now() - 30 * 60 * 1000)) {
        return;
    }
    newOrder = Date.now();

    const randomUser = await getRandomChatter("adrian1g__", { skipList: [ "adrian1g__" ] })
    .then(user => {
        if(user === null) return null;
        let { name } = user;

        return name;
    })
    .catch(err => {
        return null; 
    });
    if(randomUser === null) return;

    client.say("#adrian1g__", `${randomUser} zamówił ${req.body.product.replace(/\b(\w{2})\w+(\w)\b/g, '$1**$2')} w liczbie x${req.body.amount} sztuk jasperVixa`);
});

app.use((req, res, next) => {
  res.status(404).json({
    message: `Route ${req.method}:${req.url} not found`,
    error: "Not Found",
    statusCode: 404
  })
})

app.listen(PORT, () =>
  console.log(`API Server listening on port ${PORT}`)
);

setInterval(() => {
    lastSeenUpdate(joinThem)
}, 10 * 60 * 1000);

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

client.on("subscription", (channel, username, method, message, userstate) => {
    if(["#xmerghani", "#mrdzinold", "#mork","#banduracartel"].includes(channel)) return;
    
    const cleanChannel = channel.replaceAll("#", "");

    subInsert(username.toLowerCase(), {
        channel: cleanChannel,
        date: new Date().toJSON().slice(0, 19).replace('T', ' '),
        points: 250*getSubsPoints(method)
    })
    // Do your stuff.
    
    client.say(channel, `${username.toLowerCase()}, darmowe 250 punktów dodane catJAM`);
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
    if(["#xmerghani", "#mrdzinold", "#mork","#banduracartel"].includes(channel)) return;
    
    const cleanChannel = channel.replaceAll("#", "");

    subInsert(username.toLowerCase(), {
        channel: cleanChannel,
        date: new Date().toJSON().slice(0, 19).replace('T', ' '),
        points: 250*getSubsPoints(methods)
    })
    // Do your stuff.
    
    client.say(channel, `${username.toLowerCase()}, darmowe 250 punktów dodane catJAM`);
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    if(["#xmerghani", "#mrdzinold", "#mork", "#banduracartel"].includes(channel)) return;

    const cleanChannel = channel.replaceAll("#", "");
    let senderCount = ~~userstate["msg-param-sender-count"];

    subInsert(username.toLowerCase(), {
        channel: cleanChannel,
        date: new Date().toJSON().slice(0, 19).replace('T', ' '),
        points: 250*getSubsPoints(methods)
    })

    client.say(channel, `${username.toLowerCase()}, darmowe 250 punktów dodane catJAM`);
});

client.on('message', async (channel, tags, message, self) => {
	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();
    const cleanChannel = channel.replaceAll("#", "");
    const argumentClean = args[0] ? (args[0].replaceAll("@", "").toLowerCase()):(null)

    if(bad_words.includes(args[0]) || bad_words.includes(args[1])) return;

	if(commands.opluj.aliases.includes(command)) {
        if(commands.opluj.disabled.includes(cleanChannel)) return;
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel)[`${commands.opluj.cooldown}`])) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.opluj.messages);

        client.say(channel, template);
        
	}else if(commands.kogut.aliases.includes(command)) {
        if(commands.kogut.disabled.includes(cleanChannel)) return;
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel)[`${commands.kogut.cooldown}`])) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.kogut.messages);

        client.say(channel, template);
        
	}else if(commands.przytul.aliases.includes(command)) {
        if(commands.przytul.disabled.includes(cleanChannel)) return;
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel)[`${commands.przytul.cooldown}`])) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.przytul.messages);

        client.say(channel, template);
        
	}else if(commands.zaprasza.aliases.includes(command)) {
        if(commands.zaprasza.disabled.includes(cleanChannel)) return;
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel)[`${commands.zaprasza.cooldown}`])) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.zaprasza.messages);

        client.say(channel, template);
        
	}else if(commands.kiss.aliases.includes(command)) {
        if(commands.kiss.disabled.includes(cleanChannel)) return;
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel)[`${commands.kiss.cooldown}`])) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.kiss.messages);

        client.say(channel, template);
        
	}else if(commands.yfl.aliases.includes(command)) {
        const COMMAND = commands.yfl;
        if(COMMAND.disabled.includes(cleanChannel)) return;
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel)[`${COMMAND.cooldown}`])) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules[`${COMMAND.name}`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const template = await checkFan(cleanChannel, tags.username, argumentClean, COMMAND.messages, COMMAND.associated_channels, COMMAND.name);

        client.say(channel, template);
        
	}else if(commands.ewron.aliases.includes(command)) {
        const COMMAND = commands.ewron;
        if(COMMAND.disabled.includes(cleanChannel)) return;
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel)[`${COMMAND.cooldown}`])) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules[`${COMMAND.name}`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const template = await checkFan(cleanChannel, tags.username, argumentClean, COMMAND.messages, COMMAND.associated_channels, COMMAND.name);

        client.say(channel, template);
        
	}else if(commands.grendy.aliases.includes(command)) {
        const COMMAND = commands.grendy;
        if(COMMAND.disabled.includes(cleanChannel)) return;
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel)[`${COMMAND.cooldown}`])) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules[`${COMMAND.name}`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const template = await checkFan(cleanChannel, tags.username, argumentClean, COMMAND.messages, COMMAND.associated_channels, COMMAND.name);

        client.say(channel, template);
        
	}else if(commands.resp.aliases.includes(command)) {
        const COMMAND = commands.resp;
        if(COMMAND.disabled.includes(cleanChannel)) return;
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel)[`${COMMAND.cooldown}`])) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules[`${COMMAND.name}`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const template = await checkFan(cleanChannel, tags.username, argumentClean, COMMAND.messages, COMMAND.associated_channels, COMMAND.name);

        client.say(channel, template);
        
	}else if(["love"].includes(command)){
        if(["#grubamruwa", "#xmerghani"].includes(channel)) return;
        
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the LoveCom function. */
        const commands = await LoveCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["kto"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        /* Taking the message from the user and sending it to the ktoCom function. */
        const commands = await KtoCom(cleanChannel, tags.username, argumentClean, znaniUsers);

        client.say(channel, commands);

    }else if(["ksiezniczki", "topdupeczki", "topsemp"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules["ksiezniczki"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        if(args[0] && args[0].length > 3){
            const semps = await checkSemps(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, semps);
        }else{
            const semps = await checkSemps(tags.username.toLowerCase());

            client.say(channel, semps);
        }

    }else if(["semp", "ileogladalkobiet"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules["ileogladalkobiet"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        if(args[0]  && args[0].length > 3){
            const semps = await sempTime(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, semps);
        }else{
            const semps = await sempTime(tags.username.toLowerCase());

            client.say(channel, semps);
        }

    }else if(["watchtimeall"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules["watchtimeall"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

    
        if(args[0] && args[0].length > 3){
            const watchtime = await watchtimeAll(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, watchtime);
        }else{
            const watchtime = await watchtimeAll(tags.username.toLowerCase());

            client.say(channel, watchtime);
        }

    }else if(["watchtime", "xayopl"].includes(command)){
        if(["#xspeedyq", "#grubamruwa", "#dobrypt", "#mrdzinold", "#xmerghani", "#xkaleson", "#neexcsgo", "#banduracartel"].includes(channel) && command === "watchtime") return;

        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules["watchtime"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);


        if(args[0] && args[0].length > 3){

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

    }else if(["gdzie", "przesladowanie", "where"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(args[0] && args[0].length > 3){
            const where = await check_if_user_in_channel(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, where);
        }else{
            const where = await check_if_user_in_channel(tags.username.toLowerCase());

            client.say(channel, where);
        }

    }else if(["marry", "slub"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the LoveCom function. */
        const commands = await MarryCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["wruc", "ilejeszcze"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(args[0] && args[0].length > 3){
            const whenEnds = await checkTimeout(args[0].replaceAll("@", "").toLowerCase(), cleanChannel);

            client.say(channel, whenEnds);
        }else{
            const whenEnds = await checkTimeout(tags.username.toLowerCase(), cleanChannel);

            client.say(channel, whenEnds);
        }

    }else if(["missingall", "ostatnioall", "kiedyall"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules["missingall"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        if(!args[0] || args[0] && args[0].length < 3) return;

        if(args[0]){
            const whereMissing = await missingAll(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, whereMissing);
        }

    }else if(["wiadomosci", "messsages", "msgs"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules["msgs"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const tempalte = await msgsCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, tempalte);

    }else if(["topmsgs", "top5msgs"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules["topmsgs"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const tempalte = await top5msgs(cleanChannel, tags.username, argumentClean);

        client.say(channel, tempalte);

    }else if(["missing", "ostatnio", "lastseen", "kiedy"].includes(command)){
        if(["#mrdzinold", "#xmerghani", "#mork", "#banduracartel"].includes(channel)) return;

        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(args[0].length < 3) return client.say(channel, `${tags.username}, zapomniałeś/aś podać nick aok`);

        if(args[0]){
            const whereMissing = await missing(args[0].replaceAll("@", "").toLowerCase(), cleanChannel);

            client.say(channel, whereMissing);
        }

    }else if(["ilemamlat", "wiek"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(channels_data[channel].modules["wiek"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        /* Taking the message from the user and sending it to the ktoCom function. */
        const commands = await WiekCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["top3", "top3watchtime"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(channels_data[channel].modules["top3"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await Top3watchtimeCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["fivecity", "5city"].includes(command)){
        if (channels_data[channel].cooldowns.special > (Date.now() - getMeCooldowns(channel).special)) {
            return;
        }
        channels_data[channel].cooldowns.special = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await FivecityCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["aod"].includes(command)){
        if (channels_data[channel].cooldowns.special > (Date.now() - getMeCooldowns(channel).special)) {
            return;
        }
        channels_data[channel].cooldowns.special = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await AODCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["szwalnia", "gangmoderacji"].includes(command)){
        if (channels_data[channel].cooldowns.special > (Date.now() - getMeCooldowns(channel).special)) {
            return;
        }
        channels_data[channel].cooldowns.special = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await SzwalniaCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["czyjestemzjebem"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(channels_data[channel].modules["czyjestemzjebem"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await ZjebCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["pogoda", "weather"].includes(command)){
        if(!argumentClean || onlySpaces(argumentClean)) return;
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(channels_data[channel].modules["pogoda"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await PogodaCom(cleanChannel, tags.username, argumentClean);

        if(commands === null) return;
        
        client.say(channel, commands);
    }else if(["mogemoda", "szansanamoda"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(channels_data[channel].modules["mogemoda"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await MogemodaCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["kamerki"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await KamerkiCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["timeoffline", "offlinetime", "offtime"].includes(command)){
        if(["#mrdzinold", "#xmerghani", "#mork", "#banduracartel"].includes(channel)) return;
        
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await OfflinetimeCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["duel"].includes(command)){
        if(["#mrdzinold", "#xmerghani", "#mork", "#neexcsgo", "#banduracartel"].includes(channel)) return;
        if(channels_data[channel].modules["duels"] === false) return client.say(channel, `${tags.username}, pojedynki są wyłączone `);

        const cleanSender = tags.username.toLowerCase();
        const points = await getPoints(cleanSender, cleanChannel);
        const duels = channels_data[channel].duels_list;

        if(["accept", "akceptuje"].includes(argumentClean)){

            /* Checking if the user has provided a second argument. */
            if(!args[1]) return client.say(channel, `${cleanSender}, zapomniałeś podać osobe TPFufun `);

            const cleanAgainst = args[1].replaceAll("@", "").toLowerCase();
            const duel_info = duels.find(x => x.id === `${cleanAgainst}-${cleanSender}`);

            /* Checking if the duel exists. */
            if(!duel_info) return client.say(channel, `${cleanSender}, taki pojedynek nie istnieje :/ `);

            /* Finding the index of the duel in the duels array. */
            const indexOfObject = duels.findIndex(object => {
                return object.id === duel_info.id;
            });
            const pointsSender = await getPoints(cleanSender, cleanChannel);

            /* Checking if the sender has enough points to duel. */
            if(duel_info.points > points && duel_info.points > pointsSender) {
                duels.splice(indexOfObject, 1);
                
                return client.say(channel, `${cleanSender}, brakuje ci punktów VoHiYo `);
            }

            if(duel_info.expires < new Date()){

                duels.splice(indexOfObject, 1);

                return client.say(channel, `${cleanSender}, pojedynek wygasł :( `);
            }else{
                const pointsRequester = await getPoints(duel_info.user, cleanChannel);
                if(duel_info.points > pointsRequester) {
                    duels.splice(indexOfObject, 1);
                    
                    return client.say(channel, `${duel_info.user}, nie ma już punktów VoHiYo `);
                }
                
                duels.splice(indexOfObject, 1);

                const command = await duelsWorking(cleanChannel, duel_info.user, duel_info.invited, duel_info.points);

                return client.say(channel, command)
            }

        }else if(["list", "lista"].includes(argumentClean)){
            if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
                return;
            }
            channels_data[channel].cooldowns.longer = Date.now();

            const makeText = Truncate(duels.map((i) => i.id).join(", "), 200);

            client.say(channel, `Aktualne pojedynki: ${makeText.length === 0 ? ("Brak"):makeText}`);

        }else{
            if (channels_data[channel].cooldowns.duels > (Date.now() - getMeCooldowns(channel).longer)) {
                return;
            }
            channels_data[channel].cooldowns.duels = Date.now();

            /* Checking if the argument is clean. If it is not clean, it will return the client.say functione. */
            if(!argumentClean || argumentClean === cleanSender) return client.say(channel, `${cleanSender}, zapomniałeś podać osobe TPFufun `);

            /* Checking if the user has provided a number as the second argument. */
            if(!args[1] || !Number.isInteger(Number(args[1])) || Number(args[1]) === 0 || Number.isInteger(Number(args[1])) && Number(args[1]) < 0) return client.say(channel, `${cleanSender}, zapomniałeś podać kwote :| `);

            /* Checking if the user has enough points to bet. */
            if(Number(args[1]) > points) return client.say(channel, `${cleanSender} nie masz tylu punktów aha`);

            if(duels.some(obj => obj.id === `${cleanSender}-${argumentClean}`)) return client.say(channel, `${cleanSender} taki pojedynek już istnieje TOPILNE `);

            duels.push({
                id: `${cleanSender}-${argumentClean}`,
                user: cleanSender,
                invited: argumentClean,
                points: Number(args[1]),
                expires: new Date(+new Date() + 60000*2)
            })

            client.say(channel, `${argumentClean}, jeśli akceptujesz pojedynek na kwotę ${Number(args[1])} punktów, wpisz !duel accept ${cleanSender}`)
        }

    }else if(["joinwatchtime", "jwt"].includes(command)){
        if(["#mrdzinold", "#xmerghani", "#banduracartel"].includes(channel)) return;

        const badges = tags.badges || {};
        const isBroadcaster = badges.broadcaster;
        const isMod = badges.moderator;
        const isModUp = isBroadcaster || isMod;
        
        const username = tags.username.toLowerCase();

        if(argumentClean === "start" && isModUp || argumentClean === "start" && username === "3xanax"){

            channels_data[channel].watchtime_top = [];
            
            channels_data[channel].modules["jwt"] = true;

            client.say(channel, `${username}, dołączanie do watchtimu włączone Chatters !jwt `)
        }else if(argumentClean === "stop" && isModUp || argumentClean === "stop" && username === "3xanax"){
            channels_data[channel].modules["jwt"] = false;

            client.say(channel, `${username}, dołączanie do watchtimu wyłączone ok aby wybrać osoby z największym watchtimem !jwt count`);
        }else if(argumentClean === "count" && isModUp || argumentClean === "count" && username === "3xanax" ){
            if(channels_data[channel].modules["jwt"] === true) return client.say(channel, `${username}, najpierw musisz wyłączyć dołączanie !jwt stop `);

            if(channels_data[channel].watchtime_top.length < 5) return client.say(channel, `${username}, brakuje osób do losowania min. 5 `);

            const top5 = topN(channels_data[channel].watchtime_top, 5);

            client.say(channel, `${username}, najwięcej watchtimu mają: ${top5.map((list) => list.name).join(", ")}`);
        }else{
            const check_for_duplicate = channels_data[channel].watchtime_top.find(x => x.name === username);
            
            /* Checking if the duel exists. */
            if(check_for_duplicate !== undefined) return;

            if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
                return;
            }
            channels_data[channel].cooldowns.last = Date.now();

            if(channels_data[channel].modules["jwt"] === false) return client.say(channel, `${username}, moduł wyłączony `);

            const watchtime = await getWatchtime(username, cleanChannel);

            const check_for_duplicate2 = channels_data[channel].watchtime_top.find(x => x.name === username);

            if(check_for_duplicate2 !== undefined) return;

            channels_data[channel].watchtime_top.push({
                name: username,
                count: watchtime
            })

            client.say(channel, `${username}, zapisano do listy watchtime`);
        }

    }else if(["yflpoints", "punkty", "points"].includes(command)){
        if(["#mrdzinold", "#xmerghani", "#mork", "#banduracartel"].includes(channel) || ["#xspeedyq", "#neexcsgo", "#sl3dziv"].includes(channel) && command === "points") return;
        
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await pointsCom(cleanChannel, tags.username, argumentClean, args);

        client.say(channel, commands);
    }else if(["module", "modules"].includes(command)){
        const badges = tags.badges || {};
        const isBroadcaster = badges.broadcaster;
        const isMod = badges.moderator;
        const isModUp = isBroadcaster || isMod;

        if(isModUp || tags.username === "3xanax"){
            if(!args[0]) return client.say(channel, `${tags.username}, enable/disable `);

            if(args[0] === "enable"){
                if(!args[1]) return client.say(channel, `${tags.username}, zapomniałeś podać nazwę modułu `);
    
                if(args[1] === "duels") {
                    channels_data[channel].duels_list = [];
                }
                
                channels_data[channel].modules[`${args[1]}`] = true;
    
                client.say(channel, `${tags.username}, włączyłeś moduł ${args[1]}`)
            }else if(args[0] === "disable"){
                if(!args[1]) return client.say(channel, `${tags.username}, zapomniałeś podać nazwę modułu `);
    
                if(args[1] === "duels") {
                    channels_data[channel].duels_list = [];
                }

                channels_data[channel].modules[`${args[1]}`] = false;
    
                client.say(channel, `${tags.username}, wyłączyłeś moduł ${args[1]}`)
            }else if(args[0] === "list"){
                client.say(channel, `${tags.username}, wszystkie dostępne moduły: topmsgs, msgs, duel, mogemoda, czyjestemzjebem, top3, wiek, missingall, watchtime, watchtimeall, ileogladalkobiet, ksiezniczki, yfl, ewron, pogoda `)
            }else if(args[0] === "clearduels"){
                channels_data[channel].duels_list = [];

                client.say(channel, `${tags.username}, wyczyściłeś wszystkie duele `)
            }
        }

    }else if(["giveaway", "gw"].includes(command)){
        if(["#mrdzinold", "#xmerghani", "#mork", "#banduracartel"].includes(channel)) return;

        const badges = tags.badges || {};
        const isBroadcaster = badges.broadcaster;
        const isMod = badges.moderator;
        const isModUp = isBroadcaster || isMod;

        if(isModUp || tags.username === "3xanax"){
            if(args[0] === "one"){
                const chatters = await getChatters(cleanChannel);
                const rolled = getMultipleRandom(chatters, 1);

                subInsert(rolled[0].name, {
                    channel: cleanChannel,
                    date: new Date().toJSON().slice(0, 19).replace('T', ' '),
                    points: 800
                })

                client.say(channel,  `jasperSkupienie LOSOWANIE WYGRYWA...`);

                setTimeout(() => {
                    client.say(channel,  `Gratulacje ${rolled[0].name} wygrałeś darmowe 800 punktów BRUHBRUH FIRE `);
                }, 2000);


            }else if(args[0] === "multi"){
                const chatters = await getChatters(cleanChannel);
                if(chatters.length < 5) return client.say(channel,  `${tags.username}, na kanale jest za mało osób aha`);
                const rolled = getMultipleRandom(chatters, 5);
                let winners = "";

                client.say(channel,  `jasperSkupienie LOSOWANIE WYGRYWAJA...`);

                await Promise.all(
                    rolled.map(async (i) => {
                        winners += i.name + ', ';

                        subInsert(i.name, {
                            channel: cleanChannel,
                            date: new Date().toJSON().slice(0, 19).replace('T', ' '),
                            points: 160
                        })
                    })
                );

                setTimeout(() => {
                    client.say(channel,  `Gratulacje ${winners} wygraliście darmowe 160 punktów BRUHBRUH FIRE `);
                }, 2000);

            }else{

                client.say(channel, `${tags.username}, nie znany rodzaj - one/multi`);
            }
        }

    }else if(["help", "commands", "komendy", "pomoc"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        client.say(channel, `!hug, !opluj, !ewron, !yfl, !kogut, !watchtimeall, !watchtime, !ileogladalkobiet, !ksiezniczki, !kto, !gdzie, !ilejeszcze, !missing i wiele więcej na https://yfl.es/bot ok`);
    }else if(["chatters"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await ChattersCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["zjeb", "blacklist"].includes(command)){
        const badges = tags.badges || {};
        const isBroadcaster = badges.broadcaster;
        const isMod = badges.moderator;
        const isVip = badges.vip;
        const isModUp = isBroadcaster || isMod || isVip;

        if(argumentClean === "mark" && (isModUp || tags.username === "3xanax")){
            const argumentClean2 = args[1].replaceAll("@", "").toLowerCase();

            if(argumentClean2 && argumentClean2.length > 3){
                const register = await registerToBL(argumentClean2, {mark: true, registrator: tags.username});
                if(register === null) return client.say(channel, `${tags.username}, nie udało się zarejestrować zjeba jasperSad  `);;

                client.say(channel, `${tags.username}, zarejestrowałeś ${argumentClean2}, jako zjeba aok`);
                return;
            }

            client.say(channel, `${tags.username}, zapomniałeś podać osobe aok`);

        }else if(argumentClean && argumentClean.length > 3){
            if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {return;}
            channels_data[channel].cooldowns.last = Date.now();
            if(channels_data[channel].modules["zjeb"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

            const command = await checkBlacklistCom(argumentClean);

            client.say(channel, command);
        }else{
            if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {return;}
            channels_data[channel].cooldowns.last = Date.now();
            if(channels_data[channel].modules["zjeb"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

            const command = await checkBlacklistCom(tags.username.toLowerCase());

            client.say(channel, command);
        }
    }

});