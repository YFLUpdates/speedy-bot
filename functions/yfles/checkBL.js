import axios from "axios";

export default async function request(user){
    return await axios({
        url: `https://api.yfl.es/v1/user/blacklist/find/${user}`,
        method: "GET",
        headers: {
            'Content-type': 'application/json'
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