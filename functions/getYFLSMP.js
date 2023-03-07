import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

async function getToken() {
  try {
    const response = await fetch(
      `https://api.yfl.es/v1/settings/twitch/token`,
      {
        headers: {
          "Content-type": "application/json",
          clientID: process.env.YFL_CLIENT_ID,
          token: process.env.YFL_TOKEN,
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      return data.value;
    }

    return null;
  } catch (error) {
    return null;
  }
}
export default async function getYFLSMP() {
  const token = await getToken();
  if (token === null) {
    return { message: "twitch api error", status: 500 };
  }

  try {
    const params = [
        "244310065", //ADRIAN1G_ID
        "718236928", //BANDURACARTEL_ID
        "246961124", //mork
        "85039743", //MRDZINOLD_ID
        "720775570", //XKALESON_ID
        "65866610", //XMERGHANI_ID
        "28141853", //YOUNGMULTI_ID
        "138649235", //dobry
        "91229603", //popo
        "89951849", //lukisteve
        "91438833", //mokry
        "153901266", //mlodziutki
        "96308352", //vysotzky
        "112431838", //olsza
        "32401669", //lalastyle
        "101286926", //zony
        "211397835", //masle1
        "32027530", //pisicela
        "247967499", //100pa_
        "112589052", //eizowsky
        "52878701", //vgz2k
        "91538537", //pevor13
        "125658197", //nexe_
        "411842058", //shiianah,
        "124026289", //parisplatynov
        "46152491", //testree
        "84413008", //cinkrofwest
        "484019542", //grubamruwa
        "41180913", //navcia
        "130530322", //kubx
        "214022577", //matek
        "72492234", //bladii309
        "157255697", //miszel
        "265367685", //qtjanina
        "68506724", //anterias
        "92072223", //ortis
        "236598813", //yoshi
        "29357753", //zahaczai
        "31468208", //kapitanalien
        "32119244", //dzuniorjr
        "884266115", //rybsongames_
        "25031111", //ctsg
        "57361005", //slayproxx
        "102098555", //kasix
        "416083610", //remsua
        "28151265", //kubson92
        "69616738", //xth0rek
        "130271562", //diables
        "27784991", //skkf
        "74252955", //mamiko
        "440522125", //pokojwytrzezwien
        "139316419", //lilqki
        "788430210", //achtenwlodar
        "85463072", //randombrucetv
    ].join("&user_id=");
    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_id=${params}`,
      {
        headers: {
          "Content-type": "application/json",
          "Client-ID": process.env.CLIENT_ID,
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await response.json();

    if (response.status === 200) {
      return {status: 200, data: data.data};
    }

    return { message: "coś poszło nie tak", status: 500 };
  } catch (error) {
    return { message: "coś poszło nie tak", status: 500 };
  }
}
