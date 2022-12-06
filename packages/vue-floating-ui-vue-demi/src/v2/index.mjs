import { Vue2 } from 'vue-demi';

const teleportOutletByTeleport = new WeakMap();

function getDocument(value) {
  return value?.ownerDocument ?? document;
}

function getWindow(value) {
  return getDocument(value).defaultView ?? window;
}

function isElement(value) {
  return value ? value instanceof getWindow(value).Element : false;
}

function getTeleportFirstNode(teleport) {
  const nodes = teleport.$slots.default ?? [];

  if (nodes.length === 0) {
    return null;
  }

  if (nodes.length > 1) {
    console.warn('[Vue Floating UI]: Multiple template root elements is not supported');
  }

  return nodes[0];
}

function mountTeleportOutlet(teleport, to) {
  if (teleportOutletByTeleport.has(teleport)) {
    return;
  }

  const target = typeof to === 'string' ? document.querySelector(to) : to;

  if (!isElement(target)) {
    console.warn('[Vue Floating UI]: Invalid Teleport target on mount:', target, `(${typeof target})`);
    return;
  }

  const teleportOutlet = new Vue2({
    name: 'TeleportOutlet',
    el: target.appendChild(getDocument(target).createElement('div')),
    parent: teleport,
    destroyed() {
      this.$el.remove();
    },
    render() {
      return getTeleportFirstNode(this.$parent);
    },
  });

  teleportOutletByTeleport.set(teleport, teleportOutlet);
}

function unmountTeleportOutlet(teleport) {
  if (teleportOutletByTeleport.has(teleport)) {
    teleportOutletByTeleport.get(teleport).$destroy();
    teleportOutletByTeleport.delete(teleport);
  }
}

function updateTeleportOutlet(teleport) {
  if (teleportOutletByTeleport.has(teleport)) {
    teleportOutletByTeleport.get(teleport).$forceUpdate();
  }
}

export const Teleport = Vue2.extend({
  name: 'Teleport',
  props: ['to', 'disabled'],
  watch: {
    to: {
      immediate: true,
      handler(to) {
        if (!this.disabled) {
          unmountTeleportOutlet(this);
          mountTeleportOutlet(this, to);
        }
      },
    },
    disabled(disabled) {
      if (disabled) {
        unmountTeleportOutlet(this);
      } else {
        this.$nextTick(() => mountTeleportOutlet(this, this.to));
      }
    },
  },
  updated() {
    updateTeleportOutlet(this);
  },
  beforeDestroy() {
    unmountTeleportOutlet(this);
  },
  render() {
    if (this.disabled) {
      return getTeleportFirstNode(this);
    }
  },
});

export * from 'vue-demi';
