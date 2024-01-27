const { ipcRenderer } = require("electron");

document.addEventListener('DOMContentLoaded', () => {
  let submitBtn = document.getElementById("submit-btn");
  let schoolElement = document.getElementById("schoolSelect");
  let subjectElement = document.getElementById("subjectSelect");
  let bookCodeElement = document.getElementById("bookCodeSelect");

  submitBtn.addEventListener('click', (evt) => {
    ipcRenderer.send("CREATE_PDF", {
      schoolElement: schoolElement.value,
      subjectElement: subjectElement.value,
      bookCodeElement: bookCodeElement.value
    });
  });
});