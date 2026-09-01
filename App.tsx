// @ts-ignore
import App from '@@app';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';

export function ShellApp() {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return <App />
}
