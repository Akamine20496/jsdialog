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
    static showInputDialog(dialogTitle: string, dialogContent: string, customDialogStyle?: Record<string, any>): Promise<{ output: string, option: number }>;

    /**
     * Method of Dialog Class that shows an information message.
     * @param dialogTitle - Title of the dialog (only plain text).
     * @param dialogContent - Content of the dialog for the user to see (allows element tags).
     * @param customDialogStyle - Optional custom styles (including eventStyles).
     * @returns A promise that resolves when the dialog is closed.
     */
    static showMessageDialog(dialogTitle: string, dialogContent: string, customDialogStyle?: Record<string, any>): Promise<void>;

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
    static showConfirmDialog(dialogTitle: string, dialogContent: string, customDialogStyle?: Record<string, any>): Promise<{ output: null, option: number }>;

    /**
     * Method of Dialog Class that shows an information message and is customizable.
     * @param dialogContent - Content of the dialog for the user to see (allows element tags).
     * @param customDialogStyle - Optional custom styles (including eventStyles).
     * @returns A promise that resolves when the dialog is closed.
     */
    static showPlainDialog(dialogContent: string, customDialogStyle?: Record<string, any>): Promise<void>;

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
    static showInstructionDialog(dialogTitle: string, dialogContents: string[], customDialogStyle?: Record<string, any>): Promise<void>;
}

export default Dialog;