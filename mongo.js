const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const parameters = process.argv

if (parameters.length === 2) {
  console.log('puhelinluettelo: ')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, ' ', person.number)
      })
      mongoose.connection.close()
    })
} else if (parameters.length === 4) {
  const nm = parameters[2]
  const nr = parameters[3]
  const person = new Person({
    name: nm,
    number: nr
  })

  person
    .save()
    .then(response => {
      console.log('person saved!')
      mongoose.connection.close()
    })
} else {
  console.log('Illegal arguments (expected first argument: "Person Name", second argument: "phonenumber")')
  mongoose.connection.close()
}