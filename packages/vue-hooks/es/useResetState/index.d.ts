import { type Ref } from 'vue';
type ResetState = () => void;
declare const useResetState: <S>(initialState: S | (() => S)) => [Ref<S>, (value: S | ((prev: S) => S)) => void, ResetState];
export default useResetState;
