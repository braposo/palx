const {
  createElement: h,
  Fragment
} = require('react')
const { renderToStaticNodeStream } = require('react-dom/server')

const head = require('./head')
const App = require('./components/App')
const Header = require('./components/Header')
const Form = require('./components/Form')
const Toc = require('./components/Toc')
const About = require('./components/About')
const Colors = require('./components/Colors')
const Downloads = require('./components/Downloads')
const Footer = require('./components/Footer')

module.exports = (req, res, { color, colors }) => {
  res.setHeader('Content-Type', 'text/html')

  res.write(head({ color }))
  res.write('<div style="max-width:1280px;margin:auto;padding:32px">')


  const stream = renderToStaticNodeStream(
    h(Fragment, null,
      h(Header, { color, colors }),
      h(Form, { color, colors }),
      h(Toc, { colors }),
      h(About),
      h(Colors, { colors }),
      h(Downloads, { color, colors }),
      h(Footer, { color })
    )
  )

  // const stream = renderToStaticNodeStream(
  //   h(App, null, { color, colors })
  // )


  stream.pipe(res, { end: false })

  stream.on('end', () => {
    res.write('</div>')
    res.end()
  })

  stream.on('error', err => {
    console.log(err)
    res.end()
  })
}
