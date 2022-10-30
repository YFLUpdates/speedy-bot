import {whosFamous} from "../functions/index.js";

export default async function hugC(channel, username, argument, znaniUsers){

    if(argument && (argument === "pytał" || argument === "pytal")) return `Ty pytałeś dzbanie ${username}`;

    const popularni = await whosFamous(channel, znaniUsers);
    let users = "";

    await Promise.all(
        popularni.map((i) => {
            users += i + ', '
        })
    )

    if(popularni.length === 0){
        return `Nikt z listy nie oglada streama ${channel} jasperSad`;
    }

    if(users.length < 480 ){
        return `${users} oglada stream ${channel} ok`;
    }else{
        return `${channel} ogląda tyle osób, że nie da się ich wypisać na czacie. Sadge`;
    }
}