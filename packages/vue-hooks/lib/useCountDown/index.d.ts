export type TDate = string | number | Date;
export interface Options {
    leftTime?: number;
    targetDate?: TDate;
    interval?: number;
    onEnd?: () => void;
}
export interface FormattedRes {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
declare const useCountDown: (options?: Options) => readonly [import("vue").Ref<number, number>, import("vue").ComputedRef<FormattedRes>];
export default useCountDown;
