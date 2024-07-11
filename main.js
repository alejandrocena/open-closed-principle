import data from './data.js'
import processPipesFilters from './runtimes/pipes-and-filters.js';
import processRxJs from './runtimes/rx-js.js';
import processEventOriented from './runtimes/event-oriented.js';

const logger = console;


const filterEvenStores = payload => {
    if(payload.store % 2 == 0) {
        return payload;
    } else {
        logger.info("Batch Discarted cause Odd Store");
    }
};

const splitBatchIntoChunks = payload => {
    const batches = [];
    const chunkSize = 2;
    for (let i = 0; i < payload.batches[0].length; i += chunkSize) {
        const chunk = payload.batches[0].slice(i, i + chunkSize);
        batches.push(chunk);
    }
    payload.batches = batches;
    return payload;
}

const priorityQueueCriteria = payload => {
    const storeString = payload.store+'';
    if(Number(storeString[0]) % 2 == 0) {
        payload.queue = 'piority'
    }
    return payload;
}

processPipesFilters(['uno','dos','tres','cuatro','cinco','seis'], 22346,[filterEvenStores],[splitBatchIntoChunks,priorityQueueCriteria]);

