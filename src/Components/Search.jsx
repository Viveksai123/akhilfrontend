// ===================================================
// 1. UPDATED QUESTIONS.JSX WITH CRYPTOJS HASHES
// ===================================================

// Save this as questions.jsx
const questions = {
  '1': {
    id: '1',
    title: 'ASCII Numbers',
    difficulty: 'easy',
    points: 100,
    description: 'Convert the following string of ASCII numbers into a readable string:\n\n0x43 0x59 0x42 0x33 0x52 0x4e 0x33 0x58 0x34 0x7b 0x57 0x33 0x4c 0x43 0x30 0x4d 0x33 0x5f 0x54 0x30 0x5f 0x43 0x59 0x42 0x33 0x52 0x4e 0x33 0x58 0x34 0x7d',
    link: null,
    // CryptoJS hash of normalized "cyb3rn3x4w3lc0m3t0cyb3rn3x4"
    answer: '90fd10a0abe713fa8715a889fb79595890391baeb953b8fe39d80a650a6a8a2f',
    hints: [
      "Each number is in hexadecimal format (base 16)",
      "Convert each hex number to its ASCII character equivalent",
      "The 0x prefix indicates a hexadecimal number"
    ]
  },
  '2': {
    id: '2',
    title: 'Rotten Secrets',
    difficulty: 'medium',
    points: 150,
    description: 'Are you familiar with ROT13, a simple encryption technique used in cryptography?\n\nPLO3EA3K4{gu3_e0gg3a_frpe3gf}',
    link: null,
    // Hash for "CYB3RN3X4{th3_r0tt3n_secr3ts}" (normalized)
    answer: 'dcd19ecd19ab8238691719ca955d2fae1d723140f405bf0615f2517e3cb04a7b',
    hints: [
      "ROT13 replaces each letter with the letter 13 positions after it",
      "Numbers remain unchanged in ROT13",
      "Try an online ROT13 decoder"
    ]
  },
  '3': {
    id: '3',
    title: 'Layers of Message',
    difficulty: 'hard',
    points: 200,
    description: 'Within a cryptographic maze, a hidden message lies in wait. Your task is to decipher the layers of transformation that mask the truth beneath.\n\nVm0xNFlWVXhTWGxVV0doVFYwZFNUMVV3Wkc5V1ZteFpZMGhPVlUxV1NsaFhhMlIzWVRBeFdWRnNXbFpOVmtwSVdWUktTMVl4VG5KaFJsWk9WbXR3UlZkV1dsWmxSMDVZVTJ0b1RsWnRhRmhhVjNSaFUxWmtWMVZyWkdsaVZscFhWREZhYjFSc1duUmxSVGxhVmtWYU0xcEZXbXRXVmtaMFQxWlNUbUpGY0RaWFYzUnZWVEpLUjFOWWNHaFRSVXBZVkZWYVMxSkdXa1pTVkd4UlZWUXdPUT09',
    link: null,
    // Replace with actual hash
    answer: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    hints: [
      "This is a multi-layered encoding",
      "One of the layers is Base64",
      "Try decoding multiple times"
    ]
  },
  '4': {
    id: '4',
    title: 'Journey Through Vigenère',
    difficulty: 'hard',
    points: 250,
    description: "Step into the complex world of 'CRYPTO' GRAPHY, where your problem-solving abilities will be tested by the mysterious Vigenère cipher.\n\nAHD3CU3J4{T1P3P3C3_P5_RSW}",
    link: null,
    // Replace with actual hash
    answer: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    hints: [
      "The keyword is hidden in plain sight",
      "Look for the emphasized word in the description",
      "Vigenère cipher uses a keyword for encryption"
    ]
  },
  '5': {
    id: '5',
    title: 'Journey Through Vigenère',
    difficulty: 'hard',
    points: 250,
    description: "Step into the complex world of 'CRYPTO' GRAPHY, where your problem-solving abilities will be tested by the mysterious Vigenère cipher.\n\nAHD3CU3J4{T1P3P3C3_P5_RSW}",
    link: 'https://drive.google.com/file/d/1BuhxuOo48xcj5ZpO3zKtqwMip3eCZRYC/view?usp=sharing',
    // Same as question 4
    answer: '55ee56ffca88287aa92cb6efdb21311799806aac6e16f6312167f2abd4d40b90',
    hints: [
      "The keyword is hidden in plain sight",
      "Look for the emphasized word in the description",
      "Vigenère cipher uses a keyword for encryption"
    ] 
  }
};

export default questions;