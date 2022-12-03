import {
  type EffectScope,
  type Ref,
  defineComponent,
  effectScope,
  isVue2,
  provide,
  Teleport,
  toRef,
  watch,
} from 'vue-floating-ui-vue-demi';

import { useFloatingTeleportNode } from '../composables/useFloatingTeleportNode';
import { FLOATING_TELEPORT_NODE_KEY } from '../constants/floatingTeleport';
import { h } from '../utils/h';

export type FloatingTeleportProps = {
  id?: string;
  root?: string | HTMLElement;
  disabled?: boolean;
};

export const FloatingTeleport = defineComponent({
  name: 'FloatingTeleport',
  props: ['id', 'root', 'disabled'] as unknown as undefined,
  setup(props: FloatingTeleportProps, { slots }) {
    const id = toRef(props, 'id');
    const root = toRef(props, 'root');
    const disabled = toRef(props, 'disabled');

    let to: Ref<string | HTMLElement | undefined> | undefined;
    let scope: EffectScope | undefined;

    function cleanup() {
      if (scope !== undefined) {
        scope.stop();
        scope = undefined;
      }

      to = undefined;
    }

    function update() {
      cleanup();

      if (root.value === undefined) {
        scope = effectScope();
        to = scope.run(() => useFloatingTeleportNode({ id }));
      } else {
        to = root;
      }
    }

    watch(root, update, { flush: 'sync', immediate: true });
    provide(FLOATING_TELEPORT_NODE_KEY, to);

    if (isVue2) {
      return () => {
        if (slots.default) {
          return h(Teleport, { props: { to: to!.value, disabled: disabled.value } }, slots.default());
        }
      };
    }

    return () => {
      if (slots.default) {
        return h(Teleport, { to: to!.value, disabled: disabled.value }, slots.default());
      }
    };
  },
});
