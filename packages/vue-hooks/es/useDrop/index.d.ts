import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    onFiles?: (files: File[], event?: DragEvent) => void;
    onUri?: (url: string, event?: DragEvent) => void;
    onDom?: (content: any, event?: DragEvent) => void;
    onText?: (text: string, event?: ClipboardEvent) => void;
    onDragEnter?: (event?: DragEvent) => void;
    onDragOver?: (event?: DragEvent) => void;
    onDragLeave?: (event?: DragEvent) => void;
    onDrop?: (event?: DragEvent) => void;
    onPaste?: (event?: ClipboardEvent) => void;
}
declare const useDrop: (target: BasicTarget, options?: Options) => void;
export default useDrop;
