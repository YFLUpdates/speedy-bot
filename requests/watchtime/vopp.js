import fetch from 'node-fetch';

export default async function vopp(user_login){
    const res = await fetch(`https://wcapi.vopp.top/user/xayo/${user_login}`);
    if(res.status !== 200){
        return null;
    }

    let data = await res.json();

    return data;
}