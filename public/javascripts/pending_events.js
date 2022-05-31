const PENDING_EVENTS = [
]

var vueinst = new Vue({
  el: "#app",
  data: {
      p_event: PENDING_EVENTS,
  }
});


$(document).ready(function () {
  console.log("pass event list");
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(vueinst.p_event);
        vueinst.p_event.splice(0);
        console.log(JSON.parse(this.responseText))
        var events = JSON.parse(this.responseText);
        for (let event of events) {
          vueinst.p_event.push(event);
        }
        console.log(vueinst.p_event);
      }
  }

  xhttp.open("POST", "/users/getEventList", true);
  xhttp.send();
});