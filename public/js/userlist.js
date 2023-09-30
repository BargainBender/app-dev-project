const params = new URLSearchParams(window.location.search)
console.log(params.toString())

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

for (const [key, value] of params) {
    console.log(`${key}:${value}`);
}

let returnFromLinks = document.querySelectorAll("[data-return-from]")

for (let link of returnFromLinks) {
  link.href = `${link.href}?continue=${encodeURIComponent(window.location.pathname + window.location.search)}`
}