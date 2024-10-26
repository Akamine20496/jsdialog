
# JSDialog

The `JSDialog` is a promise-based JavaScript utility that imitates native dialogs in desktop applications and provides a user-friendly way to display input dialogs, message dialogs, and confirmation dialogs.

Message Dialog and Plain Dialog can be used without the `await` keyword, but not Input Dialog and Confirm Dialog, because they require waiting for user input.

## CDN Links

To use the Dialog class in your project, include the following CDN links in your HTML:

```html
<script src="https://res.cloudinary.com/dy0sbkf3u/raw/upload/Dialog.js"></script>
```

or for the minified version:

```html
<script src="https://res.cloudinary.com/dy0sbkf3u/raw/upload/Dialog.min.js"></script>
```

## Installation

You can include the Dialog class in your project by either downloading the JavaScript file or linking to it via a CDN as shown above.

## Usage

### Input Dialog

To create an input dialog, use the `showInputDialog` method. This method returns a promise that resolves with the user input.

```javascript
const result = await Dialog.showInputDialog("Enter your name", "Please provide your name:");
console.log("User input:", result.output);
```

### Message Dialog

To show a message dialog, use the `showMessageDialog` method. This method displays a message to the user.

```javascript
await Dialog.showMessageDialog("Information", "This is a message dialog.");
```

### Confirmation Dialog

To ask the user for a Yes or No answer, use the `showConfirmDialog` method. This method returns a promise that resolves with the user's choice.

```javascript
const userChoice = await Dialog.showConfirmDialog("Confirm Action", "Are you sure you want to proceed?");
if (userChoice === Dialog.YES_OPTION) {
    console.log("User chose Yes");
} else {
    console.log("User chose No");
}
```

### Plain Dialog

The `showPlainDialog` method displays a customizable information dialog to the user.

```javascript
await Dialog.showPlainDialog('This is a plain dialog', {
    backdrop: { 'background-color': 'rgba(0, 0, 0, 1)' },
    dialog: { 'width': '400px', 'background-color': '#fff' },
    button: { 'color': 'red' }
});
```

## Static Variables

- `OK_OPTION`: State of the Input Dialog OK (1).
- `CANCEL_OPTION`: State of the Input Dialog CANCEL (0).
- `YES_OPTION`: State of the Confirm Dialog YES (1).
- `NO_OPTION`: State of the Confirm Dialog NO (0).

## Methods

- `showInputDialog(dialogTitle, dialogContent)`: Displays an input dialog and returns the user input.
- `showMessageDialog(dialogTitle, dialogContent)`: Displays a message dialog.
- `showConfirmDialog(dialogTitle, dialogContent)`: Displays a confirmation dialog and returns the user's choice.
- `showPlainDialog(dialogContent, dialogStyle)`: Displays a plain dialog and can be customized by passing an object as 2nd parameter. These are keys that are only accepted `backdrop, dialog, content, button, dialogCloseButtonContainer`

### Options

- **Input Dialog**: Returns an object containing:
  - `output`: User input or `null`.
  - `outputLength`: Length of the user input.
  - `option`: `1` for OK, `0` for Cancel.

- **Confirm Dialog**: Returns:
  - `1` for Yes, `0` for No.

## Example

Here’s an example that combines the usage of all dialog types:

```javascript
async function showDialogs() {
    const name = await Dialog.showInputDialog("Name Input", "Please enter your name:");
    console.log("Name entered:", name.output);
    
    await Dialog.showMessageDialog("Welcome", `Hello, ${name.output}!`);
    
    const confirmed = await Dialog.showConfirmDialog("Confirmation", "Do you want to continue?");
    if (confirmed === Dialog.YES_OPTION) {
        console.log("User confirmed.");
    } else {
        console.log("User cancelled.");
    }

    await Dialog.showPlainDialog('This is a plain dialog', {
        backdrop: { 'background-color': 'rgba(0, 0, 0, 1)' },
        dialog: { 'width': '400px', 'background-color': '#fff' },
        button: { 'color': 'red', 'background-color': '#fefefe' }
    });
}

showDialogs();
```
