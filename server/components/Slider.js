const { createElement: h } = require("react");
const Base = require("./Base");

module.exports = props => h(
    Base,
    Object.assign({}, props, {
        is: "input",
        css: Object.assign(
            {},
            {
                width: "100%",
            },
            props.css
        ),
    })
);
