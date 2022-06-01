let event = {
  event_name: "",
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
  event.duration = document.getElementById("event-duration").value;
  let event_from = document.getElementById("event-from").value;
  event.time_zone = document.getElementById("event-time-zone").value;
  let offline = document.getElementById("offline");
  let online = document.getElementById("online");
  if (offline.checked) {
    event.isOnline = false;
  }
  else {
    event.isOnline = true;
  }
  event.due_date = document.getElementById("event-due-date").value;
  event.share_link = document.getElementById("event-link").value;
  // console.log(event_name,event_duration,event_from,event_time_zone,event_status,event_due_date,event_link)
}

function addEvent() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  }

  xhttp.open("POST", "/users/addEvent", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ "event_name":event.event_name, "duration":event.duration, "time_zone":event.time_zone, "hold_location":event.hold_location, "due_date":event.due_date, "note":event.note, "share_link": event.share_link, "isOnline":event.isOnline }));
};