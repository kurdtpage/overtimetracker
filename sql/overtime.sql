CREATE DATABASE IF NOT EXISTS overtime;
USE overtime;

-- overtime.timeslot definition
CREATE TABLE `timeslot` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area` int(11) DEFAULT NULL COMMENT '1=NECC, 2=CECC, 3=SECC',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `role` int(11) DEFAULT 1 COMMENT '1=Dispatcher, 2=Call taker',
  `taken` int(11) DEFAULT 0 COMMENT '0=Available, 1=Taken',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- overtime.area definition
CREATE TABLE `area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area_name` varchar(100) NOT NULL,
  `active` int(1) DEFAULT 1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO area (id, area_name) VALUES(1, 'NECC');
INSERT INTO area (id, area_name) VALUES(2, 'CECC');
INSERT INTO area (id, area_name) VALUES(3, 'SECC');

-- overtime.`role` definition
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  `active` int(1) DEFAULT 1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `role` (id, role_name) VALUES(0, 'Admin');
INSERT INTO `role` (id, role_name) VALUES(1, 'Dispatcher');
INSERT INTO `role` (id, role_name) VALUES(2, 'Call taker');

-- overtime.taken definition
CREATE TABLE `taken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taken_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO taken (id, taken_name) VALUES(0, 'No');
INSERT INTO taken (id, taken_name) VALUES(1, 'Yes');

-- overtime.user definition
CREATE TABLE `user` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`email` varchar(100) NOT NULL,
	`password` varchar(100) NOT NULL,
	`fullname` varchar(100) NOT NULL,
	`phone` varchar(100) NOT NULL,
	`role` INT DEFAULT 1 NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id),
	CONSTRAINT user_email UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `user` (id, email, password, fullname, phone, `role`) VALUES(1, 'example@email.com', '$2y$10$sJanIApwYBM.4boPVUycEeVhSARmWGevZYUrpvD8dIimAioEANI86', 'Dummy User', '02123456789', 1);

-- overtime.notify definition
CREATE TABLE `notify` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timeslot` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `requested_time` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
