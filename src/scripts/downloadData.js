export default function downloadData(data, fileName) {
  const content = JSON.stringify(data)
  const blob = new Blob([content], { type: 'application/octet-stream' });

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}