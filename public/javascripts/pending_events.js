var PENDING_EVENTS = [];

$(document).ready(function () {
  console.log("pass event list");
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
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
  }
});

const getClickEvent = (event_id) => {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
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

  xhttp.open("POST", "/users/getEvent", true);
  xhttp.send();
}