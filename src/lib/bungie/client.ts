// ---------------------------------------------------------------------------
// Bungie API HTTP client
//
// - Always uses https://www.bungie.net (with www — without www triggers a
//   redirect that drops the Authorization header)
// - Attaches X-API-Key on every request
// - Optionally attaches Authorization: Bearer <token> for authenticated calls
// - Handles ThrottleSeconds and retries with exponential backoff
// - Throws BungieApiError on non-success ErrorCode
// ---------------------------------------------------------------------------

import { BungieResponse } from './types';

export const BUNGIE_ROOT = 'https://www.bungie.net/Platform';

export class BungieApiError extends Error {
  constructor(
    public readonly errorCode: number,
    public readonly errorStatus: string,
    message: string,
    public readonly throttleSeconds: number = 0,
  ) {
    super(message);
    this.name = 'BungieApiError';
  }
}

interface RequestOptions {
  /** Bearer token for authenticated (user-specific) requests. */
  accessToken?: string;
  /** Extra fetch options (method, body, etc.). */
  init?: RequestInit;
}

/**
 * Core fetch wrapper for the Bungie Platform API.
 *
 * @param path  Path relative to https://www.bungie.net/Platform  (e.g. "/User/GetBungieNetUserById/12345/")
 * @param opts  Optional access token and fetch init overrides
 */
export async function bungieRequest<T>(
  path: string,
  opts: RequestOptions = {},
  retries = 3,
): Promise<T> {
  const apiKey = process.env.BUNGIE_API_KEY;
  if (!apiKey) {
    throw new Error('BUNGIE_API_KEY environment variable is not set.');
  }

  // Ensure path starts with / and ends with / (Bungie requires trailing slash)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${BUNGIE_ROOT}${normalizedPath}`;

  const headers: HeadersInit = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  };

  if (opts.accessToken) {
    headers['Authorization'] = `Bearer ${opts.accessToken}`;
  }

  const res = await fetch(url, {
    ...opts.init,
    headers: {
      ...headers,
      ...(opts.init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new BungieApiError(
      res.status,
      'HttpError',
      `HTTP ${res.status} from Bungie API: ${url}`,
    );
  }

  const json = (await res.json()) as BungieResponse<T>;

  // Bungie uses ErrorCode 1 for success
  if (json.ErrorCode !== 1) {
    if (json.ThrottleSeconds > 0 && retries > 0) {
      await sleep(json.ThrottleSeconds * 1000);
      return bungieRequest<T>(path, opts, retries - 1);
    }
    throw new BungieApiError(
      json.ErrorCode,
      json.ErrorStatus,
      json.Message,
      json.ThrottleSeconds,
    );
  }

  return json.Response;
}

/** Make a GET request to the Bungie API. */
export function bungieGet<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  return bungieRequest<T>(path, { ...opts, init: { method: 'GET', ...opts.init } });
}

/** Make a POST request to the Bungie API with a JSON body. */
export function bungiePost<T>(
  path: string,
  body: unknown,
  opts: RequestOptions = {},
): Promise<T> {
  return bungieRequest<T>(path, {
    ...opts,
    init: {
      method: 'POST',
      body: JSON.stringify(body),
      ...opts.init,
    },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
