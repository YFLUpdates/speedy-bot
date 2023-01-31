import serverInfo from "../functions/fivem/modules/severInfo.js";

const znaniHex = [
    "steam:110000117245651" /* - Igoreq */,
    "steam:110000114731078" /* - Toster */,
    "steam:11000013a1c7342" /* - big kłowty on top */,
    "steam:11000013eaf80d2" /* - Hyper */,
    "steam:1100001118a7907" /* - minesekk */,
    "steam:1100001486c2726" /* - adrian1g */
]

const nicknames = function(steamid) {
    let day;
    switch (steamid) {
      case 'steam:110000117245651':
        day = "Igoreq";
        break;
      case 'steam:110000114731078':
        day = "Toster";
        break;
      case 'steam:11000013a1c7342':
        day = "kłow";
        break;
      case 'steam:11000013eaf80d2':
        day = "Hyper";
        break;
      case 'steam:1100001118a7907':
        day = "minesekk";
        break;
      case 'steam:1100001486c2726':
        day = "adrian1g";
        break;
      default:
        day = "Nieznany członek";
    }
    return day;
}

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
                streamrsArray.push(nicknames(i.identifiers[0]))
            }
        })
    )

    if(streamrsArray.length === 0) return `PogO ${usernameSmall} nikt z Organizacji aktualnie nie gra na NotRP `;

    return `monkaStandoff ${usernameSmall} na NotRP aktualnie grają: ${streamrsArray.join(", ")} `
}