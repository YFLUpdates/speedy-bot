import axios from "axios";

export default async function getChatters(channelName) {
    return await axios.get(`https://api.streamelements.com/kappa/v2/chatstats/${channelName}/stats?limit=100`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {

      return data.data.chatters || null;
      
    })
    .catch(err => {
        return null;
    })
}