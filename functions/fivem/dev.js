import cfx from "cfx-api";

export default async function getFiveCity() {
    const fivecity = await cfx.fetchServer("vp4rxq");

    console.log(fivecity)

    // await Promise.all(
    //     fivecity.players.map(async (i, index) => {
    //         console.log(i.name, i.identifiers[0])
    //     })
    // )
}
getFiveCity()