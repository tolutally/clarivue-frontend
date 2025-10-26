const crypto = require('crypto');
const { promisify } = require('util');

const pbkdf2Async = promisify(crypto.pbkdf2);

async function hashPassword(password, salt) {
  const derivedHash = await pbkdf2Async(password, salt, 100000, 64, 'sha512');
  return derivedHash.toString('hex');
}

hashPassword('123456', 'dev_salt').then(hash => {
  console.log(`dev_salt:${hash}`);
});
