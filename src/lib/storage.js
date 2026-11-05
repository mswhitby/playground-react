// Small localStorage helpers for plain-string drafts (Markdown and code).
// Wrapped in try/catch so private windows or blocked storage don't crash the app.
export const storageKeys = {
  markdown: (lessonId) => `designlab:md:${lessonId}`,
  code: (lessonId) => `designlab:code:${lessonId}`,
};

export function readString(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}
