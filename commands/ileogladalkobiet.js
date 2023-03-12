import { twitchlogger } from "../requests/watchtime/index.js";
import { promises as fs } from "fs";
import humanizeDuration from "humanize-duration";

export default async function ileogladalkobiet(channel, user_login) {
  const request = await twitchlogger(user_login);
  const streamerki = JSON.parse(await fs.readFile("./girls.json", "UTF-8"));
  let time_all = 0;
  let time_female = 0;

  if (request === null) {
    return `Nie byłem w stanie sprawdzić kanału ${user_login} jasperSad`;
  }

  request.userChannels.sort((a, b) => {
    return b.count - a.count;
  });

  await Promise.all(
    request.userChannels.map((i) => {

      const indexOfObjectTop1 = request.channels.findIndex((object) => {
        return object.broadcasterId === i.broadcasterId;
      });

      if (
        streamerki.includes(
          request.channels[indexOfObjectTop1].broadcasterLogin
        )
      ) {
        time_female += i.count * 5;
      } else {
        time_all += i.count * 5;
      }
    })
  );
  const percentage = Math.round((time_female / time_all) * 100, 2);
  const time = humanizeDuration(time_female * 60000, { language: "pl" });

  if (time_female === 0) {
    return `FIRE ${user_login} nigdy nie oglądał/a żadnej polskiej streamerki GIGACHAD`;
  }

  return `PogO ${user_login} oglądał/a streamerki przez ${time}, co sprawia, że oglądał/a streamerki przez ${percentage}% swojego czasu na PL Twitch.`;
}
