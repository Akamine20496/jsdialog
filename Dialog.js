/**
 * JSDialog by: Akamine20496
 * 
 * This is a class with `promise-based` function where it imitates
 * native dialogs in desktop and they require waiting for user input 
 * upon invoking this functions (excluding Message Dialog, Plain Dialog, and Instruction Dialog).
 * 
 * Message Dialog, Plain Dialog, and Instruction Dialog can be used without the `await` keyword, 
 * but not Input Dialog, Confirm Dialog, because they require waiting for user input.
 */
class Dialog {
    /**
     * State of OK (0)
     */
    static OK_OPTION = 0;
    /**
     * State of CANCEL (1)
     */
    static CANCEL_OPTION = 1;
    /**
     * State of YES (2)
     */
    static YES_OPTION = 2;
    /**
     * State of NO (3)
     */
    static NO_OPTION = 3;

    /**
     * Make the static variables immutable and declare css design
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

        this.#addScrollbarStyles();
        this.#addDialogAnimationStyle();
    }

    // Queue to avoid overlapping dialogs.
    static #dialogQueue = Promise.resolve();

    // Predefined default event styles (can be overridden via customDialogStyle.eventStyles).
    static #defaultEventStyles = {
        dialog: {
            mouseover: { 
                "box-shadow": "0 6px 12px rgba(0, 0, 0, 0.3)" 
            },
            mouseout: { 
                "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)" 
            },
        },
        button: {
            mouseover: { 
                "background-color": "#495057",
                "outline": "1px solid rgba(173, 181, 189, 0.5)",
                "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)"
            },
            mouseout: { 
                "background-color": "#adb5bd",
                "outline": "none",
                "box-shadow": "none"
            },
            focus: { 
                "outline": "1px solid rgba(173, 181, 189, 0.5)", 
                "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)" 
            },
            blur: { 
                "outline": "none", 
                "box-shadow": "none" 
            }
        }
    };

    /**
     * Removes all HTML elements from the string.
     * @param {string} str 
     * @returns {string} The sanitized string.
     */
    static #sanitizeInput(str) {
        return str.replace(/<[^>]*>/g, '');
    }

    // Checks if the provided string contains HTML.
    static #hasHTMLTag(str) {
        return /<[^>]*>/g.test(str);
    }

    /**
     * Injects custom scrollbar styles.
     */
    static #addScrollbarStyles() {
        let styleTag = document.getElementById('dialog-scrollbar-style');

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dialog-scrollbar-style';
            document.head.appendChild(styleTag);
        } else { return; }

        styleTag.textContent = /*css*/`
            dialog::-webkit-scrollbar,
            dialog .scrollableDialogContent::-webkit-scrollbar,
            #plainDialog .scrollableDialogContent::-webkit-scrollbar {
                width: 5px !important;
            }
            dialog::-webkit-scrollbar-track,
            dialog .scrollableDialogContent::-webkit-scrollbar-track,
            #plainDialog .scrollableDialogContent::-webkit-scrollbar-track {
                display: none !important;
            }
            dialog::-webkit-scrollbar-thumb,
            dialog .scrollableDialogContent::-webkit-scrollbar-thumb,
            #plainDialog .scrollableDialogContent::-webkit-scrollbar-thumb {
                background-color: #888 !important;
                border-radius: 10px !important;
            }
            dialog::-webkit-scrollbar-thumb:hover,
            dialog .scrollableDialogContent::-webkit-scrollbar-thumb:hover,
            #plainDialog .scrollableDialogContent::-webkit-scrollbar-thumb:hover {
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
     * Injects dialog animation styles.
     */
    static #addDialogAnimationStyle() {
        let styleTag = document.getElementById('dialog-animation-style');

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dialog-animation-style';
            document.head.appendChild(styleTag);
        } else { return; }

        styleTag.textContent = /*css*/`
            #plainDialogBackdrop.fade-in, #plainDialog.fade-in {
                animation: fade-in 0.3s ease forwards !important;
            }
            #plainDialogBackdrop.fade-out, #plainDialog.fade-out {
                animation: fade-out 0.3s ease forwards !important;
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

    /**
     * Internal builder that creates a dialog based on the internal config.
     * The config structure is fixed (header, content, footer, eventStyles) and
     * is built internally within each public method.
     *
     * @param {Object} config - The dialog configuration.
     * @param {boolean} isPlain - If true, builds a plain dialog (using div/backdrop).
     * @returns {Function} A closure that shows the dialog and returns a Promise.
     */
    static #buildDialogWrapper(config, isPlain = false) {
        // Helper to attach event styles from config.eventStyles for a given key.
        function applyEventStyles(element, key) {
            if (config.eventStyles && config.eventStyles[key]) {
                for (const [eventName, styles] of Object.entries(config.eventStyles[key])) {
                    for (const [key, value] of Object.entries(styles)) {
                        element.addEventListener(eventName, () => element.style.setProperty(key, value, 'important'));
                    }
                }
            }
        }

        // Helper to attach element styles from config or local
        function applyElementStyles(element, styles) {
            if (element && Object.keys(styles).length > 0) {
                for (const [styleName, styleValue] of Object.entries(styles)) {
                    element.style.setProperty(styleName, styleValue, 'important');
                }
            }
        }

        return () => {
            return new Promise((resolve) => {
                if (isPlain) {
                    // --- Plain dialog ---
                    const backdrop = document.createElement('div');

                    backdrop.id = config.backdrop.id || 'backdrop';
                    backdrop.className = 'fade-in';

                    applyElementStyles(backdrop, Object.assign({
                        "display": "none",
                        "position": "fixed",
                        "top": "0",
                        "left": "0",
                        "width": "100vw",
                        "height": "100vh",
                        "background-color": "rgba(0, 0, 0, 0.1)",
                        "z-index": "9999",
                        "overflow-y": "auto",
                        "overflow-x": "hidden",
                        "margin": "0",
                        "padding": "0",
                        "box-sizing": "border-box",
                        "opacity": "0",
                        "justify-content": "center",
                        "align-items": "center"
                    }, config.backdrop.style));
                    applyEventStyles(backdrop, "backdrop");

                    document.body.prepend(backdrop);

                    // dialog
                    const dlg = document.createElement('div');

                    dlg.id = config.dialog.id || "modalDialog";
                    dlg.className = 'fade-in';

                    applyElementStyles(dlg, Object.assign({
                        "margin": "auto",
                        "padding": "0",
                        "border-radius": "10px",
                        "box-shadow": "0 6px 12px rgba(0, 0, 0, 0.2)",
                        "max-width": "50vw",
                        "max-height": "85vh",
                        "min-width": "300px",
                        "min-height": "150px",
                        "box-sizing": "border-box",
                        "background-color": "#f9f9f9",
                        "display": "flex",
                        "flex-direction": "column",
                        "opacity": "0",
                        "overflow-y": "auto",
                        "overflow-x": "hidden",
                        "font-family": "Arial, sans-serif"
                    }, config.dialog.style));
                    applyEventStyles(dlg, "dialog");

                    // header.
                    if (config.header) {
                        const header = document.createElement(config.header.tag || 'div');

                        if (config.header.id) 
                            header.id = config.header.id;

                        applyElementStyles(header, Object.assign({
                            "width": "auto",
                            "height": "auto",
                            "box-sizing": "unset",
                            "padding": "0",
                            "margin": "0",
                            "flex": "0 0 20%",
                            "display": "flex",
                            "align-items": "center",
                            "justify-content": "flex-end"
                        }, config.header.style));
                        applyEventStyles(header, "header");

                        if (config.header.closeButton) {
                            const closeBtn = document.createElement(config.header.closeButton.tag || 'button');

                            if (config.header.closeButton.id) {
                                closeBtn.id = config.header.closeButton.id;
                            }

                            closeBtn.innerText = config.header.closeButton.text || '×';

                            applyElementStyles(closeBtn, Object.assign({
                                "user-select": "none",
                                "font-family": "Arial, sans-serif",
                                "width": "20px",
                                "height": "auto",
                                "box-sizing": "unset",
                                "font-size": "1.250rem",
                                "text-align": "center",
                                "background-color": "#adb5bd",
                                "margin": "0",
                                "padding": "8px 16px",
                                "border": "none",
                                "border-radius": "4px",
                                "color": "#fff",
                                "transition": "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                            }, config.header.closeButton.style));
                            applyEventStyles(closeBtn, "button");

                            // apply custom event styles
                            if (config.header.closeButton.id)
                                applyEventStyles(closeBtn, '#' + config.header.closeButton.id);

                            closeBtn.addEventListener('click', () => {
                                dlg.style.setProperty("opacity", "0", "important");
                                backdrop.style.setProperty("opacity", "0", "important");

                                setTimeout(() => { backdrop.remove(); resolve(); }, 300);
                            });

                            header.appendChild(closeBtn);
                        }

                        dlg.appendChild(header);
                    }

                    // Content.
                    if (config.content) {
                        const content = document.createElement(config.content.tag || 'div');

                        if (config.content.id) 
                            content.id = config.content.id;

                        content.className = 'scrollableDialogContent';

                        content[this.#hasHTMLTag(config.content.text) ? 'innerHTML' : 'innerText'] = config.content.text;
                        
                        applyElementStyles(content, Object.assign({
                            "width": "auto",
                            "height": "auto",
                            "background-color": "rgba(221, 216, 216, 0.26)",
                            "border-radius": "8px",
                            "flex": "1 1 auto",
                            "max-height": "calc(100% - 20%)",
                            "overflow-y": "auto",
                            "padding": "4px 5px",
                            "margin": "2px 10px 10px 10px",
                            "color": "#555",
                            "scroll-behavior": "smooth",
                            "box-sizing": "unset",
                            "overflow-wrap": "break-word"
                        }, config.content.style));
                        applyEventStyles(content, "content");

                        dlg.appendChild(content);
                    }

                    backdrop.appendChild(dlg);
                    backdrop.style.setProperty("display", "flex", "important");

                    setTimeout(() => {
                        backdrop.style.setProperty("opacity", "1", "important");
                        dlg.style.setProperty("opacity", "1", "important");
                    }, 10);
                } else {
                    // --- Modal dialog (using <dialog>) ---
                    const dlg = document.createElement('dialog');

                    dlg.id = config.dialog.id || "modalDialog";

                    applyElementStyles(dlg, Object.assign({
                        "display": "block",
                        "border": "none",
                        "border-radius": "10px",
                        "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)",
                        "margin": "auto",
                        "padding": "15px",
                        "min-width": "300px",
                        "min-height": "150px",
                        "max-width": "50vw",
                        "max-height": "85vh",
                        "box-sizing": "border-box",
                        "font-family": "Arial, sans-serif",
                        "background-color": "#f9f9f9",
                        "overflow-y": "auto",
                        "overflow-x": "hidden",
                        "animation": "fade-in 0.3s ease",
                        "animation-fill-mode": "forwards"
                    }, config.dialog.style));
                    applyEventStyles(dlg, "dialog");

                    // Header.
                    if (config.header) {
                        const header = document.createElement(config.header.tag || 'div');

                        if (config.header.id) 
                            header.id = config.header.id;

                        applyElementStyles(header, Object.assign({
                            "width": "100%",
                            "height": "auto",
                            "box-sizing": "unset",
                            "padding": "0",
                            "margin": "0 0 10px 0",
                            "margin-bottom": "10px"
                        }, config.header.style));
                        applyEventStyles(header, "header");

                        if (config.header.title) {
                            const title = document.createElement(config.header.title.tag || 'h4');

                            if (config.header.title.id) 
                                title.id = config.header.title.id;

                            title.innerText = config.header.title.text;

                            applyElementStyles(title, Object.assign({
                                "width": "auto",
                                "height": "auto",
                                "box-sizing": "unset",
                                "padding": "0",
                                "margin": "0",
                                "font-size": "1.5rem",
                                "color": "#333",
                                "font-weight": "bold"
                            }, config.header.title.style));

                            header.appendChild(title);
                        }

                        dlg.appendChild(header);
                    }

                    // Content.
                    if (config.content) {
                        const content = document.createElement(config.content.tag || 'div');

                        if (config.content.id) 
                            content.id = config.content.id;

                        content.className = 'scrollableDialogContent';

                        content[this.#hasHTMLTag(config.content.text) ? 'innerHTML' : 'innerText'] = config.content.text;

                        applyElementStyles(content, Object.assign({
                            "width": "auto",
                            "height": "auto",
                            "background-color": "rgba(221, 216, 216, 0.26)",
                            "box-sizing": "unset",
                            "border-radius": "8px",
                            "min-height": "50px",
                            "max-height": "300px",
                            "padding": "4px 5px",
                            "margin": "0 0 20px 0",
                            "border-bottom": "1px solid #ccc",
                            "color": "#555",
                            "overflow-y": "auto",
                            "scroll-behavior": "smooth",
                            "overflow-wrap": "break-word"
                        }, config.content.style));
                        applyEventStyles(content, "content");

                        dlg.appendChild(content);
                    }

                    // Optional input.
                    if (config.input) {
                        const inputForm = document.createElement('form');

                        applyElementStyles(inputForm, {
                            "width": "100%",
                            "height": "auto",
                            "display": "flex",
                            "box-sizing": "unset",
                            "padding": "0",
                            "margin": "0 0 20px 0"
                        });

                        const input = document.createElement('input');

                        if (config.input.id) 
                            input.id = config.input.id;

                        input.type = config.input.type || "text";

                        applyElementStyles(input, Object.assign({
                            "width": "100%",
                            "height": "30px",
                            "font-family": "Arial, sans-serif",
                            "box-sizing": "unset",
                            "padding": "0 4px",
                            "margin": "0",
                            "font-size": "small",
                            "border": "1px solid #ccc",
                            "border-radius": "4px"
                        }, config.input.style));
                        applyEventStyles(input, "input");

                        function handleSubmit(e) {
                            e.preventDefault();

                            const inputData = { output: null };
                            inputData.option = config.footer.buttons[0].option;
                            inputData.output = input.value ? Dialog.#sanitizeInput(input.value) : null;

                            inputForm.removeEventListener('submit', handleSubmit);

                            dlg.close();
                            resolve(inputData);
                            dlg.remove();
                        }

                        inputForm.addEventListener('submit', handleSubmit);

                        inputForm.appendChild(input);
                        dlg.appendChild(inputForm);
                    }

                    // Footer.
                    if (config.footer && Array.isArray(config.footer.buttons)) {
                        const footer = document.createElement(config.footer.tag || 'div');

                        if (config.footer.id) 
                            footer.id = config.footer.id;
                        
                        applyElementStyles(footer, Object.assign({
                            "width": "100%",
                            "height": "auto",
                            "box-sizing": "unset",
                            "padding": "0",
                            "display": "flex",
                            "justify-content": "space-between",
                            "gap": "4px"
                        }, config.footer.style));
                        applyEventStyles(footer, "footer");

                        const btnCount = config.footer.buttons.length;

                        for (const btnConf of config.footer.buttons) {
                            const btn = document.createElement(btnConf.tag || 'button');
                            btn.type = btnConf.id === 'inputDialogBtnOk' ? 'submit' : 'button';

                            if (btnConf.id)
                                btn.id = btnConf.id;

                            btn.innerText = btnConf.text;

                            if (btnCount === 1) {
                                btn.style.setProperty("width", "100%", "important");
                            } else if (btnCount === 2) {
                                btn.style.setProperty("width", "48%", "important");
                                btn.style.setProperty("margin", "1%", "important");
                            } else {
                                btn.style.setProperty("flex", "1", "important");
                                btn.style.setProperty("margin", "0 4px", "important");
                            }

                            applyElementStyles(btn, Object.assign({
                                "user-select": "none",
                                "background-color": "#adb5bd",
                                "width": "100%",
                                "height": "auto",
                                "box-sizing": "unset",
                                "padding": "8px 16px",
                                "margin": "0",
                                "font-size": "small",
                                "border": "none",
                                "border-radius": "4px",
                                "color": "#fff",
                                "transition": "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                            }, btnConf.style));
                            applyEventStyles(btn, "button");

                            // apply custom event style
                            if (btnConf.id)
                                applyEventStyles(btn, '#' + btnConf.id);

                            btn.addEventListener('click', (e) => {
                                if (config.dialog.id === 'inputDialog' && btnConf.id === 'inputDialogBtnOk') {
                                    const dialog = e.target.closest('dialog'); // get the parent (dialog)
                                    const form = dialog.querySelector('form'); // get the form element
                                    form.dispatchEvent(new Event('submit')); // invoke submit event

                                    return;
                                }

                                const inputData = { output: null };
                                inputData.option = btnConf.option;

                                if (btnConf.callback && typeof btnConf.callback === 'function')
                                    btnConf.callback(e);

                                // For instruction dialogs, if the button is marked as navigation, do not close.
                                if (config.instructionDialog && btnConf.navigation === true) return;

                                dlg.close();
                                resolve(inputData);
                                dlg.remove();
                            });
                            
                            footer.appendChild(btn);
                        }

                        dlg.appendChild(footer);
                    }

                    document.body.prepend(dlg);
                    if (!dlg.open) dlg.showModal();
                }
            });
        };
    }

    /**
     * method of Dialog Class that allows user input
     * @param {string} dialogTitle Title of the dialog (only plain text)
     * @param {string} dialogContent Content of the dialog for user to see (allows element tags)
     * @param {Object} customDialogStyle - Optional custom styles (including eventStyles).
     * @returns {Promise<Object>} Resolves when the dialog is closed. `{ output: input.value, option: 0 - Ok, 1 - Cancel }`
     */
    static async showInputDialog(dialogTitle, dialogContent, customDialogStyle = {}) {
        const mergedEventStyles = Object.assign({
            input: {
                focus: {
                    "outline": "2px solid rgba(204, 204, 204, 0.5)",
                    "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
                blur: {
                    "outline": "none",
                    "box-shadow": "none"
                }
            }
        }, this.#defaultEventStyles, customDialogStyle?.eventStyles || {});

        const config = {
            dialog: {
                id: 'inputDialog',
                style: customDialogStyle?.dialog || {}
            },
            header: {
                tag: 'header',
                id: 'inputDialogHeader',
                style: customDialogStyle?.header || {},
                title: {
                    tag: 'h4',
                    id: 'inputDialogTitle',
                    text: dialogTitle,
                    style: customDialogStyle?.title || {}
                }
            },
            content: {
                tag: 'main',
                id: 'inputDialogContent',
                text: dialogContent,
                style: customDialogStyle?.content || {}
            },
            input: {
                id: 'inputDialogInput',
                type: 'text',
                style: customDialogStyle?.input || {}
            },
            footer: {
                tag: 'footer',
                id: 'inputDialogFooter',
                style: customDialogStyle?.footer || {},
                buttons: [
                    {
                        tag: 'button',
                        id: 'inputDialogBtnOk',
                        text: 'OK',
                        style: customDialogStyle?.btnOk || {},
                        option: this.OK_OPTION
                    },
                    {
                        tag: 'button',
                        id: 'inputDialogBtnCancel',
                        text: 'Cancel',
                        style: customDialogStyle?.btnCancel || {},
                        option: this.CANCEL_OPTION
                    }
                ]
            },
            eventStyles: mergedEventStyles
        };

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, false);

        this.#dialogQueue = showFn();

        return await this.#dialogQueue;
    }

    /**
     * method of Dialog Class that shows information message
     * @param {string} dialogTitle Title of the dialog (only plain text)
     * @param {string} dialogContent Content of the dialog for user to see (allows element tags)
     * @param {Object} customDialogStyle - Optional custom styles (including eventStyles).
     * @returns {Promise} Resolves when the dialog is closed.
     */
    static async showMessageDialog(dialogTitle, dialogContent, customDialogStyle = {}) {
        const mergedEventStyles = Object.assign({}, this.#defaultEventStyles, customDialogStyle?.eventStyles || {});

        const config = {
            dialog: {
                id: 'messageDialog',
                style: customDialogStyle?.dialog || {}
            },
            header: {
                tag: 'header',
                id: 'messageDialogHeader',
                style: customDialogStyle?.header || {},
                title: {
                    tag: 'h4',
                    id: 'messageDialogTitle',
                    text: dialogTitle,
                    style: customDialogStyle?.title || {}
                }
            },
            content: {
                tag: 'main',
                id: 'messageDialogContent',
                text: dialogContent,
                style: customDialogStyle?.content || {}
            },
            footer: {
                tag: 'footer',
                id: 'messageDialogFooter',
                style: customDialogStyle?.footer || {},
                buttons: [
                    {
                        tag: 'button',
                        id: 'messageDialogBtnOk',
                        text: 'OK',
                        style: customDialogStyle?.btnOk || {},
                        option: this.OK_OPTION
                    }
                ]
            },
            eventStyles: mergedEventStyles
        };

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, false);

        this.#dialogQueue = showFn();

        return await this.#dialogQueue;
    }

    /**
     * Method of Dialog Class that asks for YES or NO answer
     * @param {string} dialogTitle Title of the dialog (only plain text)
     * @param {string} dialogContent Content of the dialog for user to see (allows element tags)
     * @param {Object} customDialogStyle - Optional custom styles (including eventStyles).
     * @returns {Promise<Object>} Resolves when the dialog is closed. `{ output: null, option: 2 - Yes, 3 - No }`
     */
    static async showConfirmDialog(dialogTitle, dialogContent, customDialogStyle = {}) {
        const mergedEventStyles = Object.assign({}, this.#defaultEventStyles, customDialogStyle?.eventStyles || {});

        const config = {
            dialog: {
                id: 'confirmDialog',
                style: customDialogStyle?.dialog || {}
            },
            header: {
                tag: 'header',
                id: 'confirmDialogHeader',
                style: customDialogStyle?.header || {},
                title: {
                    tag: 'h4',
                    id: 'confirmDialogTitle',
                    text: dialogTitle,
                    style: customDialogStyle?.title || {}
                }
            },
            content: {
                tag: 'main',
                id: 'confirmDialogContent',
                text: dialogContent,
                style: customDialogStyle?.content || {}
            },
            footer: {
                tag: 'footer',
                id: 'confirmDialogFooter',
                style: customDialogStyle?.footer || {},
                buttons: [
                    {
                        tag: 'button',
                        id: 'confirmDialogBtnYes',
                        text: 'Yes',
                        style: customDialogStyle?.btnYes || {},
                        option: this.YES_OPTION
                    },
                    {
                        tag: 'button',
                        id: 'confirmDialogBtnNo',
                        text: 'No',
                        style: customDialogStyle?.btnNo || {},
                        option: this.NO_OPTION
                    }
                ]
            },
            eventStyles: mergedEventStyles
        };

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, false);

        this.#dialogQueue = showFn();

        return await this.#dialogQueue;
    }

    /**
     * Method of Dialog Class that shows information message and this is customizable
     * @param {string} dialogContent Content of the dialog for user to see (allows element tags)
     * @param {Object} customDialogStyle - Optional custom styles (including eventStyles).
     * @returns {Promise} Resolves when the dialog is closed.
     */
    static async showPlainDialog(dialogContent, customDialogStyle = {}) {
        const mergedEventStyles = Object.assign({}, this.#defaultEventStyles, customDialogStyle?.eventStyles || {});

        const config = {
            backdrop: {
                id: 'plainDialogBackdrop',
                style: customDialogStyle?.backdrop || {}
            },
            dialog: { 
                id: 'plainDialog',
                style: customDialogStyle?.dialog || {}
            },
            header: {
                tag: 'div',
                id: 'plainDialogHeader',
                style: customDialogStyle?.header || {},
                closeButton: {
                    tag: 'button',
                    id: 'plainDialogBtnClose',
                    text: '×',
                    style: customDialogStyle?.btnClose || {}
                }
            },
            content: {
                tag: 'div',
                id: 'plainDialogContent',
                text: dialogContent,
                style: customDialogStyle?.content || {}
            },
            eventStyles: mergedEventStyles
        };

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, true);
        
        this.#dialogQueue = showFn();

        return await this.#dialogQueue;
    }

    /**
     * Instruction dialog that displays multiple messages (as an array of strings)
     * with pagination controls (Previous and Next). If only one message is provided,
     * a single OK button appears. On multiple messages the Next button becomes OK on
     * the final slide.
     *
     * @param {string} dialogTitle - The title of the dialog.
     * @param {Array<string>} dialogContents - Array of message strings (plaintext or HTML).
     * @param {Object} customDialogStyle - Optional custom styles (including eventStyles).
     * @returns {Promise} Resolves when the dialog is closed.
     */
    static async showInstructionDialog(dialogTitle, dialogContents, customDialogStyle = {}) {
        if (!Array.isArray(dialogContents)) {
            await this.showMessageDialog('Invalid Content', 'The contents must be array of strings.');

            return;
        }

        function validateContents(dialogContents) {
            return dialogContents.every(content => typeof content !== 'object' || content === null);
        }

        let cardHtml = null;
        let currentIndex = 0;
        const total = dialogContents.length;

        if (validateContents(dialogContents)) {
            if (total > 0) {
                // Build card HTML – each message is wrapped in a div;
                // only the first card is visible.
                cardHtml = '<div id="instructionCardContainer">';
                for (const content of dialogContents) {
                    cardHtml += `<div class="instructionCard">${content}</div>`;
                }
                cardHtml += '</div>';
            } else {
                await this.showMessageDialog('Empty content.', 'Please add content at least 1.');
    
                return;
            }
        } else {
            await this.showMessageDialog('Invalid content.', 'Include only strings.');

            return;
        }

        const mergedEventStyles = Object.assign({}, this.#defaultEventStyles, customDialogStyle?.eventStyles || {});

        const config = {
            instructionDialog: true,
            dialog: {
                id: 'instructionDialog',
                style: customDialogStyle?.dialog || {}
            },
            header: {
                tag: 'header',
                id: 'instructionDialogHeader',
                style: customDialogStyle?.header || {},
                title: {
                    tag: 'h4',
                    id: 'instructionDialogTitle',
                    text: dialogTitle + ` (${currentIndex + 1}/${total})`,
                    style: customDialogStyle?.title || {}
                }
            },
            content: {
                tag: 'main',
                id: 'instructionDialogContent',
                text: cardHtml,
                style: customDialogStyle?.content || {}
            },
            footer: {
                tag: 'footer',
                id: 'instructionDialogFooter',
                style: customDialogStyle?.footer || {},
                buttons: []
            },
            eventStyles: mergedEventStyles
        };

        // If only one message, simply add an OK button.
        if (total === 1) {
            config.footer.buttons.push({
                tag: 'button',
                id: 'instructionDialogBtnOk',
                text: 'OK',
                style: customDialogStyle?.btnOk || {},
                option: this.OK_OPTION,
                navigation: false
            });
        } else {
            config.footer.buttons.push({
                tag: 'button',
                id: 'instructionDialogBtnPrev',
                text: '< Previous',
                style: customDialogStyle?.btnPrev || {},
                option: null,
                navigation: true,
                callback: (e) => {
                    e.target.focus();

                    const title = document.getElementById('instructionDialogTitle');

                    if (currentIndex > 0) {
                        currentIndex--;
                        updateCards();
                    }

                    title.innerText = dialogTitle + ` (${currentIndex + 1}/${total})`;
                }
            }, 
            {
                tag: 'button',
                id: 'instructionDialogBtnNext',
                text: 'Next >',
                style: customDialogStyle?.btnNext || {},
                option: null,
                navigation: true,
                callback: (e) => {
                    e.target.focus();

                    const dialogElement = e.target.closest('dialog');
                    const title = document.getElementById('instructionDialogTitle');

                    if (currentIndex < total - 1) {
                        currentIndex++;
                        updateCards();

                        title.innerText = dialogTitle + ` (${currentIndex + 1}/${total})`;
                    } else if (currentIndex === total - 1) {
                        dialogElement.close();
                        dialogElement.remove();
                    }
                }
            }
            );
        }

        // Helper functions to update the card visibility and button texts.
        function updateCards() {
            const container = document.getElementById('instructionCardContainer');
            const cardChildrenContainer = container.getElementsByClassName('instructionCard');

            for (let index = 0; index < total; index++) {
                cardChildrenContainer[index].style.display = (index === currentIndex) ? 'block' : 'none';
            }

            updateButtons();
        }

        function updateButtons() {
            const btnPrev = document.getElementById('instructionDialogBtnPrev');
            const btnNext = document.getElementById('instructionDialogBtnNext');

            if (btnPrev) {
                btnPrev.style.display = (currentIndex === 0) ? 'none' : 'inline-block';
            }

            if (btnNext) {
                btnNext.innerText = (currentIndex === total - 1) ? 'OK' : 'Next >';
                // Remove navigation flag on the Next button if we're on the final card.
                btnNext.navigation = (currentIndex === total - 1) ? false : true;
            }
        }

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, false);

        this.#dialogQueue = showFn();

        updateCards();

        return await this.#dialogQueue;
    }
}