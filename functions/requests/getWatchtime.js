import axios from "axios";

export default async function getWatchtime(user, target_channel) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${user}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        const indexOfObject = channels.findIndex(object => {
            return object.streamer === target_channel;
        });

        // await Promise.all(
        //     channels.map((i) => {
        //         if(i.streamer === target_channel){
        //             time_all += i.count * 5
        //         }
        //     })
        // )

        return channels[indexOfObject] * 5;
    })
    .catch(err => {
        return `Nie byłem w stanie sprawdzić kanału ${channelName} jasperSad `
        console.log(err)
    })
}