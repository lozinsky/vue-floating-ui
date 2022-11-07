import type { ComponentPublicInstance, Ref } from 'vue-demi';

export type MaybeReadonlyRef<T> = T | Readonly<Ref<T>>;

export type MaybeElement<T> = T | ComponentPublicInstance | null;
