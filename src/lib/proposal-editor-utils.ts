const HTML_TAG_PATTERN = /<[a-z][\s\S]*>/i;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert stored proposal text into editor HTML. */
export function contentToEditorHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) {
    return "<p><br></p>";
  }
  if (HTML_TAG_PATTERN.test(trimmed)) {
    return trimmed;
  }
  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => {
      const lines = escapeHtml(paragraph).replace(/\n/g, "<br>");
      return `<p>${lines || "<br>"}</p>`;
    })
    .join("");
}

/** Extract plain text from editor HTML for copy, download, and API saves. */
export function editorHtmlToPlainText(html: string): string {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const container = document.createElement("div");
  container.innerHTML = html;
  return (container.innerText || container.textContent || "").trim();
}

export function downloadProposalText(
  content: string,
  filename: string
): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
