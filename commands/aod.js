import serverInfo from "../functions/fivem/modules/severInfo.js";

const znaniHex = [
    "steam:11000013bcde738" /* - MRG */,
    "steam:110000112458d4d" /* - Speedy */,
    "steam:11000010395cc1b" /* - dobrypt */,
    "steam:1100001486c2726" /* - adrian1g */,
    "steam:11000010cce9caa" /* - MrDzinold */,
    "steam:11000010263929b" /* - multi */,
    "steam:1100001034b75af" /* - b4ndura */,
    "steam:11000010f085a81" /* - mork  */,
    "steam:1100001039e60a0" /* - neex  */
]

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();
    let server = null;
    let streamrsArray = [];

    if(!argument || argument && argument.length < 3) return `${usernameSmall} zapomniałeś podać serwer (5city, notrp, cocorp, 77rp)`;

    switch (argument) {
        case "5city":
          server = await serverInfo("vp4rxq");
          break;
        case "notrp":
        case "nrp":
          server = await serverInfo("jqbq8m");
          break;
        case "coco":
        case "cocorp":
          server = await serverInfo("6d6rk8");
          break;
        case "77rp":
          server = await serverInfo("63blz4");
          break;
        default:
          server = null;
    }

    if(server === null) return `${usernameSmall} coś się popsuło z Fivem jasperTragedia`;

    await Promise.all(
        server.players.map(async (i) => {
            if(znaniHex.includes(i.identifiers[0])){
                if(i.name.toLowerCase() === "10x50"){
                    return streamrsArray.push("neex");
                }
                streamrsArray.push(i.name.toLowerCase())
            }
        })
    )

    if(streamrsArray.length === 0) return `jasperLaskotanie ${usernameSmall} nikt z AOD aktualnie nie gra na ${argument} `;

    return `jasperUsmiech ${usernameSmall} na ${argument} aktualnie grają ${streamrsArray.join(", ")} `
}