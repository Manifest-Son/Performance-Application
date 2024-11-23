import { AutoTokenizer } from "@xenova/transformers";

export class TextTokenizer {
  constructor(config = {}) {
    this.tokenizer = null;
    this.isInitialized = false;
    this.modelName = config.modelName || "microsoft/deberta-v3-base";
    this.maxLength = config.maxLength || 512;
    this.padToken = "[PAD]";
    this.unkToken = "[UNK]";
    this.sepToken = "[SEP]";
    this.clsToken = "[CLS]";
    this.cache = new Map();
    this.cacheSize = config.cacheSize || 1000;

    // Special tokens mapping
    this.specialTokens = {
      pad_token: this.padToken,
      unk_token: this.unkToken,
      sep_token: this.sepToken,
      cls_token: this.clsToken,
    };
  }

  async initialize() {
    try {
      if (!this.isInitialized) {
        console.log(`Initializing tokenizer for model: ${this.modelName}`);
        this.tokenizer = await AutoTokenizer.from_pretrained(this.modelName);
        this.isInitialized = true;
        console.log("Tokenizer initialization successful");
      }
      return true;
    } catch (error) {
      console.error("Failed to initialize tokenizer:", error);
      throw new Error(`Tokenizer initialization failed: ${error.message}`);
    }
  }

  async tokenize(text, options = {}) {
    await this.ensureInitialized();

    try {
      const cacheKey = this.generateCacheKey(text, options);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const preprocessedText = this.preprocess(text);
      const encodingOptions = {
        add_special_tokens: options.addSpecialTokens ?? true,
        max_length: options.maxLength || this.maxLength,
        padding: options.padding || "max_length",
        truncation: options.truncation ?? true,
        return_tensors: options.returnTensors || "pt",
        return_attention_mask: options.returnAttentionMask ?? true,
        return_token_type_ids: options.returnTokenTypeIds ?? true,
      };

      const encoding = await this.tokenizer(preprocessedText, encodingOptions);
      const result = this.processEncoding(encoding);

      this.updateCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Error in tokenization:", error);
      throw new Error(`Tokenization failed: ${error.message}`);
    }
  }

  async batchTokenize(texts, options = {}) {
    await this.ensureInitialized();

    try {
      const results = await Promise.all(
        texts.map((text) => this.tokenize(text, options)),
      );

      return this.padBatch(results, options.maxLength || this.maxLength);
    } catch (error) {
      console.error("Error in batch tokenization:", error);
      throw new Error(`Batch tokenization failed: ${error.message}`);
    }
  }

  preprocess(text) {
    // Basic text preprocessing
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/[^\w\s.,!?-]/g, "") // Remove special characters
      .replace(/\.{3,}/g, "...") // Normalize ellipsis
      .replace(/\n+/g, " ") // Replace newlines with space
      .replace(/\t+/g, " ") // Replace tabs with space
      .replace(/\s+([.,!?])/g, "$1"); // Remove spaces before punctuation
  }

  processEncoding(encoding) {
    return {
      inputIds: encoding.input_ids,
      attentionMask: encoding.attention_mask,
      tokenTypeIds: encoding.token_type_ids,
      tokens: this.tokenizer.decode(encoding.input_ids, {
        skip_special_tokens: true,
      }),
      length: encoding.input_ids.length,
      metadata: {
        hasSpecialTokens: this.hasSpecialTokens(encoding.input_ids),
        truncated: encoding.input_ids.length >= this.maxLength,
        padding: this.calculatePadding(encoding.attention_mask),
      },
    };
  }

  padBatch(encodings, maxLength) {
    const paddedEncodings = encodings.map((encoding) => {
      if (encoding.inputIds.length < maxLength) {
        const padding = new Array(maxLength - encoding.inputIds.length).fill(
          this.tokenizer.pad_token_id,
        );
        return {
          ...encoding,
          inputIds: [...encoding.inputIds, ...padding],
          attentionMask: [
            ...encoding.attentionMask,
            ...new Array(padding.length).fill(0),
          ],
        };
      }
      return encoding;
    });

    return {
      batchEncodings: paddedEncodings,
      batchSize: paddedEncodings.length,
      maxSequenceLength: maxLength,
      metadata: {
        originalLengths: encodings.map((e) => e.length),
        paddingStats: this.calculateBatchPaddingStats(paddedEncodings),
      },
    };
  }

  async decode(inputIds, options = {}) {
    await this.ensureInitialized();

    try {
      const decoded = this.tokenizer.decode(inputIds, {
        skip_special_tokens: options.skipSpecialTokens ?? true,
        clean_up_tokenization_spaces: options.cleanUpTokenization ?? true,
      });

      return {
        text: decoded,
        metadata: {
          originalLength: inputIds.length,
          decodedLength: decoded.length,
          hasSpecialTokens: this.hasSpecialTokens(inputIds),
        },
      };
    } catch (error) {
      console.error("Error in decoding:", error);
      throw new Error(`Decoding failed: ${error.message}`);
    }
  }

  // Utility methods
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  generateCacheKey(text, options) {
    const optionsKey = JSON.stringify(options);
    return `${text.slice(0, 100)}_${optionsKey}`;
  }

  updateCache(key, value) {
    if (this.cache.size >= this.cacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  hasSpecialTokens(inputIds) {
    const specialTokenIds = [
      this.tokenizer.pad_token_id,
      this.tokenizer.unk_token_id,
      this.tokenizer.sep_token_id,
      this.tokenizer.cls_token_id,
    ];
    return inputIds.some((id) => specialTokenIds.includes(id));
  }

  calculatePadding(attentionMask) {
    const paddingCount = attentionMask.filter((mask) => mask === 0).length;
    return {
      paddingCount,
      paddingRatio: paddingCount / attentionMask.length,
    };
  }

  calculateBatchPaddingStats(encodings) {
    const paddingRatios = encodings.map(
      (enc) => this.calculatePadding(enc.attentionMask).paddingRatio,
    );

    return {
      averagePaddingRatio:
        paddingRatios.reduce((a, b) => a + b, 0) / paddingRatios.length,
      maxPaddingRatio: Math.max(...paddingRatios),
      minPaddingRatio: Math.min(...paddingRatios),
    };
  }

  // Vocabulary methods
  async getVocabSize() {
    await this.ensureInitialized();
    return this.tokenizer.vocab_size;
  }

  async getSpecialTokens() {
    await this.ensureInitialized();
    return this.specialTokens;
  }

  // Configuration methods
  getConfig() {
    return {
      modelName: this.modelName,
      maxLength: this.maxLength,
      isInitialized: this.isInitialized,
      cacheSize: this.cacheSize,
      specialTokens: this.specialTokens,
    };
  }

  setConfig(config) {
    Object.assign(this, config);
    return this.getConfig();
  }
}
