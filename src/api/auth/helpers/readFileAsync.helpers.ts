import * as fs from 'fs';

export const readFileAsync = async (filePath: string) => {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  return content;
};
