export function generateUniqueStr() {
  return crypto.randomUUID();
}

export function generateUniqueURL() {
  return "https://example.com/" + generateUniqueStr();
}
