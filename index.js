const express = require('express')
var morgan = require('morgan')
const app = express()
app.use(express.json())
const cors = require('cors')

app.use(cors())


morgan.token('getBody', function getBody (req) {
  return req.body
})

app.use(morgan(':getBody :method :url :response-time'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  entries = persons.length
  response.send(`Phonebook has info for ${entries} people `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const number = persons.find(num => num.id === id)

  if (number) { //all JS objects are truthy, hence they evaluate to true 
    response.json(number)
  } else {
    response.status(404).end()
  }  
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(persons => persons.id !== id) //this is a good way to remove stuff that you want to remove using a filter

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

 /* const person = {
    id: 
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }*/

  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

