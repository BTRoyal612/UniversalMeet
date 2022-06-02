var dateChosen;
var dateChosenCount = 0;
var dateEvent;

const chooseDate = (id) => {
  var id_str = id.toString()
  var date_arr = []
  var cur_date = ""
  for (let i = 0; i < id_str.length; i++) {
    if (id_str[i] == '-') {
      date_arr.push(cur_date);
      cur_date = "";
    }
    else {
      cur_date += id_str[i];
    }
  }
  date_arr.push(cur_date)
  var days = document.getElementsByClassName('calendar-day-hover');
  var chosenEl = document.querySelector(".chosen");
  for (let i = 0; i < days.length; i++) {
    if (chosenEl == days[i] && chosenEl.id != id) {
      chosenEl.classList.remove("chosen");
      dateChosenCount -= 1;
    }
    if (days[i].id == id) {
      days[i].classList.toggle("chosen");
      dateChosen = id;
      dateChosenCount += 1;
    }
  }
  if (dateChosenCount % 2 == 0) {
    dateChosen = "";
  }
  var date = new Date(id_str);
  dateEvent = date.toISOString().slice(0, 10);
  console.log(dateEvent);
}

// CHECK LEAP YEAR
const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)
}

const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28
}

var calendar = document.querySelector('.calendar')

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let month_picker = document.querySelector('#month-picker')

month_picker.onclick = () => {
  month_list.classList.add('show')
}

const generateCalendar = (month, year) => {

  var calendar_days = document.querySelector('.calendar-days')
  calendar_days.innerHTML = ''
  let calendar_header_year = document.querySelector('#year')

  let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  let currDate = new Date()

  month_picker.innerHTML = month_names[month]
  calendar_header_year.innerHTML = year
  var new_month = month + 1
  let first_day = new Date(new_month + "-1-" + year)

  for (var i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement('div')
    if (i >= first_day.getDay()) {
      let date = (month + 1).toString() + "-" + (i - first_day.getDay() + 1).toString() + "-" + (year).toString()
      day.setAttribute('id', date);
      day.setAttribute('onclick', "chooseDate('" + date + "')");
      day.classList.add('calendar-day-hover')
      day.innerHTML = i - first_day.getDay() + 1
      if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
        day.classList.add('curr-date')
      }
    }
    calendar_days.appendChild(day)
  }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
  let month = document.createElement('div')
  month.innerHTML = '<div>' + e + '</div>'
  month.onclick = () => {
    month_list.classList.remove('show')
    curr_month.value = index
    generateCalendar(curr_month.value, curr_year.value)
  }
  month_list.appendChild(month)
})

document.querySelector('#prev-year').onclick = () => {
  --curr_year.value
  generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
  ++curr_year.value
  generateCalendar(curr_month.value, curr_year.value)
}

let currDate = new Date()

let curr_month = { value: currDate.getMonth() }
let curr_year = { value: currDate.getFullYear() }

generateCalendar(curr_month.value, curr_year.value)

function passDate() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  }

  xhttp.open("POST", "/users/passDate", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ dateEvent:dateEvent }));
};

