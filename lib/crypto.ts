import Cryptr from "cryptr";

export function encrypt(value: any, password: any) {
  const cryptr = new Cryptr(password);
  return cryptr.encrypt(value);
}

export function decrypt(cipherText: string, password: any) {
  const cryptr = new Cryptr(password);
  return cryptr.decrypt(cipherText);
}
