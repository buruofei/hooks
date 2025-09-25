import { type Ref } from 'vue';
declare function useRafState<S>(initialState: S | (() => S)): [Ref<S>, (value: S | ((prevState: S) => S)) => void];
export default useRafState;
