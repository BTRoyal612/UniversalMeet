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

var vueinst = new Vue({
  el: "#app",
  data: {
      p_event: PENDING_EVENTS,
  }
});


function getUserEventList() {
  console.log("pass event list");
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        Vue.set(vueinst.p_event, JSON.parse(this.responseText))
      }
  }

  xhttp.open("POST", "/users/getEventList", true);
  xhttp.send();
};