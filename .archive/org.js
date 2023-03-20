// if(["org", "topg", "organizacja"].includes(command)){
//     if(!["#adrian1g__", "#3xanax"].includes(channel)) return;

//     if (channels_data[channel].cooldowns.special > (Date.now() - getMeCooldowns(channel).special)) {
//         return;
//     }
//     channels_data[channel].cooldowns.special = Date.now();

//     /* Taking the argumentClean variable and passing it to the EwronCom function. */
//     const commands = await OrgCom(cleanChannel, tags.username, argumentClean);

//     client.say(channel, commands);
// }