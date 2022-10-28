export default function ratioFunc(ratio) {
    this.ratio = ratio;
}

ratioFunc.ewron = (ratio) => {
    if (ratio < 0.3){
        return "jest czysty(a) okok";
    }else if(ratio < 0.5){
        return "jest widzem ewrona jasperSTARE";
    }else if(ratio > 0.5){
        return "jest ultra zaklinowany(a) xddd";
    }else{
        return "jest czysty(a) okok";
    }
};

ratioFunc.yfl = (ratio) => {
    if (ratio < 0.3){
        return "nie jest widzem yfl";
    }else if(ratio < 0.5){
        return "jest widzem yfl PogU";
    }else if(ratio > 0.5){
        return "jest giga koneserem yfl PogU FIRE";
    }else{
        return "nie jest widzem yfl";
    }
};