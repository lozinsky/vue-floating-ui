(function(n,i){typeof exports=="object"&&typeof module<"u"?i(exports,require("vue-demi")):typeof define=="function"&&define.amd?define(["exports","vue-demi"],i):(n=typeof globalThis<"u"?globalThis:n||self,i(n.VueFloatingUIVueDemi={},n.VueDemi))})(this,function(n,i){"use strict";const r=new WeakMap;function d(e){var t;return(t=e==null?void 0:e.ownerDocument)!=null?t:document}function l(e){var t;return(t=d(e).defaultView)!=null?t:window}function a(e){return e?e instanceof l(e).Element:!1}function s(e){var t,o;return(o=(t=e.$slots.default)==null?void 0:t[0])!=null?o:null}function f(e,t){if(r.has(e))return;const o=typeof t=="string"?document.querySelector(t):t;if(!a(o)){console.warn("[Vue Floating UI]: Invalid Teleport target on mount:",o,`(${typeof o})`);return}const h=new i.Vue2({name:"TeleportOutlet",el:o.appendChild(d(o).createElement("div")),parent:e,destroyed(){this.$el.remove()},render(){return s(this.$parent)}});r.set(e,h)}function u(e){r.has(e)&&(r.get(e).$destroy(),r.delete(e))}function c(e){r.has(e)&&r.get(e).$forceUpdate()}const p=i.Vue2.extend({name:"Teleport",props:["to","disabled"],watch:{to:{immediate:!0,handler(e){this.disabled||(u(this),f(this,e))}},disabled(e){e?u(this):this.$nextTick(()=>f(this,this.to))}},updated(){c(this)},beforeDestroy(){u(this)},render(){if(this.disabled)return s(this)}});n.Teleport=p;for(const e in i)e!=="default"&&!n.hasOwnProperty(e)&&Object.defineProperty(n,e,{enumerable:!0,get:()=>i[e]});Object.defineProperties(n,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
