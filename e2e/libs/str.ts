// length が 32 未満の場合、十分なユニーク性を担保できないことに注意
export function generateUniqueStr(length: number = 32) {
  const repeatCount = Math.ceil(length / 32);
  return crypto.randomUUID().repeat(repeatCount).slice(0, length);
}

export function generateUniqueURL(length: number = 32) {
  return (
    "https://example.com/" +
    generateUniqueStr(length - "https://example.com/".length)
  );
}

export function generateUniqueEmail(length: number = 32) {
  return `${generateUniqueStr(length - "@example.com".length)}@example.com`;
}
