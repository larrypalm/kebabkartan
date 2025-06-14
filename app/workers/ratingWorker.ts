import { processRatingQueue } from '../lib/redis';
import { processRatingRequest } from '../lib/ratingProcessor';

async function startWorker() {
    console.log('Starting rating worker...');
    
    try {
        await processRatingQueue();
    } catch (error) {
        console.error('Worker error:', error);
        // Restart the worker after a delay
        setTimeout(startWorker, 5000);
    }
}

// Start the worker
startWorker(); 