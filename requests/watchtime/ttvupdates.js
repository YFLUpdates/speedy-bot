import fetch from 'node-fetch';

export default async function ttvupdates(user_login, target_channel){
    const res = await fetch(`https://api.yfl.es/v1/user/find/${user_login}?channel=${target_channel}`).catch(error => {console.log(error);});
    
    if(res.status !== 200){
        return null;
    }

    let data = await res.json();

    return data;
}