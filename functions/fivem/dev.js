import cfx from "cfx-api";

export default async function getFiveCity() {
    const fivecity = await cfx.fetchServer("ggoe6z");

    await Promise.all(
        fivecity.players.map(async (i, index) => {
            console.log(i.name, i.identifiers[0])
        })
    )
}