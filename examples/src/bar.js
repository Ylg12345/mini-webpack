import user from '../public/user.json';

export function bar() {
  console.log('bar');

  console.log(JSON.parse(user).name);
}