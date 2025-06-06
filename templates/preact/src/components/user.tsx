import type { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { userStore } from '~/stores.js';

// shared state PoC
export const User: FunctionComponent = () => {
  const [loading, setLoading] = useState(true);
  const name = useStore(userStore);

  // emulate a (slow) fetch
  useEffect(() => {
    setTimeout(() => {
      userStore.set('John Smith');
      setLoading(false);
    }, 2000);
  }, []);

  return loading ? (
    <span style={{ color: 'white' }}>Loading...</span>
  ) : (
    <span style={{ color: 'blue' }}>Welcome, {name}</span>
  );
};

export default User;
