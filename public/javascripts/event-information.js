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
  let event_name = document.getElementById("event-name").value;
  let event_duration = document.getElementById("event-duration").value;
  let event_from = document.getElementById("event-from").value;
  let event_time_zone = document.getElementById("event-time-zone").value;
  let isoffline = document.getElementById("offline");
  let isonline = document.getElementById("online");
  let event_status;
  if (isoffline.checked) {
    event_status = false;
  }
  else {
    event_status = true;
  }
  let event_due_date = document.getElementById("event-due-date").value;
  let event_link = document.getElementById("event-link").value;
  console.log(event_name,event_duration,event_from,event_time_zone,event_status,event_due_date,event_link)
}