export async function fetchRemoteImage(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<Buffer | undefined> {
  try {
    const response = await fetchImpl(url, {
      signal: AbortSignal.timeout(15000),
    });
    if (response.ok) return Buffer.from(await response.arrayBuffer());
  } catch {
    return undefined;
  }
  return undefined;
}
