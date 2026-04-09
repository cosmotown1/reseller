import fs from 'fs/promises';

export async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading JSON: ${filePath}\n${err.message}`);
  }
}

export async function writeJSON(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    throw new Error(`Error writing JSON: ${filePath}\n${err.message}`);
  }
}