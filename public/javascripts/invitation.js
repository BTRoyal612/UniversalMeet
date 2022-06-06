let copyText = document.querySelector(".copy-text");
copyText.querySelector("button").addEventListener("click", function(){
  copyText.classList.add("active")
  setTimeout(function() {
    copyText.classList.remove("active")
  }, 1000)
})

let path = "/invitations"
function serialize(id) {
  let res = "";
  while (id != 0) {
    let remainder = id % 26;
    id = Math.floor(id / 26);
    res = res + String.fromCharCode(remainder + 65);
  }
  console.log(res)
  while (res.length < 6) {
    res = res + 'A';
  }
  return res.split("").reverse().join("");
}

function deserialize(id) {
  res = 0;
  for (let i = 0; i < id.length; i++) {
    res = res + (id.charCodeAt(i) - 65) * (26 ** (id.length - 1 - i));
  }
  return res;
}

function getId() {
  var showID = document.getElementById("meetingID");
  let id = req.id;
  let serializedID = serialize(id);

  showID.innerHTML = path + '/' + serializedID;
}