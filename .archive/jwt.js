// if(["joinwatchtime", "jwt"].includes(command)){
//     if(["#mrdzinold", "#xmerghani", "#banduracartel"].includes(channel)) return;

//     const badges = tags.badges || {};
//     const isBroadcaster = badges.broadcaster;
//     const isMod = badges.moderator;
//     const isModUp = isBroadcaster || isMod;
    
//     const username = tags.username.toLowerCase();

//     if(argumentClean === "start" && isModUp || argumentClean === "start" && username === "3xanax"){

//         channels_data[channel].watchtime_top = [];
        
//         channels_data[channel].modules["jwt"] = true;

//         client.say(channel, `${username}, dołączanie do watchtimu włączone Chatters !jwt `)
//     }else if(argumentClean === "stop" && isModUp || argumentClean === "stop" && username === "3xanax"){
//         channels_data[channel].modules["jwt"] = false;

//         client.say(channel, `${username}, dołączanie do watchtimu wyłączone ok aby wybrać osoby z największym watchtimem !jwt count`);
//     }else if(argumentClean === "count" && isModUp || argumentClean === "count" && username === "3xanax" ){
//         if(channels_data[channel].modules["jwt"] === true) return client.say(channel, `${username}, najpierw musisz wyłączyć dołączanie !jwt stop `);

//         if(channels_data[channel].watchtime_top.length < 5) return client.say(channel, `${username}, brakuje osób do losowania min. 5 `);

//         const top5 = topN(channels_data[channel].watchtime_top, 5);

//         client.say(channel, `${username}, najwięcej watchtimu mają: ${top5.map((list) => list.name).join(", ")}`);
//     }else{
//         const check_for_duplicate = channels_data[channel].watchtime_top.find(x => x.name === username);
        
//         /* Checking if the duel exists. */
//         if(check_for_duplicate !== undefined) return;

//         if (channels_data[channel].cooldowns.last > (Date.now() - getMeCooldowns(channel).classic)) {
//             return;
//         }
//         channels_data[channel].cooldowns.last = Date.now();

//         if(channels_data[channel].modules["jwt"] === false) return client.say(channel, `${username}, moduł wyłączony `);

//         const watchtime = await getWatchtime(username, cleanChannel);

//         const check_for_duplicate2 = channels_data[channel].watchtime_top.find(x => x.name === username);

//         if(check_for_duplicate2 !== undefined) return;

//         channels_data[channel].watchtime_top.push({
//             name: username,
//             count: watchtime
//         })

//         client.say(channel, `${username}, zapisano do listy watchtime`);
//     }

// }