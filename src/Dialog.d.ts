import * as CSS from 'csstype';

// declare interface for the customDialogStyle

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
 * Event Styling { eventname: { 'property': 'value' } }.
 * 
 * This version provides autocompletion for common event names,
 * marks them as optional, and allows additional event names.
 */
export interface EventStyle extends Partial<Record<EventName, CssStyle>> {
    [eventname: string]: CssStyle | undefined;
}

/**
 * Element Event Styling 
 */
export interface ElementEventStyle {
    backdrop?: EventStyle;
    dialog?: EventStyle;
    header?: EventStyle;
    content?: EventStyle;
    footer?: EventStyle;
    button?: EventStyle;
    [elementNameId: string]: EventStyle;
}

/**
 * Dialog Styling element: { 'property': 'value' } (except eventStyles)
 */
export interface CustomDialogStyle {
    backdrop?: CssStyle;
    dialog?: CssStyle;
    header?: CssStyle;
    content?: CssStyle;
    footer?: CssStyle;
    btnOk?: CssStyle;
    btnCancel?: CssStyle;
    btnYes?: CssStyle;
    btnNo?: CssStyle;
    btnPrev?: CssStyle;
    btnNext?: CssStyle;
    eventStyles?: ElementEventStyle;
}

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
     * Method of Dialog Class that allows user input.
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (allows element tags).
     * @param customDialogStyle - Optional custom styles (including eventStyles).
     * @returns A promise that resolves when the dialog is closed. 
     * The returned object contains:
     *   - `output`: The value of the input.
     *   - `option`: 0 for "Ok", 1 for "Cancel".
     */
    static showInputDialog(dialogTitle: string, dialogContent: string, customDialogStyle?: CustomDialogStyle): Promise<{ output: string, option: number }>;

    /**
     * Method of Dialog Class that shows an information message.
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (allows element tags).
     * @param customDialogStyle - Optional custom styles (including eventStyles).
     * @returns A promise that resolves when the dialog is closed.
     */
    static showMessageDialog(dialogTitle: string, dialogContent: string, customDialogStyle?: CustomDialogStyle): Promise<void>;

    /**
     * Method of Dialog Class that asks for a YES or NO answer.
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (allows element tags).
     * @param customDialogStyle - Optional custom styles (including eventStyles).
     * @returns A promise that resolves when the dialog is closed. 
     * The returned object contains:
     *   - `output`: Always `null`.
     *   - `option`: 2 for "Yes", 3 for "No".
     */
    static showConfirmDialog(dialogTitle: string, dialogContent: string, customDialogStyle?: CustomDialogStyle): Promise<{ output: null, option: number }>;

    /**
     * Method of Dialog Class that shows an information message and is customizable.
     * @param dialogContent - Content of the dialog for the user to see (allows element tags).
     * @param customDialogStyle - Optional custom styles (including eventStyles).
     * @returns A promise that resolves when the dialog is closed.
     */
    static showPlainDialog(dialogContent: string, customDialogStyle?: CustomDialogStyle): Promise<void>;

    /**
     * Method of Dialog Class that displays multiple messages (as an array of strings)
     * with pagination controls (Previous and Next). If only one message is provided,
     * a single OK button appears. On multiple messages, the Next button becomes OK on
     * the final slide.
     *
     * @param dialogTitle - The title of the dialog.
     * @param dialogContents - Array of message strings (plaintext or HTML).
     * @param customDialogStyle - Optional custom styles (including eventStyles).
     * @returns A promise that resolves when the dialog is closed.
     */
    static showInstructionDialog(dialogTitle: string, dialogContents: string[], customDialogStyle?: CustomDialogStyle): Promise<void>;
}

export default Dialog;