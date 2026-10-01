export async function fetchRemoteImage(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<Buffer> {
  const response = await fetchImpl(url, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch image ${url}: HTTP ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}
