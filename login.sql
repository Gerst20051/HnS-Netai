SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE `login` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `pass` varchar(41) NOT NULL,
  `access_level` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` date NOT NULL,
  `date_joined` date NOT NULL,
  `logins` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;