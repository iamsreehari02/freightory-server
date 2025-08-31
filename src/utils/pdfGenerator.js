import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { formatCurrency } from "./currency.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function formatCurrencyINR(amount, currency) {
  if (currency === "INR") {
    const converted = formatCurrency(amount, "INR"); // This gives "₹1,500.00"
    return converted.replace("₹", "Rs."); // Replace symbol with text
  }
  return formatCurrency(amount, currency);
}

export async function generatePDFBuffer(invoiceData) {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle(`Invoice ${invoiceData.transactionNumber}`);
    pdfDoc.setAuthor("INDLOG NETWORK");
    pdfDoc.setSubject("Payment Invoice");
    pdfDoc.setCreator("Invoice System");

    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    // Fonts - Try to use a Unicode-supporting font
    let regularFont, boldFont;

    try {
      // Try to load a system font that supports Unicode (if available)
      // This is system-dependent and may not work everywhere
      const fontPath = path.join(__dirname, "../assets/fonts/DejaVuSans.ttf");
      if (fs.existsSync(fontPath)) {
        const fontBytes = fs.readFileSync(fontPath);
        regularFont = await pdfDoc.embedFont(fontBytes);
        boldFont = regularFont; // Use same font for bold
      } else {
        throw new Error("Custom font not found");
      }
    } catch (fontError) {
      // Fallback to standard fonts
      console.warn(
        "Using standard fonts - INR symbol may not display correctly"
      );
      regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    }

    // Colors matching the design
    const primaryBlue = rgb(0.2, 0.3, 0.8);
    const darkGray = rgb(0.2, 0.2, 0.2);
    const mediumGray = rgb(0.4, 0.4, 0.4);
    const lightGray = rgb(0.95, 0.95, 0.95);

    // Draw Logo
    const logoPath = path.join(__dirname, "../assets/images/Logo.png");
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.6);
      page.drawImage(logoImage, {
        x: 50,
        y: height - 130,
        width: logoDims.width,
        height: logoDims.height,
      });
    }

    // Invoice Info
    page.drawText(`Invoice ID: ${invoiceData.transactionNumber}`, {
      x: width - 170,
      y: height - 70,
      size: 11,
      font: regularFont,
      color: darkGray,
    });

    page.drawText(`Date: ${invoiceData.date}`, {
      x: width - 170,
      y: height - 90,
      size: 11,
      font: regularFont,
      color: darkGray,
    });

    // Billed To Section - Moved much lower (2rem = ~32px more)
    let yPos = height - 182;
    page.drawText("Billed To:", {
      x: 50,
      y: yPos,
      size: 12,
      font: boldFont,
      color: darkGray,
    });

    yPos -= 25;
    page.drawText(invoiceData.companyName, {
      x: 50,
      y: yPos,
      size: 11,
      font: regularFont,
      color: darkGray,
    });

    yPos -= 18;
    page.drawText(invoiceData.headOfficeAddress, {
      x: 50,
      y: yPos,
      size: 11,
      font: regularFont,
      color: darkGray,
    });

    yPos -= 18;
    page.drawText(`${invoiceData.country} - ${invoiceData.pinCode}`, {
      x: 50,
      y: yPos,
      size: 11,
      font: regularFont,
      color: darkGray,
    });

    if (invoiceData.website) {
      yPos -= 18;
      page.drawText(`Website: ${invoiceData.website}`, {
        x: 50,
        y: yPos,
        size: 11,
        font: regularFont,
        color: darkGray,
      });
    }

    // Table Section
    yPos -= 50;
    const tableX = 50;
    const tableWidth = width - 100;

    const descColWidth = 220;
    const qtyColWidth = 80;
    const unitPriceColWidth = 100;
    const amountColWidth = 135;

    const tableHeight = 120;
    page.drawRectangle({
      x: tableX,
      y: yPos - tableHeight,
      width: tableWidth,
      height: tableHeight,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.5, 0.5, 0.5),
      borderWidth: 1,
    });

    // Table header
    page.drawRectangle({
      x: tableX,
      y: yPos - 25,
      width: tableWidth,
      height: 25,
      color: lightGray,
    });

    // Header text
    page.drawText("Description", {
      x: tableX + 10,
      y: yPos - 15,
      size: 10,
      font: boldFont,
      color: darkGray,
    });

    page.drawText("Qty", {
      x: tableX + descColWidth + 25,
      y: yPos - 15,
      size: 10,
      font: boldFont,
      color: darkGray,
    });

    page.drawText("Unit Price", {
      x: tableX + descColWidth + qtyColWidth + 20,
      y: yPos - 15,
      size: 10,
      font: boldFont,
      color: darkGray,
    });

    page.drawText("Amount", {
      x: tableX + descColWidth + qtyColWidth + unitPriceColWidth + 25,
      y: yPos - 15,
      size: 10,
      font: boldFont,
      color: darkGray,
    });

    // Column separators
    page.drawLine({
      start: { x: tableX + descColWidth, y: yPos },
      end: { x: tableX + descColWidth, y: yPos - tableHeight },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawLine({
      start: { x: tableX + descColWidth + qtyColWidth, y: yPos },
      end: { x: tableX + descColWidth + qtyColWidth, y: yPos - tableHeight },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawLine({
      start: {
        x: tableX + descColWidth + qtyColWidth + unitPriceColWidth,
        y: yPos,
      },
      end: {
        x: tableX + descColWidth + qtyColWidth + unitPriceColWidth,
        y: yPos - tableHeight,
      },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawLine({
      start: { x: tableX, y: yPos - 25 },
      end: { x: tableX + tableWidth, y: yPos - 25 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Row 1 - Membership
    const regFee = formatCurrencyINR(
      invoiceData.baseRegistrationFee,
      invoiceData.currency
    );
    yPos -= 45;
    page.drawText("Membership (Basic)", {
      x: tableX + 10,
      y: yPos,
      size: 10,
      font: regularFont,
      color: darkGray,
    });

    page.drawText("1", {
      x: tableX + descColWidth + 35,
      y: yPos,
      size: 10,
      font: regularFont,
      color: darkGray,
    });

    page.drawText(regFee, {
      x: tableX + descColWidth + qtyColWidth + 25,
      y: yPos,
      size: 10,
      font: regularFont,
      color: darkGray,
    });

    page.drawText(regFee, {
      x: tableX + descColWidth + qtyColWidth + unitPriceColWidth + 25,
      y: yPos,
      size: 10,
      font: regularFont,
      color: darkGray,
    });

    page.drawLine({
      start: { x: tableX, y: yPos - 10 },
      end: { x: tableX + tableWidth, y: yPos - 10 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Row 2 - Branch Add-on (if applicable)
    if (invoiceData.branchCount > 0 && invoiceData.costPerBranch > 0) {
      yPos -= 20;
      const branchUnitCost = formatCurrencyINR(
        invoiceData.costPerBranch,
        invoiceData.currency
      );
      const branchTotalCost = formatCurrencyINR(
        invoiceData.branchCount * invoiceData.costPerBranch,
        invoiceData.currency
      );

      page.drawText("Branch Add-on", {
        x: tableX + 10,
        y: yPos,
        size: 10,
        font: regularFont,
        color: darkGray,
      });

      page.drawText(`${invoiceData.branchCount}`, {
        x: tableX + descColWidth + 35,
        y: yPos,
        size: 10,
        font: regularFont,
        color: darkGray,
      });

      page.drawText(branchUnitCost, {
        x: tableX + descColWidth + qtyColWidth + 25,
        y: yPos,
        size: 10,
        font: regularFont,
        color: darkGray,
      });

      page.drawText(branchTotalCost, {
        x: tableX + descColWidth + qtyColWidth + unitPriceColWidth + 25,
        y: yPos,
        size: 10,
        font: regularFont,
        color: darkGray,
      });

      page.drawLine({
        start: { x: tableX, y: yPos - 10 },
        end: { x: tableX + tableWidth, y: yPos - 10 },
        thickness: 1,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Subtotal and Total rows
    yPos -= 25;
    page.drawText("Subtotal", {
      x: tableX + descColWidth + qtyColWidth + 20,
      y: yPos,
      size: 10,
      font: boldFont,
      color: darkGray,
    });

    const totalAmount = formatCurrencyINR(
      invoiceData.totalRegistrationCost,
      invoiceData.currency
    );
    page.drawText(totalAmount, {
      x: tableX + descColWidth + qtyColWidth + unitPriceColWidth + 15,
      y: yPos,
      size: 10,
      font: boldFont,
      color: darkGray,
    });

    yPos -= 25;
    page.drawText("Total Amount", {
      x: tableX + descColWidth + qtyColWidth + 20,
      y: yPos,
      size: 11,
      font: boldFont,
      color: darkGray,
    });

    page.drawText(totalAmount, {
      x: tableX + descColWidth + qtyColWidth + unitPriceColWidth + 15,
      y: yPos,
      size: 11,
      font: boldFont,
      color: darkGray,
    });

    // Company Address Section
    yPos -= 200;
    page.drawText("Company Address:", {
      x: 50,
      y: yPos,
      size: 11,
      font: boldFont,
      color: darkGray,
    });

    yPos -= 20;
    page.drawText("+123-456-7890 123", {
      x: 50,
      y: yPos,
      size: 10,
      font: regularFont,
      color: darkGray,
    });

    yPos -= 15;
    page.drawText("No.1, Logistics Street, Chennai -", {
      x: 50,
      y: yPos,
      size: 10,
      font: regularFont,
      color: darkGray,
    });

    yPos -= 15;
    page.drawText("600001, India", {
      x: 50,
      y: yPos,
      size: 10,
      font: regularFont,
      color: darkGray,
    });

    yPos -= 20;
    page.drawText("www.indlognetwork.com", {
      x: 50,
      y: yPos,
      size: 10,
      font: regularFont,
      color: darkGray,
    });

    // Authorized Signatory
    page.drawText("Authorized Signatory", {
      x: width - 200,
      y: yPos + 40,
      size: 11,
      font: boldFont,
      color: darkGray,
    });

    page.drawText("INDLOG Network", {
      x: width - 200,
      y: yPos + 20,
      size: 10,
      font: regularFont,
      color: darkGray,
    });

    const pdfBuffer = await pdfDoc.save();
    return pdfBuffer;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}
