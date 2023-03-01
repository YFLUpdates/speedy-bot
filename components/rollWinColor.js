import sha256 from "sha256";
import * as math from "mathjs";
import randomStr from "../functions/randomStr.js";

export default async function rollWinColor() {
  const hash = randomStr(
    64,
    "123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
  );
  const currentRolllotery = randomStr(7, "123456789");
  let roll = 0;
  let sh = sha256(hash + "-" + currentRolllotery);
  roll = sh.substr(0, 8);
  roll = parseInt(roll, 16);
  roll = math.abs(roll) % 15;
  let winColor = "";

  if (roll == 0) {
    winColor = "green"
  }
  if (roll > 0 && roll < 8) {
    winColor = "red"
  }
  if (roll > 7 && roll < 15) {
    winColor = "black"
  }

  return winColor;
}
