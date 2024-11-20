-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_creator_id_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "creator_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
