import * as CSS from 'csstype';

/**
 * CSS Styling { 'property': 'value' } with dash-case keys.
 */
export type CssStyle = CSS.PropertiesHyphen;

/**
 * Event Names
 */
export type EventName =
  | 'click'
  | 'dblclick'
  | 'mousedown'
  | 'mouseup'
  | 'mouseenter'
  | 'mouseleave'
  | 'mouseover'
  | 'mouseout'
  | 'blur'
  | 'focus'
  | 'focusin'
  | 'focusout'
  | 'keydown'
  | 'keyup'
  | 'keypress'
  | 'touchstart'
  | 'touchmove'
  | 'touchend'
  | 'touchcancel'
  | 'change'
  | 'input';

/**
 * Event Styling { eventName: { 'property': 'value' } }.
 */
export interface EventStyle {
    [eventName: EventName]: CssStyle;
}

/**
 * Styles for Light and Dark mode.
 */
export interface ThemeMode<T> {
    light?: T;
    dark?: T;
}

/**
 * CSS styles and event styles for a dialog part.
 */
export interface Styling {
    styles?: ThemeMode<CssStyle>;
    eventStyles?: ThemeMode<EventStyle>;
}

// Dialog Parts

export interface PlainDialogParts {
    backdrop?: Styling;
    dialog?: Styling;
    header?: Styling;
    content?: Styling;
    button?: Styling;
    btnClose?: Styling;
}

export interface InputDialogParts {
    dialog?: Styling;
    header?: Styling;
    title?: Styling;
    content?: Styling;
    footer?: Styling;
    button?: Styling;
    btnOk?: Styling;
    btnCancel?: Styling;
}

export interface MessageDialogParts {
    dialog?: Styling;
    header?: Styling;
    title?: Styling;
    content?: Styling;
    footer?: Styling;
    button?: Styling;
    btnOk?: Styling;
}

export interface ConfirmDialogParts {
    dialog?: Styling;
    header?: Styling;
    title?: Styling;
    content?: Styling;
    footer?: Styling;
    button?: Styling;
    btnYes?: Styling;
    btnNo?: Styling;
}

export interface InstructionDialogParts {
    dialog?: Styling;
    header?: Styling;
    title?: Styling;
    content?: Styling;
    footer?: Styling;
    button?: Styling;
    btnOk?: Styling;
    btnPrev?: Styling;
    btnNext?: Styling;
}

/**
 * Types of dialog
 */
export interface DialogTypes {
    plainDialog?: PlainDialogParts;
    inputDialog?: InputDialogParts;
    messageDialog?: MessageDialogParts;
    confirmDialog?: ConfirmDialogParts;
    instructionDialog?: InstructionDialogParts;
}

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
declare class Dialog {
    /**
     * State of OK (0)
     */
    static OK_OPTION: number;
    /**
     * State of CANCEL (1)
     */
    static CANCEL_OPTION: number;
    /**
     * State of YES (2)
     */
    static YES_OPTION: number;
    /**
     * State of NO (3)
     */
    static NO_OPTION: number;

    /**
     * Configures custom styles and event styles for different dialog types.
     * @param dialogTypesStylesConfig Custom style configuration keyed by dialog type.
     */
    static setDialogTypesStyles(dialogTypesStylesConfig: Array<DialogTypes>): void;

    /**
     * Sets the theme of dialog
     * @param mode - `dark`, `light`, `auto` (**light** is default)
     */
    static setThemePreference(mode: 'dark'|'light'|'auto'): void;

    /**
     * Method of Dialog Class that allows user input.
     * 
     * @param target - The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed. 
     * The returned object contains:
     *   - `output`: The value of the input.
     *   - `option`: 0 for "Ok", 1 for "Cancel".
     */
    static showInputDialogAt(target: HTMLElement|string|null, dialogTitle: string, dialogContent: string, customDialogStyles?: InputDialogParts): Promise<{ output: string, option: number }>;

    /**
     * Method of Dialog Class that allows user input.
     * Wrapper function of {@link Dialog.showMessageDialogAt}.
     * 
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed. 
     * The returned object contains:
     *   - `output`: The value of the input.
     *   - `option`: 0 for "Ok", 1 for "Cancel".
     */
    static showInputDialog(dialogTitle: string, dialogContent: string, customDialogStyles?: InputDialogParts): Promise<{ output: string, option: number }>;

    /**
     * Method of Dialog Class that shows an information message.
     * 
     * @param target - The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed.
     */
    static showMessageDialogAt(target: HTMLElement|string|null, dialogTitle: string, dialogContent: string, customDialogStyles?: MessageDialogParts): Promise<void>;

    /**
     * Method of Dialog Class that shows an information message.
     * Wrapper function of {@link Dialog.showMessageDialogAt}.
     * 
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed.
     */
    static showMessageDialog(dialogTitle: string, dialogContent: string, customDialogStyles?: MessageDialogParts): Promise<void>;

    /**
     * Method of Dialog Class that asks for a YES or NO answer.
     * 
     * @param target - The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed. 
     * The returned object contains:
     *   - `output`: Always `null`.
     *   - `option`: 2 for "Yes", 3 for "No".
     */
    static showConfirmDialogAt(target: HTMLElement|string|null, dialogTitle: string, dialogContent: string, customDialogStyles?: ConfirmDialogParts): Promise<{ output: null, option: number }>;

    /**
     * Method of Dialog Class that asks for a YES or NO answer.
     * Wrapper function of {@link Dialog.showConfirmDialogAt}
     * 
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed. 
     * The returned object contains:
     *   - `output`: Always `null`.
     *   - `option`: 2 for "Yes", 3 for "No".
     */
    static showConfirmDialog(dialogTitle: string, dialogContent: string, customDialogStyles?: ConfirmDialogParts): Promise<{ output: null, option: number }>;

    /**
     * Method of Dialog Class that shows an information message and is customizable.
     * 
     * @param target - The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param dialogContent - Content of the dialog for the user to see (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed.
     */
    static showPlainDialogAt(target: HTMLElement|string|null, dialogContent: string, customDialogStyles?: PlainDialogParts): Promise<void>;

    /**
     * Method of Dialog Class that shows an information message and is customizable.
     * Wrapper function of {@link Dialog.showPlainDialogAt}
     * 
     * @param dialogContent - Content of the dialog for the user to see (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed.
     */
    static showPlainDialog(dialogContent: string, customDialogStyles?: PlainDialogParts): Promise<void>;
    
    /**
     * Method of Dialog Class that displays multiple messages (as an array of strings)
     * with pagination controls (Previous and Next). If only one message is provided,
     * a single OK button appears. On multiple messages, the Next button becomes OK on
     * the final slide.
     *
     * @param target - The target element or its ID. Defaults to `document.body` if `null` or equivalent.
     * @param dialogTitle - The title of the dialog.
     * @param dialogContents - Array of message strings (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed.
     */
    static showInstructionDialogAt(target: HTMLElement|string|null, dialogTitle: string, dialogContents: string[], customDialogStyles?: InstructionDialogParts): Promise<void>;

    /**
     * Method of Dialog Class that displays multiple messages (as an array of strings)
     * with pagination controls (Previous and Next). If only one message is provided,
     * a single OK button appears. On multiple messages, the Next button becomes OK on
     * the final slide.
     * Wrapper function of {@link Dialog.showInstructionDialogAt}
     *
     * @param dialogTitle - The title of the dialog.
     * @param dialogContents - Array of message strings (plaintext or HTML).
     * @param customDialogStyles - Optional custom styles.
     * @returns A promise that resolves when the dialog is closed.
     */
    static showInstructionDialog(dialogTitle: string, dialogContents: string[], customDialogStyles?: InstructionDialogParts): Promise<void>;

    /**
     * String representation of class
     */
    static toString(): string
}

export default Dialog;