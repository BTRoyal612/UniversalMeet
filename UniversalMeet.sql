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
    password VARCHAR(30) NOT NULL, -- CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (user_id),
    CONSTRAINT username_not_unique UNIQUE (username),
    CONSTRAINT email_not_unique UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Event(
    event_id INT NOT NULL AUTO_INCREMENT,
    creator_id INT NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    duration TINYINT(4) NOT NULL,
    time_zone VARCHAR(50) NOT NULL,
    hold_location VARCHAR(300) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    note VARCHAR(500),
    share_link VARCHAR(300) NOT NULL, -- should be generated automatically, but also unique. Not sure how to do
    isFinalised BOOLEAN NOT NULL DEFAULT false,
    isOnline BOOLEAN NOT NULL,

    PRIMARY KEY (event_id)
    -- CONSTRAINT fk_user_id FOREIGN KEY (creator_id) REFERENCES User (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Event_pending(
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    isPending BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (event_id, user_id) -- this combination must be unique
    -- CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES Event (event_id),
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES User (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Event_chosen_time(
    chosen_time_id INT NOT NULL AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    chosen_time TIME NOT NULL, -- TIME only includes hh:mm:ss

    PRIMARY KEY (chosen_time_id),
    CONSTRAINT chosen_time_not_unique UNIQUE (event_id, user_id, chosen_time) -- this combination must be unique
    -- CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES Event (event_id),
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES User (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Email_preference(
    user_id INT NOT NULL,
    user_respond BOOLEAN NOT NULL DEFAULT false,
    avail_confirm BOOLEAN NOT NULL DEFAULT false,
    event_finalize BOOLEAN NOT NULL DEFAULT false,
    event_cancel BOOLEAN NOT NULL DEFAULT false

    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES User (user_id) -- ON DELETE RESTRICT ON UPDATE CASCADE,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- Sample Database Data

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';
SET @old_autocommit=@@autocommit;

USE universal_meet;

--
-- Dumping data for table user
--

SET AUTOCOMMIT=0;
INSERT INTO User VALUES (1, 'tester00', 'tester00@gmail.com', 'tester00pass', false),
(2, 'tester01', 'tester01@gmail.com', 'tester01pass', false),
(3, 'tester02', 'tester02@gmail.com', 'tester02pass', false),
(4, 'tester03', 'tester03@gmail.com', 'tester03pass', false),
(5, 'tester04', 'tester04@gmail.com', 'tester04pass', false),
(6, 'tester05', 'tester05@gmail.com', 'tester05pass', false),
(7, 'tester06', 'tester06@gmail.com', 'tester06pass', false),
(8, 'tester07', 'tester07@gmail.com', 'tester07pass', false),
(9, 'tester08', 'tester08@gmail.com', 'tester08pass', false),
(10, 'tester09', 'tester09@gmail.com', 'tester09pass', true);
COMMIT;

--
-- Dumping data for table event
--

SET AUTOCOMMIT=0;
INSERT INTO Event VALUES (1, 1, 'event00', '60', 'Australian Central Standard Time', '161 house', '2022-05-20 04:34:33', 'hotpot', 'none', true, false),
(2, 3, 'event01', '90', 'Indochina Time', '378 house', '2018-07-25 18:34:33', '9/1', 'none', true, false),
(3, 5, 'event02', '30', 'Mountain Daylight Time', 'online', '2022-06-30 10:30:12', 'volunteer', 'zoom', false, true),
(4, 7, 'event03', '15', 'Australian Central Standard Time', '161 house', '2022-06-24 00:00:00', 'Thai', 'none', false, false),
(5, 9, 'event04', '45', 'Australian Central Standard Time', 'University', '2022-05-14 14:30:25', 'WEB project', 'discord', true, false);
COMMIT;

--
-- Dumping data for table event pending
--

SET AUTOCOMMIT=0;
INSERT INTO Event_pending VALUES (3, 2, true),
(3, 5, true),
(4, 6, true),
(4, 8, true),
(4, 4, true);
COMMIT;

--
-- Dumping data for table event chosen time
--

SET AUTOCOMMIT=0;
INSERT INTO Event_chosen_time VALUES (1, 4, 6, '18:30:00'),
(2, 4, 8, '17:15:00'),
(3, 4, 4, '19:00:00');
COMMIT;

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