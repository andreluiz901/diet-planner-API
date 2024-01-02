import bcrypt from "bcrypt";

export async function encryptString(word: string) {
  return await bcrypt.hashSync(word, 10);
}

export async function compareString(word: string, hashedWord: string) {
  return await bcrypt.compareSync(word, hashedWord);
}
