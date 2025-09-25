interface ScreenfullAPI {
    isEnabled: boolean;
    element: Element | null;
    request: (element?: Element) => Promise<void>;
    exit: () => Promise<void>;
    on: (event: string, callback: () => void) => void;
    off: (event: string, callback: () => void) => void;
}
declare const screenfull: ScreenfullAPI;
export default screenfull;
