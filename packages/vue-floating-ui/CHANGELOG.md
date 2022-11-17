# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.0](https://github.com/lozinsky/vue-floating-ui/compare/vue-floating-ui@0.1.0...vue-floating-ui@0.2.0) (2022-11-17)

### ⚠ BREAKING CHANGES

* The `reference` and `floating` must now be passed via arguments.

```diff
+import { ref } from 'vue';
import { useFloating } from 'vue-floating-ui';

-const { x, y, reference, floating, strategy } = useFloating();
+const reference = ref(null);
+const floating = ref(null);
+const { x, y, strategy } = useFloating(reference, floating);
```

### Features

* pass `reference` and `floating` to `useFloating` via arguments ([196b756](https://github.com/lozinsky/vue-floating-ui/commit/196b75693051812cbc2f6c66c2dbdc8cccf8f632))

# 0.1.0 (2022-11-08)

### Features

* introduce `vue-floating-ui` package ([eb79640](https://github.com/lozinsky/vue-floating-ui/commit/eb79640a2c36e35a1cc2929f064906ab5a2fb8e2))
