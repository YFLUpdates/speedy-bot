export default function Censored(text) {
    var regex = /nigger|nugger|pedał|czarnuch|killjews|sex|vagina|whore|hopeyoudie|pedal/gi;
    
    var str = text;

    str = str.replace(regex, "xspeedyq");

    return str;
}