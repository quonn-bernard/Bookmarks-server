'use strict';

const bookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks');
  },

  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into('bookmarks')
      .returning('*')
      .then(rows => rows[0]);
  },

  getById(knex, id) {
    return knex
      .from('bookmarks')
      .select('*')
      .where('id', id).first();
  },

  deleteNote(knex, id) {
    return knex('bookmarks')
      .where({ id })
      .delete();
  },

  updateNote(knex, id, newNote) {
    return knex('bookmarks')
      .where({id })
      .update(newNote);
  }
};

module.exports = bookmarksService;