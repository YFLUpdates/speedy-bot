import axios from "axios";
import {Censor} from "../index.js"

const streamerki = [
    "angela35",
    "Aleexis_66",
    "aspazja",
    "melod_ja",
    "senekofobia",
    "sandrulaax",
    "cathlynes",
    "eyshi_",
    "amala__",
    "aiszjaa",
    "asaiika",
    "studytme",
    "akanemsko",
    "bunny_marthy",
    "kasix",
    "manianeczka",
    "klaudiacroft",
    "batqueen",
    "maailinh",
    "shini_waifu",
    "nieuczesana",
    "urqueeen",
    "yuna",
    "malmaa",
    "avalogy",
    "lempiank",
    "angela_halee_",
    "mrs_honey",
    "shina4",
    "wpatka",
    "chocolate_puma",
    "makito_",
    "tyrisftw",
    "shiianah",
    "neviina",
    "mamiko",
    "szysszka_",
    "kasia_22",
    "angelkacs",
    "brysiunya",
    "stazjaa",
    "navcia",
    "mrskrysia",
    "wichurka_",
    "faminameow",
    "andreman",
    "anieyo_",
    "hitoszka",
    "kiiissa",
    "karolcia96",
    "misilia",
    "sysula",
    "zasia_",
    "madien",
    "brunecia",
    "liinshii",
    "angieee5",
    "suziannna",
    "9kier",
    "ikusiaa",
    "mejwix",
    "tysiuulka",
    "aellinis",
    "yoive",
    "annica88",
    "marykateanlive",
    "frytka",
    "emidzemi",
    "viandherart",
    "mrspatricias",
    "rubciaatv",
    "al3xandras",
    "olutka_malutka",
    "marlik_",
    "shaaay",
    "ssandiix",
    "naajs",
    "reniferka_",
    "andusia",
    "vayana",
    "grubamruwa"
]

export default async function getChatters(channelName) {
    return await axios.get(`https://xayo.pl/api/mostWatched/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let num = 0
        let fav_streamer = []

        await Promise.all(
            channels.map((i) => {
                if(streamerki.includes(i.streamer) && i.count > 12){
                    num += 1;
                    fav_streamer.push(i.streamer);

                    if(num === 3) return;
                }
            })
        )
        if(num > 0){
            return `PogO Ulubione streamerki ${Censor(channelName)}: ${fav_streamer.join(', ')}`;
        }else{
            return `FIRE ${Censor(channelName)} nigdy nie oglądał żadnej polskiej streamerki GIGACHAD`;
        }
    })
    .catch(err => {
        console.log(err)
    })
}