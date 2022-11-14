import axios from "axios";
const YFLTeam = ["youngmulti", "xmerghani", "1wron3k", "mrdzinold", "mork", "banduracartel", "xspeedyq", "adrian1g__", "xkaleson"]

export default async function getChatters(channelName) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let time_all = 0
        let yfl_time = 0

        await Promise.all(
            channels.map((i) => {
                time_all += i.count * 5
                if(YFLTeam.includes(i.streamer)){
                    yfl_time += i.count * 5
                }
            })
        )
        return yfl_time / time_all;
    })
    .catch(err => {
        return `Nie byłem w stanie sprawdzić kanału ${channelName} jasperSad `;
        console.log(err)
    })
}