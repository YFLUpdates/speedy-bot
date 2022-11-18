import axios from "axios";

export default async function getChatters(channelName, user) {
    return await axios.get(`https://api.streamelements.com/kappa/v2/chatstats/${channelName}/stats?limit=100`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data.chatters;
        let messagesNumber = 0;
        let messagePodium = 0

        await Promise.all(
          channels.map(function(x, index) {
            if(x.name === user){
              if(x.name === "lakakaqday"){
                messagePodium = index+1;
                messagesNumber = x.amount/2;
                
                return;
              }

              messagePodium = index+1;
              messagesNumber = x.amount;
            }
            return;
          })
        )

        if(messagesNumber === 0){
          return `${user} nie znajduje się w TOP 100 jasperSad`;
        }else{
          return `${user} napisał ${messagesNumber} wiadomości, zajmuje ${messagePodium} miejsce jasperSmile`;
        }

    })
    .catch(err => {
        return `${user} nie udało się pobrać danych jasperSad`;
        console.log(err)
    })
}