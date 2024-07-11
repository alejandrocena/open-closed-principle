import { publish } from "../publish-service.js";

const DEFAULT_QUEUE = 'standard';

const main_process = async (batch, store, batchReceivedFunnctions=[], batchPrePrublishFunctions=[]) => {
    
    const initialBatchReceivedPayload = {
        batch,
        store
    };
    const finalBatchReceived = batchReceivedFunnctions.reduce( (payload, operation ) => {
        return operation(payload)
    }, initialBatchReceivedPayload);
    
    
    const initialPublishPayload = {
        batches:[finalBatchReceived.batch],
        store: finalBatchReceived.store,
        queue: DEFAULT_QUEUE
    };
    const finalPublishPayload = batchPrePrublishFunctions.reduce((payload, operation ) => {
        const modifiedPayload = operation(payload);
        return modifiedPayload;
    }, initialPublishPayload)

    console.log("RESULT", JSON.stringify(finalPublishPayload));
    const publishingCalls = finalPublishPayload.batches.map( batch => publish(finalPublishPayload.topic, {store: finalPublishPayload.store, batch }));
    await Promise.all(publishingCalls);
};

export default main_process;
