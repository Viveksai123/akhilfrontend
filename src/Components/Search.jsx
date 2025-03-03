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
    points: 170,
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
    points: 180,
    description: "Extracting text from images involves using Optical Character Recognition (OCR) technology, which converts printed, handwritten, or digital text within an image into machine-readable text",
    link: 'https://drive.google.com/file/d/1BuhxuOo48xcj5ZpO3zKtqwMip3eCZRYC/view?usp=sharing',
    // Same as question 4
    answer: '55ee56ffca88287aa92cb6efdb21311799806aac6e16f6312167f2abd4d40b90',
    hints: [
      "Try using OCR tools like Tesseract or Google Vision API",
      "Enhancing the image (contrast, brightness) can improve text recognition",
      "Check if the text is embedded as an image or selectable text"
    
    ]

  },
  '4': {
    id: '4',
    title: 'Rotten Secrets',
    difficulty: 'easy',
    points: 120,
    description: "Are you familiar with ROT13, a simple encryption technique used in cryptography? \n\PLO3EA3K4{gu3_e0gg3a_frpe3gf}",
    link: null,
    answer: 'dcd19ecd19ab8238691719ca955d2fae1d723140f405bf0615f2517e3cb04a7b',
    hints: [
      "Try applying ROT13 decryption to the given text",
      "Not all characters may be encoded—focus on the alphanumeric parts",
      "Explore other ROT-based ciphers if ROT13 doesn’t fully decode it"
    ]
},
'5': {
    id: '5',
    title: 'Layers of Message',
    difficulty: 'easy',
    points: 130,
    description: "Within a cryptographic maze, a hidden message lies in wait. Your task is to decipher the layers of transformation that mask the truth beneath. Put your analytical skills to the test to untangle this complex web and uncover the concealed message.(Multiple decoding is always good) ",
    link: 'https://drive.google.com/file/d/1OaAOQe1Eh8sdQFuut-ZRaa_dau7t4nn_/view?usp=sharing',
    answer: 'f82628a55243b23a663a0ab78e197e77e1c6e0da305f5307754a6d8199d225d8',
    hints: [
      "Look for layered encryption—common techniques include Base64, Hex, and XOR.",
      "Decoding might require multiple transformations—analyze step by step.",
      "Patterns and character distributions can help identify encryption methods."
  ]  
},
'6': {
    id: '6',
    title: 'Journey Through Vigenere',
    difficulty: 'easy',
    points: 150,
    description: "Step into the complex world of 'CRYPTO'GRAPHY, where your problem-solving abilities will be tested by the mysterious Vigenère cipher. This multi-layered puzzle challenges you to decipher an encrypted message and uncover the hidden flag at its heart. Armed with sharp intuition and analytical thinking, take on this exciting intellectual journey and unlock the secrets within! \n\n\EPZ3GG3L4{X1XCC3KF3_15_F3T0B3S}",
    link: null,
    answer: '2f37a668e6cca2b63d5d428fccccf3af9a8e576b67a210be32777008fcb37d73',
    hints: [
      "The Vigenère cipher uses a repeating keyword—identifying it is key to decryption.",
      "Look for common words or patterns to help determine the cipher key.",
      "Use online tools like dCode or CyberChef to simplify the Vigenère decryption process."
  ]  
},
'7': {
    id: '7',
    title: 'MYSTERIES IN THE MARGINS - THE HIDDEN PDF QUEST',
    difficulty: 'medium',
    points: 190,
    description: "Dive into the depths of a seemingly ordinary PDF that guards a well-concealed secret. The document's innocent appearance masks a clever riddle, waiting for a keen investigator to decode its enigma. Use your analytical skills and digital forensics expertise to expose the hidden truth lurking within its layers.",
    link: 'https://drive.google.com/file/d/1cLC7I-N3S4QDed13lu6ieg94ugFwN2ZV/view?usp=sharing',
    answer: '0ecd32cedb88ad440027034e794b6e3f31931a939db37043e3e7dd077fb6f253',
    hints: [
      "Examine the metadata—hidden clues might be stored within the document properties.",
      "Check for invisible text, embedded objects, or steganographic content.",
      "Use tools like ExifTool, PDF-Parser, or CyberChef to analyze hidden data."
  ]  
},
'8': {
    id: '8',
    title: 'Reyansh College: The Hex Cipher Odyssey',
    difficulty: 'medium',
    points: 200,
    description: "Welcome to the challenge where hidden secrets meet cutting-edge cryptography. Reyansh College has released its registration data—an intricate digital puzzle that hides a mysterious hex digest. Your mission is to delve into the registration details, extract the concealed hex digest, and decode it to reveal the ultimate flag.",
    link: 'https://drive.google.com/file/d/12OvPRCOPH1j_xvUihmyq5Ph5rfYpsI3v/view?usp=sharing',
    answer: '8a8b443e7b51093160335f29189d3e475a97b751932afe1ffdf542c08ad5f6c8',
    hints: [
      "Look for hashed or encoded data—common formats include MD5, SHA-1, and SHA-256.",
      "Hex-encoded data might need conversion to ASCII or further decoding.",
      "Use tools like CyberChef or Hashcat to analyze and break down the hex digest."
  ]
  
},
'9': {
    id: '9',
    title: 'Operation bhAAi: The Digital Trail',
    difficulty: 'hard',
    points: 220,
    description: "bhAAi has mysteriously vanished into the vast realm of the internet, leaving behind a series of cryptic clues across public profiles, online forums, and embedded metadata. In this OSINT challenge, your mission is to become a digital detective. Explore various online resources, analyze geo-tags, decode hidden metadata, and connect the dots from seemingly unrelated pieces of information to uncover bhAAi’s true whereabouts.",
    link: null,
    answer: '39fa1a707c72cd545a510fb15e505287af0bf71e2445938bfc6ec6b9d7b53af9',
    hints: [
      "Start by searching for bhAAi on social media, forums, and public databases.",
      "Analyze metadata in images or documents using tools like ExifTool or OSINT Framework.",
      "Check for hidden messages in website source code, URLs, or archived pages."
  ]  
},
'10': {
    id: '10',
    title: 'Cipher Cascadey',
    difficulty: 'hard',
    points: 240,
    description: "A cryptic transmission has just been intercepted, but its contents appear to be completely jumbled. Fortunately, the key to the cipher is subtly hidden at the very beginning of the message. Can you unravel this substitution puzzle? Download the encrypted file to start your investigation.",
    link: 'https://drive.google.com/file/d/1pZiGA6HO5VLSF7YumY0KMbgd0FZtfUSQ/view?usp=sharing',
    answer: '022f6e6cc918f979efc22d24bdb31a44b5874a2e28fb05782998bb58b058e786',
    hints: [
      "Look for a key or pattern at the start of the message—it might guide decryption.",
      "It could be a substitution cipher like Caesar, Atbash, or a custom mapping.",
      "Use frequency analysis or online tools like dCode to identify letter substitutions."
  ]
  
},
'11': {
    id: '11',
    title: 'Encrypted flag quest',
    difficulty: 'hard',
    points: 260,
    description: "A multi-layered encryption challenge where the flag is hidden within a complex system of encoding and transposition. The ciphertext includes a mix of letters, numbers, and symbols, designed to confuse and mislead. Use your cryptographic skills to decode the message and uncover the flag.",
    link: 'https://drive.google.com/file/d/1fUQutBY4GNldE8hhg1b30JjxL-xxyknw/view?usp=sharing',
    answer: '3f80b85565e980680027b270a86300275a58c76903b4ed8882a6f5c23ba74610',
    hints: [
      "Look for a combination of encoding methods like Base64, Hex, or Binary.",
      "Transposition ciphers might involve letter shifting or rearrangement.",
      "Break it down step by step—decoding in the wrong order may lead to gibberish."
  ]
  
},
'12': {
    id: '12',
    title: 'Scrambled Vision Description',
    difficulty: 'hard',
    points: 300,
    description: "Something seems off... We found two strange image fragments, but they don’t make sense on their own. Can you figure out how to put them back together and reveal the hidden message?",
    link: 'https://drive.google.com/file/d/1mliiNjwYSpgw9GZBPODkwvuak7gKzfUW/view?usp=sharing',
    answer: '5315fa562d5a69d349e6cefe5a41887ecd3eebfdbf9c4bba7e3e071f509b6242',
    hints: [
      "Try combining the image fragments—overlapping or merging might reveal hidden text.",
      "Check for steganography techniques using tools like StegSolve or OpenStego.",
      "Analyze the image metadata—use ExifTool to find any embedded clues."
  ]  
},
};

export default questions;