import crypto from 'crypto';

const batch = []

for (let index = 0; index < 500; index++) {
    batch.push(crypto.createHash('md5').update(index+'').digest('hex'));
}

export default { batch, store: 12345678};