const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
    },
    {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
    },
    {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
    },
    {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
    },
    {
    "name": "Testi",
    "number": "999",
    "id": 5
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
}

app.post('/api/persons', (req, res) => {
    const id = getRandomInt(10000)
    const body = req.body
    if (body.name === undefined) {
        return res.status(400).json({error: 'name missing'})
    } else if (body.number === undefined) {
        return res.status(400).json({error: 'number missing'})
    }
    const p = persons.find(p => p.name === body.name)
    if (p) {
        return res.status(400).json({error: 'name must be unique'})
    }
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    persons = persons.concat(person)
    res.json(person)
})

app.get('/info', (req, res) => {
    let r = '<p>puhelinluettelossa on ' + persons.length + ' henkilön tiedot</p><p>' + new Date() + '</p>'
    res.send(r)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()       
    }    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
