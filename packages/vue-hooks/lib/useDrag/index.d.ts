import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    onDragStart?: (event: DragEvent) => void;
    onDragEnd?: (event: DragEvent) => void;
    dragImage?: {
        image: string | Element;
        offsetX?: number;
        offsetY?: number;
    };
}
declare const useDrag: <T>(data: T, target: BasicTarget, options?: Options) => void;
export default useDrag;
