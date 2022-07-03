import uuid from 'short-uuid';
import sha224 from 'sha224';

import LC from './leancloud';

const VerificationLink = LC.Object.extend('VerificationLink');

function genToken(str) {
  return sha224(uuid.generate() + str + process.env.COOKIE_KEY).toString('hex');
}

export function createVerificationToken(email) {
  const token = genToken(email);
  const link = new VerificationLink({ email, token });
  return new Promise((resolve, reject) => {
    link
      .save()
      .then(() => {
        resolve(token);
      })
      .catch(reject);
  });
}

// Find the user corresponding to the login token, create a new user if the
// token is valid but the user doesn't exist yet. The token is deleted.
export function getUserFromToken(token) {
  const query = new LC.Query(VerificationLink);
  query.equalTo('token', token);
  return new Promise((resolve, reject) => {
    query
      .first()
      .then((link) => {
        if (!link) {
          resolve(null);
        } else {
          const email = link.get('email');
          return link.destroy().then(() => {
            const query = new LC.Query(LC.User);
            query.equalTo('email', email);
            return query.first({ useMasterKey: true }).then((user) => {
              if (user) {
                resolve({
                  email: user.getEmail(),
                  username: user.getUsername(),
                });
              } else {
                const username = email.split('@')[0];
                const user = new LC.User({
                  email,
                  username,
                  password: genToken(),
                });
                return user.save().then(() => resolve({ email, username }));
              }
            });
          });
        }
      })
      .catch(reject);
  });
}