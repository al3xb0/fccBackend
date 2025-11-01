const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Request Header Parser Microservice. Use GET /api/whoami')
})

app.get('/api/whoami', (req, res) => {
  const forwarded = req.headers['x-forwarded-for'] || req.headers['x-real-ip']
  let ipaddress = ''
  if (forwarded) {

    ipaddress = String(forwarded).split(',')[0].trim()
  } else if (req.ip) {
    ipaddress = req.ip
  } else if (req.connection && req.connection.remoteAddress) {
    ipaddress = req.connection.remoteAddress
  }

  const acceptLang = req.headers['accept-language'] || ''
  const language = String(acceptLang).split(',')[0]

  const software = req.headers['user-agent'] || ''

  res.json({ ipaddress, language, software })
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Request Header service listening on port ${port}`))
