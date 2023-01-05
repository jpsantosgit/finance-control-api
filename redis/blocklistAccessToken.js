import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { createClient } from 'redis';
import listHandler from './listHandler.js';
import { InternalServerError } from '../src/helpers/errorHandler.js';

const prefix = 'blocklist-access-token: ';
let blocklist;
let blocklistHandler;

(async () => {
  // Create redis client
  blocklist = createClient({
    url: process.env.REDIS_URL,
  });

  blocklist.on('error', (err) => console.log('Redis Client Error', err));
  try {
    // Connect to redis server
    await blocklist.connect();
  } catch (err) {
    throw new InternalServerError(`Redis Connection ${err}`);
  }

  blocklistHandler = listHandler(blocklist, prefix);
})();

function generateTokenHash(token) {
  return createHash('sha256')
    .update(token)
    .digest('hex');
}

export default ({
  add: async (token) => {
    const expirationDate = jwt.decode(token).exp;
    const tokenHash = generateTokenHash(token);
    await blocklistHandler.add(tokenHash, '', expirationDate);
  },
  tokenExists: async (token) => {
    const tokenHash = generateTokenHash(token);
    return blocklistHandler.containKey(tokenHash);
  },
});
