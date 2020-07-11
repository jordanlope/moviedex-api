require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    console.log("Validate Bearer Token: ")

    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(400).json({ error: 'Unauthorization for this user' })
    }

    next()
})

function handleGetMovie(req, res) {
    console.log("Movie API")
    let response = [...MOVIES];

    if(req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    if(req.query.country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    if(req.query.avg_vote) {
        response = response.filter(movie =>
            movie.avg_vote >= Number(req.query.avg_vote)
        )
    }

    res.send(response)
}

app.get('/movies', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})

module.exports = app