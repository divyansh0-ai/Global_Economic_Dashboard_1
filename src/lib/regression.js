// Simple linear regression implementation
import { calculateMAE, calculateRMSE } from './analytics.js';

export function linearRegression(x, y) {
  const n = x.length;
  
  if (n === 0 || x.length !== y.length) {
    throw new Error('Invalid input data for regression');
  }

  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += (x[i] - meanX) ** 2;
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;

  // Calculate R² (coefficient of determination)
  let ssRes = 0; // Sum of squares of residuals
  let ssTot = 0; // Total sum of squares
  const predicted = [];

  for (let i = 0; i < n; i++) {
    const pred = slope * x[i] + intercept;
    predicted.push(pred);
    ssRes += (y[i] - pred) ** 2;
    ssTot += (y[i] - meanY) ** 2;
  }

  const r2 = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;

  // Calculate error metrics
  const mae = calculateMAE(y, predicted);
  const rmse = calculateRMSE(y, predicted);

  return {
    slope,
    intercept,
    r2: Math.max(0, Math.min(1, r2)), // Clamp between 0 and 1
    mae,
    rmse
  };
}

export function predictNextYear(regression, year) {
  return regression.slope * year + regression.intercept;
}

export function predictMultipleYears(regression, startYear, numYears) {
  const predictions = [];
  
  for (let i = 0; i < numYears; i++) {
    const year = startYear + i;
    const value = predictNextYear(regression, year);
    predictions.push({ year, value });
  }
  
  return predictions;
}

/**
 * Polynomial regression (degree 2)
 */
export function polynomialRegression(x, y, degree = 2) {
  const n = x.length;
  
  if (n === 0 || x.length !== y.length) {
    throw new Error('Invalid input data for regression');
  }

  // Create design matrix
  const X = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let d = 0; d <= degree; d++) {
      row.push(Math.pow(x[i], d));
    }
    X.push(row);
  }

  // Solve using normal equations: (X^T X)^-1 X^T y
  const XT = transpose(X);
  const XTX = matrixMultiply(XT, X);
  const XTy = matrixVectorMultiply(XT, y);
  const coefficients = solveLinearSystem(XTX, XTy);

  // Calculate R² and predictions
  const predicted = [];
  let ssRes = 0;
  let ssTot = 0;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  for (let i = 0; i < n; i++) {
    let pred = 0;
    for (let d = 0; d <= degree; d++) {
      pred += coefficients[d] * Math.pow(x[i], d);
    }
    predicted.push(pred);
    ssRes += (y[i] - pred) ** 2;
    ssTot += (y[i] - meanY) ** 2;
  }

  const r2 = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
  const mae = calculateMAE(y, predicted);
  const rmse = calculateRMSE(y, predicted);

  return {
    coefficients,
    r2: Math.max(0, Math.min(1, r2)),
    mae,
    rmse
  };
}

/**
 * Exponential regression: y = a * e^(b*x)
 */
export function exponentialRegression(x, y) {
  const n = x.length;
  
  if (n === 0 || x.length !== y.length) {
    throw new Error('Invalid input data for regression');
  }

  // Convert to linear problem by taking log: ln(y) = ln(a) + b*x
  const lnY = [];
  const validIndices = [];
  
  for (let i = 0; i < n; i++) {
    if (y[i] > 0) {
      lnY.push(Math.log(y[i]));
      validIndices.push(i);
    }
  }

  if (lnY.length === 0) {
    throw new Error('All y values must be positive for exponential regression');
  }

  const validX = validIndices.map(i => x[i]);
  const linearResult = linearRegression(validX, lnY);
  
  const a = Math.exp(linearResult.intercept);
  const b = linearResult.slope;

  // Calculate R² on original scale
  const predicted = [];
  let ssRes = 0;
  let ssTot = 0;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  for (let i = 0; i < n; i++) {
    const pred = a * Math.exp(b * x[i]);
    predicted.push(pred);
    ssRes += (y[i] - pred) ** 2;
    ssTot += (y[i] - meanY) ** 2;
  }

  const r2 = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
  const mae = calculateMAE(y, predicted);
  const rmse = calculateRMSE(y, predicted);

  return {
    a,
    b,
    r2: Math.max(0, Math.min(1, r2)),
    mae,
    rmse
  };
}

/**
 * Predict next years using different regression models
 */
export function predictNextYears(model, startYear, numYears, modelType) {
  const predictions = [];

  for (let i = 0; i < numYears; i++) {
    const year = startYear + i;
    let value = 0;

    if (modelType === 'linear') {
      value = model.slope * year + model.intercept;
    } else if (modelType === 'polynomial') {
      value = 0;
      for (let d = 0; d < model.coefficients.length; d++) {
        value += model.coefficients[d] * Math.pow(year, d);
      }
    } else if (modelType === 'exponential') {
      value = model.a * Math.exp(model.b * year);
    }

    predictions.push(value);
  }

  return predictions;
}

// Matrix operations helpers

function transpose(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = [];

  for (let j = 0; j < cols; j++) {
    const row = [];
    for (let i = 0; i < rows; i++) {
      row.push(matrix[i][j]);
    }
    result.push(row);
  }

  return result;
}

function matrixMultiply(a, b) {
  const rowsA = a.length;
  const colsA = a[0].length;
  const colsB = b[0].length;
  const result = [];

  for (let i = 0; i < rowsA; i++) {
    const row = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += a[i][k] * b[k][j];
      }
      row.push(sum);
    }
    result.push(row);
  }

  return result;
}

function matrixVectorMultiply(matrix, vector) {
  const result = [];

  for (let i = 0; i < matrix.length; i++) {
    let sum = 0;
    for (let j = 0; j < vector.length; j++) {
      sum += matrix[i][j] * vector[j];
    }
    result.push(sum);
  }

  return result;
}

// Gaussian elimination to solve linear system
function solveLinearSystem(A, b) {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }

    // Swap rows
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // Make all rows below this one 0 in current column
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    x[i] /= augmented[i][i];
  }

  return x;
}
