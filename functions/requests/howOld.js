import axios from "axios";

const kids = ['ewroon', 'kasix', 'kubx', 'miszel', 'xth0rek', 'diables', 'matek', 'jacob4tv', 'qlnek', 'kamifn1', 'setty__',
'advisefn', 'xayoo_', 'popo', 'japczan', 'holak1337', 'vysotzky', 'dejvid_tibijski_zadymiarz', 'lukisteve',
'mlodziutki7', 'youngmulti', 'smerftv_', 'pisicela', 'grendy', 'tiger_scot', '1wron3k', 'sinmivak', 'DMGPOLAND','nieuczesana']

const teens = ['delordione', 'franio', 'szymoool', 'lewus', 'arquel', 'slayproxx', 'h2p_gucio', 'demonzz1', 'zony',
'rybsonlol_', 'vvarion', 'cinkrofwest', 'polsatgames', 'xmerghani', 'xntentacion', 'kaseko', 'ortis',
'mandzio', 'furazek', 'mrdzinold', 'sandrulaax', 'szzalony', 'mork','randombrucetv','tyrisftw','mokrysuchar', 'kozok', 'xype1337', 'zeekxd', 'playboistarki']

const dinozaurs = ['rockalone', 'izakooo', 'gluhammer', 'borys8', 'mkrr3', 'bixentehs', 'blackfireice', 'bonkol', 'saju',
'pago3', 'roocket__', 'overpow', 'kubon_', 'aikoiemil', 'janusz0821', 'indystarcraft', 'dmajszi',
'esl_csgo_pl', 'kezman22',
'kamileater', 'chesscompl', 'dawidczerw', 'gmhikaru', 'rajonesports', 'gmpakleza', 'jaskol95',
'jacexdowozwideo', 'grabagra']


// Bardzo możliwe że gdzieś się jebnąłem
// source: https://github.com/lewuss/TwitchAgeGuesser

async function whenUserCreated(user_login){
    return await axios.get(`https://api.twitchinsights.net/v1/user/status/${user_login}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channel = data.data;

        return channel.createdAt;
    })
    .catch(err => {
        console.log(err)
        return null;
    })
}

export default async function guessAge(channelName) {
    const whenCreated = await whenUserCreated(channelName);
    if(!whenCreated) return `${channelName} - Nie istnieje taki użytkownik na twitchtv BRUHMM`;

    let account_age = 2022 - new Date(whenCreated).getFullYear();
    const numbers = channelName.replace(/\D+/g, ' ').trim().split(' ').map(e => parseInt(e));

    for (let i = 0; i < numbers.length; i++) {
        const number = numbers[i];

        if([420, 69, 2137, 1337, 2115].includes(number)){
            //console.log("hehe numbers")

            account_age = account_age + 13;
        }
        // else if(1970 < number < 2009){
        //     console.log("grandp date")

        //     return new Date().getFullYear() - number;
        // } /* It's checking if the number is between 0 and 9. */
        else if(number === 2 && 9 >= number >= 0){
            //console.log("2000s")

            account_age = new Date().getFullYear()  % 100 - number;
        }else /* It's checking if the number is between 80 and 99. */
        if(number === 2 && 99 >= number >= 80){
            //console.log("1990s")

            account_age = new Date().getFullYear() - number - 1900;
        }
    }

    return await axios.get(`https://xayo.pl/api/mostWatched/${channelName}`, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const channels = data.data;
        let kid_num = 0
        let teen_num = 0
        let dinozaur_num = 0

        await Promise.all(
            channels.reverse().map((i, index) => {
                if(index === 15) return;

                if(kids.includes(i.streamer)){
                    kid_num += i.count
                }else if(teens.includes(i.streamer)){
                    teen_num += i.count
                }else if(dinozaurs.includes(i.streamer)){
                    dinozaur_num += i.count
                }
            })
        )
        const watchtime_all = kid_num + teen_num + dinozaur_num;
        const starting_age = 10 + account_age + 2 * (kid_num / watchtime_all) + 4 * (teen_num / watchtime_all) + 8 * (dinozaur_num / watchtime_all)

        return `Zgaduje że ${channelName} ma ${Math.round(starting_age)} lat jasperFajka `;
        
    })
    .catch(err => {
        console.log(err)
        return `${channelName} coś się rozjebało japierdole `;
    })
}