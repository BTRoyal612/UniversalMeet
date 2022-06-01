-- Sample Database Schema

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS universal_meet;
CREATE SCHEMA universal_meet;
USE universal_meet;

CREATE TABLE User(
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(50),
    password VARCHAR(50) NOT NULL, /* should be salted and hashing encrypto */
    isAdmin BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (user_id),
    CONSTRAINT username_not_unique UNIQUE (username),
    CONSTRAINT email_not_unique UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Event(
    event_id INT NOT NULL AUTO_INCREMENT,
    creator_id INT NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    -- time_begin TIME NOT NULL, /* TIME only includes hh:mm:ss */
    -- time_end TIME NOT NULL, /* bigger than time_begin */
    duration TINYINT(4) NOT NULL, /* unit: minute or hour? */
    time_zone VARCHAR(50) NOT NULL, /* what this variable should be (maybe depends on the value from js) */
    hold_location VARCHAR(300) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    note VARCHAR(500),
    share_link VARCHAR(300) NOT NULL, /* should be generated automatically, but also unique. Not sure how to do? */
    isFinalised BOOLEAN NOT NULL DEFAULT false, /* is this necessary auto renew TIMESTAMP to judge isFinalised based on due_date? */
    isOnline BOOLEAN NOT NULL,

    PRIMARY KEY (event_id),
    CONSTRAINT fk_userid_to_event FOREIGN KEY (creator_id) REFERENCES User (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Event_pending(
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    isPending BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (event_id, user_id), /* this combination must be unique */
    CONSTRAINT fk_eventid_to_pending FOREIGN KEY (event_id) REFERENCES Event (event_id) ON DELETE CASCADE,
    CONSTRAINT fk_userid_to_pending FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Event_chosen_time(
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    chosen_time TIME NOT NULL,

    /* this combination must be unique. which means one user cannot repeatedly choose the same time in one event */
    PRIMARY KEY (event_id, user_id, chosen_time),
    CONSTRAINT fk_eventid_to_chosen FOREIGN KEY (event_id) REFERENCES Event (event_id) ON DELETE CASCADE,
    CONSTRAINT fk_userid_to_chosen FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Email_preference(
    user_id INT NOT NULL,
    user_respond BOOLEAN NOT NULL DEFAULT false,
    avail_confirm BOOLEAN NOT NULL DEFAULT false,
    event_finalize BOOLEAN NOT NULL DEFAULT false,
    event_cancel BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT fk_userid_to_email FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* For sign up, need to sign_in after sign_up to check if sign_up is successful, and give feedback to user */
/* EXEC sign_up @username = ?, @email = ?, @password = ?; */
DELIMITER //
CREATE PROCEDURE sign_up (
    IN user_name VARCHAR(30), e_mail VARCHAR(50), pass_word VARCHAR(50)
)
BEGIN
    INSERT INTO User (username, email, password) VALUES (user_name, e_mail, pass_word);
END //
DELIMITER ;

/* CALL sign_up('zonghan', 'liu1021119271@gmail.com', '123123'); */
DELIMITER //
CREATE PROCEDURE login (
    IN user_name VARCHAR(30), pass_word VARCHAR(50)
)
BEGIN
    SELECT * FROM User /* if admin, then... else... */
        WHERE username = user_name AND password = pass_word;
END //
DELIMITER ;

/* CALL create_event(1, 'An event name','2020-06-10', 30, '+03:00', 'Hub Centre', '2020-06-05 13:59:59', 'This is note', 'https://this-is.sharelink.com', false); */
DELIMITER //
CREATE PROCEDURE create_event(
    IN
    creator_id_ INT,
    event_name_ VARCHAR(100),
    date_ DATE,
    duration_ TINYINT(4),
    time_zone_ VARCHAR(50),
    hold_location_ VARCHAR(300),
    due_date_ TIMESTAMP,
    note_ VARCHAR(500),
    share_link_ VARCHAR(300),
    isOnline_ BOOLEAN
)
BEGIN
    INSERT INTO Event(creator_id, event_name, date, duration, time_zone, hold_location, due_date, note, share_link, isOnline)
        VALUES (creator_id_, event_name_, date_, duration_, time_zone_, hold_location_, due_date_, note_, share_link_, isOnline_);
    SELECT event_id FROM Event ORDER BY event_id DESC LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE join_event(IN event_id_ INT, user_id_ INT)
BEGIN
    INSERT INTO Event_pending(event_id, user_id) VALUES (event_id_, user_id_);
END //
DELIMITER ;

--
-- Dumping data for table user
--

CALL sign_up('zonghan', 'a1@gmail.com', '123123');
CALL sign_up('nam', 'a2@gmail.com', '123123');
CALL sign_up('bao', 'a3@gmail.com', '123123');
CALL sign_up('marcus', 'a4@gmail.com', '123123');
CALL sign_up('jason', 'a5@gmail.com', '123123');
CALL sign_up('vill', 'a6@gmail.com', '123123');
CALL sign_up('maria', 'a7@gmail.com', '123123');
CALL sign_up('marry', 'a8@gmail.com', '123123');
CALL sign_up('loser', 'a9@gmail.com', '123123');
CALL sign_up('biaaatch', 'a10@gmail.com', '123123');

--
-- Dumping data for table event
--

CALL create_event(1, 'event00','2020-06-10', 60, '+02:30', '161 house', '2022-05-20 04:34:33', 'hotpot', 'none', false);
CALL create_event(3, 'event01','2020-06-10', 90, '+06:00', '378 house', '2018-07-25 18:34:33', '9/1', 'none', false);
CALL create_event(5, 'event02','2020-06-10', 30, '-04:30', 'online', '2022-06-30 10:30:12', 'volunteer', 'zoom', true);
CALL create_event(7, 'event03','2020-06-10', 15, '+07:00', '161 house', '2022-06-24 00:00:00', 'Thai', 'none', false);
CALL create_event(9, 'event04','2020-06-10', 45, '-08:00', 'University', '2022-05-14 14:30:25', 'WEB project', 'discord', false);

--
-- Dumping data for table event pending
--

CALL join_event(1,3);
CALL join_event(1,4);
CALL join_event(1,8);
CALL join_event(2,1);
CALL join_event(2,7);
CALL join_event(3,2);
CALL join_event(3,9);
CALL join_event(4,10);
CALL join_event(4,3);
CALL join_event(5,1);
CALL join_event(5,5);

--
-- Dumping data for table email preference
--

SET AUTOCOMMIT=0;
INSERT INTO Email_preference VALUES (1, false, false, false, false),
(2, false, false, false, false),
(3, false, false, true, false),
(4, false, false, false, false),
(5, true, false, false, true),
(6, false, false, false, false),
(7, true, true, true, true),
(8, false, false, false, false),
(9, false, true, false, false),
(10, false, false, false, false);
COMMIT;