var event_id = <%=eventId%>
    var duration;
    $(document).ready(function () {
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let cur_event = JSON.parse(this.responseText)[0];
          let event_name = document.getElementById("event-name");
          event_name.innerText = cur_event["event_name"]
          let event_date = document.getElementById("event-date")
          event_date.innerText = cur_event["date"]
          let event_duration = document.getElementById("event-duration");
          event_duration.innerText = cur_event["duration"]
          duration = cur_event["duration"]
          let event_timezone = document.getElementById("event-timezone");
          event_timezone.innerText = cur_event["time_zone"]
          let event_status = document.getElementById("event-status");
          if (cur_event["isOnline"] == 0)
          {
            event_status.innerText = "Offline"
          }
          else {
            event_status.innerText = "Online"
          }
          let event_duedate = document.getElementById("event-duedate");
          event_duedate.innerText = cur_event["due_date"]
          let event_link = document.getElementById("event-link");
          event_link.innerText = cur_event["hold_location"]
        }
      }

      xhttp.open("POST", "/users/getEvent", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({ event_id: event_id }));
    })

let timeframes = [
  {
    id: 1,
    from: "10:00",
    to: "12:00",
  },
  {
    id: 2,
    from: "15:00",
    to: "17:00",
  }
]

window.onload = () => {
  var ctn = document.getElementsByClassName('response-avail-ctn')[0];
  for (let i in timeframes) {
    var tfDIV = document.createElement('div');
    tfDIV.classList.add('event-input');
    tfDIV.classList.add('response-info-tf-input');
    tfDIV.id = i
    tfDIV.onclick = function () {
      this.classList.toggle("chosen-tf")
    };
    tfDIV.innerText = 'From ' + timeframes[i]['from'] + ' To ' + timeframes[i]['to'];
    ctn.appendChild(tfDIV);
  }
}

const sendTimeFrames = () => {
  let chosenTF = document.getElementsByClassName("chosen-tf");
  let tfArr = [];
  for (tf of chosenTF) {
    tfArr.push(timeframes[tf.id])
  }
  console.log(tfArr)
}