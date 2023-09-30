const params = new URLSearchParams(window.location.search)

// If page is greater than 
if (params.has("page") && params.get("page") > totalPages) {
  params.set("page", totalPages)
  window.location.href = `${window.location.pathname}?${params.toString()}`
}

const dynamicElements = document.querySelectorAll("[data-dynamic-btn]")
if (params.has("view") && params.get("view") === "condensed") {
  for (let element of dynamicElements) {
    element.classList.remove("btn-md")
    element.classList.add("btn-sm")
  }
  document.querySelector("#condensedViewBtn").classList.add("btn-primary", "text-primary-content")
} else {
  for (let element of dynamicElements) {
    element.classList.remove("btn-sm")
    element.classList.add("btn-md")
  }
  document.querySelector("#relaxedViewBtn").classList.add("btn-primary", "text-primary-content")
}

if (params.has("limit") && params.get("limit") == 25) {
  document.querySelector("#limit25Btn").classList.add("btn-primary", "text-primary-content")
} else if (params.has("limit") && params.get("limit") == 50) {
  document.querySelector("#limit50Btn").classList.add("btn-primary", "text-primary-content")
} else {
  document.querySelector("#limit10Btn").classList.add("btn-primary", "text-primary-content")
}

let returnFromLinks = document.querySelectorAll("[data-return-from]")

for (let link of returnFromLinks) {
  link.href = `${link.href}?continue=${encodeURIComponent(window.location.pathname + window.location.search)}`
}

const debounce = _.debounce(searchFunction, 300)

function searchFunction(searchText) {
  let searchparams = new URLSearchParams(window.location.search)
  searchparams.set("page", 1)
  fetch(`http://localhost:3000/search?term=${searchText}&${searchparams.toString()}`)
  .then(res => res.json())
  .then(data => {
    let tableRows = document.querySelector("#userTableContents")
    let rows = tableRows.querySelectorAll("tr")
    for (let row of rows) {
      row.remove()
    }
    
    let paginationContainer = document.querySelector("#pagesLinks")
    let pagesLinks = paginationContainer.querySelectorAll("a")
    for (let link of pagesLinks) {
      link.remove()
    }

    let btnSize = ""

    if (searchparams.has("view") && searchparams.get("view").trim() != '') {
      if (searchparams.get("view") == "condensed") {
        btnSize = "btn-sm"
      }
    }
    for (let row of data.userList) {
      let tr = document.createElement("tr")
      tr.classList.add("user-row", "hover", "transition", "duration-150")
      tr.innerHTML = `
        <th>${row.id}</th>
        <td>${row.firstname}</td>
        <td>${row.lastname}</td>
        <td>${row.email}</td>
      
        <td class="flex join transition duration-150 opacity-0">
          <a href="" data-return-from data-dynamic-btn class="join-item btn ${btnSize} btn-primary text-primary-content capitalize"><i class="fa-regular fa-pen-to-square"></i></a>
          <a href="" data-return-from data-dynamic-btn class="join-item btn ${btnSize} btn-error text-error-content capitalize"><i class="fa-solid fa-trash"></i></a>
        </td>
      `
      tableRows.append(tr)
    }

    console.log(data)
  })
}

const searchInput = document.getElementById("searchInput")

searchInput.addEventListener("input", function (event) {
  const searchText = event.target.value
  debounce(searchText)
})