import 'dotenv/config';
import { startWorker } from './worker';
import { getBrowser } from './browser';

const init = async () => {
    // Warm up the browser
    await getBrowser();

    // Start the worker
    startWorker();
};

init().catch((err) => {
    console.error('Failed to start worker:', err);
    process.exit(1);
});
