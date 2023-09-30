const params = new URLSearchParams(window.location.search)

if (params.has("continue") && params.get("continue").trim != "") {
  document.getElementById("cancel").href = params.get("continue")
}