"use strict";

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const modeStatus = document.getElementById("mode-status");
const themeStatus = document.getElementById("theme-status");

let preference = "auto";

function getEffectiveTheme() {
    if (preference === "auto") {
        return systemTheme.matches ? "dark" : "light";
    }

    return preference;
}

function applyTheme() {
    const theme = getEffectiveTheme();

    // Update the entire page, including an already-open dialog.
    document.body.dataset.theme = theme;

    modeStatus.textContent =
        preference === "auto"
            ? "Automatic"
            : `Manual (${preference})`;

    themeStatus.textContent =
        theme === "dark" ? "Dark" : "Light";

    document.querySelectorAll("[data-mode]").forEach(button => {
        button.classList.toggle(
            "primary",
            button.dataset.mode === preference
        );
    });
}

function setDarkMode(mode = "auto") {
    if (![true, false, "auto", "dark", "light"].includes(mode)) {
        throw new TypeError(
            'Mode must be true, false, "auto", "dark", or "light".'
        );
    }

    // Support both boolean and string arguments.
    if (mode === true) mode = "dark";
    if (mode === false) mode = "light";

    preference = mode;

    Dialog.setThemePreference(preference);

    applyTheme();
}

// Manual controls.
document.querySelectorAll("[data-mode]").forEach(button => {
    button.addEventListener("click", () => {
        setDarkMode(button.dataset.mode);
    });
});

// React to OS theme changes only in automatic mode.
systemTheme.addEventListener("change", () => {
    if (preference === "auto") {
        applyTheme();
    }
});

// Start in automatic mode.
setDarkMode("auto");

function handleTextEditing(e) {
    const key = e.key;
    const target = e.target;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const hasSelection = start !== end;
    const selectedText = target.value.substring(start, end);

    // Map of opening keys to their corresponding closing characters
    const pairs = {
        '"': '"',
        '{': '}'
    };

    // handle tab key
    if (key === 'Tab') {
        e.preventDefault();

        const tabChar = "    ";
        target.value = target.value.substring(0, start) + tabChar + target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + tabChar.length;

        return;
    }

    // pairing and wrapping around text
    if (pairs.hasOwnProperty(key)) {
        e.preventDefault();
        const openChar = key;
        const closeChar = pairs[key];

        if (hasSelection) {
            // Wrap highlighted text
            target.value = target.value.substring(0, start) + openChar + selectedText + closeChar + target.value.substring(end);

            // Keep original text highlighted inside the pair
            target.selectionStart = start + 1;
            target.selectionEnd = end + 1;
        } else {
            // Insert empty pair
            target.value = target.value.substring(0, start) + openChar + closeChar + target.value.substring(end);

            // Place cursor right between open and close characters
            target.selectionStart = target.selectionEnd = start + 1;
        }
    }
}

// DIALOGS

// Plain Dialog
const plainDialogInputs = document.querySelectorAll('#plainDialogInputs :is(input, textarea)');
// Content
plainDialogInputs[1].addEventListener('keydown', handleTextEditing);
// Styling
plainDialogInputs[2].addEventListener('keydown', handleTextEditing);

document.getElementById('btnOpenPlainDialog')
    .addEventListener('click', async function () {
        try {
            const positionAt = plainDialogInputs[0].value.trim();
            const content = plainDialogInputs[1].value.trim();
            const styling = plainDialogInputs[2].value.trim();

            await Dialog.showPlainDialogAt(positionAt, content, JSON.parse(`{${styling}}`));
        } catch (e) {
            showErrorToast(e.message);
        }
    });

// Message Dialog
const messageDialogInputs = document.querySelectorAll('#messageDialogInputs :is(input, textarea)');
// Content
messageDialogInputs[2].addEventListener('keydown', handleTextEditing);
// Styling
messageDialogInputs[3].addEventListener('keydown', handleTextEditing);

document.getElementById('btnOpenMessageDialog')
    .addEventListener('click', async function() {
        try {
            const positionAt = messageDialogInputs[0].value.trim();
            const title = messageDialogInputs[1].value.trim();
            const content = messageDialogInputs[2].value.trim();
            const styling = messageDialogInputs[3].value.trim();

            await Dialog.showMessageDialogAt(positionAt, title, content, JSON.parse(`{${styling}}`));
        } catch(e) {
            showErrorToast(e.message);
        }
    });

// Input Dialog
const inputDialogInputs = document.querySelectorAll('#inputDialogInputs :is(input, textarea)');
// Content
inputDialogInputs[2].addEventListener('keydown', handleTextEditing);
// Styling
inputDialogInputs[3].addEventListener('keydown', handleTextEditing);

document.getElementById('btnOpenInputDialog')
    .addEventListener('click', async function() {
        try {
            const positionAt = inputDialogInputs[0].value.trim();
            const title = inputDialogInputs[1].value.trim();
            const content = inputDialogInputs[2].value.trim();
            const styling = inputDialogInputs[3].value.trim();

            const result = await Dialog.showInputDialogAt(positionAt, title, content, JSON.parse(`{${styling}}`));
            showErrorToast(`{ output: ${result.output}, option: ${result.option} }`);
        } catch(e) {
            showErrorToast(e.message);
        }
    });

// Confirm Dialog
const confirmDialogInputs = document.querySelectorAll('#confirmDialogInputs :is(input, textarea)');
// Content
confirmDialogInputs[2].addEventListener('keydown', handleTextEditing);
// Styling
confirmDialogInputs[3].addEventListener('keydown', handleTextEditing);

document.getElementById('btnOpenConfirmDialog')
    .addEventListener('click', async function() {
        try {
            const positionAt = confirmDialogInputs[0].value.trim();
            const title = confirmDialogInputs[1].value.trim();
            const content = confirmDialogInputs[2].value.trim();
            const styling = confirmDialogInputs[3].value.trim();

            const result = await Dialog.showConfirmDialogAt(positionAt, title, content, JSON.parse(`{${styling}}`));
            showErrorToast(`{ option: ${result.option} }`);
        } catch(e) {
            showErrorToast(e.message);
        }
    });

// Instruction Dialog
const instructionDialogInputs = document.querySelectorAll('#instructionDialogInputs :is(input, textarea)');
// Content
instructionDialogInputs[2].addEventListener('keydown', handleTextEditing);
// Styling
instructionDialogInputs[3].addEventListener('keydown', handleTextEditing);

document.getElementById('btnOpenInstructionDialog')
    .addEventListener('click', async function() {
        try {
            const positionAt = instructionDialogInputs[0].value.trim();
            const title = instructionDialogInputs[1].value.trim();
            const content = instructionDialogInputs[2].value.trim();
            const styling = instructionDialogInputs[3].value.trim();

            await Dialog.showInstructionDialogAt(positionAt, title, Array.from(content.split(',')), JSON.parse(`{${styling}}`));
        } catch(e) {
            showErrorToast(e.message);
        }
    });

// toast message
const toastContainer = document.getElementById('toast-container');

// Function to create and show an error toast
function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');

    toast.innerHTML = /*html*/`
        <span class="toast-message">${message}</span>
        <button class="toast-close-btn">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn.addEventListener('click', () => removeToast(toast));

    // remove after 5 seconds
    setTimeout(() => removeToast(toast), 5000);
}

// Smooth removal function
function removeToast(toast) {
    if (toast.classList.contains('hide')) return; // Avoid running twice
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
}

// Save a reference to the original console.error
const originalConsoleError = console.error;

// Override console.error
console.error = function (...args) {
    // Keep the error showing in the developer console normally
    originalConsoleError.apply(console, args);

    // Turn the error arguments into a readable string message
    const errorMessage = args.map(arg => {
        if (arg instanceof Error) return arg.message;
        return typeof arg === 'object' ? JSON.stringify(arg) : arg;
    }).join(' ');

    // display to toast
    showErrorToast(errorMessage);
};