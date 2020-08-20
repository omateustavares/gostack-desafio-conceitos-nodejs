const express = require('express')
const cors = require('cors')
const { v4 } = require('uuid')

const app = express()

app.use(express.json())
app.use(cors())

function logLabel (request, response, next){
  const { method, url} = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel)

  next()

  console.timeEnd(logLabel)
}

app.use(logLabel)


const repositories = []

app.get('/repositories', (request, response) => {
  return response.json(repositories)
})

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = { id: v4(), title, url, techs, likes: 0 }

  repositories.push(repositorie)

  return response.json(repositorie)
})

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  )

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found!' })
  }

  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
})

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  )

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  )

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  repositories[repositoryIndex].likes++;

  return response.send(repositories[repositoryIndex]);

})

module.exports = app
