import {chatMessages} from "../functions/requests/index.js";

async function getPodium(channels, username){
    let messagesNumber = 0;
    let messagePodium = 0;

    await Promise.all(
      channels.map(function(x, index) {
        if(x.name === username){
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
        return `${username} nie znajduje się w TOP 100 jasperSad`;
    }else{
        return `${username} napisał ${messagesNumber} wiadomości, zajmuje ${messagePodium} miejsce jasperSmile`;
    }
}
export default async function hugC(channel, username, argument){
    const usernameSmall = username.toLowerCase();
    const channels = await chatMessages(channel);

    if(channels === null) return `${username} nie udało się pobrać danych jasperSad`;

    if(argument && argument.length > 3){

        return await getPodium(channels, argument);
    }else{

        return await getPodium(channels, usernameSmall);
    }

}