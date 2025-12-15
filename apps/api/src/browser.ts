import { chromium, Browser, BrowserContext } from 'playwright';

let browserInstance: Browser | null = null;

export const getBrowser = async (): Promise<Browser> => {
    if (browserInstance) {
        return browserInstance;
    }

    console.log('Launching new browser instance...');
    browserInstance = await chromium.launch({
        headless: true, // Use 'new' headless mode if available, or just true
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote', // Extra stability for containerized environments
        ],
    });

    browserInstance.on('disconnected', () => {
        console.log('Browser disconnected! Resetting instance...');
        browserInstance = null;
    });

    return browserInstance;
};

export const closeBrowser = async () => {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
    }
};
