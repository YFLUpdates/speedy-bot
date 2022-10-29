import axios from "axios";
import humanizeDuration from "humanize-duration";
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
        let time_all = 0
        let time_female = 0

        await Promise.all(
            channels.map((i) => {
                if(streamerki.includes(i.streamer)){
                    time_female += i.count * 5
                }else{
                    time_all += i.count * 5
                }
            })
        )
        const percentage = Math.round(time_female / time_all * 100, 2);
        const time = humanizeDuration(time_female* 60000, { language: "pl" });

        if(time_female === 0){
            return `FIRE ${Censor(channelName)} nigdy nie oglądał żadnej polskiej streamerki GIGACHAD`
        }else{
            return `PogO ${Censor(channelName)} oglądał streamerki przez ${time}, co sprawia, że oglądał streamerki przez ${percentage}% swojego czasu na PL Twitch.`
        }
    })
    .catch(err => {
        console.log(err)
    })
}