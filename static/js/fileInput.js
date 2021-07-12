//script to activate the upload function

const realFileBtn = document.getElementById("real-file");
const chooseFileBtn = document.getElementById("chooseFile-button");
const customTxt = document.getElementById("custom-text");

chooseFileBtn.addEventListener("click", function() {
  realFileBtn.click();
});

realFileBtn.addEventListener("change", function() {
  if (realFileBtn.value) {
    customTxt.innerHTML = realFileBtn.value.match(
      /[\/\\]([\w\d\s\.\-\(\)]+)$/
    )[1];
  } else {
    customTxt.innerHTML = "No file chosen, yet.";
  }
});
