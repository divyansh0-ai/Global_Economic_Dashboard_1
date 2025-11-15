// Advanced analytics functions for economic data

/**
 * Calculate percentage growth rate between two values
 */
export function calculateGrowthRate(oldValue, newValue) {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Calculate Compound Annual Growth Rate (CAGR)
 */
export function calculateCAGR(startValue, endValue, years) {
  if (startValue === 0 || years === 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

/**
 * Calculate Pearson correlation coefficient
 */
export function calculateCorrelation(x, y) {
  const n = x.length;
  
  if (n === 0 || n !== y.length || n < 2) {
    return 0;
  }

  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;
  
  let numerator = 0;
  let sumSquaredX = 0;
  let sumSquaredY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    
    numerator += diffX * diffY;
    sumSquaredX += diffX * diffX;
    sumSquaredY += diffY * diffY;
  }

  const denominator = Math.sqrt(sumSquaredX * sumSquaredY);
  
  if (denominator === 0) return 0;
  
  return numerator / denominator;
}

/**
 * Calculate moving average
 */
export function movingAverage(data, window) {
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(NaN);
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < window; j++) {
      sum += data[i - j];
    }
    result.push(sum / window);
  }
  
  return result;
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(values) {
  const n = values.length;
  if (n === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / n;
  
  return Math.sqrt(variance);
}

/**
 * Calculate Mean Absolute Error (MAE)
 */
export function calculateMAE(actual, predicted) {
  if (actual.length !== predicted.length || actual.length === 0) return 0;
  
  const errors = actual.map((val, i) => Math.abs(val - predicted[i]));
  return errors.reduce((sum, val) => sum + val, 0) / errors.length;
}

/**
 * Calculate Root Mean Square Error (RMSE)
 */
export function calculateRMSE(actual, predicted) {
  if (actual.length !== predicted.length || actual.length === 0) return 0;
  
  const squaredErrors = actual.map((val, i) => Math.pow(val - predicted[i], 2));
  const mse = squaredErrors.reduce((sum, val) => sum + val, 0) / squaredErrors.length;
  
  return Math.sqrt(mse);
}

/**
 * Calculate volatility (standard deviation of returns)
 */
export function calculateVolatility(values) {
  if (values.length < 2) return 0;
  
  const returns = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] !== 0) {
      returns.push((values[i] - values[i - 1]) / values[i - 1]);
    }
  }
  
  return standardDeviation(returns) * 100; // As percentage
}

/**
 * Normalize data to 0-100 scale
 */
export function normalize(values, min, max) {
  const actualMin = min ?? Math.min(...values);
  const actualMax = max ?? Math.max(...values);
  const range = actualMax - actualMin;
  
  if (range === 0) return values.map(() => 50);
  
  return values.map(val => ((val - actualMin) / range) * 100);
}

/**
 * Calculate percentile
 */
export function percentile(values, p) {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate Z-score (standardized score)
 */
export function zScore(value, mean, stdDev) {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}
