import type { InjectionKey, Ref } from 'vue-floating-ui-vue-demi';

export const FLOATING_TELEPORT_NODE_KEY = Symbol() as InjectionKey<Readonly<Ref<HTMLElement>> | null>;
