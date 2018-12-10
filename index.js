const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

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
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(formatPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
}

app.post('/api/persons', (req, res) => {
    const id = getRandomInt(10000)
    const body = req.body
    if ((body.name === undefined) || (body.name === '')) {
        return res.status(400).json({error: 'name missing'})
    } else if ((body.number === undefined) || (body.number === '')) {
        return res.status(400).json({error: 'number missing'})
    }
    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            res.json(formatPerson(savedPerson))
        })
        .catch(error => {
            console.log(error)
        })
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
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
