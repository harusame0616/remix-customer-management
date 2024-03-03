export function toHyphenPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/(..)(....)(....)/, "$1-$2-$3");
}

export function toHyphenMobilePhoneNumber(mobilePhoneNumber: string) {
  return mobilePhoneNumber.replace(/(...)(....)(....)/, "$1-$2-$3");
}

export function toHyphenPostNumber(postNumber: string) {
  return postNumber.replace(/(...)(....)/, "$1-$2");
}
