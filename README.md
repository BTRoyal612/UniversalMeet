# Universal Meet

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#requirements">Requirements</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#design">Design</a> •
  <a href="#about">About</a> •
  <a href="#contact-us">Contact Us</a> •
  <a href="#license">License</a>
</p>


## Introduction
Universal Meet is social Web Application for multi-person event scheduling. It allows you to schedule events with other people in different regions using different time zones. In addition, you can also see the details of the parties/events you attended/created on your calendar (e.g. availability, selected time, number of attendees, etc.). You can use a Google account or a unique email to register as a Universal Meet user to use our service. We will notify you about the event by email. And of course, you can change your notification preferences in our application at anytime.


## Requirements
Register as our user (or use your Google Account). Even if you are not a registered user, you can still view the details of events shared by others through the link.


## Key Features
* Specify multiple availability for an event
* View the status of your event (pending or confirmed)
* View the number of attendees per availability for the event as a host
* Generate Quick link and share channels for your event dissemination
* As a host/participant, get email notifications when events progress
* Quick login with Google account


## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [MySQL](https://www.mysql.com/) installed on your computer. An alternative for people from COMP SCI 2207 course, you can run this in codespace, using set up commands from the courses. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/BTRoyal612/UniversalMeet.git

# Go into the repository
$ cd UniversalMeet

# Install dependencies
$ npm install

# Run the MySQL for database
$ sql_start

# Insert database schema, queries and mock data
$ mysql --host=127.0.0.1 < UniversalMeet.sql

# Run the app
$ npm start
```


## Design

* Front-end
	- Use consistent color group for all pages: black, purple, and yellow.
	- All forms and cards are in the middle and have 7px border radius to pop up from the background.
	- Buttons have different hover properties to easily identify.
	- Use JavaScript to make sure users have to enter required inputs.
	- All pages have home button to come back to profile.
	- A calendar in the profile page that displays upcoming finalized events.

* Back-end
	- Use NodeJS to structure the code. 
	- Use router and AJAX functions to interact with the database. 
	- Use router and view engines (EJS) to smoothly render and pass variables around pages.
	- Integrated [openID](https://openid.net/) to use google sign in.
	- Integrated [nodemailer](https://nodemailer.com/about/) to send email notification

* Database
	- Table and Virtual Table are used. Also, to work better with the router, 26 Procedures have been added. Depending on the requirements, some derived data will be updated automatically when the base data changes, or through Procedures when needed.
	

## About
We are undergraduate Computer Science students from the University of Adelaide. This project is version 1.0 and maybe the final. If you are interested in our project, please contact us via Discord or Email above (no spam).


## Contact Us
Email: [gb.hoang02@gmail.com]
Discord: [WDC Project](https://discord.gg/2Wcn7Bcw)


## License

MIT
