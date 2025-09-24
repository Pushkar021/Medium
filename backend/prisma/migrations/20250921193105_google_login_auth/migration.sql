-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilepicture" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'manual',
ALTER COLUMN "password" DROP NOT NULL;
