const { createElement: h, Component } = require("react");
const chroma = require("chroma-js");
const { Arrow } = require("reline");

const Base = require("./Base");
const Label = require("./Label");
const Input = require("./Input");
const Button = require("./Button");
const Slider = require("./Slider");

const dehash = str => str.replace(/^#/, "");

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = { currentColor: props.color };
        this.updateColour = this.updateColour.bind(this);
    }

    updateColour(event) {
        const luminance = chroma(this.props.color).luminance();
        const [h, s, l] = chroma(this.props.color).hsl();

        this.setState({ currentColor: chroma.hsl(event.target.value, s, l).luminance(luminance).hex() });
    }

    render() {
        const { color, colors } = this.props;

        return h(
            Base,
            {
                mb: 3,
            },
            h(
                Label,
                {
                    htmlFor: "color",
                },
                "Base Color"
            ),
            h(
                Base,
                {
                    is: "form",
                    action: "/",
                    mx: -1,
                    css: {
                        display: "flex",
                        flexWrap: "wrap",
                    },
                },
                h(
                    Base,
                    {
                        css: {
                            display: "flex",
                        },
                        width: [1, 1 / 3, 1 / 5],
                        px: 1,
                    },
                    h(Base, {
                        width: 1,
                        py: 3,
                        bg: color,
                    })
                ),
                h(
                    Base,
                    {
                        width: [1, 2 / 3, 4 / 5],
                        px: 1,
                        css: {
                            display: "flex",
                            fontFamily: '"Roboto Mono", Menlo, monospace',
                        },
                    },
                    h(
                        Base,
                        {
                            fontSize: 6,
                            css: {
                                position: "relative",
                            },
                        },
                        "#"
                    ),
                    h(Input, {
                        id: "color",
                        name: "color",
                        defaultValue: dehash(color),
                        pattern: "([0-9A-Fa-f]{3}){1,2}",
                        colors,
                        fontSize: 6,
                        css: {
                            paddingLeft: "1em",
                            marginLeft: "-1em",
                        },
                    }),
                    h(
                        Button,
                        {
                            p: 1,
                            color,
                            title: "Change Color",
                        },
                        h(Arrow, {
                            strokeWidth: 2.25,
                            size: 32,
                        })
                    )
                ),
                h(
                    Base,
                    {
                        width: 1,
                        py: 3,
                    },
                    h(
                        Base,
                        {
                            css: {
                                display: "flex",
                            },
                            width: 1,
                            px: 1,
                        },
                        h(Base, {
                            width: 1 / 5,
                            py: 3,
                            bg: this.state.currentColor,
                        }),
                        h(
                            Base,
                            {
                                p: 2,
                                width: 1 / 5,
                                fontSize: 1,
                                css: {
                                    position: "relative",
                                },
                            },
                            chroma(this.state.currentColor).hex()
                        ),
                        h(Slider, {
                            min: 0,
                            max: 360,
                            defaultValue: parseFloat(chroma(this.state.currentColor).hsv()[0]).toFixed(2),
                            onChange: this.updateColour,
                            step: 1,
                        })
                    )
                )
            )
        );
    }
}

module.exports = Form;
