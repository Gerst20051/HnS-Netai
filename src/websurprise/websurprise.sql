SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE `websurprise` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` int(15) NOT NULL,
  `website` varchar(255) COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=2 ;

INSERT INTO `websurprise` VALUES(1, 1335661829, 'http://www.google.com/');
