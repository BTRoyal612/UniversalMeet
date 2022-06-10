/*************************** HOME PAGE ****************************/
var meetingIDbtn = document.querySelector('.meeting-btn');
var meetingIDinput = document.querySelector('.meeting-input-ctn');


meetingIDbtn.addEventListener('click', function () {
  meetingIDbtn.classList.add('open');
  meetingIDinput.classList.add('open');
});
