/*
  Warnings:

  - The `isActive` column on the `UserGym` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserGym" DROP COLUMN "isActive",
ADD COLUMN     "isActive" "Status" NOT NULL DEFAULT 'PENDING';
