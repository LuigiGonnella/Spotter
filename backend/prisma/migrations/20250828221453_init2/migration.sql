/*
  Warnings:

  - The values [GYM_ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_GymAdmins` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "_GymAdmins" DROP CONSTRAINT "_GymAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_GymAdmins" DROP CONSTRAINT "_GymAdmins_B_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "adminGymId" INTEGER;

-- DropTable
DROP TABLE "_GymAdmins";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_adminGymId_fkey" FOREIGN KEY ("adminGymId") REFERENCES "gyms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
