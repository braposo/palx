const { createElement: h } = require("react");
const Base = require("./Base");
const Chip = require("./Chip");

module.exports = ({ name, values }) =>
    h(
        Base,
        {
            id: name,
            mb: 4,
        },
        h(
            Base,
            {
                is: "h4",
                fontSize: 2,
                mb: 1,
            },
            `Shades - ${name}`
        ),
        h(
            Base,
            {
                mx: -2,
                css: {
                    display: "flex",
                    flexWrap: "wrap",
                },
            },
            values.map((v, i) =>
                h(Chip, {
                    key: i,
                    name: i + 1,
                    color: v,
                })
            )
        ),
        h(Base, {
            is: "hr",
            style: {
                background: "#eee",
                height: 10,
                border: 0,
                marginTop: 30,
            },
        })
    );
