/**
 * quickRevisionConverter.js
 * Bi-directional converter between structured Quick Revision rows and rich-text HTML table.
 */

export const DEFAULT_COL1 = "Concept";
export const DEFAULT_COL2 = "Concise Explanation";

/**
 * Converts an array of structured rows [{ id, concept, explanation }] into clean HTML table markup
 * styled to render cleanly inside the TinyMCE rich text editor and in public preview.
 */
export const rowsToTableHtml = (rows, col1 = DEFAULT_COL1, col2 = DEFAULT_COL2) => {
  const safeCol1 = col1 || DEFAULT_COL1;
  const safeCol2 = col2 || DEFAULT_COL2;

  const validRows = Array.isArray(rows) && rows.length > 0
    ? rows
    : [
        { id: "rev-1", concept: "Sample Concept", explanation: "Sample concise explanation" }
      ];

  const trs = validRows
    .map((r) => {
      const c = r.concept || "";
      const e = r.explanation || "";
      return `    <tr>\n      <td>${c}</td>\n      <td>${e}</td>\n    </tr>`;
    })
    .join("\n");

  return `<table style="width: 100%; border-collapse: collapse;" border="1">
  <thead>
    <tr style="background-color: #074568; color: #ffffff;">
      <th style="padding: 10px 14px; text-align: left; width: 26%; font-weight: 700;">${safeCol1}</th>
      <th style="padding: 10px 14px; text-align: left; font-weight: 700;">${safeCol2}</th>
    </tr>
  </thead>
  <tbody>
${trs}
  </tbody>
</table>`;
};

/**
 * Parses an HTML table string back into structured rows: [{ id, concept, explanation }]
 * Also extracts col1 and col2 headers if found in <th> elements.
 */
export const tableHtmlToRows = (html, existingRows = []) => {
  if (!html || typeof html !== "string" || !html.trim()) {
    return { rows: existingRows || [], col1Label: null, col2Label: null };
  }

  // Browser environment using DOMParser
  if (typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const table = doc.querySelector("table");

      if (!table) {
        // Fallback: If no <table> tag, check if content has multiple paragraphs or lines
        // If content is plain text, keep existing rows or return as single row
        if (existingRows.length > 0) {
          return { rows: existingRows, col1Label: null, col2Label: null };
        }
        return {
          rows: [{ id: `rev-1-${Date.now()}`, concept: "General", explanation: html.trim() }],
          col1Label: null,
          col2Label: null,
        };
      }

      // Check header row for column labels
      let col1Label = null;
      let col2Label = null;
      const ths = table.querySelectorAll("th");
      if (ths.length >= 1) col1Label = ths[0].textContent.trim();
      if (ths.length >= 2) col2Label = ths[1].textContent.trim();

      // Find all rows (excluding <thead>)
      let trs = Array.from(table.querySelectorAll("tbody tr"));
      if (trs.length === 0) {
        trs = Array.from(table.querySelectorAll("tr"));
        // if first row has th, remove it
        if (trs.length > 0 && trs[0].querySelector("th")) {
          trs = trs.slice(1);
        }
      }

      const parsedRows = [];
      trs.forEach((tr, idx) => {
        const cells = tr.querySelectorAll("td");
        if (cells.length === 0) return;

        const rawConcept = cells[0] ? cells[0].innerHTML.trim() : "";
        // Clean concept text: strip wrapping tags if it's just <p> or <span>
        const conceptText = cells[0] ? cells[0].textContent.trim() : "";
        const concept = conceptText || rawConcept;

        let explanation = "";
        if (cells.length >= 2) {
          explanation = cells[1].innerHTML.trim();
        } else if (cells.length === 1 && !conceptText) {
          explanation = cells[0].innerHTML.trim();
        }

        // Only skip if both concept and explanation are empty
        if (!concept && !explanation) return;

        const prev = (existingRows && existingRows[idx]) || {};
        parsedRows.push({
          id: prev.id || `rev-${idx + 1}-${Date.now()}`,
          concept: concept,
          explanation: explanation,
        });
      });

      return {
        rows: parsedRows.length > 0 ? parsedRows : existingRows,
        col1Label: col1Label || null,
        col2Label: col2Label || null,
      };
    } catch (e) {
      console.warn("DOMParser table parsing failed, falling back to regex", e);
    }
  }

  // Fallback regex-based parsing (Node.js or error fallback)
  const rowMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  const parsedRows = [];
  let col1Label = null;
  let col2Label = null;
  let dataRowIndex = 0;

  rowMatches.forEach((rowHtml) => {
    // Check if it's a header row
    if (/<th[\s\S]*?>/i.test(rowHtml)) {
      const thMatches = Array.from(rowHtml.matchAll(/<th[\s\S]*?>([\s\S]*?)<\/th>/gi));
      if (thMatches.length >= 1) col1Label = thMatches[0][1].replace(/<[^>]+>/g, "").trim();
      if (thMatches.length >= 2) col2Label = thMatches[1][1].replace(/<[^>]+>/g, "").trim();
      return;
    }

    const tdMatches = Array.from(rowHtml.matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi));
    if (tdMatches.length === 0) return;

    const cell0 = tdMatches[0] ? tdMatches[0][1].trim() : "";
    const cell1 = tdMatches[1] ? tdMatches[1][1].trim() : "";

    const concept = cell0.replace(/<[^>]+>/g, "").trim() || cell0;
    const explanation = cell1;

    if (!concept && !explanation) return;

    const prev = (existingRows && existingRows[dataRowIndex]) || {};
    parsedRows.push({
      id: prev.id || `rev-${dataRowIndex + 1}-${Date.now()}`,
      concept,
      explanation,
    });
    dataRowIndex++;
  });

  return {
    rows: parsedRows.length > 0 ? parsedRows : existingRows,
    col1Label,
    col2Label,
  };
};

export default {
  rowsToTableHtml,
  tableHtmlToRows,
  DEFAULT_COL1,
  DEFAULT_COL2,
};
