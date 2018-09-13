const { createElement: h } = require('react')
const nano = require('nano-style')
const tag = require('clean-tag').default
const {
  space,
  color,
  fontSize,
  fontWeight,
  textAlign,
  width,
} = require('styled-system')

const css = props => props.css

const tag2 = props => { if(props.onChange != null) { console.log(props.onChange); } return h(tag, props); }

const Base = nano(tag2)(
  space,
  color,
  fontSize,
  fontWeight,
  textAlign,
  width,
  css
)

Base.displayName = 'Base'

module.exports = Base
