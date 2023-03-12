import { twitchlogger } from "../requests/watchtime/index.js";
import humanizeDuration from "humanize-duration";

export default async function ileogladalkobiet(channel, user_login) {
  const request = await twitchlogger(user_login);
  let time_all = 0;

  if (request === null) {
    return `Nie byłem w stanie sprawdzić kanału ${user_login} jasperSad`;
  }

  request.userChannels.sort((a, b) => {
    return b.count - a.count;
  });

  await Promise.all(
    request.userChannels.map((i) => {

      time_all += i.count * 5;
    })
  );

  const date_math = Math.abs(new Date() - new Date(2021, 7, 26));
  const datediff_min = Math.floor((date_math / 1000) / 60);
  
  const percentage = Math.round((time_all / datediff_min) * 100, 2);
  const time = humanizeDuration(time_all * 60000, { language: "pl" });

  return `${user_login} spedził/a ${time} na PL twitch od 26 lipca, co daje ${percentage}% jego/j życia.`;
}
