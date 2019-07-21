const UsersService = {
    getAllUsers(knex) {
      return knex.select('*').from('v_users')
    },
  
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('v_users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('v_users')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteUser(knex, id) {
      return knex('v_users')
        .where({ id })
        .delete()
    },
  
    updateUser(knex, id, newUserFields) {
      return knex('v_users')
        .where({ id })
        .update(newUserFields)
    },
  }
  
  module.exports = UsersService