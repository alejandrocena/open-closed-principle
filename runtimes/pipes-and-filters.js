import { publish } from "../publish-service.js";

const DEFAULT_QUEUE = 'standard';

const main_process = async (batch, store, batchReceivedFunctions=[], batchPrePrublishFunctions=[]) => {
    const initialBatchReceivedPayload = { batch, store };
    const finalBatchReceived = batchReceivedFunctions.reduce( (payload, operation ) => operation(payload), initialBatchReceivedPayload);
    if (finalBatchReceived) {
        const initialPublishPayload = { batches:[finalBatchReceived.batch], store: finalBatchReceived.store, queue: DEFAULT_QUEUE };
        const finalPublishPayload = batchPrePrublishFunctions.reduce((payload, operation ) => operation(payload), initialPublishPayload);
        const publishingCalls = finalPublishPayload.batches.map( batch => publish(finalPublishPayload.queue, {store: finalPublishPayload.store, batch }));
        await Promise.all(publishingCalls);
    }
};

export default main_process;
