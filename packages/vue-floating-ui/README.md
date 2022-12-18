> The contents of this repository were moved into the
> [Floating UI](https://github.com/floating-ui/floating-ui) repository. The source code can be
> found in [packages/vue](https://github.com/floating-ui/floating-ui/tree/master/packages/vue).

# Vue Floating UI

> This package is fully inspired by [`@floating-ui/react-dom`](https://floating-ui.com/docs/react-dom) and has the very similar API.

This package exports Vue bindings for the `@floating-ui/dom` package — a library that provides "anchored positioning" for a floating element to position it next to a given reference element.

```sh
npm install vue-floating-ui
```

## Usage

`useFloating` wraps `computePosition` and accepts all of its [options](https://floating-ui.com/docs/computeposition#options). The most basic usage is the following:

<!-- prettier-ignore -->
```html
<script setup>
import { ref } from 'vue';
import { useFloating } from 'vue-floating-ui';

const reference = ref(null);
const floating = ref(null);
const { x, y, strategy } = useFloating(reference, floating);
</script>

<template>
  <button type="button" ref="reference">Button</button>
  <div
    :style="{
      position: strategy,
      top: `${y ?? 0}px`,
      left: `${x ?? 0}px`,
      width: 'max-content',
    }"
    ref="floating"
  >
    Tooltip
  </div>
</template>
```

This will position the floating `Tooltip` element at the **bottom center** of the `Button` element by default.

- `x` and `y` are `Ref` objects that contain the positioning coordinates. These values are `null` initially.
- `strategy` is a `Ref` object with a string value, `'absolute'` (default) or `'fixed'`.

> To understand the fallback `?? 0` values, and the `'max-content'` width, visit [Initial layout](https://floating-ui.com/docs/computePosition#initial-layout).

## Customizing the positioning

View the [`computePosition` options](https://floating-ui.com/docs/computePosition#options). Example:

```js
import { ref } from 'vue';
import { flip, offset, shift, useFloating } from 'vue-floating-ui';

const reference = ref(null);
const floating = ref(null);

useFloating(reference, floating, {
  placement: 'right',
  strategy: 'fixed',
  middleware: [offset(10), flip(), shift()],
});
```

The `useFloating` composable also supports `Ref` options:

```js
import { ref } from 'vue';
import { flip, offset, shift, useFloating } from 'vue-floating-ui';

const reference = ref(null);
const floating = ref(null);
const placement = ref('right');
const strategy = ref('fixed');
const middleware = ref([offset(10), flip(), shift()]);

useFloating(reference, floating, {
  placement,
  strategy,
  middleware,
});
```

## Updating

`useFloating` only calculates the position **once** on render, or when the reference/floating elements changed — for example, the floating element gets mounted via conditional rendering.

To ensure the floating element remains anchored to its reference element while scrolling or resizing, pass the [`autoUpdate`](https://floating-ui.com/docs/autoUpdate) utility to the `whileElementsMounted` option:

```js
import { ref } from 'vue';
import { autoUpdate, useFloating } from 'vue-floating-ui';

const reference = ref(null);
const floating = ref(null);

useFloating(reference, floating, {
  // default
  whileElementsMounted: autoUpdate,

  // or, pass options
  whileElementsMounted(reference, floating, update) {
    // IMPORTANT: Make sure the cleanup function is returned!
    return autoUpdate(reference, floating, update, {
      animationFrame: true,
    });
  },
});
```

`whileElementsMounted` is a fully reactive callback option to handle mounting/unmounting of the elements, which can be useful for other use cases.

Alternatively (or additionally), you may want to update manually in some cases. The composable returns an `update` function to update the position at will:

```js
const { update } = useFloating(reference, floating);
```

## Custom components

Custom component template refs can be passed too:

<!-- prettier-ignore -->
```html
<script setup>
import { ref } from 'vue';
import { useFloating } from 'vue-floating-ui';

import MyButton from './MyButton.vue';
import MyTooltip from './MyTooltip.vue';

const reference = ref(null);
const floating = ref(null);
const { x, y, strategy } = useFloating(reference, floating);
</script>

<template>
  <MyButton ref="reference">Button</MyButton>
  <MyTooltip :strategy="strategy" :y="y" :x="x" ref="floating">Tooltip</MyTooltip>
</template>
```

## Arrow

A template ref can be passed as the `element`:

<!-- prettier-ignore -->
```html
<script setup>
import { computed, ref } from 'vue';
import { arrow, useFloating } from 'vue-floating-ui';

const reference = ref(null);
const floating = ref(null);
const floatingArrow = ref(null);
const { x, y, middlewareData } = useFloating(reference, floating, {
  middleware: [arrow({ element: floatingArrow })],
});
const floatingArrowPosition = computed(() => ({
  x: middlewareData.value.arrow?.x ?? null,
  y: middlewareData.value.arrow?.y ?? null,
}));
</script>

<template>
  <button type="button" ref="reference">Button</button>
  <div ref="floating">
    Tooltip
    <div ref="floatingArrow" />
  </div>
</template>
```

## Arrow styles

In the tutorial, it shows you how to [style the arrow](https://floating-ui.com/docs/tutorial#arrow-middleware).

This styling relies on the **final** (or resultant) placement, which can be different from the preferred one you passed as an option to `useFloating` (if you're using `flip` or `autoPlacement` middleware).

This final placement gets returned from the composable to enable the static side position style:

```js
const { placement } = useFloating(reference, floating);
```

## Virtual Element

See [Virtual Elements](https://floating-ui.com/docs/virtual-elements) for details. Example:

<!-- prettier-ignore -->
```html
<script setup>
import { onMounted, ref } from 'vue';
import { useFloating } from 'vue-floating-ui';

const reference = ref(null);
const floating = ref(null);
const { x, y, strategy } = useFloating(reference, floating);

onMounted(() => {
  /**
   * Assign the virtual element to reference inside
   * a lifecycle hook or effect or event handler.
   */
  reference.value = {
    getBoundingClientRect() {
      return {
        // ...
      };
    },
  };
});
</script>

<template>
  <div
    :style="{
      position: strategy,
      top: `${y ?? 0}px`,
      left: `${x ?? 0}px`,
      width: 'max-content',
    }"
    ref="floating"
  >
    Tooltip
  </div>
</template>
```

## Examples

> These are just examples. The component APIs are not designed perfectly, but you can use them as a starting point for your own components and design the API however you like.

- [Tooltip](https://codesandbox.io/p/sandbox/vue-floating-ui-tooltip-8718xk?file=/src/components/Tooltip.vue)
