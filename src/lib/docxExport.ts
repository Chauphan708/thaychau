/**
 * Export HTML string or plain text formatted document to .docx file
 */
export function exportToDocx(filename: string, title: string, content: string) {
  // Format HTML for Word document export
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; color: #000000; margin: 1in; }
        h1 { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 12pt; text-transform: uppercase; }
        h2 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; color: #1e3a8a; }
        h3 { font-size: 13pt; font-weight: bold; margin-top: 10pt; margin-bottom: 4pt; }
        p { margin-top: 0; margin-bottom: 6pt; text-align: justify; }
        ul, ol { margin-top: 0; margin-bottom: 6pt; padding-left: 20pt; }
        li { margin-bottom: 3pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 12pt; }
        th, td { border: 1px solid #000000; padding: 6pt 8pt; text-align: left; vertical-align: top; font-size: 12pt; }
        th { background-color: #f3f4f6; font-weight: bold; text-align: center; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div>${content.replace(/\n/g, "<br/>")}</div>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".docx") || filename.endsWith(".doc") ? filename : `${filename}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
