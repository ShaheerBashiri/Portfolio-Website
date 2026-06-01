const encodeForm = document.querySelector("#encodeForm");
const decodeForm = document.querySelector("#decodeForm");
const plainText = document.querySelector("#plainText");
const encodedText = document.querySelector("#encodedText");
const generatedKey = document.querySelector("#generatedKey");
const decodeKey = document.querySelector("#decodeKey");
const cipherText = document.querySelector("#cipherText");
const decodedText = document.querySelector("#decodedText");
const statusEl = document.querySelector("#status");
const copyEncoded = document.querySelector("#copyEncoded");
const copyDecoded = document.querySelector("#copyDecoded");

function showStatus(text, type = "good") {
  statusEl.textContent = text;
  statusEl.className = `status ${type}`;
}

function randomKey() {
  return Math.floor(Math.random() * 26) + 1;
}

function shiftText(text, key) {
  return [...text].map((char) => {
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + key + 26) % 26) + 65);
    }

    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + key + 26) % 26) + 97);
    }

    return char;
  }).join("");
}

function validKey(value) {
  const key = Number(value);
  return Number.isInteger(key) && key >= 1 && key <= 26;
}

async function copyValue(value, message) {
  if (!value.trim()) {
    showStatus("Es gibt noch nichts zum Kopieren.", "error");
    return;
  }

  await navigator.clipboard.writeText(value);
  showStatus(message);
}

encodeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!plainText.value.trim()) {
    showStatus("Gib zuerst eine Nachricht ein.", "error");
    return;
  }

  const key = randomKey();
  const encoded = shiftText(plainText.value, key);
  encodedText.value = encoded;
  cipherText.value = encoded;
  decodeKey.value = key;
  generatedKey.textContent = key;
  showStatus("Text verschlüsselt. Schlüssel wurde übernommen.");
});

decodeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cipherText.value.trim()) {
    showStatus("Gib zuerst einen verschlüsselten Text ein.", "error");
    return;
  }

  if (!validKey(decodeKey.value)) {
    showStatus("Der Schlüssel muss eine ganze Zahl zwischen 1 und 26 sein.", "error");
    return;
  }

  decodedText.value = shiftText(cipherText.value, -Number(decodeKey.value));
  showStatus("Text entschlüsselt.");
});

copyEncoded.addEventListener("click", () => {
  copyValue(encodedText.value, "Verschlüsselter Text kopiert.");
});

copyDecoded.addEventListener("click", () => {
  copyValue(decodedText.value, "Ergebnis kopiert.");
});
