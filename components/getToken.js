import axios from "axios";

export default async function getToken(){
    return await axios({
        url: `https://api.yfl.es/api/lastseen/token`,
        method: "get",
        headers: {
            'Content-type': 'application/json',
            'clientID': process.env.YFL_CLIENT_ID,
            'token': process.env.YFL_TOKEN
        }
    })
    .then(async (res) => {
        return res.data.value;
    })
    .catch(err => {
        console.log(err)
        return process.env.ACCESS_TOKEN;
    })
}