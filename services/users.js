const db = require('./db');
const helper = require('../helper');

async function getMultipleUsers(offset = 0, limit = 10) {
  const rows = await db.query(
    `SELECT id, firstname, lastname, email FROM users LIMIT ${offset},${limit}`
  );
  const totalUsers = await db.query("SELECT COUNT(*) as count FROM users")
  const users = helper.emptyOrRows(rows);
  const meta = { pageCount: Math.ceil(totalUsers[0].count / limit), totalUsers: totalUsers[0].count };

  return {
    users,
    meta
  }
}

async function getUser(id){
  const row = await db.query(
    `SELECT id, firstname, lastname,email  
    FROM users 
    WHERE id= ${id}`
  );
  const user = helper.emptyOrRows(row);
  return user[0]
}

async function saveUser(newUser){
  const row = await db.query(
    `INSERT INTO users(lastname,firstname,email) 
     VALUES ('${newUser.lastname}','${newUser.firstname}','${newUser.email}')`
  );
}

async function updateUser(newUser){
  const row = await db.query(
    `UPDATE users
    SET lastname='${newUser.lastname}',
        firstname= '${newUser.firstname}',
        email='${newUser.email}' 
    WHERE id='${newUser.id}'`
  );
}

async function deleteUser(id){
  const row = await db.query(
    `DELETE FROM users
     WHERE id='${id}'`
  );
}

module.exports = {
  getMultipleUsers,
  getUser,
  saveUser,
  updateUser,
  deleteUser
}