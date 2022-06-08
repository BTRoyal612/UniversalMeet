DROP DATABASE IF EXISTS universal_meet;
CREATE DATABASE universal_meet;
USE universal_meet;

CREATE TABLE User(
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password BINARY(32) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    isRegistered BOOLEAN NOT NULL,

    PRIMARY KEY (user_id),
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
    note TEXT(500),
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


/* A Virtual Table for counting how many people choose what timeframe of an event */
CREATE VIEW Pp_number AS
    SELECT event_id, chosen_time, COUNT(*) AS count FROM Event_chosen_time
    GROUP BY event_id, chosen_time
    ORDER BY event_id ASC;


/*
Procedure Function List

    CALL sign_up(user_name_, email_, password_);
    CALL login(email_, password_);
    CALL guest_signup(email_);
    CALL google_login(username_, email_);
    CALL change_password(user_id_, new_password_);
    CALL add_email(user_id_, email_);
    CALL change_email(user_id_, new_email_);
    CALL change_notification(user_id_, user_respond_, avail_confirm_, event_finalize_, event_cancel_);

    CALL create_event(creator_id_, event_name_, date_, duration_, time_zone_, hold_location_, due_date_, note_, share_link_, isOnline_);
    CALL add_availability(event_id_, user_id_, avail_time_);
    CALL edit_event(event_id_, creator_id_, event_name_, hold_location_, due_date_, note_, isOnline_, duration_, time_zone_, share_link_);
    CALL change_finalise_time(event_id_, due_date_);
    CALL finalise_event(event_id_, isFinalised_);
    CALL delete_event(event_id_, user_id_);
    CALL isCreator(event_id_, user_id_);

    CALL join_event(event_id_, user_id_);
    CALL choose_time(event_id_, user_id_, chosen_time_);
    CALL delete_time(event_id_, user_id_);

    CALL admin_add_user(username_ , email_ , password_ , isAdmin_);
    CALL admin_modify_user_info(admin_id_, user_id_, username_, email_, password_, isAdmin_);
    CALL admin_delete_user(admin_id_, user_id_);
    CALL admin_add_event(admin_id_, creator_id_, event_name_, date_, duration_, time_zone_, hold_location_, due_date_, note_, share_link_, isOnline_);
    CALL admin_modify_event_info(admin_id_, event_id_, event_name_, date_, duration_, time_zone_, hold_location_, due_date_, note_, share_link_, isFinalised_, isOnline_);
    CALL admin_delete_event(admin_id_, event_id_);
*/

/* For sign up, need to sign_in after sign_up to check if sign_up is successful, and give feedback to user */
DELIMITER //
CREATE PROCEDURE sign_up (
    IN username_ VARCHAR(50), email_ VARCHAR(50), password_ VARCHAR(30)
)
BEGIN
    INSERT INTO User (username, email, password, isRegistered) VALUES (username_, email_, UNHEX(SHA2(CONCAT('SA', password_, 'LT'), 256)), true);
    CALL login(email_, password_);
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE login (
    IN email_ VARCHAR(50), password_ VARCHAR(30)
)
BEGIN
    SELECT * FROM User /* if admin, then... else... */
        WHERE email = email_ AND password = UNHEX(SHA2(CONCAT('SA', password_, 'LT'), 256));
END //
DELIMITER ;


/* Unregistered account for tourists */
DELIMITER //
CREATE PROCEDURE guest_signup(IN email_ VARCHAR(50))
BEGIN
    IF NOT EXISTS (SELECT * FROM User WHERE email = email_) THEN
        INSERT INTO User (username, email, password, isRegistered) VALUES ('tourist', email_, UNHEX(SHA2(CONCAT('SA', 'LT'), 256)), false);
    END IF;
    SELECT * FROM User WHERE email = email_;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE google_login ( IN username_ VARCHAR(50), email_ VARCHAR(50) )
BEGIN
    IF NOT EXISTS (SELECT * FROM User WHERE email = email_) THEN
        INSERT INTO User (username, email, password, isRegistered) VALUES (username_, email_, UNHEX(SHA2(CONCAT('SA', 'strong_default_password', 'LT'), 256)), true);
    END IF;
    SELECT * FROM User WHERE email = email_;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE change_password(IN user_id_ INT, new_password_ VARCHAR(30))
BEGIN
    UPDATE User SET password = UNHEX(SHA2(CONCAT('SA', new_password_, 'LT'), 256)) WHERE user_id_ = user_id;
END //
DELIMITER ;


/*
DELIMITER //
CREATE PROCEDURE add_email(IN user_id_ INT, email_ VARCHAR(50))
BEGIN
    UPDATE User SET email = email_ WHERE user_id_ = user_id;
END //
DELIMITER ;
*/


DELIMITER //
CREATE PROCEDURE change_email(IN user_id_ INT, new_email_ VARCHAR(50))
BEGIN
    UPDATE User SET email = new_email_ WHERE user_id_ = user_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE change_notification(
    IN
    user_id_ INT,
    user_respond_ BOOLEAN,
    avail_confirm_ BOOLEAN,
    event_finalize_ BOOLEAN,
    event_cancel_ BOOLEAN
)
BEGIN
    INSERT INTO Email_preference VALUES (user_id_, false, false, false, false);
    UPDATE Email_preference SET
    user_respond = user_respond_,
    avail_confirm = avail_confirm_,
    event_finalize = event_finalize_,
    event_cancel = event_cancel_
    WHERE user_id = user_id_;
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
    CALL join_event((SELECT MAX(event_id) FROM Event), creator_id_);
    UPDATE Event_pending SET isPending = false WHERE event_id = ((SELECT MAX(event_id) FROM Event)) AND user_id = creator_id_;
    SELECT * from Event WHERE event_id = (SELECT MAX(event_id) FROM Event);
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
    isOnline_ BOOLEAN,
    duration_ SMALLINT(4),
    time_zone_ VARCHAR(50),
    share_link_ VARCHAR(300)
)
BEGIN
    UPDATE Event SET
        event_name = event_name_,
        hold_location = hold_location_,
        due_date = due_date_,
        note = note_,
        isOnline = isOnline_,
        duration = duration_,
        time_zone = time_zone_,
        share_link = share_link_
        WHERE event_id = event_id_ AND creator_id = creator_id_;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE change_finalise_time(IN event_id_ INT, due_date_ TIMESTAMP)
BEGIN
    UPDATE Event SET due_date = due_date_ WHERE event_id = event_id_;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE finalise_event(IN event_id_ INT, isFinalised_ BOOLEAN)
BEGIN
    UPDATE Event SET isFinalised = isFinalised_ WHERE event_id = event_id_;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE delete_event(IN event_id_ INT, user_id_ INT)
BEGIN
    DELETE FROM Event WHERE event_id = event_id_ AND creator_id = user_id_;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE get_events(IN user_id_ INT)
BEGIN
    SELECT event_id FROM Event_pending WHERE user_id = user_id_;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE get_events_on_calendar(IN event_id_ INT)
BEGIN
    SELECT Event.event_id, Event.event_name, Event.date, Pp_number.chosen_time, Event.duration, Pp_number.count FROM Event
    INNER JOIN Pp_number ON Event.event_id = Pp_number.event_id
    WHERE Event.event_id = event_id_ AND (Event.isFinalised = true OR Event.due_date <= CURRENT_TIMESTAMP())
    AND Pp_number.chosen_time = (SELECT MIN(chosen_time) FROM Pp_number WHERE count = (SELECT MAX(count) FROM Pp_number WHERE event_id = event_id_))
    GROUP BY Event.event_id, Pp_number.chosen_time;

END //
DELIMITER ;



/* If this user is not creator, this function will return NULL */
DELIMITER //
CREATE PROCEDURE isCreator(IN event_id_ INT, user_id_ INT)
BEGIN
    SELECT (event_id, user_id) FROM Event WHERE event_id = event_id_ AND user_id =user_id_;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE join_event(IN event_id_ INT, user_id_ INT)
BEGIN
    INSERT INTO Event_pending(event_id, user_id) VALUES (event_id_, user_id_);
END //
DELIMITER ;

/* In router, check the return isFinalised value. If false then all good. If true then tell user this event is finalised */
DELIMITER //
CREATE PROCEDURE choose_time(IN event_id_ INT, user_id_ INT, chosen_time_ TIME)
BEGIN
    UPDATE Event SET isFinalised = true WHERE due_date <= CURRENT_TIMESTAMP() AND event_id = event_id_;
    IF EXISTS(SELECT * FROM Event WHERE event_id = event_id_ AND isFinalised = false) THEN
        INSERT INTO Event_chosen_time VALUES (event_id_, user_id_, chosen_time_);
        UPDATE Event_pending SET isPending = false WHERE event_id = event_id_ AND user_id = user_id_;
        SELECT false AS isFinalised;
    ELSE
        SELECT true AS isFinalised;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE delete_time(IN event_id_ INT, user_id_ INT, chosen_time_ TIME)
BEGIN
    DELETE FROM Event_chosen_time WHERE
        event_id = event_id_ AND user_id = user_id_ AND chosen_time = chosen_time_;
    IF EXISTS (SELECT * FROM Event_chosen_time WHERE event_id = event_id_ AND user_id = user_id_) = false THEN
        UPDATE Event_pending SET isPending = true WHERE event_id = event_id_ AND user_id = user_id_;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE admin_add_user (
    IN username_ VARCHAR(50), email_ VARCHAR(50), password_ VARCHAR(30), isAdmin_ BOOLEAN
)
BEGIN
    INSERT INTO User (username, email, password, isAdmin, isRegistered) VALUES (username_, email_, UNHEX(SHA2(CONCAT('SA', password_, 'LT'), 256)), isAdmin_, true);
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE admin_modify_user_info(
    IN
    admin_id_ INT,
    user_id_ INT,
    username_ VARCHAR(50),
    email_ VARCHAR(50),
    password_ VARCHAR(30),
    isAdmin_ BOOLEAN
)
BEGIN
    IF EXISTS (SELECT * FROM User WHERE user_id = admin_id_ AND isAdmin = true) THEN
        UPDATE User SET
        username = username_,
        email = email_,
        password = UNHEX(SHA2(CONCAT('SA', password_, 'LT'), 256)),
        isAdmin = isAdmin_
        WHERE user_id = user_id_;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE admin_delete_user(IN admin_id_ INT, user_id_ INT)
BEGIN
    IF EXISTS (SELECT * FROM User WHERE user_id = admin_id_ AND isAdmin = true) THEN
        DELETE FROM User WHERE user_id = user_id_;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE admin_add_event(
    IN
    admin_id_ INT,
    creator_id_ INT,
    event_name_ VARCHAR(100),
    date_ DATE,
    duration_ SMALLINT(4),
    time_zone_ VARCHAR(50),
    hold_location_ VARCHAR(300),
    due_date_ TIMESTAMP,
    note_ VARCHAR(500),
    share_link_ VARCHAR(300),
    isOnline_ BOOLEAN
)
BEGIN
    IF EXISTS (SELECT * FROM User WHERE user_id = admin_id_ AND isAdmin = true) THEN
        INSERT INTO Event(creator_id, event_name, date, duration, time_zone, hold_location, due_date, note, share_link, isOnline)
            VALUES (creator_id_, event_name_, date_, duration_, time_zone_, hold_location_, due_date_, note_, share_link_, isOnline_);
        CALL join_event((SELECT MAX(event_id) FROM Event), creator_id_);
        UPDATE Event_pending SET isPending = false WHERE event_id = ((SELECT MAX(event_id) FROM Event)) AND user_id = creator_id_;
        SELECT MAX(event_id) FROM Event;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE admin_modify_event_info(
    IN
    admin_id_ INT,
    event_id_ INT,
    event_name_ VARCHAR(100),
    date_ DATE,
    duration_ SMALLINT(4),
    time_zone_ VARCHAR(50),
    hold_location_ VARCHAR(300),
    due_date_ TIMESTAMP,
    note_ VARCHAR(500),
    share_link_ VARCHAR(300),
    isFinalised_ BOOLEAN,
    isOnline_ BOOLEAN
)
BEGIN
    IF EXISTS (SELECT * FROM User WHERE user_id = admin_id_ AND isAdmin = true) THEN
        UPDATE Event SET
            event_name = event_name_,
            date = date_,
            duration = duration_,
            time_zone = time_zone_,
            hold_location = hold_location_,
            due_date = due_date_,
            note = note_,
            share_link = share_link_,
            isFinalised = isFinalised_,
            isOnline = isOnline_
        WHERE event_id = event_id_;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE admin_delete_event(IN admin_id_ INT, event_id_ INT)
BEGIN
    IF EXISTS (SELECT * FROM User WHERE user_id = admin_id_ AND isAdmin = true) THEN
        DELETE FROM Event WHERE event_id = event_id_;
    END IF;
END //
DELIMITER ;



/*
Procedure Function List

    CALL sign_up(user_name_, email_, password_);
    CALL login(email_, password_);
    CALL guest_signup(email_);
    CALL google_login(username_, email_);
    CALL change_password(user_id_, new_password_);
    CALL add_email(user_id_, email_);
    CALL change_email(user_id_, new_email_);
    CALL change_notification(user_id_, user_respond_, avail_confirm_, event_finalize_, event_cancel_);

    CALL create_event(creator_id_, event_name_, date_, duration_, time_zone_, hold_location_, due_date_, note_, share_link_, isOnline_);
    CALL add_availability(event_id_, user_id_, avail_time_);
    CALL edit_event(event_id_, creator_id_, event_name_, hold_location_, due_date_, note_, isOnline_, duration_, time_zone_, share_link_);
    CALL change_finalise_time(event_id_, due_date_);
    CALL finalise_event(event_id_, isFinalised_);
    CALL delete_event(event_id_, user_id_);
    CALL isCreator(event_id_, user_id_);

    CALL join_event(event_id_, user_id_);
    CALL choose_time(event_id_, user_id_, chosen_time_);
    CALL delete_time(event_id_, user_id_);

    CALL admin_add_user(username_ , email_ , password_ , isAdmin_);
    CALL admin_modify_user_info(admin_id_, user_id_, username_, email_, password_, isAdmin_);
    CALL admin_delete_user(admin_id_, user_id_);
    CALL admin_add_event(admin_id_, creator_id_, event_name_, date_, duration_, time_zone_, hold_location_, due_date_, note_, share_link_, isOnline_);
    CALL admin_modify_event_info(admin_id_, event_id_, event_name_, date_, duration_, time_zone_, hold_location_, due_date_, note_, share_link_, isFinalised_, isOnline_);
    CALL admin_delete_event(admin_id_, event_id_);
*/


/* Mock database */
CALL sign_up('john', 'liu1021119271@gmail.com', 'zonghan180');
CALL sign_up('nam', 'hoangnamtrinh15@student.adelaide.edu.au', 'nam1807');
CALL sign_up('bao', 'gb.hoang02@gmail.com', 'baobill222');
CALL sign_up('MarcusHoang', 'hoangnghia0403@gmail.com', '314marcusH');
CALL sign_up('jason', 'a1806320@student.adelaide.edu.au', 'Jason180');
CALL sign_up('vill', 'asdas123@gmail.com', 'whoisme123');
CALL sign_up('MarcusHoang', 'a1814303@student.adelaide.edu.au', 'why2Marcus');
CALL sign_up('marry', 'marry123@gmail.com', 'Marry_a777');
CALL sign_up('loser', 'loser123@gmail.com', 'Loser0000');
CALL sign_up('biaaatch', 'biaaatch1@gmail.com', 'BCH_27111a');

CALL change_password(1, 'Zonghan_Liu123');
CALL change_password(2, 'Nam_666');
CALL change_password(4, 'MarcusH314');
CALL change_password(7, 'why2Marcus');

CALL change_notification (1, false, false, false, false);
CALL change_notification (2, false, false, false, false);
CALL change_notification (3, false, false, true, false);
CALL change_notification (4, false, false, false, false);
CALL change_notification (5, true, false, false, true);
CALL change_notification (6, false, false, false, false);
CALL change_notification (7, true, true, true, true);
CALL change_notification (8, false, false, false, false);
CALL change_notification (9, false, true, false, false);
CALL change_notification (10, false, false, false, false);

CALL create_event(1, 'VR project', '2022-06-10', 60, '+02:30', '161 house', '2022-05-20 04:34:33', 'John has no time to do his VR project now. Come to laugh at him!', 'no share link', false);
CALL create_event(3, 'Bao farewell party', '2022-07-10', 90, '+06:00', '378 house', '2022-07-01 18:34:33', 'Bao will back to Vietnam, a perfect chance to punch him! ', 'no share link', false);
CALL create_event(5, 'Jason Project', '2022-06-10', 30, '-04:30', 'online', '2022-05-30 10:30:12', 'Jason has almost done his project. Can we find a way to steal it?', 'zoom share link', true);
CALL create_event(7, 'this is event4', '2022-07-10', 15, '+07:00', '161 house', '2022-06-24 00:00:00', 'some note here :)', 'no share link', false);
CALL create_event(9, 'Hahahahahhahah, Ian wont pity you!', '2022-06-10', 45, '-08:00', 'University', '2022-06-15 14:30:25', 'WEB project gonna due soooooon. Try your best to survive. GLHF!', 'discord share link', false);
CALL create_event(6, 'event6: this event will be deleted soon', '2022-07-10', 15, '+07:00', '161 house', '2022-06-24 00:00:00', 'this event will be deleted soon', 'no share link', false);

CALL add_availability(1, 1, '17:20:00');
CALL add_availability(1, 1, '06:00:00');
CALL add_availability(1, 1, '21:07:00');

CALL add_availability(2, 3, '17:20:00');
CALL add_availability(2, 3, '06:00:00');
CALL add_availability(2, 3, '21:07:00');

CALL add_availability(3, 5, '17:20:00');
CALL add_availability(3, 5, '06:00:00');
CALL add_availability(3, 5, '21:07:00');

CALL add_availability(4, 7, '17:20:00');
CALL add_availability(4, 7, '06:00:00');
CALL add_availability(4, 7, '21:07:00');

CALL add_availability(5, 9, '17:20:00');
CALL add_availability(5, 9, '06:00:00');
CALL add_availability(5, 9, '21:07:00');

CALL edit_event(1, 1, 'VR project due', '161 house', '2022-05-20 04:34:33', 'John has no time to do his VR project now. HELP at him!', true, 60, '+02:30', 'google.com');
CALL edit_event(3, 5, 'Jason Project', 'online', '2022-06-30 04:34:33', 'find a way to steal Jason WDC project', true, 30, '-04:30', 'discord share link');

CALL finalise_event(5, true);
CALL delete_event(6, 6);

CALL join_event(1,3);
CALL join_event(1,4);
CALL join_event(1,8);
CALL join_event(2,1);
CALL join_event(2,7);
CALL join_event(2,9);
CALL join_event(3,2);
CALL join_event(3,9);
CALL join_event(3,4);
CALL join_event(4,10);
CALL join_event(4,3);
CALL join_event(4,8);
CALL join_event(5,1);
CALL join_event(5,5);
CALL join_event(5,10);

CALL choose_time(1, 3, '17:20:00');
CALL choose_time(1, 3, '06:00:00');
CALL choose_time(1, 3, '21:07:00');
CALL choose_time(1, 4, '21:07:00');
CALL choose_time(1, 7, '21:07:00');

CALL choose_time(2, 1, '17:20:00');
CALL choose_time(2, 1, '06:00:00');
CALL choose_time(2, 1, '21:07:00');
CALL choose_time(2, 7, '21:07:00');
CALL choose_time(2, 7, '06:00:00');

CALL choose_time(3, 2, '17:20:00');
CALL choose_time(3, 2, '06:00:00');
CALL choose_time(3, 2, '21:07:00');
CALL choose_time(3, 9, '17:20:00');
CALL choose_time(3, 9, '06:00:00');
CALL choose_time(3, 9, '21:07:00');
CALL choose_time(3, 4, '17:20:00');
CALL choose_time(3, 4, '06:00:00');
CALL choose_time(3, 4, '21:07:00');

CALL choose_time(4, 10, '17:20:00');
CALL choose_time(4, 3, '21:07:00');
CALL choose_time(4, 8, '06:00:00');

CALL delete_time(3, 9, '17:20:00');
CALL delete_time(3, 9, '06:00:00');


CALL admin_add_user('God' , 'God doesnt email' , 'God' , true); /* This one is an admin, user_id shoule be 11 */
CALL admin_add_user('normal user' , 'saber1234@gmail.com' , 'Saber1234' , true);
CALL guest_signup('smith1234@gmail.com');
CALL admin_modify_user_info(11, 8, 'Marry(admin modified)', 'marry123@gmail.com', 'Marry_a777', false);
/* CALL admin_delete_user(11, 10); */

CALL admin_add_event(11, 6, 'event: this event will be deleted soon', '2022-07-10', 15, '+07:00', '161 house', '2022-06-24 00:00:00', 'this event will be deleted soon', 'no share link', false);
CALL admin_add_event(11, 6, 'event: this event will be deleted soon', '2022-07-10', 15, '+07:00', '161 house', '2022-06-24 00:00:00', 'this event will be deleted soon', 'no share link', false);
CALL admin_modify_event_info(11, 8, 'event: this event is edited by admin', '2022-07-10', 30, '-07:00', '262 house', '2022-06-28 00:07:00', 'no note', 'no share link', true, false);
CALL admin_delete_event(11, 7);

/*
Run this in Terminal!

SELECT * FROM User;
SELECT * FROM Event;
SELECT * FROM Event_availability;
SELECT * FROM Event_pending;
SELECT * FROM Event_chosen_time;
SELECT * FROM Email_preference;
SELECT * FROM Pp_number;
*/