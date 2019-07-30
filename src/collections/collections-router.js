'use strict';

const express = require('express');
const collectionRouter = express.Router();
const bodyParser = express.json();
const logger = require('../logger');
const collectionsService = require('./collections-service');
const { requireAuth } = require('../middleware/jwt-auth');
const xss = require('xss');

const serializeCollection = collection => ({
  id: collection.id,
  name: xss(collection.name),
  author: xss(collection.author)
});

const serializeBookmark = bookmark => ({
  ...bookmark,
  name: xss(bookmark.name),
  content: xss(bookmark.content)
});

collectionRouter
  .route('/')
  .get((req,res,next) => {
    const knexInstance = req.app.get('db');
    collectionsService.getAllCollections(knexInstance)
      .then(collections => {
        console.log(collections)
        res.json(collections.map(collection => serializeCollection(collection)));
      })
      .catch(next);
  })
  .post(requireAuth, bodyParser, (req,res,next) =>{
    const {name} = req.body;
    const newCollection = { name};
    newCollection.author = req.user.id
    console.log(req.user.id)
    collectionsService.insertCollection(
      req.app.get('db'),
      newCollection
    )
      .then(collection => {
        res
          .status(201)
          .location(req.originalUrl +`/${collection.id}`)
          .json(serializeCollection(collection));
      })
      .catch(next);
  });
collectionRouter  
  .route('/:id')
  .all((req,res,next)=>{
    collectionsService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(collection =>{
        if (!collection) {
          return res.status(404).json({
            error: { message: 'Collection doesn\'t exist' }
          });
        }
        res.collection = collection;
        next();
      })
      .catch(next);
  })
  .get((req,res,next) => {
    const knexInstance = req.app.get('db');
    collectionsService.getCollectionBookmarks(knexInstance, req.params.id)
      .then((bookmarks)=>{
        res.json(bookmarks.map(bookmark=>serializeBookmark(bookmark)));
      })
      .catch(next);
  })
  .delete((req,res,next)=>{
    const { id } = req.params;
    const knexInstance = req.app.get('db');
    collectionsService.deleteCollection(knexInstance,id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const {name} = req.body;
    const collectionToUpdate = {name};
    const numberOfValues = Object.values(collectionToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'request body must contain \'name\''
        }
      });
    }

    collectionsService.updateCollection(
      req.app.get('db'),
      req.params.id,
      collectionToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });
  
  module.exports = collectionRouter