import serverInfo from "../functions/fivem/modules/severInfo.js";

const znaniHex = [
    "steam:110000117245651" /* - Igoreq */,
    "steam:110000114731078" /* - Toster */,
    "steam:11000013a1c7342" /* - big kłowty on top */,
    "steam:11000013eaf80d2" /* - Hyper */,
    "steam:1100001118a7907" /* - minesekk */
]

export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();
    let server = await serverInfo("jqbq8m");
    let streamrsArray = [];

    // if(!argument || argument && argument.length < 3) return `${usernameSmall} zapomniałeś podać serwer (notrp)`;

    // switch (argument) {
    //     case "notrp":
    //     case "nrp":
    //       server = await serverInfo("jqbq8m");
    //       break;
    //     default:
    //       server = null;
    // }

    if(server === null) return `${usernameSmall} coś się popsuło z Fivem jasperTragedia`;

    await Promise.all(
        server.players.map(async (i) => {
            if(znaniHex.includes(i.identifiers[0])){
                streamrsArray.push(i.name.toLowerCase())
            }
        })
    )

    if(streamrsArray.length === 0) return `jasperLaskotanie ${usernameSmall} nikt z Organizacji aktualnie nie gra na notrp `;

    return `jasperUsmiech ${usernameSmall} na notrp aktualnie grają ${streamrsArray.join(", ")} `
}