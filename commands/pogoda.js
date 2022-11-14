import axios from "axios";

async function getWeather(city) {
    return await axios.get(`https://wttr.in/${city}?format=j1&lang=pl`, {headers: {'Content-type': 'application/json'}})
    .then(async (res) => {
        return res.data
    })
    .catch(err => {
        //console.log(err)
        
        return null;
    })
}

export default async function hugC(channel, username, argument){
    if(!argument || argument === undefined) return;

    const usernameSmall = username.toLowerCase();
    const weather = await getWeather(argument);

    if(weather === null || weather && weather.current_condition.length === 0) return null;

    const {current_condition, nearest_area} = weather;

    if(weather === null) return `${usernameSmall}, coś się popsuło`;

    const pogoda = `${usernameSmall} w ${nearest_area[0].areaName[0].value} aktualnie jest ${current_condition[0].FeelsLikeC} stopni, na zewnątrz jest ${current_condition[0].lang_pl[0].value} a prędkość wiatru wynosi ${current_condition[0].windspeedKmph} km/h`;

    if(pogoda.length < 480){
        return pogoda;
    }else{
        return `${usernameSmall}, ${current_condition[0].FeelsLikeC} stopni - ${current_condition[0].lang_pl[0].value} - ${current_condition[0].windspeedKmph} km/h`
    }
}