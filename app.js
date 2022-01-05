const express = require('express')
const morgan = require('morgan') // package npm qui fait la même chose que logger
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')


const app = express()
const port = 3000

app
    .use(favicon(__dirname + '/favicon.ico')) //appeler use autant de fois qu'il y a de middleware a implémenter et les chaînant en détermiant l'odre entre eux
    .use(morgan('dev'))
    .use(bodyParser.json()) // inclus dans express maintenant

sequelize.initDb()

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
