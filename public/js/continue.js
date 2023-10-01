const params = new URLSearchParams(window.location.search)

if (params.has("continue") && params.get("continue").trim().length !== 0) {
  console.log("Has continue")
  let elements = document.querySelectorAll("[data-return-link]")
  console.log(elements)
  for (let element of elements) {
    element.href = params.get("continue")
  }
}