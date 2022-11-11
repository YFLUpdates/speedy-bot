import axios from "axios";

function onlySpaces(str) {
    return str.trim().length === 0;
}
async function getWeather(city) {
    return await axios.get(`https://goweather.herokuapp.com/weather/${city}`, {headers: {'Content-type': 'application/json'}})
    .then(async (res) => {
        return res.data
    })
    .catch(err => {
        console.log(err)
        
        return null;
    })
}

export default async function hugC(channel, username, argument){
    if(!argument || onlySpaces(argument)) return;

    const usernameSmall = username.toLowerCase();
    const weather = await getWeather(argument);

    if(weather === null) return `${usernameSmall}, coś się popsuło`

    return `${usernameSmall} w ${argument} aktualnie jest ${weather.temperature}, na zewnątrz jest ${weather.description} a prędkość wiatru wynosi ${weather.wind}`;

}