/**
 * Smart Password Checker - Main JavaScript File
 * Handles password validation, strength checking, and generation
 */

// ===================================
// DOM Element Selection
// ===================================
const elements = {
  // Password input section
  passwordInput: document.getElementById('password'),
  togglePassword: document.getElementById('togglePassword'),
  
  // Strength display
  strengthText: document.getElementById('strengthText'),
  strengthBar: document.getElementById('strengthBar'),
  strengthMeter: document.querySelector('.strength-meter'),
  
  // Criteria elements
  criteria: {
    length: document.getElementById('length'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    number: document.getElementById('number'),
    special: document.getElementById('special')
  },
  
  // Feedback
  weaknessFeedback: document.getElementById('weaknessFeedback'),
  
  // Generator section
  generateBtn: document.getElementById('generateBtn'),
  generatedPassword: document.getElementById('generatedPassword'),
  copyBtn: document.getElementById('copyBtn'),
  copyNotification: document.getElementById('copyNotification'),
  passwordLength: document.getElementById('passwordLength'),
  lengthValue: document.getElementById('lengthValue')
};

// ===================================
// Configuration Constants
// ===================================
const CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 32,
  DEFAULT_GEN_LENGTH: 16,
  NOTIFICATION_DURATION: 2500,
  
  REGEX: {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>_+\-=[\]\\;'/`~]/
  },
  
  CHAR_SETS: {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  },
  
  STRENGTH_LEVELS: {
    0: { text: 'Very Weak ❌', gradient: 'linear-gradient(90deg, #e74c3c, #c0392b)' },
    1: { text: 'Very Weak ❌', gradient: 'linear-gradient(90deg, #e74c3c, #c0392b)' },
    2: { text: 'Weak 😕', gradient: 'linear-gradient(90deg, #e67e22, #d35400)' },
    3: { text: 'Medium ⚠️', gradient: 'linear-gradient(90deg, #f39c12, #e67e22)' },
    4: { text: 'Strong 👍', gradient: 'linear-gradient(90deg, #3498db, #2980b9)' },
    5: { text: 'Very Strong 💪', gradient: 'linear-gradient(90deg, #2ecc71, #27ae60)' }
  }
};

// ===================================
// State Management
// ===================================
const state = {
  currentScore: 0,
  isPasswordVisible: false,
  notificationTimeout: null
};

// ===================================
// Utility Functions
// ===================================

/**
 * Safely get a random character from a string
 * @param {string} str - The string to get a character from
 * @returns {string} A random character
 */
function getRandomChar(str) {
  const randomIndex = Math.floor(Math.random() * str.length);
  return str.charAt(randomIndex);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(message, type = 'success') {
  const notification = elements.copyNotification;
  
  // Clear any existing timeout
  if (state.notificationTimeout) {
    clearTimeout(state.notificationTimeout);
  }
  
  // Set message and type
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  // Hide after duration
  state.notificationTimeout = setTimeout(() => {
    notification.classList.remove('show');
  }, CONFIG.NOTIFICATION_DURATION);
}

/**
 * Update criterion UI
 * @param {HTMLElement} element - Criterion element
 * @param {boolean} isValid - Whether criterion is met
 */
function updateCriterion(element, isValid) {
  if (isValid) {
    element.classList.add('valid');
    element.classList.remove('invalid');
  } else {
    element.classList.add('invalid');
    element.classList.remove('valid');
  }
}

/**
 * Reset all criteria to neutral state
 */
function resetCriteria() {
  Object.values(elements.criteria).forEach(criterion => {
    criterion.classList.remove('valid', 'invalid');
  });
}

// ===================================
// Password Validation
// ===================================

/**
 * Check password against all criteria and update UI
 * @param {string} password - Password to check
 */
function checkPassword(password) {
  // Handle empty password
  if (!password || password.length === 0) {
    resetPasswordDisplay();
    return;
  }
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= CONFIG.PASSWORD_MIN_LENGTH) {
    updateCriterion(elements.criteria.length, true);
    score++;
  } else {
    updateCriterion(elements.criteria.length, false);
    feedback.push(`Need ${CONFIG.PASSWORD_MIN_LENGTH - password.length} more character${CONFIG.PASSWORD_MIN_LENGTH - password.length > 1 ? 's' : ''}`);
  }
  
  // Uppercase check
  if (CONFIG.REGEX.uppercase.test(password)) {
    updateCriterion(elements.criteria.uppercase, true);
    score++;
  } else {
    updateCriterion(elements.criteria.uppercase, false);
    feedback.push('Add uppercase letters (A-Z)');
  }
  
  // Lowercase check
  if (CONFIG.REGEX.lowercase.test(password)) {
    updateCriterion(elements.criteria.lowercase, true);
    score++;
  } else {
    updateCriterion(elements.criteria.lowercase, false);
    feedback.push('Add lowercase letters (a-z)');
  }
  
  // Number check
  if (CONFIG.REGEX.number.test(password)) {
    updateCriterion(elements.criteria.number, true);
    score++;
  } else {
    updateCriterion(elements.criteria.number, false);
    feedback.push('Add numbers (0-9)');
  }
  
  // Special character check
  if (CONFIG.REGEX.special.test(password)) {
    updateCriterion(elements.criteria.special, true);
    score++;
  } else {
    updateCriterion(elements.criteria.special, false);
    feedback.push('Add special characters (!@#$%...)');
  }
  
  // Update state
  state.currentScore = score;
  
  // Update strength display
  updateStrengthDisplay(score);
  
  // Update feedback
  updateFeedback(feedback, score);
}

/**
 * Reset password display to initial state
 */
function resetPasswordDisplay() {
  elements.strengthText.textContent = 'Strength: Not evaluated';
  elements.strengthBar.style.width = '0%';
  elements.strengthBar.style.background = CONFIG.STRENGTH_LEVELS[0].gradient;
  elements.weaknessFeedback.textContent = '';
  elements.weaknessFeedback.classList.remove('success');
  elements.strengthMeter.setAttribute('aria-valuenow', '0');
  resetCriteria();
  state.currentScore = 0;
}

/**
 * Update strength meter and text
 * @param {number} score - Password strength score (0-5)
 */
function updateStrengthDisplay(score) {
  const strengthPercent = (score / 5) * 100;
  const level = CONFIG.STRENGTH_LEVELS[score];
  
  // Update bar
  elements.strengthBar.style.width = `${strengthPercent}%`;
  elements.strengthBar.style.background = level.gradient;
  
  // Update text
  elements.strengthText.textContent = `Strength: ${level.text}`;
  
  // Update ARIA
  elements.strengthMeter.setAttribute('aria-valuenow', strengthPercent.toString());
}

/**
 * Update feedback message
 * @param {Array<string>} feedback - Array of feedback messages
 * @param {number} score - Current password score
 */
function updateFeedback(feedback, score) {
  const feedbackElement = elements.weaknessFeedback;
  
  if (feedback.length === 0) {
    feedbackElement.textContent = '✓ All requirements met! Great password!';
    feedbackElement.classList.add('success');
  } else {
    feedbackElement.textContent = `💡 Suggestions: ${feedback.join(' • ')}`;
    feedbackElement.classList.remove('success');
  }
}

// ===================================
// Password Generation
// ===================================

/**
 * Generate a secure random password
 * @param {number} length - Desired password length
 * @returns {string} Generated password
 */
function generatePassword(length) {
  // Validate length
  const validLength = Math.max(
    CONFIG.PASSWORD_MIN_LENGTH,
    Math.min(length, CONFIG.PASSWORD_MAX_LENGTH)
  );
  
  const { lowercase, uppercase, numbers, special } = CONFIG.CHAR_SETS;
  
  // Ensure at least one character from each set
  const guaranteedChars = [
    getRandomChar(lowercase),
    getRandomChar(uppercase),
    getRandomChar(numbers),
    getRandomChar(special)
  ];
  
  // Fill remaining length with random characters from all sets
  const allChars = lowercase + uppercase + numbers + special;
  const remainingLength = validLength - guaranteedChars.length;
  
  for (let i = 0; i < remainingLength; i++) {
    guaranteedChars.push(getRandomChar(allChars));
  }
  
  // Shuffle to avoid predictable pattern
  const shuffled = shuffleArray(guaranteedChars);
  
  return shuffled.join('');
}

// ===================================
// Event Handlers
// ===================================

/**
 * Toggle password visibility
 */
function handleTogglePassword() {
  const input = elements.passwordInput;
  const button = elements.togglePassword;
  
  state.isPasswordVisible = !state.isPasswordVisible;
  
  if (state.isPasswordVisible) {
    input.type = 'text';
    button.querySelector('.text').textContent = 'Hide';
    button.querySelector('.icon').textContent = '🙈';
    button.setAttribute('aria-label', 'Hide password');
  } else {
    input.type = 'password';
    button.querySelector('.text').textContent = 'Show';
    button.querySelector('.icon').textContent = '👁️';
    button.setAttribute('aria-label', 'Show password');
  }
}

/**
 * Handle password input changes
 */
function handlePasswordInput() {
  const password = elements.passwordInput.value;
  checkPassword(password);
}

/**
 * Handle password generation
 */
function handleGeneratePassword() {
  const length = parseInt(elements.passwordLength.value, 10);
  const password = generatePassword(length);
  
  // Display generated password
  elements.generatedPassword.value = password;
  
  // Also set it in the main input and check it
  elements.passwordInput.value = password;
  checkPassword(password);
  
  // Show notification
  showNotification('✓ Password generated successfully!', 'success');
}

/**
 * Handle copy password to clipboard
 */
async function handleCopyPassword() {
  const password = elements.generatedPassword.value;
  
  if (!password) {
    showNotification('❌ Generate a password first!', 'error');
    return;
  }
  
  try {
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(password);
      showNotification('✓ Password copied to clipboard!', 'success');
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = password;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        showNotification('✓ Password copied to clipboard!', 'success');
      } catch (err) {
        showNotification('❌ Failed to copy password', 'error');
      }
      
      document.body.removeChild(textArea);
    }
  } catch (err) {
    console.error('Copy failed:', err);
    showNotification('❌ Failed to copy password', 'error');
  }
}

/**
 * Handle password length slider change
 */
function handleLengthChange() {
  const length = elements.passwordLength.value;
  elements.lengthValue.textContent = length;
}

// ===================================
// Event Listeners
// ===================================

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
  // Password visibility toggle
  elements.togglePassword.addEventListener('click', handleTogglePassword);
  
  // Real-time password checking
  elements.passwordInput.addEventListener('input', handlePasswordInput);
  
  // Password generation
  elements.generateBtn.addEventListener('click', handleGeneratePassword);
  
  // Copy to clipboard
  elements.copyBtn.addEventListener('click', handleCopyPassword);
  
  // Length slider
  elements.passwordLength.addEventListener('input', handleLengthChange);
  
  // Enter key in password field
  elements.passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGeneratePassword();
    }
  });
}

// ===================================
// Initialization
// ===================================

/**
 * Initialize the application
 */
function initialize() {
  // Set up event listeners
  initializeEventListeners();
  
  // Initialize password display
  resetPasswordDisplay();
  
  // Set initial length value
  elements.lengthValue.textContent = elements.passwordLength.value;
  
  // Focus password input
  elements.passwordInput.focus();
  
  console.log('✓ Smart Password Checker initialized successfully');
}

// ===================================
// Start Application
// ===================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkPassword,
    generatePassword,
    CONFIG
  };
}
