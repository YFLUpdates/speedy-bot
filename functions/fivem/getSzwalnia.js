import cfx from "cfx-api";

const znaniHex = [
    "steam:1100001362e9070" /* - resqu */,
    "steam:11000010b50a4cd" /* - shavskyyy */,
    "steam:11000013b60db39" /* - desssno */,
    "steam:110000115cd2d12" /* - mevron */,
    "steam:1100001118a7907" /* - minesekk  */,
    "steam:11000010f56efe4" /* - grubamruwa */,
    "steam:11000011759f272" /* - leftboy */
]

export default async function getSzwalnia(user) {
    const fivecity = await cfx.fetchServer("vp4rxq");
    let streamrsArray = [];

    await Promise.all(
        fivecity.players.map(async (i) => {
            if(znaniHex.includes(i.identifiers[0])){
                streamrsArray.push(i.name.toLowerCase())
            }
        })
    )

    if(streamrsArray.length === 0) return `jasperLaskotanie ${user} nikt ze szwalni aktualnie nie gra na 5City `;

    return `jasperUsmiech ${user} na 5City aktualnie grają ${streamrsArray.join(", ")} `
}