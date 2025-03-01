class Dialog {
    static OK_OPTION = 1;
    static CANCEL_OPTION = 0;
    static YES_OPTION = 1;
    static NO_OPTION = 0;

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
        backdrop: {
            mouseover: { backgroundColor: "rgba(0, 0, 0, 0.15)" },
            mouseout: { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            focus: {},
            blur: {}
        },
        dialog: {
            mouseover: { boxShadow: "0 6px 12px rgba(0,0,0,0.3)" },
            mouseout: { boxShadow: "0 4px 8px rgba(0,0,0,0.2)" },
            focus: {},
            blur: {}
        },
        button: {
            mouseover: { backgroundColor: "#495057" },
            mouseout: { backgroundColor: "#adb5bd" },
            focus: { outline: "1px solid rgba(173, 181, 189, 0.5)", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" },
            blur: { outline: "", boxShadow: "" }
        },
        content: {
            mouseover: {},
            mouseout: {},
            focus: {},
            blur: {}
        },
        footer: {
            mouseover: {},
            mouseout: {},
            focus: {},
            blur: {}
        },
        // For individual buttons (custom key based on id)
        "#btnOk": {
            mouseover: { backgroundColor: "#0d6efd" },
            mouseout: { backgroundColor: "#adb5bd" },
            focus: {},
            blur: {}
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
        styleTag.textContent = `
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
                    element.addEventListener(eventName, () => Object.assign(element.style, styles));
                }
            }
        }

        return () => {
            return new Promise((resolve) => {
                if (isPlain) {
                    // --- Plain dialog ---
                    const backdrop = document.createElement('div');
                    backdrop.id = 'plainDialogBackdrop';
                    Object.assign(backdrop.style, {
                        display: "none",
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        zIndex: "9999",
                        overflowY: "auto",
                        overflowX: "hidden",
                        margin: "0",
                        padding: "0",
                        boxSizing: "border-box",
                        opacity: "0",
                        justifyContent: "center",
                        alignItems: "center"
                    });
                    applyEventStyles(backdrop, "backdrop");
                    document.body.prepend(backdrop);

                    // Main container.
                    const container = document.createElement('div');
                    container.id = 'plainDialog';
                    Object.assign(container.style, {
                        margin: "auto",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        padding: "15px",
                        maxWidth: "50vw",
                        maxHeight: "85vh",
                        minWidth: "300px",
                        minHeight: "150px",
                        backgroundColor: "#f9f9f9",
                        display: "flex",
                        flexDirection: "column",
                        opacity: "0"
                    }, config.container?.style || {});
                    applyEventStyles(container, "dialog");

                    // Optional header.
                    if (config.header) {
                        const header = document.createElement(config.header.tag || 'div');
                        if (config.header.id) header.id = config.header.id;
                        Object.assign(header.style, config.header.style || {});
                        if (config.header.title) {
                            const title = document.createElement(config.header.title.tag || 'h4');
                            if (config.header.title.id) title.id = config.header.title.id;
                            title.innerText = config.header.title.text;
                            Object.assign(title.style, config.header.title.style || {});
                            header.appendChild(title);
                        }
                        if (config.header.closeButton) {
                            const closeBtn = document.createElement(config.header.closeButton.tag || 'button');
                            if (config.header.closeButton.id) closeBtn.id = config.header.closeButton.id;
                            closeBtn.innerText = config.header.closeButton.text || '×';
                            Object.assign(closeBtn.style, config.header.closeButton.style || {});
                            if (config.header.closeButton.id) {
                                applyEventStyles(closeBtn, '#' + config.header.closeButton.id);
                            }
                            closeBtn.addEventListener('click', () => {
                                container.style.opacity = "0";
                                backdrop.style.opacity = "0";
                                setTimeout(() => { backdrop.remove(); resolve(); }, 300);
                            });
                            header.appendChild(closeBtn);
                        }
                        container.appendChild(header);
                    }

                    // Content.
                    if (config.content) {
                        const content = document.createElement(config.content.tag || 'div');
                        if (config.content.id) content.id = config.content.id;
                        content[this.#hasHTMLTag(config.content.text) ? 'innerHTML' : 'innerText'] = config.content.text;
                        Object.assign(content.style, config.content.style || {});
                        applyEventStyles(content, "content");
                        container.appendChild(content);
                    }

                    // Optional footer.
                    if (config.footer && Array.isArray(config.footer.buttons)) {
                        const footer = document.createElement(config.footer.tag || 'div');
                        if (config.footer.id) footer.id = config.footer.id;
                        Object.assign(footer.style, config.footer.style || {});
                        applyEventStyles(footer, "footer");
                        const btnCount = config.footer.buttons.length;
                        config.footer.buttons.forEach(btnConf => {
                            const btn = document.createElement(btnConf.tag || 'button');
                            if (btnConf.id) btn.id = btnConf.id;
                            btn.innerText = btnConf.text;
                            if (btnCount === 1) {
                                btn.style.width = '100%';
                            } else if (btnCount === 2) {
                                btn.style.width = '48%';
                                btn.style.margin = '1%';
                            } else {
                                btn.style.flex = '1';
                                btn.style.margin = '0 4px';
                            }
                            Object.assign(btn.style, btnConf.style || {});
                            applyEventStyles(btn, "button");
                            if (btnConf.id) applyEventStyles(btn, '#' + btnConf.id);
                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                let output = null;
                                if (config.input) {
                                    output = config.inputElem ? this.#sanitizeInput(config.inputElem.value) : null;
                                }
                                const result = btnConf.option || null;
                                if (typeof btnConf.callback === 'function') {
                                    btnConf.callback(e, result);
                                }
                                container.style.opacity = "0";
                                backdrop.style.opacity = "0";
                                setTimeout(() => { backdrop.remove(); resolve(result); }, 300);
                            });
                            footer.appendChild(btn);
                        });
                        container.appendChild(footer);
                    }

                    backdrop.appendChild(container);
                    backdrop.style.display = "flex";
                    setTimeout(() => {
                        backdrop.style.opacity = "1";
                        container.style.opacity = "1";
                    }, 10);
                } else {
                    // --- Modal dialog (using <dialog>) ---
                    const dlg = document.createElement('dialog');
                    dlg.id = config.dialogId || "modalDialog";
                    Object.assign(dlg.style, {
                        display: "block",
                        border: "none",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        margin: "auto",
                        padding: "15px",
                        minWidth: "300px",
                        minHeight: "150px",
                        maxWidth: "50vw",
                        maxHeight: "85vh",
                        boxSizing: "border-box",
                        fontFamily: "Arial, sans-serif",
                        backgroundColor: "#f9f9f9",
                        overflowY: "auto",
                        overflowX: "hidden",
                        animation: "fade-in 0.3s ease",
                        animationFillMode: "forwards"
                    }, config.dialogStyle || {});
                    applyEventStyles(dlg, "dialog");

                    // Header.
                    if (config.header) {
                        const header = document.createElement(config.header.tag || 'div');
                        if (config.header.id) header.id = config.header.id;
                        Object.assign(header.style, config.header.style || {});
                        if (config.header.title) {
                            const title = document.createElement(config.header.title.tag || 'h4');
                            if (config.header.title.id) title.id = config.header.title.id;
                            title.innerText = config.header.title.text;
                            Object.assign(title.style, config.header.title.style || {});
                            header.appendChild(title);
                        }
                        if (config.header.closeButton) {
                            const closeBtn = document.createElement(config.header.closeButton.tag || 'button');
                            if (config.header.closeButton.id) closeBtn.id = config.header.closeButton.id;
                            closeBtn.innerText = config.header.closeButton.text || '×';
                            Object.assign(closeBtn.style, config.header.closeButton.style || {});
                            if (config.header.closeButton.id) {
                                applyEventStyles(closeBtn, '#' + config.header.closeButton.id);
                            }
                            closeBtn.addEventListener('click', () => {
                                dlg.close();
                                dlg.remove();
                                resolve();
                            });
                            header.appendChild(closeBtn);
                        }
                        dlg.appendChild(header);
                    }

                    // Content.
                    if (config.content) {
                        const content = document.createElement(config.content.tag || 'div');
                        if (config.content.id) content.id = config.content.id;
                        content[this.#hasHTMLTag(config.content.text) ? 'innerHTML' : 'innerText'] = config.content.text;
                        Object.assign(content.style, config.content.style || {});
                        applyEventStyles(content, "content");
                        dlg.appendChild(content);
                    }

                    // Optional input.
                    if (config.input) {
                        const inputElem = document.createElement(config.input.tag || 'input');
                        if (config.input.id) inputElem.id = config.input.id;
                        inputElem.type = config.input.type || "text";
                        Object.assign(inputElem.style, config.input.style || {});
                        dlg.appendChild(inputElem);
                        config.inputElem = inputElem;

                        function handleSubmit(e) {
                            if (e.key === 'Enter' && e.target === inputElem) {
                                const dialog = e.target.closest('dialog');
                                const button = dialog.querySelector('#btnOk');
                                button.dispatchEvent(new Event('click'));
                                document.removeEventListener('keyup', handleSubmit);
                            }
                        }

                        document.addEventListener('keyup', handleSubmit);
                    }

                    // Footer.
                    if (config.footer && Array.isArray(config.footer.buttons)) {
                        const footer = document.createElement(config.footer.tag || 'div');
                        if (config.footer.id) footer.id = config.footer.id;
                        Object.assign(footer.style, config.footer.style || {});
                        applyEventStyles(footer, "footer");
                        const btnCount = config.footer.buttons.length;
                        config.footer.buttons.forEach(btnConf => {
                            const btn = document.createElement(btnConf.tag || 'button');
                            if (btnConf.id) btn.id = btnConf.id;
                            btn.innerText = btnConf.text;
                            if (btnCount === 1) {
                                btn.style.width = '100%';
                            } else if (btnCount === 2) {
                                btn.style.width = '48%';
                                btn.style.margin = '1%';
                            } else {
                                btn.style.flex = '1';
                                btn.style.margin = '0 4px';
                            }
                            Object.assign(btn.style, btnConf.style || {});
                            applyEventStyles(btn, "button");
                            if (btnConf.id) {
                                applyEventStyles(btn, '#' + btnConf.id);
                            }
                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                const inputData = { output: null };
                                if (config.input) {
                                    inputData.output = config.inputElem ? this.#sanitizeInput(config.inputElem.value) : null;
                                }
                                inputData.option = btnConf.option || null;
                                if (typeof btnConf.callback === 'function') {
                                    btnConf.callback(e, inputData);
                                }

                                // For instruction dialogs, if the button is marked as navigation, do not close.
                                if (config.instructionDialog && btnConf.navigation === true) {
                                    return;
                                }

                                dlg.close();
                                dlg.remove();
                                resolve(inputData);
                            });
                            footer.appendChild(btn);
                        });
                        dlg.appendChild(footer);
                    }

                    document.body.prepend(dlg);
                    if (!dlg.open) dlg.showModal();
                }
            });
        };
    }

    // PUBLIC API – the configuration is built internally.

    // 1. Input this: Accepts a title and content.
    static async showInputDialog(dialogTitle, dialogContent, customDialogStyle = {}) {
        const mergedEventStyles = Object.assign({}, this.#defaultEventStyles, customDialogStyle.eventStyles || {});
        const config = {
            header: {
                tag: 'div',
                id: 'inputDialogHeader',
                style: customDialogStyle.header || {},
                title: {
                    tag: 'h4',
                    id: 'inputDialogTitle',
                    text: dialogTitle,
                    style: customDialogStyle.title || {}
                }
            },
            content: {
                tag: 'div',
                id: 'inputDialogContent',
                text: dialogContent,
                style: customDialogStyle.content || {}
            },
            input: {
                tag: 'input',
                id: 'inputDialogInput',
                type: 'text',
                style: customDialogStyle.input || {}
            },
            footer: {
                tag: 'div',
                id: 'inputDialogFooter',
                style: customDialogStyle.footer || {},
                buttons: [
                    {
                        tag: 'button',
                        id: 'btnOk',
                        text: 'OK',
                        style: customDialogStyle.okButton || {},
                        option: this.OK_OPTION,
                        callback: (e, result) => { 
                            console.log(result.output, result.option);
                         }
                    },
                    {
                        tag: 'button',
                        id: 'btnCancel',
                        text: 'Cancel',
                        style: customDialogStyle.cancelButton || {},
                        option: this.CANCEL_OPTION,
                        callback: (e, result) => { 
                            console.log(result.output, result.option);
                         }
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

    // 2. Message this: Accepts a title and content.
    static async showMessageDialog(dialogTitle, dialogContent, customDialogStyle = {}) {
        const mergedEventStyles = Object.assign({}, this.#defaultEventStyles, customDialogStyle.eventStyles || {});
        const config = {
            header: {
                tag: 'div',
                id: 'messageDialogHeader',
                style: customDialogStyle.header || {},
                title: {
                    tag: 'h4',
                    id: 'messageDialogTitle',
                    text: dialogTitle,
                    style: customDialogStyle.title || {}
                }
            },
            content: {
                tag: 'div',
                id: 'messageDialogContent',
                text: dialogContent,
                style: customDialogStyle.content || {}
            },
            footer: {
                tag: 'div',
                id: 'messageDialogFooter',
                style: customDialogStyle.footer || {},
                buttons: [
                    {
                        tag: 'button',
                        id: 'btnOk',
                        text: 'OK',
                        style: customDialogStyle.okButton || {},
                        option: this.OK_OPTION,
                        callback: (e, result) => { }
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

    // 3. Confirm this: Accepts a title and content.
    static async showConfirmDialog(dialogTitle, dialogContent, customDialogStyle = {}) {
        const mergedEventStyles = Object.assign({}, this.#defaultEventStyles, customDialogStyle.eventStyles || {});
        const config = {
            header: {
                tag: 'div',
                id: 'confirmDialogHeader',
                style: customDialogStyle.header || {},
                title: {
                    tag: 'h4',
                    id: 'confirmDialogTitle',
                    text: dialogTitle,
                    style: customDialogStyle.title || {}
                }
            },
            content: {
                tag: 'div',
                id: 'confirmDialogContent',
                text: dialogContent,
                style: customDialogStyle.content || {}
            },
            footer: {
                tag: 'div',
                id: 'confirmDialogFooter',
                style: customDialogStyle.footer || {},
                buttons: [
                    {
                        tag: 'button',
                        id: 'btnYes',
                        text: 'Yes',
                        style: customDialogStyle.yesButton || {},
                        option: this.YES_OPTION,
                        callback: (e, result) => { return result; }
                    },
                    {
                        tag: 'button',
                        id: 'btnNo',
                        text: 'No',
                        style: customDialogStyle.noButton || {},
                        option: this.NO_OPTION,
                        callback: (e, result) => { return result; }
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

    // 4. Plain this: Accepts only content.
    static async showPlainDialog(dialogContent, customDialogStyle = {}) {
        const mergedEventStyles = Object.assign({}, this.#defaultEventStyles, customDialogStyle.eventStyles || {});
        const config = {
            header: {
                tag: 'div',
                id: 'plainDialogHeader',
                style: customDialogStyle.header || {},
                closeButton: {
                    tag: 'button',
                    id: 'btnClose',
                    text: '×',
                    style: customDialogStyle.closeButton || {}
                }
            },
            content: {
                tag: 'div',
                id: 'plainDialogContent',
                text: dialogContent,
                style: customDialogStyle.content || {}
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
        let currentIndex = 0;
        const total = dialogContents.length;

        // Build card HTML – each message is wrapped in a div;
        // only the first card is visible.
        let cardHtml = '<div id="instructionCardContainer">';
        dialogContents.forEach((msg, i) => {
            cardHtml += `<div class="instructionCard" style="display:${i === 0 ? 'block' : 'none'};">${msg}</div>`;
        });
        cardHtml += '</div>';

        const mergedEventStyles = Object.assign({}, this.#defaultEventStyles, customDialogStyle.eventStyles || {});

        const config = {
            instructionDialog: true,
            header: {
                tag: 'div',
                id: 'instructionDialogHeader',
                style: customDialogStyle.header || {},
                title: {
                    tag: 'h4',
                    id: 'instructionDialogTitle',
                    text: dialogTitle,
                    style: customDialogStyle.title || {}
                }
            },
            content: {
                tag: 'div',
                id: 'instructionDialogContent',
                text: cardHtml,
                style: customDialogStyle.content || {}
            },
            footer: {
                tag: 'div',
                id: 'instructionDialogFooter',
                style: customDialogStyle.footer || {},
                buttons: []
            },
            eventStyles: mergedEventStyles
        };

        // If only one message, simply add an OK button.
        if (total === 1) {
            config.footer.buttons.push({
                tag: 'button',
                id: 'btnOk',
                text: 'OK',
                style: customDialogStyle.okButton || {},
                option: this.OK_OPTION,
                navigation: false,
                callback: (e, result) => { }
            });
        } else {
            // For multiple messages, add Previous and Next buttons.
            config.footer.buttons.push({
                    tag: 'button',
                    id: 'btnPrev',
                    text: '< Previous',
                    style: customDialogStyle.prevButton || {},
                    navigation: true,
                    option: null,
                    callback: (e, result) => {
                        if (currentIndex > 0) {
                            currentIndex--;
                            updateCards();
                            updateButtons();
                        }
                    }
                }, {
                    tag: 'button',
                    id: 'btnNext',
                    text: 'Next >',
                    style: customDialogStyle.nextButton || {},
                    navigation: true,
                    option: null,
                    callback: (e, result) => {
                        const targetButton = e.target;
                        const dialogElement = targetButton.closest('dialog');

                        if (currentIndex < total - 1) {
                            currentIndex++;
                            updateCards();
                            updateButtons();
                        } else if (currentIndex === total - 1) {
                            dialogElement.close();
                            dialogElement.remove();
                        }
                        // When on the last card, the Next button should act as OK.
                    }
                }
            );
        }

        // Helper functions to update the card visibility and button texts.
        function updateCards() {
            const container = document.getElementById('instructionCardContainer');
            if (container) {
                Array.from(container.children).forEach((card, i) => {
                    card.style.display = (i === currentIndex) ? 'block' : 'none';
                });
            }
        }
        function updateButtons() {
            const btnPrev = document.getElementById('btnPrev');
            const btnNext = document.getElementById('btnNext');
            if (btnPrev) {
                btnPrev.style.display = (currentIndex === 0) ? 'none' : 'inline-block';
            }
            if (btnNext) {
                btnNext.textContent = (currentIndex === total - 1) ? 'OK' : 'Next >';
                // Remove navigation flag on the Next button if we're on the final card.
                btnNext.navigation = (currentIndex === total - 1) ? false : true;
            }
        }

        await this.#dialogQueue;
        const showFn = this.#buildDialogWrapper(config, false);
        this.#dialogQueue = showFn();
        updateButtons();
        updateCards();
        return await this.#dialogQueue;
    }
}
