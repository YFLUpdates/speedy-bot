export default function censorGrubamruwa(args) {
  if (
    (args.includes("poka") && args.includes("cyce")) ||
    (args.includes("poka") && args.includes("cycuszki")) ||
    (args.includes("poka") && args.includes("cycki")) ||
    (args.includes("fajne") && args.includes("cyce")) ||
    (args.includes("siema") && args.includes("schudniesz")) ||
    (args.includes("siema") && args.includes("schudnij")) ||
    (args.includes("ale") && args.includes("tank")) ||
    (args.includes("elo") && args.includes("cysterna")) ||
    (args.includes("ale") && args.includes("cysie")) ||
    args.includes("schudnij") ||
    (args.includes("fajne") && args.includes("cycuszki"))
  ) {
    return true;
  }
  return null;
}
