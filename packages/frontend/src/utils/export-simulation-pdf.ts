import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * Exports an HTML element to a PDF file.
 * Uses html2canvas to capture the element as an image and jspdf to generate the PDF.
 * Splits content across multiple pages when taller than one A4 page.
 *
 * @param elementRef - The HTML element to capture (params, calculations, chart, table)
 * @param filename - Optional filename for the PDF (defaults to simulation-YYYY-MM-DD.pdf)
 */
export async function exportSimulationToPdf(
  elementRef: HTMLElement,
  filename = `simulation-${new Date().toISOString().split('T')[0]}.pdf`
): Promise<void> {
  const canvas = await html2canvas(elementRef, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/png', 1.0)
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const margin = 10
  const contentWidth = pdfWidth - margin * 2
  const contentHeight = pdfHeight - margin * 2
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = contentWidth / imgWidth
  const scaledHeight = imgHeight * ratio

  if (scaledHeight <= contentHeight) {
    pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, scaledHeight)
  } else {
    let sourceOffset = 0
    const sourceChunkHeight = contentHeight / ratio
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    const ctx = tempCanvas.getContext('2d')

    if (!ctx) {
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, scaledHeight * 0.9)
    } else {
      while (sourceOffset < canvas.height) {
        const chunkHeight = Math.min(sourceChunkHeight, canvas.height - sourceOffset)
        tempCanvas.height = chunkHeight
        ctx.clearRect(0, 0, canvas.width, chunkHeight)
        ctx.drawImage(canvas, 0, sourceOffset, canvas.width, chunkHeight, 0, 0, canvas.width, chunkHeight)
        const chunkData = tempCanvas.toDataURL('image/png', 1.0)
        const chunkScaledHeight = chunkHeight * ratio
        pdf.addImage(chunkData, 'PNG', margin, margin, contentWidth, chunkScaledHeight)
        sourceOffset += chunkHeight
        if (sourceOffset < canvas.height) {
          pdf.addPage()
        }
      }
    }
  }

  pdf.save(filename)
}
