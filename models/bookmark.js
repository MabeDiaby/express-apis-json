const mongoose = require('../db/connection');

const BookmarkSchema = new mongoose.Schema({
    title: String,
    url: String, 
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Bookmark = mongoose.model('Bookmark', BookmarkSchema)

module.exports = Bookmark