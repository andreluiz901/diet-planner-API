import bcrypt from "bcrypt";

export async function encryptString(word: string) {
  return await bcrypt.hashSync(word, 10);
}
