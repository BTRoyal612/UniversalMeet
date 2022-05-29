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