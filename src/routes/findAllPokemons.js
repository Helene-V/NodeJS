const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize') // importer les opérateurs de sequelize
  
module.exports = (app) => {
  app.get('/api/pokemons', (req, res) => {
    if(req.query.name) { //req.query.name on demande a express d'extraire le paramètre name 
      const name = req.query.name
      const limit = parseInt(req.query.limit) || 5

      if(name.length <2) {
        const message = `Le terme de recherche doit contenir au minimum 2 caractères.`
        return res.status(400).json({ message })
      }

      return Pokemon.findAndCountAll({ //cherche 2 info dans la db
        where: {
          name: { // 'name' est la propriété du modele pokemon
            [Op.like]: `%${name}%` // 'name' est le critère de la recherche
            }
          },
          order: ['name'],
          limit: limit
        })
      .then(({count, rows}) => {
        const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.`
        res.json({ message, data: rows })
      })
    } else {
      Pokemon.findAll({ order: ['name'] })
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error => {
        const message = `La liste des pokemons n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({ message, data: error })
      })
    }
  })
}

/*
FIND ALL 
module.exports = (app) => {
  app.get('/api/pokemons', (req, res) => {
    if(req.query.name) { //req.query.name on demande a express d'extraire le paramètre name 
      const name = req.query.name
      return Pokemon.findAll({
        where: {
          name: { // 'name' est la propriété du modele pokemon
            [Op.like]: `%${name}%` // 'name' est le critère de la recherche
            }
          },
          limit: 5
        })
      .then(pokemons => {
        const message = `Il y a ${pokemons.length} pokémons qui correspondent au terme de recherche ${name}.`
        res.json({ message, data: pokemons })
      })
    } else {
      Pokemon.findAll()
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error => {
        const message = `La liste des pokemons n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({ message, data: error })
      })
    }
  })
}
*/