import tmi from "tmi.js";
import express from "express";
import dotenv from "dotenv";
import { promises as fs } from 'fs';

import { HugCom, SpitCom, LoveCom, KogutCom, EwronCom, YFLCom, KtoCom, KissCom, MarryCom, IleYFLCom, Top3watchtimeCom, WiekCom, TopchannelwatchtimesCom, 
    FivecityCom, ZjebCom, MogemodaCom, KamerkiCom, ZapraszaCom, SzwalniaCom, OfflinetimeCom, pointsCom } from "./commands/index.js";
import { watchtimeAll, watchtimeGet, checkTimeout, callWebhook, missingAll, missing, duelsWorking, getPoints } from "./functions/requests/index.js";
import { checkSemps, sempTime } from "./functions/semps/index.js";
import insertToDatabase from "./components/insertToDatabase.js";
import lastSeenUpdate from "./components/lastSeenUpdate.js";
import getMeCooldowns from "./components/getMeCooldowns.js";
import check_if_user_in_channel from "./functions/lewus/index.js";
import {Truncate} from "./functions/index.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
//const joinThem = [ 'adrian1g__', 'grubamruwa', 'xspeedyq', 'dobrypt', 'mrdzinold' ];
const joinThem = [ '3xanax' ];
const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD
	},
	channels: joinThem
});
// " 󠀀"
const znaniUsers = JSON.parse(await fs.readFile('./channels.json', 'UTF-8'));
const bad_words = JSON.parse(await fs.readFile('./bad_words.json', 'UTF-8'));
const channels_data = JSON.parse(await fs.readFile('./channels_data.json', 'UTF-8'));

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

//lastSeenUpdate(joinThem);

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

client.on('message', async (channel, tags, message, self) => {
	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();
    const cleanChannel = channel.replaceAll("#", "");
    const argumentClean = args[0] ? (args[0].replaceAll("@", "").toLowerCase()):(null)

    if(bad_words.includes(args[0]) || bad_words.includes(args[1])) return;

	if(["opluj"].includes(command)) {
        if(channel === "#adrian1g__") return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the SpitCom function. */
        const commands = await SpitCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
        
	}else if(["love"].includes(command)){
        if(channel === "#grubamruwa") return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the LoveCom function. */
        const commands = await LoveCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["kogut"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the KogutCom function. */
        const commands = await KogutCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["ewroniarz", "ewron"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await EwronCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);


    }else if(["yflwatchtime", "yfl"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        /* Taking the argumentClean variable and passing it to the YFLCom function. */
        const commands = await YFLCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["kto"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the message from the user and sending it to the ktoCom function. */
        const commands = await KtoCom(cleanChannel, tags.username, argumentClean, znaniUsers);

        client.say(channel, commands);

    }else if(["kiss", "calus"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the message from the user and sending it to the kissCom function. */
        const commands = await KissCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["ksiezniczki", "topdupeczki", "topsemp"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(args[0] && args[0] !== " "){
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

        if(args[0]  && args[0] !== " "){
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

        if(args[0] && args[0] !== " "){
            const watchtime = await watchtimeAll(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, watchtime);
        }else{
            const watchtime = await watchtimeAll(tags.username.toLowerCase());

            client.say(channel, watchtime);
        }

    }else if(["watchtime", "xayopl"].includes(command)){
        if(["#xspeedyq", "#grubamruwa", "#dobrypt", "#mrdzinold"].includes(channel) && command === "watchtime") return;

        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

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

    }else if(["gdzie", "przesladowanie", "where"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

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

    }else if(["przytul", "hug"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        const commands = await HugCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["marry", "slub"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the LoveCom function. */
        const commands = await MarryCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["wruc", "ilejeszcze"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();


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

    }else if(["missingall", "ostatnioall", "kiedyall"].includes(command)){
        
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(args[0] === " ") return;

        if(args[0]){
            const whereMissing = await missingAll(args[0].replaceAll("@", "").toLowerCase());

            client.say(channel, whereMissing);
        }

    }else if(["missing", "ostatnio", "lastseen", "kiedy"].includes(command)){
        if(["#mrdzinold"].includes(channel)) return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        if(args[0] === " ") return;

        if(args[0]){
            const whereMissing = await missing(args[0].replaceAll("@", "").toLowerCase(), cleanChannel);

            client.say(channel, whereMissing);
        }

    }else if(["ileyfl"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the message from the user and sending it to the ktoCom function. */
        const commands = await IleYFLCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["ilemamlat", "wiek"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the message from the user and sending it to the ktoCom function. */
        const commands = await WiekCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);

    }else if(["top3", "top3watchtime"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await Top3watchtimeCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["dodajznany"].includes(command)){
        if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
            return;
        }
        channels_data[channel].cooldowns.longer = Date.now();

        if(args[0] === " ") return;
        
        if(args[0]){
            callWebhook(args[0])

            client.say(channel, `${tags.username} zapisane ok`);
        }

    }else if(["fivecity", "5city"].includes(command)){
        if (channels_data[channel].cooldowns.special > (Date.now() - getMeCooldowns(channel).special)) {
            return;
        }
        channels_data[channel].cooldowns.special = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await FivecityCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["szwalnia", "ekipa5city"].includes(command)){
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

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await ZjebCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["mogemoda", "szansanamoda"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldownslast = Date.now();

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
    }else if(["zaprasza"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await ZapraszaCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["timeoffline", "offlinetime"].includes(command)){
        if(["#mrdzinold"].includes(channel)) return;
        
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await OfflinetimeCom(cleanChannel, tags.username, argumentClean);

        client.say(channel, commands);
    }else if(["duel"].includes(command)){
        if(["#mrdzinold"].includes(channel)) return;

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
                duels.splice(indexOfObject, 1);

                const command = await duelsWorking(cleanChannel, duel_info.user, duel_info.invited, duel_info.points);

                return client.say(channel, command)
            }

        }else if(["list", "lista"].includes(argumentClean)){
            if (channels_data[channel].cooldowns.classic > (Date.now() - getMeCooldowns(channel).longer)) {
                return;
            }
            channels_data[channel].cooldowns.classic = Date.now();

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
            if(!args[1] || !Number.isInteger(Number(args[1])) || Number(args[1]) === 0) return client.say(channel, `${cleanSender}, zapomniałeś podać kwote :| `);

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
        if(["#mrdzinold"].includes(channel)) return;

        if(["#xspeedyq", "#grubamruwa"].includes(channel) && command === "points") return;
        
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        /* Taking the argumentClean variable and passing it to the EwronCom function. */
        const commands = await pointsCom(cleanChannel, tags.username, argumentClean);

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
            }
        }

    }else if(["help", "commands", "komendy", "pomoc"].includes(command)){
        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        client.say(channel, `!hug, !opluj, !ewron, !yfl, !kogut, !watchtimeall, !watchtime, !ileogladalkobiet, !ksiezniczki, !kto, !gdzie, !ilejeszcze, !missing i wiele więcej na https://yfl.es/bot ok`);
    }else if(["fame", "famemma", "ppv"].includes(command)){
        if(["#mrdzinold"].includes(channel)) return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        client.say(channel, `FameMMA? tylko z refa bungee - https://famemma.tv/#/ref/bungee okok`);
    }else if(["emotki", "emotes"].includes(command)){
        if(["#mrdzinold"].includes(channel)) return;

        if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
            return;
        }
        channels_data[channel].cooldowns.last = Date.now();

        client.say(channel, `Nie widzisz tej emotki? -> jasperVixa Zainstaluj wtyczkę: https://7tv.app/ `);
    }

});



// else if(["livetop", "topkanazywo", "livetopwatchtime"].includes(command)){
//     if(["#mrdzinold"].includes(channel)) return;

//     if (channels_data[channel].cooldowns.special > (Date.now() - 2 * 60 * 1000)) {
//         return;
//     }
//     channels_data[channel].cooldowns.special = Date.now();

//     client.say(channel, `${tags.username} to chwile zajmie hehe`);

//     /* Taking the argumentClean variable and passing it to the EwronCom function. */
//     const commands = await TopchannelwatchtimesCom(cleanChannel, tags.username, argumentClean);

//     client.say(channel, commands);
// }