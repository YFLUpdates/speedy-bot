import getYFLSMP from "../functions/getYFLSMP.js";

export default async function SelectStreams(){
    const request = await getYFLSMP();
    let streams = []

    if (request.status === 200) {
      
      await Promise.all(
        request.data.map((e) => {
          if (e.game_name !== "Minecraft") {
            return;
          }
          const array = e.title.toUpperCase().split(" ");
          if (
            array.includes("YFL") ||
            array.includes("YFLSMP") ||
            array.includes("[YFL]") ||
            array.includes("[YFLSMP]") ||
            array.includes("SMP") ||
            array.includes("[YFL SMP]") ||
            array.includes("[SMP]") ||
            array.includes("[YFL") ||
            array.includes("SMP]") ||
            array.includes("GILDIA") ||
            array.includes("WALKA") ||
            array.includes("WOJNA")
          ) {
            streams.push({
              nickname: e.user_name,
              login: e.user_login,
              viewers: e.viewer_count
            })
          }
  
          return;
        })
      );


      return {
        last_update: new Date(),
        streams: streams
      }
    }
    return null;
}