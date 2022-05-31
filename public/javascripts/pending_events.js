const PENDING_EVENTS = [
  {
    name: 'Web Event',
    url: '',
    isHost: true,
  },
  {
    name: 'Web Event',
    url: '',
    isHost: true,
  },
  {
    name: 'Web Event',
    url: '',
    isHost: false,
  },
  {
    name: 'Web Event',
    url: '',
    isHost: true,
  },
  {
    name: 'Web Event',
    url: '',
    isHost: false,
  },
  {
    name: 'Web Event',
    url: '',
    isHost: false,
  },
  {
    name: 'Web Event',
    url: '',
    isHost: false,
  },
  {
    name: 'Web Event',
    url: '',
    isHost: true,
  },
]

function getUserEventList() {
  console.log("pass event list");
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        PENDING_EVENTS = JSON.parse(this.responseText);
        console.log(PENDING_EVENTS);
      }
  }

  xhttp.open("POST", "/users/getEventList", true);
  xhttp.send();
};

var vueinst = new Vue({
  el: "#app",
  data: {
      p_event: PENDING_EVENTS,
  }
});