var express = require('express')
var router = express.Router()
const users = require('../services/users')
const buildLinks = require("../helper").buildLinks
const dlog = require("../helper").dlog
const derror = require("../helper").derror
const getOffset = require("../helper").getOffset

// GET users  
router.get('/', async function (req, res, next) {
  const TAG = "router get /"

  let page = 1
  let limit = 
  req.query.limit == 10 ||
  req.query.limit == 25 ||
  req.query.limit == 50 ? req.query.limit : 10

  try {
    let pageQuery = parseInt(req.query.page || 1)
    page = pageQuery < 1 ? 1 : pageQuery
  } catch (_) {}
  
  const offset = getOffset(page, limit)
  try {

    let data = await users.getMultipleUsers(offset, limit)
    let userList = data.users    
    dlog(data, TAG)

    const links = buildLinks(req.query, data.meta.pageCount)
    dlog(links, TAG, "Generated links")

    res.render('userlist', { 
      userList,
      links,
      totalPages: data.meta.pageCount,
      currentPage: page,
      totalUsers: data.meta.totalUsers
    })
  } catch (err) {
    derror(err.message , TAG)
    next(err)
  }
})

// GET search users
router.get('/search', async function (req, res, next) {
  const TAG = "router get /search"

  let page = 1
  let limit = 
  req.query.limit == 10 ||
  req.query.limit == 25 ||
  req.query.limit == 50 ? req.query.limit : 10

  let searchTerm = req.query.term

  try {
    let pageQuery = parseInt(req.query.page || 1)
    page = pageQuery < 1 ? 1 : pageQuery
  } catch (_) {}
  
  const offset = getOffset(page, limit)
  try {
    let data = await users.getMultipleUsersWithSearch(offset, limit, searchTerm)
    let userList = data.users    
    dlog(data, TAG)

    res.status(200).json({ 
      userList,
      totalUsers: data.meta.totalUsers,
      currentPage: page,
      // totalPages: data.meta.pageCount,
    })
  } catch (err) {
    derror(err.message , TAG)
    next(err)
  }
})

// Insert user form
router.get('/insertuser', async function (req, res, next) {
  res.render('userForm')
})

// save user
router.post('/saveuser', async function (req, res, next) {
  const newUser = {
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  }
  try {
    data = await users.saveUser(newUser)
    res.redirect('/')
  } catch (err) {
    console.error(`Error inserting user `, err.message)
    next(err)
  }

})

//edit user form
router.get('/edituser/:id', async function (req, res, next) {
  const TAG = 'router get /edituser/:id'
  const id = req.params.id
  let user = await users.getUser(id)
  dlog(req.originalUrl, TAG, "Previous URL")
  res.render('editForm', { user })
})

//update user
router.post('/updateuser', async function (req, res, next) {
  const user = {
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    id: req.body.id
  }
  try {
    data = await users.updateUser(user);
  } catch (err) {
    console.error(`Error updating user `, err.message);
    next(err)
  }
  res.redirect('/')
})

// delete user
router.get('/deleteuser/:id', async function (req, res, next) {
  const TAG = "router get /deleteuser/:id"
  const id = req.params.id
  try {
    data = await users.deleteUser(id)
  } catch (err) {
    console.error(`Error deleting user `, err.message)
    next(err)
  }
  dlog(req.query.continue, TAG)
  res.redirect(req.query.continue || "")
})
module.exports = router
