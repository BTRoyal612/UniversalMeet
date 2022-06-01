var PENDING_EVENTS = [];

$(document).ready(function () {
  console.log("pass event list");
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      vueinst.p_event.splice(0);
      console.log(JSON.parse(this.responseText))
      var events = JSON.parse(this.responseText);
      for (let event of events) {
        var isHost;
        if (event.creator_id == event.user_id) isHost = true;
        else isHost = false;

        event["isHost"] = isHost;
        console.log(event);
        vueinst.p_event.push(event);
      }
    }
  }

  xhttp.open("POST", "/users/getEventList", true);
  xhttp.send();
});

var vueinst = new Vue({
  el: "#app",
  data: {
    p_event: PENDING_EVENTS,
  },
  methods: {
    getClickEvent: function (event_id) {
      console.log(event_id)
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText)
          let cur_event = this.responseText;
          let event_name = document.getElementById("event-name");
          event_name.innerText = cur_event["event_name"]
          let event_duration = document.getElementById("event-duration");
          let event_timezone = document.getElementById("event-timezone");
          let event_status = document.getElementById("event-status");
          let event_duedate = document.getElementById("event-duedate");
          let event_link = document.getElementById("event-link");
        }
      }

      xhttp.open("POST", "/users/getEvent", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({ event_id: event_id }));
    }
  }
});

