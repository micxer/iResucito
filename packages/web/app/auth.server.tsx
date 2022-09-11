import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { sessionStorage } from './session.server';
import bcrypt from 'bcryptjs';
import { getdb } from '../utils.server';

export let authenticator = new Authenticator<AuthData>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get('email');
    let password = form.get('password');

    const db = await getdb();
    db.read();

    const userIndex = db.data.users.findIndex((u) => u.email === email);
    const user = db.data.users[userIndex];
    if (user) {
      if (!user.isVerified) {
        throw new Error('Account not verified');
      }
      const result = bcrypt.compareSync(password, user.password);
      if (result) {
        // Registrar hora de inicio de sesion
        db.data.users[userIndex].loggedInAt = Date.now();
        db.write();
        return {
          user: user.email,
        };
      }
      throw new Error('Invalid password');
    } else {
      throw new Error('Invalid user');
    }
  }),
  'lowdb'
);
