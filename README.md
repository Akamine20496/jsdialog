
# JSDialog

The `JSDialog` is a promise-based JavaScript utility that imitates the look of native dialogs in desktop applications and provides a user-friendly way to display input dialogs, message dialogs, plain dialogs, and confirmation dialogs.

Message Dialog, Plain Dialog, and Instruction Dialog can be used without the `await` keyword, and for Input Dialog and Confirm Dialog, since they require waiting for user input, `await` must be used or use `then()` to get the input data. Not using `await` will make all dialog appear at once.


## Installation

You can include the Dialog class in your project by either downloading the JavaScript file, linking to it via a CDN, or install in node package as shown below.

base version
```html
<script src="https://res.cloudinary.com/dy0sbkf3u/raw/upload/Dialog.js"></script>
```

minified version
```html
<script src="https://res.cloudinary.com/dy0sbkf3u/raw/upload/Dialog.min.js"></script>
```

node package install
```bash
npm i @akamine96204/jsdialog
```

## Usage

## Input Dialog

To ask for user input, use the `showInputDialog` method. This method returns a promise that resolves with the user input.

```javascript
const result = await Dialog.showInputDialog("Enter your name", "Please provide your name:");
console.log("User input:", result.output, "Option used:", result.option);
```

## Message Dialog

The `showMessageDialog` method displays information to the user.

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
    backdrop: {
        styles: {
            light: {
                'background-color': 'rgba(230, 45, 100, 1)'
            }
        }
    },
    dialog: {
        styles: {
            light: {
                'width': '400px', 
                'background-color': '#fff'
            }
        }
    },
    button: {
        eventStyles: {
            light: {
                mouseover: { 'background-color': 'green' },
                mouseout: {
                    'color': 'violet',
                    'background-color': 'lightgray'
                }
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
    btnPrev: {
        styles: {
            light: {
                'background-color': 'red',
            }
        },
        eventStyles: {
            light: {
                mouseover: { 'background-color': 'maroon' },
                mouseout: { 'background-color': 'red' }
            }
        }
    },
    btnNext: {
        styles: {
            light: {
                'background-color': 'green',
            }
        },
        eventStyles: {
            light: {
                mouseover: { 'background-color': 'darkgreen' },
                mouseout: { 'background-color': 'green' }
            }
        }
    }
})
```

## Positioning a Dialog Relative to an Element

```javascript
await Dialog.showPlainDialogAt(target, dialogContent, customDialogStyles);
```
The `target` argument allows you to position the dialog at the center of the specified element.
`target` accepts an HTMLElement or the ID of an element. If invalid, the dialog defaults to `document.body`.

If you don't want to anchor the dialog to an element, use the wrapper function which sets `target` to `null` by default.

## `dialogTypesStylesConfig` Object structure
> [!NOTE]
> The dialog parts varies based on dialog types

```javascript
{
    plainDialog: {
        backdrop: {
            styles: {
                light: { 'property': 'value', ... },
                dark: { 'property': 'value', ... }
            },
            eventStyles: {
                light: {
                    eventname: { 'property': 'value', ... }
                },
                dark: {
                    eventname: { 'property': 'value', ... }
                }
            }
        },
        dialog: { ... },
        header: { ... },
        content: { ... },
        button: { ... }
        btnClose: { ... }
    },
    inputDialog: {
        dialog: { ... },
        header: { ... },
        title: { ... },
        content: { ... },
        input: { ... },
        footer: { ... },
        button: { ... }
        btnOk: { ... },
        btnCancel: { ... }
    },
    messageDialog: {
        dialog: { ... },
        header: { ... },
        title: { ... },
        content: { ... },
        footer: { ... },
        button: { ... },
        btnOk: { ... }
    },
    confirmDialog: {
        dialog: { ... },
        header: { ... },
        title: { ... },
        content: { ... },
        footer: { ... },
        button: { ... },
        btnYes: { ... },
        btnNo: { ... }
    },
    instructionDialog: {
        dialog: { ... },
        header: { ... },
        title: { ... },
        content: { ... },
        footer: { ... },
        button: { ... }
        btnOk: { ... },
        btnPrev: { ... },
        btnNext: { ... }
    }
}
```

## `customDialogStyles` Object structure
> [!NOTE]
> The dialog parts varies based on dialog types (e.g. plain dialog, input dialog, etc.)

```javascript
{
    backdrop: {
        styles: {
            light: { 'property': 'value', ... },
            dark: { 'property': 'value', ... }
        },
        eventStyles: {
            light: {
                eventname: { 'property': 'value', ... }
            },
            dark: {
                eventname: { 'property': 'value', ... }
            }
        }
    },
    dialog: { ... },
    header: { ... },
    title: { ... },
    content: { ... },
    input: { ... },
    footer: { ... },
    button: { ... }
    btnOk: { ... },
    btnCancel: { ... },
    btnYes: { ... },
    btnNo: { ... },
    btnClose: { ... },
    btnPrev: { ... },
    btnNext: { ... }
}
```

## Public Static Variables

- `OK_OPTION`: State of OK (0).
- `CANCEL_OPTION`: State of CANCEL (1).
- `YES_OPTION`: State of YES (2).
- `NO_OPTION`: State of NO (3).

## Methods

- `setDialogTypesStyles(dialogTypesStylesConfig)`: Configures custom styles and event styles for different dialog types.
- `setThemePreference(mode)`: Sets the theme of dialog
- `showInputDialogAt(target, dialogTitle, dialogContent, customDialogStyles)`: Displays an input dialog and returns the user input.
- `showMessageDialogAt(target, dialogTitle, dialogContent, customDialogStyles)`: Displays a message dialog.
- `showConfirmDialogAt(target, dialogTitle, dialogContent, customDialogStyles)`: Displays a confirmation dialog and returns the user's choice.
- `showPlainDialogAt(target, dialogContent, customDialogStyles)`: Displays a plain dialog and can be customized.
- `showInstructionDialogAt(target, dialogTitle, dialogContents, customDialogStyles)`: Displays a paginated dialog that has a page counter to track the current page. 

## Wrapper Methods

- `showInputDialog(dialogTitle, dialogContent, customDialogStyles)`: Displays an input dialog and returns the user input.
- `showMessageDialog(dialogTitle, dialogContent, customDialogStyles)`: Displays a message dialog.
- `showConfirmDialog(dialogTitle, dialogContent, customDialogStyles)`: Displays a confirmation dialog and returns the user's choice.
- `showPlainDialog(dialogContent, customDialogStyles)`: Displays a plain dialog and can be customized.
- `showInstructionDialog(dialogTitle, dialogContents, customDialogStyles)`: Displays a paginated dialog that has a page counter to track the current page. 

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
- header                -> #plainDialogHeader
- btnClose              -> #plainDialogBtnClose
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
        backdrop: {
            styles: {
                light: { 'background-color': 'rgba(0, 0, 0, 1)' }
            }
        },
        dialog: {
            styles: {
                light: { 'width': '400px', 'background-color': '#fff' }
            }
        },
        button: {
            styles: {
                light: { 'color': 'red', 'background-color': '#fefefe' }
            }
        }
    });

    const contents = [
        'Page 1',
        `Page 2 <b>This is a bold text, using b element tag</b>`,
        `
        <style>
            #title {
                text-align: center;
            }
            #imgContainer {
                display: flex;
                justify-content: center;
            }
        </style>
        <h1 id="title">An Image</h1>
        <div id="imgContainer">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS4sRctqgyPz_5xeO0tAcdnasFG3gI2hdgi_KHK0o_0urep5XxHIf0GyvT&s=10" alt="image">
        </div>
        `
    ];

    await Dialog.showInstructionDialog('Instruction Dialog', contents, {
        btnPrev: {
            styles: {
                light: { 'background-color': 'green' }
            }
            eventStyles: {
                light: {
                    mouseover: { 'background-color': 'yellow' },
                    mouseout: { 'background-color': 'blue' }
                }
            }
        }
    })
})()
```
