const express = require('express')
const { success } = require('./helper.js')
const morgan = require('morgan') // package npm qui fait la même chose que logger
const favicon = require('serve-favicon')
//const helper = require('helper.js')
let pokemons = require('./mock-pokemon')


const app = express()
const port = 3000

app
    .use(favicon(__dirname + '/favicon.ico')) //appeler use autant de fois qu'il y a de middleware a implémenter et les chaînant en détermiant l'odre entre eux
    .use(morgan('dev'))

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


app.get('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id) // modification url grâce aux params
    const pokemon = pokemons.find(pokemon => pokemon.id === id) // recherche par l'id de l'url
    const message = 'Un pokémon a bien été trouvé'
    //res.send(`Vous avez demandé le pokémon ${pokemon.name}`)
    res.json(success(message, pokemon)) // on utilise le heper pour retourner un message structuré et le pokemon
})

app.get('/api/pokemons', (req,res) => {
    const message = 'La liste des pokémons a bien été récupérée' // rappel length ppté pour récupérer la longueur d'un tableau
    res.json(success(message, pokemons))
})


app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))


/* Exemple possible :
app.get('/api/pokemons/:id/:name', (req,res) => {
    const id = req.params.id
    const name = req.params.id
    res.send(`Vous avez demandé le pokémon n°${id}, son nom est ${name}`)
})
*/