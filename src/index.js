const chroma = require("chroma-js");
const hueName = require("./hue-name");

const generateLums = lum => {
    const integer = Math.floor(lum);
    const decimal = lum - integer;

    // Make sure we always have the base colour as one
    // of the shades by adding the decimal to each step
    const lums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map(n => n + decimal)
        .map(n => n / 10)
        .sort((a, b) => b - a);

    const selectedLums = [0, 3, 6, 8, 9].map(n => lums[n]);

    return [...selectedLums, ...lums];
};

const createArray = length => {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(i);
    }
    return arr;
};

const createHues = length => {
    const hueStep = 360 / length;
    return base => {
        const hues = createArray(length).map(n => (base + n * hueStep) % 360);

        return hues;
    };
};

const desat = n => hex => {
    const [h, s, l] = chroma(hex).hsl();
    return chroma.hsl(h, n, l).hex();
};

const createBlack = hex => {
    const d = desat(1 / 8)(hex);
    return chroma(d)
        .luminance(0.05)
        .hex();
};

const createShades = (hex, lum) => {
    // Generates luminance values based on base colour
    const lms = generateLums(lum);

    // Generates the different shades for each hex
    return lms.map(l => {
        return chroma(hex)
            .luminance(l)
            .hex();
    });
};

const createBaseShades = (hex) => {
    const lum = chroma(hex).luminance() * 10;
    const shades = createShades(hex, lum);
    return shades;
}

const createHueShades = (base, hue) => {
    // Go through base shades and generate equivalent for each hue
    const shades = base.map((shade) => {
        const [h, s, l] = chroma(shade).hsl();
        return chroma.hsl(hue, s, l).hex();
    })

    return shades;
}

// Mappers
const keyword = hex => {
    const [hue, sat] = chroma(hex).hsl();
    // if (sat < 0.5) {
    //     return "gray";
    // }
    const name = hueName(hue);
    return name;
};

// Reducer
const toObj = (a, color) => {
    const key = a[color.key] ? color.key + "2" : color.key;
    a[key] = color.value;
    return a;
};

const palx = (hex, hues = 12, options = {}) => {
    const color = chroma(hex);
    const colors = [];
    const [hue, sat, lte] = color.hsl();
    const lum = color.luminance();

    // Set number of different colours
    //const generatedHues = createHues(hues)(hue);
    const generatedHues = [hue, 278, 348, 167]

    // Generate the base shades from the original colour
    const baseShades = createBaseShades(hex);

    // Get remaining shades from list of hues
    generatedHues.forEach(h => {
        // Get colour with same saturation and lightness than base for each hue
        const c = chroma.hsl(h, sat, lte);
        const key = keyword(c);

        colors.push({
            key,
            value: createHueShades(baseShades, h)
        });
    });

    colors.push({
        key: "black",
        value: createBlack(hex),
    });

    colors.push({
        key: "gray",
        value: createShades(desat(1 / 8)(hex), lum),
    });

    const obj = Object.assign(
        {
            base: hex,
        },
        colors.reduce(toObj, {})
    );

    return obj;
};

module.exports = palx;
