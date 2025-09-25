import { type Ref } from 'vue';
type GetStateAction<S> = () => S;
declare function useGetState<S>(initialState: S | (() => S)): [Ref<S>, (value: S | ((prev: S) => S)) => void, GetStateAction<S>];
declare function useGetState<S = undefined>(): [
    Ref<S | undefined>,
    (value: S | ((prev: S | undefined) => S | undefined)) => void,
    GetStateAction<S | undefined>
];
export default useGetState;
