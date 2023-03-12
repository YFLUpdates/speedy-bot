import fetch from 'node-fetch';

export default async function twitchlogger(user_login){
    const res = await fetch(`https://twitchlogger.pl/Tracker/SerachUser/${user_login}`);
    if(res.status !== 200){
        return null;
    }

    let data = await res.json();

    return data;
}