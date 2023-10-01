const params = new URLSearchParams(window.location.search)

let form = document.getElementById("form")

form.action = form.action + "?continue=" + encodeURIComponent(params.get("continue"))

console.log(form.action)

if (params.has("continue") && params.get("continue").trim().length !== 0) {
  console.log("Has continue")
  let elements = document.querySelectorAll("[data-return-link]")
  for (let element of elements) {
    element.href = params.get("continue")
  }
}