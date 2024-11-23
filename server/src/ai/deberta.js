import { pipeline } from "@xenova/transformers";

export class PerformanceAnalyzer {
  constructor(config = {}) {
    this.classifier = null;
    this.isInitialized = false;
    this.batchSize = config.batchSize || 32;
    this.confidenceThreshold = config.confidenceThreshold || 0.7;
    this.modelName = config.modelName || "microsoft/deberta-v3-base";
    this.API_URL =
      "https://api-inference.huggingface.co/models/microsoft/deberta-v3-base";
    this.API_TOKEN = process.env.HUGGINGFACE_API_KEY;
    this.cache = new Map();
    this.cacheSize = config.cacheSize || 1000;
    this.processingQueue = [];
    this.isProcessing = false;
  }

  async initialize() {
    try {
      if (!this.isInitialized) {
        console.log(`Initializing model: ${this.modelName}`);
        this.classifier = await pipeline("text-classification", this.API_URL);
        this.isInitialized = true;
        console.log("Model initialization successful");
      }
      return true;
    } catch (error) {
      console.error("Failed to initialize DeBERTa model:", error);
      throw new Error(`Model initialization failed: ${error.message}`);
    }
  }

  async analyzePerformance(evaluationData) {
    await this.ensureInitialized();

    try {
      const feedbackItems = this.normalizeFeedbackInput(
        evaluationData.feedback,
      );
      const results = await this.processInBatches(feedbackItems);
      const aggregatedResults = this.aggregateResults(results);

      return {
        summary: this.generateSummary(aggregatedResults),
        detailedResults: aggregatedResults,
        metadata: {
          processedAt: new Date().toISOString(),
          totalItems: feedbackItems.length,
          modelVersion: this.modelName,
          confidenceThreshold: this.confidenceThreshold,
        },
      };
    } catch (error) {
      console.error("Error in performance analysis:", error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  async processInBatches(feedbackItems) {
    const results = [];
    const batches = this.createBatches(feedbackItems, this.batchSize);

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((feedback) => this.processSingleFeedback(feedback)),
      );
      results.push(...batchResults);
    }

    return results;
  }

  async processSingleFeedback(feedback) {
    const cacheKey = this.generateCacheKey(feedback);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const result = await this.classifier(feedback, {
      candidate_labels: [
        "teaching_quality",
        "communication",
        "organization",
        "expertise",
        "engagement",
      ],
      multi_label: true,
    });

    const processedResult = {
      feedback,
      scores: result.scores.map((score) => parseFloat(score.toFixed(4))),
      labels: result.labels,
      topLabel:
        result.labels[result.scores.indexOf(Math.max(...result.scores))],
      confidenceScores: result.scores.filter(
        (score) => score >= this.confidenceThreshold,
      ),
    };

    this.updateCache(cacheKey, processedResult);
    return processedResult;
  }

  aggregateResults(results) {
    const categories = {
      teaching_quality: { scores: [], count: 0 },
      communication: { scores: [], count: 0 },
      organization: { scores: [], count: 0 },
      expertise: { scores: [], count: 0 },
      engagement: { scores: [], count: 0 },
    };

    results.forEach((result) => {
      result.labels.forEach((label, index) => {
        if (
          categories[label] &&
          result.scores[index] >= this.confidenceThreshold
        ) {
          categories[label].scores.push(result.scores[index]);
          categories[label].count++;
        }
      });
    });

    return Object.entries(categories).map(([category, data]) => ({
      category,
      averageScore:
        data.scores.length > 0
          ? (
              data.scores.reduce((a, b) => a + b, 0) / data.scores.length
            ).toFixed(4)
          : 0,
      occurrences: data.count,
      distribution: this.calculateDistribution(data.scores),
      confidence: this.calculateConfidenceMetrics(data.scores),
    }));
  }

  generateSummary(results) {
    const topPerforming = results
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);

    const needsImprovement = results
      .filter((r) => r.averageScore < 0.7)
      .sort((a, b) => a.averageScore - b.averageScore);

    return {
      topStrengths: topPerforming.map((r) => ({
        category: r.category,
        score: r.averageScore,
      })),
      improvementAreas: needsImprovement.map((r) => ({
        category: r.category,
        score: r.averageScore,
        recommendations: this.generateRecommendations(
          r.category,
          r.averageScore,
        ),
      })),
      overallScore: this.calculateOverallScore(results),
    };
  }

  calculateDistribution(scores) {
    const ranges = [0.2, 0.4, 0.6, 0.8, 1.0];
    const distribution = new Array(ranges.length).fill(0);

    scores.forEach((score) => {
      const index = ranges.findIndex((range) => score <= range);
      if (index !== -1) distribution[index]++;
    });

    return distribution.map((count, index) => ({
      range: `${index === 0 ? 0 : ranges[index - 1]}-${ranges[index]}`,
      count,
    }));
  }

  calculateConfidenceMetrics(scores) {
    if (scores.length === 0) return { mean: 0, variance: 0 };

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;

    return {
      mean: parseFloat(mean.toFixed(4)),
      variance: parseFloat(variance.toFixed(4)),
    };
  }

  generateRecommendations(category, score) {
    const recommendations = {
      teaching_quality: [
        "Implement interactive teaching methods",
        "Gather regular student feedback",
        "Participate in teaching workshops",
      ],
      communication: [
        "Use varied communication channels",
        "Practice active listening",
        "Implement regular check-ins",
      ],
      organization: [
        "Create detailed lesson plans",
        "Use digital organization tools",
        "Implement structured feedback systems",
      ],
      expertise: [
        "Attend professional development sessions",
        "Stay updated with latest research",
        "Collaborate with subject matter experts",
      ],
      engagement: [
        "Implement interactive activities",
        "Use multimedia resources",
        "Create discussion opportunities",
      ],
    };

    return recommendations[category] || [];
  }

  // Utility methods
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  normalizeFeedbackInput(feedback) {
    return Array.isArray(feedback) ? feedback : [feedback];
  }

  createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  generateCacheKey(feedback) {
    return `${feedback.slice(0, 100)}_${this.confidenceThreshold}`;
  }

  updateCache(key, value) {
    if (this.cache.size >= this.cacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  calculateOverallScore(results) {
    const totalScore = results.reduce(
      (sum, result) => sum + parseFloat(result.averageScore),
      0,
    );
    return parseFloat((totalScore / results.length).toFixed(4));
  }
}
