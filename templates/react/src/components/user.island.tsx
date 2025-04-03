import { withHydration } from '@comity/react';
import hash from './user.js?island';
import { User } from './user.js';

export const UserIsland = withHydration(User, hash);

export default User;
