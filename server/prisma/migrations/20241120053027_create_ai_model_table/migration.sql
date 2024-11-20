-- CreateTable
CREATE TABLE "EvaluationMetrics" (
    "metricId" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "aiScores" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationMetrics_pkey" PRIMARY KEY ("metricId")
);

-- AddForeignKey
ALTER TABLE "EvaluationMetrics" ADD CONSTRAINT "EvaluationMetrics_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("evaliation_id") ON DELETE RESTRICT ON UPDATE CASCADE;
