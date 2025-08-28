import puppeteer from "puppeteer";
import fs from "fs";

export async function generatePDF(htmlContent, outputPath) {
  try {
    console.log("🔍 Starting PDF generation...");
    console.log("📄 Output path:", outputPath);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // ✅ Add more PDF options for better compatibility
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false, // ✅ Add this
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    // ✅ Check file size and existence
    if (!fs.existsSync(outputPath)) {
      throw new Error("PDF was not generated successfully");
    }

    const stats = fs.statSync(outputPath);
    console.log(`✅ PDF generated successfully:`);
    console.log(`   📁 Path: ${outputPath}`);
    console.log(`   📊 Size: ${stats.size} bytes`);

    // ✅ Check if file is too small (likely corrupted)
    if (stats.size < 1000) {
      // Less than 1KB is suspicious
      throw new Error(
        `PDF file too small (${stats.size} bytes) - likely corrupted`
      );
    }

    return outputPath;
  } catch (error) {
    console.error("❌ Failed to generate PDF:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}
