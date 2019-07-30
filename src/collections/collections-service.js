'use strict';

const collectionsService = {
  getAllCollections(knex) {
    return knex.select('*').from('collections');
  },

  insertCollection(knex, newCollection) {
    return knex
      .insert(newCollection)
      .into('collections')
      .returning('*')
      .then(rows => rows[0]);
  },

  getById(knex, id) {
    return knex
      .from('collections')
      .select('*')
      .where('author', id).first();
  },

  deleteCollection(knex, id) {
    return knex('collections')
      .where({ id })
      .delete();
  },

  updateCollection(knex, id, newName) {
    return knex('collections')
      .where({id })
      .update(newName);
  },
  getCollectionBookmarks(knex,id){
    return knex('bookmarks')
      .where({collection_id: id});
  }
};

module.exports = collectionsService;