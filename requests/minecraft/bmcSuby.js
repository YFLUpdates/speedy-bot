import fetch from 'node-fetch';

export default async function bmcSuby(){
    const res = await fetch(`https://api.yfl.es/bmc-suby`);
    
    if(res.status !== 200){
        return null;
    }

    let data = await res.json();

    return data;
}