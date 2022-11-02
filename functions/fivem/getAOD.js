import cfx from "cfx-api";

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

export default async function getSzwalnia(user) {
    const fivecity = await cfx.fetchServer("ggoe6z");
    let streamrsArray = [];

    await Promise.all(
        fivecity.players.map(async (i) => {
            if(znaniHex.includes(i.identifiers[0])){
                if(i.name.toLowerCase() === "10x50"){
                    return streamrsArray.push("neex");
                }
                streamrsArray.push(i.name.toLowerCase())
            }
        })
    )

    if(streamrsArray.length === 0) return `jasperLaskotanie ${user} nikt z AOD aktualnie nie gra na 5City `;

    return `jasperUsmiech ${user} na 5City aktualnie grają ${streamrsArray.join(", ")} `
}