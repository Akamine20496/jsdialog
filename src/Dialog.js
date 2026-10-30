import deepMerge from '../node_modules/@75lb/deep-merge/dist/index.mjs'

/**
 * JSDialog by: Akamine20496
 *
 * This is a class with `promise-based` function where it imitates
 * the look of native dialogs in desktop and they require waiting for user input
 * upon invoking this functions (excluding Message Dialog, Plain Dialog, and Instruction Dialog).
 *
 * Message Dialog, Plain Dialog, and Instruction Dialog can be used without the `await` keyword,
 * but not Input Dialog, Confirm Dialog, because they require waiting for user input.
 * Not using `await` will make all dialog appear at once.
 */
export default class Dialog {
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
    }

    // core styling for the dialog
    static #coreDialogStyles = {
        plain: {
            backdrop: {
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
                "justify-content": "center",
                "align-items": "center"
            },
            dialog: {
                "margin": "auto",
                "padding": "0",
                "border-radius": "10px",
                "box-shadow": "0 6px 12px rgba(0, 0, 0, 0.2)",
                "max-height": "85vh",
                "min-width": "300px",
                "min-height": "150px",
                "z-index": "9999",
                "box-sizing": "border-box",
                "background-color": "#f9f9f9",
                "display": "flex",
                "flex-direction": "column",
                "overflow": "hidden",
                "font-family": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                "user-select": "text",
            },
            header: {
                "width": "auto",
                "height": "auto",
                "box-sizing": "unset",
                "padding": "0",
                "margin": "0",
                "margin-bottom": "2px",
                "flex": "0 0 20%",
                "display": "flex",
                "align-items": "center",
                "justify-content": "flex-end",
                "position": "relative",
                "z-index": "1"
            },
            button: {
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
                "transition": "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "position": "relative",
                "z-index": "2"
            },
            content: {
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
                "overflow-wrap": "break-word",
                "text-align": "left",
                "font-family": "inherit",
                "font-size": "0.9375rem",
                "font-weight": "400",
                "line-height": "1.5"
            }
        },
        native: {
            dialog: {
                "display": "block",
                "border": "none",
                "border-radius": "10px",
                "box-shadow": "0 6px 12px rgba(0, 0, 0, 0.2)",
                "margin": "auto",
                "padding": "15px",
                "min-width": "300px",
                "min-height": "150px",
                "max-height": "85vh",
                "box-sizing": "border-box",
                "font-family": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                "user-select": "text",
                "background-color": "#e9e8e8",
                "overflow-y": "auto",
                "overflow-x": "hidden",
            },
            header: {
                "width": "100%",
                "height": "auto",
                "box-sizing": "unset",
                "padding": "0",
                "margin": "0 0 10px 0",
                "margin-bottom": "10px"
            },
            title: {
                "width": "auto",
                "height": "auto",
                "box-sizing": "unset",
                "padding": "0",
                "margin": "0",
                "color": "#333",
                "text-align": "left",
                "font-family": "inherit",
                "font-size": "1.5rem",
                "font-weight": "bold",
                "line-height": "1.5"
            },
            content: {
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
                "overflow-wrap": "break-word",
                "text-align": "left",
                "font-family": "inherit",
                "font-size": "0.9375rem",
                "font-weight": "400",
                "line-height": "1.5"
            },
            input: {
                "width": "100%",
                "height": "30px",
                "background-color": "#f3f5f8",
                "font-family": "Arial, sans-serif",
                "box-sizing": "unset",
                "padding": "0 4px",
                "margin": "0",
                "font-size": "small",
                "color": "#333",
                "border": "1px solid #adb5bd",
                "border-radius": "4px",
                "text-align": "left"
            },
            footer: {
                "width": "100%",
                "height": "auto",
                "box-sizing": "unset",
                "padding": "0",
                "display": "flex",
                "justify-content": "space-between",
                "gap": "4px"
            },
            button: {
                "user-select": "none",
                "font-family": "Arial, sans-serif",
                "background-color": "#adb5bd",
                "width": "100%",
                "height": "auto",
                "box-sizing": "unset",
                "padding": "8px 16px",
                "margin": "0",
                "font-size": "small",
                "text-align": "center",
                "border": "none",
                "border-radius": "4px",
                "color": "#fff",
                "transition": "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
            }
        }
    }

    // current theme preference, default is light
    static #themePreference = 'light';
    static #darkMode = false;

    // Predefined theme styles for the dialog
    static #theme = {
        plain: {
            backdrop: {
                styles: {
                    light: { "background-color": "rgba(0, 0, 0, 0.1)" },
                    dark: {}
                },
                eventStyles: {
                    light: {},
                    dark: {}
                }
            },
            dialog: {
                styles: {
                    light: {
                        "box-shadow": "0 6px 12px rgba(0, 0, 0, 0.2)",
                        "background-color": "#f9f9f9",
                        'border-color': '#D1D5DB'
                    },
                    dark: {
                        'background-color': '#1e1e1e',
                        'border-color': '#444444'
                    }
                },
                eventStyles: {
                    light: {
                        mouseover: { "box-shadow": "0 6px 12px rgba(0, 0, 0, 0.3)" },
                        mouseout: { "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)" }
                    },
                    dark: {
                        mouseover: { "box-shadow": "0 6px 16px rgba(0, 0, 0, 0.6)" },
                        mouseout: { "box-shadow": "0 4px 10px rgba(0, 0, 0, 0.4)" }
                    }
                }
            },
            header: {
                styles: {
                    light: {},
                    dark: {}
                },
                eventStyles: {
                    light: {},
                    dark: {}
                }
            },
            button: {
                styles: {
                    light: {
                        "background-color": "#adb5bd",
                        "color": "#fff",
                        'border-color': '#D1D5DB'
                    },
                    dark: {
                        'background-color': '#343A40',
                        'color': '#f2f4f8',
                        'border-color': '#666666'
                    }
                },
                eventStyles: {
                    light: {
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
                    },
                    dark: {
                        mouseover: {
                            "background-color": "#495563",
                            "outline": "1px solid rgba(173, 181, 189, 0.65)",
                            "box-shadow": "0 4px 10px rgba(0, 0, 0, 0.45)"
                        },
                        mouseout: {
                            "background-color": "#343a40",
                            "outline": "none",
                            "box-shadow": "none"
                        },
                        focus: {
                            "outline": "1px solid #8ab4f8",
                            "box-shadow": "0 0 0 3px rgba(138, 180, 248, 0.2)"
                        },
                        blur: {
                            "outline": "none",
                            "box-shadow": "none"
                        }
                    }
                }
            },
            content: {
                styles: {
                    light: {
                        "background-color": "rgba(221, 216, 216, 0.26)",
                        "color": "#555"
                    },
                    dark: {
                        'background-color': '#252525',
                        'color': '#ede6e6'
                    }
                },
                eventStyles: {
                    light: {},
                    dark: {}
                }
            }
        },
        native: {
            dialog: {
                styles: {
                    light: {
                        "box-shadow": "0 6px 12px rgba(0, 0, 0, 0.2)",
                        "background-color": "#e9e8e8",
                        'border-color': '#D1D5DB'
                    },
                    dark: {
                        'background-color': '#1e1e1e',
                        'border-color': '#444444'
                    }
                },
                eventStyles: {
                    light: {
                        mouseover: { "box-shadow": "0 6px 12px rgba(0, 0, 0, 0.3)" },
                        mouseout: { "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)" }
                    },
                    dark: {
                        mouseover: { "box-shadow": "0 6px 16px rgba(0, 0, 0, 0.6)" },
                        mouseout: { "box-shadow": "0 4px 10px rgba(0, 0, 0, 0.4)" }
                    }
                }
            },
            header: {
                styles: {
                    light: {},
                    dark: {}
                },
                eventStyles: {
                    light: {},
                    dark: {}
                }
            },
            title: {
                styles: {
                    light: { "color": "#333" },
                    dark: { 'color': '#f2f4f8' }
                },
                eventStyles: {
                    light: {},
                    dark: {}
                }
            },
            content: {
                styles: {
                    light: {
                        "background-color": "rgba(221, 216, 216, 0.26)",
                        "border-bottom": "1px solid #ccc",
                        "color": "#555"
                    },
                    dark: {
                        'background-color': '#252525',
                        "border-bottom": "1px solid #444444",
                        'color': '#ede6e6'
                    }
                },
                eventStyles: {
                    light: {},
                    dark: {}
                }
            },
            input: {
                styles: {
                    light: {
                        "background-color": "#f3f5f8",
                        "color": "#333",
                        "border": "1px solid #adb5bd"
                    },
                    dark: {
                        'background-color': '#333333',
                        'color': '#f2f4f8',
                        "border": "1px solid #555555"
                    }
                },
                eventStyles: {
                    light: {
                        focus: {
                            "outline": "2px solid rgba(204, 204, 204, 0.5)",
                            "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)"
                        },
                        blur: {
                            "outline": "none",
                            "box-shadow": "none"
                        }
                    },
                    dark: {
                        focus: {
                            "outline": "2px solid rgba(138, 180, 248, 0.7)",
                            "box-shadow": "0 4px 10px rgba(0, 0, 0, 0.45)"
                        },
                        blur: {
                            "outline": "none",
                            "box-shadow": "none"
                        }
                    }
                }
            },
            footer: {
                styles: {
                    light: {},
                    dark: {}
                },
                eventStyles: {
                    light: {},
                    dark: {}
                }
            },
            button: {
                styles: {
                    light: {
                        "background-color": "#adb5bd",
                        "color": "#fff",
                        'border-color': '#D1D5DB'
                    },
                    dark: {
                        'background-color': '#343A40',
                        'color': '#f2f4f8',
                        'border-color': '#666666'
                    }
                },
                eventStyles: {
                    light: {
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
                    },
                    dark: {
                        mouseover: {
                            "background-color": "#495563",
                            "outline": "1px solid rgba(173, 181, 189, 0.65)",
                            "box-shadow": "0 4px 10px rgba(0, 0, 0, 0.45)"
                        },
                        mouseout: {
                            "background-color": "#343a40",
                            "outline": "none",
                            "box-shadow": "none"
                        },
                        focus: {
                            "outline": "1px solid #8ab4f8",
                            "box-shadow": "0 0 0 3px rgba(138, 180, 248, 0.2)"
                        },
                        blur: {
                            "outline": "none",
                            "box-shadow": "none"
                        }
                    }
                }
            }
        }
    };

    static #dialogTypes = [
        'plainDialog',
        'inputDialog',
        'messageDialog',
        'confirmDialog',
        'instructionDialog'
    ];

    static #coreDialogParts = {
        plain: Object.keys(this.#coreDialogStyles.plain),
        native: Object.keys(this.#coreDialogStyles.native)
    };

    static #dialogConfigs = {
        [this.#dialogTypes[0]]: {
            dialogMode: 'plain',
            dialogParts: [
                ...this.#coreDialogParts.plain,
                'btnClose'
            ]
        },
        [this.#dialogTypes[1]]: {
            dialogMode: 'native',
            dialogParts: [
                ...this.#coreDialogParts.native,
                'btnOk',
                'btnCancel'
            ]
        },
        [this.#dialogTypes[2]]: {
            dialogMode: 'native',
            dialogParts: [
                ...this.#coreDialogParts.native.filter(part => part !== 'input'),
                'btnOk'
            ]
        },
        [this.#dialogTypes[3]]: {
            dialogMode: 'native',
            dialogParts: [
                ...this.#coreDialogParts.native.filter(part => part !== 'input'),
                'btnYes',
                'btnNo'
            ]
        },
        [this.#dialogTypes[4]]: {
            dialogMode: 'native',
            dialogParts: [
                ...this.#coreDialogParts.native.filter(part => part !== 'input'),
                'btnOk',
                'btnPrev',
                'btnNext'
            ]
        }
    };

    // styles for all kinds of dialog
    static #dialogTypesStyles = {};

    // copy the styling from theme to dialogTypesStyles
    static {
        const dialogTypesSize = this.#dialogTypes.length;

        for (let i = 0; i < dialogTypesSize; i++) {
            const dialogType = this.#dialogTypes[i];
            const dialogConfig = this.#dialogConfigs[dialogType];
            const { dialogMode, dialogParts } = dialogConfig;
            const themeStyles = this.#theme[dialogMode];
            const partsSize = dialogParts.length;

            for (let j = 0; j < partsSize; j++) {
                const dialogPart = dialogParts[j];
                this.#storeDialogTypesStyles(dialogType, dialogPart, themeStyles[dialogPart]);
            }
        }
    };

    // stores the references of elements of the dialog to reapply styles
    static #openDialogs = new Map();

    // media queries
    static #mobileViewMedia = window.matchMedia('(max-width: 768px)');
    static #darkModeMedia = null;

    // Queue to avoid overlapping dialogs.
    static #dialogQueue = Promise.resolve();

    // restrict creating an instance
    constructor() {
        if (new.target === Dialog) {
            throw new Error("Dialog is abstract and cannot be instantiated directly");
        }
    }

    /**
     * Stores styles to the dialogTypeStyles
     * @param {'plainDialog'|'inputDialog'|'messageDialog'|'confirmDialog'|'instructionDialog'} dialogType Type of dialog
     * @param {string} dialogPart Part of a dialog
     * @param {Object} styles Contains styles and event styles
     */
    static #storeDialogTypesStyles(dialogType, dialogPart, { styles = {}, eventStyles = {} } = {}) {
        const type = this.#dialogTypesStyles[dialogType] ??= {};
        const part = type[dialogPart] ??= {
                        styles: {
                            light: {},
                            dark: {}
                        },
                        eventStyles: {
                            light: {},
                            dark: {}
                        }
                    };

        // merge light and dark styling
        deepMerge(part, { styles, eventStyles });
    }

    /**
     * Gets dialog parts styles from dialogTypesStyles
     * @param {'plainDialog'|'inputDialog'|'messageDialog'|'confirmDialog'|'instructionDialog'} dialogType Type of dialog
     * @returns {Object} styles of dialog parts
     */
    static #getDialogPartsStyles(dialogType) {
        const dialogParts = this.#dialogTypesStyles[dialogType];

        if (!dialogParts) {
            return { styles: {}, eventStyles: {} };
        }

        const result = {
            styles: {},
            eventStyles: {}
        };

        const entries = Object.entries(dialogParts);
        const dialogPartsSize = entries.length;

        for (let i = 0; i < dialogPartsSize; i++) {
            const [dialogPart, { styles, eventStyles }] = entries[i];

            result.styles[dialogPart] = styles[this.#themePreference] ??= {};
            result.eventStyles[dialogPart] = eventStyles[this.#themePreference] ??= {};
        }

        return result;
    }

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
     * Apply responsive layout for dialog
     * @param {HTMLElement} dialog
     * @param {string} originalMaxWidth
     */
    static #applyResponsiveDialogStyle(dialog, originalMaxWidth) {
        const isMobile = this.#mobileViewMedia.matches;
        dialog.style.setProperty("max-width", isMobile ? "90vw" : originalMaxWidth, "important");
    }

    /**
     * Helper to attach event styles
     * @param {HTMLElement} element HTML element
     * @param {Object} eventStyles event styles for the element
     */
    static #applyEventStyles(element, eventStyles) {
        if (element && Object.keys(eventStyles).length > 0) {
            const events = Object.entries(eventStyles);
            const eventsSize = events.length;

            for (let i = 0; i < eventsSize; i++) {
                const [eventName, styles] = events[i];
                const styleEntries = Object.entries(styles);
                const stylesSize = styleEntries.length;

                element.addEventListener(eventName, function() {
                    for (let j = 0; j < stylesSize; j++) {
                        const [styleName, styleValue] = styleEntries[j];
                        element.style.setProperty(styleName, styleValue, 'important');
                    }
                });
            }
        }
    }

    /**
     * Helper to attach static styles
     * @param {HTMLElement} element HTML element
     * @param {Object} styles static styles for the element
     */
    static #applyElementStyles(element, styles) {
        if (element && Object.keys(styles).length > 0) {
            const styleEntries = Object.entries(styles);
            const stylesSize = styleEntries.length;

            for (let j = 0; j < stylesSize; j++) {
                const [styleName, styleValue] = styleEntries[j];
                element.style.setProperty(styleName, styleValue, 'important');
            }
        }
    }

    /**
     * Helper function that combines styling both static styles and event styles
     * @param {Object|Object[]} target 
     */
    static #applyStyles(target) {
        if (Array.isArray(target)) {
            const targetSize = target.length;

            for (let i = 0; i < targetSize; i++) {
                const { element, styles, eventStyles } = target[i];

                // static styles
                this.#applyElementStyles(element, styles);
                // event styles
                this.#applyEventStyles(element, eventStyles);
            }
        } else if (target && Object.keys(target.styles).length > 0) {
            const { element, styles, eventStyles } = target;
            // static styles
            this.#applyElementStyles(element, styles);
            // event styles
            this.#applyEventStyles(element, eventStyles);
        }
    }

    /**
     * Internal builder that creates a dialog based on the internal config.
     * The config structure is fixed (header, content, footer, eventStyles) and
     * is built internally within each public method.
     *
     * @param {Object} config The dialog configuration.
     * @param {boolean} isPlain If true, builds a plain dialog (using div/backdrop).
     * @returns {Function} A closure that shows the dialog and returns a Promise.
     */
    static #buildDialogWrapper(config, isPlain = false) {
        /**
         * Injects dialog custom scrollbar styles.
         * @param {HTMLElement} element
         * @returns {Function}
         */
        function addDialogScrollbarStyleTo(element) {
            const elementId = '#' + element.id;
            const styleTag = document.createElement('style');
            styleTag.id = `${element.id}-scrollbar-style`;

            let cleanedUp = false;

            function cleanUpScrollbarStyle() {
                if (cleanedUp) return;
                cleanedUp = true;
                styleTag.remove();
            }

            styleTag.textContent = /*css*/`
                ${elementId} .scrollableDialogContent::-webkit-scrollbar {
                    width: 5px !important;
                }
                ${elementId} .scrollableDialogContent::-webkit-scrollbar-track {
                    display: none !important;
                }
                ${elementId} .scrollableDialogContent::-webkit-scrollbar-thumb {
                    background-color: #888 !important;
                    border-radius: 10px !important;
                }
                ${elementId} .scrollableDialogContent::-webkit-scrollbar-thumb:hover {
                    background-color: #555 !important;
                }
                ${elementId} .scrollableDialogContent::-webkit-scrollbar-button {
                    display: none !important;
                }
            `;

            if (element instanceof HTMLDialogElement) {
                styleTag.textContent += /*css*/`
                    ${elementId}::-webkit-scrollbar {
                        width: 5px !important;
                    }
                    ${elementId}::-webkit-scrollbar-track {
                        display: none !important;
                    }
                    ${elementId}::-webkit-scrollbar-thumb {
                        background-color: #888 !important;
                        border-radius: 10px !important;
                    }
                    ${elementId}::-webkit-scrollbar-thumb:hover {
                        background-color: #555 !important;
                    }
                    ${elementId}::-webkit-scrollbar-button {
                        display: none !important;
                    }
                `;
            }

            document.head.appendChild(styleTag);

            return cleanUpScrollbarStyle;
        }

        /**
         * Injects dialog animation styles.
         * @param {HTMLElement} element
         * @param {HTMLElement?} backdrop backdrop element of plain dialog
         * @returns {Function}
         */
        function addDialogAnimationStyleTo(element, backdrop = null) {
            const elementId = '#' + element.id;
            const backdropId = backdrop ? '#' + backdrop.id : null;
            const styleTag = document.createElement('style');
            styleTag.id = `${element.id}-animation-style`;

            let cleanedUp = false;

            function cleanUpAnimationStyle() {
                if (cleanedUp) return;
                cleanedUp = true;
                styleTag.remove();
            }

            if (element instanceof HTMLDialogElement) {
                if (activeDialog && activeTarget) {
                    styleTag.textContent = /*css*/`
                        ${elementId} {
                            --position-transition: top 0ms, left 0ms;
                        }

                        ${elementId}.position-transition {
                            --position-transition: top 200ms ease, left 200ms ease;
                        }
                    `;
                }

                styleTag.textContent += /*css*/`
                    ${elementId}, ${elementId}::backdrop {
                        opacity: 0 !important;
                        transition:
                            opacity 300ms ease,
                            display 300ms allow-discrete,
                            overlay 300ms allow-discrete${
                                activeDialog && activeTarget ? 
                                ', var(--position-transition)' : ''
                            } !important;
                    }

                    ${elementId}[open], ${elementId}[open]::backdrop {
                        opacity: 1 !important;

                        @starting-style {
                            opacity: 0 !important;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        ${elementId} {
                            transition-duration: 0ms;
                        }
                    }
                `;
            } else if (backdrop) {
                styleTag.textContent = /*css*/`
                    ${backdropId}, ${elementId} {
                        opacity: 0 !important;
                        transition:
                            opacity 300ms ease,
                            display 300ms allow-discrete${
                                activeDialog && activeTarget ? 
                                ', top 200ms ease, left 200ms ease' : ''
                            } !important;
                    }

                    ${backdropId}.fade-in, ${elementId}.fade-in {
                        opacity: 1 !important;

                        @starting-style {
                            opacity: 0 !important;
                        }
                    }
                    
                    @media (prefers-reduced-motion: reduce) {
                        ${backdropId}, ${elementId} {
                            transition-duration: 0ms;
                        }
                    }
                `;
            }

            document.head.appendChild(styleTag);

            return cleanUpAnimationStyle;
        }

        /**
         * trap the focus only to the dialog (as div element) until closed
         * @param {HTMLElement} dialog 
         * @returns {Function} function to remove the listener
         */
        function trapDialogFocus(dialog) {
            const selector = [
                'a[href]',
                'button:not(:disabled)',
                'input:not(:disabled)',
                'select:not(:disabled)',
                'textarea:not(:disabled)',
                '[tabindex]:not([tabindex="-1"])'
            ].join(',');

            const getFocusableElements = () =>
                [...dialog.querySelectorAll(selector)]
                    .filter(element => element.getClientRects().length > 0);

            const handleKeydown = event => {
                if (event.key !== 'Tab') return;

                const elements = getFocusableElements();

                if (elements.length === 0) {
                    event.preventDefault();
                    dialog.focus();
                    return;
                }

                const first = elements[0];
                const last = elements[elements.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            };

            dialog.addEventListener('keydown', handleKeydown);

            const firstFocusable = getFocusableElements()[0];
            (firstFocusable || dialog).focus();

            return () => dialog.removeEventListener('keydown', handleKeydown);
        }

        // Keep track of the currently open dialog and its anchor
        let activeDialog = null;
        let activeTarget = null;

        function throttle(callback, delay = 1000) {
            let shouldWait = false;
            let waitingArgs;
            const timeoutFn = () => {
                if (waitingArgs == null) {
                    shouldWait = false;
                } else {
                    callback(...waitingArgs);
                    waitingArgs = null;
                    setTimeout(timeoutFn, delay);
                }
            };

            return (...args) => {
                if (shouldWait) {
                    waitingArgs = args;
                    return;
                }

                callback(...args);
                shouldWait = true;

                setTimeout(timeoutFn, delay);
            };
        }

        const handleViewportChange = throttle(() => {
            positionDialogTo(activeDialog, activeTarget);
        }, 150);

        /**
         * Positions a dialog centered relative to an anchor element.
         * @param {HTMLElement|HTMLDialogElement} dialog The dialog element itself
         * @param {HTMLElement} target The element to center it to
         */
        const positionDialogTo = (dialog, target) => {
            if (!dialog || !target) return;

            // Get dimensions of both the anchor and the dialog
            const targetRect = target.getBoundingClientRect();
            const dialogRect = dialog.getBoundingClientRect();

            let left, top;

            // Special check if anchoring to the root element
            if (target === document.documentElement) {
                left = (window.innerWidth - dialogRect.width) / 2;
                top = (window.innerHeight - dialogRect.height) / 2;
            } else {
                // Calculate center coordinates relative to the anchor element
                left = targetRect.left + (targetRect.width / 2) - (dialogRect.width / 2);
                top = targetRect.top + (targetRect.height / 2) - (dialogRect.height / 2);
            }

            // -- VIEWPORT CLAMPING --
            const padding = 16; // Minimum space from the screen edge
            const maxLeft = window.innerWidth - dialogRect.width - padding;
            const maxTop = window.innerHeight - dialogRect.height - padding;

            // Clamp values so it stays inside screen boundaries
            left = Math.max(padding, Math.min(left, maxLeft));
            top = Math.max(padding, Math.min(top, maxTop));

            // if dialog element instance, remove default margin
            if (dialog instanceof HTMLDialogElement) {
                dialog.style.setProperty('margin', 0, 'important');
            }

            // Apply the calculated positions
            this.#applyElementStyles(dialog, {
                'position': 'fixed',
                'left': `${Math.max(0, left)}px`,
                'top': `${Math.max(0, top)}px`
            });
        }

        /**
         * Removes dialog after the transition
         * @param {HTMLDialogElement} dialog
         * @param {Function} cleanUpScrollbarStyle
         * @param {Function} cleanUpAnimationStyle
         */
        const removeDialogAfterTransition = async (dialog, cleanUpScrollbarStyle, cleanUpAnimationStyle) => {
            dialog.classList.remove('position-transition');
            
            const animations = dialog.getAnimations({ subtree: false });

            await Promise.allSettled(animations.map(animation => animation.finished));

            this.#openDialogs.delete(dialog);

            dialog.remove();
            cleanUpScrollbarStyle();
            cleanUpAnimationStyle();

            if (activeDialog && activeTarget) {
                window.removeEventListener('resize', handleViewportChange);
                window.removeEventListener('scroll', handleViewportChange, true);

                activeDialog = null;
                activeTarget = null;
            }
        }

        function openPlainDialog(backdrop, dlg) {
            backdrop.style.setProperty('display', 'flex', 'important');

            backdrop.classList.add('fade-in');
            dlg.classList.add('fade-in');

            dlg.focus();

            if (activeDialog && activeTarget) {
                positionDialogTo(activeDialog, activeTarget);
                window.addEventListener('resize', handleViewportChange);
                window.addEventListener('scroll', handleViewportChange, true);
            }
        }

        const closePlainDialog = async (backdrop, dlg, cleanUpScrollbarStyle, cleanUpAnimationStyle, releaseFocusTrap) => {
            backdrop.style.setProperty('display', 'none', 'important');

            backdrop.classList.remove('fade-in');
            dlg.classList.remove('fade-in');
            
            const animations = backdrop.getAnimations({ subtree: true });

            await Promise.allSettled(animations.map(animation => animation.finished));

            this.#openDialogs.delete(backdrop);

            backdrop.remove();
            cleanUpScrollbarStyle();
            cleanUpAnimationStyle();
            releaseFocusTrap();

            if (activeDialog && activeTarget) {
                window.removeEventListener('resize', handleViewportChange);
                window.removeEventListener('scroll', handleViewportChange, true);

                activeDialog = null;
                activeTarget = null;
            }
        }

        return () => {
            return new Promise((resolve) => {
                if (isPlain) {
                    // store the reference of each element
                    const elements = {};

                    // --- Plain dialog ---
                    const backdrop = document.createElement('div');
                    elements.backdrop = backdrop;

                    backdrop.id = config.backdrop.id || 'backdrop';
                    backdrop.role = 'dialog backdrop';
                    backdrop.ariaModal = true;
                    backdrop.tabIndex = -1;

                    this.#applyStyles({
                        element: backdrop,
                        styles: { ...this.#coreDialogStyles.plain.backdrop, ...config.backdrop.styles },
                        eventStyles: config.backdrop.eventStyles
                    });

                    if (typeof config.reapplyTheme === 'function') {
                        this.#openDialogs.set(backdrop, () => config.reapplyTheme(elements));
                    }

                    // dialog
                    const dlg = document.createElement('div');
                    elements.dialog = dlg;

                    const originalMaxWidth = config.dialog.style?.['max-width'] || '50vw';
                    const resizeHandler = () => this.#applyResponsiveDialogStyle(dlg, originalMaxWidth);
                    this.#mobileViewMedia.addEventListener('change', resizeHandler);
                    resizeHandler(); // Initial apply

                    dlg.id = config.dialog.id || "modalDialog";
                    dlg.role = 'dialog';
                    dlg.ariaModal = true;
                    dlg.tabIndex = -1;

                    this.#applyStyles({
                        element: dlg,
                        styles: { ...this.#coreDialogStyles.plain.dialog, ...config.dialog.styles },
                        eventStyles: config.dialog.eventStyles
                    });

                    if (config.dialog.target) {
                        activeDialog = dlg;
                        activeTarget = config.dialog.target;
                    }

                    const cleanUpScrollbarStyle = addDialogScrollbarStyleTo(dlg);
                    const cleanUpAnimationStyle = addDialogAnimationStyleTo(dlg, backdrop);
                    const releaseFocusTrap = trapDialogFocus(dlg);

                    // header.
                    if (config.header) {
                        const header = document.createElement(config.header.tag || 'div');
                        elements.header = header;

                        if (config.header.id)
                            header.id = config.header.id;

                        this.#applyStyles({
                            element: header,
                            styles: { ...this.#coreDialogStyles.plain.header, ...config.header.styles },
                            eventStyles: config.header.eventStyles
                        });

                        if (config.header.closeButton) {
                            const closeBtn = document.createElement(config.header.closeButton.tag || 'button');
                            elements.button = closeBtn;

                            if (config.header.closeButton.id) {
                                closeBtn.id = config.header.closeButton.id;
                            }

                            closeBtn.type = 'button';
                            closeBtn.innerText = config.header.closeButton.text || '×';

                            this.#applyStyles({
                                element: closeBtn,
                                styles: { ...this.#coreDialogStyles.plain.button, ...config.header.closeButton.styles },
                                eventStyles: config.header.closeButton.eventStyles
                            });

                            closeBtn.addEventListener('click', () => {
                                this.#mobileViewMedia.removeEventListener('change', resizeHandler);
                                resolve();
                                closePlainDialog(backdrop, dlg, cleanUpScrollbarStyle, cleanUpAnimationStyle, releaseFocusTrap);
                            }, { once: true });

                            header.appendChild(closeBtn);
                        }

                        dlg.appendChild(header);
                    }

                    // Content.
                    if (config.content) {
                        const content = document.createElement(config.content.tag || 'div');
                        elements.content = content;

                        if (config.content.id)
                            content.id = config.content.id;

                        content.className = 'scrollableDialogContent';
                        content.tabIndex = -1;
                        content[this.#hasHTMLTag(config.content.text) ? 'innerHTML' : 'innerText'] = config.content.text;

                        this.#applyStyles({
                            element: content,
                            styles: { ...this.#coreDialogStyles.plain.content, ...config.content.styles },
                            eventStyles: config.content.eventStyles
                        });

                        dlg.appendChild(content);
                    }

                    backdrop.appendChild(dlg);
                    (activeTarget || document.body).prepend(backdrop);
                    openPlainDialog(backdrop, dlg);
                } else {
                    // store the reference of each element
                    const elements = {
                        button: []
                    };

                    // --- Modal dialog (using <dialog>) ---
                    const dlg = document.createElement('dialog');
                    elements.dialog = dlg;

                    const originalMaxWidth = config.dialog.style?.['max-width'] || '50vw';
                    const resizeHandler = () => this.#applyResponsiveDialogStyle(dlg, originalMaxWidth);
                    this.#mobileViewMedia.addEventListener('change', resizeHandler);
                    resizeHandler(); // Initial apply

                    dlg.id = config.dialog.id || "modalDialog";

                    this.#applyStyles({
                        element: dlg,
                        styles: { ...this.#coreDialogStyles.native.dialog, ...config.dialog.styles },
                        eventStyles: config.dialog.eventStyles
                    });

                    if (config.dialog.target) {
                        activeDialog = dlg;
                        activeTarget = config.dialog.target;
                    }

                    dlg.addEventListener('transitionend', (e) => {
                        if (e.target === dlg) dlg.classList.add('position-transition');
                    }, { once: true });

                    if (typeof config.reapplyTheme === 'function') {
                        this.#openDialogs.set(dlg, () => config.reapplyTheme(elements));
                    }

                    const cleanUpScrollbarStyle = addDialogScrollbarStyleTo(dlg);
                    const cleanUpAnimationStyle = addDialogAnimationStyleTo(dlg);

                    // Header.
                    if (config.header) {
                        const header = document.createElement(config.header.tag || 'div');
                        elements.header = header;

                        if (config.header.id)
                            header.id = config.header.id;

                        this.#applyStyles({
                            element: header,
                            styles: { ...this.#coreDialogStyles.native.header, ...config.header.styles },
                            eventStyles: config.header.eventStyles
                        });

                        if (config.header.title) {
                            const title = document.createElement(config.header.title.tag || 'h4');
                            elements.title = title;

                            if (config.header.title.id)
                                title.id = config.header.title.id;

                            title.innerText = config.header.title.text;

                            this.#applyStyles({
                                element: title,
                                styles: { ...this.#coreDialogStyles.native.title, ...config.header.title.styles },
                                eventStyles: config.header.title.eventStyles
                            });

                            header.appendChild(title);
                        }

                        dlg.appendChild(header);
                    }

                    // Content.
                    if (config.content) {
                        const content = document.createElement(config.content.tag || 'div');
                        elements.content = content;

                        if (config.content.id)
                            content.id = config.content.id;

                        content.className = 'scrollableDialogContent';
                        content.tabIndex = -1;
                        content[this.#hasHTMLTag(config.content.text) ? 'innerHTML' : 'innerText'] = config.content.text;

                        this.#applyStyles({
                            element: content,
                            styles: { ...this.#coreDialogStyles.native.content, ...config.content.styles },
                            eventStyles: config.content.eventStyles
                        });

                        dlg.appendChild(content);
                    }

                    // Optional input.
                    if (config.input) {
                        const inputForm = document.createElement('form');

                        this.#applyElementStyles(inputForm, {
                            "width": "100%",
                            "height": "auto",
                            "display": "flex",
                            "box-sizing": "unset",
                            "padding": "0",
                            "margin": "0 0 20px 0"
                        });

                        const input = document.createElement('input');
                        elements.input = input;

                        if (config.input.id)
                            input.id = config.input.id;

                        input.type = config.input.type || "text";

                        this.#applyStyles({
                            element: input,
                            styles: { ...this.#coreDialogStyles.native.input, ...config.input.styles },
                            eventStyles: config.input.eventStyles
                        });

                        inputForm.addEventListener('submit', (e) => {
                            e.preventDefault();

                            const inputData = { output: null };
                            inputData.output = input.value ? this.#sanitizeInput(input.value) : null;
                            inputData.option = config.footer.buttons[0].option;

                            this.#mobileViewMedia.removeEventListener('change', resizeHandler);

                            dlg.close();
                            resolve(inputData);
                            removeDialogAfterTransition(dlg, cleanUpScrollbarStyle, cleanUpAnimationStyle);
                        }, { once: true });

                        inputForm.appendChild(input);
                        dlg.appendChild(inputForm);
                    }

                    // Footer.
                    if (config.footer && Array.isArray(config.footer.buttons)) {
                        const footer = document.createElement(config.footer.tag || 'div');
                        elements.footer = footer;

                        if (config.footer.id)
                            footer.id = config.footer.id;

                        this.#applyStyles({
                            element: footer,
                            styles: { ...this.#coreDialogStyles.native.footer, ...config.footer.styles },
                            eventStyles: config.footer.eventStyles
                        });

                        const btnCount = config.footer.buttons.length;

                        for (const btnConf of config.footer.buttons) {
                            const btn = document.createElement(btnConf.tag || 'button');
                            elements.button.push(btn);

                            if (btnConf.id)
                                btn.id = btnConf.id;

                            btn.type = btnConf.type;
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

                            this.#applyStyles({
                                element: btn,
                                styles: { ...this.#coreDialogStyles.native.button, ...btnConf.styles },
                                eventStyles: btnConf.eventStyles
                            });

                            btn.addEventListener('click', (e) => {
                                if (config.dialog.id === 'inputDialog' && btnConf.id === 'inputDialogBtnOk') {
                                    const dialog = e.target.closest('dialog'); // get the parent (dialog)
                                    const form = dialog.querySelector('form'); // get the form element
                                    form.requestSubmit(); // invoke submit event

                                    return;
                                }

                                // For instruction dialog
                                if (config.dialog.id === 'instructionDialog') {
                                    if (btnConf.callback && typeof btnConf.callback === 'function') {
                                        btnConf.callback(e);
                                    }

                                    // If the button is marked as navigation, do not close.
                                    if (btnConf.navigation) return;
                                }

                                const inputData = { output: null };
                                inputData.option = btnConf.option;

                                this.#mobileViewMedia.removeEventListener('change', resizeHandler);

                                dlg.close();
                                resolve(inputData);
                                removeDialogAfterTransition(dlg, cleanUpScrollbarStyle, cleanUpAnimationStyle);
                            });

                            footer.appendChild(btn);
                        }

                        dlg.appendChild(footer);
                    }

                    (activeTarget || document.body).prepend(dlg);
                    if (!dlg.open) {
                        dlg.showModal();
                        dlg.focus();

                        if (activeDialog && activeTarget) {
                            positionDialogTo(activeDialog, activeTarget);
                            window.addEventListener('resize', handleViewportChange);
                            window.addEventListener('scroll', handleViewportChange, true);
                        }
                    }
                }
            });
        };
    }

    /**
     * Merge the styles and store the merged styles to dialogTypeStyles
     * @param {'plainDialog'|'inputDialog'|'messageDialog'|'confirmDialog'|'instructionDialog'} dialogType Type of dialog
     * @param {Object?} customDialogStyles Optional custom styles.
     */
    static #mergeDialogStyles(dialogType, customDialogStyles = {}) {
        // each kind of navigation
        // const dialogTypeStyles = this.#dialogTypesStyles.dialogType.dialogPart.styles.light;

        // get the dialog parts based on the dialogType
        const { dialogParts } = this.#dialogConfigs[dialogType];
        const dialogPartSize = dialogParts.length;

        for (let i = 0; i < dialogPartSize; i++) {
            const dialogPartKey = dialogParts[i];
            const dialogStyles = customDialogStyles[dialogPartKey];

            this.#storeDialogTypesStyles(dialogType, dialogPartKey, dialogStyles);
        }
    }

    static #reapplyOpenDialogThemes() {
        for (const [root, reapplyTheme] of this.#openDialogs) {
            if (!root.isConnected) {
                this.#openDialogs.delete(root);
                continue;
            }

            reapplyTheme();
        }
    }

    static #handleSystemThemeChange = (event) => {
        this.#darkMode = event.matches;
        this.#themePreference = this.#darkMode ? 'dark' : 'light';
        this.#reapplyOpenDialogThemes();
    };

    /**
     * Validates the styles of a dialog type
     * @param {'plainDialog'|'inputDialog'|'messageDialog'|'confirmDialog'|'instructionDialog'} dialogType Type of dialog
     * @param {Object} dialogPartsStyles styles for each parts of the dialog type
     */
    static #validateDialogPartStyles(dialogType, dialogPartsStyles = {}) {
        const isPlainObject = value => {
            if (value === null || typeof value !== 'object') return false;

            const prototype = Object.getPrototypeOf(value);
            return prototype === Object.prototype || prototype === null;
        };

        const getInvalidKeys = (allowedKeys, object) => {
            const keys = Object.keys(object);
            let invalid = null;

            for (let i = 0; i < keys.length; i++) {
                if (!allowedKeys.includes(keys[i])) {
                    (invalid ??= []).push(keys[i]);
                }
            }

            return invalid;
        };

        const styleKeys = ['styles', 'eventStyles'];
        const themeModes = ['light', 'dark'];

        if (!isPlainObject(dialogPartsStyles)) {
            throw new TypeError(`"${dialogType}" must be a plain object.`);
        }

        // get the dialog parts based on the dialogType
        const { dialogParts } = this.#dialogConfigs[dialogType];

        const invalidParts = getInvalidKeys(dialogParts, dialogPartsStyles);

        if (invalidParts) {
            throw new Error(`Invalid dialog part(s): "${invalidParts.join(', ')}" in "${dialogType}".`);
        }

        const dialogPartKeys = Object.keys(dialogPartsStyles);

        for (let i = 0; i < dialogPartKeys.length; i++) {
            const dialogPartKey = dialogPartKeys[i];
            const config = dialogPartsStyles[dialogPartKey];

            if (!isPlainObject(config)) {
                throw new TypeError(`"${dialogType}.${dialogPartKey}" must be a plain object.`);
            }

            const invalidStyleKeys = getInvalidKeys(styleKeys, config);

            if (invalidStyleKeys) {
                throw new Error(`Invalid style key(s): "${invalidStyleKeys.join(', ')}" in "${dialogType}.${dialogPartKey}".`);
            }

            for (const key of styleKeys) {
                const modes = config[key];

                if (modes === undefined) continue;

                if (!isPlainObject(modes)) {
                    throw new TypeError(`"${dialogType}.${dialogPartKey}.${key}" must be a plain object.`);
                }

                const invalidModes = getInvalidKeys(themeModes, modes);

                if (invalidModes) {
                    throw new Error(
                        `Invalid theme mode(s): "${invalidModes.join(', ')}" in "${dialogType}.${dialogPartKey}.${key}".`
                    );
                }

                const modeKeys = Object.keys(modes);

                for (let j = 0; j < modeKeys.length; j++) {
                    const mode = modeKeys[j];

                    if (!isPlainObject(modes[mode])) {
                        throw new TypeError(`"${dialogType}.${dialogPartKey}.${key}.${mode}" must be a plain object.`);
                    }
                }
            }
        }
    }

    /**
     * Configures custom styles and event styles for different dialog types.
     * @param {Array<Object>} dialogTypesStylesConfig Custom style configuration keyed by dialog type.
     */
    static setDialogTypesStyles(dialogTypesStylesConfig = []) {
        if (!Array.isArray(dialogTypesStylesConfig)) {
            throw new Error('dialogTypesStylesConfig must be array.');
        }

        const isPlainObject = value => {
            if (value === null || typeof value !== 'object') return false;

            const prototype = Object.getPrototypeOf(value);
            return prototype === Object.prototype || prototype === null;
        };

        const seen = new Set();

        const dialogTypesStylesConfigSize = dialogTypesStylesConfig.length;

        // validate dialog type
        for (let i = 0; i < dialogTypesStylesConfigSize; i++) {
            const entry = dialogTypesStylesConfig[i];

            if (!isPlainObject(entry)) {
                throw new TypeError('Each entry must be a plain object.');
            }

            const dialogTypeKeys = Object.keys(entry);

            if (dialogTypeKeys.length !== 1) {
                throw new Error('Each entry must contain exactly one dialog type.');
            }

            const dialogTypeKey = dialogTypeKeys[0];

            if (!this.#dialogTypes.includes(dialogTypeKey)) {
                throw new Error(`Invalid dialog type: "${dialogTypeKey}".`);
            }

            if (seen.has(dialogTypeKey)) {
                throw new Error(`Duplicate dialog type: "${dialogTypeKey}".`);
            }

            seen.add(dialogTypeKey);
        }

        // Validate the dialogTypesStylesConfig.
        for (let i = 0; i < dialogTypesStylesConfigSize; i++) {
            const entry = dialogTypesStylesConfig[i];
            const dialogTypeKey = Object.keys(entry)[0];

            try {
                this.#validateDialogPartStyles(dialogTypeKey, entry[dialogTypeKey]);
            } catch(e) {
                console.error(e);
            }
        }

        // Store dialogTypesStylesConfig after validation checks
        for (let i = 0; i < dialogTypesStylesConfigSize; i++) {
            const dialogType = dialogTypesStylesConfig[i];
            const dialogTypeKey = Object.keys(dialogType)[0];

            const { [dialogTypeKey]: dialogParts } = dialogType;

            const dialogPartKeys = Object.keys(dialogParts);

            for (let j = 0; j < dialogPartKeys.length; j++) {
                const dialogPartKey = dialogPartKeys[j];

                this.#storeDialogTypesStyles(
                    dialogTypeKey,
                    dialogPartKey,
                    dialogParts[dialogPartKey]
                );
            }
        }
    }

    /**
     * Sets the theme of dialog
     * @param {string} mode - `dark`, `light`, `auto` (**light** is default)
     */
    static setThemePreference(mode) {
        mode = mode.toLowerCase();

        if (!['dark', 'light', 'auto'].includes(mode)) {
            throw new Error("Mode must be dark, light, or auto.");
        }

        // Remove the previous listener to avoid duplicate listeners.
        if (this.#darkModeMedia) {
            this.#darkModeMedia.removeEventListener('change', this.#handleSystemThemeChange);
            this.#darkModeMedia = null;
        }

        if (mode === 'auto') {
            this.#darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
            this.#darkMode = this.#darkModeMedia.matches;
            this.#themePreference = this.#darkMode ? 'dark' : 'light';
            this.#darkModeMedia.addEventListener('change', this.#handleSystemThemeChange);
        } else {
            this.#themePreference = mode;
            this.#darkMode = mode === 'dark';
        }
    }

    /**
     * Method of Dialog Class that allows user input.
     * 
     * @param {HTMLElement|string|null} target The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param {string} dialogTitle Title of the dialog (only plain text).
     * @param {string} dialogContent Content of the dialog for user to see (plaintext or HTML).
     * @param {Object?} customDialogStyles - Optional custom styles.
     * @returns {Promise<Object>} Resolves when the dialog is closed. `{ output: input.value, option: 0 - Ok, 1 - Cancel }`.
     */
    static async showInputDialogAt(target, dialogTitle, dialogContent, customDialogStyles = {}) {
        if (!(target instanceof HTMLElement)) {
            if (typeof target === 'string' && document.getElementById(target) != null) {
                target = document.getElementById(target);
            } else {
                target = null;
            }
        }

        try {
            this.#validateDialogPartStyles('inputDialog', customDialogStyles);
        } catch(e) {
            console.error(e);
        }
        
        this.#mergeDialogStyles('inputDialog', customDialogStyles);
        const { styles, eventStyles } = this.#getDialogPartsStyles('inputDialog');

        const config = {
            dialog: {
                id: 'inputDialog',
                target: target,
                styles: styles.dialog,
                eventStyles: eventStyles.dialog
            },
            header: {
                tag: 'header',
                id: 'inputDialogHeader',
                styles: styles.header,
                eventStyles: eventStyles.header,
                title: {
                    tag: 'h4',
                    id: 'inputDialogTitle',
                    text: dialogTitle,
                    styles: styles.title,
                    eventStyles: eventStyles.title
                }
            },
            content: {
                tag: 'main',
                id: 'inputDialogContent',
                text: dialogContent,
                styles: styles.content,
                eventStyles: eventStyles.content
            },
            input: {
                id: 'inputDialogInput',
                type: 'text',
                styles: styles.input,
                eventStyles: eventStyles.input
            },
            footer: {
                tag: 'footer',
                id: 'inputDialogFooter',
                styles: styles.footer,
                eventStyles: eventStyles.footer,
                buttons: [
                    {
                        tag: 'button',
                        id: 'inputDialogBtnOk',
                        type: 'submit',
                        text: 'OK',
                        styles: { ...styles.button, ...styles.btnOk },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnOk),
                        option: this.OK_OPTION
                    },
                    {
                        tag: 'button',
                        id: 'inputDialogBtnCancel',
                        type: 'button',
                        text: 'Cancel',
                        styles: { ...styles.button, ...styles.btnCancel },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnCancel),
                        option: this.CANCEL_OPTION
                    }
                ]
            },
            reapplyTheme: (elements) => {
                const { styles, eventStyles } = this.#getDialogPartsStyles('inputDialog');

                this.#applyStyles([
                    {
                        element: elements.dialog,
                        styles: styles.dialog,
                        eventStyles: eventStyles.dialog
                    },
                    {
                        element: elements.header,
                        styles: styles.header,
                        eventStyles: eventStyles.header
                    },
                    {
                        element: elements.title,
                        styles: styles.title,
                        eventStyles: eventStyles.title
                    },
                    {
                        element: elements.content,
                        styles: styles.content,
                        eventStyles: eventStyles.content
                    },
                    {
                        element: elements.input,
                        styles: styles.input,
                        eventStyles: eventStyles.input
                    },
                    {
                        element: elements.footer,
                        styles: styles.footer,
                        eventStyles: eventStyles.footer
                    },
                    {
                        element: elements.button[0],
                        styles: { ...styles.button, ...styles.btnOk },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnOk)
                    },
                    {
                        element: elements.button[1],
                        styles: { ...styles.button, ...styles.btnCancel },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnCancel)
                    }
                ]);
            }
        };

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, false);

        this.#dialogQueue = showFn();

        return await this.#dialogQueue;
    }

    /**
     * Method of Dialog Class that allows user input.
     * Wrapper function of {@link Dialog.showInputDialogAt}.
     * 
     * @param {string} dialogTitle Title of the dialog (only plain text).
     * @param {string} dialogContent Content of the dialog for user to see (plaintext or HTML).
     * @param {Object?} customDialogStyles Optional custom styles.
     * @returns {Promise<Object>} Resolves when the dialog is closed. `{ output: input.value, option: 0 - Ok, 1 - Cancel }`.
     */
    static async showInputDialog(dialogTitle, dialogContent, customDialogStyles = {}) {
        return await this.showInputDialogAt(null, dialogTitle, dialogContent, customDialogStyles);
    }

    /**
     * Method of Dialog Class that shows information message.
     * 
     * @param {HTMLElement|string|null} target The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param {string} dialogTitle Title of the dialog (only plain text).
     * @param {string} dialogContent Content of the dialog for user to see (plaintext or HTML).
     * @param {Object?} customDialogStyles Optional custom styles.
     * @returns {Promise} Resolves when the dialog is closed.
     */
    static async showMessageDialogAt(target, dialogTitle, dialogContent, customDialogStyles = {}) {
        if (!(target instanceof HTMLElement)) {
            if (typeof target === 'string' && document.getElementById(target) != null) {
                target = document.getElementById(target);
            } else {
                target = null;
            }
        }

        try {
            this.#validateDialogPartStyles('messageDialog', customDialogStyles);
        } catch(e) {
            console.error(e);
        }

        this.#mergeDialogStyles('messageDialog', customDialogStyles);
        const { styles, eventStyles } = this.#getDialogPartsStyles('messageDialog');

        const config = {
            dialog: {
                id: 'messageDialog',
                target: target,
                styles: styles.dialog,
                eventStyles: eventStyles.dialog
            },
            header: {
                tag: 'header',
                id: 'messageDialogHeader',
                styles: styles.header,
                eventStyles: eventStyles.header,
                title: {
                    tag: 'h4',
                    id: 'messageDialogTitle',
                    text: dialogTitle,
                    styles: styles.title,
                    eventStyles: eventStyles.title
                }
            },
            content: {
                tag: 'main',
                id: 'messageDialogContent',
                text: dialogContent,
                styles: styles.content,
                eventStyles: eventStyles.content
            },
            footer: {
                tag: 'footer',
                id: 'messageDialogFooter',
                styles: styles.footer,
                eventStyles: eventStyles.footer,
                buttons: [
                    {
                        tag: 'button',
                        id: 'messageDialogBtnOk',
                        type: 'button',
                        text: 'OK',
                        styles: { ...styles.button, ...styles.btnOk },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnOk),
                        option: this.OK_OPTION
                    }
                ]
            },
            reapplyTheme: (elements) => {
                const { styles, eventStyles } = this.#getDialogPartsStyles('messageDialog');

                this.#applyStyles([
                    {
                        element: elements.dialog,
                        styles: styles.dialog,
                        eventStyles: eventStyles.dialog
                    },
                    {
                        element: elements.header,
                        styles: styles.header,
                        eventStyles: eventStyles.header
                    },
                    {
                        element: elements.title,
                        styles: styles.title,
                        eventStyles: eventStyles.title
                    },
                    {
                        element: elements.content,
                        styles: styles.content,
                        eventStyles: eventStyles.content
                    },
                    {
                        element: elements.footer,
                        styles: styles.footer,
                        eventStyles: eventStyles.footer
                    },
                    {
                        element: elements.button[0],
                        styles: { ...styles.button, ...styles.btnOk },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnOk)
                    }
                ]);
            }
        };

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, false);

        this.#dialogQueue = showFn();

        return await this.#dialogQueue;
    }

    /**
     * Method of Dialog Class that shows information message.
     * Wrapper function of {@link Dialog.showMessageDialogAt}.
     * 
     * @param {string} dialogTitle Title of the dialog (only plain text).
     * @param {string} dialogContent Content of the dialog for user to see (plaintext or HTML).
     * @param {Object?} customDialogStyles Optional custom styles.
     * @returns {Promise} Resolves when the dialog is closed.
     */
    static async showMessageDialog(dialogTitle, dialogContent, customDialogStyles = {}) {
        await this.showMessageDialogAt(null, dialogTitle, dialogContent, customDialogStyles);
    }

    /**
     * Method of Dialog Class that asks for YES or NO answer.
     * 
     * @param {HTMLElement|string|null} target The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param {string} dialogTitle Title of the dialog (only plain text).
     * @param {string} dialogContent Content of the dialog for user to see (plaintext or HTML).
     * @param {Object?} customDialogStyles Optional custom styles.
     * @returns {Promise<Object>} Resolves when the dialog is closed. `{ output: null, option: 2 - Yes, 3 - No }`.
     */
    static async showConfirmDialogAt(target, dialogTitle, dialogContent, customDialogStyles = {}) {
        if (!(target instanceof HTMLElement)) {
            if (typeof target === 'string' && document.getElementById(target) != null) {
                target = document.getElementById(target);
            } else {
                target = null;
            }
        }

        try {
            this.#validateDialogPartStyles('confirmDialog', customDialogStyles);
        } catch(e) {
            console.error(e);
        }

        this.#mergeDialogStyles('confirmDialog', customDialogStyles);
        const { styles, eventStyles } = this.#getDialogPartsStyles('confirmDialog');

        const config = {
            dialog: {
                id: 'confirmDialog',
                target: target,
                styles: styles.dialog,
                eventStyles: eventStyles.dialog
            },
            header: {
                tag: 'header',
                id: 'confirmDialogHeader',
                styles: styles.header,
                eventStyles: eventStyles.header,
                title: {
                    tag: 'h4',
                    id: 'confirmDialogTitle',
                    text: dialogTitle,
                    styles: styles.title,
                    eventStyles: eventStyles.title
                }
            },
            content: {
                tag: 'main',
                id: 'confirmDialogContent',
                text: dialogContent,
                styles: styles.content,
                eventStyles: eventStyles.content
            },
            footer: {
                tag: 'footer',
                id: 'confirmDialogFooter',
                styles: styles.footer,
                eventStyles: eventStyles.footer,
                buttons: [
                    {
                        tag: 'button',
                        id: 'confirmDialogBtnYes',
                        type: 'button',
                        text: 'Yes',
                        styles: { ...styles.button, ...styles.btnYes },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnYes),
                        option: this.YES_OPTION
                    },
                    {
                        tag: 'button',
                        id: 'confirmDialogBtnNo',
                        type: 'button',
                        text: 'No',
                        styles: { ...styles.button, ...styles.btnNo },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnNo),
                        option: this.NO_OPTION
                    }
                ]
            },
            reapplyTheme: (elements) => {
                const { styles, eventStyles } = this.#getDialogPartsStyles('confirmDialog');

                this.#applyStyles([
                    {
                        element: elements.dialog,
                        styles: styles.dialog,
                        eventStyles: eventStyles.dialog
                    },
                    {
                        element: elements.header,
                        styles: styles.header,
                        eventStyles: eventStyles.header
                    },
                    {
                        element: elements.title,
                        styles: styles.title,
                        eventStyles: eventStyles.title
                    },
                    {
                        element: elements.content,
                        styles: styles.content,
                        eventStyles: eventStyles.content
                    },
                    {
                        element: elements.footer,
                        styles: styles.footer,
                        eventStyles: eventStyles.footer
                    },
                    {
                        element: elements.button[0],
                        styles: { ...styles.button, ...styles.btnYes },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnYes)
                    },
                    {
                        element: elements.button[1],
                        styles: { ...styles.button, ...styles.btnNo },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnNo)
                    }
                ]);
            }
        };

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, false);

        this.#dialogQueue = showFn();

        return await this.#dialogQueue;
    }

    /**
     * Method of Dialog Class that asks for YES or NO answer.
     * Wrapper function of {@link Dialog.showConfirmDialogAt}.
     * 
     * @param {string} dialogTitle Title of the dialog (only plain text).
     * @param {string} dialogContent Content of the dialog for user to see (plaintext or HTML).
     * @param {Object?} customDialogStyles Optional custom styles.
     * @returns {Promise<Object>} Resolves when the dialog is closed. `{ output: null, option: 2 - Yes, 3 - No }`.
     */
    static async showConfirmDialog(dialogTitle, dialogContent, customDialogStyles = {}) {
        return await this.showConfirmDialogAt(null, dialogTitle, dialogContent, customDialogStyles);
    }

    /**
     * Method of Dialog Class that shows a text message.
     * 
     * @param {HTMLElement|string|null} target The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param {string} dialogContent Content of the dialog for user to see (plaintext or HTML).
     * @param {Object?} customDialogStyles Optional custom styles.
     * @returns {Promise} Resolves when the dialog is closed.
     */
    static async showPlainDialogAt(target, dialogContent, customDialogStyles = {}) {
        if (!(target instanceof HTMLElement)) {
            if (typeof target === 'string' && document.getElementById(target) != null) {
                target = document.getElementById(target);
            } else {
                target = null;
            }
        }

        try {
            this.#validateDialogPartStyles('plainDialog', customDialogStyles);
        } catch(e) {
            console.error(e);
        }

        this.#mergeDialogStyles('plainDialog', customDialogStyles);
        const { styles, eventStyles } = this.#getDialogPartsStyles('plainDialog');

        const config = {
            backdrop: {
                id: 'plainDialogBackdrop',
                styles: styles.backdrop,
                eventStyles: eventStyles.backdrop
            },
            dialog: {
                id: 'plainDialog',
                target: target,
                styles: styles.dialog,
                eventStyles: eventStyles.dialog
            },
            header: {
                tag: 'div',
                id: 'plainDialogHeader',
                styles: styles.header,
                eventStyles: eventStyles.header,
                closeButton: {
                    tag: 'button',
                    id: 'plainDialogBtnClose',
                    buttonKey: 'btnClose',
                    type: 'button',
                    text: '×',
                    styles: { ...styles.button, ...styles.btnClose },
                    eventStyles: deepMerge(eventStyles.button, eventStyles.btnClose)
                }
            },
            content: {
                tag: 'div',
                id: 'plainDialogContent',
                text: dialogContent,
                styles: styles.content,
                eventStyles: eventStyles.content
            },
            reapplyTheme: (elements) => {
                const { styles, eventStyles } = this.#getDialogPartsStyles('plainDialog');

                this.#applyStyles([
                    {
                        element: elements.backdrop,
                        styles: styles.backdrop,
                        eventStyles: eventStyles.backdrop
                    },
                    {
                        element: elements.dialog,
                        styles: styles.dialog,
                        eventStyles: eventStyles.dialog
                    },
                    {
                        element: elements.header,
                        styles: styles.header,
                        eventStyles: eventStyles.header
                    },
                    {
                        element: elements.button,
                        styles: { ...styles.button, ...styles.btnClose },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnClose)
                    },
                    {
                        element: elements.content,
                        styles: styles.content,
                        eventStyles: eventStyles.content
                    }
                ]);
            },
        };

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, true);

        this.#dialogQueue = showFn();

        return await this.#dialogQueue;
    }

    /**
     * Method of Dialog Class that shows a text message.
     * Wrapper function of {@link Dialog.showPlainDialogAt}
     * 
     * @param {string} dialogContent Content of the dialog for user to see (plaintext or HTML).
     * @param {Object?} customDialogStyles Optional custom styles.
     * @returns {Promise} Resolves when the dialog is closed.
     */
    static async showPlainDialog(dialogContent, customDialogStyles = {}) {
        await this.showPlainDialogAt(null, dialogContent, customDialogStyles);
    }

    /**
     * Instruction dialog that displays multiple messages (as an array of strings)
     * with pagination controls (Previous and Next). If only one message is provided,
     * a single OK button appears. On multiple messages the Next button becomes OK on
     * the final slide.
     * 
     * @param {HTMLElement|string|null} target The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param {string} dialogTitle The title of the dialog.
     * @param {Array<string>} dialogContents Array of message strings (plaintext or HTML).
     * @param {Object?} customDialogStyles Optional custom styles.
     * @returns {Promise} Resolves when the dialog is closed.
     */
    static async showInstructionDialogAt(target, dialogTitle, dialogContents, customDialogStyles = {}) {
        if (!(target instanceof HTMLElement)) {
            if (typeof target === 'string' && document.getElementById(target) != null) {
                target = document.getElementById(target);
            } else {
                target = null;
            }
        }

        if (!Array.isArray(dialogContents)) {
            await this.showMessageDialog('Invalid Content', 'The contents must be array of strings.');

            return;
        }

        function validateContents() {
            return dialogContents.every(content => typeof content === 'string');
        }

        let contents = [];
        let currentIndex = 0;
        const totalContents = dialogContents.length;

        if (validateContents()) {
            if (totalContents > 0) {
                contents = dialogContents;
            } else {
                await this.showMessageDialog('Empty content.', 'Please add content at least 1.');

                return;
            }
        } else {
            await this.showMessageDialog('Invalid content.', 'Include only strings.');

            return;
        }

        try {
            this.#validateDialogPartStyles('instructionDialog', customDialogStyles);
        } catch(e) {
            console.error(e);
        }

        this.#mergeDialogStyles('instructionDialog', customDialogStyles);
        const { styles, eventStyles } = this.#getDialogPartsStyles('instructionDialog');

        const config = {
            dialog: {
                id: 'instructionDialog',
                target: target,
                styles: styles.dialog,
                eventStyles: eventStyles.dialog
            },
            header: {
                tag: 'header',
                id: 'instructionDialogHeader',
                styles: styles.header,
                eventStyles: eventStyles.header,
                title: {
                    tag: 'h4',
                    id: 'instructionDialogTitle',
                    text: dialogTitle + ` (${currentIndex + 1}/${totalContents})`,
                    styles: styles.title,
                    eventStyles: eventStyles.title
                }
            },
            content: {
                tag: 'main',
                id: 'instructionDialogContent',
                text: contents[0],
                styles: styles.content,
                eventStyles: eventStyles.content
            },
            footer: {
                tag: 'footer',
                id: 'instructionDialogFooter',
                styles: styles.footer,
                eventStyles: eventStyles.footer,
                buttons: []
            },
            reapplyTheme: (elements) => {
                const { styles, eventStyles } = this.#getDialogPartsStyles('instructionDialog');

                this.#applyStyles([
                    {
                        element: elements.dialog,
                        styles: styles.dialog,
                        eventStyles: eventStyles.dialog
                    },
                    {
                        element: elements.header,
                        styles: styles.header,
                        eventStyles: eventStyles.header
                    },
                    {
                        element: elements.title,
                        styles: styles.title,
                        eventStyles: eventStyles.title
                    },
                    {
                        element: elements.content,
                        styles: styles.content,
                        eventStyles: eventStyles.content
                    },
                    {
                        element: elements.footer,
                        styles: styles.footer,
                        eventStyles: eventStyles.footer
                    }
                ]);

                if (totalContents === 1) {
                    this.#applyStyles({
                        element: elements.button[0],
                        styles: { ...styles.button, ...styles.btnOk },
                        eventStyles: deepMerge(eventStyles.button, eventStyles.btnOk)
                    });
                } else {
                    this.#applyStyles([
                        {
                            element: elements.button[0],
                            styles: { ...styles.button, ...styles.btnPrev },
                            eventStyles: deepMerge(eventStyles.button, eventStyles.btnPrev)
                        },
                        {
                            element: elements.button[1],
                            styles: { ...styles.button, ...styles.btnNext },
                            eventStyles: deepMerge(eventStyles.button, eventStyles.btnNext)
                        }
                    ]);
                }
            }
        };

        // If only one message, simply add an OK button.
        if (totalContents === 1) {
            config.footer.buttons.push({
                tag: 'button',
                id: 'instructionDialogBtnOk',
                type: 'button',
                text: 'OK',
                styles: { ...styles.button, ...styles.btnOk },
                eventStyles: deepMerge(eventStyles.button, eventStyles.btnOk),
                option: this.OK_OPTION,
                navigation: false
            });
        } else {
            config.footer.buttons.push({
                tag: 'button',
                id: 'instructionDialogBtnPrev',
                type: 'button',
                text: '< Previous',
                styles: { ...styles.button, ...styles.btnPrev },
                eventStyles: deepMerge(eventStyles.button, eventStyles.btnPrev),
                option: null,
                navigation: true,
                callback: (e) => {
                    e.target.focus();

                    if (currentIndex > 0) {
                        currentIndex--;
                        updateContents();

                        document.getElementById('instructionDialogTitle')
                            .innerText = dialogTitle + ` (${currentIndex + 1}/${totalContents})`;
                    }
                }
            },
            {
                tag: 'button',
                id: 'instructionDialogBtnNext',
                type: 'button',
                text: 'Next >',
                styles: { ...styles.button, ...styles.btnNext },
                eventStyles: deepMerge(eventStyles.button, eventStyles.btnNext),
                option: null,
                navigation: true,
                callback: (e) => {
                    e.target.focus();
                    
                    if (currentIndex < totalContents - 1) {
                        currentIndex++;
                        updateContents();

                        document.getElementById('instructionDialogTitle')
                            .innerText = dialogTitle + ` (${currentIndex + 1}/${totalContents})`;
                    } else if (currentIndex === totalContents - 1) {
                        config.footer.buttons[1].navigation = false;
                    }
                }
            });
        }

        // Helper functions to update the button texts.
        const updateContents = () => {
            const instructionDialogContent = document.getElementById('instructionDialogContent');

            if (this.#hasHTMLTag(contents[currentIndex])) {
                instructionDialogContent.innerHTML = contents[currentIndex];
            } else {
                instructionDialogContent.innerText = contents[currentIndex];
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
                btnNext.innerText = (currentIndex === totalContents - 1) ? 'OK' : 'Next >';
                // Remove navigation flag on the Next button if we're on the final card.
                btnNext.navigation = (currentIndex === totalContents - 1) ? false : true;
            }
        }

        await this.#dialogQueue;

        const showFn = this.#buildDialogWrapper(config, false);

        this.#dialogQueue = showFn();

        updateContents();

        return await this.#dialogQueue;
    }

    /**
     * Instruction dialog that displays multiple messages (as an array of strings)
     * with pagination controls (Previous and Next). If only one message is provided,
     * a single OK button appears. On multiple messages the Next button becomes OK on
     * the final slide.
     * Wrapper function of {@link Dialog.showInstructionDialogAt}
     *
     * @param {string} dialogTitle The title of the dialog.
     * @param {Array<string>} dialogContents Array of message strings (plaintext or HTML).
     * @param {Object?} customDialogStyles Optional custom styles.
     * @returns {Promise} Resolves when the dialog is closed.
     */
    static async showInstructionDialog(dialogTitle, dialogContents, customDialogStyles = {}) {
        await this.showInstructionDialogAt(null, dialogTitle, dialogContents, customDialogStyles);
    }

    static toString() {
        return 'Dialog{OK_OPTION=' + Dialog.OK_OPTION + ',' +
            'CANCEL_OPTION=' + Dialog.CANCEL_OPTION + ',' +
            'YES_OPTION=' + Dialog.YES_OPTION + ',' +
            'NO_OPTION=' + Dialog.NO_OPTION + '}';
    }
}