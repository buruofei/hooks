import { type Ref } from 'vue';
export interface NetworkState {
    since?: Date;
    online?: boolean;
    rtt?: number;
    type?: string;
    downlink?: number;
    saveData?: boolean;
    downlinkMax?: number;
    effectiveType?: string;
}
declare function useNetwork(): Ref<NetworkState>;
export default useNetwork;
