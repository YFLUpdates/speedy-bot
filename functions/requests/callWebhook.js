import axios from "axios";
import dotenv from "dotenv";

dotenv.config()

async function callWebhook(name){
    //An array of Discord Embeds.
    let embeds = [
        {
          color: 16073282,
          footer: {
            text: `📅 yfl.es`,
          },
          fields: [
            {
              name: "Propozycja znanego",
              value: name
            },
          ],
        },
      ];
    
    //Stringify the embeds using JSON.stringify()
    let data = JSON.stringify({ embeds });
    
    //Create a config object for axios, you can also use axios.post("url", data) instead
    var config = {
       method: "POST",
       url: process.env.DISCORD_WEBHOOK,
       headers: { "Content-Type": "application/json" },
       data: data,
    };
    
    //Send the request
     axios(config)
       .then((response) => {
          return response;
       })
       .catch((error) => {
         console.log(error);
         return error;
       });
}
export default callWebhook;