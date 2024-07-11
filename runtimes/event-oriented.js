import Emmiter from 'node:events';
import { publish } from "../publish-service.js";

const EventEmmiter = new Emmiter;

const Events = {
    BatchReceived: 'batch-recieved',
    BatchPrePublish: 'batch-pre-publish'
}

const DEFAULT_QUEUE = 'standard';

const main_process = async (batch, store, batchReceivedFunctions=[], batchPrePrublishFunctions=[]) => {

    batchPrePrublishFunctions.map( handler => EventEmmiter.on(Events.BatchPrePublish, handler))

    const batchReceivedPayload = { batch, store, skip:false};
    EventEmmiter.emit(Events.BatchReceived, batchReceivedPayload);
    if (!batchReceivedPayload.skip) {
        const prePublishPayload = { batches:[batchReceivedPayload.batch], store: batchReceivedPayload.store, queue: DEFAULT_QUEUE };
        EventEmmiter.emit(Events.BatchReceived, prePublishPayload);
        const publishingCalls = prePublishPayload.batches.map( batch => publish(prePublishPayload.queue, {store: prePublishPayload.store, batch }));
        await Promise.all(publishingCalls);
    }
};

export const handlers = [

];
export default main_process;
