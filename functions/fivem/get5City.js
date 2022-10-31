import cfx from "cfx-api";

const znaniHex = ["steam:110000141417a93", "steam:1100001073eef7f", "steam:110000102755b71", "steam:1100001065d98e4", "steam:1100001486c2726", "steam:11000010b295b51", 
    "steam:1100001010b4351", "steam:11000010e4c356a", "steam:110000102821131", "steam:110000111567ec2", "steam:11000010e0a158f", "steam:11000010703434c", "steam:11000010c46f661",
    "steam:11000010ff3fd00", "steam:110000109f2756c", "steam:1100001108133a6", "steam:11000010a374217", "steam:11000010333c367", "steam:1100001058fc5d9", "steam:110000102b8cf8e", 
    "steam:11000010229c988", "steam:11000010f085a81", "steam:110000112458d4d", "steam:11000010f56efe4", "steam:11000010395cc1b"]

export default async function getFiveCity(user) {
    const fivecity = await cfx.fetchServer("ggoe6z");
    const onServer = fivecity.players.length;
    let streamers = 0;

    await Promise.all(
        fivecity.players.map(async (i, index) => {
            if(znaniHex.includes(i.identifiers[0])){
                streamers += 1;
            }
        })
    )

    return `${user} na 5City aktualnie jest ${onServer} osób, z czego ${streamers} to znane osoby jasperTragedia `
}