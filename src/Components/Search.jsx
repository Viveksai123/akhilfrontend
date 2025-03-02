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
    title: 'Solo Leveling',
    difficulty: 'medium',
    points: 150,
    description: 'Web exploitation refers to the practice of identifying and exploiting vulnerabilities in web applications, websites, and online services.',
    link: "https://delicate-babka-d0d7b8.netlify.app/",
    // Hash for "CYB3RN3X4{th3_r0tt3n_secr3ts}" (normalized)
    answer: 'd4926f0cfe8a7fceb5780d8775f7e6673984953af67a83b38e7ed9ce360e3658',
    hints: [
      "Check the browser's Inspect Element for hidden clues or vulnerabilities",
      "User input can be exploited if not properly validated and sanitized",
      "Try using online security tools to test for web application weaknesses"  
    ]

  },
  
  '3': {
    id: '3',
    title: 'Find the Seal',
    difficulty: 'medium',
    points: 250,
    description: "Extracting text from images involves using Optical Character Recognition (OCR) technology, which converts printed, handwritten, or digital text within an image into machine-readable text",
    link: 'https://drive.google.com/file/d/1BuhxuOo48xcj5ZpO3zKtqwMip3eCZRYC/view?usp=sharing',
    // Same as question 4
    answer: '55ee56ffca88287aa92cb6efdb21311799806aac6e16f6312167f2abd4d40b90',
    hints: [
      "Try using OCR tools like Tesseract or Google Vision API",
      "Enhancing the image (contrast, brightness) can improve text recognition",
      "Check if the text is embedded as an image or selectable text"
    
    ]

  }
};

export default questions;