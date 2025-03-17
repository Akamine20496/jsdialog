
# JSDialog

The `JSDialog` is a promise-based JavaScript utility that imitates native dialogs in desktop applications and provides a user-friendly way to display input dialogs, message dialogs, plain dialogs, and confirmation dialogs.

Message Dialog, Plain Dialog, and Instruction Dialog can be used without the `await` keyword, and for Input Dialog and Confirm Dialog, since they require waiting for user input, `await` must be used or use `then()` to get the input data. Not using `await` will make all dialog appear at once.

## CDN Links

To use the Dialog class in your project, include the following CDN links in your HTML:

```html
<script src="https://res.cloudinary.com/dy0sbkf3u/raw/upload/Dialog.js"></script>
```

or for the minified version:

```html
<script src="https://res.cloudinary.com/dy0sbkf3u/raw/upload/Dialog.min.js"></script>
```

node package install

```bash
npm i @akamine20496/jsdialog
```

## Installation

You can include the Dialog class in your project by either downloading the JavaScript file, linking to it via a CDN, or install in node package as shown above.

## Usage

## Input Dialog

To create an input dialog, use the `showInputDialog` method. This method returns a promise that resolves with the user input.

```javascript
const result = await Dialog.showInputDialog("Enter your name", "Please provide your name:");
console.log("User input:", result.output, "Option used:", result.option);
```

## Message Dialog

To show a message dialog, use the `showMessageDialog` method. This method displays a message to the user.

```javascript
await Dialog.showMessageDialog("Information", "This is a message dialog.");
```

## Confirmation Dialog

To ask the user for a Yes or No answer, use the `showConfirmDialog` method. This method returns a promise that resolves with the user's choice.

```javascript
const userChoice = await Dialog.showConfirmDialog("Confirm Action", "Are you sure you want to proceed?");
if (userChoice.option === Dialog.YES_OPTION) {
    console.log("User chose Yes");
} else {
    console.log("User chose No");
}
```

## Plain Dialog

The `showPlainDialog` method displays a customizable information dialog to the user.

```javascript
await Dialog.showPlainDialog('This is a plain dialog', {
    backdrop: { 'background-color': 'rgba(0, 0, 0, 1)' },
    dialog: { 'width': '400px', 'background-color': '#fff' },
    eventStyles: {
        button: {
            mouseover: { 'background-color': 'green' },
            mouseout: {
                'color': 'violet',
                'background-color': 'lightgray'
            }
        }
    }
});
```

## Instruction Dialog

The `showInstructionDialog` method displays a paginated content that has a page count tracker to the user.

```javascript
const contents = [
    'Page 1, start',
    'Page 2 <b>It allows html tags here</b>',
    'Page 3, end.'
];

await Dialog.showInstructionDialog('Instruction Dialog', contents, {
    btnPrev: { 'background-color': 'red' },
    btnNext: { 'background-color': 'green' },
    eventStyles: {
        '#instructionDialogBtnPrev': {
            mouseover: { 'background-color': 'maroon' },
            mouseout: { 'background-color': 'red' }
        },
        '#instructionDialogBtnNext': {
            mouseover: { 'background-color': 'darkgreen' },
            mouseout: { 'background-color': 'green' }
        }
    }
})
```

## `customDialogStyle` Object structure
```javascript
{
    backdrop: { 'property': 'value', ... },
    dialog: { 'property': 'value', ... },
    header: { 'property': 'value', ... },
    content: { 'property': 'value', ... },
    footer: { 'property': 'value', ... },
    btnOk: { 'property': 'value', ... },
    btnCancel: { 'property': 'value', ... },
    btnYes: { 'property': 'value', ... },
    btnNo: { 'property': 'value', ... },
    btnPrev: { 'property': 'value', ... },
    btnNext: { 'property': 'value', ... },
    eventStyles: {
        backdrop: {
            eventname: { 'property': 'value', ... }
        },
        dialog: {
            eventname: { 'property': 'value', ... }
        },
        header: {
            eventname: { 'property': 'value', ... }
        },
        content: {
            eventname: { 'property': 'value', ... }
        },
        footer: {
            eventname: { 'property': 'value', ... }
        },
        button: {
            eventname: { 'property': 'value', ... }
        },
        '<button-element-id>': {
            eventname: { 'property': 'value', ... }
        }
    }
}
```

## Static Variables

- `OK_OPTION`: State of OK (0).
- `CANCEL_OPTION`: State of CANCEL (1).
- `YES_OPTION`: State of YES (2).
- `NO_OPTION`: State of NO (3).

## Methods

- `showInputDialog(dialogTitle, dialogContent, customDialogStyle)`: Displays an input dialog and returns the user input.
- `showMessageDialog(dialogTitle, dialogContent, customDialogStyle)`: Displays a message dialog.
- `showConfirmDialog(dialogTitle, dialogContent, customDialogStyle)`: Displays a confirmation dialog and returns the user's choice.
- `showPlainDialog(dialogContent, customDialogStyle)`: Displays a plain dialog and can be customized.
- `showInstructionDialog(dialogTitle, dialogContents, customDialogStyle)`: Displays a paginated dialog that has a page counter to track the current page. 

### Options

- **Input Dialog**: Returns an object containing:
  - `output`: User input or `null`.
  - `option`: `0` for OK, `1` for Cancel.

- **Confirm Dialog**: Returns:
  - `option`: `2` for Yes, `3` for No.

## IDs and Classes

If you want to override manually, please refer to the IDs and Classes below. ID is denoted by `#`, and Class is denoted by `.`.
Be sure to add `!important` in your css value to override it.

**Input Dialog**
- dialog                -> #inputDialog
- title                 -> #inputDialogTitle
- header                -> #inputDialogHeader
- footer                -> #inputDialogFooter
- content               -> #inputDialogContent, .scrollableDialogContent
- input                 -> #inputDialogInput
- btnOk                 -> #inputDialogBtnOk
- btnCancel             -> #inputDialogBtnCancel

**Message Dialog**
- dialog                -> #messageDialog
- title                 -> #messageDialogTitle
- header                -> #messageDialogHeader
- footer                -> #messageDialogFooter
- content               -> #messageDialogContent, .scrollableDialogContent
- btnOk                 -> #messageDialogBtnOk

**Confirm Dialog**
- dialog                -> #confirmDialog
- title                 -> #confirmDialogTitle
- header                -> #confirmDialogHeader
- footer                -> #confirmDialogFooter
- content               -> #confirmDialogContent, .scrollableDialogContent
- btnYes                -> #confirmDialogBtnYes
- btnNo                 -> #confirmDialogBtnNo

**Instruction Dialog**
- dialog                -> #instructionDialog
- title                 -> #instructionDialogTitle
- header                -> #instructionDialogHeader
- footer                -> #instructionDialogFooter
- content               -> #instructionDialogContent, .scrollableDialogContent
- btnOk                 -> #instructionDialogBtnOk
- btnPrev               -> #instructionDialogBtnPrev
- btnNext               -> #instructionDialogBtnNext

**Plain Dialog**
- backdrop              -> #plainDialogBackdrop
- dialog                -> #plainDialog
- button                -> #plainDialogBtnClose
- header                -> #plainDialogHeader
- content               -> #plainDialogContent, .scrollableDialogContent

## Example

Here’s an example that combines the usage of all dialog types:

```javascript
(async () => {
    const name = await Dialog.showInputDialog("Name Input", "Please enter your name:");
    console.log("Name entered:", name.output);
    
    await Dialog.showMessageDialog("Welcome", `Hello, ${name.output}!`);
    
    const confirmed = await Dialog.showConfirmDialog("Confirmation", "Do you want to continue?");
    if (confirmed.option === Dialog.YES_OPTION) {
        console.log("User confirmed.");
    } else {
        console.log("User cancelled.");
    }

    await Dialog.showPlainDialog('This is a plain dialog', {
        backdrop: { 'background-color': 'rgba(0, 0, 0, 1)' },
        dialog: { 'width': '400px', 'background-color': '#fff' },
        button: { 'color': 'red', 'background-color': '#fefefe' }
    });

    const contents = [
        'Page 1',
        `Page 2 <b>This is a bold text, using b element tag</b>`,
        'Page 3'
    ];

    await Dialog.showInstructionDialog('Instruction Dialog', contents, {
        btnPrev: { 'background-color': 'green' },
        eventStyles: {
            '#instructionDialogBtnPrev': {
                mouseover: {
                    'background-color': 'yellow'
                },
                mouseout: {
                    'background-color': 'blue'
                }
            }
        }
    })
})()
```
