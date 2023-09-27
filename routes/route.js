var express = require('express');
var router = express.Router();
const users = require('../services/users')

// GET users  
router.get('/', async function(req, res, next) {
  try {
    data = await users.getMultipleUsers(req.query.page);
    var userData = data.users
    console.log(userData)
    res.render('userlist', {userList: userData});
  } catch (err) {
    console.error(`Error getting users `, err.message);
    next(err);
  }
    
});

// Insert user form
router.get('/insertuser', async function(req, res, next) {
  res.render('userForm')
});

// save user
router.post('/saveuser', async function(req, res, next) {
  const newUser = {
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  }
  try {
    data = await users.saveUser(newUser);
    res.redirect('/')
  }catch (err){
    console.error(`Error inserting user `, err.message);
    next(err);
  }  
  
});

//edit user form
router.get('/edituser/:id', async function(req, res, next) {
  const id = req.params.id
  user = await users.getUser(id);
  res.render('editForm',{user: user})
});

//update user
router.post('/updateuser', async function(req, res, next) {
  const user = {
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    id:req.body.id
  }
  try {
    data = await users.updateUser(user);
  }catch (err){
    console.error(`Error updating user `, err.message);
    next(err);
  }  
  res.redirect('/')
});

// delete user
router.get('/deleteuser/:id', async function(req, res, next) {
  const id = req.params.id
  try {
    data = await users.deleteUser(id);
  }catch (err){
    console.error(`Error deleting user `, err.message);
    next(err);
  }  
  res.redirect('/')
});
module.exports = router;
