import { request } from "undici";

let cachedFrogs: string[] = []

export default class FrogCache {
  static async fetch () {
    const { body } = await request('https://frogs.media/api/list')
    cachedFrogs = await body.json()
    return FrogCache.getCached()
  }
  static getCached () {
    // Shallow copy the cached array to prevent indirect modifications to it.
    return [...cachedFrogs]
  }
}

// Initialize the cache
void FrogCache.fetch()
