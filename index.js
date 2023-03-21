import tmi from "tmi.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import {top5msgs, msgsCom, LoveCom, KtoCom, MarryCom, WiekCom, ZjebCom, MogemodaCom, KamerkiCom, AODCom, OfflinetimeCom, pointsCom, PogodaCom, ChattersCom, checkBlacklistCom, fiveM} from "./commands/index.js";
import { checkTimeout, missingAll, missing, duelsWorking, getPoints, getChatters } from "./functions/requests/index.js";
import {insertToDatabase, lastSeenUpdate, getMeCooldowns, getSubsPoints, getMultipleRandom, waitforme} from "./components/index.js";
import { RollOrMark, checkFan } from "./commands/templates/index.js";
import { Truncate, onlySpaces } from "./functions/index.js";
import check_if_user_in_channel from "./functions/lewus/index.js";
import {registerDiscord, registerToBL, removeFromBL, todayBans} from "./functions/yfles/index.js";
import {oddMessage, dataFromFiles} from "./returns/index.js";
import subInsert from "./database/subInsert.js";
import SelectStreams from "./components/SelectStreams.js";

import {rollWinColor} from "./components/gamble/index.js";
import {rollDice} from "./components/dice/index.js";
import gambleUpdate from "./functions/yfles/gambleUpdate.js";
import {emojiColor, multiplyColor} from "./functions/gamble/index.js";
import {multiplyDice} from "./functions/dice/index.js";
import twitchlogger from "./commands/watchtime/twitchlogger.js";
import twitchloggerTOP3 from "./commands/top3/twitchlogger.js";
import ksiezniczki from "./commands/ksiezniczki.js";
import ileogladalkobiet from "./commands/ileogladalkobiet.js";
import watchtimeall from "./commands/watchtimeall.js";
import bmcSuby from "./requests/minecraft/bmcSuby.js";
import censorGrubamruwa from "./functions/censor/grubamruwa.js";
import detectCooldown from "./returns/detectCooldown.js";
import getPrices from "./components/tiktok/getPrices.js";
import alertName from "./components/tiktok/alertName.js";

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://overlay.kochamfortnite.pl"
    }
});
const PORT = process.env.PORT || 3000;
const joinThem = [ 'adrian1g__', 'grubamruwa', 'xspeedyq', 'dobrycsgo', 'mrdzinold', "xmerghani", "xkaleson", "neexcsgo", "banduracartel", "sl3dziv", "xmevron", "shavskyyy", "grabyyolo", "tuszol", "1wron3k", "mejnyy" ];
//const joinThem = [ '3xanax' ];
const message_number_to_trigger_odd = 3;
const message_number_to_clear_odd = 6;

let adrian1g_keyword = null;
let adrian1g_giveaway_list = [];
let adrian1g_giveaywa_timer = 0;
let tiktokCD = 0;

let streams = {
  last_update: new Date(),
  streams: []
};

const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD
	},
	channels: joinThem
});

const znaniUsers = await dataFromFiles("./channels.json");
const bad_words = await dataFromFiles("./bad_words.json");
const channels_data = await dataFromFiles("./channels_data.json");
const commands_list = await dataFromFiles("./commands.json");
const commands = commands_list.commands;

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

app.get("/streams", (req, res) => {
  res.json(streams);
});

app.get("/giveaway", (req, res) => {
    res.json({
        keyword: `!${adrian1g_keyword}`,
        data: adrian1g_giveaway_list
    });
});

app.use((req, res, next) => {
  res.status(404).json({
    message: `Route ${req.method}:${req.url} not found`,
    error: "Not Found",
    statusCode: 404
  })
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // socket.on('register-alert', (msg) => {
    //     io.emit('new-alert', {
    //         user_login: "adrian1g__",
    //         amount: "5",
    //         type: "coffe"
    //     });
    // });
});

server.listen(PORT, () =>
  console.log(`API Server listening on port ${PORT}`)
);

setInterval(() => {
    lastSeenUpdate(joinThem)
}, 10 * 60 * 1000);

setInterval(async () => {
    const getSelected = await SelectStreams();

    if(getSelected === null){
        return;
    }

    streams = getSelected;
}, 3.5 * 60 * 1000);

setTimeout(async () => {
    const getSelected = await SelectStreams();

    if(getSelected === null){
        return;
    }

    streams = getSelected;
}, 1000);

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

    subInsert(username.toLowerCase(), {
        channel: cleanChannel,
        date: new Date().toJSON().slice(0, 19).replace('T', ' '),
        points: 250*getSubsPoints(methods)
    })

    client.say(channel, `${username.toLowerCase()}, darmowe 250 punktów dodane catJAM`);
});

client.on('message', async (channel, tags, message, self) => {
    if(channel === "#grubamruwa"){
        const censorCheck = censorGrubamruwa(message.split(" "));
        if(censorCheck === true){
            return client.say(channel, `!terminate ${tags.username}`);
        }
    }

	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();
    const cleanChannel = channel.replaceAll("#", "");
    const argumentClean = args[0] ? (args[0].replaceAll("@", "").toLowerCase()):(null)

    if(bad_words.includes(args[0]) || bad_words.includes(args[1])) return;

	if(commands.opluj.aliases.includes(command)) {
        if(commands.opluj.disabled.includes(cleanChannel)) return;

        if(detectCooldown(channels_data[channel].cooldowns.last, commands.opluj.cooldown)){
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.opluj.messages);

        client.say(channel, template);
        
	}else if(commands.kogut.aliases.includes(command)) {
        if(commands.kogut.disabled.includes(cleanChannel)) return;
        if(detectCooldown(channels_data[channel].cooldowns.last, commands.opluj.cooldown)){
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.kogut.messages);

        client.say(channel, template);
        
	}else if(commands.przytul.aliases.includes(command)) {
        if(commands.przytul.disabled.includes(cleanChannel)) return;
        if(detectCooldown(channels_data[channel].cooldowns.last, commands.opluj.cooldown)){
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.przytul.messages);

        client.say(channel, template);
        
	}else if(commands.zaprasza.aliases.includes(command)) {
        if(commands.zaprasza.disabled.includes(cleanChannel)) return;

        if(detectCooldown(channels_data[channel].cooldowns.last, commands.opluj.cooldown)){
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.zaprasza.messages);

        client.say(channel, template);
        
	}else if(commands.kiss.aliases.includes(command)) {
        if(commands.kiss.disabled.includes(cleanChannel)) return;

        if(detectCooldown(channels_data[channel].cooldowns.last, commands.opluj.cooldown)){
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const template = await RollOrMark(cleanChannel, tags.username, argumentClean, commands.kiss.messages);

        client.say(channel, template);
        
	}else if(commands.yfl.aliases.includes(command)) {
        const COMMAND = commands.yfl;

        if(COMMAND.disabled.includes(cleanChannel)) return;
        if(detectCooldown(channels_data[channel].cooldowns.longer, COMMAND.cooldown)){
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules[`${COMMAND.name}`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const template = await checkFan(cleanChannel, tags.username, argumentClean, COMMAND.messages, COMMAND.associated_channels, COMMAND.name);

        client.say(channel, template);
        
	}else if(commands.ewron.aliases.includes(command)) {
        const COMMAND = commands.ewron;

        if(COMMAND.disabled.includes(cleanChannel)) return;

        const oddvar = channels_data[channel].odd.ewron;

        if(detectCooldown(channels_data[channel].cooldowns.longer, COMMAND.cooldown)){
            ++channels_data[channel].odd.ewron;
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(oddvar > 0){
            --channels_data[channel].odd.ewron;
        }

        if(channels_data[channel].modules[`${COMMAND.name}`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        if(oddvar > message_number_to_trigger_odd){
            if(oddvar >= message_number_to_clear_odd){
                channels_data[channel].odd.ewron = 0;
            }

            return client.say(channel, oddMessage(tags.username));
        }
        const template = await checkFan(cleanChannel, tags.username, argumentClean, COMMAND.messages, COMMAND.associated_channels, COMMAND.name);

        client.say(channel, template);
        
	}else if(commands.grendy.aliases.includes(command)) {
        const COMMAND = commands.grendy;
        if(COMMAND.disabled.includes(cleanChannel)) return;

        if(detectCooldown(channels_data[channel].cooldowns.longer, COMMAND.cooldown)){
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules[`${COMMAND.name}`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const template = await checkFan(cleanChannel, tags.username, argumentClean, COMMAND.messages, COMMAND.associated_channels, COMMAND.name);

        client.say(channel, template);
        
	}else if(commands.resp.aliases.includes(command)) {
        const COMMAND = commands.resp;
        if(COMMAND.disabled.includes(cleanChannel)) return;

        if(detectCooldown(channels_data[channel].cooldowns.longer, COMMAND.cooldown)){
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules[`${COMMAND.name}`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const template = await checkFan(cleanChannel, tags.username, argumentClean, COMMAND.messages, COMMAND.associated_channels, COMMAND.name);

        client.say(channel, template);
        
	}else if(["love"].includes(command)){
        if(["#grubamruwa", "#xmerghani"].includes(channel)) return;
        
        if(detectCooldown(channels_data[channel].cooldowns.last, "classic")){
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the LoveCom function. */
        const commands = await LoveCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["kto"].includes(command)){
        if(detectCooldown(channels_data[channel].cooldowns.longer, "longer")){
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

        const cleanSender = tags.username.toLowerCase();

        if(argumentClean){
            return client.say(channel, await ksiezniczki(cleanChannel, argumentClean)); 
        }

        return client.say(channel, await ksiezniczki(cleanChannel, cleanSender));

    }else if(["semp", "ileogladalkobiet"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules["ileogladalkobiet"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const cleanSender = tags.username.toLowerCase();

        if(argumentClean){
            return client.say(channel, await ileogladalkobiet(cleanChannel, argumentClean)); 
        }

        return client.say(channel, await ileogladalkobiet(cleanChannel, cleanSender));

    }else if(["watchtimeall"].includes(command)){
        const oddvar = channels_data[channel].odd.watchtimeall;

        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            ++channels_data[channel].odd.watchtimeall;
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(oddvar > 0){
            --channels_data[channel].odd.watchtimeall;
        }

        if(channels_data[channel].modules["watchtimeall"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        if(oddvar > message_number_to_trigger_odd){
            if(oddvar >= message_number_to_clear_odd){
                channels_data[channel].odd.watchtimeall = 0;
            }

            return client.say(channel, oddMessage(tags.username));
        }
    
        const cleanSender = tags.username.toLowerCase();

        if(argumentClean){
            return client.say(channel, await watchtimeall(cleanChannel, argumentClean)); 
        }

        return client.say(channel, await watchtimeall(cleanChannel, cleanSender));

    }else if(["watchtime", "xayopl"].includes(command)){
        if(["#xspeedyq", "#grubamruwa", "#dobrycsgo", "#mrdzinold", "#xmerghani", "#xkaleson", "#neexcsgo", "#banduracartel", "#shavskyyy"].includes(channel) && command === "watchtime") return;

        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(channels_data[channel].modules["watchtime"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const cleanSender = tags.username.toLowerCase();

        //sender watchtime
        if(!argumentClean){
            return client.say(channel, await twitchlogger(cleanChannel, cleanSender)); 
        }

        //sender checks someone on the same channel
        if(!args[1]){
            return client.say(channel, await twitchlogger(cleanChannel, argumentClean)); 
        }

        return client.say(channel, await twitchlogger(cleanChannel, argumentClean, args[1])); 

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
        if(["#mrdzinold"].includes(channel)) return;

        const oddvar = channels_data[channel].odd.wiek;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            ++channels_data[channel].odd.wiek;
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(oddvar > 0){
            --channels_data[channel].odd.wiek;
        }

        if(channels_data[channel].modules["wiek"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        if(oddvar > message_number_to_trigger_odd){
            if(oddvar >= message_number_to_clear_odd){
                channels_data[channel].odd.wiek = 0;
            }

            return client.say(channel, oddMessage(tags.username));
        }

        /* Taking the message from the user and sending it to the ktoCom function. */
        const commands = await WiekCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["top3", "top3watchtime"].includes(command)){
        const oddvar = channels_data[channel].odd.top3;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            ++channels_data[channel].odd.top3;
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(oddvar > 0){
            --channels_data[channel].odd.top3;
        }

        if(channels_data[channel].modules["top3"] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        if(oddvar > message_number_to_trigger_odd){
            if(oddvar >= message_number_to_clear_odd){
                channels_data[channel].odd.top3 = 0;
            }

            return client.say(channel, oddMessage(tags.username));
        }

        const cleanSender = tags.username.toLowerCase();

        if(argumentClean){
            return client.say(channel, await twitchloggerTOP3(cleanChannel, argumentClean)); 
        }

        return client.say(channel, await twitchloggerTOP3(cleanChannel, cleanSender))

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
                client.say(channel, `${tags.username}, wszystkie dostępne moduły: topmsgs, msgs, duel, mogemoda, czyjestemzjebem, top3, wiek, missingall, watchtime, watchtimeall, ileogladalkobiet, ksiezniczki, yfl, ewron, pogoda, aod, fivem `)
            }else if(args[0] === "clearduels"){
                channels_data[channel].duels_list = [];

                client.say(channel, `${tags.username}, wyczyściłeś wszystkie duele `)
            }else if(args[0] === "overlayf5"){

                io.emit('refresh-overlay', "true");

                client.say(channel, `${tags.username}, odświeżono overlay. `)
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

        if(argumentClean === "mark" && (isModUp || tags.username === "3xanax" || tags.username === "youngkarthez")){
            const argumentClean2 = args[1].replaceAll("@", "").toLowerCase();
	
            if(argumentClean2 && argumentClean2.length > 3){
                const register = await registerToBL(argumentClean2, {mark: true, registrator: tags.username});
                if(register === null) return client.say(channel, `${tags.username}, nie udało się zarejestrować zjeba jasperSad `);;

                client.say(channel, `${tags.username}, zarejestrowałeś ${argumentClean2}, jako zjeba aok`);
                return;
            }

            client.say(channel, `${tags.username}, zapomniałeś podać osobe aok`);

        }else if(argumentClean === "unmark" && (isModUp || tags.username === "3xanax" || tags.username === "youngkarthez")){
            const argumentClean2 = args[1].replaceAll("@", "").toLowerCase();

            if(argumentClean2 && argumentClean2.length > 3){
                const register = await removeFromBL(argumentClean2);
                if(register === null) return client.say(channel, `${tags.username}, nie udało się usunąć tytułu zjeba jasperSad `);;

                client.say(channel, `${tags.username}, usunąłeś ${argumentClean2}, tytuł zjeba aok`);
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
    }else if(["fivem", "5city", "nrp", "notrp", "cocorp", "coco"].includes(command)) {
        if (channels_data[channel].cooldowns.special > (Date.now() - getMeCooldowns(channel).special)) {
            return;
        }
        channels_data[channel].cooldowns.special = Date.now();

        if(channels_data[channel].modules[`fivem`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        const template = await fiveM(cleanChannel, tags.username, argumentClean);

        client.say(channel, template);
        
	}else if(["aod"].includes(command)){
        if (channels_data[channel].cooldowns.special > (Date.now() - getMeCooldowns(channel).special)) {
            return;
        }
        channels_data[channel].cooldowns.special = Date.now();

        if(channels_data[channel].modules[`aod`] === false) return client.say(channel, `${tags.username}, ${command} jest wyłączone `);

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await AODCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["settings", "ustawienia"].includes(command)){
        if(!["#adrian1g__", "#3xanax"].includes(channel)) return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(argumentClean === "gta"){
            client.say(channel,  `${tags.username}, USTAWIENIA GTA FIRE https://clips.twitch.tv/LongEnjoyableTubersOMGScoots-0gEQyEMXY690Pv0m`);

        }else if(argumentClean === "fortnite"){
            client.say(channel,  `${tags.username}, USTAWIENIA FORTNITE FIRE https://clips.twitch.tv/InventiveCrypticOilBIRB-yWwnEcUiOAHBB0W3`);

        }else if(argumentClean === "citizen"){
            client.say(channel,  `${tags.username}, Citizen od fatka aok`);

        }else{

            client.say(channel, `${tags.username}, zapomniałeś podać gre (gta, fortnite, citizen)`);
        }
    }else if(["cam2"].includes(command)){
        if(!["#adrian1g__", "#3xanax"].includes(channel)) return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        return client.say(channel, `${tags.username}, kamerka z pokoju gieta: https://cam2.1giet.cf/ `);
    }else if(["med"].includes(command)){
        if(!["#adrian1g__", "#3xanax"].includes(channel)) return;
        
        const badges = tags.badges || {};
        const isBroadcaster = badges.broadcaster;
        const isMod = badges.moderator;
        const isVip = badges.vip;
        const isModUp = isBroadcaster || isMod || isVip;

        if(isModUp || tags.username === "3xanax"){
            if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
                return;
            }
            channels_data[channel].cooldowns.last = Date.now();
    
            return client.say(channel, `MED: ${args.join(" ")}`);
        }

        return;
    }else if(["losowanie"].includes(command)){
        if(!["#adrian1g__", "#3xanax"].includes(channel)) return;
        
        const badges = tags.badges || {};
        const isBroadcaster = badges.broadcaster;
        const isMod = badges.moderator;
        const isVip = badges.vip;
        const isModUp = isBroadcaster || isMod || isVip;

        if(isModUp || tags.username === "3xanax"){
            if(argumentClean === "keyword"){

                if(!args[1]){
                    return client.say(channel, `zapomniałeś o słowie`);
                }

                adrian1g_keyword = args[1] || "nieustawiono";
    
                return client.say(channel, `ustawiono słowo do dołączenia na !${args[1] || "nieustawiono"}`);
    
            }else if(argumentClean === "usun"){

                adrian1g_giveaway_list = [];
                adrian1g_keyword = null;

                return client.say(channel, `usunieto komende i wyczyszczono liste`);
            }

            return client.say(channel, `nieznana komenda {keyword/usun}`);
        }
    }else if(adrian1g_keyword !== null && adrian1g_keyword.includes(command)){
        if(!["#adrian1g__", "#3xanax"].includes(channel)) return;

        if (adrian1g_giveaywa_timer > (Date.now() - 1000)) {
            return;
        }
        adrian1g_giveaywa_timer = Date.now();

        const indexOfObject = adrian1g_giveaway_list.findIndex(object => {
            return object.nick === tags.username;
        });

        if(indexOfObject !== -1){
            return;
        }

        adrian1g_giveaway_list.push({
            nick: tags.username,
            id: tags["user-id"]
        })
    }else if(["paszport", "passport"].includes(command)){
        if(!["#adrian1g__", "#3xanax"].includes(channel)) return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        return client.say(channel, `${tags.username}, paszport możesz odebrać pod URL https://passport.1giet.cf/${tags.username.toLowerCase()} chciwy `);
    }else if(["permy", "perm"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();
        const cleanChannel = channel.replaceAll("#", "");
        const bansToday = await todayBans(argumentClean ? argumentClean : cleanChannel);

        if(bansToday === null){
            return client.say(channel, `${tags.username}, coś poszło nie tak mhm`); 
        }

        if(bansToday === true){
            return client.say(channel, `${tags.username}, nikt nie dostał dzisiaj perma na kanale ${argumentClean ? argumentClean : cleanChannel} jasperSad `); 
        }

        return client.say(channel, `${tags.username}, na kanale ${argumentClean ? argumentClean : cleanChannel} zostało dzisiaj rozdane: ${bansToday.bans} permów jasperRADOSC `);
    }else if(["gamble"].includes(command)){
        if(["#mrdzinold", "#xmerghani", "#mork", "#neexcsgo", "#banduracartel"].includes(channel)) return;

        if (channels_data[channel].cooldowns.duels > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.duels = Date.now();

        if(channels_data[channel].modules["gamble"] === false) return client.say(channel, `${tags.username}, gamblowanie jest wyłączone `);

        const cleanSender = tags.username.toLowerCase();
        const points = await getPoints(cleanSender, cleanChannel);

        if(!argumentClean || !["red", "black", "green", "blue", "orange"].includes(argumentClean)){
           return client.say(channel, `${cleanSender}, zapomniałeś/aś o kolorze (red - (x2), black - (x2), blue - (x3), orange - (x5), green - (x14)) `); 
        } 

        if(!args[1]){
            return client.say(channel, `${cleanSender}, zapomniałeś/aś o kwocie `); 
        }

        if(Number(args[1]) > 5000 || Number(args[1]) <= 0 || isNaN(args[1])){
            return client.say(channel, `${cleanSender}, maksymalnie można obstawić 5000 punktów `); 
        }

        if(Number(args[1]) > points){
            return client.say(channel, `${cleanSender} nie masz tylu punktów aha `);
        }
        const winnerColor = await rollWinColor();
        const betPoints = Number(args[1]);
        if(winnerColor !== argumentClean){
            const updatePoints = await gambleUpdate(cleanChannel, `-${betPoints}`, cleanSender)

            if(updatePoints === null){
                return client.say(channel, `${cleanSender} coś się rozjebało przy aktualizowaniu punktów aha `);
            }

            return client.say(channel, `${cleanSender} przegrałeś/aś wszystko beka - ${emojiColor(winnerColor)}`);
        }
        const winAmount = (betPoints * multiplyColor(winnerColor));
        const updatePoints = await gambleUpdate(cleanChannel, `+${winAmount - betPoints}`, cleanSender)

        if(updatePoints === null){
            return client.say(channel, `${cleanSender} coś się rozjebało przy aktualizowaniu punktów aha `);
        }

        return client.say(channel, `${cleanSender} wygrałeś/aś ${winAmount} punktów okurwa `);

    }else if(["dice", "kosci"].includes(command)){
        if(["#mrdzinold", "#xmerghani", "#mork", "#neexcsgo", "#banduracartel"].includes(channel)) return;

        if (channels_data[channel].cooldowns.duels > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.duels = Date.now();

        if(channels_data[channel].modules["dice"] === false) return client.say(channel, `${tags.username}, kości są wyłączone `);

        const cleanSender = tags.username.toLowerCase();
        const points = await getPoints(cleanSender, cleanChannel);

        if(!argumentClean){
            return client.say(channel, `${cleanSender}, zapomniałeś/aś o kwocie `); 
        }

        if(Number(argumentClean) > 5000 || Number(argumentClean) <= 0 || isNaN(argumentClean)){
            return client.say(channel, `${cleanSender}, maksymalnie można obstawić 5000 punktów `); 
        }

        if(Number(argumentClean) > points){
            return client.say(channel, `${cleanSender} nie masz tylu punktów aha `);
        }

        const dice1 = await rollDice();
        const dice2 = await rollDice();
        const dice3 = await rollDice();
        const betPoints = Number(argumentClean);
        const multiplyAmount = multiplyDice(dice1, dice2, dice3);

        if(multiplyAmount === null){
            const updatePoints = await gambleUpdate(cleanChannel, `-${betPoints}`, cleanSender)

            if(updatePoints === null){
                return client.say(channel, `${cleanSender} coś się rozjebało przy aktualizowaniu punktów aha `);
            }

            return client.say(channel, `${cleanSender} przegrałeś/aś wszystko jasperSmiech - 🎲${dice1} 🎲${dice2} 🎲${dice3}`);
        }

        const winAmount = (betPoints * multiplyAmount);
        const updatePoints = await gambleUpdate(cleanChannel, `+${winAmount - betPoints}`, cleanSender)

        if(updatePoints === null){
            return client.say(channel, `${cleanSender} coś się rozjebało przy aktualizowaniu punktów aha `);
        }

        if(multiplyAmount === 66){
            return client.say(channel, `${cleanSender} szatańska wygrana ${winAmount} okurwa FIRE x66 - 🎲${dice1} 🎲${dice2} 🎲${dice3} `);
        }

        if(multiplyAmount === 33){
            return client.say(channel, `${cleanSender} szczęśliwa trójka ${winAmount} PartyKirby 🍀 🍀 x33 - 🎲${dice1} 🎲${dice2} 🎲${dice3} `);
        }

        return client.say(channel, `${cleanSender} wygrałeś/aś ${winAmount} punktów okurwa - 🎲${dice1} 🎲${dice2} 🎲${dice3}`);

    }else if(["connectdc"].includes(command)){
        if(!["#adrian1g__", "#3xanax"].includes(channel)) return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();
        const cleanSender = tags.username.toLowerCase();

        if(!argumentClean){
            return client.say(channel, `${cleanSender}, zapomniałeś/aś o swoim ID na discord`); 
        }
        const req = registerDiscord(cleanSender, cleanChannel, argumentClean);

        if(req === null){
            return client.say(channel, `${cleanSender} coś poszło nie tak `);
        }

        client.say(channel, `${cleanSender} ${argumentClean} zostało ustawione jako twoje konto discord.`);

    }else if(["serwersubow", "bmcsuby"].includes(command)){
        if(!["#adrian1g__", "#3xanax"].includes(channel)) return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();
        const req = await bmcSuby();

        if(req === null){
            return client.say(channel, `${cleanSender} nie udało się pobrać danych z serwera mhm `);
        }
        if(req.players < 5){
            return client.say(channel, `jasperSmile ${tags.username} na serwerze dla subów aktualnie jest ${req.online} osób FIRE`);
        }
        return client.say(channel, `jasperSmile ${tags.username} na serwerze dla subów aktualnie jest ${req.online} osób, np. ${req.players.join(", ")}`);

    }else if(["tiktok", "redeem", "buy"].includes(command)){
        if(!["#adrian1g__", "#3xanax"].includes(channel)) return;

        if (tiktokCD > (Date.now() - 3000)) {
            return;
        }
        tiktokCD = Date.now();

        if(channels_data[channel].modules["tiktok"] === false) return client.say(channel, `${tags.username}, tiktok jest wyłączony `);

        const cleanSender = tags.username.toLowerCase();
        const points = await getPoints(cleanSender, cleanChannel);

        if(!argumentClean){
            return client.say(channel, `${cleanSender}, zapomniałeś/aś o rodzaju -> !tiktok list aha`); 
        }

        if(argumentClean === "list"){
            return client.say(channel, `${cleanSender}, rose - 1k, coffe - 2,5k, koniczynka - 5k, kiss - 7,5k, szampan - 10k, diamonds - 20k, duck - 30k, dice - 50k, lean - 100k, ziolo - 110k -> https://yfl.es/alerts.png `); 
        }

        if(argumentClean === "alerty"){
            return client.say(channel, `${cleanSender}, autorem alertów jest @Majhel FIRE GagriGagri `); 
        }

        if(!["coffe", "diamonds", "dice", "kiss", "koniczynka", "rose", "szampan", "lean", "ziolo", "duck"].includes(argumentClean)){
            return client.say(channel, `${cleanSender}, nieznany rodzaj -> !tiktok list aha`); 
        }

        if(!args[1] || Number(args[1]) <= 0 || isNaN(args[1])){
            return client.say(channel, `${cleanSender}, nie podałeś/aś ilości mhm`); 
        }

        if(Number(args[1]) !== Math.floor(args[1])){
            return client.say(channel, `${cleanSender}, ale jestem mondry wyśle liczbe po przecinku 3Heading `); 
        }

        if(Number(args[1]) > 10000 ){
            return client.say(channel, `${cleanSender}, maksymalnie można przesłać 1000 hehe`); 
        }

        const price = getPrices(argumentClean);
        const cost = price*args[1]

        if(points < cost){
            return client.say(channel, `${cleanSender}, nie masz tylu punktów aha`); 
        }

        const updatePoints = await gambleUpdate(cleanChannel, `-${(price*Number(args[1]))}`, cleanSender);

        if(updatePoints === null){
            return client.say(channel, `${cleanSender} coś się rozjebało przy aktualizowaniu punktów aha `);
        }

        io.emit('new-alert', {
            user_login: tags.username,
            amount: args[1],
            type: argumentClean
        });

        return client.say(channel, `${cleanSender}, przesyła ${alertName(argumentClean)} x${args[1]} za ${new Intl.NumberFormat('pl-PL').format(cost)} punktów okurwa FIRE`); 
    }

});
