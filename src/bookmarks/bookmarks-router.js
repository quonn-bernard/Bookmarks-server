'use strict';
const express = require('express');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const logger = require('../logger');
const bookmarksService = require('./bookmarks-service');
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth')

const serializeBookmark = bookmark => ({
  ...bookmark,
  name: xss(bookmark.name),
  content: xss(bookmark.content),
  author: bookmark.author,
  type: xss(bookmark.type)
});

bookmarkRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    bookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(bookmark => serializeBookmark(bookmark)));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { name, content, collection_id, type, author } = req.body;
    const newNote = { name, content, collection_id, type, author };
    newNote.author = author
    bookmarksService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(bookmark => {
        res
          .status(201)
          .location(req.originalUrl + `/${bookmark.id}`)
          .json(serializeBookmark(bookmark));
      })
      .catch(next);
  });

bookmarkRouter
  .route('/:id')
  .all(requireAuth)
  .all((req, res, next) => {
    bookmarksService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: 'Bookmark doesn\'t exist' }
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    return res.json(serializeBookmark(res.bookmark));
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db');
    bookmarksService.deleteNote(knexInstance, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { name, content, collection_id, type, author } = req.body;
    const bookmarkToUpdate = { name, content, collection_id, type, author };

    const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'request body must contain either \'name\', \'content\', or \'collection_id\''
        }
      });
    }

    bookmarksService.updateNote(
      req.app.get('db'),
      req.params.id,
      bookmarkToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarkRouter;