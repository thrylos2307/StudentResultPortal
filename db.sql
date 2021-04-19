-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: sql6.freesqldatabase.com
-- Generation Time: Apr 19, 2021 at 08:31 AM
-- Server version: 5.5.62-0ubuntu0.14.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sql6406607`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `id` varchar(50) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`id`, `Password`, `email`) VALUES
('admin', 'admin123', 'admin@example.com');

-- --------------------------------------------------------

--
-- Table structure for table `CSE_1_cs101_data_structure_2018`
--

CREATE TABLE `CSE_1_cs101_data_structure_2018` (
  `roll` bigint(20) NOT NULL,
  `quiz_10` double DEFAULT NULL,
  `midsem_30` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `CSE_1_cs101_data_structure_2018`
--

INSERT INTO `CSE_1_cs101_data_structure_2018` (`roll`, `quiz_10`, `midsem_30`) VALUES
(1000, 9, 28),
(1001, 8.5, 29),
(1002, 8, 25);

-- --------------------------------------------------------

--
-- Table structure for table `faculty_login`
--

CREATE TABLE `faculty_login` (
  `id` bigint(20) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `faculty_login`
--

INSERT INTO `faculty_login` (`id`, `Name`, `Email`, `Password`) VALUES
(2, 'faculty1', 'faculty1@gmail.com', '123456789');

-- --------------------------------------------------------

--
-- Table structure for table `student_login`
--

CREATE TABLE `student_login` (
  `id` bigint(20) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Batch` bigint(20) NOT NULL,
  `Branch` varchar(20) NOT NULL,
  `Group` varchar(20) NOT NULL,
  `Sem` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student_login`
--

INSERT INTO `student_login` (`id`, `Email`, `Name`, `Password`, `Batch`, `Branch`, `Group`, `Sem`) VALUES
(1000, 'user1@example.com', 'user1', '123456789', 2018, 'CSE', 'cg32', 1);

-- --------------------------------------------------------

--
-- Table structure for table `subject_info`
--

CREATE TABLE `subject_info` (
  `Code` varchar(15) NOT NULL,
  `Major` varchar(100) NOT NULL,
  `Faculty_id` bigint(20) NOT NULL,
  `FacultyName` varchar(100) NOT NULL,
  `sem` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subject_info`
--

INSERT INTO `subject_info` (`Code`, `Major`, `Faculty_id`, `FacultyName`, `sem`) VALUES
('cs101', 'data_structure', 2, 'faculty1', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `CSE_1_cs101_data_structure_2018`
--
ALTER TABLE `CSE_1_cs101_data_structure_2018`
  ADD PRIMARY KEY (`roll`);

--
-- Indexes for table `faculty_login`
--
ALTER TABLE `faculty_login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_login`
--
ALTER TABLE `student_login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subject_info`
--
ALTER TABLE `subject_info`
  ADD PRIMARY KEY (`Code`),
  ADD KEY `Faculty_id` (`Faculty_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `subject_info`
--
ALTER TABLE `subject_info`
  ADD CONSTRAINT `Faculty_id` FOREIGN KEY (`Faculty_id`) REFERENCES `faculty_login` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
