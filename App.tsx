// @ts-ignore
import App from '@@app';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import BootSplash from 'react-native-bootsplash';

import {deepLink} from './.runtime.config.json';


export function ShellApp() {
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    function parseUrl(url: string) {
      if (url.startsWith('https://') || url.startsWith('http://')) {
        const idx = url.indexOf('/', 9);
        if (idx >= 0) {
          return(url.substring(idx));
        } else {
          return('/');
        }
      } else if (url.startsWith(`${deepLink}://`)) {
        return(url.substring(deepLink.length + 2));
      } else {
        return null;
      }
    }

    // Check if there is something to link to
    Linking.getInitialURL().then((res) => {
      const parsed = res && parseUrl(res);
      setPath(parsed ? parsed : '/');
      BootSplash.hide({ fade: true });
    });

    Linking.addEventListener('url', (res) => {
      console.log('got link event', res.url);
      const parsed = parseUrl(res.url);
      if (parsed) setPath(parsed);
    });

    return () => {
      Linking.removeAllListeners('url');
    }
  }, []);

  if (path === null) return null;
  return <App path={path}  />
}
