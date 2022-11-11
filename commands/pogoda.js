import axios from "axios";

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
    const usernameSmall = username.toLowerCase();
    const weather = await getWeather(argument);

    if(weather === null) return `${usernameSmall}, coś się popsuło`;

    if(weather.temperature === '') return `${usernameSmall} takie miasto nie istnieje aha`;

    const pogoda = `${usernameSmall} w ${argument} aktualnie jest ${weather.temperature}, na zewnątrz jest ${weather.description} a prędkość wiatru wynosi ${weather.wind}`;

    if(pogoda.length < 480){
        return pogoda;
    }else{
        return `${usernameSmall}, ${weather.temperature} - ${weather.description} - ${weather.wind}`
    }
}