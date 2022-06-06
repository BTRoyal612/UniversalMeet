DROP DATABASE IF EXISTS universal_meet;
CREATE DATABASE universal_meet;
USE universal_meet;

CREATE TABLE User(
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50), /* should it be not null? */
    password BINARY(32) NOT NULL, /* should be salted and hashing encrypto */
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    /* isRegistered BOOLEAN NOT NULL, */

    PRIMARY KEY (user_id),
    CONSTRAINT username_not_unique UNIQUE (username),
    CONSTRAINT email_not_unique UNIQUE (email)
);

CREATE TABLE Event(
    event_id INT NOT NULL AUTO_INCREMENT,
    creator_id INT NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    /* time_begin TIME NOT NULL, */
    /* time_end TIME NOT NULL, */
    duration SMALLINT(4) NOT NULL, /* unit: minute or hour? */
    time_zone VARCHAR(50) NOT NULL, /* what this variable should be (maybe depends on the value from js) */
    hold_location VARCHAR(300) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    note VARCHAR(500),
    share_link VARCHAR(300) NOT NULL, /* should be generated automatically, but also unique. Not sure how to do? */
    isFinalised BOOLEAN NOT NULL DEFAULT false, /* is this necessary auto renew TIMESTAMP to judge isFinalised based on due_date? */
    isOnline BOOLEAN NOT NULL,

    PRIMARY KEY (event_id),
    CONSTRAINT fk_userid_to_event FOREIGN KEY (creator_id) REFERENCES User (user_id)
);

CREATE TABLE Event_availability(
    event_id INT NOT NULL,
    avail_time TIME NOT NULL,

    PRIMARY KEY (event_id, avail_time),
    CONSTRAINT fk_eventid_to_availability FOREIGN KEY (event_id) REFERENCES Event (event_id) ON DELETE CASCADE
);

CREATE TABLE Event_pending(
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    isPending BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (event_id, user_id), /* this combination must be unique */
    CONSTRAINT fk_eventid_to_pending FOREIGN KEY (event_id) REFERENCES Event (event_id) ON DELETE CASCADE,
    CONSTRAINT fk_userid_to_pending FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE
);

CREATE TABLE Event_chosen_time(
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    chosen_time TIME NOT NULL,

    /* this combination must be unique. which means one user cannot repeatedly choose the same time in one event */
    PRIMARY KEY (event_id, user_id, chosen_time),
    CONSTRAINT fk_eventid_to_chosen FOREIGN KEY (event_id) REFERENCES Event (event_id) ON DELETE CASCADE,
    CONSTRAINT fk_userid_to_chosen FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE
);


CREATE TABLE Email_preference(
    user_id INT NOT NULL,
    user_respond BOOLEAN NOT NULL DEFAULT false,
    avail_confirm BOOLEAN NOT NULL DEFAULT false,
    event_finalize BOOLEAN NOT NULL DEFAULT false,
    event_cancel BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT fk_userid_to_email FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE
);


CREATE VIEW Pp_number AS
    SELECT event_id, chosen_time, COUNT(*) FROM Event_chosen_time
    GROUP BY event_id, chosen_time
    ORDER BY event_id ASC;


/*
Procedure Function List
    CALL sign_in(username_ VARCHAR(50), password_ VARCHAR(30));
    CALL sign_up(user_name VARCHAR(50), email_ VARCHAR(50), password_ VARCHAR(30));
    CALL create_event(creator_id_ INT, event_name_ VARCHAR(100), date_ DATE, duration_ SMALLINT(4), time_zone_ VARCHAR(50), hold_location_ VARCHAR(300), due_date_ TIMESTAMP, note_ VARCHAR(500), share_link_ VARCHAR(300), isOnline_ BOOLEAN);
    CALL change_password(user_id_ INT, old_password_ VARCHAR(30), new_password_ VARCHAR(30));
    CALL add_email(user_id_ INT, email_ VARCHAR(50));
    CALL change_email(user_id_ INT, old_email_ VARCHAR(50), new_email_ VARCHAR(50));
    CALL join_event(event_id_ INT, user_id_ INT);
    CALL choose_time(event_id_ INT, user_id_ INT, chosen_time_ TIME);
*/

DELIMITER //
CREATE PROCEDURE login (
    IN username_ VARCHAR(50), password_ VARCHAR(30)
)
BEGIN
    SELECT * FROM User /* if admin, then... else... */
        WHERE username = username_ AND password = UNHEX(SHA2(CONCAT('SA', password_, 'LT'), 256));
END //
DELIMITER ;


/* For sign up, need to sign_in after sign_up to check if sign_up is successful, and give feedback to user */
DELIMITER //
CREATE PROCEDURE sign_up (
    IN username_ VARCHAR(50), email_ VARCHAR(50), password_ VARCHAR(30)
)
BEGIN
    INSERT INTO User (username, email, password) VALUES (username_, email_, UNHEX(SHA2(CONCAT('SA', password_, 'LT'), 256)));
    CALL login(username_, password_);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE google_login ( IN username_ VARCHAR(50), email_ VARCHAR(50) )
BEGIN
    INSERT INTO User (username, email, password) VALUES (username_, email_, UNHEX(SHA2(CONCAT('SA', 'strong_default_password', 'LT'), 256)));
    SELECT * FROM User WHERE email = email_;
END //
DELIMITER ;


/* CALL create_event(1, 'An event name','2020-06-10','12:00:01', '15:00:01', 30, '+03:00', 'Hub Centre', '2020-06-05 13:59:59', 'This is note', 'https://this-is.sharelink.com', false); */
DELIMITER //
CREATE PROCEDURE create_event(
    IN
    creator_id_ INT,
    event_name_ VARCHAR(100),
    date_ DATE,
    /*time_begin_ TIME,
    time_end_ TIME,*/
    duration_ SMALLINT(4),
    time_zone_ VARCHAR(50),
    hold_location_ VARCHAR(300),
    due_date_ TIMESTAMP,
    note_ VARCHAR(500),
    share_link_ VARCHAR(300),
    isOnline_ BOOLEAN
)
BEGIN
    INSERT INTO Event(creator_id, event_name, date, /*time_begin, time_end,*/ duration, time_zone, hold_location, due_date, note, share_link, isOnline)
        VALUES (creator_id_, event_name_, date_, /*time_begin_, time_end_,*/ duration_, time_zone_, hold_location_, due_date_, note_, share_link_, isOnline_);
    SELECT event_id FROM Event ORDER BY event_id DESC LIMIT 1;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE change_password(IN user_id_ INT, old_password_ VARCHAR(30), new_password_ VARCHAR(30))
BEGIN
    UPDATE User SET password = UNHEX(SHA2(CONCAT('SA', new_password_, 'LT'), 256)) WHERE user_id_ = user_id AND password = UNHEX(SHA2(CONCAT('SA', old_password_, 'LT'), 256));
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE add_email(IN user_id_ INT, email_ VARCHAR(50))
BEGIN
    UPDATE User SET email = email_ WHERE user_id_ = user_id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE change_email(IN user_id_ INT, old_email_ VARCHAR(50), new_email_ VARCHAR(50))
BEGIN
    UPDATE User SET email = new_email_ WHERE user_id_ = user_id AND email = old_email_;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE join_event(IN event_id_ INT, user_id_ INT)
BEGIN
    INSERT INTO Event_pending(event_id, user_id) VALUES (event_id_, user_id_);
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE choose_time(IN event_id_ INT, user_id_ INT, chosen_time_ TIME)
BEGIN
    INSERT INTO Event_chosen_time VALUES (event_id_, user_id_, chosen_time_);
    UPDATE Event_pending SET isPending = false WHERE event_id = event_id_ AND user_id = user_id_;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE delete_time(IN event_id_ INT, user_id_ INT)
BEGIN
    DELETE FROM Event_chosen_time WHERE
        event_id = event_id_ AND user_id = user_id_;
    IF EXISTS (SELECT * FROM Event_chosen_time WHERE event_id = event_id_ AND user_id = user_id_) = false THEN
        UPDATE Event_pending SET isPending = true WHERE event_id = event_id_ AND user_id = user_id_;
    END IF;
END //
DELIMITER ;


/* If this user is not creator, this function will return NULL */
DELIMITER //
CREATE PROCEDURE isCreator(IN event_id_ INT, user_id_ INT)
BEGIN
    SELECT (event_id, user_id) FROM Event WHERE event_id = event_id_ AND user_id =user_id_;
END //
DELIMITER ;

/* Cannot change duration, timezone, sharelink */
DELIMITER //
CREATE PROCEDURE edit_event(
    IN
    event_id_ INT,
    creator_id_ INT,
    event_name_ VARCHAR(100),
    hold_location_ VARCHAR(300),
    due_date_ TIMESTAMP,
    note_ VARCHAR(500),
    isOnline_ BOOLEAN
)
BEGIN
    UPDATE Event SET
        event_name = event_name_,
        hold_location = hold_location_,
        due_date = due_date_,
        note = note_,
        isOnline = isOnline_
        WHERE event_id = event_id_ AND creator_id = creator_id_;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE delete_event(IN event_id_ INT, user_id_ INT)
BEGIN
    DELETE FROM Event WHERE event_id = event_id_ AND user_id = user_id_;
END //
DELIMITER ;

/* Creator add availability */
DELIMITER //
CREATE PROCEDURE add_availability(IN event_id_ INT, user_id_ INT, avail_time_ TIME)
BEGIN
    IF EXISTS (SELECT * FROM Event WHERE event_id = event_id_ AND creator_id = user_id_) THEN
        INSERT INTO Event_availability VALUES (event_id_, avail_time_);
    END IF;
END //
DELIMITER ;



/* Havent dont list
Event Search
Finalise an event
Change Finalise Time
Set email notifications
Modify user information. (System Admin)
Delete users. (System Admin)
Modify event information. (System Admin)
Delete Events. (System Admin)
Sign-up other Admins. (System Admin)
Add new Users. (System Admin)
*/

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

CALL create_event(1, 'event00', '2020-06-10', 60, '+02:30', '161 house', '2022-05-20 04:34:33', 'hotpot', 'none', false);
CALL create_event(3, 'event01', '2020-06-10', 90, '+06:00', '378 house', '2018-07-25 18:34:33', '9/1', 'none', false);
CALL create_event(5, 'event02', '2020-06-10', 30, '-04:30', 'online', '2022-06-30 10:30:12', 'volunteer', 'zoom', true);
CALL create_event(7, 'event03', '2020-06-10', 15, '+07:00', '161 house', '2022-06-24 00:00:00', 'Thai', 'none', false);
CALL create_event(9, 'event04', '2020-06-10', 45, '-08:00', 'University', '2022-05-14 14:30:25', 'WEB project', 'discord', false);

CALL add_availability(5, 9, '17:00:00');
CALL add_availability(5, 9, '19:00:00');
CALL add_availability(5, 9, '21:00:00');

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

CALL choose_time(4, 3, '12:00:01');
CALL choose_time(4, 4, '12:00:01');
CALL choose_time(4, 8, '12:00:01');
CALL choose_time(1, 3, '12:30:01');
CALL choose_time(1, 8, '12:30:01');
CALL choose_time(2, 1, '12:00:01');
CALL choose_time(2, 7, '12:00:01');
CALL choose_time(3, 2, '12:00:01');




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
