const emojiColor = function(data) {
    let color;
    switch (data) {
      case "black":
        color = "⬛";
        break;
      case "red":
        color = "🟥";
        break;
      case "green":
        color = "🟩";
        break;
      default:
        color = "⬜";
    }
    return color
}
export default emojiColor;