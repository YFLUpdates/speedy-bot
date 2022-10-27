import axios from "axios";

export default async function getChatters(channelName) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let time_all = 0
        let ewron_time = 0
        await Promise.all(
            channels.map((i) => {
                time_all += i.count * 5
                if(i.streamer === "ewroon"){
                    ewron_time += i.count * 5
                }
            })
        )
        return ewron_time / time_all;
    })
    .catch(err => {
        console.log(err)
    })
}