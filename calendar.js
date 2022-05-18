// DARK MODE TOGGLE

var dateChosen = [];


document.querySelector('.dark-mode-switch').onclick = () => {
  document.querySelector('body').classList.toggle('dark');
  document.querySelector('body').classList.toggle('light');
};

const chooseDate = (id) => {
  let inArray = false;
  if (document.querySelector('body').classList[0] == 'dark') {

    for (let index = 0; index < dateChosen.length; index++) {
      if (dateChosen[index] == id) {
        dateChosen.splice(index, 1);
        inArray = true;
      }
    }
    if (!inArray) {
      dateChosen.push(id);
    }
  }
  else {
    dateChosen = [id];
  }

  let date = document.getElementById(id);
  date.classList.toggle('chosen-day');
};

// CHECK LEAP YEAR
const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0);
};

const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

var calendar = document.querySelector('.calendar');

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let month_picker = document.querySelector('#month-picker');

month_picker.onclick = () => {
  month_list.classList.add('show');
};

const generateCalendar = (month, year) => {
  var calendar_days = document.querySelector('.calendar-days');
  calendar_days.innerHTML = '';
  let calendar_header_year = document.querySelector('#year');

  let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let currDate = new Date();

  month_picker.innerHTML = month_names[month];
  calendar_header_year.innerHTML = year;

  let first_day = new Date(month, year, 1);

  for (var i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement('div');
    if (i >= first_day.getDay()) {
      let date = (i - first_day.getDay() + 1).toString() + (month + 1).toString() + (year).toString();
      day.setAttribute('id', date);
      day.setAttribute('onclick', 'chooseDate(' + date + ')');
      day.classList.add('calendar-day-hover');
      day.innerHTML = i - first_day.getDay() + 1;
      if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
        day.classList.add('curr-date');
      }
    }
    calendar_days.appendChild(day);
  }
};

let month_list = calendar.querySelector('.month-list');

month_names.forEach((e, index) => {
  let month = document.createElement('div');
  month.innerHTML = '<div>' + e + '</div>';
  month.onclick = () => {
    month_list.classList.remove('show');
    curr_month.value = index;
    generateCalendar(curr_month.value, curr_year.value);
  };
  month_list.appendChild(month);
});

document.querySelector('#prev-year').onclick = () => {
  --curr_year.value;
  generateCalendar(curr_month.value, curr_year.value);
};

document.querySelector('#next-year').onclick = () => {
  ++curr_year.value;
  generateCalendar(curr_month.value, curr_year.value);
};

let currDate = new Date();

let curr_month = { value: currDate.getMonth() };
let curr_year = { value: currDate.getFullYear() };

generateCalendar(curr_month.value, curr_year.value);

