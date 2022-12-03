import {
  type Ref,
  computed,
  getCurrentScope,
  inject,
  onScopeDispose,
  shallowReadonly,
  shallowRef,
  unref,
  watch,
} from 'vue-floating-ui-vue-demi';

import { FLOATING_TELEPORT_NODE_KEY } from '../constants/floatingTeleport';
import type { MaybeReadonlyRef } from '../types';
import { getId } from '../utils/getId';

export type UseFloatingTeleportNodeOptions = {
  id?: MaybeReadonlyRef<string | undefined>;
};

export function useFloatingTeleportNode(options: UseFloatingTeleportNodeOptions = {}) {
  const id = computed(() => unref(options.id));
  const node = shallowRef<HTMLElement | null>(null);
  const container = inject(FLOATING_TELEPORT_NODE_KEY, null);

  let createNodeCleanup: void | (() => void);

  function cleanup() {
    if (typeof createNodeCleanup === 'function') {
      createNodeCleanup();
      createNodeCleanup = undefined;
    }
  }

  function getNode() {
    return typeof id.value === 'string' ? document.getElementById(id.value) : null;
  }

  function createNode() {
    const node = document.createElement('div');
    const parent = container?.value ?? document.body;

    node.id = typeof id.value === 'string' ? id.value : getId();

    parent.appendChild(node);

    createNodeCleanup = () => {
      parent.removeChild(node);
    };

    return node;
  }

  function update() {
    cleanup();

    node.value = getNode() ?? createNode();
  }

  watch(id, update, { flush: 'sync', immediate: true });

  if (getCurrentScope()) {
    onScopeDispose(cleanup);
  }

  return shallowReadonly(node as Ref<HTMLElement>);
}
