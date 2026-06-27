import Constants from 'expo-constants';

const SERVER_PORT = 4000;

/**
 * Resolve the backend base URL.
 *
 * Priority:
 *  1. EXPO_PUBLIC_API_URL env (e.g. a deployed server or a tunnel).
 *  2. The dev machine's LAN IP, inferred from the Expo packager host so the
 *     app works in Expo Go on a physical device without manual config.
 *  3. localhost (simulators / web).
 */
function resolveHost(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const c = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    expoGoConfig?: { debuggerHost?: string };
    manifest2?: { extra?: { expoGo?: { developer?: { host?: string } } } };
    manifest?: { debuggerHost?: string };
  };
  const hostUri =
    c.expoConfig?.hostUri ??
    c.expoGoConfig?.debuggerHost ??
    c.manifest2?.extra?.expoGo?.developer?.host ??
    c.manifest?.debuggerHost ??
    '';

  const host = String(hostUri).split(':')[0];
  if (host && host.length > 0) return `http://${host}:${SERVER_PORT}`;
  return `http://localhost:${SERVER_PORT}`;
}

export const API_BASE_URL = resolveHost();
export const WS_URL = `${API_BASE_URL.replace(/^http/, 'ws')}/ws`;
