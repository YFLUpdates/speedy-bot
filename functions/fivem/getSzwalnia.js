import cfx from "cfx-api";

const znaniHex = [
    "steam:11000013bcde738" /* - MRG */,
    "steam:110000112458d4d" /* - Speedy */,
    "steam:11000010395cc1b" /* - dobrypt */,
    "steam:1100001486c2726" /* - adrian1g */,
    "steam:11000010f56efe4" /* - grubamruwa */,
    "steam:11000010cce9caa" /* - MrDzinold */,
    "steam:11000010263929b" /* - multi */,
    "steam:1100001034b75af" /* - b4ndura */,
    "steam:1100001118a7907" /* - minesekk  */,
    "steam:11000010f085a81" /* - mork  */,
    "steam:1100001039e60a0" /* - neex  */,
]

export default async function getSzwalnia(user) {
    const fivecity = await cfx.fetchServer("ggoe6z");
    let streamrsArray = [];

    await Promise.all(
        fivecity.players.map(async (i) => {
            if(znaniHex.includes(i.identifiers[0])){
                streamrsArray.push(i.name.toLowerCase())
            }
        })
    )

    if(streamrsArray.length === 0) return `jasperLaskotanie ${user} nikt z ekipy aktualnie nie gra na 5City `;

    return `jasperUsmiech ${user} na 5City ze szwalni aktualnie są ${streamrsArray.join(", ")} `
}