import * as XLSX from "xlsx";

/**
 * Normalizes a concept string for case-insensitive and whitespace-insensitive comparison.
 */
export const normalizeConcept = (text) => {
  if (!text || typeof text !== "string") return "";
  return text.trim().toLowerCase().replace(/\s+/g, " ");
};

/**
 * Downloads a well-formatted Excel template for Quick Revision.
 */
export const downloadQuickRevisionTemplate = () => {
  const wb = XLSX.utils.book_new();

  // Primary Sheet: Quick Revision Data
  const templateData = [
    ["Concept", "Concise Explanation"],
    ["Overfitting", "Performs well on training data but poorly on unseen data"],
    ["Underfitting", "Model is too simple to capture important patterns"],
    ["Precision", "TP / (TP + FP)"],
    ["Recall", "TP / (TP + FN)"],
    ["F1 Score", "Harmonic mean of precision and recall"],
    ["Random Forest", "Ensemble of decision trees using bagging and feature randomness"],
    ["Regularization", "Controls model complexity to prevent overfitting (L1, L2)"],
    ["Cross Validation", "Evaluates model across multiple data splits to assess generalization"],
    ["Data Leakage", "Information from outside training dataset influences model training"],
    ["Bias", "Error introduced by overly simplistic assumptions in algorithm"],
    ["Variance", "Sensitivity of model to small fluctuations in training dataset"],
  ];

  const ws = XLSX.utils.aoa_to_sheet(templateData);

  // Set column widths for comfortable editing in Excel
  ws["!cols"] = [
    { wch: 28 }, // Concept
    { wch: 75 }, // Concise Explanation
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Quick Revision");

  // Instructions Sheet
  const instructionsData = [
    ["PrepHQ — Quick Revision Excel Import Instructions"],
    [""],
    ["Column Rules:"],
    ["1. 'Concept' (Required): The technical term or concept name (e.g. 'Precision')."],
    ["2. 'Concise Explanation' (Required): Brief definition or summary of the concept."],
    [""],
    ["Import Modes:"],
    ["• Mode A (Update + Add): Updates matching concepts and appends new ones. Preserves existing rows not in file."],
    ["• Mode B (Replace Entire): Replaces the entire table with the rows in this file."],
    [""],
    ["Important Notes:"],
    ["- Header row must contain 'Concept' and 'Concise Explanation' (case-insensitive)."],
    ["- Do not include duplicate concepts within the same Excel file."],
    ["- Do not enter database IDs or technical keys."],
    ["- Supported formats: .xlsx, .xls"],
  ];

  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
  wsInstructions["!cols"] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");

  XLSX.writeFile(wb, "quick-revision-template.xlsx");
};

/**
 * Exports current Quick Revision rows to an Excel workbook.
 */
export const exportQuickRevisionToExcel = (
  rows = [],
  col1Header = "Concept",
  col2Header = "Concise Explanation",
  filename = "quick-revision-table.xlsx"
) => {
  const wb = XLSX.utils.book_new();

  // Use standard headers for seamless re-importing
  const data = [
    ["Concept", "Concise Explanation"],
    ...(rows || []).map((r) => [
      String(r.concept || "").trim(),
      String(r.explanation || "").trim(),
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 28 }, { wch: 75 }];

  XLSX.utils.book_append_sheet(wb, ws, "Quick Revision");
  XLSX.writeFile(wb, filename);
};

/**
 * Parses and validates an uploaded Excel file (.xlsx or .xls).
 * Extracts Concept and Concise Explanation case-insensitively,
 * validates required fields, detects intra-file duplicates,
 * and matches against existing rows.
 */
export const parseQuickRevisionExcel = async (file, existingRows = []) => {
  if (!file) {
    throw new Error("No file selected.");
  }

  // 1. File Extension Validation
  const validExtensions = [".xlsx", ".xls"];
  const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  if (!validExtensions.includes(fileExt)) {
    throw new Error(
      `Unsupported file type "${fileExt}". Please upload a valid Excel file (.xlsx or .xls).`
    );
  }

  // 2. File Size Limit: Max 5 MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 5 MB limit.`
    );
  }

  // 3. Read ArrayBuffer safely
  const buffer = await file.arrayBuffer();

  let wb;
  try {
    wb = XLSX.read(buffer, {
      type: "array",
      cellFormula: false,
      cellHTML: false,
      cellText: true,
      raw: false,
    });
  } catch (err) {
    throw new Error(`Failed to parse Excel file: Corrupted or unreadable format.`);
  }

  if (!wb.SheetNames || wb.SheetNames.length === 0) {
    throw new Error("The Excel workbook contains no sheets.");
  }

  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`First sheet "${sheetName}" is empty.`);
  }

  // Convert to 2D array: header: 1 gives array of arrays
  const rawRows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (!rawRows || rawRows.length === 0) {
    throw new Error("The worksheet contains no data rows.");
  }

  // 4. Identify Header Row (search first 5 rows)
  let headerRowIndex = -1;
  let conceptColIndex = -1;
  let explanationColIndex = -1;

  const conceptKeywords = ["concept", "concept name", "concept/term", "term", "topic"];
  const explanationKeywords = [
    "concise explanation",
    "explanation",
    "concise_explanation",
    "definition",
    "concise definition",
    "summary",
    "description",
  ];

  for (let r = 0; r < Math.min(rawRows.length, 6); r++) {
    const row = rawRows[r] || [];
    let foundC = -1;
    let foundE = -1;

    for (let c = 0; c < row.length; c++) {
      const val = String(row[c] || "").trim().toLowerCase();
      if (!val) continue;

      if (foundC === -1 && conceptKeywords.some((k) => val === k || val.includes("concept"))) {
        foundC = c;
      } else if (
        foundE === -1 &&
        explanationKeywords.some((k) => val === k || val.includes("explanation") || val.includes("definition"))
      ) {
        foundE = c;
      }
    }

    if (foundC !== -1 && foundE !== -1) {
      headerRowIndex = r;
      conceptColIndex = foundC;
      explanationColIndex = foundE;
      break;
    }
  }

  if (headerRowIndex === -1 || conceptColIndex === -1 || explanationColIndex === -1) {
    const sampleHeaders = (rawRows[0] || []).map((h) => `"${String(h).trim()}"`).join(", ");
    throw new Error(
      `Missing required column headers: Could not identify 'Concept' and 'Concise Explanation' in the worksheet. Found headers: [${sampleHeaders || "none"}].`
    );
  }

  // 5. Existing rows lookup map (normalized concept -> existing row)
  const existingMap = new Map();
  (existingRows || []).forEach((row, idx) => {
    const norm = normalizeConcept(row.concept);
    if (norm) {
      existingMap.set(norm, { ...row, originalIndex: idx });
    }
  });

  // 6. Process data rows
  const parsedRows = [];
  const validRows = [];
  const invalidRows = [];
  const seenConceptsInFile = new Map(); // normConcept -> excelRowNum

  const MAX_ROWS = 1000;
  let dataRowCount = 0;

  for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
    const row = rawRows[i] || [];
    const excelRowNum = i + 1; // 1-indexed Excel row

    const rawConcept = String(row[conceptColIndex] ?? "").trim();
    const rawExplanation = String(row[explanationColIndex] ?? "").trim();

    // Check if entire row is empty (ignore empty rows)
    const isRowEmpty =
      row.every((cell) => String(cell ?? "").trim() === "") ||
      (!rawConcept && !rawExplanation);

    if (isRowEmpty) {
      continue;
    }

    dataRowCount++;
    if (dataRowCount > MAX_ROWS) {
      throw new Error(`File exceeds maximum limit of ${MAX_ROWS} rows.`);
    }

    const normConcept = normalizeConcept(rawConcept);
    let rowError = null;

    if (!rawConcept) {
      rowError = `Concept is required and cannot be empty.`;
    } else if (!rawExplanation) {
      rowError = `Concise Explanation is required and cannot be empty.`;
    } else if (seenConceptsInFile.has(normConcept)) {
      const prevRowNum = seenConceptsInFile.get(normConcept);
      rowError = `Duplicate concept "${rawConcept}" in uploaded file (already defined at Excel row ${prevRowNum}).`;
    } else {
      seenConceptsInFile.set(normConcept, excelRowNum);
    }

    const isExisting = normConcept && existingMap.has(normConcept);
    const existingMatch = isExisting ? existingMap.get(normConcept) : null;

    const rowObj = {
      excelRowNum,
      concept: rawConcept,
      explanation: rawExplanation,
      isValid: !rowError,
      error: rowError,
      status: rowError ? "INVALID" : isExisting ? "UPDATE" : "NEW",
      existingMatch,
    };

    parsedRows.push(rowObj);

    if (rowObj.isValid) {
      validRows.push(rowObj);
    } else {
      invalidRows.push(rowObj);
    }
  }

  if (parsedRows.length === 0) {
    throw new Error("No data rows found beneath the header row.");
  }

  const updateCount = validRows.filter((r) => r.status === "UPDATE").length;
  const newCount = validRows.filter((r) => r.status === "NEW").length;

  return {
    success: true,
    fileName: file.name,
    fileSize: file.size,
    totalRows: parsedRows.length,
    validRows,
    invalidRows,
    updateCount,
    newCount,
    allRows: parsedRows,
  };
};

/**
 * Merges valid imported rows with existing rows under Mode A (Update Existing + Add New).
 * - Matches by normalized concept.
 * - Updates explanations of matching existing rows (keeps original row order and ID).
 * - Appends brand new concepts to the bottom.
 * - Leaves untouched existing rows in place.
 */
export const applyModeA = (existingRows = [], validImportedRows = []) => {
  const result = (existingRows || []).map((row) => ({ ...row }));
  const existingMap = new Map();

  result.forEach((row, idx) => {
    const norm = normalizeConcept(row.concept);
    if (norm) {
      existingMap.set(norm, idx);
    }
  });

  let updatedCount = 0;
  let addedCount = 0;

  validImportedRows.forEach((item, i) => {
    const norm = normalizeConcept(item.concept);
    if (existingMap.has(norm)) {
      const idx = existingMap.get(norm);
      result[idx] = {
        ...result[idx],
        concept: item.concept, // Updates capitalization if changed
        explanation: item.explanation,
      };
      updatedCount++;
    } else {
      result.push({
        id: `rev-${Date.now()}-${i + 1}`,
        concept: item.concept,
        explanation: item.explanation,
      });
      addedCount++;
    }
  });

  return {
    mergedRows: result,
    updatedCount,
    addedCount,
    totalCount: result.length,
  };
};

/**
 * Replaces entire table under Mode B (Replace Entire Table).
 * - Replaces all existing rows with valid imported rows.
 */
export const applyModeB = (validImportedRows = []) => {
  const replacedRows = validImportedRows.map((item, i) => ({
    id: `rev-${Date.now()}-${i + 1}`,
    concept: item.concept,
    explanation: item.explanation,
  }));

  return {
    replacedRows,
    totalCount: replacedRows.length,
  };
};
