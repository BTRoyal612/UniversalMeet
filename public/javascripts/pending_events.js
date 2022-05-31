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
        console.log(JSON.parse(this.responseText))
        Vue.set(vueinst.p_event, JSON.parse(this.responseText))
      }
  }

  xhttp.open("POST", "/users/getEventList", true);
  xhttp.send();
});