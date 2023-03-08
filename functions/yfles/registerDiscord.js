import axios from "axios";

export default async function registerDiscord(user, channel, discord_id){
    return await axios({
        url: `https://api.yfl.es/v1/user/discord/${user}`,
        method: "put",
        data: {
            channel: channel,
            discord_id: discord_id,
            date: new Date().toJSON().slice(0, 19).replace('T', ' ')
        },
        headers: {
            'Content-type': 'application/json',
            'clientID': process.env.YFL_CLIENT_ID,
            'token': process.env.YFL_TOKEN
        }
    })
    .then(async (res) => {
        //console.log(data)
        return res.data;
    })
    .catch(err => {
        console.log(err)

        return null;
    })
}