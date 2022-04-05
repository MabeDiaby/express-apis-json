const express = require('express')
const User = require('../models/user')

const UserRouter = express.Router()

UserRouter.get('/', (req, res, next) => {
    User.find({})
    .then(users => res.json(users))
    .catch(next)
})

UserRouter.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(next)
})

UserRouter.post('/', (req, res, next) => {
    User.create(req.body)
    .then(user => res.json(user))
    .catch(next)
})

module.exports = UserRouter;