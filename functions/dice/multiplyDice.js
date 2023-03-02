const multiplyDice = function(dice1, dice2, dice3) {

  if(dice1 === 6 && dice2 === 6 && dice3 === 6){
    return 66;
  }

  if(dice1 === 3 && dice2 === 3 && dice3 === 3){
    return 33;
  }

  if((dice1 + dice2 + dice3) === 4 || (dice1 + dice2 + dice3) === 8 || (dice1 + dice2 + dice3) === 12 || (dice1 + dice2 + dice3) === 16){
    return 2;
  }

  if((dice1 + dice2 + dice3) === 5 || (dice1 + dice2 + dice3) === 10 || (dice1 + dice2 + dice3) === 15){
    return 2;
  }

  if((dice1 + dice2 + dice3) === 7 || (dice1 + dice2 + dice3) === 14){
    return 2;
  }

  return null;

}
export default multiplyDice;