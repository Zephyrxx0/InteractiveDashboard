import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export default ollama;

export async function checkOllamaStatus() {
  try {
    await ollama.list();
    return true;
  } catch (e) {
    return false;
  }
}
