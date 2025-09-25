import { type Ref } from 'vue';
export type SetState<S extends Record<string, any>> = <K extends keyof S>(state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null)) => void;
declare const useSetState: <S extends Record<string, any>>(initialState: S | (() => S)) => [Ref<S>, SetState<S>];
export default useSetState;
