export async function loadWasm(url: string,imports: WebAssembly.Imports = {},): Promise<WebAssembly.Instance> {
  const response = await fetch(url);
  const bytes = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes, imports);
  return instance;
}

export async function loadJs<T = unknown>(url: string): Promise<T> {
  return await import(/* @vite-ignore */ url);
}