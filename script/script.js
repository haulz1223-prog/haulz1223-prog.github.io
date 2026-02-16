// Select elements
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const strengthText = document.getElementById('strengthText');
const strengthBar = document.getElementById('strengthBar');
const weaknessFeedback = document.getElementById('weaknessFeedback');
const criteria = {
  length: document.getElementById('length'),
  uppercase: document.getElementById('uppercase'),
  lowercase: document.getElementById('lowercase'),
  number: document.getElementById('number'),
  special: document.getElementById('special')
};
const generateBtn = document.getElementById('generateBtn');
const generatedPassword = document.getElementById('generatedPassword');
const copyBtn = document.getElementById('copyBtn');

// Toggle password visibility
togglePassword.addEventListener('click', () => {
  if(passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "Show";
  }
});

// Real-time password check
passwordInput.addEventListener('input', () => {
  checkPassword(passwordInput.value);
});

// Password generator
generateBtn.addEventListener('click', () => {
  const pass = generatePassword(12);
  generatedPassword.value = pass;
  checkPassword(pass);
});

// Copy generated password
copyBtn.addEventListener('click', () => {
  if(generatedPassword.value) {
    navigator.clipboard.writeText(generatedPassword.value);
    alert("Password copied!");
  }
});

// Check password strength
function checkPassword(password) {
  let score = 0;
  let feedback = [];

  // Length
  if(password.length >= 8) {
    criteria.length.classList.add('valid');
    criteria.length.classList.remove('invalid');
    score++;
  } else {
    criteria.length.classList.add('invalid');
    criteria.length.classList.remove('valid');
    feedback.push("Too short");
  }

  // Uppercase
  if(/[A-Z]/.test(password)) {
    criteria.uppercase.classList.add('valid');
    criteria.uppercase.classList.remove('invalid');
    score++;
  } else {
    criteria.uppercase.classList.add('invalid');
    criteria.uppercase.classList.remove('valid');
    feedback.push("Add uppercase letters");
  }

  // Lowercase
  if(/[a-z]/.test(password)) {
    criteria.lowercase.classList.add('valid');
    criteria.lowercase.classList.remove('invalid');
    score++;
  } else {
    criteria.lowercase.classList.add('invalid');
    criteria.lowercase.classList.remove('valid');
    feedback.push("Add lowercase letters");
  }

  // Number
  if(/\d/.test(password)) {
    criteria.number.classList.add('valid');
    criteria.number.classList.remove('invalid');
    score++;
  } else {
    criteria.number.classList.add('invalid');
    criteria.number.classList.remove('valid');
    feedback.push("Add numbers");
  }

  // Special character
  if(/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    criteria.special.classList.add('valid');
    criteria.special.classList.remove('invalid');
    score++;
  } else {
    criteria.special.classList.add('invalid');
    criteria.special.classList.remove('valid');
    feedback.push("Add special characters");
  }

  // Update strength text & bar
  let strengthPercent = (score/5) * 100;
  strengthBar.style.width = strengthPercent + "%";

  switch(score) {
    case 5:
      strengthText.textContent = "Strength: Very Strong 💪";
      strengthBar.style.background = "green";
      break;
    case 4:
      strengthText.textContent = "Strength: Strong 👍";
      strengthBar.style.background = "limegreen";
      break;
    case 3:
      strengthText.textContent = "Strength: Medium ⚠️";
      strengthBar.style.background = "orange";
      break;
    case 2:
      strengthText.textContent = "Strength: Weak 😕";
      strengthBar.style.background = "orangered";
      break;
    default:
      strengthText.textContent = "Strength: Very Weak ❌";
      strengthBar.style.background = "red";
  }

  weaknessFeedback.textContent = feedback.length ? "Suggestions: " + feedback.join(", ") : "";
}

// Password generator function
function generatePassword(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]:;<>,.?";
  let pass = "";
  for(let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}
