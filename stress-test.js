// stress-test.js
// This script simulates a client sending 50 simultaneous PDF generation requests.

// Configuration
const API_URL = 'http://localhost:3001/render';
const CONCURRENT_REQUESTS = 50;

async function fireRequest(id) {
    const start = Date.now();
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // We send a unique ID so we can see which job is which in the logs
                html: `
                    <html>
                        <head><style>body { font-family: sans-serif; }</style></head>
                        <body>
                            <h1>Invoice #${id}</h1>
                            <p>This is a stress test for RenderFlux.</p>
                            <p>Generated at: ${new Date().toISOString()}</p>
                        </body>
                    </html>
                `,
                data: { id }
            })
        });

        const json = await response.json();
        const duration = Date.now() - start;

        if (response.ok) {
            console.log(`✅ [${id}] Queued in ${duration}ms | JobID: ${json.jobId}`);
            return true;
        } else {
            console.error(`❌ [${id}] API Error:`, json);
            return false;
        }
    } catch (e) {
        console.error(`❌ [${id}] Network Error:`, e.message);
        return false;
    }
}

async function runBatch() {
    console.log(`🚀 Starting Stress Test: ${CONCURRENT_REQUESTS} Requests...`);
    console.log("---------------------------------------------------");

    // Create an array of 50 promises (requests) to fire at once
    const requests = [];
    for (let i = 1; i <= CONCURRENT_REQUESTS; i++) {
        requests.push(fireRequest(i));
    }

    // Wait for all of them to be acknowledged by the API
    await Promise.all(requests);

    console.log("---------------------------------------------------");
    console.log("🏁 All requests fired! Check your Docker logs to see them processing.");
}

runBatch();