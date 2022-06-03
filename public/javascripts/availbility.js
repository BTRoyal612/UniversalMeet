curTF = 1;
const addTimeFrame = () => {
  var tf_ctn = document.getElementsByClassName('avail-ctn')[0];
  var tf = document.createElement('div');
  tf.id = curTF;
  curTF+=1;
  tf.classList.add("avail-time-frame");
  tf.innerHTML = '<label>From</label><input type="time" name="event-name" class="avail-time-frame-input"><label>To</label><input type="time" name="event-name" class="avail-time-frame-input">'
  tf_ctn.appendChild(tf)
}