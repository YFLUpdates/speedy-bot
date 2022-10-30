import axios from "axios";
import dotenv from "dotenv";
import {getChatters} from "../requests/index.js";
import chunks from "./chunks.js";
import {Censor} from "../index.js";
// import jobToken from "../../components/jobToken.js";
// import update_token from "./update_token.js";

dotenv.config()

// Bazowane na kodzie Lewusa
// https://github.com/lewuss/TwitchUserTracker
// Jedna z cięższych rzeczy jakie przepisywałem, mam dość - 29.10.2022 15:47
// ~ xanax
// const ACCESS_TOKEN = jobToken.get();
const BASE_URL = "https://api.twitch.tv/helix/";
const HEADERS = {'Client-ID': process.env.CLIENT_ID, 'Authorization': "Bearer " + process.env.ACCESS_TOKEN, 'Content-type': 'application/json'};

function waitforme(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function get_response(query, _attemptCount = 0){
    const url = BASE_URL + query
    return await axios.get(url, {headers: HEADERS})
    .then(async (res) => {
        return res.data;
    })
    .catch(async (err) => {

        // console.log(err)

        // if(err.response.data.status === 401 && err.response.data.error === "Unauthorized"){
        //     const token = await update_token();

        //     if(token.error) return;

        //     console.log(token.access_token)

        //     jobToken.update(token.access_token)

        // }

        if(_attemptCount < 3) {
            waitforme(500);

            return get_response(query, _attemptCount + 1);
        }

        console.log(err)
        //console.log('get_response returned null')
        return {data: null};
    })
} 
async function get_stream_info_query_from_list(users){
    let query = 'streams?';

    await Promise.all(
        users.map((i) => {
            query += "user_id=" + i + "&";
        })
    )

    return query;
}
async function check_if_live(user_ids){
    const query = await get_stream_info_query_from_list(user_ids)
    const response = await get_response(query);
    let liveChannels = [];

    // console.log("check_if_live ", response)
    
    if(response.data === null) return;

    await Promise.all(
        response.data.map((i) => {
            if(i.type === "live"){
                liveChannels.push(i.user_login)
            }
        })
    );

    return liveChannels;

}
async function get_live_from_follows(follows){
    let live_follows = [];
    const tmp_list = [...chunks(follows, 100)];

    //DZIAŁA

    await Promise.all(
        tmp_list.map(async (i) => {
            // waitforme(500)
            const checkThem = await check_if_live(i);

            //console.log(checkThem)

            live_follows = live_follows.concat(checkThem)
            //live_follows += await check_if_live(i)
        })
    )

    //console.log(live_follows)
    return live_follows;

}
function get_top_streams_query(language){
    return `streams?first=100&language=${language}`
}
async function get_top_streams_names(){
    let streams = [];
    const languages = ["pl","en"];

    await Promise.all(
        languages.map(async (i) => {
            const query = get_top_streams_query(i)
            const response = await get_response(query)

            await Promise.all(
                response.data.map(async (i) => {
                    streams.push(i.user_login)
                })
            )

        })
    )
    return streams;
}
function get_user_query(user_login){
    return 'users?login='+user_login;
}
async function get_user_id(user_login){
    const query = get_user_query(user_login)
    const response = await get_response(query)

    //console.log('get_user_id ', response.data)

    if(response.data && response.data[0]){
        return response.data[0].id;
    }else{
        return null;
    }
}
async function get_follows_query(user_login, pagination){
    const user_id = await get_user_id(user_login);

    if(user_id === null) return null;

    return `users/follows?from_id=${user_id}&first=100&after=${pagination}`;
}
async function get_all_follows(user_id){
    let pagination = "";
    let Follows = [];

    await loopFollows();

    async function loopFollows(){
        const query = await get_follows_query(user_id, pagination);

        if(query === null) return null;
        
        const response = await get_response(query);

        //console.log('loopFollows ', response)

        if(response.data === null) return Follows;

        await Promise.all(
            response.data.map((i) => {
                Follows.push(i.to_id)
            })
        ) 
        if(response.pagination.cursor){
            pagination = response.pagination.cursor;

            waitforme(500)
            await loopFollows();
            
        }
    }

    return Follows;

}
async function check_if_user_in_channel(user){
    let imOnIt = [];
    const top_streams = await get_top_streams_names();
    const follows = await get_live_from_follows(await get_all_follows(user));
    const merged = top_streams.concat(follows);

    //console.log("Follows ", follows)
    await Promise.all(
        merged.map(async (i) => {
            const chatters = await getChatters(i)

            if(chatters.find(i => i.name === user) !== undefined){

                if(imOnIt.includes(i)) return;

                //console.log("INSIDE ", i);

                imOnIt.push(i)
            }
        })
    )
    //console.log("Ready chat ", imOnIt)
    const channels_message = imOnIt.join(', ');

    if(imOnIt.length === 0){
        return `${Censor(user)} nie ogląda żadnego kanału Sadge`;
    }else if(channels_message.length < 400){
        return `aha ${Censor(user)} ogląda kanały: ${channels_message}`;
    }else{
        return `aha ${Censor(user)} ogląda ${imOnIt.length} kanałów. Jest ich tyle, że na da się ich wypisać GG Sadge`;
    }
}


export default check_if_user_in_channel;