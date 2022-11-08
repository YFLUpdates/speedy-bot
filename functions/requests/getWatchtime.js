import axios from "axios";

export default async function getWatchtime(user, target_channel) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${user}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let time_all = 0

        await Promise.all(
            channels.map((i) => {
                if(i.streamer === target_channel){
                    time_all += i.count * 5
                }
            })
        )

        return time_all;
    })
    .catch(err => {
        console.log(err)
    })
}