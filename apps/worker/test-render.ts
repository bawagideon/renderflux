import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function testRender() {
    console.log('Starting Core Render Test (Self-Contained)...');

    let browser = null;
    try {
        console.log('Launching browser...');
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        const html = `
      <html>
        <head><style>body { font-family: sans-serif; color: #333; }</style></head>
        <body>
          <h1>RenderFlux Core Test</h1>
          <p>If you can read this, Playwright is working correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </body>
      </html>
    `;

        console.log('Setting content...');
        await page.setContent(html, { waitUntil: 'networkidle' });

        console.log('Generating PDF...');
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        const outputPath = path.join(__dirname, 'test-output.pdf');
        fs.writeFileSync(outputPath, pdfBuffer);

        console.log(`✅ PDF generated successfully at: ${outputPath}`);
        console.log(`PDF Size: ${pdfBuffer.length} bytes`);

    } catch (error) {
        console.error('❌ Render Test Failed:', error);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
}

testRender();
