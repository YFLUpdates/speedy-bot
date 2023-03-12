import { twitchlogger } from "../requests/watchtime/index.js";
import { promises as fs } from "fs";

export default async function ksiezniczki(channel, user_login) {
  const request = await twitchlogger(user_login);
  const streamerki = JSON.parse(await fs.readFile("./girls.json", "UTF-8"));
  let num = 0;
  let fav_streamer = [];

  if (request === null) {
    return `Nie byłem w stanie sprawdzić kanału ${user_login} jasperSad`;
  }

  request.userChannels.sort((a, b) => {
    return b.count - a.count;
  });

  await Promise.all(
    request.userChannels.map((i) => {
      if (num === 3) return;

      const indexOfObjectTop1 = request.channels.findIndex((object) => {
        return object.broadcasterId === i.broadcasterId;
      });

      if (streamerki.includes(request.channels[indexOfObjectTop1].broadcasterLogin) && i.count > 12) {
        num += 1;

        fav_streamer.push(request.channels[indexOfObjectTop1].broadcasterLogin);
      }

    })
  );

  if (num > 0) {
    return `PogO Ulubione streamerki ${user_login}: ${fav_streamer.join(
      ", "
    )}`;
  }

  return `FIRE ${user_login} nigdy nie oglądał/a żadnej polskiej streamerki GIGACHAD`;
}
