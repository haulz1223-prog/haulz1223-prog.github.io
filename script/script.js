// Select elements
const passwordInput = document.getElementById('password');
const checkBtn = document.getElementById('checkBtn');
const strengthText = document.getElementById('strengthText');
const criteria = {
  length: document.getElementById('length'),
  uppercase: document.getElementById('uppercase'),
  lowercase: document.getElementById('lowercase'),
  number: document.getElementById('number'),
  special: document.getElementById('special')
};

// Password validation function
function checkPassword(password) {
  let score = 0;

  // Length
  if (password.length >= 8) {
    criteria.length.classList.add('valid');
    criteria.length.classList.remove('invalid');
    score++;
  } else {
    criteria.length.classList.add('invalid');
    criteria.length.classList.remove('valid');
  }

  // Uppercase
  if (/[A-Z]/.test(password)) {
    criteria.uppercase.classList.add('valid');
    criteria.uppercase.classList.remove('invalid');
    score++;
  } else {
    criteria.uppercase.classList.add('invalid');
    criteria.uppercase.classList.remove('valid');
  }

  // Lowercase
  if (/[a-z]/.test(password)) {
    criteria.lowercase.classList.add('valid');
    criteria.lowercase.classList.remove('invalid');
    score++;
  } else {
    criteria.lowercase.classList.add('invalid');
    criteria.lowercase.classList.remove('valid');
  }

  // Number
  if (/\d/.test(password)) {
    criteria.number.classList.add('valid');
    criteria.number.classList.remove('invalid');
    score++;
  } else {
    criteria.number.classList.add('invalid');
    criteria.number.classList.remove('valid');
  }

  // Special character
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    criteria.special.classList.add('valid');
    criteria.special.classList.remove('invalid');
    score++;
  } else {
    criteria.special.classList.add('invalid');
    criteria.special.classList.remove('valid');
  }

  // Set strength text
  switch(score) {
    case 5:
      strengthText.textContent = "Strength: Very Strong 💪";
      strengthText.style.color = "green";
      break;
    case 4:
      strengthText.textContent = "Strength: Strong 👍";
      strengthText.style.color = "limegreen";
      break;
    case 3:
      strengthText.textContent = "Strength: Medium ⚠️";
      strengthText.style.color = "orange";
      break;
    case 2:
      strengthText.textContent = "Strength: Weak 😕";
      strengthText.style.color = "orangered";
      break;
    default:
      strengthText.textContent = "Strength: Very Weak ❌";
      strengthText.style.color = "red";
  }
}

// Event listener
checkBtn.addEventListener('click', () => {
  const password = passwordInput.value;
  if(password === '') {
    alert('Please enter a password!');
    return;
  }
  checkPassword(password);
});

