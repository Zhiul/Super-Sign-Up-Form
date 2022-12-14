var _ = require("lodash");

function checkEmptyInput(input) {
  return input.value.trim().length === 0;
}

const nameInput = document.getElementById("user-name");
const lastNameInput = document.getElementById("user-last-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("user-password");

nameInput.checkCustomValidity = () => {};

const passwordRequirementsModal = document.querySelector(
  "#password-requirements-modal"
);

function openPasswordRequirementsModal() {
  passwordRequirementsModal.classList.value = "show appearing";
}

function closePasswordRequirementsModal() {
  passwordRequirementsModal.classList.value = "disappearing";
}

function updatePasswordRequirementsModal() {
  const passwordLengthValidity = document.getElementById(
    "password-length-validity"
  );
  const passwordLowercaseValidity =
    document.getElementById("lowercase-validity");
  const passwordUppercaseValidity =
    document.getElementById("uppercase-validity");
  const passwordNumberValidity = document.getElementById("number-validity");
  const passwordSpecialCharValidity = document.getElementById(
    "special-character-validity"
  );

  const lowerCaseLetters = /[a-z]/g;
  if (passwordInput.value.match(lowerCaseLetters)) {
    passwordLowercaseValidity.classList.remove("invalid");
    passwordLowercaseValidity.classList.add("valid");
  } else {
    passwordLowercaseValidity.classList.remove("valid");
    passwordLowercaseValidity.classList.add("invalid");
  }

  // Validate capital letters
  const upperCaseLetters = /[A-Z]/g;
  if (passwordInput.value.match(upperCaseLetters)) {
    passwordUppercaseValidity.classList.remove("invalid");
    passwordUppercaseValidity.classList.add("valid");
  } else {
    passwordUppercaseValidity.classList.remove("valid");
    passwordUppercaseValidity.classList.add("invalid");
  }

  // Validate numbers
  const numbers = /[0-9]/g;
  if (passwordInput.value.match(numbers)) {
    passwordNumberValidity.classList.remove("invalid");
    passwordNumberValidity.classList.add("valid");
  } else {
    passwordNumberValidity.classList.remove("valid");
    passwordNumberValidity.classList.add("invalid");
  }

  // Validate length
  if (passwordInput.value.length >= 8) {
    passwordLengthValidity.classList.remove("invalid");
    passwordLengthValidity.classList.add("valid");
  } else {
    passwordLengthValidity.classList.remove("valid");
    passwordLengthValidity.classList.add("invalid");
  }
}

passwordInput.addEventListener("focusin", openPasswordRequirementsModal);
passwordInput.addEventListener("focusout", closePasswordRequirementsModal);
passwordInput.addEventListener("input", updatePasswordRequirementsModal);

const inputFields = document.querySelectorAll(".sign-up-input");

inputFields.forEach((input) => {
  input.addEventListener("input", _.debounce(reportValidityState, 500), false);
  input.addEventListener("input", setInputEmptyState, false);
});

function setInputEmptyState() {
  const isEmpty = checkEmptyInput(this);
  isEmpty
    ? (this.dataset.empty = true)
    : setTimeout(() => {
        const isEmpty = checkEmptyInput(this);
        if (isEmpty === false) this.dataset.empty = false;
      }, 500);
}

function reportValidityState() {
  const inputContainer = this.closest(".sign-up-field");
  const validInput = this.checkCustomValidity();

  if (validInput) {
    inputContainer.dataset.valid = "valid";
    this.validationBehavior = "eager";
    inputErrorMSG.textContent = "";
  } else {
    inputContainer.dataset.valid = "invalid";
    this.validationBehavior = "aggressive";
  }
}

function reportValidityStateInRealTime() {
  if (this.validationBehavior !== "aggressive") return;

  const inputErrorMSG = this.closest(".sign-up-field").querySelector(
    ".sign-up-input-error"
  );

  const validInput = this.checkValidity();

  if (validInput) {
    inputContainer.dataset.valid = "valid";
    inputErrorMSG.textContent = "";
  }
}

function reportInputError(input, error) {
  const inputErrorMSG = input
    .closest("sign-up-field")
    .querySelector(".sign-up-input-error");

  if (input) inputErrorMSG.textContent = error;
}

function reportFirstNameError() {
  if (checkEmptyInput(this)) {
    reportInputError(this, "First Name cannot be empty.");
  }
}

function reportLastNameError() {
  if (checkEmptyInput(this)) {
    reportInputError(this, "Last Name cannot be empty.");
  }
}

function reportEmailError() {
  const validEmailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (checkEmptyInput(this)) {
    reportInputError(this, "Email cannot be empty.");
    return;
  }

  if (this.value.match(validEmailPattern) === false) {
    reportInputError(this, "Invalid email format");
  }
}

function reportPasswordError() {
  const inputErrorMSG = this.closest("sign-up-field").querySelector(
    ".sign-up-input-error"
  );
  const validPasswordPattern =
    /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  if (checkEmptyInput(this)) {
    inputErrorMSG.textContent = "Password cannot be empty.";
  }

  if (this.value.match(validPasswordPattern) === false) {
    inputErrorMSG.textContent = "Weak password.";
  }
}

nameInput.addEventListener("input", reportFirstNameError, false);
lastNameInput.addEventListener("input", reportLastNameError, false);
emailInput.addEventListener("input", reportEmailError, false);
passwordInput.addEventListener("input", reportPasswordError, false);
