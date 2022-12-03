import { type VNode, h as createElement } from 'vue-floating-ui-vue-demi';

export const h = createElement as (type: unknown, data?: unknown, children?: unknown) => VNode;
