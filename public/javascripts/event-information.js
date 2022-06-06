let event = {
  event_name: "",
  date: "",
  duration: "",
  time_zone: "",
  hold_location: "",
  due_date: "",
  note: "",
  share_link: "",
  isOnline: ""
}
const updateEvent = () => {
  event.event_name = document.getElementById("event-name").value;
  event.date = document.getElementById("event-date").value
  event.duration = document.getElementById("event-duration").value;
  event.time_zone = document.getElementById("event-time-zone").value;
  let status = document.getElementById("event-status").value;
  if (status = "online") {
    event.isOnline = true;
    event.share_link = document.getElementById("event-link").value;
    event.hold_location = ""
  }
  else {
    event.isOnline = false;
    event.hold_location = document.getElementById("event-link").value;
    event.share_link = ""
  }
  event.due_date = document.getElementById("event-due-date").value;
}

function addEvent() {
  console.log('here')
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        id_input = document.getElementById('event_id');
        id_input.value = JSON.parse(this.responseText)[0];
        console.log(JSON.parse(this.responseText))
      }
  }

  xhttp.open("POST", "/users/addEvent", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ event_name:event.event_name, date:event.date, duration:event.duration, time_zone:event.time_zone, hold_location:event.hold_location, due_date:event.due_date, note:event.note, share_link:event.share_link, isOnline:event.isOnline }));
};