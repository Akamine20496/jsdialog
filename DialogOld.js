/**
 * This is a class with `promise-based` function where it imitates
 * native dialogs in desktop and they require waiting for user 
 * input upon invoking this functions (excluding Message Dialog and Plain Dialog).
 * 
 * Message Dialog and Plain Dialog can be used without the `await` keyword, 
 * but not Input Dialog and Confirm Dialog, because they require waiting for user input.
 */
class Dialog {
    /**
     * State of the Input Dialog OK (1)
     */
    static OK_OPTION = 1;
    /**
     * State of the Input Dialog CANCEL (0)
     */
    static CANCEL_OPTION = 0;
    /**
     * State of the Confirm Dialog YES (1)
     */
    static YES_OPTION = 1;
    /**
     * State of the Confirm Dialog NO (0)
     */
    static NO_OPTION = 0;

    /**
     * Make the static variables immutable
     */
    static {
        Object.defineProperties(this, {
            OK_OPTION: {
                writable: false,
                configurable: false,
            },
            CANCEL_OPTION: {
                writable: false,
                configurable: false,
            },
            YES_OPTION: {
                writable: false,
                configurable: false,
            },
            NO_OPTION: {
                writable: false,
                configurable: false,
            },
        });
    }

    /**
     * method of Dialog Class that allows user input
     * @param {string} dialogTitle Title of the dialog (only plain text)
     * @param {string} dialogContent Content of the dialog for user to see (allows element tags)
     * @returns data of dialog upon resolve().
     */
    static async showInputDialog(dialogTitle, dialogContent) {
        // create elemeents
        const inputDialog = document.createElement('dialog');
        const title = document.createElement('h4');
        const content = document.createElement('div');
        const input = document.createElement('input');
        const btnOk = document.createElement('button');
        const btnCancel = document.createElement('button');

        // divs
        const dialogHeader = document.createElement('div');
        const dialogForm = document.createElement('form');
        const dialogInputContainer = document.createElement('div');
        const dialogButtonContainer = document.createElement('div');

        // add the style
        this.#addStyles({
            dialog: inputDialog,
            title: title,
            content: content,
            input: input,
            buttons: {
                btnOk: btnOk,
                btnCancel: btnCancel
            },
            divs: {
                dialogHeader: dialogHeader,
                dialogForm: dialogForm,
                dialogInputContainer: dialogInputContainer,
                dialogButtonContainer: dialogButtonContainer
            }
        });

        // add attributes
        inputDialog.id = 'inputDialog';
        title.id = 'inputDialogTitle';
        content.id = 'inputDialogContent';
        content.className = 'scrollableDialogContent';
        input.id = 'inputDialogInput';
        input.type = 'text';
        btnOk.id = 'inputDialogOkButton';
        btnOk.type = 'submit';
        btnOk.innerText = 'OK';
        btnCancel.id = 'inputDialogCancelButton';
        btnCancel.innerText = 'Cancel';

        dialogHeader.id = 'inputDialogHeader';
        dialogForm.id = 'inputDialogForm';
        dialogForm.method = 'dialog';
        dialogInputContainer.id = 'inputDialogInputContainer';
        dialogButtonContainer.id = 'inputDialogButtonContainer';


        // append the elements
        dialogHeader.append(title, content);
        dialogInputContainer.appendChild(input);
        dialogButtonContainer.append(btnOk, btnCancel);
        dialogForm.append(dialogInputContainer, dialogButtonContainer);
        inputDialog.append(dialogHeader, dialogForm);
        document.body.prepend(inputDialog);

        /*
         * dialogData       =   contains the data of the input dialog
         * 
         * output           =   output of the dialog (input). null is default value
         * outputLength     =   length of the output
         * operation        =   operations of the buttons in dialog. 0 is default value
         *                      1 - OK
         *                      0 - CANCEL
         */
        const dialogData = {
            output: null,
            option: 0,
        };

        /**
         * Removes all HTML Element contained in this string
         * @param {string} string 
         * @returns sanitized string
         */
        function sanitizeInput(string) {
            // remove HTML Tags to the string
            return string.replace(/<[^>]*>/g, '');
        }

        return new Promise((resolve) => {
            if (!inputDialog.open) {
                // Display the modal with the message
                inputDialog.showModal();

                // show the message
                title.innerText = dialogTitle;
                content[this.#hasHTMLTag(dialogContent) ? 'innerHTML' : 'innerText'] = dialogContent;

                // focus on the text field
                input.focus();

                dialogForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    // update the data of dialog
                    const userInput = sanitizeInput(input.value);
                    dialogData.output = !userInput ? dialogData.output : userInput;
                    dialogData.outputLength = userInput.length;
                    dialogData.option = 1;

                    // Resolve the promise to indicate that the modal has been closed
                    resolve(Object.freeze(dialogData));

                    // remove the element    
                    inputDialog.remove();
                });

                btnCancel.addEventListener('click', () => {
                    // close the dialog
                    inputDialog.close();

                    // Resolve the promise to indicate that the modal has been closed
                    resolve(Object.freeze(dialogData));

                    // remove the element
                    inputDialog.remove();
                });
            }
        });
    }

    /**
     * method of Dialog Class that shows information message
     * @param {string} dialogTitle Title of the dialog (only plain text)
     * @param {string} dialogContent Content of the dialog for user to see (allows element tags)
     * @returns nothing, it is only for displaying messages
     */
    static async showMessageDialog(dialogTitle, dialogContent) {
        // create elemeents
        const messageDialog = document.createElement('dialog');
        const title = document.createElement('h4');
        const content = document.createElement('div');
        const btnOk = document.createElement('button');

        // divs
        const dialogHeader = document.createElement('div');
        const dialogButtonContainer = document.createElement('div');

        // add the style
        this.#addStyles({
            dialog: messageDialog, 
            title: title, 
            content: content, 
            buttons: {
                btnOk: btnOk
            },
            divs: {
                dialogHeader: dialogHeader,
                dialogButtonContainer: dialogButtonContainer
            }
        });

        // add attributes
        messageDialog.id = 'messageDialog';
        title.id = 'messageDialogTitle';
        content.id = 'messageDialogContent';
        content.className = 'scrollableDialogContent';
        btnOk.id = 'messageDialogOkButton';
        btnOk.innerText = 'OK';

        dialogHeader.id = 'messageDialogHeader';
        dialogButtonContainer.id = 'messageDialogButtonContainer';


        // append the elements
        dialogHeader.append(title, content);
        dialogButtonContainer.appendChild(btnOk);
        messageDialog.append(dialogHeader, dialogButtonContainer);
        document.body.prepend(messageDialog);

        return new Promise((resolve) => {
            if (!messageDialog.open) {
                // Display the modal with the message
                messageDialog.showModal();

                // show the message
                title.innerText = dialogTitle;
                content[this.#hasHTMLTag(dialogContent) ? 'innerHTML' : 'innerText'] = dialogContent;

                // focus on the button
                btnOk.focus();

                // Listen for the close event of the modal
                btnOk.addEventListener('click', () => {
                    // Close the modal
                    messageDialog.close();

                    // Resolve the promise to indicate that the modal has been closed
                    resolve();

                    // remove the element
                    messageDialog.remove();
                });
            }
        });
    }

    /**
     * method of Dialog Class that asks for YES or NO answer
     * @param {string} dialogTitle Title of the dialog (only plain text)
     * @param {string} dialogContent Content of the dialog for user to see (allows element tags)
     * @returns operation of the dialog upon resolve()
     */
    static async showConfirmDialog(dialogTitle, dialogContent) {
        // create elemeents
        const confirmDialog = document.createElement('dialog');
        const title = document.createElement('h4');
        const content = document.createElement('div');
        const btnYes = document.createElement('button');
        const btnNo = document.createElement('button');

        // divs
        const dialogHeader = document.createElement('div');
        const dialogButtonContainer = document.createElement('div');

        // add the style
        this.#addStyles({
            dialog: confirmDialog,
            title: title, 
            content: content, 
            buttons: {
                btnYes: btnYes, 
                btnNo: btnNo
            },
            divs: {
                dialogHeader: dialogHeader,
                dialogButtonContainer: dialogButtonContainer
            }
        });

        // add attributes
        confirmDialog.id = 'confirmDialog';
        title.id = 'confirmDialogTitle';
        content.id = 'confirmDialogContent';
        content.className = 'scrollableDialogContent';
        btnYes.id = 'confirmDialogOkButton';
        btnYes.innerText = 'Yes';
        btnNo.id = 'confirmDialogCancelButton';
        btnNo.innerText = 'No';

        dialogHeader.id = 'confirmDialogHeader';
        dialogButtonContainer.id = 'confirmDialogButtonContainer';


        // append the elements
        dialogHeader.append(title, content);
        dialogButtonContainer.append(btnYes, btnNo);
        confirmDialog.append(dialogHeader, dialogButtonContainer);
        document.body.prepend(confirmDialog);

        // Operation of the dialog. (1) YES, (0) NO
        let dialogOption = 0;

        return new Promise((resolve) => {
            if (!confirmDialog.open) {
                // Display the modal with the message
                confirmDialog.showModal();

                // show the message
                title.innerText = dialogTitle;
                content[this.#hasHTMLTag(dialogContent) ? 'innerHTML' : 'innerText'] = dialogContent;

                // focus on the button
                btnYes.focus();

                btnYes.addEventListener('click', () => {
                    dialogOption = 1;

                    // Close the modal
                    confirmDialog.close();

                    // Resolve the promise to indicate that the modal has been closed
                    resolve(dialogOption);

                    // remove the element
                    confirmDialog.remove();
                });

                btnNo.addEventListener('click', () => {
                    // Close the modal
                    confirmDialog.close();

                    // Resolve the promise to indicate that the modal has been closed
                    resolve(dialogOption);

                    // remove the element
                    confirmDialog.remove();
                });
            }
        });
    }

    /**
     * method of Dialog Class that shows information message and this is customizable
     * @param {string} dialogContent Content of the dialog for user to see (allows element tags)
     * @param {object} customDialogStyle Custom style for the Plain Dialog. These are the only keys accepted `backdrop, dialog, content, button, dialogCloseButtonContainer, eventStyles`. As for the eventStyles of the keys, these are the only events accepted `mouseover, mouseout, focus, blur`.
     * @description For the CSS Part, follow this template. 
     * @example { key: {'property': 'value', ...} }
     * @description If you want to put empty an value, simply put empty string `''`.
     * @returns nothing, it is only for displaying messages
     */
    static async showPlainDialog(dialogContent, customDialogStyle) {
        // create elements
        const plainDialogBackdrop = document.createElement('div');
        const plainDialog = document.createElement('div');
        const btnClose = document.createElement('span');
        const content = document.createElement('div');

        // divs
        const dialogCloseButtonContainer = document.createElement('div');

        // set attributes
        plainDialogBackdrop.id = 'plainDialogBackdrop';
        plainDialog.id = 'plainDialog';
        btnClose.id = 'btnClose';
        btnClose.role = 'button';
        btnClose.tabIndex = '0';
        btnClose.innerHTML = '&times;';
        content.id = 'plainDialogContent';
        content.className = 'scrollableDialogContent';
        
        dialogCloseButtonContainer.id = 'plainDialogCloseButtonContainer';

        dialogCloseButtonContainer.appendChild(btnClose);
        plainDialog.append(dialogCloseButtonContainer, content);
        plainDialogBackdrop.appendChild(plainDialog);
        document.body.prepend(plainDialogBackdrop);

        // add the style
        this.#addPlainDialogStyle({
            backdrop: plainDialogBackdrop,
            dialog: plainDialog,
            button: btnClose,
            content: content,
            dialogCloseButtonContainer: dialogCloseButtonContainer,
            eventStyles: {
                button: {
                    mouseover: {
                        'background-color': '#495057',
                        'outline': '1px solid rgba(173, 181, 189, 0.5)',
                        'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.2)'
                    },
                    mouseout: {
                        'background-color': '#adb5bd',
                        'outline': '',
                        'box-shadow': ''
                    },
                    focus: {
                        'outline': '1px solid rgba(173, 181, 189, 0.5)',
                        'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.2)'
                    },
                    blur: {
                        'outline': '',
                        'box-shadow': ''
                    }
                }
            }
        }, customDialogStyle || {});

        function openPlainDialog() {
            plainDialogBackdrop.classList.add('fade-in');
            plainDialog.classList.add('fade-in');
            plainDialogBackdrop.classList.remove('fade-out');
            plainDialog.classList.remove('fade-out');

            plainDialogBackdrop.style.display = 'flex';
        }

        function closePlainDialog() {
            plainDialogBackdrop.classList.add('fade-out');
            plainDialog.classList.add('fade-out');
            plainDialogBackdrop.classList.remove('fade-in');
            plainDialog.classList.remove('fade-in');

            setTimeout(() => {
                plainDialogBackdrop.style.display = 'none';
                plainDialogBackdrop.remove();
            }, 300);
        }

        return new Promise((resolve) => {
            if (plainDialogBackdrop.style.display === 'none') {
                // show dialog
                openPlainDialog();

                // show the message
                content[this.#hasHTMLTag(dialogContent) ? 'innerHTML' : 'innerText'] = dialogContent;

                // focus to the button
                btnClose.focus();

                function handleOnClose(e) {
                    const { target, type, key } = e;

                    if (type === 'keydown' && key === 'Enter') {
                        resolve();
                        closePlainDialog();

                        document.removeEventListener('click', handleOnClose);
                    }
                    
                    if (type === 'click' && (target === btnClose || target === plainDialogBackdrop)) {
                        resolve();
                        closePlainDialog();

                        document.removeEventListener('click', handleOnClose);
                    }
                }

                btnClose.addEventListener('keydown', handleOnClose);
                document.addEventListener('click', handleOnClose);
            }
        });
    }

    /**
     * Responsible for styling Plain Dialog
     * @param {object} defaultDialogStyle { backdrop, dialog, content, button, dialogCloseButtonContainer, buttonEventStyles }
     * @param {object} customDialogStyle just like normal css 'property': 'value'
     * @returns early return if elements object is empty
     */
    static async #addPlainDialogStyle(defaultDialogStyle, customDialogStyle) {
        if (!defaultDialogStyle && Object.entries(defaultDialogStyle).length <= 0) return;

        const { backdrop, dialog, content, button, dialogCloseButtonContainer } = defaultDialogStyle;
        const definedDialogKeys = [ 'backdrop', 'dialog', 'content', 'button', 'dialogCloseButtonContainer' ];
        const definedEventKeys = [ 'mouseover', 'mouseout', 'focus', 'blur' ];

        if (backdrop) {
            backdrop.style.setProperty('display', 'none');
            backdrop.style.setProperty('justify-self', 'center', 'important');
            backdrop.style.setProperty('align-self', 'center', 'important');
            backdrop.style.setProperty('position', 'fixed', 'important');
            backdrop.style.setProperty('top', '0', 'important');
            backdrop.style.setProperty('left', '0', 'important');
            backdrop.style.setProperty('width', '100vw', 'important');
            backdrop.style.setProperty('height', '100vh', 'important');
            backdrop.style.setProperty('background-color', 'rgba(0, 0, 0, 0.1)', 'important');
            backdrop.style.setProperty('z-index', '9999', 'important');
            backdrop.style.setProperty('overflow-y', 'auto', 'important');
            backdrop.style.setProperty('overflow-x', 'hidden', 'important');
            backdrop.style.setProperty('margin', '0', 'important');
            backdrop.style.setProperty('padding', '0', 'important');
            backdrop.style.setProperty('box-sizing', 'border-box', 'important');
            backdrop.style.setProperty('opacity', '0');
        }

        if (dialog) {
            dialog.style.setProperty('margin', 'auto', 'important');
            dialog.style.setProperty('justify-self', 'center', 'important');
            dialog.style.setProperty('align-self', 'center', 'important');
            dialog.style.setProperty('border-radius', '10px', 'important');
            dialog.style.setProperty('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)', 'important');
            dialog.style.setProperty('padding', '0', 'important');
            dialog.style.setProperty('max-width', '50vw', 'important');
            dialog.style.setProperty('max-height', '85vh', 'important');
            dialog.style.setProperty('min-width', '300px', 'important');
            dialog.style.setProperty('min-height', '150px', 'important');
            dialog.style.setProperty('box-sizing', 'border-box', 'important');
            dialog.style.setProperty('overflow-y', 'auto', 'important');
            dialog.style.setProperty('overflow-x', 'hidden', 'important');
            dialog.style.setProperty('font-family', 'Arial, sans-serif', 'important');
            dialog.style.setProperty('background-color', '#f9f9f9', 'important');
            dialog.style.setProperty('display', 'flex', 'important');
            dialog.style.setProperty('flex-direction', 'column', 'important');
            dialog.style.setProperty('opacity', '0');
        }

        if (content) {
            content.style.setProperty('width', 'auto', 'important');
            content.style.setProperty('height', 'auto', 'important');
            content.style.setProperty('background-color', 'rgba(221, 216, 216, 0.26)', 'important');
            content.style.setProperty('bax-shadow', '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', 'important');
            content.style.setProperty('border-radius', '8px', 'important');
            content.style.setProperty('flex', '1 1 auto', 'important');
            content.style.setProperty('max-height', 'calc(100% - 20%)', 'important');
            content.style.setProperty('overflow-y', 'auto', 'important');
            content.style.setProperty('padding', '4px 5px', 'important');
            content.style.setProperty('margin', '10px', 'important');
            content.style.setProperty('color', '#555', 'important');
            content.style.setProperty('overflow-y', 'auto', 'important');
            content.style.setProperty('scroll-behavior', 'smooth');
            content.style.setProperty('box-sizing', 'unset', 'important');
            content.style.setProperty('overflow-wrap', 'break-word', 'important');
        }

        if (button) {
            button.style.setProperty('user-select', 'none', 'important');
            button.style.setProperty('font-family', 'Arial, sans-serif', 'important');
            button.style.setProperty('width', '20px', 'important');
            button.style.setProperty('height', 'auto', 'important');
            button.style.setProperty('box-sizing', 'unset', 'important');
            button.style.setProperty('font-size', '1.250rem', 'important');
            button.style.setProperty('text-align', 'center', 'important');
            button.style.setProperty('background-color', '#adb5bd', 'important');
            button.style.setProperty('margin', '0', 'important');
            button.style.setProperty('padding', '8px 16px', 'important');
            button.style.setProperty('border', 'none', 'important');
            button.style.setProperty('border-radius', '4px', 'important');
            button.style.setProperty('color', '#fff', 'important');
            button.style.setProperty('cursor', 'pointer', 'important');
            button.style.setProperty('transition', 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out', 'important');
        }

        if (dialogCloseButtonContainer) {
            dialogCloseButtonContainer.style.setProperty('width', 'auto', 'important');
            dialogCloseButtonContainer.style.setProperty('height', 'auto', 'important');
            dialogCloseButtonContainer.style.setProperty('box-sizing', 'unset', 'important');
            dialogCloseButtonContainer.style.setProperty('padding', '0', 'important');
            dialogCloseButtonContainer.style.setProperty('margin', '0', 'important');
            dialogCloseButtonContainer.style.setProperty('flex', '0 0 20%', 'important');
            dialogCloseButtonContainer.style.setProperty('display', 'flex', 'important');
            dialogCloseButtonContainer.style.setProperty('align-items', 'center', 'important');
            dialogCloseButtonContainer.style.setProperty('justify-content', 'flex-end', 'important');
        }

        // default eventStyles
        for (const key in defaultDialogStyle.eventStyles) {
            if (definedDialogKeys.includes(key)) {
                validateAndApplyEventStyles(defaultDialogStyle[key], {}, defaultDialogStyle.eventStyles[key]);
            } else {
                await this.showMessageDialog('Invalid Default Dialog Style Key!', `This key => ${key} is not valid.`);
            }
        }

        // override default eventStyles
        if (customDialogStyle && Object.entries(customDialogStyle).length > 0) {
            for (const key in customDialogStyle) {
                if (definedDialogKeys.includes(key)) {
                    for (const [property, value] of Object.entries(customDialogStyle[key])) {
                        defaultDialogStyle[key].style.setProperty(property, value , 'important');
                    }
                } else if (key === 'eventStyles') {
                    for (const dialogKey in customDialogStyle.eventStyles) {
                        if (definedDialogKeys.includes(dialogKey)) {
                            validateAndApplyEventStyles(defaultDialogStyle[dialogKey], customDialogStyle.eventStyles[dialogKey], defaultDialogStyle.eventStyles[dialogKey] || {});
                        } else {
                            await this.showMessageDialog('Invalid Custom Event Style Key!', `This key => ${dialogKey} is not valid.`);
                        }
                    }
                } else {
                    await this.showMessageDialog('Invalid Custom Dialog Style Key!', `This key => ${key} is not valid.`);
                }
            }
        }

        this.#addScrollbarStyles();
        this.#addDialogAnimationStyle();

        async function validateAndApplyEventStyles(element, customEventStyles, defaultEventStyles) {
            for (const eventKey in defaultEventStyles) {
                if (!definedEventKeys.includes(eventKey)) {
                    await Dialog.showMessageDialog('Invalid Default Event Style Key!', `This key => ${eventKey} is not valid.`);
                }
            }

            for (const eventKey in customEventStyles) {
                if (!definedEventKeys.includes(eventKey)) {
                    await Dialog.showMessageDialog('Invalid Custom Event Style Key!', `This key => ${eventKey} is not valid.`);
                }
            }
        
            // Merge and apply styles for each event
            for (const event of definedEventKeys) {
                const eventStyles = { ...defaultEventStyles[event], ...customEventStyles[event]};
                
                element.addEventListener(event, () => {
                    for (const [property, value] of Object.entries(eventStyles)) {
                        if (value) {
                            element.style.setProperty(property, value, 'important');
                        } else {
                            element.style.removeProperty(property);
                        }
                    }
                });
            }
        }
    }

    /**
     * Checks if the dialogContent has HTML tags
     * @param {string} dialogContent 
     * @returns Returns true if HTML tags are present, otherwise false.
     */
    static #hasHTMLTag(dialogContent) {
        // Regular expression to check for HTML tags
        const htmlTagPattern = /<[^>]*>/g;
        let hasHTMLTag = false;
    
        // Check if the string contains any HTML tags
        if (htmlTagPattern.test(dialogContent)) {
            hasHTMLTag = true;
        }

        return hasHTMLTag;
    }

    /**
     * Responsible for styling Input Dialog, Message Dialog, and Confirm Dialog
     * @param {object} elements just like normal css 'property': 'value'
     * @returns early return if elements object is empty
     */
    static #addStyles(elements) {
        if (!elements && Object.entries(elements).length <= 0) return;

        const { dialog, title, content, input, buttons, divs } = elements;

        if (dialog) {
            dialog.style.setProperty('display', 'block', 'important');
            dialog.style.setProperty('justify-self', 'center', 'important');
            dialog.style.setProperty('align-self', 'center', 'important');
            dialog.style.setProperty('border', 'none', 'important');
            dialog.style.setProperty('border-radius', '10px', 'important');
            dialog.style.setProperty('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)', 'important');
            dialog.style.setProperty('margin', 'auto', 'important');
            dialog.style.setProperty('padding', '15px', 'important');
            dialog.style.setProperty('min-width', '300px', 'important');
            dialog.style.setProperty('min-height', '150px', 'important');
            dialog.style.setProperty('max-width', '50vw', 'important');
            dialog.style.setProperty('max-height', '85vh', 'important');
            dialog.style.setProperty('box-sizing', 'border-box', 'important');
            dialog.style.setProperty('font-family', 'Arial, sans-serif', 'important');
            dialog.style.setProperty('background-color', '#f9f9f9', 'important');
            dialog.style.setProperty('overflow-y', 'auto', 'important');
            dialog.style.setProperty('overflow-x', 'hidden', 'important');
            dialog.style.setProperty('animation', 'fade-in 0.3s ease', 'important');
            dialog.style.setProperty('animation-fill-mode', 'forwards', 'important');
        }

        if (title) {
            title.style.setProperty('width', 'auto', 'important');
            title.style.setProperty('height', 'auto', 'important');
            title.style.setProperty('box-sizing', 'unset', 'important');
            title.style.setProperty('padding', '0', 'important');
            title.style.setProperty('margin', '0 0 20px 0', 'important');
            title.style.setProperty('font-size', '1.5em', 'important');
            title.style.setProperty('color', '#333', 'important');
            title.style.setProperty('font-weight', 'bold', 'important');
        }
    
        if (content) {
            content.style.setProperty('width', 'auto', 'important');
            content.style.setProperty('height', 'auto', 'important');
            content.style.setProperty('box-sizing', 'unset', 'important');
            content.style.setProperty('border-radius', '8px', 'important');
            content.style.setProperty('max-height', '300px', 'important');
            content.style.setProperty('padding', '0', 'important');
            content.style.setProperty('margin', '10px 0', 'important');
            content.style.setProperty('color', '#555', 'important');
            content.style.setProperty('overflow-y', 'auto', 'important');
            content.style.setProperty('scroll-behavior', 'smooth');
            content.style.setProperty('overflow-wrap', 'break-word', 'important');
        }
    
        if (input) {
            input.addEventListener('focus', () => {
                input.style.setProperty('outline', '2px solid rgba(204, 204, 204, 0.5)', 'important');
                input.style.setProperty('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)', 'important');
            });

            input.addEventListener('blur', () => {
                input.style.removeProperty('outline');
                input.style.removeProperty('box-shadow');
            });

            input.style.setProperty('width', '100%', 'important');
            input.style.setProperty('height', 'auto', 'important');
            input.style.setProperty('font-family', 'Arial, sans-serif', 'important');
            input.style.setProperty('box-sizing', 'unset', 'important');
            input.style.setProperty('padding', '8px', 'important');
            input.style.setProperty('margin', '0', 'important');
            input.style.setProperty('font-size', 'small', 'important');
            input.style.setProperty('border', '1px solid #ccc', 'important');
            input.style.setProperty('border-radius', '4px', 'important');
        }
        
        if (buttons) {
            for (const button of Object.values(buttons)) {
                button.style.setProperty('user-select', 'none', 'important');
                button.style.setProperty('background-color', '#adb5bd', 'important');
                button.style.setProperty('width', '100%', 'important');
                button.style.setProperty('height', 'auto', 'important');
                button.style.setProperty('box-sizing', 'unset', 'important');
                button.style.setProperty('padding', '8px 16px', 'important');
                button.style.setProperty('margin', '0', 'important');
                button.style.setProperty('font-size', 'small', 'important');
                button.style.setProperty('border', 'none', 'important');
                button.style.setProperty('border-radius', '4px', 'important');
                button.style.setProperty('color', '#fff', 'important');
                button.style.setProperty('cursor', 'pointer', 'important');
                button.style.setProperty('transition', 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out', 'important');

                button.addEventListener('mouseover', () => {
                    button.style.setProperty('background-color', '#495057', 'important');
                    button.style.setProperty('outline', '1px solid rgba(173, 181, 189, 0.5)', 'important');
                    button.style.setProperty('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)', 'important');
                });
            
                button.addEventListener('mouseout', () => {
                    button.style.setProperty('background-color', '#adb5bd', 'important');
                    button.style.removeProperty('outline');
                    button.style.removeProperty('box-shadow');
                });

                button.addEventListener('focus', () => {
                    button.style.setProperty('outline', '1px solid rgba(173, 181, 189, 0.5)', 'important');
                    button.style.setProperty('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)', 'important');
                });

                button.addEventListener('blur', () => {
                    button.style.removeProperty('outline');
                    button.style.removeProperty('box-shadow');
                });
            }
        }
    
        const { dialogHeader, dialogForm, dialogInputContainer, dialogButtonContainer } = divs;

        if (dialogHeader) {
            dialogHeader.style.setProperty('width', '100%', 'important');
            dialogHeader.style.setProperty('height', 'auto', 'important');
            dialogHeader.style.setProperty('box-sizing', 'unset', 'important');
            dialogHeader.style.setProperty('padding', '0', 'important');
            dialogHeader.style.setProperty('margin', '0', 'important');
            dialogHeader.style.setProperty('border-bottom', '1px solid #ccc', 'important');
            dialogHeader.style.setProperty('margin-bottom', '20px', 'important');
        }
    
        if (dialogForm) {
            dialogForm.style.setProperty('width', '100%', 'important');
            dialogForm.style.setProperty('height', 'auto', 'important');
            dialogForm.style.setProperty('box-sizing', 'unset', 'important');
            dialogForm.style.setProperty('padding', '0', 'important');
            dialogForm.style.setProperty('margin', '0', 'important');
        }
    
        if (dialogInputContainer) {
            dialogInputContainer.style.setProperty('width', '100%', 'important');
            dialogInputContainer.style.setProperty('height', 'auto', 'important');
            dialogInputContainer.style.setProperty('box-sizing', 'unset', 'important');
            dialogInputContainer.style.setProperty('padding', '0', 'important');
            dialogInputContainer.style.setProperty('margin', '0', 'important');
            dialogInputContainer.style.setProperty('display', 'flex', 'important');
            dialogInputContainer.style.setProperty('justify-content', 'center', 'important');
            dialogInputContainer.style.setProperty('margin-bottom', '20px', 'important');
        }

        if (dialogButtonContainer) {
            dialogButtonContainer.style.setProperty('width', '100%', 'important');
            dialogButtonContainer.style.setProperty('height', 'auto', 'important');
            dialogButtonContainer.style.setProperty('box-sizing', 'unset', 'important');
            dialogButtonContainer.style.setProperty('padding', '0', 'important');
            dialogButtonContainer.style.setProperty('margin', '0', 'important');
            dialogButtonContainer.style.setProperty('display', 'flex', 'important');
            dialogButtonContainer.style.setProperty('justify-content', 'space-between', 'important');
            dialogButtonContainer.style.setProperty('gap', '4px', 'important');
        }
    
        this.#addScrollbarStyles();
        this.#addDialogAnimationStyle();
    }    
    
    /**
     * Responsible for styling scrollbar
     */
    static #addScrollbarStyles() {
        // Inject a <style> tag for pseudo-element rules
        let styleTag = document.getElementById('dialog-scrollbar-style');

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dialog-scrollbar-style';
            document.head.appendChild(styleTag);
        } else {
            return;
        }
    
        styleTag.textContent = `
            dialog::-webkit-scrollbar,
            dialog .scrollableDialogContent::-webkit-scrollbar,
            #plainDialog  .scrollableDialogContent::-webkit-scrollbar {
                width: 5px !important;
            }

            dialog::-webkit-scrollbar-track,
            dialog .scrollableDialogContent::-webkit-scrollbar-track,
            #plainDialog  .scrollableDialogContent::-webkit-scrollbar-track {
                display: none !important;
            }

            dialog::-webkit-scrollbar-thumb,
            dialog .scrollableDialogContent::-webkit-scrollbar-thumb,
            #plainDialog  .scrollableDialogContent::-webkit-scrollbar-thumb {
                background-color: #888 !important;
                border-radius: 10px !important;
            }

            dialog::-webkit-scrollbar-thumb:hover,
            dialog .scrollableDialogContent::-webkit-scrollbar-thumb:hover,
            #plainDialog  .scrollableDialogContent::-webkit-scrollbar-thumb:hover {
                background-color: #555 !important;
            }

            dialog::-webkit-scrollbar-button,
            dialog .scrollableDialogContent::-webkit-scrollbar-button,
            #plainDialog .scrollableDialogContent::-webkit-scrollbar-button {
                display: none !important;
            }
        `;
    }

    /**
     * Responsible for styling animations
     */
    static #addDialogAnimationStyle() {
        // Inject a <style> tag for pseudo-element rules
        let styleTag = document.getElementById('dialog-animation-style');

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dialog-animation-style';
            document.head.appendChild(styleTag);
        } else {
            return;
        }
    
        styleTag.textContent = `
            #plainDialogBackdrop.fade-in, #plainDialog.fade-in {
                animation: fade-in 0.3s ease forwards;
            }

            #plainDialogBackdrop.fade-out, #plainDialog.fade-out {
                animation: fade-out 0.3s ease forwards;
            }
            
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fade-out {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
    }
}