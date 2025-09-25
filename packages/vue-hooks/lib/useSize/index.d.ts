import { type Ref } from 'vue';
import type { BasicTarget } from '../utils/domTarget';
type Size = {
    width: number;
    height: number;
};
declare function useSize(target: BasicTarget): Ref<Size | undefined>;
export default useSize;
