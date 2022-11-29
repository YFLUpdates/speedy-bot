import axios from "axios";

export default async function request(user, json){
    return await axios({
        url: `https://api.yfl.es/v1/user/blacklist/create`,
        method: "post",
        data: {
            user_login: user,
            associated: `!${json.reason}, największy watchtime: ${json.top1} - ${json.registrator}`
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
        //console.log(err)

        return null;
    })
}