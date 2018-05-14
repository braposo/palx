const chroma = require("chroma-js");
const hueName = require("./hue-name");

const generateLums = lum => {

    // This is very manual for now but ideally would replace
    // the closes one with the base colour lum.
    // This is just to make sure we display the base colour.
    const lums = [0.2, 0.4, 0.8, 1.4, 2.4, lum, 4.5, 5.8, 7.4, 8.7]
        .map(n => n / 10)
        .sort((a, b) => b - a);

    return lums;
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

const createBaseShades = hex => {
    const lum = chroma(hex).luminance() * 10;
    const shades = createShades(hex, lum);
    return shades;
};

const createScaleShades = hex => {
    const shades = chroma
        .scale(["#fff", hex, "#000"])
        .domain([0, 5, 10])
        .colors(12)
        .slice(1, 11);
    return shades;
};

const createHueShades = (base, hue, lockLum = true) => {
    // Go through base shades and generate equivalent for each hue
    const shades = base.map(baseColour => {
        // break baseColour in hue, saturation, lightness
        const [h, s, l] = chroma(baseColour).hsl();

        // gets new colour based on base colour saturation and lightness
        // just changes hue
        const newColour = chroma.hsl(hue, s, l);

        // if luminance is locked, makes final colour same luminance
        // as base colour
        if (lockLum) {
            // get luminance from base colour
            const lum = chroma(baseColour).luminance();
            return newColour.luminance(lum).hex();
        }

        // otherwise returns new colour
        return newColour.hex();
    });

    return shades;
};

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
    // const generatedHues = createHues(hues)(hue);

    // Set a specific list of hues to be generated
    const generatedHues = [hue, 113, 180, 215, 249, 275, 306, 348];

    // Generate the base shades from the original colour
    const baseShades = createBaseShades(hex);

    // Generate the base shades from the original colour using
    // the colour scale in chroma instead

    // const scaleShades = createScaleShades(hex);

    // colors.push({
    //     key: "scale",
    //     value: scaleShades,
    // });

    // Generates colours from list of hues keeping base luminance
    generatedHues.forEach(h => {
        // Get colour with same saturation and lightness than base for each hue
        const c = chroma.hsl(h, sat, lte);
        const key = keyword(c);

        colors.push({
            key,
            value: createHueShades(baseShades, h, true),
        });
    });

    colors.push({
        key: "black",
        value: createBlack(hex),
    });

    colors.push({
        key: "gray",
        value: createShades(desat(1 / 6)(hex), lum),
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
