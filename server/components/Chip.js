const { createElement: h } = require("react");
const Base = require("./Base");
const chroma = require("chroma-js");

const cap = str => str.charAt(0).toUpperCase() + str.slice(1);

const format = str => {
    return cap(str).replace(/\d$/, " $&");
};

module.exports = ({ name, color }) =>
    h(
        Base,
        {
            p: 1,
            width: [1 / 2, 1 / 3, 1 / 10],
        },
        h(
            Base,
            {},
            h(Base, {
                px: 3,
                py: 4,
                bg: color,
            }),
            h(
                Base,
                {
                    p: 1,
                    css: {
                        display: "flex",
                    },
                },
                h(
                    Base,
                    {
                        fontSize: 0,
                        fontWeight: "bold",
                    },
                    name
                ),
                h(Base, { css: { flex: "1 1 auto" } }),
                h(
                    Base,
                    {
                        fontSize: 0,
                    },
                    color
                )
            ),
            h(
                Base,
                {
                    p: 1,
                    css: {
                        display: "flex",
                    },
                },
                h(
                    Base,
                    {
                        fontSize: 0,
                    },
                    chroma(color).hsl().map(v => parseFloat(v).toFixed(2)).join(" / ")
                )
            ),
            h(
                Base,
                {
                    p: 1,
                    css: {
                        display: "flex",
                    },
                },
                h(
                    Base,
                    {
                        fontSize: 0,
                        fontWeight: "bold",
                    },
                    "Luminance"
                ),
                h(Base, { css: { flex: "1 1 auto" } }),
                h(
                    Base,
                    {
                        fontSize: 0,
                    },
                    parseFloat(chroma(color).luminance()).toFixed(2)
                )
            ),
            h(
                Base,
                {
                    p: 1,
                    css: {
                        display: "flex",
                    },
                },
                h(
                    Base,
                    {
                        fontSize: 0,
                        fontWeight: "bold",
                    },
                    "C/W"
                ),
                h(Base, { css: { flex: "1 1 auto" } }),
                h(
                    Base,
                    {
                        fontSize: 0,
                        color: parseFloat(chroma.contrast(color, "#fff")).toFixed(2) < 3 ? "red" : "currentColor",
                    },
                    parseFloat(chroma.contrast(color, "#fff")).toFixed(2)
                )
            ),
            h(
                Base,
                {
                    p: 1,
                    css: {
                        display: "flex",
                    },
                },
                h(
                    Base,
                    {
                        fontSize: 0,
                        fontWeight: "bold",
                    },
                    "C/B"
                ),
                h(Base, { css: { flex: "1 1 auto" } }),
                h(
                    Base,
                    {
                        fontSize: 0,
                        color: parseFloat(chroma.contrast(color, "#000")).toFixed(2) < 3 ? "red" : "currentColor",
                    },
                    parseFloat(chroma.contrast(color, "#000")).toFixed(2)
                )
            )
            // h(Base, {
            //   fontSize: 0,
            //   fontWeight: 'bold'
            // }, chroma(color).hsl().map(v => parseFloat(v).toFixed(2)).join(" / ")),
        )
    );
