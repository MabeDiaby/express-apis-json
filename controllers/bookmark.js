const express = require('express');
const Bookmark = require('../models/bookmark')

const BookmarkRouter = express.Router();

BookmarkRouter.get('/', (req, res, next) => {
    Bookmark.find({})
    .populate('owner')
    .then(bookmarks => res.json(bookmarks))
    .catch(next)
})

BookmarkRouter.get('/:id', (req, res, next) => {
    Bookmark.findById(req.params.id)
    .populate('owner')
    .then(bookmarks => res.json(bookmarks))
    .catch(next)
})

BookmarkRouter.post('/', (req, res, next) => {
    Bookmark.create(req.body)
    .then(bookmark => res.json(bookmark))
    .catch(next)
})


BookmarkRouter.patch('/:id', (req, res, next) => {
    Bookmark.findOneAndUpdate(
        {_id: req.params.id}, req.body, {new: true})
    .then(bookmark => res.json(bookmark))
    .catch(next)
})

BookmarkRouter.delete('/:id', (req, res, next) => {
    Bookmark.findOneAndDelete({
        _id: req.params.id
    })
    .then(bookmark => res.json(bookmark))
    .catch(next)
})

module.exports = BookmarkRouter
// another route 'post'