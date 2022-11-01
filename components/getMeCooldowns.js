export default function getMeCooldowns(channel) {

    if(channel === "#mrdzinold"){
        return { classic: 7000, longer: 15000, special: 30000 }
    }else{
        return { classic: 4000, longer: 15000, special: 30000 }
    }
}