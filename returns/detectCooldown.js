import { getMeCooldowns } from "../components/index.js";

export default function detectCooldown(lastCommand, expectedCD){
    if (lastCommand > (Date.now() - getMeCooldowns()[`${expectedCD}`])) {
        return true;
    }

    return null;
}