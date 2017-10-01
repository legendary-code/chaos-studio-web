function hslToRgb(h,s,l) {
    // h should be in degrees
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const f = h / 60;
    const x = c * (1 - Math.abs(f % 2 - 1));
    let r,g,b;

    switch (Math.floor(f)) {
        case 0:
            r=c; g=x; b=0;
            break;
        case 1:
            r=x; g=c; b=0;
            break;
        case 2:
            r=0; g=c; b=x;
            break;
        case 3:
            r=0; g=x; b=c;
            break;
        case 4:
            r=x; g=0; b=c;
            break;
        case 5:
            r=c; g=0; b=x;
            break;
        default:
            r=0; g=0; b=0;
            break;
    }

    const m = l - 0.5 *c;
    return [
        r + m,
        g + m,
        b + m
    ];
}

module.exports = {
    hslToRgb
};
