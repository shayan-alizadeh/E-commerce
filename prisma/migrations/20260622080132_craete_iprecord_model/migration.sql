/*
  Warnings:

  - A unique constraint covering the columns `[track_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ref_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `ref_id` VARCHAR(191) NULL,
    ADD COLUMN `track_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ipRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(191) NOT NULL,
    `windowStart` DATETIME(3) NOT NULL,
    `requestCount` INTEGER NOT NULL,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `blockUntil` DATETIME(3) NULL,

    UNIQUE INDEX `ipRecord_ip_key`(`ip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `orders_track_id_key` ON `orders`(`track_id`);

-- CreateIndex
CREATE UNIQUE INDEX `orders_ref_id_key` ON `orders`(`ref_id`);
