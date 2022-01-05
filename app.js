const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')
const { json } = require('body-parser')


const app = express()
const port = process.env.PORT || 3000

app
    .use(favicon(__dirname + '/favicon.ico')) //appeler use autant de fois qu'il y a de middleware a implémenter et les chaînant en détermiant l'odre entre eux
    .use(bodyParser.json()) // inclus dans express maintenant

sequelize.initDb()

app.get('/', (req,res) => {
    res.json('Hello, Heroku ! :)')
})

// Ici nous placerons les futurs points de terminaisons
require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPk')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)
require('./src/routes/login')(app)

// On ajoute la gestion des erreurs 404
app.use(({res}) => {
    const message = 'Impossible de trouver la ressource demandée, veuillez essayer une autre URL.'
    res.status(404).json({message})
})

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))
