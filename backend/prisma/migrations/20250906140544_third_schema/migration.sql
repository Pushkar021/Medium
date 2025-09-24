/*
  Warnings:

  - You are about to drop the column `savedBlogs` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "savedBlogs";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "savedBlogs" TEXT NOT NULL DEFAULT '';
