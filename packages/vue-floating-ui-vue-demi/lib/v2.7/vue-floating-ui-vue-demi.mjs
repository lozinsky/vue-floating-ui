import { Vue2 as s } from "vue-demi";
export * from "vue-demi";
const r = /* @__PURE__ */ new WeakMap();
function d(e) {
  var t;
  return (t = e == null ? void 0 : e.ownerDocument) != null ? t : document;
}
function a(e) {
  var t;
  return (t = d(e).defaultView) != null ? t : window;
}
function f(e) {
  return e ? e instanceof a(e).Element : !1;
}
function u(e) {
  var t, n;
  return (n = (t = e.$slots.default) == null ? void 0 : t[0]) != null ? n : null;
}
function i(e, t) {
  if (r.has(e))
    return;
  const n = typeof t == "string" ? document.querySelector(t) : t;
  if (!f(n)) {
    console.warn("[Vue Floating UI]: Invalid Teleport target on mount:", n, `(${typeof n})`);
    return;
  }
  const l = new s({
    name: "TeleportOutlet",
    el: n.appendChild(d(n).createElement("div")),
    parent: e,
    destroyed() {
      this.$el.remove();
    },
    render() {
      return u(this.$parent);
    }
  });
  r.set(e, l);
}
function o(e) {
  r.has(e) && (r.get(e).$destroy(), r.delete(e));
}
function c(e) {
  r.has(e) && r.get(e).$forceUpdate();
}
const h = s.extend({
  name: "Teleport",
  props: ["to", "disabled"],
  watch: {
    to: {
      immediate: !0,
      handler(e) {
        this.disabled || (o(this), i(this, e));
      }
    },
    disabled(e) {
      e ? o(this) : this.$nextTick(() => i(this, this.to));
    }
  },
  updated() {
    c(this);
  },
  beforeDestroy() {
    o(this);
  },
  render() {
    if (this.disabled)
      return u(this);
  }
});
export {
  h as Teleport
};
