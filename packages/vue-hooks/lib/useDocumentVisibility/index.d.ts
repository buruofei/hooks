import { type Ref } from 'vue';
type VisibilityState = 'hidden' | 'visible' | 'prerender' | undefined;
declare function useDocumentVisibility(): Ref<VisibilityState>;
export default useDocumentVisibility;
