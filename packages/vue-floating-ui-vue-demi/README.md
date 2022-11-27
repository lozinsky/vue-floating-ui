# Vue Floating UI Vue Demi

This is a wrapper of the [`vue-demi`](https://github.com/vueuse/vue-demi) package that provides some additional polyfills e.g. `Teleport` component.

## Limitations

`Teleport` component polyfill supports only one template root element:

<!-- prettier-ignore -->
```html
<script setup>
import { Teleport } from 'vue-floating-ui-vue-demi';
</script>

<template>
  <Teleport to="#outlet">
    <div>This will be rendered</div>
    <div>but this won't.</div>
  </Teleport>
</template>
```
