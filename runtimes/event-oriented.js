
const main_process = (payload) => {
    handlers.map( handler => handler(payload));
    return payload;
}

export const handlers = [

];
export default main_process;
