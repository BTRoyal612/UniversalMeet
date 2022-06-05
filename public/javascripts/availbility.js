curTF = 1;
const addTimeFrame = () => {
  var tf_ctn = document.getElementsByClassName('avail-ctn')[0];
  var tf = document.createElement('div');
  tf.id = curTF;
  curTF+=1;
  tf.classList.add("avail-time-frame");
  tf.innerHTML = '<label>From</label><input type="time" name="event-name" class="avail-time-frame-input"><i class="xmark-time-frame fa-solid fa-xmark" onclick="deleteTimeFrame('+tf.id+')"></i>'
  tf_ctn.appendChild(tf)
}

const deleteTimeFrame = (id) => {
  var tf = document.getElementById(id);
  tf.outerHTML = "";
}

function addAvailability(time_frame) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  }

  xhttp.open("POST", "/users/addAvailability", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ event_id:event_id , time_frame:time_frame}));
}

function showAvailability() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  }

  xhttp.open("POST", "/users/showAvailability", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ event_id:event_id }));
};