const supertest = require('supertest')
const server = require('../server');
const { expect } = require('chai');

describe('Get /movies', () => {
    it('fail - no auth token', () => {
        return supertest(server)
            .get('/movies?genre=Thriller&country=United States&avg_vote=8')
            .expect(400)
    })

    it('should return an array of movies', () => {
        return supertest(server)
            .get('/movies?genre=&country=&avg_vote=')
            .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
            })
    })
})