SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE `passportparking` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `input` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `output` varchar(255) COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=4 ;

INSERT INTO `passportparking` VALUES(1, '1+1', '2');
INSERT INTO `passportparking` VALUES(2, '34+100', '134');
INSERT INTO `passportparking` VALUES(3, '5-9', '-4');
