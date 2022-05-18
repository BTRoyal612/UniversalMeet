let copyText = document.querySelector(".copy-text");
copyText.querySelector("button").addEventListener("click", function(){
  copyText.classList.add("active");
  setTimeout(function() {
    copyText.classList.remove("active");
  }, 1000);
});