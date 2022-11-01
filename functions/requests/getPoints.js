import axios from "axios";

export default async function getPoints(user, channelName) {
    return await axios.get(`https://api.yfl.es/api/lastseen/find/${user}?channel=${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const res = data.data;

        return res.points;
    })
    .catch(err => {
        return 0;
        console.log(err)
    })
}