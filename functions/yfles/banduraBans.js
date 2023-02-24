import axios from "axios";

export default async function banduraBans(){
    return await axios({
        url: `https://api.yfl.es/v1/channel/charts/banduracartel`,
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(async (res) => {
        //console.log(data)
        return res.data.pop() || null;
    })
    .catch(err => {
        //console.log(err)

        return null;
    })
}