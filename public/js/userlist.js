const params = new URLSearchParams(window.location.search)
const searchInput = document.getElementById("searchInput")

// If page is greater than last page, redirect to last page
if (params.has("page") && params.get("page") > totalPages) {
  params.set("page", totalPages)
  window.location.href = `${window.location.pathname}?${params.toString()}`
}

// Check for search term in query params, then run search if exists
if (params.has("term") && params.get("term").trim().length !== 0) {
  console.log("replace term")
  searchInput.value = params.get("term")
  searchFunction(params.get("term"))
}

// Check view settings (relaxed / condensed), resize buttons accordingly
function resizeDynamicBtns() {
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
}
resizeDynamicBtns()


if (params.has("limit") && params.get("limit") == 25) {
  document.querySelector("#limit25Btn").classList.add("btn-primary", "text-primary-content")
} else if (params.has("limit") && params.get("limit") == 50) {
  document.querySelector("#limit50Btn").classList.add("btn-primary", "text-primary-content")
} else {
  document.querySelector("#limit10Btn").classList.add("btn-primary", "text-primary-content")
}

function generateReturnLinks() {
  let returnFromLinks = document.querySelectorAll("[data-return-from]")
  
  for (let link of returnFromLinks) {
    link.href = `${link.href}?continue=${encodeURIComponent(window.location.pathname + window.location.search)}`
  }
}

generateReturnLinks()

const debounce = _.debounce(searchFunction, 300)
function searchFunction(searchText) {
  let searchQueryHome = new URLSearchParams(window.location.search)
  if (searchQueryHome.has("term") && searchQueryHome.get("term").trim().length !== 0) {
    if (searchText.length != 0) {
      searchQueryHome.set("term", searchText)
    } else {
      searchQueryHome.delete("term")
    }
    window.history.replaceState(null, null, 
      `http://localhost:3000/?${searchQueryHome.toString()}`
      )
    } else {
    searchQueryHome.set("term", searchText)
    window.history.replaceState(null, null, 
      `http://localhost:3000/?${searchQueryHome.toString()}`
      )
  }

  delete searchQueryHome
    
  let searchQuery = new URLSearchParams(window.location.search)
  if (searchQuery.has("term") && searchQueryHome.get("term").trim().length !== 0) {
    searchQuery.set("term", searchText)
  } else {
    searchQuery.delete("term")
  }
  if (searchQuery.has("page") && searchQuery.get("page").trim().length === 0) {
    searchQuery.set("page", 1)
  }
  fetch(`http://localhost:3000/search?${searchQuery.toString()}`)
  .then(res => res.json())
  .then(data => {
    let tableRows = document.querySelector("#userTableContents")
    let paginationContainer = document.querySelector("#pagesLinks")

    let rows = tableRows.querySelectorAll("tr")
    for (let row of rows) {
      row.remove()
    }

    let pagesLinks = paginationContainer.querySelectorAll("a")
    for (let link of pagesLinks) {
      link.remove()
    }

    let btnSize = ""

    if (searchQueryHome.has("view") && searchQueryHome.get("view").trim() != '') {
      if (searchQueryHome.get("view") == "condensed") {
        btnSize = "btn-sm"
      }
    }

    // Repopulate table
    for (let row of data.userList) {
      let tr = document.createElement("tr")
      tr.classList.add("user-row", "hover", "transition", "duration-150")
      tr.innerHTML = `
        <th>${row.id}</th>
        <td>${row.firstname}</td>
        <td>${row.lastname}</td>
        <td>${row.email}</td>
      
        <td class="flex join transition duration-150 opacity-0">
          <a href="/edituser/${row.id}" data-return-from data-dynamic-btn class="join-item btn ${btnSize} btn-primary text-primary-content capitalize"><i class="fa-regular fa-pen-to-square"></i></a>
          <a href="/deleteuser/${row.id}" data-return-from data-dynamic-btn class="join-item btn ${btnSize} btn-error text-error-content capitalize"><i class="fa-solid fa-trash"></i></a>
        </td>
      `
      tableRows.append(tr)
    }

    generateReturnLinks()
    
    // Repopulate pagination links
    if (data.totalPages > 1) {
      for (let i = 1; i <= data.totalPages; i++) {
        let a = document.createElement("a")
        a.href = data.paginationLinks[i-1]
        a.classList.add("btn", "join-item")
        if (i === data.currentPage) {
          a.classList.add("btn-primary", "text-primary-content")
        }
        a.textContent = i
        a.setAttribute("data-dynamic-btn", "")
        
        paginationContainer.append(a)
      }
    } else if (data.totalUsers !== 0) {
      let a = document.createElement("a")
      a.href = data.paginationLinks[0]
      a.classList.add("btn", "btn-primary", "text-primary-content")
      a.textContent = 1
      a.setAttribute("data-dynamic-btn", "")
      
      paginationContainer.append(a)
    }

    resizeDynamicBtns()

    // If page is greater than last page, redirect to last page
    if (searchQuery.has("page") &&
        searchQuery.get("page").trim().length !== 0 &&
        searchQuery.get("page") > data.totalPages) {
          console.log("Redirect to " + data.totalPages)
          searchQuery.set("page", data.totalPages)
          window.location.href = `${window.location.pathname}?${searchQuery.toString()}`
    }
  })
}

searchInput.addEventListener("input", function (event) {
  const searchText = event.target.value
  debounce(searchText)
})