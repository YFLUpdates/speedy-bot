import axios from "axios";

export default async function banduraBans(channel){
    return await axios({
        url: `https://api.yfl.es/v1/channel/charts/${channel}`,
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(async (res) => {
        if(res.data.length === 0){
            return null;
        }
        const last = res.data.pop();

        if(new Date(last.created_at).getDate() !== new Date().getDate()){
            return true;
        }
        
        return last || null;
    })
    .catch(err => {
        //console.log(err)

        return null;
    })
}