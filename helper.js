const qs = require('querystring')
require("dotenv").config()

function getOffset(currentPage = 1, listPerPage = 10) {
  return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

function buildLinks(query, pageCount) {

  let paginationLinks = []

  for (let i = 1; i <= pageCount; i++) {
    paginationLinks.push("?" + qs.stringify({...query, page: i}))
  }

  return {
    relaxedBtn: "?" + qs.stringify({...query, view: "relaxed"}),
    condensedBtn: "?" + qs.stringify({...query, view: "condensed"}),
    limit10Btn: "?" + qs.stringify({...query, limit: 10, page: 1}),
    limit25Btn: "?" + qs.stringify({...query, limit: 25, page: 1}),
    limit50Btn: "?" + qs.stringify({...query, limit: 50, page: 1}),
    paginationLinks,
  }
}

function dlog(obj, tag, description) {
  if (process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true') {
    process.stdout.write(`== (DEBUG:${tag == null ? "" : ` ${tag}`}${description == null ? "" : ` ${description}`}) ==> `)
    console.log(obj)
  }
}

function derror(obj, tag, description) {
  if (process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true') {
    process.stdout.write(`== (DEBUG ERR:${tag == null ? "" : ` ${tag}`}${description == null ? "" : ` ${description}`}) ==> `)
    console.error(obj)
  }
}

module.exports = {
  getOffset,
  emptyOrRows,
  buildLinks,
  dlog,
  derror,
}