-- AlterTable
ALTER TABLE "TaskAssignment" ALTER COLUMN "acceptedAt" DROP NOT NULL,
ALTER COLUMN "acceptedAt" DROP DEFAULT,
ALTER COLUMN "rejectededAt" DROP NOT NULL;
