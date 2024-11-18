/*
  Warnings:

  - You are about to drop the column `user_id` on the `Department` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dept_id" TEXT,
ADD COLUMN     "password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "Department"("departmentId") ON DELETE SET NULL ON UPDATE CASCADE;
