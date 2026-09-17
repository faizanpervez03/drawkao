export function speak(text: string, lang: string = "en-US"): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    utterance.pitch = 1.1;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function speakLetter(letter: string): Promise<void> {
  return speak(letter);
}

export function speakWord(word: string): Promise<void> {
  return speak(word);
}

export function speakPhonetic(phonetic: string): Promise<void> {
  return speak(phonetic);
}
