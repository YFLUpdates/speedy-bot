import multiplyDice from "./multiplyDice.js";
import gambleUpdate from "../yfles/gambleUpdate.js";
import {rollDice} from "../../components/dice/index.js";

export default async function robotDice(cleanSender, cleanChannel, argumentClean2 ){
    const dice1 = await rollDice();
    const dice2 = await rollDice();
    const dice3 = await rollDice();
    const betPoints = Number(argumentClean2);
    const multiplyAmount = multiplyDice(dice1, dice2, dice3);

    if(multiplyAmount === null){
        const updatePoints = await gambleUpdate(cleanChannel, `-${betPoints}`, cleanSender)

        if(updatePoints === null){
            return `${cleanSender} coś się rozjebało przy aktualizowaniu punktów aha `;
        }

        return `${cleanSender} przegrałeś/aś wszystko jasperSmiech - 🎲${dice1} 🎲${dice2} 🎲${dice3}`
    }

    const winAmount = (betPoints * multiplyAmount);
    const updatePoints = await gambleUpdate(cleanChannel, `+${winAmount - betPoints}`, cleanSender)

    if(updatePoints === null){
        return `${cleanSender} coś się rozjebało przy aktualizowaniu punktów aha `;
    }

    if(multiplyAmount === 66){
        return `${cleanSender} szatańska wygrana ${winAmount} okurwa FIRE x66 - 🎲${dice1} 🎲${dice2} 🎲${dice3} `;
    }

    if(multiplyAmount === 33){
        return `${cleanSender} szczęśliwa trójka ${winAmount} PartyKirby 🍀 🍀 x33 - 🎲${dice1} 🎲${dice2} 🎲${dice3} `;
    }

    return `${cleanSender} wygrałeś/aś ${winAmount} punktów okurwa - 🎲${dice1} 🎲${dice2} 🎲${dice3}`;
}