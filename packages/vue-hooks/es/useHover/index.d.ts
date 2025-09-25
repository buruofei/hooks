import { type Ref } from 'vue';
import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    onEnter?: () => void;
    onLeave?: () => void;
    onChange?: (isHovering: boolean) => void;
}
export default function useHover(target: BasicTarget, options?: Options): Ref<boolean>;
