import * as fs from 'fs';

export const readFileSync = (filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
};
