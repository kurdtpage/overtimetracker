CREATE DATABASE IF NOT EXISTS overtime;
USE overtime;

-- overtime.timeslot definition
CREATE TABLE `timeslot` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `area`        int unsigned NOT NULL COMMENT '1=NECC, 2=CECC, 3=SECC',
  `role`        int unsigned NOT NULL COMMENT '1=Dispatcher, 2=Call taker',
  `taken`       int unsigned NOT NULL DEFAULT 0 COMMENT 'The user ID',
  `start_time`  datetime     NOT NULL,
  `end_time`    datetime     NOT NULL,
  CONSTRAINT timeslot_pk PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- overtime.area definition
CREATE TABLE `area` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `area_name`   varchar(100) NOT NULL,
  `active`      int(1)       NOT NULL DEFAULT 1,
  CONSTRAINT area_pk PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `area` (id, area_name, active) VALUES(1, 'NECC', 1);
INSERT INTO `area` (id, area_name, active) VALUES(2, 'CECC', 1);
INSERT INTO `area` (id, area_name, active) VALUES(3, 'SECC', 1);

-- overtime.role definition
CREATE TABLE `role` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `role_name`   varchar(100) NOT NULL,
  `active`      int(1)       NOT NULL DEFAULT 1,
  CONSTRAINT role_pk PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `role` (id, role_name) VALUES(0, 'Admin');
INSERT INTO `role` (id, role_name) VALUES(1, 'Dispatcher'); -- if this causes problems, make sure admin id is 0 and not 1
INSERT INTO `role` (id, role_name) VALUES(2, 'Call taker');

-- overtime.user definition
CREATE TABLE `user` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `role`        int unsigned NOT NULL DEFAULT 1,
  `email`       varchar(255) NOT NULL,
  `password`    varchar(255) NOT NULL,
  `fullname`    varchar(255) NOT NULL,
  `format`      varchar(100) NOT NULL DEFAULT 'DD d M, yy',
  `phone`       varchar(30)      NULL,
  `active`      int(1)       NOT NULL DEFAULT 1,
  CONSTRAINT user_pk PRIMARY KEY (`id`),
  CONSTRAINT user_email UNIQUE KEY (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `user` (`id`, `role`, `email`, `password`, `fullname`) 
VALUES(0, 0, 'admin@email.com', '$2y$10$sJanIApwYBM.4boPVUycEeVhSARmWGevZYUrpvD8dIimAioEANI86', 'Admin Istrator'); -- password abc123
INSERT INTO `user` (`id`, `role`, `email`, `password`, `fullname`) 
VALUES(1, 1, 'example@email.com', '$2y$10$sJanIApwYBM.4boPVUycEeVhSARmWGevZYUrpvD8dIimAioEANI86', 'Dummy User'); -- password abc123

-- overtime.notify definition
CREATE TABLE `notify` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `user`        int unsigned NOT NULL,
  `role`        int unsigned NOT NULL,
  `timeslot`     date        NOT NULL DEFAULT CURRENT_DATE,
  `requested_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT notify_pk PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- overtime.request definition
CREATE TABLE `request` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `timeslot`    int unsigned NOT NULL,
  `user`        int unsigned NOT NULL,
  `approved_by` int unsigned     NULL,
  CONSTRAINT request_pk PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
