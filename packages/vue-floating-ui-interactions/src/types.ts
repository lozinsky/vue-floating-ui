import type { Ref } from 'vue-floating-ui-vue-demi';

export type MaybeReadonlyRef<T> = T | Readonly<Ref<T>>;
