const mongoose = require('mongoose')

const dbName = 'booke'

const mongoURI = process.env.NODE_ENV === 'production'
    ? process.env.DB_URL
    : 'mongodb://localhost/' + dbName

mongoose.connect(mongoURI)
    .then(instance => console.log("I'm connected to DB" +  instance.connections[0].name))
    .catch(err => console.log("My connection failed: ", err))

module.exports = mongoose