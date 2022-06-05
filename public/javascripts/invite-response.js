let timeframes = [
  {
    id: 1,
    from: "10:00",
    to: "12:00",
  },
  {
    id: 2,
    from: "15:00",
    to: "17:00",
  }
]

window.onload = () => {
  var ctn = document.getElementsByClassName('response-avail-ctn')[0];
  for (let i in timeframes) {
    var tfDIV = document.createElement('div');
    tfDIV.classList.add('event-input');
    tfDIV.classList.add('response-info-tf-input');
    tfDIV.id = i
    tfDIV.onclick = function () {
      this.classList.toggle("chosen-tf")
    };
    tfDIV.innerText = 'From ' + timeframes[i]['from'] + ' To ' + timeframes[i]['to'];
    ctn.appendChild(tfDIV);
  }
}

const sendTimeFrames = () => {
  let chosenTF = document.getElementsByClassName("chosen-tf");
  let tfArr = [];
  for (tf of chosenTF) {
    tfArr.push(timeframes[tf.id])
  }
  console.log(tfArr)
}

function addChosenTime(chosen_time) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  }

  xhttp.open("POST", "/users/addChosenTime", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ chosen_time: chosen_time }));
}

function deleteChosenTime(chosen_time) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  }

  xhttp.open("POST", "/users/deleteChosenTime", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ chosen_time: chosen_time }));
}

function addChosenTime(chosen_time) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  }

  xhttp.open("POST", "/users/addChosenTime", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ chosen_time: chosen_time }));
}

function countChosenTime(chosen_time) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  }

  xhttp.open("POST", "/users/countChosenTime", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ chosen_time: chosen_time }));
}