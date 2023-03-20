// if(["robot"].includes(command)){
//     if(["#mrdzinold", "#xmerghani", "#mork", "#neexcsgo", "#banduracartel"].includes(channel)) return;

//     if (channels_data[channel].cooldowns.longer > (Date.now() - getMeCooldowns(channel).longer)) {
//         return;
//     }
//     channels_data[channel].cooldowns.longer = Date.now();

//     if(channels_data[channel].modules["robot"] === false) return client.say(channel, `${tags.username}, roboty są wyłączone `);

//     const cleanSender = tags.username.toLowerCase();
//     const points = await getPoints(cleanSender, cleanChannel);

//     if(!argumentClean){
//         return client.say(channel, `${cleanSender}, zapomniałeś/aś o grze `); 
//     }

//     if(argumentClean !== "dice"){
//         return client.say(channel, `${cleanSender}, nie wspierana gra hm (dostępne - dice) `); 
//     }

//     if(!args[1]){
//         return client.say(channel, `${cleanSender}, zapomniałeś/aś o kwocie mhm`); 
//     }
//     const argumentClean2 = args[1].replaceAll("@", "").toLowerCase();

//     if(Number(argumentClean2) > 5000 || Number(argumentClean2) <= 0 || isNaN(argumentClean2)){
//         return client.say(channel, `${cleanSender}, maksymalnie można obstawić 5000 punktów `); 
//     }

//     if(Number(argumentClean2) > points){
//         return client.say(channel, `${cleanSender} nie masz tylu punktów aha `);
//     }

//     if(!args[2]){
//         return client.say(channel, `${cleanSender}, zapomniałeś/aś ile razy ma zagrać za ciebie aha`); 
//     }
//     const argumentClean3 = args[2].replaceAll("@", "").toLowerCase();

//     if(Number(argumentClean3) > 10 || Number(argumentClean3) <= 0 || isNaN(argumentClean3)){
//         return client.say(channel, `${cleanSender}, maksymalnie można ustawić bota na 10 gier `); 
//     }

//     client.say(channel, `${cleanSender}, ustawiłeś/aś bota na ${argumentClean3} gier ok `)

//     if(argumentClean === "dice"){
//         if(channels_data[channel].modules["dice"] === false) return client.say(channel, `${cleanSender}, kości są wyłączone `);

//         for (let i = 0; i <= (Number(argumentClean3)-1); i++) {
//             await waitforme(7000);
//             const points = await getPoints(cleanSender, cleanChannel);

//             if(Number(argumentClean2) > points){
//                 return client.say(channel, `${cleanSender} nie masz tylu punktów aha `);
//             }

//             client.say(channel, await robotDice(cleanSender, cleanChannel, argumentClean2));

//         }
//         return;
//     }

//     return client.say(channel, `${cleanSender} coś poszło nie tak aha `);

// }