import { Vue2 as s } from "vue-demi";
export * from "vue-demi";
const o = /* @__PURE__ */ new WeakMap();
function l(e) {
  var t;
  return (t = e == null ? void 0 : e.ownerDocument) != null ? t : document;
}
function a(e) {
  var t;
  return (t = l(e).defaultView) != null ? t : window;
}
function f(e) {
  return e ? e instanceof a(e).Element : !1;
}
function u(e) {
  var n;
  const t = (n = e.$slots.default) != null ? n : [];
  return t.length === 0 ? null : (t.length > 1 && console.warn("[Vue Floating UI]: Multiple template root elements is not supported"), t[0]);
}
function i(e, t) {
  if (o.has(e))
    return;
  const n = typeof t == "string" ? document.querySelector(t) : t;
  if (!f(n)) {
    console.warn("[Vue Floating UI]: Invalid Teleport target on mount:", n, `(${typeof n})`);
    return;
  }
  const d = new s({
    name: "TeleportOutlet",
    el: n.appendChild(l(n).createElement("div")),
    parent: e,
    destroyed() {
      this.$el.remove();
    },
    render() {
      return u(this.$parent);
    }
  });
  o.set(e, d);
}
function r(e) {
  o.has(e) && (o.get(e).$destroy(), o.delete(e));
}
function p(e) {
  o.has(e) && o.get(e).$forceUpdate();
}
const h = s.extend({
  name: "Teleport",
  props: ["to", "disabled"],
  watch: {
    to: {
      immediate: !0,
      handler(e) {
        this.disabled || (r(this), i(this, e));
      }
    },
    disabled(e) {
      e ? r(this) : this.$nextTick(() => i(this, this.to));
    }
  },
  updated() {
    p(this);
  },
  beforeDestroy() {
    r(this);
  },
  render() {
    if (this.disabled)
      return u(this);
  }
});
export {
  h as Teleport
};
