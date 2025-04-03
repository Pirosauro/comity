import { withHydration } from '@comity/react';
import hash from './badge.js?island';
import { Badge } from './badge.js';

export const BadgeIsland = withHydration(Badge, hash);

export default Badge;
