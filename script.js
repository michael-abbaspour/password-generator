/**
 * The scripts for the application.
 */

const form = document.querySelector("#password-generator-form")
const fields = {
    characterLengthRange: document.querySelector("#characterLengthRange"),
    characterLengthNumber: document.querySelector("#characterLengthNumber"),
    includeLowercase: document.querySelector("#includeLowercase"),
    includeUppercase: document.querySelector("#includeUppercase"),
    includeNumeric: document.querySelector("#includeNumeric"),
    includeSymbols: document.querySelector("#includeSymbols")
}
const generatedPassword = document.querySelector("#passwordInput")
const validationSection = document.querySelector(".validation")
const errorsList = document.querySelector(".error-messages")
const copyPasswordBtn = document.querySelector("#copyPassword")

const CHARACTER_TYPES = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numeric: "0123456789",
    symbols: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
}

fields.characterLengthRange.addEventListener("input", function(event) {
    fields.characterLengthNumber.value = event.target.value;
})
fields.characterLengthNumber.addEventListener("input", function(event) {
    fields.characterLengthRange.value = event.target.value;
})

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const characterAmount = Number(fields.characterLengthNumber.value);
    const checkLowercase = fields.includeLowercase.checked;
    const checkUppercase = fields.includeUppercase.checked;
    const checkNumeric = fields.includeNumeric.checked;
    const checkSymbols = fields.includeSymbols.checked;
    const errorMessages = [];

    clearErrors();

    if (Number.isNaN(characterAmount)) {
        errorMessages.push("Character Length must be a number.")
    }
    if (characterAmount < 1 || characterAmount > 128) {
        errorMessages.push("Character Length must be between 1 and 128 characters.")
    }
    if (!checkLowercase && !checkUppercase && !checkNumeric && !checkSymbols) {
        errorMessages.push("Must select at least one checkbox.")
    }

    if (errorMessages.length > 0) {
        showErrors(errorMessages);
    } else {
        generatedPassword.value = generateRandomPassword(characterAmount, checkLowercase, checkUppercase, checkNumeric, checkSymbols);
    }
})

/**
 * Event listener for the Copy Password button which calls the copyPasswordToClipboard callback function when the button is clicked on.
 */
copyPasswordBtn.addEventListener("click", function(event) {
    event.preventDefault();
    copyPasswordToClipboard();
})

const generateRandomPassword = function(characterAmount, checkLowercase, checkUppercase, checkNumeric, checkSymbols) {
    let characterValues = "";

    if (checkLowercase) characterValues = characterValues.concat(CHARACTER_TYPES.lowercase)
    if (checkUppercase) characterValues = characterValues.concat(CHARACTER_TYPES.uppercase)
    if (checkNumeric) characterValues = characterValues.concat(CHARACTER_TYPES.numeric)
    if (checkSymbols) characterValues = characterValues.concat(CHARACTER_TYPES.symbols)

    const passwordCharacters = [];

    for (let i = 0; i < characterAmount; i++) {
        const charVal = characterValues[Math.floor(Math.random() * characterValues.length)];
        passwordCharacters.push(charVal);
    }
    return passwordCharacters.join("");
}

/*********************
 * Utility functions
 *********************/

/**
 * Takes the list of error message(s) and displays it if any occur.
 * @param errorMessages
 */
const showErrors = function(errorMessages) {
    errorMessages.forEach((errorMessage) => {
        const listItem = document.createElement("li");

        listItem.innerText = errorMessage;
        errorsList.appendChild(listItem);
        validationSection.classList.add("show");
    });
}
/**
 * Clears any error messages displayed on the form by removing any children contained within the errors list.
 */
const clearErrors = function() {
    let i = 0;

    while (errorsList.children[i] != null) {
        errorsList.removeChild(errorsList.children[i])
    }
    validationSection.classList.remove("show");
}
/**
 * Function to be used alongside an event to copy the current value of the password to the user's clipboard.
 */
const copyPasswordToClipboard = function() {
    generatedPassword.select();
    navigator.clipboard.writeText(generatedPassword.value)
        .then(function() {
            alert("Copied password to your clipboard successfully!")
        }, function(err) {
            console.error("Copying password failed. Please try again later.", err);
        });
}