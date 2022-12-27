import axios from "axios";

export default async function getChatters(serverID) {
    return await axios.get(`https://servers-frontend.fivem.net/api/servers/single/${serverID}`, {
        headers: {
            'Content-type': 'application/json',
            'User-Agent': 'YFLUpdates/1.1'
        }
    })
    .then(async ({data}) => {
        const {Data, EndPoint} = data;
        
        return Data;
    })
    .catch(err => {
        return null;
    })
}