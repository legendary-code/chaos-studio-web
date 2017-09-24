function fact(a,b) {
    if (b === undefined) {
        b = a;
        a = 1;
    }

    if (a > b) {
        return NaN;
    }

    let p = 1;

    while (a !== b) {
        p *= b--;
    }

    return p;
}

function ipow(a,b) {
    if (b === 0) {
        return 1;
    }

    let p = 1;

    for (let i = 0; i < b; ++i) {
        p *= a;
    }

    return p;
}

module.exports = { fact, ipow };