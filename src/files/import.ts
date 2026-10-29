//custom typescript type
type Callback = (file: File) => void;


export function setupFileInput(input: HTMLInputElement, cb: Callback) {
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) cb(file);
  });
}

export function setupDropZone(zone: HTMLElement, cb: Callback) {
  zone.addEventListener('dragover', (e) => e.preventDefault());
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) cb(file);
  });
}