export class PerformanceMetrics {
  async analyzeMetrics(lecturerId) {
    const evaluations = await prisma.evaluation.findMany({
      where: { lecturerId },
      include: {
        evaluator: true,
      },
    });

    const metrics = {
      teachingQuality: this.calculateMetric(evaluations, "teaching"),
      studentEngagement: this.calculateMetric(evaluations, "engagement"),
      communicationSkills: this.calculateMetric(evaluations, "communication"),
    };

    return metrics;
  }

  calculateMetric(evaluations, metricType) {
    if (!evaluations || evaluations.length === 0) {
      return {
        score: 0,
        totalEvaluations: 0,
        breakdown: {},
        recentTrend: null,
      };
    }

    // Sort evaluations by date to calculate recent trends
    const sortedEvaluations = [...evaluations].sort(
      (a, b) => new Date(b.evaluationDate) - new Date(a.evaluationDate),
    );

    // Calculate average score
    const scores = evaluations.map((evaluation) => evaluation[metricType]);
    const averageScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Calculate score distribution
    const breakdown = scores.reduce((acc, score) => {
      const roundedScore = Math.round(score);
      acc[roundedScore] = (acc[roundedScore] || 0) + 1;
      return acc;
    }, {});

    // Calculate recent trend (last 3 evaluations compared to overall average)
    const recentEvaluations = sortedEvaluations.slice(0, 3);
    const recentAverage =
      recentEvaluations.reduce(
        (sum, evaluation) => sum + evaluation[metricType],
        0,
      ) / recentEvaluations.length;
    const trend = recentAverage - averageScore;

    return {
      score: Number(averageScore.toFixed(2)),
      totalEvaluations: evaluations.length,
      breakdown,
      recentTrend: Number(trend.toFixed(2)),
      lastEvaluationDate: sortedEvaluations[0].evaluationDate,
    };
  }

  getMetricInsights(metric) {
    const insights = {
      performance: this.categorizePerformance(metric.score),
      trend: this.analyzeTrend(metric.recentTrend),
      recommendations: this.generateRecommendations(metric),
    };

    return insights;
  }

  categorizePerformance(score) {
    if (score >= 4.5) return "Exceptional";
    if (score >= 4.0) return "Very Good";
    if (score >= 3.5) return "Good";
    if (score >= 3.0) return "Satisfactory";
    return "Needs Improvement";
  }

  analyzeTrend(trend) {
    if (trend > 0.3) return "Significant Improvement";
    if (trend > 0) return "Slight Improvement";
    if (trend < -0.3) return "Significant Decline";
    if (trend < 0) return "Slight Decline";
    return "Stable";
  }

  generateRecommendations(metric) {
    const recommendations = [];

    if (metric.score < 3.5) {
      recommendations.push("Consider professional development opportunities");
      recommendations.push("Schedule peer observation sessions");
    }

    if (metric.recentTrend < -0.2) {
      recommendations.push("Review recent changes in teaching approach");
      recommendations.push("Collect detailed student feedback");
    }

    return recommendations;
  }
}
