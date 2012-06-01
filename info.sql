SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE `info` (
  `user_id` int(10) NOT NULL,
  `firstname` varchar(20) COLLATE latin1_general_ci NOT NULL,
  `middlename` varchar(20) COLLATE latin1_general_ci NOT NULL,
  `lastname` varchar(20) COLLATE latin1_general_ci NOT NULL,
  `email` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `gender` enum('Male','Female') COLLATE latin1_general_ci NOT NULL,
  `birth_month` int(2) NOT NULL,
  `birth_day` int(2) NOT NULL,
  `birth_year` int(4) NOT NULL,
  `hometown` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `current_city` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `images` text COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;