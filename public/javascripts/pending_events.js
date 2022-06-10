var PENDING_EVENTS = [];

$(document).ready(function () {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      vueinst.p_event.splice(0);
      var events = JSON.parse(this.responseText);
      for (let event of events) {
        var isHost;
        if (event.creator_id == event.user_id) isHost = true;
        else isHost = false;

        event["isHost"] = isHost;
        vueinst.p_event.push(event);
      }
    }
  };

  xhttp.open("POST", "/users/getEventList", true);
  xhttp.send();
});

var vueinst = new Vue({
  el: "#app",
  data: {
    p_event: PENDING_EVENTS,
  },
  methods: {
    getClickEvent: function (event_id, isHost) {
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let eventId = document.getElementById("event-id");
          eventId.value = event_id;
          let cur_event = JSON.parse(this.responseText)[0];
          let event_name = document.getElementById("event-name");
          event_name.innerText = cur_event["event_name"];
          let event_date = document.getElementById("event-date");
          event_date.innerText = cur_event["date"].substring(0, 10);
          let event_duration = document.getElementById("event-duration");
          event_duration.innerText = cur_event["duration"];
          let event_timezone = document.getElementById("event-timezone");
          event_timezone.innerText = cur_event["time_zone"];
          let event_status = document.getElementById("event-status");
          let event_link = document.getElementById("event-link");
          if (cur_event["isOnline"] == 0)
          {
            event_status.innerText = "Offline";
            event_link.innerText = cur_event["hold_location"];
          }
          else {
            event_status.innerText = "Online";
            event_link.innerText = cur_event["share_link"];
          }
          let event_duedate = document.getElementById("event-duedate");
          event_duedate.innerText = cur_event["due_date"].substring(0,10) + " (" + cur_event["due_date"].substring(12,19) + ")";
          let button = document.getElementById("avail-select-btn");
          let form = document.getElementById("modal-form");
          if (isHost) {
            button.classList.remove('host-btn');
            button.classList.add('host-btn');
            button.innerText = 'Show Availablities';
            form.action = '/users/host-event';
            event_name.classList.remove('attendee_input');
            event_name.classList.add('host_input');
            event_date.classList.remove('attendee_input');
            event_date.classList.add('host_input');
            event_duration.classList.remove('attendee_input');
            event_duration.classList.add('host_input');
            event_timezone.classList.remove('attendee_input');
            event_timezone.classList.add('host_input');
            event_status.classList.remove('attendee_input');
            event_status.classList.add('host_input');
            event_link.classList.remove('attendee_input');
            event_link.classList.add('host_input');
            event_duedate.classList.remove('attendee_input');
            event_duedate.classList.add('host_input');
          }
          else {
            button.classList.remove('host-btn');
            button.classList.add('attandee-btn');
            button.innerText = 'Select Your Availablity';
            form.action = '/users/invite-response';
            event_name.classList.remove('host_input');
            event_name.classList.add('attendee_input');
            event_date.classList.remove('host_input');
            event_date.classList.add('attendee_input');
            event_duration.classList.remove('host_input');
            event_duration.classList.add('attendee_input');
            event_timezone.classList.remove('host_input');
            event_timezone.classList.add('attendee_input');
            event_status.classList.remove('host_input');
            event_status.classList.add('attendee_input');
            event_link.classList.remove('host_input');
            event_link.classList.add('attendee_input');
            event_duedate.classList.remove('host_input');
            event_duedate.classList.add('attendee_input');
          }
        }
      };

      xhttp.open("POST", "/users/getEvent", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({ event_id: event_id }));
    }
  }
});

