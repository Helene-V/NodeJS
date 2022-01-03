const express = require('express')
const morgan = require('morgan') // package npm qui fait la même chose que logger
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const { Sequelize } = require('sequelize')
const { success, getUniqueId } = require('./helper.js')
let pokemons = require('./mock-pokemon')


const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex',
    'root',
    'root',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    }
)

sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter  à la base de donnée ${error}`))

app
    .use(favicon(__dirname + '/favicon.ico')) //appeler use autant de fois qu'il y a de middleware a implémenter et les chaînant en détermiant l'odre entre eux
    .use(morgan('dev'))
    .use(bodyParser.json()) // inclus dans express maintenant

/*Version pédagogique du middleware code logger
const logger = (req, res, next) => {
    console.log(`URL : ${req.url}`)
    next()
}
app.use(logger)
*/

// Version courante et plus concise de logger :
//app.use((req, res, next) => {
//    console.log(`URL : ${req.url}`)
//    next()
//})


app.get('/', (req,res) => res.send('Hello, Express :)'))

app.get('/api/pokemons', (req,res) => {
    const message = 'La liste des pokémons a bien été récupérée' // rappel length ppté pour récupérer la longueur d'un tableau
    res.json(success(message, pokemons))
})

app.get('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id) // modification url grâce aux params
    const pokemon = pokemons.find(pokemon => pokemon.id === id) // recherche par l'id de l'url
    const message = 'Un pokémon a bien été trouvé'
    res.json(success(message, pokemon)) // on utilise le heper pour retourner un message structuré et le pokemon
})

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons) // c'est la DB qui gère les id uniques, methode en attendant avec la connexion via helper.js
  const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
  pokemons.push(pokemonCreated)
  const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
  res.json(success(message, pokemonCreated))
})

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = { ...req.body, id: id }
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
 })
  
 const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`
 res.json(success(message, pokemonUpdated))
});

app.delete('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
  pokemons = pokemons.filter(pokemon => pokemon.id !== id)
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
  res.json(success(message, pokemonDeleted))
});

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))


/* Exemple possible :
app.get('/api/pokemons/:id/:name', (req,res) => {
    const id = req.params.id
    const name = req.params.id
    res.send(`Vous avez demandé le pokémon n°${id}, son nom est ${name}`)
})
*/