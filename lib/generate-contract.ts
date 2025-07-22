import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { promises as fs } from 'fs'

export async function generateProviderContract({
  providerName,
  providerEmail,
  registrationDate,
  outputPath,
}: {
  providerName: string
  providerEmail: string
  registrationDate: string
  outputPath: string
}) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size

  // Colors
  const green = rgb(46 / 255, 125 / 255, 50 / 255)
  const darkGreen = rgb(27 / 255, 94 / 255, 32 / 255)

  // Header
  page.drawRectangle({ x: 0, y: 800, width: 595, height: 42, color: green })
  page.drawText('Huduma Fasta Provider Agreement', {
    x: 40,
    y: 815,
    size: 20,
    color: rgb(1, 1, 1),
    font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
  })

  // Provider info
  page.drawText(`Provider Name: ${providerName}`, { x: 40, y: 770, size: 12, color: darkGreen })
  page.drawText(`Email: ${providerEmail}`, { x: 40, y: 750, size: 12, color: darkGreen })
  page.drawText(`Registration Date: ${registrationDate}`, { x: 40, y: 730, size: 12, color: darkGreen })

  // Agreement text
  const agreement = `
This agreement is made between Huduma Fasta and the above-named provider.

By signing this contract, the provider agrees to abide by all terms and conditions of the Huduma Fasta platform, including but not limited to:
- Providing accurate and up-to-date information
- Delivering services professionally and ethically
- Complying with all applicable laws and regulations

The provider acknowledges that their account will only be activated after submitting a signed copy of this contract and passing KYC verification.

`;
  page.drawText(agreement, { x: 40, y: 670, size: 12, color: rgb(0, 0, 0), lineHeight: 16, maxWidth: 515 })

  // Signature placeholder
  page.drawText('Provider Signature: ___________________________', { x: 40, y: 200, size: 14, color: darkGreen })
  page.drawText('Date: ___________________', { x: 400, y: 200, size: 14, color: darkGreen })

  // Save PDF
  const pdfBytes = await pdfDoc.save()
  await fs.writeFile(outputPath, pdfBytes)
} 