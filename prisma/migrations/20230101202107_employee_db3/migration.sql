-- AlterTable
ALTER TABLE `employees` ADD COLUMN `userType` ENUM('Staff', 'Admin', 'Management') NOT NULL DEFAULT 'Staff';
