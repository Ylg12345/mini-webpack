import user from '../public/user.json';

import { foo } from './foo.js';

foo();

console.log('main.js');

console.log(JSON.parse(user).name);