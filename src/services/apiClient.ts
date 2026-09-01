function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function simulateRequest<T>(data: T, ms = 500): Promise<T> {
  await delay(ms);
  return data;
}

export async function simulateFailure(message: string, ms = 400): Promise<never> {
  await delay(ms);
  throw new Error(message);
}

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
