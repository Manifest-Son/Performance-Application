import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { pipeline } from "@xenova/transformers";
import { v4 as uuidv4 } from "uuid";

export class TrainingPipeline {
  constructor(config = {}) {
    this.model = null;
    this.tokenizer = null;
    this.modelVersion = uuidv4();
    this.config = {
      validationSplit: 0.2,
      testSplit: 0.1,
      maxLength: 512,
      learningRate: 2e-5,
      numEpochs: 3,
      batchSize: 8,
      earlyStoppingPatience: 2,
      ...config,
    };
  }

  async initialize() {
    this.model = await pipeline(
      "text-classification",
      "microsoft/deberta-v3-base",
    );
    console.log(`Initialized model version: ${this.modelVersion}`);
  }

  async prepareTrainingData() {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        evaluated: true,
        evaluationMetrics: true,
      },
    });

    // Clean and preprocess data
    const processedData = evaluations
      .filter(
        (evaluation) =>
          evaluation.feedback && evaluation.feedback.trim().length > 0,
      )
      .map((evaluation) => ({
        text: this.preprocessText(evaluation.feedback),
        label: this.getLabelFromRating(evaluation.rating),
        metrics: evaluation.evaluationMetrics,
      }));

    // Split data
    const shuffledData = this.shuffleArray(processedData);
    const testSize = Math.floor(shuffledData.length * this.config.testSplit);
    const validationSize = Math.floor(
      shuffledData.length * this.config.validationSplit,
    );

    return {
      train: shuffledData.slice(testSize + validationSize),
      validation: shuffledData.slice(testSize, testSize + validationSize),
      test: shuffledData.slice(0, testSize),
    };
  }

  preprocessText(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ") // normalize whitespace
      .replace(/[^\w\s]/g, "") // remove special characters
      .slice(0, this.config.maxLength);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getLabelFromRating(rating) {
    const ratingNum = parseInt(rating);
    if (ratingNum >= 4) return "excellent";
    if (ratingNum >= 3) return "good";
    return "needs_improvement";
  }

  async fineTune() {
    try {
      const { train, validation, test } = await this.prepareTrainingData();

      let bestValidationLoss = Infinity;
      let patienceCounter = 0;

      // Configure training parameters
      const trainingArgs = {
        learning_rate: this.config.learningRate,
        num_train_epochs: this.config.numEpochs,
        per_device_train_batch_size: this.config.batchSize,
        evaluation_strategy: "steps",
        eval_steps: 100,
        save_strategy: "steps",
        save_steps: 100,
        validation_data: validation,
      };

      // Training loop with early stopping
      for (let epoch = 0; epoch < this.config.numEpochs; epoch++) {
        const trainResults = await this.model.train(train, trainingArgs);
        const validationResults = await this.evaluate(validation);

        // Early stopping check
        if (validationResults.loss < bestValidationLoss) {
          bestValidationLoss = validationResults.loss;
          patienceCounter = 0;
          // Save best model
          await this.saveModel(`best_model_${this.modelVersion}`);
        } else {
          patienceCounter++;
          if (patienceCounter >= this.config.earlyStoppingPatience) {
            console.log("Early stopping triggered");
            break;
          }
        }

        // Log metrics to database
        await this.logTrainingMetrics(epoch, trainResults, validationResults);
      }

      // Final evaluation on test set
      const testMetrics = await this.evaluate(test);

      // Save model metadata
      await this.saveModelMetadata(testMetrics);

      return {
        success: true,
        message: "Model fine-tuning completed",
        modelVersion: this.modelVersion,
        testMetrics,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Fine-tuning error:", error);
      return {
        success: false,
        error: error.message,
        modelVersion: this.modelVersion,
      };
    }
  }

  async evaluate(data) {
    const predictions = await this.model(data.map((d) => d.text));
    const actualLabels = data.map((d) => d.label);

    const metrics = {
      accuracy: this.calculateAccuracy(predictions, actualLabels),
      precision: this.calculatePrecision(predictions, actualLabels),
      recall: this.calculateRecall(predictions, actualLabels),
      f1Score: this.calculateF1Score(predictions, actualLabels),
    };

    return metrics;
  }

  calculateAccuracy(predictions, actual) {
    const correct = predictions.filter((p, i) => p.label === actual[i]).length;
    return correct / predictions.length;
  }

  calculatePrecision(predictions, actual) {
    const results = {};
    const labels = [...new Set(actual)];

    for (const label of labels) {
      const truePositives = predictions.filter(
        (p, i) => p.label === label && actual[i] === label,
      ).length;
      const falsePositives = predictions.filter(
        (p, i) => p.label === label && actual[i] !== label,
      ).length;

      results[label] = truePositives / (truePositives + falsePositives);
    }

    return results;
  }

  calculateRecall(predictions, actual) {
    const results = {};
    const labels = [...new Set(actual)];

    for (const label of labels) {
      const truePositives = predictions.filter(
        (p, i) => p.label === label && actual[i] === label,
      ).length;
      const falseNegatives = predictions.filter(
        (p, i) => p.label !== label && actual[i] === label,
      ).length;

      results[label] = truePositives / (truePositives + falseNegatives);
    }

    return results;
  }

  calculateF1Score(predictions, actual) {
    const precision = this.calculatePrecision(predictions, actual);
    const recall = this.calculateRecall(predictions, actual);
    const f1Scores = {};

    for (const label in precision) {
      f1Scores[label] =
        (2 * (precision[label] * recall[label])) /
        (precision[label] + recall[label]);
    }

    return f1Scores;
  }

  async saveModel(filename) {
    await this.model.save(`./models/${filename}`);
    console.log(`Model saved: ${filename}`);
  }

  async saveModelMetadata(testMetrics) {
    await prisma.modelVersion.create({
      data: {
        version: this.modelVersion,
        configurationParams: JSON.stringify(this.config),
        testMetrics: JSON.stringify(testMetrics),
        timestamp: new Date(),
      },
    });
  }

  async logTrainingMetrics(epoch, trainResults, validationResults) {
    await prisma.trainingMetrics.create({
      data: {
        modelVersion: this.modelVersion,
        epoch,
        trainLoss: trainResults.loss,
        validationLoss: validationResults.loss,
        trainAccuracy: trainResults.accuracy,
        validationAccuracy: validationResults.accuracy,
        timestamp: new Date(),
      },
    });
  }
}

// Usage example
const config = {
  validationSplit: 0.15,
  testSplit: 0.15,
  maxLength: 256,
  learningRate: 3e-5,
  numEpochs: 5,
  batchSize: 16,
  earlyStoppingPatience: 3,
};

async function trainModel() {
  const trainer = new TrainingPipeline(config);
  await trainer.initialize();
  const result = await trainer.fineTune();
  console.log("Training complete:", result);
  return result;
}
