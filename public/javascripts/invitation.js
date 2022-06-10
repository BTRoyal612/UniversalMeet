let copyText = document.querySelector(".copy-text");
copyText.querySelector("button").addEventListener("click", function(){
  copyText.classList.add("active");
  setTimeout(function() {
    copyText.classList.remove("active");
  }, 1000);
});

let path = "/invitations";
function serialize(id) {
  let res = "";
  while (id != 0) {
    let remainder = id % 26;
    id = Math.floor(id / 26);
    res = res + String.fromCharCode(remainder + 97);
  }
  while (res.length < 6) {
    res = res + 'a';
  }
  return res.split("").reverse().join("");
}