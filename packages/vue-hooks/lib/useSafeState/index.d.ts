import { type Ref } from 'vue';
declare function useSafeState<S>(initialState: S | (() => S)): [Ref<S>, (currentState: S | ((prev: S) => S)) => void];
declare function useSafeState<S = undefined>(): [Ref<S | undefined>, (currentState: S | ((prev: S | undefined) => S | undefined)) => void];
export default useSafeState;
