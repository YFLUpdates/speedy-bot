// if(["spoznienie", "kiedystream"].includes(command)){
//     if(!["#adrian1g__", "#3xanax"].includes(channel)) return;
    
//     const badges = tags.badges || {};
//     const isBroadcaster = badges.broadcaster;
//     const isMod = badges.moderator;
//     const isVip = badges.vip;
//     const isModUp = isBroadcaster || isMod || isVip;

//     if(argumentClean === "set" && (isModUp || tags.username === "3xanax")){
//         if(args[1] === "0"){
//             adrian1g_stream = "0";

//             client.say(channel, `${tags.username}, wyzerowałeś godzine streama`);
//             return;
//         }
//         const date = new Date(args[1].replaceAll("#", " "));

//         if(date && dateIsValid(date)){
//             adrian1g_stream = date;

//             client.say(channel, `${tags.username}, ustawiłeś godzine streama na ${date.toLocaleString("pl")}`);
//             return;
//         }

//         return client.say(channel, `${tags.username}, podałeś złą date, format (2023-01-22#15:00)`);

//     }else{
//         if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
//             return;
//         }
//         channels_data[channel].cooldowns.last = Date.now();

//         if(adrian1g_stream === "0"){
//             return client.say(channel, `Nie ustawiono godziny streama mhm`);
//         }
//         const timeDiffSeconds = intlFormatDistance(adrian1g_stream, new Date(), { style: 'short', numeric: 'always', locale: 'pl' })

//         return client.say(channel, `oho adrian1g miał odpalić streama: ${timeDiffSeconds}`);
//     }
// }