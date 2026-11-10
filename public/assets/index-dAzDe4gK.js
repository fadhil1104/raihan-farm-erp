(function(){const F=document.createElement("link").relList;if(F&&F.supports&&F.supports("modulepreload"))return;for(const O of document.querySelectorAll('link[rel="modulepreload"]'))fe(O);new MutationObserver(O=>{for(const U of O)if(U.type==="childList")for(const ne of U.addedNodes)ne.tagName==="LINK"&&ne.rel==="modulepreload"&&fe(ne)}).observe(document,{childList:!0,subtree:!0});function h(O){const U={};return O.integrity&&(U.integrity=O.integrity),O.referrerPolicy&&(U.referrerPolicy=O.referrerPolicy),O.crossOrigin==="use-credentials"?U.credentials="include":O.crossOrigin==="anonymous"?U.credentials="omit":U.credentials="same-origin",U}function fe(O){if(O.ep)return;O.ep=!0;const U=h(O);fetch(O.href,U)}})();function Ic(E){return E&&E.__esModule&&Object.prototype.hasOwnProperty.call(E,"default")?E.default:E}var Na={exports:{}},W={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Nd;function jc(){if(Nd)return W;Nd=1;var E=Symbol.for("react.element"),F=Symbol.for("react.portal"),h=Symbol.for("react.fragment"),fe=Symbol.for("react.strict_mode"),O=Symbol.for("react.profiler"),U=Symbol.for("react.provider"),ne=Symbol.for("react.context"),Z=Symbol.for("react.forward_ref"),me=Symbol.for("react.suspense"),G=Symbol.for("react.memo"),Ee=Symbol.for("react.lazy"),J=Symbol.iterator;function ue(u){return u===null||typeof u!="object"?null:(u=J&&u[J]||u["@@iterator"],typeof u=="function"?u:null)}var Ue={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Ce=Object.assign,H={};function L(u,v,z){this.props=u,this.context=v,this.refs=H,this.updater=z||Ue}L.prototype.isReactComponent={},L.prototype.setState=function(u,v){if(typeof u!="object"&&typeof u!="function"&&u!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,u,v,"setState")},L.prototype.forceUpdate=function(u){this.updater.enqueueForceUpdate(this,u,"forceUpdate")};function ve(){}ve.prototype=L.prototype;function N(u,v,z){this.props=u,this.context=v,this.refs=H,this.updater=z||Ue}var X=N.prototype=new ve;X.constructor=N,Ce(X,L.prototype),X.isPureReactComponent=!0;var ce=Array.isArray,Fe=Object.prototype.hasOwnProperty,Pe={current:null},Te={key:!0,ref:!0,__self:!0,__source:!0};function Ae(u,v,z){var B,Q={},V=null,ee=null;if(v!=null)for(B in v.ref!==void 0&&(ee=v.ref),v.key!==void 0&&(V=""+v.key),v)Fe.call(v,B)&&!Te.hasOwnProperty(B)&&(Q[B]=v[B]);var q=arguments.length-2;if(q===1)Q.children=z;else if(1<q){for(var se=Array(q),Ge=0;Ge<q;Ge++)se[Ge]=arguments[Ge+2];Q.children=se}if(u&&u.defaultProps)for(B in q=u.defaultProps,q)Q[B]===void 0&&(Q[B]=q[B]);return{$$typeof:E,type:u,key:V,ref:ee,props:Q,_owner:Pe.current}}function vt(u,v){return{$$typeof:E,type:u.type,key:v,ref:u.ref,props:u.props,_owner:u._owner}}function dt(u){return typeof u=="object"&&u!==null&&u.$$typeof===E}function St(u){var v={"=":"=0",":":"=2"};return"$"+u.replace(/[=:]/g,function(z){return v[z]})}var tt=/\/+/g;function ze(u,v){return typeof u=="object"&&u!==null&&u.key!=null?St(""+u.key):v.toString(36)}function Ye(u,v,z,B,Q){var V=typeof u;(V==="undefined"||V==="boolean")&&(u=null);var ee=!1;if(u===null)ee=!0;else switch(V){case"string":case"number":ee=!0;break;case"object":switch(u.$$typeof){case E:case F:ee=!0}}if(ee)return ee=u,Q=Q(ee),u=B===""?"."+ze(ee,0):B,ce(Q)?(z="",u!=null&&(z=u.replace(tt,"$&/")+"/"),Ye(Q,v,z,"",function(Ge){return Ge})):Q!=null&&(dt(Q)&&(Q=vt(Q,z+(!Q.key||ee&&ee.key===Q.key?"":(""+Q.key).replace(tt,"$&/")+"/")+u)),v.push(Q)),1;if(ee=0,B=B===""?".":B+":",ce(u))for(var q=0;q<u.length;q++){V=u[q];var se=B+ze(V,q);ee+=Ye(V,v,z,se,Q)}else if(se=ue(u),typeof se=="function")for(u=se.call(u),q=0;!(V=u.next()).done;)V=V.value,se=B+ze(V,q++),ee+=Ye(V,v,z,se,Q);else if(V==="object")throw v=String(u),Error("Objects are not valid as a React child (found: "+(v==="[object Object]"?"object with keys {"+Object.keys(u).join(", ")+"}":v)+"). If you meant to render a collection of children, use an array instead.");return ee}function nt(u,v,z){if(u==null)return u;var B=[],Q=0;return Ye(u,B,"","",function(V){return v.call(z,V,Q++)}),B}function f(u){if(u._status===-1){var v=u._result;v=v(),v.then(function(z){(u._status===0||u._status===-1)&&(u._status=1,u._result=z)},function(z){(u._status===0||u._status===-1)&&(u._status=2,u._result=z)}),u._status===-1&&(u._status=0,u._result=v)}if(u._status===1)return u._result.default;throw u._result}var C={current:null},b={transition:null},R={ReactCurrentDispatcher:C,ReactCurrentBatchConfig:b,ReactCurrentOwner:Pe};function S(){throw Error("act(...) is not supported in production builds of React.")}return W.Children={map:nt,forEach:function(u,v,z){nt(u,function(){v.apply(this,arguments)},z)},count:function(u){var v=0;return nt(u,function(){v++}),v},toArray:function(u){return nt(u,function(v){return v})||[]},only:function(u){if(!dt(u))throw Error("React.Children.only expected to receive a single React element child.");return u}},W.Component=L,W.Fragment=h,W.Profiler=O,W.PureComponent=N,W.StrictMode=fe,W.Suspense=me,W.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=R,W.act=S,W.cloneElement=function(u,v,z){if(u==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+u+".");var B=Ce({},u.props),Q=u.key,V=u.ref,ee=u._owner;if(v!=null){if(v.ref!==void 0&&(V=v.ref,ee=Pe.current),v.key!==void 0&&(Q=""+v.key),u.type&&u.type.defaultProps)var q=u.type.defaultProps;for(se in v)Fe.call(v,se)&&!Te.hasOwnProperty(se)&&(B[se]=v[se]===void 0&&q!==void 0?q[se]:v[se])}var se=arguments.length-2;if(se===1)B.children=z;else if(1<se){q=Array(se);for(var Ge=0;Ge<se;Ge++)q[Ge]=arguments[Ge+2];B.children=q}return{$$typeof:E,type:u.type,key:Q,ref:V,props:B,_owner:ee}},W.createContext=function(u){return u={$$typeof:ne,_currentValue:u,_currentValue2:u,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},u.Provider={$$typeof:U,_context:u},u.Consumer=u},W.createElement=Ae,W.createFactory=function(u){var v=Ae.bind(null,u);return v.type=u,v},W.createRef=function(){return{current:null}},W.forwardRef=function(u){return{$$typeof:Z,render:u}},W.isValidElement=dt,W.lazy=function(u){return{$$typeof:Ee,_payload:{_status:-1,_result:u},_init:f}},W.memo=function(u,v){return{$$typeof:G,type:u,compare:v===void 0?null:v}},W.startTransition=function(u){var v=b.transition;b.transition={};try{u()}finally{b.transition=v}},W.unstable_act=S,W.useCallback=function(u,v){return C.current.useCallback(u,v)},W.useContext=function(u){return C.current.useContext(u)},W.useDebugValue=function(){},W.useDeferredValue=function(u){return C.current.useDeferredValue(u)},W.useEffect=function(u,v){return C.current.useEffect(u,v)},W.useId=function(){return C.current.useId()},W.useImperativeHandle=function(u,v,z){return C.current.useImperativeHandle(u,v,z)},W.useInsertionEffect=function(u,v){return C.current.useInsertionEffect(u,v)},W.useLayoutEffect=function(u,v){return C.current.useLayoutEffect(u,v)},W.useMemo=function(u,v){return C.current.useMemo(u,v)},W.useReducer=function(u,v,z){return C.current.useReducer(u,v,z)},W.useRef=function(u){return C.current.useRef(u)},W.useState=function(u){return C.current.useState(u)},W.useSyncExternalStore=function(u,v,z){return C.current.useSyncExternalStore(u,v,z)},W.useTransition=function(){return C.current.useTransition()},W.version="18.3.1",W}var _d;function Od(){return _d||(_d=1,Na.exports=jc()),Na.exports}var be=Od();const c=Ic(be);var Dr={},_a={exports:{}},qe={},Ta={exports:{}},Aa={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Td;function Mc(){return Td||(Td=1,(function(E){function F(b,R){var S=b.length;b.push(R);e:for(;0<S;){var u=S-1>>>1,v=b[u];if(0<O(v,R))b[u]=R,b[S]=v,S=u;else break e}}function h(b){return b.length===0?null:b[0]}function fe(b){if(b.length===0)return null;var R=b[0],S=b.pop();if(S!==R){b[0]=S;e:for(var u=0,v=b.length,z=v>>>1;u<z;){var B=2*(u+1)-1,Q=b[B],V=B+1,ee=b[V];if(0>O(Q,S))V<v&&0>O(ee,Q)?(b[u]=ee,b[V]=S,u=V):(b[u]=Q,b[B]=S,u=B);else if(V<v&&0>O(ee,S))b[u]=ee,b[V]=S,u=V;else break e}}return R}function O(b,R){var S=b.sortIndex-R.sortIndex;return S!==0?S:b.id-R.id}if(typeof performance=="object"&&typeof performance.now=="function"){var U=performance;E.unstable_now=function(){return U.now()}}else{var ne=Date,Z=ne.now();E.unstable_now=function(){return ne.now()-Z}}var me=[],G=[],Ee=1,J=null,ue=3,Ue=!1,Ce=!1,H=!1,L=typeof setTimeout=="function"?setTimeout:null,ve=typeof clearTimeout=="function"?clearTimeout:null,N=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function X(b){for(var R=h(G);R!==null;){if(R.callback===null)fe(G);else if(R.startTime<=b)fe(G),R.sortIndex=R.expirationTime,F(me,R);else break;R=h(G)}}function ce(b){if(H=!1,X(b),!Ce)if(h(me)!==null)Ce=!0,f(Fe);else{var R=h(G);R!==null&&C(ce,R.startTime-b)}}function Fe(b,R){Ce=!1,H&&(H=!1,ve(Ae),Ae=-1),Ue=!0;var S=ue;try{for(X(R),J=h(me);J!==null&&(!(J.expirationTime>R)||b&&!St());){var u=J.callback;if(typeof u=="function"){J.callback=null,ue=J.priorityLevel;var v=u(J.expirationTime<=R);R=E.unstable_now(),typeof v=="function"?J.callback=v:J===h(me)&&fe(me),X(R)}else fe(me);J=h(me)}if(J!==null)var z=!0;else{var B=h(G);B!==null&&C(ce,B.startTime-R),z=!1}return z}finally{J=null,ue=S,Ue=!1}}var Pe=!1,Te=null,Ae=-1,vt=5,dt=-1;function St(){return!(E.unstable_now()-dt<vt)}function tt(){if(Te!==null){var b=E.unstable_now();dt=b;var R=!0;try{R=Te(!0,b)}finally{R?ze():(Pe=!1,Te=null)}}else Pe=!1}var ze;if(typeof N=="function")ze=function(){N(tt)};else if(typeof MessageChannel<"u"){var Ye=new MessageChannel,nt=Ye.port2;Ye.port1.onmessage=tt,ze=function(){nt.postMessage(null)}}else ze=function(){L(tt,0)};function f(b){Te=b,Pe||(Pe=!0,ze())}function C(b,R){Ae=L(function(){b(E.unstable_now())},R)}E.unstable_IdlePriority=5,E.unstable_ImmediatePriority=1,E.unstable_LowPriority=4,E.unstable_NormalPriority=3,E.unstable_Profiling=null,E.unstable_UserBlockingPriority=2,E.unstable_cancelCallback=function(b){b.callback=null},E.unstable_continueExecution=function(){Ce||Ue||(Ce=!0,f(Fe))},E.unstable_forceFrameRate=function(b){0>b||125<b?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):vt=0<b?Math.floor(1e3/b):5},E.unstable_getCurrentPriorityLevel=function(){return ue},E.unstable_getFirstCallbackNode=function(){return h(me)},E.unstable_next=function(b){switch(ue){case 1:case 2:case 3:var R=3;break;default:R=ue}var S=ue;ue=R;try{return b()}finally{ue=S}},E.unstable_pauseExecution=function(){},E.unstable_requestPaint=function(){},E.unstable_runWithPriority=function(b,R){switch(b){case 1:case 2:case 3:case 4:case 5:break;default:b=3}var S=ue;ue=b;try{return R()}finally{ue=S}},E.unstable_scheduleCallback=function(b,R,S){var u=E.unstable_now();switch(typeof S=="object"&&S!==null?(S=S.delay,S=typeof S=="number"&&0<S?u+S:u):S=u,b){case 1:var v=-1;break;case 2:v=250;break;case 5:v=1073741823;break;case 4:v=1e4;break;default:v=5e3}return v=S+v,b={id:Ee++,callback:R,priorityLevel:b,startTime:S,expirationTime:v,sortIndex:-1},S>u?(b.sortIndex=S,F(G,b),h(me)===null&&b===h(G)&&(H?(ve(Ae),Ae=-1):H=!0,C(ce,S-u))):(b.sortIndex=v,F(me,b),Ce||Ue||(Ce=!0,f(Fe))),b},E.unstable_shouldYield=St,E.unstable_wrapCallback=function(b){var R=ue;return function(){var S=ue;ue=R;try{return b.apply(this,arguments)}finally{ue=S}}}})(Aa)),Aa}var Ad;function Oc(){return Ad||(Ad=1,Ta.exports=Mc()),Ta.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Dd;function Fc(){if(Dd)return qe;Dd=1;var E=Od(),F=Oc();function h(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var fe=new Set,O={};function U(e,t){ne(e,t),ne(e+"Capture",t)}function ne(e,t){for(O[e]=t,e=0;e<t.length;e++)fe.add(t[e])}var Z=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),me=Object.prototype.hasOwnProperty,G=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Ee={},J={};function ue(e){return me.call(J,e)?!0:me.call(Ee,e)?!1:G.test(e)?J[e]=!0:(Ee[e]=!0,!1)}function Ue(e,t,n,l){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return l?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Ce(e,t,n,l){if(t===null||typeof t>"u"||Ue(e,t,n,l))return!0;if(l)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function H(e,t,n,l,r,s,a){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=l,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=s,this.removeEmptyString=a}var L={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){L[e]=new H(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];L[t]=new H(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){L[e]=new H(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){L[e]=new H(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){L[e]=new H(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){L[e]=new H(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){L[e]=new H(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){L[e]=new H(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){L[e]=new H(e,5,!1,e.toLowerCase(),null,!1,!1)});var ve=/[\-:]([a-z])/g;function N(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ve,N);L[t]=new H(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ve,N);L[t]=new H(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ve,N);L[t]=new H(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){L[e]=new H(e,1,!1,e.toLowerCase(),null,!1,!1)}),L.xlinkHref=new H("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){L[e]=new H(e,1,!1,e.toLowerCase(),null,!0,!0)});function X(e,t,n,l){var r=L.hasOwnProperty(t)?L[t]:null;(r!==null?r.type!==0:l||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Ce(t,n,r,l)&&(n=null),l||r===null?ue(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):r.mustUseProperty?e[r.propertyName]=n===null?r.type===3?!1:"":n:(t=r.attributeName,l=r.attributeNamespace,n===null?e.removeAttribute(t):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,l?e.setAttributeNS(l,t,n):e.setAttribute(t,n))))}var ce=E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Fe=Symbol.for("react.element"),Pe=Symbol.for("react.portal"),Te=Symbol.for("react.fragment"),Ae=Symbol.for("react.strict_mode"),vt=Symbol.for("react.profiler"),dt=Symbol.for("react.provider"),St=Symbol.for("react.context"),tt=Symbol.for("react.forward_ref"),ze=Symbol.for("react.suspense"),Ye=Symbol.for("react.suspense_list"),nt=Symbol.for("react.memo"),f=Symbol.for("react.lazy"),C=Symbol.for("react.offscreen"),b=Symbol.iterator;function R(e){return e===null||typeof e!="object"?null:(e=b&&e[b]||e["@@iterator"],typeof e=="function"?e:null)}var S=Object.assign,u;function v(e){if(u===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);u=t&&t[1]||""}return`
`+u+e}var z=!1;function B(e,t){if(!e||z)return"";z=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(x){var l=x}Reflect.construct(e,[],t)}else{try{t.call()}catch(x){l=x}e.call(t.prototype)}else{try{throw Error()}catch(x){l=x}e()}}catch(x){if(x&&l&&typeof x.stack=="string"){for(var r=x.stack.split(`
`),s=l.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var i=`
`+r[a].replace(" at new "," at ");return e.displayName&&i.includes("<anonymous>")&&(i=i.replace("<anonymous>",e.displayName)),i}while(1<=a&&0<=o);break}}}finally{z=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?v(e):""}function Q(e){switch(e.tag){case 5:return v(e.type);case 16:return v("Lazy");case 13:return v("Suspense");case 19:return v("SuspenseList");case 0:case 2:case 15:return e=B(e.type,!1),e;case 11:return e=B(e.type.render,!1),e;case 1:return e=B(e.type,!0),e;default:return""}}function V(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Te:return"Fragment";case Pe:return"Portal";case vt:return"Profiler";case Ae:return"StrictMode";case ze:return"Suspense";case Ye:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case St:return(e.displayName||"Context")+".Consumer";case dt:return(e._context.displayName||"Context")+".Provider";case tt:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case nt:return t=e.displayName||null,t!==null?t:V(e.type)||"Memo";case f:t=e._payload,e=e._init;try{return V(e(t))}catch{}}return null}function ee(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return V(t);case 8:return t===Ae?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function q(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function se(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Ge(e){var t=se(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),l=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return r.call(this)},set:function(a){l=""+a,s.call(this,a)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return l},setValue:function(a){l=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function kl(e){e._valueTracker||(e._valueTracker=Ge(e))}function La(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),l="";return e&&(l=se(e)?e.checked?"true":"false":e.value),e=l,e!==n?(t.setValue(e),!0):!1}function Sl(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function jr(e,t){var n=t.checked;return S({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Ia(e,t){var n=t.defaultValue==null?"":t.defaultValue,l=t.checked!=null?t.checked:t.defaultChecked;n=q(t.value!=null?t.value:n),e._wrapperState={initialChecked:l,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ja(e,t){t=t.checked,t!=null&&X(e,"checked",t,!1)}function Mr(e,t){ja(e,t);var n=q(t.value),l=t.type;if(n!=null)l==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(l==="submit"||l==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Or(e,t.type,n):t.hasOwnProperty("defaultValue")&&Or(e,t.type,q(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ma(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var l=t.type;if(!(l!=="submit"&&l!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Or(e,t,n){(t!=="number"||Sl(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var On=Array.isArray;function pn(e,t,n,l){if(e=e.options,t){t={};for(var r=0;r<n.length;r++)t["$"+n[r]]=!0;for(n=0;n<e.length;n++)r=t.hasOwnProperty("$"+e[n].value),e[n].selected!==r&&(e[n].selected=r),r&&l&&(e[n].defaultSelected=!0)}else{for(n=""+q(n),t=null,r=0;r<e.length;r++){if(e[r].value===n){e[r].selected=!0,l&&(e[r].defaultSelected=!0);return}t!==null||e[r].disabled||(t=e[r])}t!==null&&(t.selected=!0)}}function Fr(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(h(91));return S({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Oa(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(h(92));if(On(n)){if(1<n.length)throw Error(h(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:q(n)}}function Fa(e,t){var n=q(t.value),l=q(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),l!=null&&(e.defaultValue=""+l)}function za(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Wa(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function zr(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Wa(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var El,Ba=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,l,r){MSApp.execUnsafeLocalFunction(function(){return e(t,n,l,r)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(El=El||document.createElement("div"),El.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=El.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Fn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var zn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Fd=["Webkit","ms","Moz","O"];Object.keys(zn).forEach(function(e){Fd.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),zn[t]=zn[e]})});function Ua(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||zn.hasOwnProperty(e)&&zn[e]?(""+t).trim():t+"px"}function Ha(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var l=n.indexOf("--")===0,r=Ua(n,t[n],l);n==="float"&&(n="cssFloat"),l?e.setProperty(n,r):e[n]=r}}var zd=S({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Wr(e,t){if(t){if(zd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(h(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(h(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(h(61))}if(t.style!=null&&typeof t.style!="object")throw Error(h(62))}}function Br(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ur=null;function Hr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var $r=null,fn=null,mn=null;function $a(e){if(e=ol(e)){if(typeof $r!="function")throw Error(h(280));var t=e.stateNode;t&&(t=Kl(t),$r(e.stateNode,e.type,t))}}function Qa(e){fn?mn?mn.push(e):mn=[e]:fn=e}function Va(){if(fn){var e=fn,t=mn;if(mn=fn=null,$a(e),t)for(e=0;e<t.length;e++)$a(t[e])}}function Ka(e,t){return e(t)}function qa(){}var Qr=!1;function Ya(e,t,n){if(Qr)return e(t,n);Qr=!0;try{return Ka(e,t,n)}finally{Qr=!1,(fn!==null||mn!==null)&&(qa(),Va())}}function Wn(e,t){var n=e.stateNode;if(n===null)return null;var l=Kl(n);if(l===null)return null;n=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(h(231,t,typeof n));return n}var Vr=!1;if(Z)try{var Bn={};Object.defineProperty(Bn,"passive",{get:function(){Vr=!0}}),window.addEventListener("test",Bn,Bn),window.removeEventListener("test",Bn,Bn)}catch{Vr=!1}function Wd(e,t,n,l,r,s,a,o,i){var x=Array.prototype.slice.call(arguments,3);try{t.apply(n,x)}catch(y){this.onError(y)}}var Un=!1,Cl=null,Pl=!1,Kr=null,Bd={onError:function(e){Un=!0,Cl=e}};function Ud(e,t,n,l,r,s,a,o,i){Un=!1,Cl=null,Wd.apply(Bd,arguments)}function Hd(e,t,n,l,r,s,a,o,i){if(Ud.apply(this,arguments),Un){if(Un){var x=Cl;Un=!1,Cl=null}else throw Error(h(198));Pl||(Pl=!0,Kr=x)}}function Zt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Ga(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Xa(e){if(Zt(e)!==e)throw Error(h(188))}function $d(e){var t=e.alternate;if(!t){if(t=Zt(e),t===null)throw Error(h(188));return t!==e?null:e}for(var n=e,l=t;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(l=r.return,l!==null){n=l;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Xa(r),e;if(s===l)return Xa(r),t;s=s.sibling}throw Error(h(188))}if(n.return!==l.return)n=r,l=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,l=s;break}if(o===l){a=!0,l=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,l=r;break}if(o===l){a=!0,l=s,n=r;break}o=o.sibling}if(!a)throw Error(h(189))}}if(n.alternate!==l)throw Error(h(190))}if(n.tag!==3)throw Error(h(188));return n.stateNode.current===n?e:t}function Za(e){return e=$d(e),e!==null?Ja(e):null}function Ja(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ja(e);if(t!==null)return t;e=e.sibling}return null}var eo=F.unstable_scheduleCallback,to=F.unstable_cancelCallback,Qd=F.unstable_shouldYield,Vd=F.unstable_requestPaint,xe=F.unstable_now,Kd=F.unstable_getCurrentPriorityLevel,qr=F.unstable_ImmediatePriority,no=F.unstable_UserBlockingPriority,Rl=F.unstable_NormalPriority,qd=F.unstable_LowPriority,lo=F.unstable_IdlePriority,Nl=null,gt=null;function Yd(e){if(gt&&typeof gt.onCommitFiberRoot=="function")try{gt.onCommitFiberRoot(Nl,e,void 0,(e.current.flags&128)===128)}catch{}}var ut=Math.clz32?Math.clz32:Zd,Gd=Math.log,Xd=Math.LN2;function Zd(e){return e>>>=0,e===0?32:31-(Gd(e)/Xd|0)|0}var _l=64,Tl=4194304;function Hn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Al(e,t){var n=e.pendingLanes;if(n===0)return 0;var l=0,r=e.suspendedLanes,s=e.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?l=Hn(o):(s&=a,s!==0&&(l=Hn(s)))}else a=n&~r,a!==0?l=Hn(a):s!==0&&(l=Hn(s));if(l===0)return 0;if(t!==0&&t!==l&&(t&r)===0&&(r=l&-l,s=t&-t,r>=s||r===16&&(s&4194240)!==0))return t;if((l&4)!==0&&(l|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=l;0<t;)n=31-ut(t),r=1<<n,l|=e[n],t&=~r;return l}function Jd(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function eu(e,t){for(var n=e.suspendedLanes,l=e.pingedLanes,r=e.expirationTimes,s=e.pendingLanes;0<s;){var a=31-ut(s),o=1<<a,i=r[a];i===-1?((o&n)===0||(o&l)!==0)&&(r[a]=Jd(o,t)):i<=t&&(e.expiredLanes|=o),s&=~o}}function Yr(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function ro(){var e=_l;return _l<<=1,(_l&4194240)===0&&(_l=64),e}function Gr(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function $n(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-ut(t),e[t]=n}function tu(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var l=e.eventTimes;for(e=e.expirationTimes;0<n;){var r=31-ut(n),s=1<<r;t[r]=0,l[r]=-1,e[r]=-1,n&=~s}}function Xr(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var l=31-ut(n),r=1<<l;r&t|e[l]&t&&(e[l]|=t),n&=~r}}var Y=0;function so(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var ao,Zr,oo,io,uo,Jr=!1,Dl=[],Dt=null,Lt=null,It=null,Qn=new Map,Vn=new Map,jt=[],nu="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function co(e,t){switch(e){case"focusin":case"focusout":Dt=null;break;case"dragenter":case"dragleave":Lt=null;break;case"mouseover":case"mouseout":It=null;break;case"pointerover":case"pointerout":Qn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Vn.delete(t.pointerId)}}function Kn(e,t,n,l,r,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:l,nativeEvent:s,targetContainers:[r]},t!==null&&(t=ol(t),t!==null&&Zr(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,r!==null&&t.indexOf(r)===-1&&t.push(r),e)}function lu(e,t,n,l,r){switch(t){case"focusin":return Dt=Kn(Dt,e,t,n,l,r),!0;case"dragenter":return Lt=Kn(Lt,e,t,n,l,r),!0;case"mouseover":return It=Kn(It,e,t,n,l,r),!0;case"pointerover":var s=r.pointerId;return Qn.set(s,Kn(Qn.get(s)||null,e,t,n,l,r)),!0;case"gotpointercapture":return s=r.pointerId,Vn.set(s,Kn(Vn.get(s)||null,e,t,n,l,r)),!0}return!1}function po(e){var t=Jt(e.target);if(t!==null){var n=Zt(t);if(n!==null){if(t=n.tag,t===13){if(t=Ga(n),t!==null){e.blockedOn=t,uo(e.priority,function(){oo(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ll(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=ts(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var l=new n.constructor(n.type,n);Ur=l,n.target.dispatchEvent(l),Ur=null}else return t=ol(n),t!==null&&Zr(t),e.blockedOn=n,!1;t.shift()}return!0}function fo(e,t,n){Ll(e)&&n.delete(t)}function ru(){Jr=!1,Dt!==null&&Ll(Dt)&&(Dt=null),Lt!==null&&Ll(Lt)&&(Lt=null),It!==null&&Ll(It)&&(It=null),Qn.forEach(fo),Vn.forEach(fo)}function qn(e,t){e.blockedOn===t&&(e.blockedOn=null,Jr||(Jr=!0,F.unstable_scheduleCallback(F.unstable_NormalPriority,ru)))}function Yn(e){function t(r){return qn(r,e)}if(0<Dl.length){qn(Dl[0],e);for(var n=1;n<Dl.length;n++){var l=Dl[n];l.blockedOn===e&&(l.blockedOn=null)}}for(Dt!==null&&qn(Dt,e),Lt!==null&&qn(Lt,e),It!==null&&qn(It,e),Qn.forEach(t),Vn.forEach(t),n=0;n<jt.length;n++)l=jt[n],l.blockedOn===e&&(l.blockedOn=null);for(;0<jt.length&&(n=jt[0],n.blockedOn===null);)po(n),n.blockedOn===null&&jt.shift()}var xn=ce.ReactCurrentBatchConfig,Il=!0;function su(e,t,n,l){var r=Y,s=xn.transition;xn.transition=null;try{Y=1,es(e,t,n,l)}finally{Y=r,xn.transition=s}}function au(e,t,n,l){var r=Y,s=xn.transition;xn.transition=null;try{Y=4,es(e,t,n,l)}finally{Y=r,xn.transition=s}}function es(e,t,n,l){if(Il){var r=ts(e,t,n,l);if(r===null)gs(e,t,l,jl,n),co(e,l);else if(lu(r,e,t,n,l))l.stopPropagation();else if(co(e,l),t&4&&-1<nu.indexOf(e)){for(;r!==null;){var s=ol(r);if(s!==null&&ao(s),s=ts(e,t,n,l),s===null&&gs(e,t,l,jl,n),s===r)break;r=s}r!==null&&l.stopPropagation()}else gs(e,t,l,null,n)}}var jl=null;function ts(e,t,n,l){if(jl=null,e=Hr(l),e=Jt(e),e!==null)if(t=Zt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Ga(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return jl=e,null}function mo(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Kd()){case qr:return 1;case no:return 4;case Rl:case qd:return 16;case lo:return 536870912;default:return 16}default:return 16}}var Mt=null,ns=null,Ml=null;function xo(){if(Ml)return Ml;var e,t=ns,n=t.length,l,r="value"in Mt?Mt.value:Mt.textContent,s=r.length;for(e=0;e<n&&t[e]===r[e];e++);var a=n-e;for(l=1;l<=a&&t[n-l]===r[s-l];l++);return Ml=r.slice(e,1<l?1-l:void 0)}function Ol(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Fl(){return!0}function ho(){return!1}function Xe(e){function t(n,l,r,s,a){this._reactName=n,this._targetInst=r,this.type=l,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(n=e[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Fl:ho,this.isPropagationStopped=ho,this}return S(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Fl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Fl)},persist:function(){},isPersistent:Fl}),t}var hn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ls=Xe(hn),Gn=S({},hn,{view:0,detail:0}),ou=Xe(Gn),rs,ss,Xn,zl=S({},Gn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:os,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Xn&&(Xn&&e.type==="mousemove"?(rs=e.screenX-Xn.screenX,ss=e.screenY-Xn.screenY):ss=rs=0,Xn=e),rs)},movementY:function(e){return"movementY"in e?e.movementY:ss}}),vo=Xe(zl),iu=S({},zl,{dataTransfer:0}),du=Xe(iu),uu=S({},Gn,{relatedTarget:0}),as=Xe(uu),cu=S({},hn,{animationName:0,elapsedTime:0,pseudoElement:0}),pu=Xe(cu),fu=S({},hn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),mu=Xe(fu),xu=S({},hn,{data:0}),go=Xe(xu),hu={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},vu={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},gu={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function yu(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=gu[e])?!!t[e]:!1}function os(){return yu}var bu=S({},Gn,{key:function(e){if(e.key){var t=hu[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ol(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?vu[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:os,charCode:function(e){return e.type==="keypress"?Ol(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ol(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),wu=Xe(bu),ku=S({},zl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),yo=Xe(ku),Su=S({},Gn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:os}),Eu=Xe(Su),Cu=S({},hn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Pu=Xe(Cu),Ru=S({},zl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Nu=Xe(Ru),_u=[9,13,27,32],is=Z&&"CompositionEvent"in window,Zn=null;Z&&"documentMode"in document&&(Zn=document.documentMode);var Tu=Z&&"TextEvent"in window&&!Zn,bo=Z&&(!is||Zn&&8<Zn&&11>=Zn),wo=" ",ko=!1;function So(e,t){switch(e){case"keyup":return _u.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Eo(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vn=!1;function Au(e,t){switch(e){case"compositionend":return Eo(t);case"keypress":return t.which!==32?null:(ko=!0,wo);case"textInput":return e=t.data,e===wo&&ko?null:e;default:return null}}function Du(e,t){if(vn)return e==="compositionend"||!is&&So(e,t)?(e=xo(),Ml=ns=Mt=null,vn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return bo&&t.locale!=="ko"?null:t.data;default:return null}}var Lu={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Co(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Lu[e.type]:t==="textarea"}function Po(e,t,n,l){Qa(l),t=$l(t,"onChange"),0<t.length&&(n=new ls("onChange","change",null,n,l),e.push({event:n,listeners:t}))}var Jn=null,el=null;function Iu(e){$o(e,0)}function Wl(e){var t=kn(e);if(La(t))return e}function ju(e,t){if(e==="change")return t}var Ro=!1;if(Z){var ds;if(Z){var us="oninput"in document;if(!us){var No=document.createElement("div");No.setAttribute("oninput","return;"),us=typeof No.oninput=="function"}ds=us}else ds=!1;Ro=ds&&(!document.documentMode||9<document.documentMode)}function _o(){Jn&&(Jn.detachEvent("onpropertychange",To),el=Jn=null)}function To(e){if(e.propertyName==="value"&&Wl(el)){var t=[];Po(t,el,e,Hr(e)),Ya(Iu,t)}}function Mu(e,t,n){e==="focusin"?(_o(),Jn=t,el=n,Jn.attachEvent("onpropertychange",To)):e==="focusout"&&_o()}function Ou(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Wl(el)}function Fu(e,t){if(e==="click")return Wl(t)}function zu(e,t){if(e==="input"||e==="change")return Wl(t)}function Wu(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ct=typeof Object.is=="function"?Object.is:Wu;function tl(e,t){if(ct(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),l=Object.keys(t);if(n.length!==l.length)return!1;for(l=0;l<n.length;l++){var r=n[l];if(!me.call(t,r)||!ct(e[r],t[r]))return!1}return!0}function Ao(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Do(e,t){var n=Ao(e);e=0;for(var l;n;){if(n.nodeType===3){if(l=e+n.textContent.length,e<=t&&l>=t)return{node:n,offset:t-e};e=l}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ao(n)}}function Lo(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Lo(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Io(){for(var e=window,t=Sl();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Sl(e.document)}return t}function cs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Bu(e){var t=Io(),n=e.focusedElem,l=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Lo(n.ownerDocument.documentElement,n)){if(l!==null&&cs(n)){if(t=l.start,e=l.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var r=n.textContent.length,s=Math.min(l.start,r);l=l.end===void 0?s:Math.min(l.end,r),!e.extend&&s>l&&(r=l,l=s,s=r),r=Do(n,s);var a=Do(n,l);r&&a&&(e.rangeCount!==1||e.anchorNode!==r.node||e.anchorOffset!==r.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(t=t.createRange(),t.setStart(r.node,r.offset),e.removeAllRanges(),s>l?(e.addRange(t),e.extend(a.node,a.offset)):(t.setEnd(a.node,a.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Uu=Z&&"documentMode"in document&&11>=document.documentMode,gn=null,ps=null,nl=null,fs=!1;function jo(e,t,n){var l=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;fs||gn==null||gn!==Sl(l)||(l=gn,"selectionStart"in l&&cs(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),nl&&tl(nl,l)||(nl=l,l=$l(ps,"onSelect"),0<l.length&&(t=new ls("onSelect","select",null,t,n),e.push({event:t,listeners:l}),t.target=gn)))}function Bl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var yn={animationend:Bl("Animation","AnimationEnd"),animationiteration:Bl("Animation","AnimationIteration"),animationstart:Bl("Animation","AnimationStart"),transitionend:Bl("Transition","TransitionEnd")},ms={},Mo={};Z&&(Mo=document.createElement("div").style,"AnimationEvent"in window||(delete yn.animationend.animation,delete yn.animationiteration.animation,delete yn.animationstart.animation),"TransitionEvent"in window||delete yn.transitionend.transition);function Ul(e){if(ms[e])return ms[e];if(!yn[e])return e;var t=yn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Mo)return ms[e]=t[n];return e}var Oo=Ul("animationend"),Fo=Ul("animationiteration"),zo=Ul("animationstart"),Wo=Ul("transitionend"),Bo=new Map,Uo="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Ot(e,t){Bo.set(e,t),U(t,[e])}for(var xs=0;xs<Uo.length;xs++){var hs=Uo[xs],Hu=hs.toLowerCase(),$u=hs[0].toUpperCase()+hs.slice(1);Ot(Hu,"on"+$u)}Ot(Oo,"onAnimationEnd"),Ot(Fo,"onAnimationIteration"),Ot(zo,"onAnimationStart"),Ot("dblclick","onDoubleClick"),Ot("focusin","onFocus"),Ot("focusout","onBlur"),Ot(Wo,"onTransitionEnd"),ne("onMouseEnter",["mouseout","mouseover"]),ne("onMouseLeave",["mouseout","mouseover"]),ne("onPointerEnter",["pointerout","pointerover"]),ne("onPointerLeave",["pointerout","pointerover"]),U("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),U("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),U("onBeforeInput",["compositionend","keypress","textInput","paste"]),U("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),U("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),U("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ll="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Qu=new Set("cancel close invalid load scroll toggle".split(" ").concat(ll));function Ho(e,t,n){var l=e.type||"unknown-event";e.currentTarget=n,Hd(l,t,void 0,e),e.currentTarget=null}function $o(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var l=e[n],r=l.event;l=l.listeners;e:{var s=void 0;if(t)for(var a=l.length-1;0<=a;a--){var o=l[a],i=o.instance,x=o.currentTarget;if(o=o.listener,i!==s&&r.isPropagationStopped())break e;Ho(r,o,x),s=i}else for(a=0;a<l.length;a++){if(o=l[a],i=o.instance,x=o.currentTarget,o=o.listener,i!==s&&r.isPropagationStopped())break e;Ho(r,o,x),s=i}}}if(Pl)throw e=Kr,Pl=!1,Kr=null,e}function le(e,t){var n=t[Es];n===void 0&&(n=t[Es]=new Set);var l=e+"__bubble";n.has(l)||(Qo(t,e,2,!1),n.add(l))}function vs(e,t,n){var l=0;t&&(l|=4),Qo(n,e,l,t)}var Hl="_reactListening"+Math.random().toString(36).slice(2);function rl(e){if(!e[Hl]){e[Hl]=!0,fe.forEach(function(n){n!=="selectionchange"&&(Qu.has(n)||vs(n,!1,e),vs(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Hl]||(t[Hl]=!0,vs("selectionchange",!1,t))}}function Qo(e,t,n,l){switch(mo(t)){case 1:var r=su;break;case 4:r=au;break;default:r=es}n=r.bind(null,t,n,e),r=void 0,!Vr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(r=!0),l?r!==void 0?e.addEventListener(t,n,{capture:!0,passive:r}):e.addEventListener(t,n,!0):r!==void 0?e.addEventListener(t,n,{passive:r}):e.addEventListener(t,n,!1)}function gs(e,t,n,l,r){var s=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var a=l.tag;if(a===3||a===4){var o=l.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=l.return;a!==null;){var i=a.tag;if((i===3||i===4)&&(i=a.stateNode.containerInfo,i===r||i.nodeType===8&&i.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Jt(o),a===null)return;if(i=a.tag,i===5||i===6){l=s=a;continue e}o=o.parentNode}}l=l.return}Ya(function(){var x=s,y=Hr(n),w=[];e:{var g=Bo.get(e);if(g!==void 0){var P=ls,T=e;switch(e){case"keypress":if(Ol(n)===0)break e;case"keydown":case"keyup":P=wu;break;case"focusin":T="focus",P=as;break;case"focusout":T="blur",P=as;break;case"beforeblur":case"afterblur":P=as;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":P=vo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":P=du;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":P=Eu;break;case Oo:case Fo:case zo:P=pu;break;case Wo:P=Pu;break;case"scroll":P=ou;break;case"wheel":P=Nu;break;case"copy":case"cut":case"paste":P=mu;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":P=yo}var A=(t&4)!==0,he=!A&&e==="scroll",p=A?g!==null?g+"Capture":null:g;A=[];for(var d=x,m;d!==null;){m=d;var k=m.stateNode;if(m.tag===5&&k!==null&&(m=k,p!==null&&(k=Wn(d,p),k!=null&&A.push(sl(d,k,m)))),he)break;d=d.return}0<A.length&&(g=new P(g,T,null,n,y),w.push({event:g,listeners:A}))}}if((t&7)===0){e:{if(g=e==="mouseover"||e==="pointerover",P=e==="mouseout"||e==="pointerout",g&&n!==Ur&&(T=n.relatedTarget||n.fromElement)&&(Jt(T)||T[Et]))break e;if((P||g)&&(g=y.window===y?y:(g=y.ownerDocument)?g.defaultView||g.parentWindow:window,P?(T=n.relatedTarget||n.toElement,P=x,T=T?Jt(T):null,T!==null&&(he=Zt(T),T!==he||T.tag!==5&&T.tag!==6)&&(T=null)):(P=null,T=x),P!==T)){if(A=vo,k="onMouseLeave",p="onMouseEnter",d="mouse",(e==="pointerout"||e==="pointerover")&&(A=yo,k="onPointerLeave",p="onPointerEnter",d="pointer"),he=P==null?g:kn(P),m=T==null?g:kn(T),g=new A(k,d+"leave",P,n,y),g.target=he,g.relatedTarget=m,k=null,Jt(y)===x&&(A=new A(p,d+"enter",T,n,y),A.target=m,A.relatedTarget=he,k=A),he=k,P&&T)t:{for(A=P,p=T,d=0,m=A;m;m=bn(m))d++;for(m=0,k=p;k;k=bn(k))m++;for(;0<d-m;)A=bn(A),d--;for(;0<m-d;)p=bn(p),m--;for(;d--;){if(A===p||p!==null&&A===p.alternate)break t;A=bn(A),p=bn(p)}A=null}else A=null;P!==null&&Vo(w,g,P,A,!1),T!==null&&he!==null&&Vo(w,he,T,A,!0)}}e:{if(g=x?kn(x):window,P=g.nodeName&&g.nodeName.toLowerCase(),P==="select"||P==="input"&&g.type==="file")var D=ju;else if(Co(g))if(Ro)D=zu;else{D=Ou;var I=Mu}else(P=g.nodeName)&&P.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(D=Fu);if(D&&(D=D(e,x))){Po(w,D,n,y);break e}I&&I(e,g,x),e==="focusout"&&(I=g._wrapperState)&&I.controlled&&g.type==="number"&&Or(g,"number",g.value)}switch(I=x?kn(x):window,e){case"focusin":(Co(I)||I.contentEditable==="true")&&(gn=I,ps=x,nl=null);break;case"focusout":nl=ps=gn=null;break;case"mousedown":fs=!0;break;case"contextmenu":case"mouseup":case"dragend":fs=!1,jo(w,n,y);break;case"selectionchange":if(Uu)break;case"keydown":case"keyup":jo(w,n,y)}var j;if(is)e:{switch(e){case"compositionstart":var M="onCompositionStart";break e;case"compositionend":M="onCompositionEnd";break e;case"compositionupdate":M="onCompositionUpdate";break e}M=void 0}else vn?So(e,n)&&(M="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(M="onCompositionStart");M&&(bo&&n.locale!=="ko"&&(vn||M!=="onCompositionStart"?M==="onCompositionEnd"&&vn&&(j=xo()):(Mt=y,ns="value"in Mt?Mt.value:Mt.textContent,vn=!0)),I=$l(x,M),0<I.length&&(M=new go(M,e,null,n,y),w.push({event:M,listeners:I}),j?M.data=j:(j=Eo(n),j!==null&&(M.data=j)))),(j=Tu?Au(e,n):Du(e,n))&&(x=$l(x,"onBeforeInput"),0<x.length&&(y=new go("onBeforeInput","beforeinput",null,n,y),w.push({event:y,listeners:x}),y.data=j))}$o(w,t)})}function sl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function $l(e,t){for(var n=t+"Capture",l=[];e!==null;){var r=e,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Wn(e,n),s!=null&&l.unshift(sl(e,s,r)),s=Wn(e,t),s!=null&&l.push(sl(e,s,r))),e=e.return}return l}function bn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Vo(e,t,n,l,r){for(var s=t._reactName,a=[];n!==null&&n!==l;){var o=n,i=o.alternate,x=o.stateNode;if(i!==null&&i===l)break;o.tag===5&&x!==null&&(o=x,r?(i=Wn(n,s),i!=null&&a.unshift(sl(n,i,o))):r||(i=Wn(n,s),i!=null&&a.push(sl(n,i,o)))),n=n.return}a.length!==0&&e.push({event:t,listeners:a})}var Vu=/\r\n?/g,Ku=/\u0000|\uFFFD/g;function Ko(e){return(typeof e=="string"?e:""+e).replace(Vu,`
`).replace(Ku,"")}function Ql(e,t,n){if(t=Ko(t),Ko(e)!==t&&n)throw Error(h(425))}function Vl(){}var ys=null,bs=null;function ws(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ks=typeof setTimeout=="function"?setTimeout:void 0,qu=typeof clearTimeout=="function"?clearTimeout:void 0,qo=typeof Promise=="function"?Promise:void 0,Yu=typeof queueMicrotask=="function"?queueMicrotask:typeof qo<"u"?function(e){return qo.resolve(null).then(e).catch(Gu)}:ks;function Gu(e){setTimeout(function(){throw e})}function Ss(e,t){var n=t,l=0;do{var r=n.nextSibling;if(e.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(l===0){e.removeChild(r),Yn(t);return}l--}else n!=="$"&&n!=="$?"&&n!=="$!"||l++;n=r}while(n);Yn(t)}function Ft(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Yo(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var wn=Math.random().toString(36).slice(2),yt="__reactFiber$"+wn,al="__reactProps$"+wn,Et="__reactContainer$"+wn,Es="__reactEvents$"+wn,Xu="__reactListeners$"+wn,Zu="__reactHandles$"+wn;function Jt(e){var t=e[yt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Et]||n[yt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Yo(e);e!==null;){if(n=e[yt])return n;e=Yo(e)}return t}e=n,n=e.parentNode}return null}function ol(e){return e=e[yt]||e[Et],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function kn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(h(33))}function Kl(e){return e[al]||null}var Cs=[],Sn=-1;function zt(e){return{current:e}}function re(e){0>Sn||(e.current=Cs[Sn],Cs[Sn]=null,Sn--)}function te(e,t){Sn++,Cs[Sn]=e.current,e.current=t}var Wt={},Ie=zt(Wt),He=zt(!1),en=Wt;function En(e,t){var n=e.type.contextTypes;if(!n)return Wt;var l=e.stateNode;if(l&&l.__reactInternalMemoizedUnmaskedChildContext===t)return l.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=t[s];return l&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=r),r}function $e(e){return e=e.childContextTypes,e!=null}function ql(){re(He),re(Ie)}function Go(e,t,n){if(Ie.current!==Wt)throw Error(h(168));te(Ie,t),te(He,n)}function Xo(e,t,n){var l=e.stateNode;if(t=t.childContextTypes,typeof l.getChildContext!="function")return n;l=l.getChildContext();for(var r in l)if(!(r in t))throw Error(h(108,ee(e)||"Unknown",r));return S({},n,l)}function Yl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Wt,en=Ie.current,te(Ie,e),te(He,He.current),!0}function Zo(e,t,n){var l=e.stateNode;if(!l)throw Error(h(169));n?(e=Xo(e,t,en),l.__reactInternalMemoizedMergedChildContext=e,re(He),re(Ie),te(Ie,e)):re(He),te(He,n)}var Ct=null,Gl=!1,Ps=!1;function Jo(e){Ct===null?Ct=[e]:Ct.push(e)}function Ju(e){Gl=!0,Jo(e)}function Bt(){if(!Ps&&Ct!==null){Ps=!0;var e=0,t=Y;try{var n=Ct;for(Y=1;e<n.length;e++){var l=n[e];do l=l(!0);while(l!==null)}Ct=null,Gl=!1}catch(r){throw Ct!==null&&(Ct=Ct.slice(e+1)),eo(qr,Bt),r}finally{Y=t,Ps=!1}}return null}var Cn=[],Pn=0,Xl=null,Zl=0,lt=[],rt=0,tn=null,Pt=1,Rt="";function nn(e,t){Cn[Pn++]=Zl,Cn[Pn++]=Xl,Xl=e,Zl=t}function ei(e,t,n){lt[rt++]=Pt,lt[rt++]=Rt,lt[rt++]=tn,tn=e;var l=Pt;e=Rt;var r=32-ut(l)-1;l&=~(1<<r),n+=1;var s=32-ut(t)+r;if(30<s){var a=r-r%5;s=(l&(1<<a)-1).toString(32),l>>=a,r-=a,Pt=1<<32-ut(t)+r|n<<r|l,Rt=s+e}else Pt=1<<s|n<<r|l,Rt=e}function Rs(e){e.return!==null&&(nn(e,1),ei(e,1,0))}function Ns(e){for(;e===Xl;)Xl=Cn[--Pn],Cn[Pn]=null,Zl=Cn[--Pn],Cn[Pn]=null;for(;e===tn;)tn=lt[--rt],lt[rt]=null,Rt=lt[--rt],lt[rt]=null,Pt=lt[--rt],lt[rt]=null}var Ze=null,Je=null,ae=!1,pt=null;function ti(e,t){var n=it(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function ni(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Ze=e,Je=Ft(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Ze=e,Je=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=tn!==null?{id:Pt,overflow:Rt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=it(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Ze=e,Je=null,!0):!1;default:return!1}}function _s(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ts(e){if(ae){var t=Je;if(t){var n=t;if(!ni(e,t)){if(_s(e))throw Error(h(418));t=Ft(n.nextSibling);var l=Ze;t&&ni(e,t)?ti(l,n):(e.flags=e.flags&-4097|2,ae=!1,Ze=e)}}else{if(_s(e))throw Error(h(418));e.flags=e.flags&-4097|2,ae=!1,Ze=e}}}function li(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Ze=e}function Jl(e){if(e!==Ze)return!1;if(!ae)return li(e),ae=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!ws(e.type,e.memoizedProps)),t&&(t=Je)){if(_s(e))throw ri(),Error(h(418));for(;t;)ti(e,t),t=Ft(t.nextSibling)}if(li(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){Je=Ft(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}Je=null}}else Je=Ze?Ft(e.stateNode.nextSibling):null;return!0}function ri(){for(var e=Je;e;)e=Ft(e.nextSibling)}function Rn(){Je=Ze=null,ae=!1}function As(e){pt===null?pt=[e]:pt.push(e)}var ec=ce.ReactCurrentBatchConfig;function il(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(h(309));var l=n.stateNode}if(!l)throw Error(h(147,e));var r=l,s=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===s?t.ref:(t=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},t._stringRef=s,t)}if(typeof e!="string")throw Error(h(284));if(!n._owner)throw Error(h(290,e))}return e}function er(e,t){throw e=Object.prototype.toString.call(t),Error(h(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function si(e){var t=e._init;return t(e._payload)}function ai(e){function t(p,d){if(e){var m=p.deletions;m===null?(p.deletions=[d],p.flags|=16):m.push(d)}}function n(p,d){if(!e)return null;for(;d!==null;)t(p,d),d=d.sibling;return null}function l(p,d){for(p=new Map;d!==null;)d.key!==null?p.set(d.key,d):p.set(d.index,d),d=d.sibling;return p}function r(p,d){return p=Yt(p,d),p.index=0,p.sibling=null,p}function s(p,d,m){return p.index=m,e?(m=p.alternate,m!==null?(m=m.index,m<d?(p.flags|=2,d):m):(p.flags|=2,d)):(p.flags|=1048576,d)}function a(p){return e&&p.alternate===null&&(p.flags|=2),p}function o(p,d,m,k){return d===null||d.tag!==6?(d=ka(m,p.mode,k),d.return=p,d):(d=r(d,m),d.return=p,d)}function i(p,d,m,k){var D=m.type;return D===Te?y(p,d,m.props.children,k,m.key):d!==null&&(d.elementType===D||typeof D=="object"&&D!==null&&D.$$typeof===f&&si(D)===d.type)?(k=r(d,m.props),k.ref=il(p,d,m),k.return=p,k):(k=Er(m.type,m.key,m.props,null,p.mode,k),k.ref=il(p,d,m),k.return=p,k)}function x(p,d,m,k){return d===null||d.tag!==4||d.stateNode.containerInfo!==m.containerInfo||d.stateNode.implementation!==m.implementation?(d=Sa(m,p.mode,k),d.return=p,d):(d=r(d,m.children||[]),d.return=p,d)}function y(p,d,m,k,D){return d===null||d.tag!==7?(d=cn(m,p.mode,k,D),d.return=p,d):(d=r(d,m),d.return=p,d)}function w(p,d,m){if(typeof d=="string"&&d!==""||typeof d=="number")return d=ka(""+d,p.mode,m),d.return=p,d;if(typeof d=="object"&&d!==null){switch(d.$$typeof){case Fe:return m=Er(d.type,d.key,d.props,null,p.mode,m),m.ref=il(p,null,d),m.return=p,m;case Pe:return d=Sa(d,p.mode,m),d.return=p,d;case f:var k=d._init;return w(p,k(d._payload),m)}if(On(d)||R(d))return d=cn(d,p.mode,m,null),d.return=p,d;er(p,d)}return null}function g(p,d,m,k){var D=d!==null?d.key:null;if(typeof m=="string"&&m!==""||typeof m=="number")return D!==null?null:o(p,d,""+m,k);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Fe:return m.key===D?i(p,d,m,k):null;case Pe:return m.key===D?x(p,d,m,k):null;case f:return D=m._init,g(p,d,D(m._payload),k)}if(On(m)||R(m))return D!==null?null:y(p,d,m,k,null);er(p,m)}return null}function P(p,d,m,k,D){if(typeof k=="string"&&k!==""||typeof k=="number")return p=p.get(m)||null,o(d,p,""+k,D);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case Fe:return p=p.get(k.key===null?m:k.key)||null,i(d,p,k,D);case Pe:return p=p.get(k.key===null?m:k.key)||null,x(d,p,k,D);case f:var I=k._init;return P(p,d,m,I(k._payload),D)}if(On(k)||R(k))return p=p.get(m)||null,y(d,p,k,D,null);er(d,k)}return null}function T(p,d,m,k){for(var D=null,I=null,j=d,M=d=0,_e=null;j!==null&&M<m.length;M++){j.index>M?(_e=j,j=null):_e=j.sibling;var K=g(p,j,m[M],k);if(K===null){j===null&&(j=_e);break}e&&j&&K.alternate===null&&t(p,j),d=s(K,d,M),I===null?D=K:I.sibling=K,I=K,j=_e}if(M===m.length)return n(p,j),ae&&nn(p,M),D;if(j===null){for(;M<m.length;M++)j=w(p,m[M],k),j!==null&&(d=s(j,d,M),I===null?D=j:I.sibling=j,I=j);return ae&&nn(p,M),D}for(j=l(p,j);M<m.length;M++)_e=P(j,p,M,m[M],k),_e!==null&&(e&&_e.alternate!==null&&j.delete(_e.key===null?M:_e.key),d=s(_e,d,M),I===null?D=_e:I.sibling=_e,I=_e);return e&&j.forEach(function(Gt){return t(p,Gt)}),ae&&nn(p,M),D}function A(p,d,m,k){var D=R(m);if(typeof D!="function")throw Error(h(150));if(m=D.call(m),m==null)throw Error(h(151));for(var I=D=null,j=d,M=d=0,_e=null,K=m.next();j!==null&&!K.done;M++,K=m.next()){j.index>M?(_e=j,j=null):_e=j.sibling;var Gt=g(p,j,K.value,k);if(Gt===null){j===null&&(j=_e);break}e&&j&&Gt.alternate===null&&t(p,j),d=s(Gt,d,M),I===null?D=Gt:I.sibling=Gt,I=Gt,j=_e}if(K.done)return n(p,j),ae&&nn(p,M),D;if(j===null){for(;!K.done;M++,K=m.next())K=w(p,K.value,k),K!==null&&(d=s(K,d,M),I===null?D=K:I.sibling=K,I=K);return ae&&nn(p,M),D}for(j=l(p,j);!K.done;M++,K=m.next())K=P(j,p,M,K.value,k),K!==null&&(e&&K.alternate!==null&&j.delete(K.key===null?M:K.key),d=s(K,d,M),I===null?D=K:I.sibling=K,I=K);return e&&j.forEach(function(Lc){return t(p,Lc)}),ae&&nn(p,M),D}function he(p,d,m,k){if(typeof m=="object"&&m!==null&&m.type===Te&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case Fe:e:{for(var D=m.key,I=d;I!==null;){if(I.key===D){if(D=m.type,D===Te){if(I.tag===7){n(p,I.sibling),d=r(I,m.props.children),d.return=p,p=d;break e}}else if(I.elementType===D||typeof D=="object"&&D!==null&&D.$$typeof===f&&si(D)===I.type){n(p,I.sibling),d=r(I,m.props),d.ref=il(p,I,m),d.return=p,p=d;break e}n(p,I);break}else t(p,I);I=I.sibling}m.type===Te?(d=cn(m.props.children,p.mode,k,m.key),d.return=p,p=d):(k=Er(m.type,m.key,m.props,null,p.mode,k),k.ref=il(p,d,m),k.return=p,p=k)}return a(p);case Pe:e:{for(I=m.key;d!==null;){if(d.key===I)if(d.tag===4&&d.stateNode.containerInfo===m.containerInfo&&d.stateNode.implementation===m.implementation){n(p,d.sibling),d=r(d,m.children||[]),d.return=p,p=d;break e}else{n(p,d);break}else t(p,d);d=d.sibling}d=Sa(m,p.mode,k),d.return=p,p=d}return a(p);case f:return I=m._init,he(p,d,I(m._payload),k)}if(On(m))return T(p,d,m,k);if(R(m))return A(p,d,m,k);er(p,m)}return typeof m=="string"&&m!==""||typeof m=="number"?(m=""+m,d!==null&&d.tag===6?(n(p,d.sibling),d=r(d,m),d.return=p,p=d):(n(p,d),d=ka(m,p.mode,k),d.return=p,p=d),a(p)):n(p,d)}return he}var Nn=ai(!0),oi=ai(!1),tr=zt(null),nr=null,_n=null,Ds=null;function Ls(){Ds=_n=nr=null}function Is(e){var t=tr.current;re(tr),e._currentValue=t}function js(e,t,n){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===n)break;e=e.return}}function Tn(e,t){nr=e,Ds=_n=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Qe=!0),e.firstContext=null)}function st(e){var t=e._currentValue;if(Ds!==e)if(e={context:e,memoizedValue:t,next:null},_n===null){if(nr===null)throw Error(h(308));_n=e,nr.dependencies={lanes:0,firstContext:e}}else _n=_n.next=e;return t}var ln=null;function Ms(e){ln===null?ln=[e]:ln.push(e)}function ii(e,t,n,l){var r=t.interleaved;return r===null?(n.next=n,Ms(t)):(n.next=r.next,r.next=n),t.interleaved=n,Nt(e,l)}function Nt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Ut=!1;function Os(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function di(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function _t(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Ht(e,t,n){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,($&2)!==0){var r=l.pending;return r===null?t.next=t:(t.next=r.next,r.next=t),l.pending=t,Nt(e,n)}return r=l.interleaved,r===null?(t.next=t,Ms(l)):(t.next=r.next,r.next=t),l.interleaved=t,Nt(e,n)}function lr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,Xr(e,n)}}function ui(e,t){var n=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,n===l)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=t:s=s.next=t}else r=s=t;n={baseState:l.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:l.shared,effects:l.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function rr(e,t,n,l){var r=e.updateQueue;Ut=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var i=o,x=i.next;i.next=null,a===null?s=x:a.next=x,a=i;var y=e.alternate;y!==null&&(y=y.updateQueue,o=y.lastBaseUpdate,o!==a&&(o===null?y.firstBaseUpdate=x:o.next=x,y.lastBaseUpdate=i))}if(s!==null){var w=r.baseState;a=0,y=x=i=null,o=s;do{var g=o.lane,P=o.eventTime;if((l&g)===g){y!==null&&(y=y.next={eventTime:P,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var T=e,A=o;switch(g=t,P=n,A.tag){case 1:if(T=A.payload,typeof T=="function"){w=T.call(P,w,g);break e}w=T;break e;case 3:T.flags=T.flags&-65537|128;case 0:if(T=A.payload,g=typeof T=="function"?T.call(P,w,g):T,g==null)break e;w=S({},w,g);break e;case 2:Ut=!0}}o.callback!==null&&o.lane!==0&&(e.flags|=64,g=r.effects,g===null?r.effects=[o]:g.push(o))}else P={eventTime:P,lane:g,tag:o.tag,payload:o.payload,callback:o.callback,next:null},y===null?(x=y=P,i=w):y=y.next=P,a|=g;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;g=o,o=g.next,g.next=null,r.lastBaseUpdate=g,r.shared.pending=null}}while(!0);if(y===null&&(i=w),r.baseState=i,r.firstBaseUpdate=x,r.lastBaseUpdate=y,t=r.shared.interleaved,t!==null){r=t;do a|=r.lane,r=r.next;while(r!==t)}else s===null&&(r.shared.lanes=0);an|=a,e.lanes=a,e.memoizedState=w}}function ci(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var l=e[t],r=l.callback;if(r!==null){if(l.callback=null,l=n,typeof r!="function")throw Error(h(191,r));r.call(l)}}}var dl={},bt=zt(dl),ul=zt(dl),cl=zt(dl);function rn(e){if(e===dl)throw Error(h(174));return e}function Fs(e,t){switch(te(cl,t),te(ul,e),te(bt,dl),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:zr(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=zr(t,e)}re(bt),te(bt,t)}function An(){re(bt),re(ul),re(cl)}function pi(e){rn(cl.current);var t=rn(bt.current),n=zr(t,e.type);t!==n&&(te(ul,e),te(bt,n))}function zs(e){ul.current===e&&(re(bt),re(ul))}var ie=zt(0);function sr(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ws=[];function Bs(){for(var e=0;e<Ws.length;e++)Ws[e]._workInProgressVersionPrimary=null;Ws.length=0}var ar=ce.ReactCurrentDispatcher,Us=ce.ReactCurrentBatchConfig,sn=0,de=null,we=null,Re=null,or=!1,pl=!1,fl=0,tc=0;function je(){throw Error(h(321))}function Hs(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!ct(e[n],t[n]))return!1;return!0}function $s(e,t,n,l,r,s){if(sn=s,de=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ar.current=e===null||e.memoizedState===null?sc:ac,e=n(l,r),pl){s=0;do{if(pl=!1,fl=0,25<=s)throw Error(h(301));s+=1,Re=we=null,t.updateQueue=null,ar.current=oc,e=n(l,r)}while(pl)}if(ar.current=ur,t=we!==null&&we.next!==null,sn=0,Re=we=de=null,or=!1,t)throw Error(h(300));return e}function Qs(){var e=fl!==0;return fl=0,e}function wt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Re===null?de.memoizedState=Re=e:Re=Re.next=e,Re}function at(){if(we===null){var e=de.alternate;e=e!==null?e.memoizedState:null}else e=we.next;var t=Re===null?de.memoizedState:Re.next;if(t!==null)Re=t,we=e;else{if(e===null)throw Error(h(310));we=e,e={memoizedState:we.memoizedState,baseState:we.baseState,baseQueue:we.baseQueue,queue:we.queue,next:null},Re===null?de.memoizedState=Re=e:Re=Re.next=e}return Re}function ml(e,t){return typeof t=="function"?t(e):t}function Vs(e){var t=at(),n=t.queue;if(n===null)throw Error(h(311));n.lastRenderedReducer=e;var l=we,r=l.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}l.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,l=l.baseState;var o=a=null,i=null,x=s;do{var y=x.lane;if((sn&y)===y)i!==null&&(i=i.next={lane:0,action:x.action,hasEagerState:x.hasEagerState,eagerState:x.eagerState,next:null}),l=x.hasEagerState?x.eagerState:e(l,x.action);else{var w={lane:y,action:x.action,hasEagerState:x.hasEagerState,eagerState:x.eagerState,next:null};i===null?(o=i=w,a=l):i=i.next=w,de.lanes|=y,an|=y}x=x.next}while(x!==null&&x!==s);i===null?a=l:i.next=o,ct(l,t.memoizedState)||(Qe=!0),t.memoizedState=l,t.baseState=a,t.baseQueue=i,n.lastRenderedState=l}if(e=n.interleaved,e!==null){r=e;do s=r.lane,de.lanes|=s,an|=s,r=r.next;while(r!==e)}else r===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Ks(e){var t=at(),n=t.queue;if(n===null)throw Error(h(311));n.lastRenderedReducer=e;var l=n.dispatch,r=n.pending,s=t.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=e(s,a.action),a=a.next;while(a!==r);ct(s,t.memoizedState)||(Qe=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,l]}function fi(){}function mi(e,t){var n=de,l=at(),r=t(),s=!ct(l.memoizedState,r);if(s&&(l.memoizedState=r,Qe=!0),l=l.queue,qs(vi.bind(null,n,l,e),[e]),l.getSnapshot!==t||s||Re!==null&&Re.memoizedState.tag&1){if(n.flags|=2048,xl(9,hi.bind(null,n,l,r,t),void 0,null),Ne===null)throw Error(h(349));(sn&30)!==0||xi(n,t,r)}return r}function xi(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=de.updateQueue,t===null?(t={lastEffect:null,stores:null},de.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function hi(e,t,n,l){t.value=n,t.getSnapshot=l,gi(t)&&yi(e)}function vi(e,t,n){return n(function(){gi(t)&&yi(e)})}function gi(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!ct(e,n)}catch{return!0}}function yi(e){var t=Nt(e,1);t!==null&&ht(t,e,1,-1)}function bi(e){var t=wt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ml,lastRenderedState:e},t.queue=e,e=e.dispatch=rc.bind(null,de,e),[t.memoizedState,e]}function xl(e,t,n,l){return e={tag:e,create:t,destroy:n,deps:l,next:null},t=de.updateQueue,t===null?(t={lastEffect:null,stores:null},de.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(l=n.next,n.next=e,e.next=l,t.lastEffect=e)),e}function wi(){return at().memoizedState}function ir(e,t,n,l){var r=wt();de.flags|=e,r.memoizedState=xl(1|t,n,void 0,l===void 0?null:l)}function dr(e,t,n,l){var r=at();l=l===void 0?null:l;var s=void 0;if(we!==null){var a=we.memoizedState;if(s=a.destroy,l!==null&&Hs(l,a.deps)){r.memoizedState=xl(t,n,s,l);return}}de.flags|=e,r.memoizedState=xl(1|t,n,s,l)}function ki(e,t){return ir(8390656,8,e,t)}function qs(e,t){return dr(2048,8,e,t)}function Si(e,t){return dr(4,2,e,t)}function Ei(e,t){return dr(4,4,e,t)}function Ci(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Pi(e,t,n){return n=n!=null?n.concat([e]):null,dr(4,4,Ci.bind(null,t,e),n)}function Ys(){}function Ri(e,t){var n=at();t=t===void 0?null:t;var l=n.memoizedState;return l!==null&&t!==null&&Hs(t,l[1])?l[0]:(n.memoizedState=[e,t],e)}function Ni(e,t){var n=at();t=t===void 0?null:t;var l=n.memoizedState;return l!==null&&t!==null&&Hs(t,l[1])?l[0]:(e=e(),n.memoizedState=[e,t],e)}function _i(e,t,n){return(sn&21)===0?(e.baseState&&(e.baseState=!1,Qe=!0),e.memoizedState=n):(ct(n,t)||(n=ro(),de.lanes|=n,an|=n,e.baseState=!0),t)}function nc(e,t){var n=Y;Y=n!==0&&4>n?n:4,e(!0);var l=Us.transition;Us.transition={};try{e(!1),t()}finally{Y=n,Us.transition=l}}function Ti(){return at().memoizedState}function lc(e,t,n){var l=Kt(e);if(n={lane:l,action:n,hasEagerState:!1,eagerState:null,next:null},Ai(e))Di(t,n);else if(n=ii(e,t,n,l),n!==null){var r=Be();ht(n,e,l,r),Li(n,t,l)}}function rc(e,t,n){var l=Kt(e),r={lane:l,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ai(e))Di(t,r);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var a=t.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,ct(o,a)){var i=t.interleaved;i===null?(r.next=r,Ms(t)):(r.next=i.next,i.next=r),t.interleaved=r;return}}catch{}finally{}n=ii(e,t,r,l),n!==null&&(r=Be(),ht(n,e,l,r),Li(n,t,l))}}function Ai(e){var t=e.alternate;return e===de||t!==null&&t===de}function Di(e,t){pl=or=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Li(e,t,n){if((n&4194240)!==0){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,Xr(e,n)}}var ur={readContext:st,useCallback:je,useContext:je,useEffect:je,useImperativeHandle:je,useInsertionEffect:je,useLayoutEffect:je,useMemo:je,useReducer:je,useRef:je,useState:je,useDebugValue:je,useDeferredValue:je,useTransition:je,useMutableSource:je,useSyncExternalStore:je,useId:je,unstable_isNewReconciler:!1},sc={readContext:st,useCallback:function(e,t){return wt().memoizedState=[e,t===void 0?null:t],e},useContext:st,useEffect:ki,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ir(4194308,4,Ci.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ir(4194308,4,e,t)},useInsertionEffect:function(e,t){return ir(4,2,e,t)},useMemo:function(e,t){var n=wt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var l=wt();return t=n!==void 0?n(t):t,l.memoizedState=l.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},l.queue=e,e=e.dispatch=lc.bind(null,de,e),[l.memoizedState,e]},useRef:function(e){var t=wt();return e={current:e},t.memoizedState=e},useState:bi,useDebugValue:Ys,useDeferredValue:function(e){return wt().memoizedState=e},useTransition:function(){var e=bi(!1),t=e[0];return e=nc.bind(null,e[1]),wt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var l=de,r=wt();if(ae){if(n===void 0)throw Error(h(407));n=n()}else{if(n=t(),Ne===null)throw Error(h(349));(sn&30)!==0||xi(l,t,n)}r.memoizedState=n;var s={value:n,getSnapshot:t};return r.queue=s,ki(vi.bind(null,l,s,e),[e]),l.flags|=2048,xl(9,hi.bind(null,l,s,n,t),void 0,null),n},useId:function(){var e=wt(),t=Ne.identifierPrefix;if(ae){var n=Rt,l=Pt;n=(l&~(1<<32-ut(l)-1)).toString(32)+n,t=":"+t+"R"+n,n=fl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=tc++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},ac={readContext:st,useCallback:Ri,useContext:st,useEffect:qs,useImperativeHandle:Pi,useInsertionEffect:Si,useLayoutEffect:Ei,useMemo:Ni,useReducer:Vs,useRef:wi,useState:function(){return Vs(ml)},useDebugValue:Ys,useDeferredValue:function(e){var t=at();return _i(t,we.memoizedState,e)},useTransition:function(){var e=Vs(ml)[0],t=at().memoizedState;return[e,t]},useMutableSource:fi,useSyncExternalStore:mi,useId:Ti,unstable_isNewReconciler:!1},oc={readContext:st,useCallback:Ri,useContext:st,useEffect:qs,useImperativeHandle:Pi,useInsertionEffect:Si,useLayoutEffect:Ei,useMemo:Ni,useReducer:Ks,useRef:wi,useState:function(){return Ks(ml)},useDebugValue:Ys,useDeferredValue:function(e){var t=at();return we===null?t.memoizedState=e:_i(t,we.memoizedState,e)},useTransition:function(){var e=Ks(ml)[0],t=at().memoizedState;return[e,t]},useMutableSource:fi,useSyncExternalStore:mi,useId:Ti,unstable_isNewReconciler:!1};function ft(e,t){if(e&&e.defaultProps){t=S({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Gs(e,t,n,l){t=e.memoizedState,n=n(l,t),n=n==null?t:S({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var cr={isMounted:function(e){return(e=e._reactInternals)?Zt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var l=Be(),r=Kt(e),s=_t(l,r);s.payload=t,n!=null&&(s.callback=n),t=Ht(e,s,r),t!==null&&(ht(t,e,r,l),lr(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var l=Be(),r=Kt(e),s=_t(l,r);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=Ht(e,s,r),t!==null&&(ht(t,e,r,l),lr(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Be(),l=Kt(e),r=_t(n,l);r.tag=2,t!=null&&(r.callback=t),t=Ht(e,r,l),t!==null&&(ht(t,e,l,n),lr(t,e,l))}};function Ii(e,t,n,l,r,s,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,s,a):t.prototype&&t.prototype.isPureReactComponent?!tl(n,l)||!tl(r,s):!0}function ji(e,t,n){var l=!1,r=Wt,s=t.contextType;return typeof s=="object"&&s!==null?s=st(s):(r=$e(t)?en:Ie.current,l=t.contextTypes,s=(l=l!=null)?En(e,r):Wt),t=new t(n,s),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=cr,e.stateNode=t,t._reactInternals=e,l&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=r,e.__reactInternalMemoizedMaskedChildContext=s),t}function Mi(e,t,n,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,l),t.state!==e&&cr.enqueueReplaceState(t,t.state,null)}function Xs(e,t,n,l){var r=e.stateNode;r.props=n,r.state=e.memoizedState,r.refs={},Os(e);var s=t.contextType;typeof s=="object"&&s!==null?r.context=st(s):(s=$e(t)?en:Ie.current,r.context=En(e,s)),r.state=e.memoizedState,s=t.getDerivedStateFromProps,typeof s=="function"&&(Gs(e,t,s,n),r.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(t=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),t!==r.state&&cr.enqueueReplaceState(r,r.state,null),rr(e,n,r,l),r.state=e.memoizedState),typeof r.componentDidMount=="function"&&(e.flags|=4194308)}function Dn(e,t){try{var n="",l=t;do n+=Q(l),l=l.return;while(l);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:t,stack:r,digest:null}}function Zs(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Js(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var ic=typeof WeakMap=="function"?WeakMap:Map;function Oi(e,t,n){n=_t(-1,n),n.tag=3,n.payload={element:null};var l=t.value;return n.callback=function(){gr||(gr=!0,ma=l),Js(e,t)},n}function Fi(e,t,n){n=_t(-1,n),n.tag=3;var l=e.type.getDerivedStateFromError;if(typeof l=="function"){var r=t.value;n.payload=function(){return l(r)},n.callback=function(){Js(e,t)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Js(e,t),typeof l!="function"&&(Qt===null?Qt=new Set([this]):Qt.add(this));var a=t.stack;this.componentDidCatch(t.value,{componentStack:a!==null?a:""})}),n}function zi(e,t,n){var l=e.pingCache;if(l===null){l=e.pingCache=new ic;var r=new Set;l.set(t,r)}else r=l.get(t),r===void 0&&(r=new Set,l.set(t,r));r.has(n)||(r.add(n),e=kc.bind(null,e,t,n),t.then(e,e))}function Wi(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Bi(e,t,n,l,r){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=_t(-1,1),t.tag=2,Ht(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=r,e)}var dc=ce.ReactCurrentOwner,Qe=!1;function We(e,t,n,l){t.child=e===null?oi(t,null,n,l):Nn(t,e.child,n,l)}function Ui(e,t,n,l,r){n=n.render;var s=t.ref;return Tn(t,r),l=$s(e,t,n,l,s,r),n=Qs(),e!==null&&!Qe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Tt(e,t,r)):(ae&&n&&Rs(t),t.flags|=1,We(e,t,l,r),t.child)}function Hi(e,t,n,l,r){if(e===null){var s=n.type;return typeof s=="function"&&!wa(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=s,$i(e,t,s,l,r)):(e=Er(n.type,null,l,t,t.mode,r),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,(e.lanes&r)===0){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:tl,n(a,l)&&e.ref===t.ref)return Tt(e,t,r)}return t.flags|=1,e=Yt(s,l),e.ref=t.ref,e.return=t,t.child=e}function $i(e,t,n,l,r){if(e!==null){var s=e.memoizedProps;if(tl(s,l)&&e.ref===t.ref)if(Qe=!1,t.pendingProps=l=s,(e.lanes&r)!==0)(e.flags&131072)!==0&&(Qe=!0);else return t.lanes=e.lanes,Tt(e,t,r)}return ea(e,t,n,l,r)}function Qi(e,t,n){var l=t.pendingProps,r=l.children,s=e!==null?e.memoizedState:null;if(l.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},te(In,et),et|=n;else{if((n&1073741824)===0)return e=s!==null?s.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,te(In,et),et|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},l=s!==null?s.baseLanes:n,te(In,et),et|=l}else s!==null?(l=s.baseLanes|n,t.memoizedState=null):l=n,te(In,et),et|=l;return We(e,t,r,n),t.child}function Vi(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ea(e,t,n,l,r){var s=$e(n)?en:Ie.current;return s=En(t,s),Tn(t,r),n=$s(e,t,n,l,s,r),l=Qs(),e!==null&&!Qe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Tt(e,t,r)):(ae&&l&&Rs(t),t.flags|=1,We(e,t,n,r),t.child)}function Ki(e,t,n,l,r){if($e(n)){var s=!0;Yl(t)}else s=!1;if(Tn(t,r),t.stateNode===null)fr(e,t),ji(t,n,l),Xs(t,n,l,r),l=!0;else if(e===null){var a=t.stateNode,o=t.memoizedProps;a.props=o;var i=a.context,x=n.contextType;typeof x=="object"&&x!==null?x=st(x):(x=$e(n)?en:Ie.current,x=En(t,x));var y=n.getDerivedStateFromProps,w=typeof y=="function"||typeof a.getSnapshotBeforeUpdate=="function";w||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==l||i!==x)&&Mi(t,a,l,x),Ut=!1;var g=t.memoizedState;a.state=g,rr(t,l,a,r),i=t.memoizedState,o!==l||g!==i||He.current||Ut?(typeof y=="function"&&(Gs(t,n,y,l),i=t.memoizedState),(o=Ut||Ii(t,n,o,l,g,i,x))?(w||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=i),a.props=l,a.state=i,a.context=x,l=o):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{a=t.stateNode,di(e,t),o=t.memoizedProps,x=t.type===t.elementType?o:ft(t.type,o),a.props=x,w=t.pendingProps,g=a.context,i=n.contextType,typeof i=="object"&&i!==null?i=st(i):(i=$e(n)?en:Ie.current,i=En(t,i));var P=n.getDerivedStateFromProps;(y=typeof P=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==w||g!==i)&&Mi(t,a,l,i),Ut=!1,g=t.memoizedState,a.state=g,rr(t,l,a,r);var T=t.memoizedState;o!==w||g!==T||He.current||Ut?(typeof P=="function"&&(Gs(t,n,P,l),T=t.memoizedState),(x=Ut||Ii(t,n,x,l,g,T,i)||!1)?(y||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(l,T,i),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(l,T,i)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=T),a.props=l,a.state=T,a.context=i,l=x):(typeof a.componentDidUpdate!="function"||o===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),l=!1)}return ta(e,t,n,l,s,r)}function ta(e,t,n,l,r,s){Vi(e,t);var a=(t.flags&128)!==0;if(!l&&!a)return r&&Zo(t,n,!1),Tt(e,t,s);l=t.stateNode,dc.current=t;var o=a&&typeof n.getDerivedStateFromError!="function"?null:l.render();return t.flags|=1,e!==null&&a?(t.child=Nn(t,e.child,null,s),t.child=Nn(t,null,o,s)):We(e,t,o,s),t.memoizedState=l.state,r&&Zo(t,n,!0),t.child}function qi(e){var t=e.stateNode;t.pendingContext?Go(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Go(e,t.context,!1),Fs(e,t.containerInfo)}function Yi(e,t,n,l,r){return Rn(),As(r),t.flags|=256,We(e,t,n,l),t.child}var na={dehydrated:null,treeContext:null,retryLane:0};function la(e){return{baseLanes:e,cachePool:null,transitions:null}}function Gi(e,t,n){var l=t.pendingProps,r=ie.current,s=!1,a=(t.flags&128)!==0,o;if((o=a)||(o=e!==null&&e.memoizedState===null?!1:(r&2)!==0),o?(s=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(r|=1),te(ie,r&1),e===null)return Ts(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(a=l.children,e=l.fallback,s?(l=t.mode,s=t.child,a={mode:"hidden",children:a},(l&1)===0&&s!==null?(s.childLanes=0,s.pendingProps=a):s=Cr(a,l,0,null),e=cn(e,l,n,null),s.return=t,e.return=t,s.sibling=e,t.child=s,t.child.memoizedState=la(n),t.memoizedState=na,e):ra(t,a));if(r=e.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return uc(e,t,a,l,o,r,n);if(s){s=l.fallback,a=t.mode,r=e.child,o=r.sibling;var i={mode:"hidden",children:l.children};return(a&1)===0&&t.child!==r?(l=t.child,l.childLanes=0,l.pendingProps=i,t.deletions=null):(l=Yt(r,i),l.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=Yt(o,s):(s=cn(s,a,n,null),s.flags|=2),s.return=t,l.return=t,l.sibling=s,t.child=l,l=s,s=t.child,a=e.child.memoizedState,a=a===null?la(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=e.childLanes&~n,t.memoizedState=na,l}return s=e.child,e=s.sibling,l=Yt(s,{mode:"visible",children:l.children}),(t.mode&1)===0&&(l.lanes=n),l.return=t,l.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=l,t.memoizedState=null,l}function ra(e,t){return t=Cr({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function pr(e,t,n,l){return l!==null&&As(l),Nn(t,e.child,null,n),e=ra(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function uc(e,t,n,l,r,s,a){if(n)return t.flags&256?(t.flags&=-257,l=Zs(Error(h(422))),pr(e,t,a,l)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(s=l.fallback,r=t.mode,l=Cr({mode:"visible",children:l.children},r,0,null),s=cn(s,r,a,null),s.flags|=2,l.return=t,s.return=t,l.sibling=s,t.child=l,(t.mode&1)!==0&&Nn(t,e.child,null,a),t.child.memoizedState=la(a),t.memoizedState=na,s);if((t.mode&1)===0)return pr(e,t,a,null);if(r.data==="$!"){if(l=r.nextSibling&&r.nextSibling.dataset,l)var o=l.dgst;return l=o,s=Error(h(419)),l=Zs(s,l,void 0),pr(e,t,a,l)}if(o=(a&e.childLanes)!==0,Qe||o){if(l=Ne,l!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=(r&(l.suspendedLanes|a))!==0?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Nt(e,r),ht(l,e,r,-1))}return ba(),l=Zs(Error(h(421))),pr(e,t,a,l)}return r.data==="$?"?(t.flags|=128,t.child=e.child,t=Sc.bind(null,e),r._reactRetry=t,null):(e=s.treeContext,Je=Ft(r.nextSibling),Ze=t,ae=!0,pt=null,e!==null&&(lt[rt++]=Pt,lt[rt++]=Rt,lt[rt++]=tn,Pt=e.id,Rt=e.overflow,tn=t),t=ra(t,l.children),t.flags|=4096,t)}function Xi(e,t,n){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),js(e.return,t,n)}function sa(e,t,n,l,r){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:n,tailMode:r}:(s.isBackwards=t,s.rendering=null,s.renderingStartTime=0,s.last=l,s.tail=n,s.tailMode=r)}function Zi(e,t,n){var l=t.pendingProps,r=l.revealOrder,s=l.tail;if(We(e,t,l.children,n),l=ie.current,(l&2)!==0)l=l&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Xi(e,n,t);else if(e.tag===19)Xi(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}l&=1}if(te(ie,l),(t.mode&1)===0)t.memoizedState=null;else switch(r){case"forwards":for(n=t.child,r=null;n!==null;)e=n.alternate,e!==null&&sr(e)===null&&(r=n),n=n.sibling;n=r,n===null?(r=t.child,t.child=null):(r=n.sibling,n.sibling=null),sa(t,!1,r,n,s);break;case"backwards":for(n=null,r=t.child,t.child=null;r!==null;){if(e=r.alternate,e!==null&&sr(e)===null){t.child=r;break}e=r.sibling,r.sibling=n,n=r,r=e}sa(t,!0,n,null,s);break;case"together":sa(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function fr(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Tt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),an|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(h(153));if(t.child!==null){for(e=t.child,n=Yt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Yt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function cc(e,t,n){switch(t.tag){case 3:qi(t),Rn();break;case 5:pi(t);break;case 1:$e(t.type)&&Yl(t);break;case 4:Fs(t,t.stateNode.containerInfo);break;case 10:var l=t.type._context,r=t.memoizedProps.value;te(tr,l._currentValue),l._currentValue=r;break;case 13:if(l=t.memoizedState,l!==null)return l.dehydrated!==null?(te(ie,ie.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Gi(e,t,n):(te(ie,ie.current&1),e=Tt(e,t,n),e!==null?e.sibling:null);te(ie,ie.current&1);break;case 19:if(l=(n&t.childLanes)!==0,(e.flags&128)!==0){if(l)return Zi(e,t,n);t.flags|=128}if(r=t.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),te(ie,ie.current),l)break;return null;case 22:case 23:return t.lanes=0,Qi(e,t,n)}return Tt(e,t,n)}var Ji,aa,ed,td;Ji=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},aa=function(){},ed=function(e,t,n,l){var r=e.memoizedProps;if(r!==l){e=t.stateNode,rn(bt.current);var s=null;switch(n){case"input":r=jr(e,r),l=jr(e,l),s=[];break;case"select":r=S({},r,{value:void 0}),l=S({},l,{value:void 0}),s=[];break;case"textarea":r=Fr(e,r),l=Fr(e,l),s=[];break;default:typeof r.onClick!="function"&&typeof l.onClick=="function"&&(e.onclick=Vl)}Wr(n,l);var a;n=null;for(x in r)if(!l.hasOwnProperty(x)&&r.hasOwnProperty(x)&&r[x]!=null)if(x==="style"){var o=r[x];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else x!=="dangerouslySetInnerHTML"&&x!=="children"&&x!=="suppressContentEditableWarning"&&x!=="suppressHydrationWarning"&&x!=="autoFocus"&&(O.hasOwnProperty(x)?s||(s=[]):(s=s||[]).push(x,null));for(x in l){var i=l[x];if(o=r!=null?r[x]:void 0,l.hasOwnProperty(x)&&i!==o&&(i!=null||o!=null))if(x==="style")if(o){for(a in o)!o.hasOwnProperty(a)||i&&i.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in i)i.hasOwnProperty(a)&&o[a]!==i[a]&&(n||(n={}),n[a]=i[a])}else n||(s||(s=[]),s.push(x,n)),n=i;else x==="dangerouslySetInnerHTML"?(i=i?i.__html:void 0,o=o?o.__html:void 0,i!=null&&o!==i&&(s=s||[]).push(x,i)):x==="children"?typeof i!="string"&&typeof i!="number"||(s=s||[]).push(x,""+i):x!=="suppressContentEditableWarning"&&x!=="suppressHydrationWarning"&&(O.hasOwnProperty(x)?(i!=null&&x==="onScroll"&&le("scroll",e),s||o===i||(s=[])):(s=s||[]).push(x,i))}n&&(s=s||[]).push("style",n);var x=s;(t.updateQueue=x)&&(t.flags|=4)}},td=function(e,t,n,l){n!==l&&(t.flags|=4)};function hl(e,t){if(!ae)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var l=null;n!==null;)n.alternate!==null&&(l=n),n=n.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Me(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,l=0;if(t)for(var r=e.child;r!==null;)n|=r.lanes|r.childLanes,l|=r.subtreeFlags&14680064,l|=r.flags&14680064,r.return=e,r=r.sibling;else for(r=e.child;r!==null;)n|=r.lanes|r.childLanes,l|=r.subtreeFlags,l|=r.flags,r.return=e,r=r.sibling;return e.subtreeFlags|=l,e.childLanes=n,t}function pc(e,t,n){var l=t.pendingProps;switch(Ns(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Me(t),null;case 1:return $e(t.type)&&ql(),Me(t),null;case 3:return l=t.stateNode,An(),re(He),re(Ie),Bs(),l.pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),(e===null||e.child===null)&&(Jl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,pt!==null&&(va(pt),pt=null))),aa(e,t),Me(t),null;case 5:zs(t);var r=rn(cl.current);if(n=t.type,e!==null&&t.stateNode!=null)ed(e,t,n,l,r),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!l){if(t.stateNode===null)throw Error(h(166));return Me(t),null}if(e=rn(bt.current),Jl(t)){l=t.stateNode,n=t.type;var s=t.memoizedProps;switch(l[yt]=t,l[al]=s,e=(t.mode&1)!==0,n){case"dialog":le("cancel",l),le("close",l);break;case"iframe":case"object":case"embed":le("load",l);break;case"video":case"audio":for(r=0;r<ll.length;r++)le(ll[r],l);break;case"source":le("error",l);break;case"img":case"image":case"link":le("error",l),le("load",l);break;case"details":le("toggle",l);break;case"input":Ia(l,s),le("invalid",l);break;case"select":l._wrapperState={wasMultiple:!!s.multiple},le("invalid",l);break;case"textarea":Oa(l,s),le("invalid",l)}Wr(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?l.textContent!==o&&(s.suppressHydrationWarning!==!0&&Ql(l.textContent,o,e),r=["children",o]):typeof o=="number"&&l.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&Ql(l.textContent,o,e),r=["children",""+o]):O.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&le("scroll",l)}switch(n){case"input":kl(l),Ma(l,s,!0);break;case"textarea":kl(l),za(l);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(l.onclick=Vl)}l=r,t.updateQueue=l,l!==null&&(t.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Wa(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof l.is=="string"?e=a.createElement(n,{is:l.is}):(e=a.createElement(n),n==="select"&&(a=e,l.multiple?a.multiple=!0:l.size&&(a.size=l.size))):e=a.createElementNS(e,n),e[yt]=t,e[al]=l,Ji(e,t,!1,!1),t.stateNode=e;e:{switch(a=Br(n,l),n){case"dialog":le("cancel",e),le("close",e),r=l;break;case"iframe":case"object":case"embed":le("load",e),r=l;break;case"video":case"audio":for(r=0;r<ll.length;r++)le(ll[r],e);r=l;break;case"source":le("error",e),r=l;break;case"img":case"image":case"link":le("error",e),le("load",e),r=l;break;case"details":le("toggle",e),r=l;break;case"input":Ia(e,l),r=jr(e,l),le("invalid",e);break;case"option":r=l;break;case"select":e._wrapperState={wasMultiple:!!l.multiple},r=S({},l,{value:void 0}),le("invalid",e);break;case"textarea":Oa(e,l),r=Fr(e,l),le("invalid",e);break;default:r=l}Wr(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var i=o[s];s==="style"?Ha(e,i):s==="dangerouslySetInnerHTML"?(i=i?i.__html:void 0,i!=null&&Ba(e,i)):s==="children"?typeof i=="string"?(n!=="textarea"||i!=="")&&Fn(e,i):typeof i=="number"&&Fn(e,""+i):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(O.hasOwnProperty(s)?i!=null&&s==="onScroll"&&le("scroll",e):i!=null&&X(e,s,i,a))}switch(n){case"input":kl(e),Ma(e,l,!1);break;case"textarea":kl(e),za(e);break;case"option":l.value!=null&&e.setAttribute("value",""+q(l.value));break;case"select":e.multiple=!!l.multiple,s=l.value,s!=null?pn(e,!!l.multiple,s,!1):l.defaultValue!=null&&pn(e,!!l.multiple,l.defaultValue,!0);break;default:typeof r.onClick=="function"&&(e.onclick=Vl)}switch(n){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}}l&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Me(t),null;case 6:if(e&&t.stateNode!=null)td(e,t,e.memoizedProps,l);else{if(typeof l!="string"&&t.stateNode===null)throw Error(h(166));if(n=rn(cl.current),rn(bt.current),Jl(t)){if(l=t.stateNode,n=t.memoizedProps,l[yt]=t,(s=l.nodeValue!==n)&&(e=Ze,e!==null))switch(e.tag){case 3:Ql(l.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Ql(l.nodeValue,n,(e.mode&1)!==0)}s&&(t.flags|=4)}else l=(n.nodeType===9?n:n.ownerDocument).createTextNode(l),l[yt]=t,t.stateNode=l}return Me(t),null;case 13:if(re(ie),l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ae&&Je!==null&&(t.mode&1)!==0&&(t.flags&128)===0)ri(),Rn(),t.flags|=98560,s=!1;else if(s=Jl(t),l!==null&&l.dehydrated!==null){if(e===null){if(!s)throw Error(h(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(h(317));s[yt]=t}else Rn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Me(t),s=!1}else pt!==null&&(va(pt),pt=null),s=!0;if(!s)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(l=l!==null,l!==(e!==null&&e.memoizedState!==null)&&l&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(ie.current&1)!==0?ke===0&&(ke=3):ba())),t.updateQueue!==null&&(t.flags|=4),Me(t),null);case 4:return An(),aa(e,t),e===null&&rl(t.stateNode.containerInfo),Me(t),null;case 10:return Is(t.type._context),Me(t),null;case 17:return $e(t.type)&&ql(),Me(t),null;case 19:if(re(ie),s=t.memoizedState,s===null)return Me(t),null;if(l=(t.flags&128)!==0,a=s.rendering,a===null)if(l)hl(s,!1);else{if(ke!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=sr(e),a!==null){for(t.flags|=128,hl(s,!1),l=a.updateQueue,l!==null&&(t.updateQueue=l,t.flags|=4),t.subtreeFlags=0,l=n,n=t.child;n!==null;)s=n,e=l,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,e=a.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return te(ie,ie.current&1|2),t.child}e=e.sibling}s.tail!==null&&xe()>jn&&(t.flags|=128,l=!0,hl(s,!1),t.lanes=4194304)}else{if(!l)if(e=sr(a),e!==null){if(t.flags|=128,l=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),hl(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!ae)return Me(t),null}else 2*xe()-s.renderingStartTime>jn&&n!==1073741824&&(t.flags|=128,l=!0,hl(s,!1),t.lanes=4194304);s.isBackwards?(a.sibling=t.child,t.child=a):(n=s.last,n!==null?n.sibling=a:t.child=a,s.last=a)}return s.tail!==null?(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=xe(),t.sibling=null,n=ie.current,te(ie,l?n&1|2:n&1),t):(Me(t),null);case 22:case 23:return ya(),l=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==l&&(t.flags|=8192),l&&(t.mode&1)!==0?(et&1073741824)!==0&&(Me(t),t.subtreeFlags&6&&(t.flags|=8192)):Me(t),null;case 24:return null;case 25:return null}throw Error(h(156,t.tag))}function fc(e,t){switch(Ns(t),t.tag){case 1:return $e(t.type)&&ql(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return An(),re(He),re(Ie),Bs(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return zs(t),null;case 13:if(re(ie),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(h(340));Rn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return re(ie),null;case 4:return An(),null;case 10:return Is(t.type._context),null;case 22:case 23:return ya(),null;case 24:return null;default:return null}}var mr=!1,Oe=!1,mc=typeof WeakSet=="function"?WeakSet:Set,_=null;function Ln(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(l){pe(e,t,l)}else n.current=null}function oa(e,t,n){try{n()}catch(l){pe(e,t,l)}}var nd=!1;function xc(e,t){if(ys=Il,e=Io(),cs(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var l=n.getSelection&&n.getSelection();if(l&&l.rangeCount!==0){n=l.anchorNode;var r=l.anchorOffset,s=l.focusNode;l=l.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,i=-1,x=0,y=0,w=e,g=null;t:for(;;){for(var P;w!==n||r!==0&&w.nodeType!==3||(o=a+r),w!==s||l!==0&&w.nodeType!==3||(i=a+l),w.nodeType===3&&(a+=w.nodeValue.length),(P=w.firstChild)!==null;)g=w,w=P;for(;;){if(w===e)break t;if(g===n&&++x===r&&(o=a),g===s&&++y===l&&(i=a),(P=w.nextSibling)!==null)break;w=g,g=w.parentNode}w=P}n=o===-1||i===-1?null:{start:o,end:i}}else n=null}n=n||{start:0,end:0}}else n=null;for(bs={focusedElem:e,selectionRange:n},Il=!1,_=t;_!==null;)if(t=_,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,_=e;else for(;_!==null;){t=_;try{var T=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(T!==null){var A=T.memoizedProps,he=T.memoizedState,p=t.stateNode,d=p.getSnapshotBeforeUpdate(t.elementType===t.type?A:ft(t.type,A),he);p.__reactInternalSnapshotBeforeUpdate=d}break;case 3:var m=t.stateNode.containerInfo;m.nodeType===1?m.textContent="":m.nodeType===9&&m.documentElement&&m.removeChild(m.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(h(163))}}catch(k){pe(t,t.return,k)}if(e=t.sibling,e!==null){e.return=t.return,_=e;break}_=t.return}return T=nd,nd=!1,T}function vl(e,t,n){var l=t.updateQueue;if(l=l!==null?l.lastEffect:null,l!==null){var r=l=l.next;do{if((r.tag&e)===e){var s=r.destroy;r.destroy=void 0,s!==void 0&&oa(t,n,s)}r=r.next}while(r!==l)}}function xr(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var l=n.create;n.destroy=l()}n=n.next}while(n!==t)}}function ia(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function ld(e){var t=e.alternate;t!==null&&(e.alternate=null,ld(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[yt],delete t[al],delete t[Es],delete t[Xu],delete t[Zu])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function rd(e){return e.tag===5||e.tag===3||e.tag===4}function sd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||rd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function da(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Vl));else if(l!==4&&(e=e.child,e!==null))for(da(e,t,n),e=e.sibling;e!==null;)da(e,t,n),e=e.sibling}function ua(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(l!==4&&(e=e.child,e!==null))for(ua(e,t,n),e=e.sibling;e!==null;)ua(e,t,n),e=e.sibling}var De=null,mt=!1;function $t(e,t,n){for(n=n.child;n!==null;)ad(e,t,n),n=n.sibling}function ad(e,t,n){if(gt&&typeof gt.onCommitFiberUnmount=="function")try{gt.onCommitFiberUnmount(Nl,n)}catch{}switch(n.tag){case 5:Oe||Ln(n,t);case 6:var l=De,r=mt;De=null,$t(e,t,n),De=l,mt=r,De!==null&&(mt?(e=De,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):De.removeChild(n.stateNode));break;case 18:De!==null&&(mt?(e=De,n=n.stateNode,e.nodeType===8?Ss(e.parentNode,n):e.nodeType===1&&Ss(e,n),Yn(e)):Ss(De,n.stateNode));break;case 4:l=De,r=mt,De=n.stateNode.containerInfo,mt=!0,$t(e,t,n),De=l,mt=r;break;case 0:case 11:case 14:case 15:if(!Oe&&(l=n.updateQueue,l!==null&&(l=l.lastEffect,l!==null))){r=l=l.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&((s&2)!==0||(s&4)!==0)&&oa(n,t,a),r=r.next}while(r!==l)}$t(e,t,n);break;case 1:if(!Oe&&(Ln(n,t),l=n.stateNode,typeof l.componentWillUnmount=="function"))try{l.props=n.memoizedProps,l.state=n.memoizedState,l.componentWillUnmount()}catch(o){pe(n,t,o)}$t(e,t,n);break;case 21:$t(e,t,n);break;case 22:n.mode&1?(Oe=(l=Oe)||n.memoizedState!==null,$t(e,t,n),Oe=l):$t(e,t,n);break;default:$t(e,t,n)}}function od(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new mc),t.forEach(function(l){var r=Ec.bind(null,e,l);n.has(l)||(n.add(l),l.then(r,r))})}}function xt(e,t){var n=t.deletions;if(n!==null)for(var l=0;l<n.length;l++){var r=n[l];try{var s=e,a=t,o=a;e:for(;o!==null;){switch(o.tag){case 5:De=o.stateNode,mt=!1;break e;case 3:De=o.stateNode.containerInfo,mt=!0;break e;case 4:De=o.stateNode.containerInfo,mt=!0;break e}o=o.return}if(De===null)throw Error(h(160));ad(s,a,r),De=null,mt=!1;var i=r.alternate;i!==null&&(i.return=null),r.return=null}catch(x){pe(r,t,x)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)id(t,e),t=t.sibling}function id(e,t){var n=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(xt(t,e),kt(e),l&4){try{vl(3,e,e.return),xr(3,e)}catch(A){pe(e,e.return,A)}try{vl(5,e,e.return)}catch(A){pe(e,e.return,A)}}break;case 1:xt(t,e),kt(e),l&512&&n!==null&&Ln(n,n.return);break;case 5:if(xt(t,e),kt(e),l&512&&n!==null&&Ln(n,n.return),e.flags&32){var r=e.stateNode;try{Fn(r,"")}catch(A){pe(e,e.return,A)}}if(l&4&&(r=e.stateNode,r!=null)){var s=e.memoizedProps,a=n!==null?n.memoizedProps:s,o=e.type,i=e.updateQueue;if(e.updateQueue=null,i!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&ja(r,s),Br(o,a);var x=Br(o,s);for(a=0;a<i.length;a+=2){var y=i[a],w=i[a+1];y==="style"?Ha(r,w):y==="dangerouslySetInnerHTML"?Ba(r,w):y==="children"?Fn(r,w):X(r,y,w,x)}switch(o){case"input":Mr(r,s);break;case"textarea":Fa(r,s);break;case"select":var g=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var P=s.value;P!=null?pn(r,!!s.multiple,P,!1):g!==!!s.multiple&&(s.defaultValue!=null?pn(r,!!s.multiple,s.defaultValue,!0):pn(r,!!s.multiple,s.multiple?[]:"",!1))}r[al]=s}catch(A){pe(e,e.return,A)}}break;case 6:if(xt(t,e),kt(e),l&4){if(e.stateNode===null)throw Error(h(162));r=e.stateNode,s=e.memoizedProps;try{r.nodeValue=s}catch(A){pe(e,e.return,A)}}break;case 3:if(xt(t,e),kt(e),l&4&&n!==null&&n.memoizedState.isDehydrated)try{Yn(t.containerInfo)}catch(A){pe(e,e.return,A)}break;case 4:xt(t,e),kt(e);break;case 13:xt(t,e),kt(e),r=e.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(fa=xe())),l&4&&od(e);break;case 22:if(y=n!==null&&n.memoizedState!==null,e.mode&1?(Oe=(x=Oe)||y,xt(t,e),Oe=x):xt(t,e),kt(e),l&8192){if(x=e.memoizedState!==null,(e.stateNode.isHidden=x)&&!y&&(e.mode&1)!==0)for(_=e,y=e.child;y!==null;){for(w=_=y;_!==null;){switch(g=_,P=g.child,g.tag){case 0:case 11:case 14:case 15:vl(4,g,g.return);break;case 1:Ln(g,g.return);var T=g.stateNode;if(typeof T.componentWillUnmount=="function"){l=g,n=g.return;try{t=l,T.props=t.memoizedProps,T.state=t.memoizedState,T.componentWillUnmount()}catch(A){pe(l,n,A)}}break;case 5:Ln(g,g.return);break;case 22:if(g.memoizedState!==null){cd(w);continue}}P!==null?(P.return=g,_=P):cd(w)}y=y.sibling}e:for(y=null,w=e;;){if(w.tag===5){if(y===null){y=w;try{r=w.stateNode,x?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=w.stateNode,i=w.memoizedProps.style,a=i!=null&&i.hasOwnProperty("display")?i.display:null,o.style.display=Ua("display",a))}catch(A){pe(e,e.return,A)}}}else if(w.tag===6){if(y===null)try{w.stateNode.nodeValue=x?"":w.memoizedProps}catch(A){pe(e,e.return,A)}}else if((w.tag!==22&&w.tag!==23||w.memoizedState===null||w===e)&&w.child!==null){w.child.return=w,w=w.child;continue}if(w===e)break e;for(;w.sibling===null;){if(w.return===null||w.return===e)break e;y===w&&(y=null),w=w.return}y===w&&(y=null),w.sibling.return=w.return,w=w.sibling}}break;case 19:xt(t,e),kt(e),l&4&&od(e);break;case 21:break;default:xt(t,e),kt(e)}}function kt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(rd(n)){var l=n;break e}n=n.return}throw Error(h(160))}switch(l.tag){case 5:var r=l.stateNode;l.flags&32&&(Fn(r,""),l.flags&=-33);var s=sd(e);ua(e,s,r);break;case 3:case 4:var a=l.stateNode.containerInfo,o=sd(e);da(e,o,a);break;default:throw Error(h(161))}}catch(i){pe(e,e.return,i)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function hc(e,t,n){_=e,dd(e)}function dd(e,t,n){for(var l=(e.mode&1)!==0;_!==null;){var r=_,s=r.child;if(r.tag===22&&l){var a=r.memoizedState!==null||mr;if(!a){var o=r.alternate,i=o!==null&&o.memoizedState!==null||Oe;o=mr;var x=Oe;if(mr=a,(Oe=i)&&!x)for(_=r;_!==null;)a=_,i=a.child,a.tag===22&&a.memoizedState!==null?pd(r):i!==null?(i.return=a,_=i):pd(r);for(;s!==null;)_=s,dd(s),s=s.sibling;_=r,mr=o,Oe=x}ud(e)}else(r.subtreeFlags&8772)!==0&&s!==null?(s.return=r,_=s):ud(e)}}function ud(e){for(;_!==null;){var t=_;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Oe||xr(5,t);break;case 1:var l=t.stateNode;if(t.flags&4&&!Oe)if(n===null)l.componentDidMount();else{var r=t.elementType===t.type?n.memoizedProps:ft(t.type,n.memoizedProps);l.componentDidUpdate(r,n.memoizedState,l.__reactInternalSnapshotBeforeUpdate)}var s=t.updateQueue;s!==null&&ci(t,s,l);break;case 3:var a=t.updateQueue;if(a!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}ci(t,a,n)}break;case 5:var o=t.stateNode;if(n===null&&t.flags&4){n=o;var i=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":i.autoFocus&&n.focus();break;case"img":i.src&&(n.src=i.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var x=t.alternate;if(x!==null){var y=x.memoizedState;if(y!==null){var w=y.dehydrated;w!==null&&Yn(w)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(h(163))}Oe||t.flags&512&&ia(t)}catch(g){pe(t,t.return,g)}}if(t===e){_=null;break}if(n=t.sibling,n!==null){n.return=t.return,_=n;break}_=t.return}}function cd(e){for(;_!==null;){var t=_;if(t===e){_=null;break}var n=t.sibling;if(n!==null){n.return=t.return,_=n;break}_=t.return}}function pd(e){for(;_!==null;){var t=_;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{xr(4,t)}catch(i){pe(t,n,i)}break;case 1:var l=t.stateNode;if(typeof l.componentDidMount=="function"){var r=t.return;try{l.componentDidMount()}catch(i){pe(t,r,i)}}var s=t.return;try{ia(t)}catch(i){pe(t,s,i)}break;case 5:var a=t.return;try{ia(t)}catch(i){pe(t,a,i)}}}catch(i){pe(t,t.return,i)}if(t===e){_=null;break}var o=t.sibling;if(o!==null){o.return=t.return,_=o;break}_=t.return}}var vc=Math.ceil,hr=ce.ReactCurrentDispatcher,ca=ce.ReactCurrentOwner,ot=ce.ReactCurrentBatchConfig,$=0,Ne=null,ge=null,Le=0,et=0,In=zt(0),ke=0,gl=null,an=0,vr=0,pa=0,yl=null,Ve=null,fa=0,jn=1/0,At=null,gr=!1,ma=null,Qt=null,yr=!1,Vt=null,br=0,bl=0,xa=null,wr=-1,kr=0;function Be(){return($&6)!==0?xe():wr!==-1?wr:wr=xe()}function Kt(e){return(e.mode&1)===0?1:($&2)!==0&&Le!==0?Le&-Le:ec.transition!==null?(kr===0&&(kr=ro()),kr):(e=Y,e!==0||(e=window.event,e=e===void 0?16:mo(e.type)),e)}function ht(e,t,n,l){if(50<bl)throw bl=0,xa=null,Error(h(185));$n(e,n,l),(($&2)===0||e!==Ne)&&(e===Ne&&(($&2)===0&&(vr|=n),ke===4&&qt(e,Le)),Ke(e,l),n===1&&$===0&&(t.mode&1)===0&&(jn=xe()+500,Gl&&Bt()))}function Ke(e,t){var n=e.callbackNode;eu(e,t);var l=Al(e,e===Ne?Le:0);if(l===0)n!==null&&to(n),e.callbackNode=null,e.callbackPriority=0;else if(t=l&-l,e.callbackPriority!==t){if(n!=null&&to(n),t===1)e.tag===0?Ju(md.bind(null,e)):Jo(md.bind(null,e)),Yu(function(){($&6)===0&&Bt()}),n=null;else{switch(so(l)){case 1:n=qr;break;case 4:n=no;break;case 16:n=Rl;break;case 536870912:n=lo;break;default:n=Rl}n=kd(n,fd.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function fd(e,t){if(wr=-1,kr=0,($&6)!==0)throw Error(h(327));var n=e.callbackNode;if(Mn()&&e.callbackNode!==n)return null;var l=Al(e,e===Ne?Le:0);if(l===0)return null;if((l&30)!==0||(l&e.expiredLanes)!==0||t)t=Sr(e,l);else{t=l;var r=$;$|=2;var s=hd();(Ne!==e||Le!==t)&&(At=null,jn=xe()+500,dn(e,t));do try{bc();break}catch(o){xd(e,o)}while(!0);Ls(),hr.current=s,$=r,ge!==null?t=0:(Ne=null,Le=0,t=ke)}if(t!==0){if(t===2&&(r=Yr(e),r!==0&&(l=r,t=ha(e,r))),t===1)throw n=gl,dn(e,0),qt(e,l),Ke(e,xe()),n;if(t===6)qt(e,l);else{if(r=e.current.alternate,(l&30)===0&&!gc(r)&&(t=Sr(e,l),t===2&&(s=Yr(e),s!==0&&(l=s,t=ha(e,s))),t===1))throw n=gl,dn(e,0),qt(e,l),Ke(e,xe()),n;switch(e.finishedWork=r,e.finishedLanes=l,t){case 0:case 1:throw Error(h(345));case 2:un(e,Ve,At);break;case 3:if(qt(e,l),(l&130023424)===l&&(t=fa+500-xe(),10<t)){if(Al(e,0)!==0)break;if(r=e.suspendedLanes,(r&l)!==l){Be(),e.pingedLanes|=e.suspendedLanes&r;break}e.timeoutHandle=ks(un.bind(null,e,Ve,At),t);break}un(e,Ve,At);break;case 4:if(qt(e,l),(l&4194240)===l)break;for(t=e.eventTimes,r=-1;0<l;){var a=31-ut(l);s=1<<a,a=t[a],a>r&&(r=a),l&=~s}if(l=r,l=xe()-l,l=(120>l?120:480>l?480:1080>l?1080:1920>l?1920:3e3>l?3e3:4320>l?4320:1960*vc(l/1960))-l,10<l){e.timeoutHandle=ks(un.bind(null,e,Ve,At),l);break}un(e,Ve,At);break;case 5:un(e,Ve,At);break;default:throw Error(h(329))}}}return Ke(e,xe()),e.callbackNode===n?fd.bind(null,e):null}function ha(e,t){var n=yl;return e.current.memoizedState.isDehydrated&&(dn(e,t).flags|=256),e=Sr(e,t),e!==2&&(t=Ve,Ve=n,t!==null&&va(t)),e}function va(e){Ve===null?Ve=e:Ve.push.apply(Ve,e)}function gc(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var l=0;l<n.length;l++){var r=n[l],s=r.getSnapshot;r=r.value;try{if(!ct(s(),r))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function qt(e,t){for(t&=~pa,t&=~vr,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-ut(t),l=1<<n;e[n]=-1,t&=~l}}function md(e){if(($&6)!==0)throw Error(h(327));Mn();var t=Al(e,0);if((t&1)===0)return Ke(e,xe()),null;var n=Sr(e,t);if(e.tag!==0&&n===2){var l=Yr(e);l!==0&&(t=l,n=ha(e,l))}if(n===1)throw n=gl,dn(e,0),qt(e,t),Ke(e,xe()),n;if(n===6)throw Error(h(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,un(e,Ve,At),Ke(e,xe()),null}function ga(e,t){var n=$;$|=1;try{return e(t)}finally{$=n,$===0&&(jn=xe()+500,Gl&&Bt())}}function on(e){Vt!==null&&Vt.tag===0&&($&6)===0&&Mn();var t=$;$|=1;var n=ot.transition,l=Y;try{if(ot.transition=null,Y=1,e)return e()}finally{Y=l,ot.transition=n,$=t,($&6)===0&&Bt()}}function ya(){et=In.current,re(In)}function dn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,qu(n)),ge!==null)for(n=ge.return;n!==null;){var l=n;switch(Ns(l),l.tag){case 1:l=l.type.childContextTypes,l!=null&&ql();break;case 3:An(),re(He),re(Ie),Bs();break;case 5:zs(l);break;case 4:An();break;case 13:re(ie);break;case 19:re(ie);break;case 10:Is(l.type._context);break;case 22:case 23:ya()}n=n.return}if(Ne=e,ge=e=Yt(e.current,null),Le=et=t,ke=0,gl=null,pa=vr=an=0,Ve=yl=null,ln!==null){for(t=0;t<ln.length;t++)if(n=ln[t],l=n.interleaved,l!==null){n.interleaved=null;var r=l.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,l.next=a}n.pending=l}ln=null}return e}function xd(e,t){do{var n=ge;try{if(Ls(),ar.current=ur,or){for(var l=de.memoizedState;l!==null;){var r=l.queue;r!==null&&(r.pending=null),l=l.next}or=!1}if(sn=0,Re=we=de=null,pl=!1,fl=0,ca.current=null,n===null||n.return===null){ke=1,gl=t,ge=null;break}e:{var s=e,a=n.return,o=n,i=t;if(t=Le,o.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){var x=i,y=o,w=y.tag;if((y.mode&1)===0&&(w===0||w===11||w===15)){var g=y.alternate;g?(y.updateQueue=g.updateQueue,y.memoizedState=g.memoizedState,y.lanes=g.lanes):(y.updateQueue=null,y.memoizedState=null)}var P=Wi(a);if(P!==null){P.flags&=-257,Bi(P,a,o,s,t),P.mode&1&&zi(s,x,t),t=P,i=x;var T=t.updateQueue;if(T===null){var A=new Set;A.add(i),t.updateQueue=A}else T.add(i);break e}else{if((t&1)===0){zi(s,x,t),ba();break e}i=Error(h(426))}}else if(ae&&o.mode&1){var he=Wi(a);if(he!==null){(he.flags&65536)===0&&(he.flags|=256),Bi(he,a,o,s,t),As(Dn(i,o));break e}}s=i=Dn(i,o),ke!==4&&(ke=2),yl===null?yl=[s]:yl.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,t&=-t,s.lanes|=t;var p=Oi(s,i,t);ui(s,p);break e;case 1:o=i;var d=s.type,m=s.stateNode;if((s.flags&128)===0&&(typeof d.getDerivedStateFromError=="function"||m!==null&&typeof m.componentDidCatch=="function"&&(Qt===null||!Qt.has(m)))){s.flags|=65536,t&=-t,s.lanes|=t;var k=Fi(s,o,t);ui(s,k);break e}}s=s.return}while(s!==null)}gd(n)}catch(D){t=D,ge===n&&n!==null&&(ge=n=n.return);continue}break}while(!0)}function hd(){var e=hr.current;return hr.current=ur,e===null?ur:e}function ba(){(ke===0||ke===3||ke===2)&&(ke=4),Ne===null||(an&268435455)===0&&(vr&268435455)===0||qt(Ne,Le)}function Sr(e,t){var n=$;$|=2;var l=hd();(Ne!==e||Le!==t)&&(At=null,dn(e,t));do try{yc();break}catch(r){xd(e,r)}while(!0);if(Ls(),$=n,hr.current=l,ge!==null)throw Error(h(261));return Ne=null,Le=0,ke}function yc(){for(;ge!==null;)vd(ge)}function bc(){for(;ge!==null&&!Qd();)vd(ge)}function vd(e){var t=wd(e.alternate,e,et);e.memoizedProps=e.pendingProps,t===null?gd(e):ge=t,ca.current=null}function gd(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=pc(n,t,et),n!==null){ge=n;return}}else{if(n=fc(n,t),n!==null){n.flags&=32767,ge=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{ke=6,ge=null;return}}if(t=t.sibling,t!==null){ge=t;return}ge=t=e}while(t!==null);ke===0&&(ke=5)}function un(e,t,n){var l=Y,r=ot.transition;try{ot.transition=null,Y=1,wc(e,t,n,l)}finally{ot.transition=r,Y=l}return null}function wc(e,t,n,l){do Mn();while(Vt!==null);if(($&6)!==0)throw Error(h(327));n=e.finishedWork;var r=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(h(177));e.callbackNode=null,e.callbackPriority=0;var s=n.lanes|n.childLanes;if(tu(e,s),e===Ne&&(ge=Ne=null,Le=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||yr||(yr=!0,kd(Rl,function(){return Mn(),null})),s=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||s){s=ot.transition,ot.transition=null;var a=Y;Y=1;var o=$;$|=4,ca.current=null,xc(e,n),id(n,e),Bu(bs),Il=!!ys,bs=ys=null,e.current=n,hc(n),Vd(),$=o,Y=a,ot.transition=s}else e.current=n;if(yr&&(yr=!1,Vt=e,br=r),s=e.pendingLanes,s===0&&(Qt=null),Yd(n.stateNode),Ke(e,xe()),t!==null)for(l=e.onRecoverableError,n=0;n<t.length;n++)r=t[n],l(r.value,{componentStack:r.stack,digest:r.digest});if(gr)throw gr=!1,e=ma,ma=null,e;return(br&1)!==0&&e.tag!==0&&Mn(),s=e.pendingLanes,(s&1)!==0?e===xa?bl++:(bl=0,xa=e):bl=0,Bt(),null}function Mn(){if(Vt!==null){var e=so(br),t=ot.transition,n=Y;try{if(ot.transition=null,Y=16>e?16:e,Vt===null)var l=!1;else{if(e=Vt,Vt=null,br=0,($&6)!==0)throw Error(h(331));var r=$;for($|=4,_=e.current;_!==null;){var s=_,a=s.child;if((_.flags&16)!==0){var o=s.deletions;if(o!==null){for(var i=0;i<o.length;i++){var x=o[i];for(_=x;_!==null;){var y=_;switch(y.tag){case 0:case 11:case 15:vl(8,y,s)}var w=y.child;if(w!==null)w.return=y,_=w;else for(;_!==null;){y=_;var g=y.sibling,P=y.return;if(ld(y),y===x){_=null;break}if(g!==null){g.return=P,_=g;break}_=P}}}var T=s.alternate;if(T!==null){var A=T.child;if(A!==null){T.child=null;do{var he=A.sibling;A.sibling=null,A=he}while(A!==null)}}_=s}}if((s.subtreeFlags&2064)!==0&&a!==null)a.return=s,_=a;else e:for(;_!==null;){if(s=_,(s.flags&2048)!==0)switch(s.tag){case 0:case 11:case 15:vl(9,s,s.return)}var p=s.sibling;if(p!==null){p.return=s.return,_=p;break e}_=s.return}}var d=e.current;for(_=d;_!==null;){a=_;var m=a.child;if((a.subtreeFlags&2064)!==0&&m!==null)m.return=a,_=m;else e:for(a=d;_!==null;){if(o=_,(o.flags&2048)!==0)try{switch(o.tag){case 0:case 11:case 15:xr(9,o)}}catch(D){pe(o,o.return,D)}if(o===a){_=null;break e}var k=o.sibling;if(k!==null){k.return=o.return,_=k;break e}_=o.return}}if($=r,Bt(),gt&&typeof gt.onPostCommitFiberRoot=="function")try{gt.onPostCommitFiberRoot(Nl,e)}catch{}l=!0}return l}finally{Y=n,ot.transition=t}}return!1}function yd(e,t,n){t=Dn(n,t),t=Oi(e,t,1),e=Ht(e,t,1),t=Be(),e!==null&&($n(e,1,t),Ke(e,t))}function pe(e,t,n){if(e.tag===3)yd(e,e,n);else for(;t!==null;){if(t.tag===3){yd(t,e,n);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Qt===null||!Qt.has(l))){e=Dn(n,e),e=Fi(t,e,1),t=Ht(t,e,1),e=Be(),t!==null&&($n(t,1,e),Ke(t,e));break}}t=t.return}}function kc(e,t,n){var l=e.pingCache;l!==null&&l.delete(t),t=Be(),e.pingedLanes|=e.suspendedLanes&n,Ne===e&&(Le&n)===n&&(ke===4||ke===3&&(Le&130023424)===Le&&500>xe()-fa?dn(e,0):pa|=n),Ke(e,t)}function bd(e,t){t===0&&((e.mode&1)===0?t=1:(t=Tl,Tl<<=1,(Tl&130023424)===0&&(Tl=4194304)));var n=Be();e=Nt(e,t),e!==null&&($n(e,t,n),Ke(e,n))}function Sc(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),bd(e,n)}function Ec(e,t){var n=0;switch(e.tag){case 13:var l=e.stateNode,r=e.memoizedState;r!==null&&(n=r.retryLane);break;case 19:l=e.stateNode;break;default:throw Error(h(314))}l!==null&&l.delete(t),bd(e,n)}var wd;wd=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||He.current)Qe=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return Qe=!1,cc(e,t,n);Qe=(e.flags&131072)!==0}else Qe=!1,ae&&(t.flags&1048576)!==0&&ei(t,Zl,t.index);switch(t.lanes=0,t.tag){case 2:var l=t.type;fr(e,t),e=t.pendingProps;var r=En(t,Ie.current);Tn(t,n),r=$s(null,t,l,e,r,n);var s=Qs();return t.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,$e(l)?(s=!0,Yl(t)):s=!1,t.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Os(t),r.updater=cr,t.stateNode=r,r._reactInternals=t,Xs(t,l,e,n),t=ta(null,t,l,!0,s,n)):(t.tag=0,ae&&s&&Rs(t),We(null,t,r,n),t=t.child),t;case 16:l=t.elementType;e:{switch(fr(e,t),e=t.pendingProps,r=l._init,l=r(l._payload),t.type=l,r=t.tag=Pc(l),e=ft(l,e),r){case 0:t=ea(null,t,l,e,n);break e;case 1:t=Ki(null,t,l,e,n);break e;case 11:t=Ui(null,t,l,e,n);break e;case 14:t=Hi(null,t,l,ft(l.type,e),n);break e}throw Error(h(306,l,""))}return t;case 0:return l=t.type,r=t.pendingProps,r=t.elementType===l?r:ft(l,r),ea(e,t,l,r,n);case 1:return l=t.type,r=t.pendingProps,r=t.elementType===l?r:ft(l,r),Ki(e,t,l,r,n);case 3:e:{if(qi(t),e===null)throw Error(h(387));l=t.pendingProps,s=t.memoizedState,r=s.element,di(e,t),rr(t,l,null,n);var a=t.memoizedState;if(l=a.element,s.isDehydrated)if(s={element:l,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){r=Dn(Error(h(423)),t),t=Yi(e,t,l,n,r);break e}else if(l!==r){r=Dn(Error(h(424)),t),t=Yi(e,t,l,n,r);break e}else for(Je=Ft(t.stateNode.containerInfo.firstChild),Ze=t,ae=!0,pt=null,n=oi(t,null,l,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Rn(),l===r){t=Tt(e,t,n);break e}We(e,t,l,n)}t=t.child}return t;case 5:return pi(t),e===null&&Ts(t),l=t.type,r=t.pendingProps,s=e!==null?e.memoizedProps:null,a=r.children,ws(l,r)?a=null:s!==null&&ws(l,s)&&(t.flags|=32),Vi(e,t),We(e,t,a,n),t.child;case 6:return e===null&&Ts(t),null;case 13:return Gi(e,t,n);case 4:return Fs(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=Nn(t,null,l,n):We(e,t,l,n),t.child;case 11:return l=t.type,r=t.pendingProps,r=t.elementType===l?r:ft(l,r),Ui(e,t,l,r,n);case 7:return We(e,t,t.pendingProps,n),t.child;case 8:return We(e,t,t.pendingProps.children,n),t.child;case 12:return We(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(l=t.type._context,r=t.pendingProps,s=t.memoizedProps,a=r.value,te(tr,l._currentValue),l._currentValue=a,s!==null)if(ct(s.value,a)){if(s.children===r.children&&!He.current){t=Tt(e,t,n);break e}}else for(s=t.child,s!==null&&(s.return=t);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var i=o.firstContext;i!==null;){if(i.context===l){if(s.tag===1){i=_t(-1,n&-n),i.tag=2;var x=s.updateQueue;if(x!==null){x=x.shared;var y=x.pending;y===null?i.next=i:(i.next=y.next,y.next=i),x.pending=i}}s.lanes|=n,i=s.alternate,i!==null&&(i.lanes|=n),js(s.return,n,t),o.lanes|=n;break}i=i.next}}else if(s.tag===10)a=s.type===t.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(h(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),js(a,n,t),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===t){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}We(e,t,r.children,n),t=t.child}return t;case 9:return r=t.type,l=t.pendingProps.children,Tn(t,n),r=st(r),l=l(r),t.flags|=1,We(e,t,l,n),t.child;case 14:return l=t.type,r=ft(l,t.pendingProps),r=ft(l.type,r),Hi(e,t,l,r,n);case 15:return $i(e,t,t.type,t.pendingProps,n);case 17:return l=t.type,r=t.pendingProps,r=t.elementType===l?r:ft(l,r),fr(e,t),t.tag=1,$e(l)?(e=!0,Yl(t)):e=!1,Tn(t,n),ji(t,l,r),Xs(t,l,r,n),ta(null,t,l,!0,e,n);case 19:return Zi(e,t,n);case 22:return Qi(e,t,n)}throw Error(h(156,t.tag))};function kd(e,t){return eo(e,t)}function Cc(e,t,n,l){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function it(e,t,n,l){return new Cc(e,t,n,l)}function wa(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Pc(e){if(typeof e=="function")return wa(e)?1:0;if(e!=null){if(e=e.$$typeof,e===tt)return 11;if(e===nt)return 14}return 2}function Yt(e,t){var n=e.alternate;return n===null?(n=it(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Er(e,t,n,l,r,s){var a=2;if(l=e,typeof e=="function")wa(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case Te:return cn(n.children,r,s,t);case Ae:a=8,r|=8;break;case vt:return e=it(12,n,t,r|2),e.elementType=vt,e.lanes=s,e;case ze:return e=it(13,n,t,r),e.elementType=ze,e.lanes=s,e;case Ye:return e=it(19,n,t,r),e.elementType=Ye,e.lanes=s,e;case C:return Cr(n,r,s,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case dt:a=10;break e;case St:a=9;break e;case tt:a=11;break e;case nt:a=14;break e;case f:a=16,l=null;break e}throw Error(h(130,e==null?e:typeof e,""))}return t=it(a,n,t,r),t.elementType=e,t.type=l,t.lanes=s,t}function cn(e,t,n,l){return e=it(7,e,l,t),e.lanes=n,e}function Cr(e,t,n,l){return e=it(22,e,l,t),e.elementType=C,e.lanes=n,e.stateNode={isHidden:!1},e}function ka(e,t,n){return e=it(6,e,null,t),e.lanes=n,e}function Sa(e,t,n){return t=it(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Rc(e,t,n,l,r){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Gr(0),this.expirationTimes=Gr(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Gr(0),this.identifierPrefix=l,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Ea(e,t,n,l,r,s,a,o,i){return e=new Rc(e,t,n,o,i),t===1?(t=1,s===!0&&(t|=8)):t=0,s=it(3,null,null,t),e.current=s,s.stateNode=e,s.memoizedState={element:l,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Os(s),e}function Nc(e,t,n){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Pe,key:l==null?null:""+l,children:e,containerInfo:t,implementation:n}}function Sd(e){if(!e)return Wt;e=e._reactInternals;e:{if(Zt(e)!==e||e.tag!==1)throw Error(h(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if($e(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(h(171))}if(e.tag===1){var n=e.type;if($e(n))return Xo(e,n,t)}return t}function Ed(e,t,n,l,r,s,a,o,i){return e=Ea(n,l,!0,e,r,s,a,o,i),e.context=Sd(null),n=e.current,l=Be(),r=Kt(n),s=_t(l,r),s.callback=t??null,Ht(n,s,r),e.current.lanes=r,$n(e,r,l),Ke(e,l),e}function Pr(e,t,n,l){var r=t.current,s=Be(),a=Kt(r);return n=Sd(n),t.context===null?t.context=n:t.pendingContext=n,t=_t(s,a),t.payload={element:e},l=l===void 0?null:l,l!==null&&(t.callback=l),e=Ht(r,t,a),e!==null&&(ht(e,r,a,s),lr(e,r,a)),a}function Rr(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Cd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Ca(e,t){Cd(e,t),(e=e.alternate)&&Cd(e,t)}function _c(){return null}var Pd=typeof reportError=="function"?reportError:function(e){console.error(e)};function Pa(e){this._internalRoot=e}Nr.prototype.render=Pa.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(h(409));Pr(e,t,null,null)},Nr.prototype.unmount=Pa.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;on(function(){Pr(null,e,null,null)}),t[Et]=null}};function Nr(e){this._internalRoot=e}Nr.prototype.unstable_scheduleHydration=function(e){if(e){var t=io();e={blockedOn:null,target:e,priority:t};for(var n=0;n<jt.length&&t!==0&&t<jt[n].priority;n++);jt.splice(n,0,e),n===0&&po(e)}};function Ra(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function _r(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Rd(){}function Tc(e,t,n,l,r){if(r){if(typeof l=="function"){var s=l;l=function(){var x=Rr(a);s.call(x)}}var a=Ed(t,l,e,0,null,!1,!1,"",Rd);return e._reactRootContainer=a,e[Et]=a.current,rl(e.nodeType===8?e.parentNode:e),on(),a}for(;r=e.lastChild;)e.removeChild(r);if(typeof l=="function"){var o=l;l=function(){var x=Rr(i);o.call(x)}}var i=Ea(e,0,!1,null,null,!1,!1,"",Rd);return e._reactRootContainer=i,e[Et]=i.current,rl(e.nodeType===8?e.parentNode:e),on(function(){Pr(t,i,n,l)}),i}function Tr(e,t,n,l,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var i=Rr(a);o.call(i)}}Pr(t,a,e,r)}else a=Tc(n,t,e,r,l);return Rr(a)}ao=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Hn(t.pendingLanes);n!==0&&(Xr(t,n|1),Ke(t,xe()),($&6)===0&&(jn=xe()+500,Bt()))}break;case 13:on(function(){var l=Nt(e,1);if(l!==null){var r=Be();ht(l,e,1,r)}}),Ca(e,1)}},Zr=function(e){if(e.tag===13){var t=Nt(e,134217728);if(t!==null){var n=Be();ht(t,e,134217728,n)}Ca(e,134217728)}},oo=function(e){if(e.tag===13){var t=Kt(e),n=Nt(e,t);if(n!==null){var l=Be();ht(n,e,t,l)}Ca(e,t)}},io=function(){return Y},uo=function(e,t){var n=Y;try{return Y=e,t()}finally{Y=n}},$r=function(e,t,n){switch(t){case"input":if(Mr(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var l=n[t];if(l!==e&&l.form===e.form){var r=Kl(l);if(!r)throw Error(h(90));La(l),Mr(l,r)}}}break;case"textarea":Fa(e,n);break;case"select":t=n.value,t!=null&&pn(e,!!n.multiple,t,!1)}},Ka=ga,qa=on;var Ac={usingClientEntryPoint:!1,Events:[ol,kn,Kl,Qa,Va,ga]},wl={findFiberByHostInstance:Jt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Dc={bundleType:wl.bundleType,version:wl.version,rendererPackageName:wl.rendererPackageName,rendererConfig:wl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ce.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Za(e),e===null?null:e.stateNode},findFiberByHostInstance:wl.findFiberByHostInstance||_c,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ar=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ar.isDisabled&&Ar.supportsFiber)try{Nl=Ar.inject(Dc),gt=Ar}catch{}}return qe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ac,qe.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ra(t))throw Error(h(200));return Nc(e,t,null,n)},qe.createRoot=function(e,t){if(!Ra(e))throw Error(h(299));var n=!1,l="",r=Pd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=Ea(e,1,!1,null,null,n,!1,l,r),e[Et]=t.current,rl(e.nodeType===8?e.parentNode:e),new Pa(t)},qe.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(h(188)):(e=Object.keys(e).join(","),Error(h(268,e)));return e=Za(t),e=e===null?null:e.stateNode,e},qe.flushSync=function(e){return on(e)},qe.hydrate=function(e,t,n){if(!_r(t))throw Error(h(200));return Tr(null,e,t,!0,n)},qe.hydrateRoot=function(e,t,n){if(!Ra(e))throw Error(h(405));var l=n!=null&&n.hydratedSources||null,r=!1,s="",a=Pd;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),t=Ed(t,null,e,1,n??null,r,!1,s,a),e[Et]=t.current,rl(e),l)for(e=0;e<l.length;e++)n=l[e],r=n._getVersion,r=r(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,r]:t.mutableSourceEagerHydrationData.push(n,r);return new Nr(t)},qe.render=function(e,t,n){if(!_r(t))throw Error(h(200));return Tr(null,e,t,!1,n)},qe.unmountComponentAtNode=function(e){if(!_r(e))throw Error(h(40));return e._reactRootContainer?(on(function(){Tr(null,null,e,!1,function(){e._reactRootContainer=null,e[Et]=null})}),!0):!1},qe.unstable_batchedUpdates=ga,qe.unstable_renderSubtreeIntoContainer=function(e,t,n,l){if(!_r(n))throw Error(h(200));if(e==null||e._reactInternals===void 0)throw Error(h(38));return Tr(e,t,n,!1,l)},qe.version="18.3.1-next-f1338f8080-20240426",qe}var Ld;function zc(){if(Ld)return _a.exports;Ld=1;function E(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(E)}catch(F){console.error(F)}}return E(),_a.exports=Fc(),_a.exports}var Id;function Wc(){if(Id)return Dr;Id=1;var E=zc();return Dr.createRoot=E.createRoot,Dr.hydrateRoot=E.hydrateRoot,Dr}var Bc=Wc();const Uc=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raihan Farm Shop | Farm-to-Shop Processing, POS & Delivery ERP</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="min-h-screen flex flex-col lg:flex-row overflow-x-hidden">

  <div id="toast-container" class="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"></div>

  <!-- MODAL 00: WINDOWS APP & SERVER CONNECTION -->
  <div id="windows-cloud-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-3">
          <div class="bg-yellow-400 p-2.5 rounded-xl text-slate-950 font-black"><i class="fa-brands fa-windows text-xl"></i></div>
          <div>
            <h3 class="font-black text-base text-white">Windows Desktop Software & Server Connection</h3>
            <p class="text-xs text-slate-400">Run Raihan Farm Shop ERP natively on Windows 10/11, synced through the MongoDB backend</p>
          </div>
        </div>
        <button onclick="closeWindowsCloudModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
      </div>

      <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold uppercase tracking-wider text-yellow-400 flex items-center gap-2"><i class="fa-solid fa-desktop"></i> 1. Run as Native Windows POS / Admin Software</span>
          <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">Windows 10 / 11 Ready</span>
        </div>
        <p class="text-xs text-slate-300">Download the Windows Desktop Launcher (<code>.BAT</code>) or install directly as a frameless Windows App.</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button onclick="downloadWindowsBatLauncher()" class="p-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20"><i class="fa-brands fa-windows text-sm"></i> Download Windows .BAT Launcher</button>
          <button onclick="triggerWindowsPwaInstall()" class="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2"><i class="fa-solid fa-window-restore text-yellow-400"></i> Install Desktop App Window</button>
          <button onclick="downloadElectronPackage()" class="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2"><i class="fa-solid fa-box-archive text-emerald-400"></i> Download Electron .EXE Kit</button>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2"><i class="fa-solid fa-database"></i> 2. Backend API & MongoDB Sync</span>
          <span id="modal-cloud-badge" class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black">MONGODB CONNECTED</span>
        </div>
        <p class="text-xs text-slate-400">All POS sales, inventory, slaughter batches, payroll and Wall QR attendance are stored in MongoDB through the Node/Express API. Leave the field empty to use the same address this page was opened from, or enter the API server address of a remote branch (e.g. <code>http://192.168.1.10:5000</code>).</p>
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input type="text" id="cloud-endpoint-input" placeholder="API server URL (blank = same origin)" class="sm:col-span-8 px-3 py-2 rounded-xl text-xs font-mono">
          <button onclick="saveCloudEndpointAndSync()" class="sm:col-span-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3 py-2 rounded-xl text-xs uppercase tracking-wider transition"><i class="fa-solid fa-rotate mr-1"></i> Save & Reconnect</button>
        </div>
        <div class="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
          <span>Last Sync: <strong id="cloud-last-sync-label" class="text-white">Just now</strong></span>
          <div class="flex gap-3">
            <button onclick="pullFromServer(true)" class="text-sky-400 hover:underline font-bold"><i class="fa-solid fa-cloud-arrow-down mr-1"></i>Pull Latest From Database</button>
            <button onclick="exportLifetimeBackup()" class="text-yellow-400 hover:underline font-bold"><i class="fa-solid fa-file-export mr-1"></i>Save Local JSON Snapshot</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL 0A: LOGIN -->
  <div id="login-modal" class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-3">
          <img src="/raihan-farm-logo.jpeg" alt="Raihan Farm Shop logo" class="w-12 h-12 rounded-xl object-cover border border-yellow-400/40">
          <div>
            <h3 class="font-black text-base text-white">Sign In</h3>
            <p class="text-xs text-slate-400">Raihan Farm Shop Security</p>
          </div>
        </div>
        <button id="login-close-btn" onclick="closeLoginModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs text-slate-400 font-bold mb-1">Username or staff phone number</label>
          <input type="text" id="login-username" autocomplete="username" class="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold">
        </div>
        <div>
          <label class="block text-xs text-slate-400 font-bold mb-1">Password</label>
          <input type="password" id="login-password" autocomplete="current-password" onkeydown="if(event.key==='Enter')handleLogin()" class="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold">
        </div>
        <p id="login-error" class="hidden text-xs font-bold text-red-400 bg-red-950/60 border border-red-500/40 p-2.5 rounded-lg">Invalid credentials.</p>
      </div>

      <button onclick="handleLogin()" class="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition">Authenticate & Continue</button>
      <button onclick="openWindowsCloudModal()" class="w-full text-[11px] text-slate-500 hover:text-yellow-400"><i class="fa-solid fa-server mr-1"></i>Server connection settings</button>
    </div>
  </div>

  <!-- MODAL 0C: WALL QR POSTER -->
  <div id="wall-qr-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
      <div id="wall-qr-print-area" class="p-6 sm:p-8 bg-white text-slate-950 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider"><img src="/raihan-farm-logo.jpeg" alt="" class="w-7 h-7 rounded-full object-cover"> RAIHAN FARM SHOP • PUTTALAM</div>
        <h2 class="text-2xl font-black uppercase tracking-tight text-slate-900">STAFF ATTENDANCE WALL QR</h2>
        <p class="text-xs text-slate-600 max-w-sm mx-auto">Open your mobile camera, scan this QR code on the shop wall, select your name & enter your 4-digit Staff PIN to <strong>Sign In</strong> or <strong>Sign Out</strong>.</p>
        <div class="mx-auto w-60 h-60 p-4 rounded-2xl border-4 border-slate-900 bg-white flex items-center justify-center shadow-md">
          <img id="wall-qr-image" src="" alt="Raihan Farm Shop Wall QR Code" class="w-full h-full object-contain" onerror="this.style.display='none'; document.getElementById('wall-qr-fallback').classList.remove('hidden');">
          <div id="wall-qr-fallback" class="hidden w-full h-full flex flex-col items-center justify-center text-slate-900">
            <i class="fa-solid fa-qrcode text-8xl"></i>
            <span class="text-[10px] font-mono font-bold mt-2">WALL-QR-RAIHAN-2026</span>
          </div>
        </div>
        <div class="bg-slate-100 border border-slate-300 rounded-xl p-3 text-left text-xs space-y-1">
          <div class="flex justify-between"><span class="font-bold text-slate-600">Workplace Location:</span><span class="font-black text-slate-900">Mannar Road, Puttalam — Main Counter</span></div>
          <div class="flex justify-between"><span class="font-bold text-slate-600">Wall Check-In Code:</span><span class="font-mono font-black text-slate-900">RAIHAN-WALL-01</span></div>
        </div>
        <p class="text-[11px] text-slate-500 font-semibold pt-1">Stick this laminated sheet near the shop entrance or butcher counter. Each staff member uses their personal PIN (do not print PINs on the poster).</p>
      </div>
      <div class="bg-slate-950 px-6 py-4 flex flex-wrap justify-between items-center gap-2 border-t border-slate-800 no-print">
        <button onclick="openMobileQrPortal()" class="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center gap-1.5"><i class="fa-solid fa-mobile-screen-button"></i> Simulate Mobile Scan</button>
        <div class="flex gap-2">
          <button onclick="closeWallQrModal()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition">Close</button>
          <button onclick="printSection('wall-qr-print-area')" class="px-4 py-2 rounded-xl text-xs font-extrabold bg-yellow-400 hover:bg-yellow-300 text-slate-950 transition flex items-center gap-1.5"><i class="fa-solid fa-print"></i> Print Wall QR Poster</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL 0D: MOBILE QR SIGN-IN / OUT PORTAL -->
  <div id="mobile-qr-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border-2 border-yellow-400 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl">
      <div class="bg-yellow-400 text-slate-950 px-5 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2"><i class="fa-solid fa-qrcode text-lg"></i><span class="font-black text-xs uppercase tracking-wider">Mobile Wall QR Check-In</span></div>
        <button onclick="closeMobileQrPortal()" class="w-7 h-7 rounded-full bg-slate-950/15 hover:bg-slate-950/30 flex items-center justify-center text-slate-950 font-bold"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <div class="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center text-lg font-black shrink-0"><i class="fa-solid fa-camera"></i></div>
          <div>
            <span class="text-[10px] uppercase font-black text-emerald-400 tracking-wider block">Wall QR Code Verified</span>
            <p class="text-xs font-bold text-white">Raihan Farm Shop • Main Wall</p>
            <p class="text-[11px] text-slate-400" id="mob-qr-live-time">Today</p>
          </div>
        </div>
        <div>
          <label class="block text-xs font-extrabold uppercase tracking-wider text-yellow-400 mb-1.5">1. Select Your Name</label>
          <select id="mob-qr-staff-select" onchange="updateMobileQrStaffStatus()" class="w-full px-3.5 py-3 rounded-xl text-sm font-bold"></select>
        </div>
        <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-400">Current Status:</span>
          <strong class="text-emerald-400 font-black" id="mob-qr-cur-status">Signed Out</strong>
        </div>
        <div>
          <label class="block text-xs font-extrabold uppercase tracking-wider text-yellow-400 mb-1.5">2. Enter Your 4-Digit Staff PIN</label>
          <input type="password" inputmode="numeric" maxlength="4" id="mob-qr-pin-input" placeholder="••••" class="w-full px-4 py-3 rounded-xl text-center text-xl font-black tracking-[0.5em]">
        </div>
        <button onclick="submitMobileQrClock()" id="mob-qr-submit-btn" class="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950"><i class="fa-solid fa-right-to-bracket"></i> Confirm Mobile Sign-In / Out</button>
        <p class="text-[11px] text-center text-slate-400">Instant sync with Admin Attendance & Month-End Payroll</p>
        <button onclick="openStaffProfileModal()" class="w-full text-xs text-yellow-300 hover:text-yellow-200 font-bold">Update my staff details or password</button>
      </div>
    </div>
  </div>

  <div id="staff-profile-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-yellow-400/50 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 class="font-black text-white">Update Staff Details</h3>
          <p class="text-xs text-slate-400 mt-1">Sign in with your current phone and password to continue.</p>
        </div>
        <button onclick="closeStaffProfileModal()" class="text-slate-400 hover:text-white" aria-label="Close">&times;</button>
      </div>
      <label class="block text-xs text-slate-300 font-bold">Current phone number
        <input id="staff-profile-current-phone" type="tel" autocomplete="username" class="mt-1 w-full px-3 py-2 rounded-lg text-sm">
      </label>
      <label class="block text-xs text-slate-300 font-bold">Current password
        <input id="staff-profile-current-password" type="password" autocomplete="current-password" class="mt-1 w-full px-3 py-2 rounded-lg text-sm">
      </label>
      <div class="border-t border-slate-800 pt-3 space-y-3">
        <label class="block text-xs text-slate-300 font-bold">Name
          <input id="staff-profile-name" type="text" autocomplete="name" class="mt-1 w-full px-3 py-2 rounded-lg text-sm">
        </label>
        <label class="block text-xs text-slate-300 font-bold">New phone number
          <input id="staff-profile-phone" type="tel" autocomplete="tel" class="mt-1 w-full px-3 py-2 rounded-lg text-sm">
        </label>
        <label class="block text-xs text-slate-300 font-bold">New password <span class="font-normal text-slate-500">(leave blank to keep current)</span>
          <input id="staff-profile-new-password" type="password" autocomplete="new-password" minlength="8" class="mt-1 w-full px-3 py-2 rounded-lg text-sm">
        </label>
        <label class="block text-xs text-slate-300 font-bold">Confirm new password
          <input id="staff-profile-confirm-password" type="password" autocomplete="new-password" minlength="8" class="mt-1 w-full px-3 py-2 rounded-lg text-sm">
        </label>
      </div>
      <button id="staff-profile-save" onclick="saveStaffProfile()" class="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-2.5 rounded-xl text-sm">Save my details</button>
    </div>
  </div>

  <!-- MODAL 0B: PRINTABLE REPORT -->
  <div id="annual-report-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
      <div id="annual-print-area" class="p-6 sm:p-8 space-y-5 bg-white text-slate-900 overflow-y-auto text-xs">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-900 pb-4 gap-3">
          <div>
            <h2 class="text-xl font-black uppercase tracking-tight">RAIHAN FARM SHOP — LIFETIME & PERIODIC AUDIT STATEMENT</h2>
            <p class="text-xs text-slate-600">Permanent Archive • Daily, Weekly, Monthly & Yearly Sales, Inventory & Receivables Ledger</p>
          </div>
          <div class="text-right font-mono text-[11px]">
            <p><strong>Generated:</strong> <span id="ar-date"></span></p>
            <p><strong>Archive Retention:</strong> Permanent (Lifetime)</p>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100 p-3.5 rounded-xl border border-slate-300">
          <div><span class="text-[10px] uppercase font-bold text-slate-500 block">Selected Period Sales</span><strong class="text-base font-black text-slate-900" id="ar-total-sales">—</strong></div>
          <div><span class="text-[10px] uppercase font-bold text-slate-500 block">Cash & Card Collected</span><strong class="text-base font-black text-emerald-700" id="ar-total-collected">—</strong></div>
          <div><span class="text-[10px] uppercase font-bold text-slate-500 block">Total Pending Receivables</span><strong class="text-base font-black text-red-600" id="ar-total-receivables">—</strong></div>
          <div><span class="text-[10px] uppercase font-bold text-slate-500 block">Dressed Meat Sold</span><strong class="text-base font-black text-slate-900" id="ar-total-kg">—</strong></div>
        </div>
        <div>
          <h4 class="font-black text-xs uppercase tracking-wider mb-2 text-slate-700">Part A: Historical Sales & Inventory Breakdown</h4>
          <table class="w-full text-left border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr class="bg-slate-200 text-slate-800 uppercase">
                <th class="py-2 px-2.5 border border-slate-300">Period / Date</th>
                <th class="py-2 px-2.5 border border-slate-300 text-right">Dressed Sold (kg)</th>
                <th class="py-2 px-2.5 border border-slate-300 text-right">Cash & Card Sales</th>
                <th class="py-2 px-2.5 border border-slate-300 text-right">Sub & Bulk Sales</th>
                <th class="py-2 px-2.5 border border-slate-300 text-right">Total Sales</th>
                <th class="py-2 px-2.5 border border-slate-300 text-right">Receivables</th>
                <th class="py-2 px-2.5 border border-slate-300 text-right">Expenses</th>
              </tr>
            </thead>
            <tbody id="ar-monthly-tbody"></tbody>
          </table>
        </div>
        <div id="ar-day-snapshot-print" class="hidden">
          <h4 class="font-black text-xs uppercase tracking-wider mb-2 text-slate-700">Selected Date Inventory & Itemized POS Audit</h4>
          <div id="ar-day-snapshot-body" class="space-y-3"></div>
        </div>
        <div>
          <h4 class="font-black text-xs uppercase tracking-wider mb-2 text-slate-700">Part B: Active Customer & Hotel Credit Receivables Ledger</h4>
          <table class="w-full text-left border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr class="bg-slate-200 text-slate-800 uppercase">
                <th class="py-2 px-2.5 border border-slate-300">Invoice / Date</th>
                <th class="py-2 px-2.5 border border-slate-300">Debtor (Hotel / Customer)</th>
                <th class="py-2 px-2.5 border border-slate-300">Phone</th>
                <th class="py-2 px-2.5 border border-slate-300">Description</th>
                <th class="py-2 px-2.5 border border-slate-300 text-right">Balance Due (Rs.)</th>
                <th class="py-2 px-2.5 border border-slate-300">Status</th>
              </tr>
            </thead>
            <tbody id="ar-receivables-tbody"></tbody>
          </table>
        </div>
        <div class="pt-4 border-t border-slate-300 flex justify-between text-[11px] text-slate-600">
          <span>Prepared By: Raihan Farm Shop Permanent Vault</span>
          <span>Managing Director Signature: ___________________________</span>
        </div>
      </div>
      <div class="bg-slate-950 px-6 py-4 flex justify-end gap-3 border-t border-slate-800 no-print">
        <button onclick="closeAnnualReportModal()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition">Close Preview</button>
        <button onclick="printSection('annual-print-area')" class="px-4 py-2 rounded-xl text-xs font-extrabold bg-yellow-400 hover:bg-yellow-300 text-slate-950 transition flex items-center gap-2"><i class="fa-solid fa-print"></i> Print Statement</button>
      </div>
    </div>
  </div>

  <!-- MODAL 1: THERMAL RECEIPT -->
  <div id="receipt-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
      <div id="receipt-print-area" class="p-6 space-y-4 bg-white text-slate-900 font-mono text-xs">
        <div class="text-center border-b-2 border-dashed border-slate-400 pb-3">
          <img src="/raihan-farm-logo.jpeg" alt="Raihan Farm Shop logo" class="w-20 h-20 rounded-xl object-cover border border-yellow-400/50 mx-auto mb-2">
          <h3 class="font-black text-base tracking-tight uppercase">RAIHAN FARM SHOP</h3>
          <p class="text-[11px] text-slate-600">Fresh Farm-to-Shop Poultry & Meat</p>
          <p class="text-[10px] text-slate-500">Mannar Road, Puttalam • Tel: 0786959777</p>
        </div>
        <div class="flex justify-between text-[11px] border-b border-dashed border-slate-300 pb-2">
          <div><p>Receipt: <strong id="rc-id">—</strong></p><p>Customer No.: <strong id="rc-customer-count">—</strong></p><p>Customer: <span id="rc-customer">—</span></p><p>Phone: <span id="rc-phone">—</span></p></div>
          <div class="text-right"><p id="rc-date"></p><p>Pay: <strong id="rc-payment">CASH</strong></p></div>
        </div>
        <div>
          <div class="grid grid-cols-12 font-bold border-b border-slate-300 pb-1 mb-1.5 text-[11px]"><span class="col-span-6">Item</span><span class="col-span-2 text-right">Qty</span><span class="col-span-4 text-right">Amount</span></div>
          <div id="rc-items" class="space-y-1.5 text-[11px]"></div>
        </div>
        <div class="border-t-2 border-dashed border-slate-400 pt-2 space-y-1 text-xs">
          <div class="flex justify-between"><span>Subtotal:</span><span id="rc-subtotal">Rs. 0</span></div>
          <div class="flex justify-between text-slate-600"><span>Discount:</span><span id="rc-discount">- Rs. 0</span></div>
          <div id="rc-delivery-fee-row" class="hidden flex justify-between text-slate-600"><span>Delivery fee:</span><span id="rc-delivery-fee">Rs. 0</span></div>
          <div class="flex justify-between font-black text-sm pt-1 border-t border-slate-300"><span>BILL TOTAL:</span><span id="rc-total">Rs. 0</span></div>
          <div id="rc-extra-cash-kept-row" class="hidden flex justify-between text-slate-600"><span>Extra cash kept:</span><span id="rc-extra-cash-kept">Rs. 0</span></div>
          <div id="rc-cash-paid-row" class="hidden flex justify-between"><span>Customer paid:</span><span id="rc-cash-paid">Rs. 0</span></div>
          <div id="rc-cash-change-row" class="hidden flex justify-between font-bold"><span>Balance returned:</span><span id="rc-cash-change">Rs. 0</span></div>
          <div class="border-t border-dashed border-slate-300 pt-2 text-[10px]"><p class="font-bold">LOYALTY: <span id="rc-loyalty"></span></p><p id="rc-loyalty-giveaway" class="mt-1"></p></div>
        </div>
        <div class="text-center border-t border-dashed border-slate-300 pt-3 text-[10px] text-slate-500">
          <p class="font-bold text-slate-700">100% Halal • Freshly Dressed from Raihan Own Farm</p>
          <p>Thank you for shopping at Raihan Farm Shop!</p>
        </div>
      </div>
      <p id="receipt-review-note" class="px-5 pt-3 text-center text-xs text-yellow-300 no-print hidden">Review this bill. Nothing is saved or deducted from inventory until you select Save Sale.</p>
      <div id="receipt-preview-actions" class="bg-slate-950 px-5 py-3.5 flex flex-wrap justify-end gap-2 border-t border-slate-800 no-print hidden">
        <button onclick="editPosBill()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"><i class="fa-solid fa-pen-to-square mr-1"></i> Edit Bill</button>
        <button onclick="confirmPosSale()" class="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"><i class="fa-solid fa-check mr-1"></i> Save Sale</button>
      </div>
      <div id="receipt-saved-actions" class="bg-slate-950 px-5 py-3.5 flex justify-end gap-2 border-t border-slate-800 no-print hidden">
        <button id="receipt-close-button" onclick="closeReceiptModal()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition">Close</button>
        <button id="receipt-print-button" onclick="printSection('receipt-print-area')" class="px-4 py-2 rounded-xl text-xs font-extrabold bg-yellow-400 hover:bg-yellow-300 text-slate-950 transition flex items-center gap-1.5"><i class="fa-solid fa-print"></i> Print Thermal Receipt</button>
      </div>
    </div>
  </div>

  <!-- MODAL 2: PAYSLIP -->
  <div id="payslip-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
      <div id="payslip-print-area" class="p-6 space-y-5 bg-slate-900 text-slate-100">
        <div class="flex justify-between items-start border-b border-slate-700 pb-4">
          <div class="flex items-center gap-3">
            <div class="bg-yellow-400 p-2.5 rounded-xl text-slate-950"><i class="fa-solid fa-wheat-awn text-xl"></i></div>
            <div><h3 class="font-black text-lg tracking-wide text-yellow-400">RAIHAN FARM SHOP</h3><p class="text-xs text-slate-400">Official Month-End Staff Payslip</p></div>
          </div>
          <div class="text-right">
            <span class="text-xs uppercase px-2.5 py-1 rounded-full bg-yellow-400/20 text-yellow-300 font-bold" id="ps-month"></span>
            <p class="text-xs text-slate-400 mt-1" id="ps-date">Generated: Today</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/80 text-sm">
          <div><p class="text-xs text-slate-400">Staff Name</p><p class="font-bold text-base text-white" id="ps-name">-</p></div>
          <div><p class="text-xs text-slate-400">Designation / Role</p><p class="font-semibold text-yellow-400" id="ps-role">-</p></div>
          <div><p class="text-xs text-slate-400">Logged Shifts</p><p class="font-semibold" id="ps-shifts">0 Shifts</p></div>
          <div><p class="text-xs text-slate-400">Total Overtime</p><p class="font-semibold text-emerald-400" id="ps-ot-hours">0 hrs</p></div>
        </div>
        <div class="space-y-2.5 text-sm">
          <div class="flex justify-between py-1.5 border-b border-slate-800"><span class="text-slate-400">Basic Monthly Salary</span><span class="font-semibold" id="ps-base">Rs. 0</span></div>
          <div class="flex justify-between py-1.5 border-b border-slate-800"><span class="text-slate-400">Overtime Earnings <span id="ps-ot-rate" class="text-xs text-slate-500"></span></span><span class="font-semibold text-emerald-400" id="ps-ot-pay">+ Rs. 0</span></div>
          <div class="flex justify-between py-1.5 border-b border-slate-800"><span class="text-slate-400">Food, Fuel & Slaughter Allowances</span><span class="font-semibold text-sky-400" id="ps-allowance">+ Rs. 0</span></div>
          <div class="flex justify-between py-1.5 border-b border-slate-800"><span class="text-slate-400">Less: Salary Advances Taken</span><span class="font-semibold text-red-400" id="ps-advance">- Rs. 0</span></div>
        </div>
        <div class="bg-gradient-to-r from-yellow-500/20 to-slate-800 border border-yellow-400/40 p-4 rounded-xl flex justify-between items-center">
          <div><p class="text-xs uppercase tracking-wider text-yellow-300 font-bold">Net Take-Home Salary</p><p class="text-[11px] text-slate-400">Approved for Month-End Payout</p></div>
          <div class="text-2xl font-black text-yellow-400" id="ps-net">Rs. 0</div>
        </div>
        <div class="pt-4 flex justify-between text-xs text-slate-500 border-t border-slate-800"><span>Raihan Farm Admin: ___________________</span><span>Staff Sign: ___________________</span></div>
      </div>
      <div class="bg-slate-950 px-6 py-4 flex justify-end gap-3 border-t border-slate-800 no-print">
        <button onclick="closePayslipModal()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition">Close</button>
        <button onclick="printSection('payslip-print-area')" class="px-4 py-2 rounded-xl text-xs font-extrabold bg-yellow-400 hover:bg-yellow-300 text-slate-950 transition flex items-center gap-2"><i class="fa-solid fa-print"></i> Print Payslip</button>
      </div>
    </div>
  </div>

  <!-- SIDEBAR -->
  <aside class="w-full lg:w-72 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800/90 flex flex-col justify-between p-4 shrink-0">
    <div>
      <div class="flex items-center justify-between lg:justify-start gap-3 px-2 py-3 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <img src="/raihan-farm-logo.jpeg" alt="Raihan Farm Shop logo" class="w-12 h-12 rounded-xl object-cover border border-yellow-400/40 shadow-lg shadow-yellow-400/25">
          <div>
            <h1 class="font-black text-lg tracking-wide text-white leading-none">RAIHAN <span class="text-yellow-400">FARM</span></h1>
            <p class="text-[11px] text-amber-300/80 font-medium mt-1">Farm-to-Shop, POS & ERP</p>
          </div>
        </div>
        <span class="lg:hidden text-xs font-mono bg-slate-900 border border-yellow-500/30 px-2.5 py-1 rounded text-yellow-400" id="live-clock-mobile"></span>
      </div>

      <div class="mt-3 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span id="role-badge-icon" class="w-7 h-7 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-xs"><i class="fa-solid fa-user-shield"></i></span>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-slate-400 leading-none">Logged In As</p>
            <p id="active-user-label" class="text-xs font-extrabold text-yellow-400 mt-0.5">Not signed in</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="openMobileQrPortal()" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-[11px] font-extrabold text-emerald-400 border border-emerald-500/40 transition" title="Staff Mobile QR Scan Check-In"><i class="fa-solid fa-qrcode mr-1"></i>Scan QR</button>
          <button onclick="logout()" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-[11px] font-bold text-slate-200 border border-slate-700 transition"><i class="fa-solid fa-right-from-bracket mr-1 text-yellow-400"></i>Logout</button>
        </div>
      </div>

      <nav class="mt-4 lg:mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1.5">
        <button onclick="switchTab('dashboard')" id="nav-dashboard" class="admin-only-nav w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition active-nav">
          <span class="flex items-center gap-3 truncate"><i class="fa-solid fa-chart-pie w-5 text-center"></i><span class="truncate nav-title">1. Admin Dashboard</span></span>
          <span class="flex items-center gap-1.5">
            <span id="nav-low-stock-badge" title="Low-stock alerts" class="hidden px-1.5 py-0.5 text-[10px] font-black rounded-full bg-red-600 text-white"></span>
          </span>
        </button>
        <button onclick="switchTab('slaughter')" id="nav-slaughter" class="admin-only-nav w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-900 transition"><i class="fa-solid fa-scale-balanced w-5 text-center text-yellow-400"></i><span class="truncate nav-title">2. Farm & Slaughter</span></button>
        <button onclick="switchTab('inventory')" id="nav-inventory" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-900 transition"><i class="fa-solid fa-boxes-stacked w-5 text-center text-yellow-400"></i><span class="truncate nav-title">3. Dressed Inventory</span></button>
        <button onclick="switchTab('pos')" id="nav-pos" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-900 transition"><i class="fa-solid fa-cash-register w-5 text-center text-yellow-400"></i><span class="truncate nav-title">4. Shop POS Terminal</span></button>
        <button onclick="switchTab('attendance')" id="nav-attendance" class="admin-only-nav w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-900 transition"><i class="fa-solid fa-user-clock w-5 text-center text-yellow-400"></i><span class="truncate nav-title">5. Staff Sign-In / Out</span></button>
        <button onclick="switchTab('payroll')" id="nav-payroll" class="admin-only-nav w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-900 transition"><i class="fa-solid fa-money-check-dollar w-5 text-center text-yellow-400"></i><span class="truncate nav-title">6. Month-End Payroll</span></button>
        <button onclick="switchTab('deliveries')" id="nav-deliveries" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-900 transition col-span-2 sm:col-span-2 lg:col-span-1"><i class="fa-solid fa-truck-fast w-5 text-center text-yellow-400"></i><span class="truncate nav-title">7. Deliveries & Weekly Subs</span></button>
        <button onclick="switchTab('coa')" id="nav-coa" class="admin-only-nav w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-900 transition"><i class="fa-solid fa-book-journal-whills w-5 text-center text-yellow-400"></i><span class="truncate nav-title">8. Chart of Accounts</span></button>
      </nav>
    </div>

    <div class="hidden lg:block pt-4 border-t border-slate-800 space-y-3">
      <div class="bg-slate-900/90 rounded-xl p-3.5 border border-yellow-500/20 space-y-2">
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>Supplier: <strong class="text-yellow-400">Raihan Farm</strong></span>
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <div id="live-clock" class="font-mono text-base text-yellow-400 font-black">--:--:--</div>
        <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
          <span class="text-emerald-400 font-bold flex items-center gap-1" id="sidebar-cloud-status"><i class="fa-solid fa-database"></i> Connecting…</span>
          <button onclick="openWindowsCloudModal()" class="text-yellow-400 hover:underline font-bold"><i class="fa-brands fa-windows mr-1"></i>Win App</button>
        </div>
      </div>
    </div>
  </aside>

  <!-- MAIN -->
  <main class="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto space-y-6">

    <!-- TAB 1: DASHBOARD -->
    <section id="tab-dashboard" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-yellow-400 text-slate-950 rounded-full">Raihan Farm Shop</span>
            <span class="text-xs text-slate-400">Integrated Farm Supply • Slaughter Yield • POS • Delivery</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black mt-1 text-white">Executive Command Center</h2>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="openWindowsCloudModal()" class="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-xs font-extrabold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"><i class="fa-brands fa-windows"></i> Windows App & Server</button>
          <button onclick="switchTab('slaughter')" class="bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-500/40 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"><i class="fa-solid fa-scale-balanced"></i> + Log Farm Slaughter</button>
          <button onclick="switchTab('pos')" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-yellow-400/20"><i class="fa-solid fa-cash-register"></i> Open POS Counter</button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="card-highlight p-4">
          <div class="flex justify-between items-start">
            <div><p class="text-[11px] uppercase tracking-wider text-yellow-300/90 font-bold">Dressed Shop Stock</p><h3 class="text-2xl sm:text-3xl font-black mt-1.5 text-yellow-400" id="kpi-stock">—</h3></div>
            <div class="bg-yellow-400/15 p-2.5 rounded-xl text-yellow-400"><i class="fa-solid fa-drumstick-bite text-lg"></i></div>
          </div>
          <p class="text-[11px] text-slate-400 mt-2.5">Net sellable weight after slaughter</p>
        </div>
        <div class="card p-4">
          <div class="flex justify-between items-start">
            <div><p class="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Today's POS Revenue</p><h3 class="text-2xl sm:text-3xl font-black mt-1.5 text-emerald-400" id="kpi-pos-sales">—</h3></div>
            <div class="bg-emerald-500/15 p-2.5 rounded-xl text-emerald-400"><i class="fa-solid fa-cash-register text-lg"></i></div>
          </div>
          <p class="text-[11px] text-slate-400 mt-2.5" id="kpi-pos-count">No sales recorded today</p>
        </div>
        <div class="card p-4">
          <div class="flex justify-between items-start">
            <div><p class="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Avg Slaughter Waste</p><h3 class="text-2xl sm:text-3xl font-black mt-1.5 text-amber-400" id="kpi-waste-pct">—</h3></div>
            <div class="bg-amber-500/15 p-2.5 rounded-xl text-amber-400"><i class="fa-solid fa-percent text-lg"></i></div>
          </div>
          <p class="text-[11px] text-slate-400 mt-2.5" id="kpi-waste-sub">No slaughter batches recorded</p>
        </div>
        <div class="card p-4">
          <div class="flex justify-between items-start">
            <div><p class="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Staff On Shift</p><h3 class="text-2xl sm:text-3xl font-black mt-1.5 text-sky-400" id="kpi-staff">—</h3></div>
            <div class="bg-sky-500/15 p-2.5 rounded-xl text-sky-400"><i class="fa-solid fa-user-check text-lg"></i></div>
          </div>
          <p class="text-[11px] text-slate-400 mt-2.5" id="kpi-payroll-mini">No payroll records</p>
        </div>
        <div class="card p-4">
          <div class="flex justify-between items-start">
            <div><p class="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Next-Day & Weekly</p><h3 class="text-2xl sm:text-3xl font-black mt-1.5 text-purple-400" id="kpi-deliveries">—</h3></div>
            <div class="bg-purple-500/15 p-2.5 rounded-xl text-purple-400"><i class="fa-solid fa-truck-fast text-lg"></i></div>
          </div>
          <p class="text-[11px] text-slate-400 mt-2.5" id="kpi-subs-mini">No subscriptions recorded</p>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 class="font-extrabold text-base text-white flex items-center gap-2"><i class="fa-solid fa-warehouse text-yellow-400"></i> Live Shop Inventory (Actual Dressed Weight Available for POS & Delivery)</h3>
            <p class="text-xs text-slate-400">Automatically increases when you log a Farm Slaughter Batch and deducts when you bill in POS.</p>
          </div>
          <button onclick="switchTab('inventory')" class="text-xs text-yellow-400 hover:text-yellow-300 font-bold shrink-0">Adjust Prices & Stock &rarr;</button>
        </div>
        <div id="dash-inventory-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="card p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-sm uppercase tracking-wider text-yellow-400 flex items-center gap-2"><i class="fa-solid fa-wheat-awn"></i> Recent Farm Slaughter Batches</h3>
              <button onclick="switchTab('slaughter')" class="text-xs text-slate-400 hover:text-yellow-400">View All</button>
            </div>
            <div id="dash-slaughter-list" class="space-y-2.5"></div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between"><span>Farm intake records</span><span class="text-yellow-400 font-semibold">70% Standard Yield</span></div>
        </div>
        <div class="card p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-sm uppercase tracking-wider text-sky-400 flex items-center gap-2"><i class="fa-solid fa-id-card-clip"></i> Live Staff Attendance</h3>
              <button onclick="switchTab('attendance')" class="text-xs text-slate-400 hover:text-yellow-400">Kiosk &rarr;</button>
            </div>
            <div id="dash-attendance-list" class="space-y-2.5"></div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between"><span>Tap Kiosk to clock staff in/out</span><span id="dash-ot-summary" class="text-yellow-400 font-semibold"></span></div>
        </div>
        <div class="card p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-sm uppercase tracking-wider text-emerald-400 flex items-center gap-2"><i class="fa-solid fa-truck-ramp-box"></i> Tomorrow's Delivery Queue</h3>
              <button onclick="switchTab('deliveries')" class="text-xs text-slate-400 hover:text-yellow-400">Dispatch &rarr;</button>
            </div>
            <div id="dash-delivery-list" class="space-y-2.5"></div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between"><span>Includes Weekly Subscriptions</span><span class="text-emerald-400 font-semibold"><i class="fa-brands fa-whatsapp mr-1"></i>WhatsApp Ready</span></div>
        </div>
      </div>

      <!-- LIFETIME ARCHIVE -->
      <div class="card p-5 sm:p-6 space-y-6 border-2 border-yellow-500/30">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1.5"><i class="fa-solid fa-database"></i> Permanent Lifetime Storage (MongoDB)</span>
              <span class="text-xs text-slate-400" id="vault-record-counter">Archiving all years, months, weeks & daily snapshots</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-white mt-1.5">Lifetime Sales, Inventory Time-Machine & Receivables Archive</h3>
            <p class="text-xs text-slate-400">Pick any date from the calendar to inspect that exact day's POS sales & dressed inventory, or switch between <strong>Daily, Weekly, Monthly, Yearly & All-Time</strong> ledgers.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="exportLifetimeBackup()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"><i class="fa-solid fa-download text-yellow-400"></i> Export Vault Backup</button>
            <label class="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
              <i class="fa-solid fa-upload text-emerald-400"></i> Restore Backup
              <input type="file" accept=".json" onchange="importLifetimeBackup(event)" class="hidden">
            </label>
            <button onclick="openAnnualReportModal()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-400/20 flex items-center gap-2"><i class="fa-solid fa-print"></i> Print Active View</button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 items-center">
          <div class="lg:col-span-7 flex flex-wrap items-center gap-1.5">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2"><i class="fa-solid fa-layer-group text-yellow-400 mr-1"></i>View Mode:</span>
            <button onclick="setArchiveGranularity('DATE')" id="gran-DATE" class="px-3 py-2 rounded-xl text-xs font-extrabold transition bg-yellow-400 text-slate-950"><i class="fa-solid fa-calendar-day mr-1"></i>Calendar Day Audit</button>
            <button onclick="setArchiveGranularity('WEEKLY')" id="gran-WEEKLY" class="px-3 py-2 rounded-xl text-xs font-bold transition bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800">Weekly</button>
            <button onclick="setArchiveGranularity('MONTHLY')" id="gran-MONTHLY" class="px-3 py-2 rounded-xl text-xs font-bold transition bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800">Monthly</button>
            <button onclick="setArchiveGranularity('YEARLY')" id="gran-YEARLY" class="px-3 py-2 rounded-xl text-xs font-bold transition bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800">Yearly (Multi-Year)</button>
            <button onclick="setArchiveGranularity('LIFETIME')" id="gran-LIFETIME" class="px-3 py-2 rounded-xl text-xs font-bold transition bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800">All-Time Ledger</button>
          </div>
          <div class="lg:col-span-5 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2">
            <label id="archive-date-label" class="text-xs font-extrabold text-yellow-400 whitespace-nowrap"><i class="fa-regular fa-calendar-check mr-1"></i>Select Date:</label>
            <input type="date" id="archive-calendar-picker" onchange="onCalendarDateChange(this.value)" class="px-3 py-2 rounded-xl text-xs font-black">
            <button id="archive-today-button" onclick="jumpToCalendarDate(getTodayDate())" class="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 border border-slate-700 transition">Today</button>
            <button id="archive-previous-day" onclick="stepCalendarDate(-1)" class="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-yellow-400 border border-slate-700 transition" title="Previous Day"><i class="fa-solid fa-chevron-left"></i></button>
            <button id="archive-next-day" onclick="stepCalendarDate(1)" class="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-yellow-400 border border-slate-700 transition" title="Next Day"><i class="fa-solid fa-chevron-right"></i></button>
            <button id="archive-range-toggle" onclick="toggleArchiveDateRange()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 border border-slate-700 transition">Custom Range</button>
          </div>
          <div id="archive-date-range-controls" class="hidden lg:col-span-12 flex flex-wrap items-end justify-end gap-2 border-t border-slate-800 pt-3">
            <label class="text-xs text-slate-400 font-semibold">From
              <input type="date" id="archive-range-from" class="ml-1 px-3 py-2 rounded-xl text-xs font-bold">
            </label>
            <label class="text-xs text-slate-400 font-semibold">To
              <input type="date" id="archive-range-to" class="ml-1 px-3 py-2 rounded-xl text-xs font-bold">
            </label>
            <button onclick="applyArchiveDateRange()" class="px-3 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-xs font-black text-slate-950 transition">Apply Range</button>
            <button onclick="toggleArchiveDateRange(false)" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition">Single Date</button>
          </div>
        </div>

        <div id="calendar-day-inspector" class="space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/90 p-4 rounded-xl border border-yellow-400/30">
            <div>
              <span id="cal-date-snapshot-title" class="text-[11px] uppercase font-extrabold text-yellow-400 tracking-wider block">Selected Calendar Date Snapshot</span>
              <h4 class="text-lg font-black text-white" id="cal-selected-date-heading"></h4>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400" id="cal-day-pos-badge">No sales recorded</span>
              <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-yellow-400" id="cal-day-kg-badge">No sales recorded</span>
              <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-sky-400" id="cal-day-slaughter-badge">No slaughter recorded</span>
            </div>
          </div>
          <div id="calendar-day-grid" class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div id="calendar-day-inventory-panel" class="lg:col-span-7 bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <h5 class="font-extrabold text-xs uppercase tracking-wider text-yellow-400 flex items-center gap-2"><i class="fa-solid fa-boxes-stacked"></i> That Day's Inventory & Stock Movement</h5>
                <span class="text-[11px] text-slate-400">Includes meat, packets, eggs and other inventory units</span>
              </div>
              <p class="text-[11px] text-slate-400">For meat, expected closing = opening + slaughter received − POS sold ± recorded adjustments. Red means actual stock is short; amber means extra stock. Unrecorded waste or stock changes still appear as a difference.</p>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="border-b border-slate-700 text-slate-400 uppercase text-[10px]">
                      <th class="py-2 px-2">Inventory Item</th><th class="py-2 px-2 text-right">Opening</th><th class="py-2 px-2 text-right">Added / Slaughter In</th><th class="py-2 px-2 text-right">Sold (POS)</th><th class="py-2 px-2 text-right">Manual Adjustment</th><th class="py-2 px-2 text-right">Expected Closing</th><th class="py-2 px-2 text-right">Actual Closing</th><th class="py-2 px-2 text-right">Difference</th><th class="py-2 px-2 text-right">Rate / Unit</th>
                    </tr>
                  </thead>
                  <tbody id="cal-day-inventory-tbody" class="divide-y divide-slate-800/80"></tbody>
                </table>
              </div>
              <div class="space-y-2 border-t border-slate-800 pt-3">
                <h6 class="text-[11px] font-extrabold uppercase tracking-wide text-yellow-400">Manual Stock Adjustments</h6>
                <div id="cal-day-adjustments" class="space-y-2"></div>
              </div>
            </div>
            <div id="calendar-day-sales-panel" class="lg:col-span-5 bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h5 id="cal-day-sales-title" class="font-extrabold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-2"><i class="fa-solid fa-receipt"></i> That Day's POS Sales Bills & Slaughter Logs</h5>
                  <span class="text-[11px] text-slate-400" id="cal-day-tx-count">No records for this date</span>
                </div>
                <div id="cal-day-sales-list" class="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
              </div>
              <div class="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                <span>Every POS sale & slaughter batch is auto-archived by date</span>
                <button onclick="openAnnualReportModal()" class="text-yellow-400 hover:underline font-bold"><i class="fa-solid fa-print mr-1"></i>Print Day Sheet</button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-2 border-t border-slate-800">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 class="font-extrabold text-sm uppercase tracking-wider text-yellow-400 flex items-center gap-2" id="period-table-heading"><i class="fa-solid fa-chart-column"></i> Permanent Historical Sales & Financial Ledger</h4>
              <p class="text-xs text-slate-400" id="period-table-subheading">Showing complete multi-year records stored permanently in the system.</p>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-xs text-slate-400 font-semibold">Filter Year / Period:</label>
              <select id="annual-month-filter" onchange="renderAnnualAnalytics()" class="px-3.5 py-2 rounded-xl text-xs font-bold"><option value="ALL">All Stored Periods (Lifetime)</option></select>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800"><span class="text-[11px] uppercase text-slate-400 font-bold block">Selected Period Gross Revenue</span><strong class="text-2xl font-black text-yellow-400 mt-1 block" id="yr-kpi-sales">—</strong><span class="text-[11px] text-slate-500">POS Counter + Weekly Subs + Bulk</span></div>
            <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800"><span class="text-[11px] uppercase text-slate-400 font-bold block">Cash & Bank Collected</span><strong class="text-2xl font-black text-emerald-400 mt-1 block" id="yr-kpi-collected">—</strong><span class="text-[11px] text-slate-500">Settled payments in hand</span></div>
            <div class="p-4 rounded-xl bg-slate-900/90 border border-red-500/30"><span class="text-[11px] uppercase text-red-300 font-bold block">Total Pending Receivables</span><strong class="text-2xl font-black text-red-400 mt-1 block" id="yr-kpi-receivables">—</strong><span class="text-[11px] text-slate-400" id="yr-kpi-rec-count">No receivables recorded</span></div>
            <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800"><span class="text-[11px] uppercase text-slate-400 font-bold block">Total Dressed Meat Sold</span><strong class="text-2xl font-black text-sky-400 mt-1 block" id="yr-kpi-kg">—</strong><span class="text-[11px] text-slate-500">Net weight after 30% farm waste</span></div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
                  <th class="py-3 px-3" id="period-col-header">Period</th><th class="py-3 px-3 text-right">Dressed Sold (kg)</th><th class="py-3 px-3 text-right">POS Cash/Card</th><th class="py-3 px-3 text-right">Subscriptions & Bulk</th><th class="py-3 px-3 text-right">Total Sales</th><th class="py-3 px-3 text-right">Receivables (Credit)</th><th class="py-3 px-3 text-right">Expenses & Payroll</th><th class="py-3 px-3 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody id="annual-monthly-tbody" class="divide-y divide-slate-800"></tbody>
            </table>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800 space-y-3">
          <div>
            <h4 class="font-bold text-sm uppercase tracking-wider text-yellow-400 flex items-center gap-2"><i class="fa-solid fa-file-invoice-dollar"></i> Accounts Receivable (Credit Sales & Hotel Balances)</h4>
            <p class="text-xs text-slate-400">Any POS sale marked as <strong>CREDIT</strong> is permanently logged here. Mark payments received to update balances.</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
                  <th class="py-2.5 px-3">Invoice & Date</th><th class="py-2.5 px-3">Customer / Hotel</th><th class="py-2.5 px-3">Phone</th><th class="py-2.5 px-3">Order Details</th><th class="py-2.5 px-3 text-right">Amount Due</th><th class="py-2.5 px-3">Status</th><th class="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody id="receivables-tbody" class="divide-y divide-slate-800"></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 2: SLAUGHTER -->
    <section id="tab-slaughter" class="space-y-6 hidden">
      <div class="border-b border-slate-800 pb-4">
        <span class="px-2.5 py-0.5 text-xs font-extrabold uppercase bg-yellow-400 text-slate-950 rounded-full">Raihan Own Farm Supplier</span>
        <h2 class="text-2xl font-black mt-1">Farm Intake & Evening Slaughter</h2>
        <p class="text-slate-400 text-sm">Save the animal count and total live weight in the morning. In the evening, record deaths, slaughtered count, and measured dressed weight. Wastage is calculated using the morning average live weight for the animals actually slaughtered, so animals kept back are not counted as waste.</p>
      </div>
      <div class="card-highlight p-5 sm:p-6 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 class="font-extrabold text-base text-yellow-400 flex items-center gap-2"><i class="fa-solid fa-scale-balanced"></i> Farm-to-Shop Daily Process</h3>
          <span class="text-xs bg-slate-900 border border-yellow-500/30 px-3 py-1 rounded-lg text-slate-300">Formula: <strong>(Morning live weight ÷ morning count) × slaughtered count</strong>, then 70% expected dressed yield</span>
        </div>
        <div class="space-y-4 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
          <div>
            <h4 class="text-sm font-bold text-sky-300">Morning — Record Animal Intake</h4>
            <p class="text-xs text-slate-400">Save the animals received and their total live weight. Slaughter and death details are recorded separately in the evening.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label class="block text-xs text-slate-400 font-semibold">Animal type received
              <select id="sl-intake-animal-type" class="mt-1.5 w-full px-3 py-2.5 rounded-xl text-sm font-bold">
                <option value="Broiler">Broiler</option>
                <option value="Layer">Layer</option>
                <option value="Parents">Parents</option>
              </select>
            </label>
            <label class="block text-xs text-slate-400 font-semibold">Animals received (Count)
              <input type="number" id="sl-intake-count" min="1" step="1" placeholder="Enter count received" class="mt-1.5 w-full px-3 py-2.5 rounded-xl text-sm font-bold">
            </label>
            <label class="block text-xs text-yellow-400 font-bold">Total live intake weight (kg)
              <input type="number" min="0.01" step="0.1" id="sl-intake-live-kg" placeholder="Enter total live weight" class="mt-1.5 w-full px-3 py-2.5 rounded-xl text-sm font-extrabold">
            </label>
            <div class="flex items-end">
              <button type="button" onclick="recordFarmIntake()" class="w-full bg-sky-400 hover:bg-sky-300 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition"><i class="fa-solid fa-floppy-disk mr-1"></i> Save Morning Intake</button>
            </div>
          </div>
        </div>
        <div class="space-y-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
          <div>
            <h4 class="text-sm font-bold text-yellow-400">Evening — Record Deaths & Slaughter</h4>
            <p class="text-xs text-slate-400">Choose a saved morning intake, then enter deaths, slaughtered count, and the measured dressed weights. Remaining birds are excluded from wastage. Saving this record does not change inventory.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label class="block text-xs text-slate-400 font-semibold lg:col-span-2">Morning intake to reconcile
              <select id="sl-intake-id" onchange="onFarmIntakeSelected()" class="mt-1.5 w-full px-3 py-2.5 rounded-xl text-sm font-bold">
                <option value="">Save a morning intake first</option>
              </select>
            </label>
            <div id="sl-selected-intake-summary" class="flex items-center rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-400 lg:col-span-2" aria-live="polite">Select an intake to see its animal count and live weight.</div>
            <label class="block text-xs text-red-300 font-semibold">Dead before slaughter (Count)
              <input type="number" id="sl-dead-count" min="0" step="1" value="0" placeholder="0" oninput="calculateSlaughterPreview()" class="mt-1.5 w-full px-3 py-2.5 rounded-xl text-sm font-bold">
            </label>
            <label class="block text-xs text-slate-400 font-semibold">Animals slaughtered (Count)
              <input type="number" id="sl-slaughter-count" min="1" step="1" placeholder="Enter slaughtered count" oninput="calculateSlaughterPreview()" class="mt-1.5 w-full px-3 py-2.5 rounded-xl text-sm font-bold">
            </label>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h4 class="text-sm font-bold text-emerald-400">Dressed Items for Double-Check</h4>
              <p class="text-xs text-slate-400">Select each inventory item and enter its dressed weight for verification only. Stock will not be added.</p>
            </div>
            <button type="button" onclick="addSlaughterOutputRow('slaughter-output-rows')" class="shrink-0 rounded-lg border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/10">
              <i class="fa-solid fa-plus mr-1"></i> Add Item
            </button>
          </div>
          <div id="slaughter-output-rows" class="space-y-2"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-950/90 p-4 rounded-xl border border-slate-800">
          <div class="p-2"><span class="text-[11px] uppercase text-slate-400 block">Estimated Live Weight / Slaughtered Animal</span><strong class="text-base text-white font-bold" id="prev-avg-live">—</strong><span class="text-[10px] text-slate-500 block" id="prev-estimated-live">Enter slaughtered count to estimate total live weight.</span></div>
          <div class="p-2 border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-4"><span class="text-[11px] uppercase text-slate-400 block">Expected 70% Dressed Yield</span><strong class="text-base text-yellow-400 font-extrabold" id="prev-expected-kg">—</strong><span class="text-[10px] text-slate-500 block" id="prev-std-waste">—</span></div>
          <div class="p-2 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-4"><span class="text-[11px] uppercase text-slate-400 block">Actual Wastage (kg & %)</span><strong class="text-base text-red-400 font-extrabold" id="prev-actual-waste">—</strong><span class="text-[10px] text-slate-500 block" id="prev-waste-per-animal">Average per slaughtered animal: —</span></div>
          <div class="p-2 border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-4"><span class="text-[11px] uppercase text-slate-400 block">Total Dressed Weight Checked</span><strong class="text-lg text-emerald-400 font-black" id="prev-net-stock">—</strong></div>
          <div class="flex items-center justify-end pt-2 lg:pt-0">
            <button onclick="recordSlaughterBatch()" class="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2"><i class="fa-solid fa-floppy-disk text-sm"></i> Save Double-Check Record</button>
          </div>
        </div>
      </div>
      <div class="card p-5 overflow-x-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 class="font-bold text-base text-white">Morning Farm Intake Log</h3>
          <span class="text-xs text-slate-400">Intakes remain available here until their evening slaughter is recorded</span>
        </div>
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
              <th class="py-3 px-3">Intake & Date</th><th class="py-3 px-3">Animal Type</th><th class="py-3 px-3">Animals Received</th><th class="py-3 px-3">Total Live Weight</th><th class="py-3 px-3">Evening Status</th>
            </tr>
          </thead>
          <tbody id="farm-intake-tbody" class="divide-y divide-slate-800"></tbody>
        </table>
      </div>
      <div class="card p-5 overflow-x-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 class="font-bold text-base text-white">Farm-to-Shop Slaughter Batch Log & Wastage Audit</h3>
          <span class="text-xs text-slate-400">Tracks farm intake, deaths, slaughter and dressed yield for verification</span>
        </div>
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
              <th class="py-3 px-3">Date & Batch</th><th class="py-3 px-3">Farm Source & Animal</th><th class="py-3 px-3">Live Intake Count</th><th class="py-3 px-3">Live Intake Weight</th><th class="py-3 px-3">Dead Before Slaughter</th><th class="py-3 px-3">Slaughtered Animal</th><th class="py-3 px-3">Slaughtered Count</th><th class="py-3 px-3">Remaining Count</th><th class="py-3 px-3">Estimated Slaughter Live Weight</th><th class="py-3 px-3">Expected (70%)</th><th class="py-3 px-3">Actual Dressed Wt</th><th class="py-3 px-3">Actual Wastage</th><th class="py-3 px-3">Yield Status</th><th class="py-3 px-3 admin-only-nav">Admin</th>
            </tr>
          </thead>
          <tbody id="slaughter-tbody" class="divide-y divide-slate-800"></tbody>
        </table>
      </div>
    </section>

    <!-- TAB 3: INVENTORY -->
    <section id="tab-inventory" class="space-y-6 hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span id="inv-role-notice" class="px-2.5 py-0.5 text-xs font-extrabold uppercase bg-yellow-400 text-slate-950 rounded-full">Admin Mode: Unlimited Edits</span>
          <h2 class="text-2xl font-black mt-1">Live Shop Inventory & Pricing</h2>
          <p class="text-slate-400 text-sm">Track dressed meat by kg and packaged products by whole packets or units. Masala packets include their gram weight. <strong>Staff Policy:</strong> Staff can edit each item <strong>once</strong>; further adjustments require Admin approval.</p>
        </div>
        <button onclick="switchTab('slaughter')" id="btn-receive-farm-batch" class="admin-only-nav bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold transition"><i class="fa-solid fa-wheat-awn mr-1"></i> + Receive Farm Batch</button>
      </div>
      <div class="card p-5 space-y-3 admin-only-nav">
        <h3 class="font-bold text-sm text-yellow-400">Add Inventory Item</h3>
        <p class="text-xs text-slate-400">New items start with zero stock. Add opening stock using the stock audit field or record a farm batch.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input type="text" id="new-inv-name" list="inventory-item-name-options" placeholder="Item name — select existing or type a new one" class="px-3 py-2 rounded-lg text-sm">
          <select id="new-inv-unit" onchange="inventoryUnitFormChanged()" class="px-3 py-2 rounded-lg text-sm font-semibold">
            <option value="kg">Weight by kg</option>
            <option value="packet">Whole packets (integer)</option>
            <option value="unit">Individual units (integer)</option>
          </select>
          <div><label for="new-inv-source" class="block text-[11px] text-slate-400 mb-1">Farm / Supplier Source</label><input type="text" id="new-inv-source" list="inventory-supplier-options" placeholder="Select existing or type a new supplier" class="w-full px-3 py-2 rounded-lg text-sm"></div>
          <div><label for="new-inv-wholesale" class="block text-[11px] text-slate-400 mb-1">Wholesale Price (Rs.)</label><input type="number" min="0" step="0.01" id="new-inv-wholesale" placeholder="Wholesale price" class="w-full px-3 py-2 rounded-lg text-sm"></div>
          <div id="new-inv-pack-wrap" class="hidden">
            <input type="number" min="1" step="1" id="new-inv-pack-grams" placeholder="Grams per packet" class="w-full px-3 py-2 rounded-lg text-sm">
          </div>
          <input type="number" min="0.01" step="0.01" id="new-inv-price" placeholder="Retail price per kg (Rs.)" class="px-3 py-2 rounded-lg text-sm">
          <input type="number" min="0" step="0.1" id="new-inv-min-stock" placeholder="Low-stock alert threshold (kg)" class="px-3 py-2 rounded-lg text-sm">
          <button onclick="addInventoryItem()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-2 rounded-lg text-xs font-black">Add Item</button>
        </div>
      </div>
      <div class="card p-5 space-y-3 border border-amber-500/30">
        <div>
          <h3 class="font-bold text-sm text-amber-300"><i class="fa-solid fa-scale-balanced mr-1"></i> Meat Stock Adjustments</h3>
          <p class="mt-1 text-xs text-slate-400">Use this to log measured wastage, stock-count differences, or other corrections. Stock updates immediately, and the reason appears in that day’s inventory reconciliation.</p>
        </div>
        <div class="space-y-3">
        <h4 class="text-[11px] font-extrabold uppercase tracking-wide text-slate-300">Record Meat Stock Adjustment</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <label class="text-[11px] font-semibold text-slate-400">Meat item
            <select id="inv-adjustment-item" class="mt-1 w-full px-3 py-2 rounded-lg text-sm font-bold"><option value="">Loading meat items…</option></select>
          </label>
          <label class="text-[11px] font-semibold text-slate-400">Adjustment type
            <select id="inv-adjustment-direction" onchange="inventoryAdjustmentDirectionChanged()" class="mt-1 w-full px-3 py-2 rounded-lg text-sm font-bold">
              <option value="DECREASE">Decrease stock (wastage / shortage)</option>
              <option value="INCREASE">Increase stock (counted extra)</option>
              <option value="COUNT">Set physical counted balance</option>
            </select>
          </label>
          <label class="text-[11px] font-semibold text-slate-400"><span id="inv-adjustment-quantity-label">Amount (kg)</span>
            <input id="inv-adjustment-quantity" type="number" min="0.01" step="0.01" placeholder="e.g. 5" class="mt-1 w-full px-3 py-2 rounded-lg text-sm font-bold">
          </label>
          <label class="text-[11px] font-semibold text-slate-400">Reason
            <select id="inv-adjustment-reason" class="mt-1 w-full px-3 py-2 rounded-lg text-sm font-bold">
              <option value="">Select a reason</option>
              <option value="Spoilage">Spoilage</option>
              <option value="Trimming / waste">Trimming / waste</option>
              <option value="Stock-count correction">Stock-count correction</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label class="text-[11px] font-semibold text-slate-400">Note <span class="font-normal">(required for Other)</span>
            <input id="inv-adjustment-note" type="text" maxlength="160" placeholder="Optional details" class="mt-1 w-full px-3 py-2 rounded-lg text-sm">
          </label>
        </div>
        <div class="flex justify-end">
          <button type="button" onclick="recordInventoryAdjustment()" class="rounded-lg bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-300"><i class="fa-solid fa-clipboard-check mr-1"></i> Record Adjustment</button>
        </div>
        </div>
        <div class="space-y-2 border-t border-slate-800 pt-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h4 class="text-[11px] font-extrabold uppercase tracking-wide text-yellow-400">Recorded Adjustments</h4>
            <label class="text-[11px] font-semibold text-slate-400">Date
              <input id="inv-adjustment-history-date" type="date" onchange="renderInventoryAdjustmentHistory()" class="ml-1 rounded-lg px-2.5 py-1.5 text-xs">
            </label>
          </div>
          <div id="inv-adjustment-history" class="space-y-2" aria-live="polite"></div>
        </div>
      </div>
      <datalist id="inventory-item-name-options"></datalist>
      <datalist id="inventory-supplier-options"></datalist>
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
        <input type="search" id="inventory-search" oninput="renderInventoryCards()" placeholder="Search inventory by item name..." class="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm">
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5" id="inventory-cards-container"></div>
      <div class="card p-5 space-y-4">
        <div>
          <h3 class="font-bold text-sm text-yellow-400"><i class="fa-solid fa-file-pdf mr-1"></i> Inventory Stock Addition Summary</h3>
          <p class="mt-1 text-xs text-slate-400">Review who added each item, when it was added, and the quantity and unit. Choose a day to view or print the summary as a PDF.</p>
        </div>
        <div class="no-print flex flex-col sm:flex-row sm:items-end gap-3">
          <label for="inv-stock-additions-date" class="text-xs font-semibold text-slate-400">Summary day
            <input id="inv-stock-additions-date" type="date" onchange="resetInventoryStockAdditionsSummary()" class="mt-1 block px-3 py-2 rounded-lg text-sm">
          </label>
          <button type="button" onclick="loadInventoryStockAdditions()" class="rounded-lg bg-slate-700 px-4 py-2 text-xs font-bold text-white hover:bg-slate-600"><i class="fa-solid fa-filter mr-1"></i> View Summary</button>
          <button id="inv-stock-additions-print-button" type="button" onclick="printInventoryStockAdditions()" disabled class="rounded-lg bg-yellow-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"><i class="fa-solid fa-file-pdf mr-1"></i> Print / Save as PDF</button>
        </div>
        <div id="inventory-stock-additions-print-area" class="inventory-stock-additions-print-area">
          <h4 id="inv-stock-additions-heading" class="font-bold text-slate-300">Select a day and view the summary.</h4>
          <div id="inv-stock-additions-totals" class="mt-2 text-xs text-slate-400"></div>
          <div class="mt-3 overflow-x-auto">
            <table class="w-full min-w-[640px] text-left border-collapse text-xs">
              <thead><tr class="border-b border-slate-700 text-slate-400 uppercase">
                <th class="py-2 px-3">Time</th><th class="py-2 px-3">Item</th><th class="py-2 px-3">Added By</th>
                <th class="py-2 px-3 text-right">Quantity</th><th class="py-2 px-3">Unit</th><th class="py-2 px-3">Source</th>
              </tr></thead>
              <tbody id="inv-stock-additions-tbody"><tr><td colspan="6" class="py-4 text-center text-slate-500">Choose a day to load stock additions.</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 4: POS -->
    <section id="tab-pos" class="space-y-6 hidden">
      <div class="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span class="px-2.5 py-0.5 text-xs font-extrabold uppercase bg-yellow-400 text-slate-950 rounded-full">Walk-In & Counter Billing</span>
          <h2 class="text-2xl font-black mt-1">Raihan Farm Shop — Point of Sale (POS)</h2>
          <p class="text-slate-400 text-sm">Search items, sell meat by weight or packaged goods by whole quantity, and print the customer receipt. Adjust unit prices on credit bills as needed. Stock may go below zero during sales; add the missing stock before closing the POS day.</p>
        </div>
        <button id="pos-close-shop" type="button" onclick="closeShopAndLogout()" class="shrink-0 rounded-xl border border-red-500/60 bg-red-600 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500">
          <i class="fa-solid fa-store-slash mr-1"></i> Shop Closed
        </button>
      </div>
      <div id="pos-billing-terminal" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 space-y-5">
          <div class="card p-5">
            <h3 class="font-bold text-xs uppercase tracking-wider text-yellow-400 mb-3">1. Select Inventory Product <span class="text-[10px] normal-case text-slate-400">— most frequently sold first</span></h3>
            <div class="relative mb-3">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input type="search" id="pos-product-search" oninput="searchPosProducts()" placeholder="Search products by name..." class="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="pos-product-grid"></div>
            <button type="button" id="pos-products-toggle" onclick="togglePosProductList()" class="hidden mt-3 w-full rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-yellow-300 hover:border-yellow-400 hover:text-yellow-200" aria-expanded="false"></button>
          </div>
          <div class="card-highlight p-5 space-y-4">
            <div class="flex items-center justify-between">
              <h3 id="pos-quantity-title" class="font-bold text-xs uppercase tracking-wider text-yellow-400">2. Enter Weight (kg) or Bill Amount (Rs.)</h3>
              <span id="pos-selected-label" class="text-xs font-extrabold text-white bg-slate-800 px-3 py-1 rounded-lg">No inventory item selected</span>
            </div>
            <div id="pos-kg-presets" class="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button onclick="setPosWeight(0.25)" class="bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-slate-200 font-bold py-2 rounded-xl text-xs border border-slate-700 transition">250g (0.25kg)</button>
              <button onclick="setPosWeight(0.5)" class="bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-slate-200 font-bold py-2 rounded-xl text-xs border border-slate-700 transition">500g (0.5kg)</button>
              <button onclick="setPosWeight(1.0)" class="bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-slate-200 font-bold py-2 rounded-xl text-xs border border-slate-700 transition">1.0 kg</button>
              <button onclick="setPosWeight(1.5)" class="bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-slate-200 font-bold py-2 rounded-xl text-xs border border-slate-700 transition">1.5 kg</button>
              <button onclick="setPosWeight(2.0)" class="bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-slate-200 font-bold py-2 rounded-xl text-xs border border-slate-700 transition">2.0 kg</button>
              <button onclick="setPosWeight(5.0)" class="bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-slate-200 font-bold py-2 rounded-xl text-xs border border-slate-700 transition">5.0 kg</button>
            </div>
            <fieldset id="pos-chicken-cut-options" class="hidden rounded-xl border border-slate-700 bg-slate-950/60 p-3">
              <legend class="px-1 text-xs font-bold text-slate-300">Chicken preparation</legend>
              <div class="flex flex-wrap gap-4 text-xs font-semibold">
                <label class="flex cursor-pointer items-center gap-2 text-slate-200"><input type="radio" name="pos-chicken-cut" value="whole" checked onchange="updatePosLinePreview('weight')" class="accent-yellow-400"> Whole Chicken</label>
                <label class="flex cursor-pointer items-center gap-2 text-yellow-300"><input type="radio" name="pos-chicken-cut" value="pieces" onchange="updatePosLinePreview('weight')" class="accent-yellow-400"> Pieces (+ Rs. 200/kg)</label>
              </div>
            </fieldset>
            <div id="pos-kg-control" class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div><label class="block text-xs text-slate-400 mb-1">Weight (kg)</label><input type="number" step="0.01" id="pos-weight-input" placeholder="Enter weight" oninput="updatePosLinePreview('weight')" class="w-full px-3.5 py-2.5 rounded-xl text-base font-black"></div>
              <div><label class="block text-xs text-slate-400 mb-1">Bill Amount (Rs.)</label><input type="number" min="0" step="1" id="pos-amount-input" placeholder="Enter amount or weight" oninput="updatePosLinePreview('amount')" class="w-full px-3.5 py-2.5 rounded-xl text-base font-black"></div>
              <button onclick="addItemToPosCart()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2"><i class="fa-solid fa-cart-plus"></i> Add to Customer Bill</button>
            </div>
            <div id="pos-unit-control" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div><label id="pos-unit-quantity-label" class="block text-xs text-slate-400 mb-1">Quantity (whole packets)</label><input type="number" min="1" step="1" id="pos-quantity-input" placeholder="Enter whole quantity" oninput="updatePosLinePreview()" class="w-full px-3.5 py-2.5 rounded-xl text-base font-black"></div>
              <button onclick="addItemToPosCart()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2"><i class="fa-solid fa-cart-plus"></i> Add to Customer Bill</button>
            </div>
          </div>
        </div>
        <div class="lg:col-span-5">
          <div class="card p-5 flex flex-col justify-between h-full space-y-4 border-yellow-500/30">
            <div>
              <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div><h3 class="font-black text-base text-white">Current Customer Bill</h3><p class="text-xs text-slate-400">Raihan Farm Shop Counter Terminal</p></div>
                <button onclick="clearPosCart()" class="text-xs text-red-400 hover:text-red-300 font-semibold"><i class="fa-solid fa-trash-can mr-1"></i> Clear</button>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-1">
                <input type="tel" id="pos-cust-phone" oninput="lookupPosCustomer()" placeholder="Customer phone (optional; for loyalty)" autocomplete="tel" class="px-3 py-2 rounded-lg text-xs">
                <input type="text" id="pos-cust-name" placeholder="Customer name (optional)" autocomplete="name" class="px-3 py-2 rounded-lg text-xs">
                <fieldset class="sm:col-span-2 rounded-lg border border-slate-700 p-2.5">
                  <legend class="px-1 text-[11px] font-bold text-slate-400">Fulfilment</legend>
                  <div class="flex gap-5 text-xs">
                    <label class="flex items-center gap-2 font-semibold text-slate-300"><input type="radio" name="pos-fulfilment" value="counter" checked onchange="onPosFulfilmentChanged()" class="accent-yellow-400"> Counter pickup</label>
                    <label class="flex items-center gap-2 font-semibold text-slate-300"><input type="radio" name="pos-fulfilment" value="delivery" onchange="onPosFulfilmentChanged()" class="accent-yellow-400"> Delivery</label>
                  </div>
                </fieldset>
                <label id="pos-delivery-fee-wrap" for="pos-delivery-fee" class="hidden sm:col-span-2 rounded-lg border border-sky-500/30 bg-sky-950/20 p-3 text-xs font-bold text-sky-200">
                  Delivery fee (Rs.)
                  <input type="number" id="pos-delivery-fee" min="0" step="1" inputmode="numeric" oninput="renderPosCart()" placeholder="Enter delivery fee" class="mt-1 w-full px-3 py-2 rounded-lg text-sm font-bold">
                </label>
                <select id="pos-pay-method" onchange="updatePosCashPayment()" class="px-3 py-2 rounded-lg text-xs font-bold sm:col-span-2">
                  <option value="CASH">Cash Payment</option>
                  <option value="CARD">Card / POS Machine</option>
                  <option value="QR / TRANSFER">LankaQR / Bank Transfer</option>
                  <option value="CREDIT">Hotel / Regular Credit</option>
                </select>
              </div>
              <div id="pos-cash-payment" class="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3">
                <label for="pos-cash-received" class="block text-xs font-bold text-emerald-200">Cash received from customer (Rs., optional)</label>
                <input type="number" id="pos-cash-received" min="0" step="1" inputmode="numeric" oninput="updatePosCashSummary()" placeholder="Optional; defaults to bill total" class="mt-1 w-full px-3 py-2 rounded-lg text-sm font-bold">
                <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label for="pos-extra-cash-kept" class="text-xs font-bold text-emerald-200">Extra cash kept (Rs., optional)
                    <input type="number" id="pos-extra-cash-kept" min="0" step="0.01" inputmode="decimal" oninput="updatePosCashSummary()" placeholder="0" class="mt-1 w-full px-3 py-2 rounded-lg text-sm font-bold">
                  </label>
                  <label for="pos-extra-cash-reason" class="text-xs font-bold text-emerald-200">Reason <span id="pos-extra-cash-reason-required" class="hidden">*</span>
                    <input type="text" id="pos-extra-cash-reason" maxlength="500" placeholder="Required when extra cash is kept" class="mt-1 w-full px-3 py-2 rounded-lg text-sm font-bold">
                  </label>
                </div>
              </div>
              <div id="pos-customer-status" class="min-h-4 text-[11px] text-slate-400 mb-2" aria-live="polite"></div>
              <div id="pos-loyalty-summary" class="mb-3 rounded-lg border border-emerald-500/20 bg-emerald-950/30 px-3 py-2 text-[11px] text-emerald-200" aria-live="polite"></div>
              <div id="pos-cart-list" class="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
            </div>
            <div class="border-t border-slate-800 pt-4 space-y-3">
              <div class="flex justify-between items-center text-xs text-slate-400"><span>Subtotal:</span><span class="font-bold text-white" id="pos-subtotal">Rs. 0</span></div>
              <div class="flex justify-between items-center gap-2 text-xs text-slate-400">
                <label for="pos-discount">Discount:</label>
                <div class="flex items-center gap-2">
                  <select id="pos-discount-type" aria-label="Discount type" onchange="onPosDiscountTypeChanged()" class="rounded-lg px-2 py-1 text-xs font-bold">
                    <option value="percentage">Percentage (%)</option>
                    <option value="amount">Amount (Rs.)</option>
                  </select>
                  <input type="number" id="pos-discount" aria-label="Discount value" value="0" min="0" max="100" step="0.01" oninput="renderPosCart()" class="w-24 px-2.5 py-1 rounded-lg text-right text-xs font-bold">
                </div>
              </div>
              <div class="flex justify-between items-center text-xs text-slate-500"><span>Discount amount:</span><span id="pos-discount-amount">Rs. 0</span></div>
              <div id="pos-delivery-fee-summary" class="hidden justify-between items-center text-xs text-sky-300"><span>Delivery fee:</span><span class="font-bold" id="pos-delivery-fee-total">Rs. 0</span></div>
              <div class="flex justify-between items-center bg-slate-950 p-3.5 rounded-xl border border-yellow-500/30">
                <div><span class="text-xs uppercase font-bold text-yellow-400 block">Grand Total</span><span class="text-[11px] text-slate-400" id="pos-total-weight">0.00 kg total meat</span></div>
                <span class="text-2xl font-black text-white" id="pos-grand-total">Rs. 0</span>
              </div>
              <div id="pos-change-summary" class="flex justify-between items-center rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-2.5 text-sm" aria-live="polite">
                <span id="pos-change-label" class="font-bold text-emerald-200">Balance to return</span>
                <span id="pos-change-amount" class="font-black text-emerald-300">Rs. 0</span>
              </div>
              <button onclick="completePosSale()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"><i class="fa-solid fa-receipt"></i> Complete Sale & Print Receipt</button>
            </div>
          </div>
        </div>
      </div>
      <div id="pos-income-summary" class="card p-5 space-y-4">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <h3 class="font-bold text-base text-white">POS Income Summary</h3>
            <p class="text-xs text-slate-400">Cash and card/QR/transfer collected; credit sales are excluded until payment.</p>
          </div>
          <div class="flex flex-wrap items-end gap-2 no-print">
            <label for="pos-income-period" class="text-xs text-slate-400 font-semibold">Period</label>
            <select id="pos-income-period" onchange="setPosIncomePeriod(this.value)" class="px-3 py-2 rounded-lg text-sm">
              <option value="DAY">Current Day</option>
              <option value="DATE">Specific Date</option>
              <option value="WEEK">Weekly (Past 7 Days)</option>
              <option value="MONTH">Monthly</option>
              <option value="YEAR">Yearly</option>
            </select>
            <label id="pos-income-date-filter" class="hidden text-xs text-slate-400 font-semibold">Select date
              <input type="date" id="pos-income-date" onchange="updatePosIncomeDateFilter()" class="ml-1 px-3 py-2 rounded-lg text-sm">
            </label>
            <label id="pos-income-month-filter" class="hidden text-xs text-slate-400 font-semibold">Select month
              <input type="month" id="pos-income-month" onchange="updatePosIncomeDateFilter()" class="ml-1 px-3 py-2 rounded-lg text-sm">
            </label>
            <label id="pos-income-year-filter" class="hidden text-xs text-slate-400 font-semibold">Select year
              <input type="number" id="pos-income-year" min="2000" max="9999" step="1" onchange="updatePosIncomeDateFilter()" class="ml-1 w-24 px-3 py-2 rounded-lg text-sm">
            </label>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div class="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Cash Income</span>
            <strong id="pos-income-cash" class="text-lg font-black text-emerald-400">Rs. 0</strong>
          </div>
          <div class="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Extra Cash Kept</span>
            <strong id="pos-income-extra-cash" class="text-lg font-black text-emerald-400">Rs. 0</strong>
          </div>
          <div class="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Card / QR / Transfer Income</span>
            <strong id="pos-income-card" class="text-lg font-black text-sky-400">Rs. 0</strong>
          </div>
          <div class="rounded-xl border border-yellow-500/30 bg-slate-950/70 p-3">
            <span id="pos-income-period-label" class="text-[10px] uppercase font-bold text-yellow-400 block">Current Day — Total Collected</span>
            <strong id="pos-income-total" class="text-lg font-black text-white">Rs. 0</strong>
          </div>
        </div>
        <section class="no-print rounded-xl border border-yellow-500/30 bg-slate-900/70 p-4 space-y-4" aria-labelledby="cashier-summary-title">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h4 id="cashier-summary-title" class="font-bold text-sm text-white">Cash in Cashier <span class="text-yellow-400" id="cashier-date-label"></span></h4>
              <p class="text-xs text-slate-400">Opening cash + cash sales and extra cash kept − recorded withdrawals. Daily records are kept for history.</p>
            </div>
            <label class="text-xs font-semibold text-slate-400">View cashier history by date
              <input id="cashier-view-date" type="date" onchange="selectCashierDate()" class="mt-1 block rounded-lg px-3 py-2 text-sm text-white">
            </label>
            <div class="rounded-xl border border-yellow-500/30 bg-slate-950/70 px-4 py-2">
              <span id="cashier-balance-label" class="block text-[10px] uppercase font-bold text-yellow-400">Expected Cash in Cashier</span>
              <strong id="cashier-current-balance" class="text-xl font-black text-white">Rs. 0</strong>
            </div>
          </div>
          <div id="cashier-previous-close-panel" class="hidden rounded-lg border border-sky-500/30 bg-sky-950/30 p-3 text-xs text-sky-200">
            <strong>Previous day closing amount — <span id="cashier-previous-date"></span>:</strong>
            <span id="cashier-previous-close"></span>. Count the cash and confirm today’s opening balance. If it differs, provide a reason.
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span class="block text-[10px] uppercase font-bold text-slate-400">Opening Cash</span><strong id="cashier-opening-balance" class="text-sm text-white">Not entered</strong></div>
            <div class="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span class="block text-[10px] uppercase font-bold text-slate-400">Cash Sales</span><strong id="cashier-cash-sales" class="text-sm text-emerald-400">Rs. 0</strong></div>
            <div class="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span class="block text-[10px] uppercase font-bold text-slate-400">Extra Cash Kept</span><strong id="cashier-extra-cash-kept" class="text-sm text-emerald-400">Rs. 0</strong></div>
            <div class="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span class="block text-[10px] uppercase font-bold text-slate-400">Cash Withdrawn</span><strong id="cashier-withdrawals" class="text-sm text-red-400">Rs. 0</strong></div>
          </div>
          <form id="cashier-opening-form" class="hidden grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-end" onsubmit="event.preventDefault(); setDailyCashOpening()">
            <label class="text-xs text-slate-400 font-semibold"><span id="cashier-opening-label-text">Counted opening cash (Rs.)</span>
              <input id="cashier-opening-amount" type="number" min="0" step="0.01" required oninput="updateCashierOpeningReason()" class="mt-1 w-full px-3 py-2 rounded-lg text-sm" placeholder="Counted amount">
            </label>
            <button id="cashier-opening-button" type="submit" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wide">Confirm Opening Cash</button>
            <label id="cashier-opening-reason-container" class="hidden sm:col-span-2 text-xs text-amber-300 font-semibold">Reason for difference
              <input id="cashier-opening-reason" type="text" maxlength="500" class="mt-1 w-full px-3 py-2 rounded-lg text-sm text-white" placeholder="Explain why the counted cash differs">
            </label>
          </form>
          <p id="cashier-admin-required" class="hidden text-xs text-amber-300">A cashier or admin must count and confirm today’s opening cash.</p>
          <p id="cashier-opening-note" class="hidden text-xs text-emerald-300">Today’s opening cash is confirmed. Cash withdrawals can now be recorded.</p>
          <p id="cashier-history-note" class="hidden text-xs text-sky-300">Historical view — cashier records are read-only.</p>
          <form id="cashier-withdrawal-form" class="hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 items-end" onsubmit="event.preventDefault(); recordCashWithdrawal()">
            <label class="text-xs text-slate-400 font-semibold">Amount taken (Rs.)
              <input id="cashier-withdrawal-amount" type="number" min="0.01" step="0.01" required class="mt-1 w-full px-3 py-2 rounded-lg text-sm" placeholder="Withdrawal amount">
            </label>
            <label class="text-xs text-slate-400 font-semibold">Taken by
              <input id="cashier-taken-by" type="text" required class="mt-1 w-full px-3 py-2 rounded-lg text-sm" placeholder="Owner / manager name">
            </label>
            <label class="text-xs text-slate-400 font-semibold">Reason / note
              <input id="cashier-withdrawal-note" type="text" class="mt-1 w-full px-3 py-2 rounded-lg text-sm" placeholder="Optional">
            </label>
            <button id="cashier-withdrawal-button" type="submit" class="bg-red-500 hover:bg-red-400 text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wide"><i class="fa-solid fa-minus mr-1"></i> Record Cash Taken</button>
          </form>
          <form id="cashier-extra-cash-form" class="hidden grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end" onsubmit="event.preventDefault(); recordCashierExtraCash()">
            <label class="text-xs text-slate-400 font-semibold">Extra cash amount (Rs.)
              <input id="cashier-extra-cash-amount" type="number" min="0.01" step="0.01" required class="mt-1 w-full px-3 py-2 rounded-lg text-sm" placeholder="Amount">
            </label>
            <label class="text-xs text-slate-400 font-semibold">Reason / source
              <input id="cashier-extra-cash-note" type="text" maxlength="500" required class="mt-1 w-full px-3 py-2 rounded-lg text-sm" placeholder="For example: unrecorded sale or extra cash kept">
            </label>
            <button type="submit" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wide"><i class="fa-solid fa-plus mr-1"></i> Record Extra Cash</button>
          </form>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead><tr class="border-b border-slate-700 text-slate-400 uppercase"><th class="py-2 px-3">Time</th><th class="py-2 px-3">Entry</th><th class="py-2 px-3">Taken by</th><th class="py-2 px-3">Recorded by</th><th class="py-2 px-3 text-right">Amount</th><th class="py-2 px-3">Note</th><th class="py-2 px-3 text-right">Actions</th></tr></thead>
              <tbody id="cashier-entry-tbody" class="divide-y divide-slate-800"></tbody>
            </table>
          </div>
        </section>
        <div class="flex justify-end no-print">
          <button onclick="openPosPrintOptions()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wide">
            <i class="fa-solid fa-print mr-1"></i> Print Income Summary
          </button>
        </div>
        <div class="overflow-x-auto">
        <h3 id="pos-history-heading" class="font-bold text-sm text-white mb-3">Current Day — Completed POS Transactions</h3>
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
              <th class="py-2.5 px-3">Receipt ID & Time</th><th class="py-2.5 px-3">Customer</th><th class="py-2.5 px-3">Items Sold</th><th class="py-2.5 px-3">Meat Weight</th><th class="py-2.5 px-3">Payment</th><th class="py-2.5 px-3 text-right">Net Total</th><th class="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="pos-history-tbody" class="divide-y divide-slate-800"></tbody>
        </table>
        </div>
      </div>
      <div id="pos-summary-print-area" class="pos-summary-print-area"></div>
      <div id="cashier-extra-cash-edit-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/80 p-4">
        <form class="w-full max-w-md space-y-4 rounded-2xl border border-yellow-500/40 bg-slate-900 p-5 shadow-2xl" onsubmit="event.preventDefault(); saveCashierExtraCashEdit()">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-lg font-black text-white">Edit Extra Cash Entry</h3>
            <button type="button" onclick="closeCashierExtraCashEdit()" class="text-slate-400 hover:text-white" aria-label="Close extra cash editor"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <label class="block text-xs font-semibold text-slate-400">Extra cash amount (Rs.)
            <input id="cashier-extra-cash-edit-amount" type="number" min="0.01" step="0.01" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm">
          </label>
          <label class="block text-xs font-semibold text-slate-400">Reason / source
            <input id="cashier-extra-cash-edit-note" type="text" maxlength="500" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm">
          </label>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeCashierExtraCashEdit()" class="rounded-lg bg-slate-700 px-4 py-2 text-xs font-bold text-white">Cancel</button>
            <button id="cashier-extra-cash-edit-save" type="submit" class="rounded-lg bg-yellow-400 px-4 py-2 text-xs font-black text-slate-950">Save Changes</button>
          </div>
        </form>
      </div>
      <div id="pos-sale-edit-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/80 p-4">
        <form id="pos-sale-edit-form" onsubmit="event.preventDefault(); savePosSaleEdit()" class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-yellow-500/40 bg-slate-900 p-5 shadow-2xl space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div><h3 class="text-lg font-black text-white">Edit POS Sale</h3><p class="mt-1 text-xs text-slate-400">Edit sale details, cash received, change, and extra cash kept. Changes update stock, credit records, customer totals, and the daily archive.</p></div>
            <button type="button" onclick="closePosSaleEdit()" class="text-slate-400 hover:text-white" aria-label="Close sale editor"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label class="text-xs font-semibold text-slate-400">Receipt ID<input id="pos-edit-id" readonly class="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-400"></label>
            <label class="text-xs font-semibold text-slate-400">Date<input id="pos-edit-date" type="date" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label class="text-xs font-semibold text-slate-400">Time<input id="pos-edit-time" type="text" required placeholder="HH:MM" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label class="text-xs font-semibold text-slate-400">Payment method<select id="pos-edit-payment" required onchange="updatePosSaleEditPayment()" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"><option value="CASH">Cash</option><option value="CARD">Card / POS Machine</option><option value="QR / TRANSFER">LankaQR / Bank Transfer</option><option value="CREDIT">Hotel / Regular Credit</option></select></label>
            <label class="text-xs font-semibold text-slate-400">Customer<input id="pos-edit-customer" type="text" required maxlength="160" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label class="text-xs font-semibold text-slate-400">Customer phone<input id="pos-edit-phone" type="text" maxlength="40" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label class="text-xs font-semibold text-slate-400">Subtotal (Rs.)<input id="pos-edit-subtotal" type="number" min="0" step="0.01" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label class="text-xs font-semibold text-slate-400">Discount (Rs.)<input id="pos-edit-discount" type="number" min="0" step="0.01" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label class="text-xs font-semibold text-slate-400">Sale total (Rs.)<input id="pos-edit-total" type="number" min="0" step="0.01" required oninput="updatePosSaleEditCashTotals('total')" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label class="text-xs font-semibold text-slate-400">Cash received (Rs.)<input id="pos-edit-cash-received" type="number" min="0" step="0.01" oninput="updatePosSaleEditCashTotals('received')" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label class="text-xs font-semibold text-slate-400">Change (Rs.)<input id="pos-edit-change" type="number" min="0" step="0.01" oninput="updatePosSaleEditCashTotals('change')" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label id="pos-edit-extra-cash-fields" class="text-xs font-semibold text-slate-400">Extra cash kept (Rs.)<input id="pos-edit-extra-cash-kept" type="number" min="0" step="0.01" oninput="updatePosSaleEditCashTotals('extra')" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label id="pos-edit-extra-cash-reason-field" class="text-xs font-semibold text-slate-400">Reason for extra cash<input id="pos-edit-extra-cash-reason" type="text" maxlength="500" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
            <label class="flex items-center gap-2 self-end rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300"><input id="pos-edit-delivery" type="checkbox" class="accent-yellow-400"> Delivery sale</label>
            <label class="text-xs font-semibold text-slate-400">Delivery fee (Rs.)<input id="pos-edit-delivery-fee" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg px-3 py-2 text-sm"></label>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2"><h4 class="text-sm font-bold text-white">Items sold</h4><button type="button" onclick="addPosSaleEditItem()" class="rounded-lg bg-slate-700 px-3 py-2 text-xs font-bold text-white hover:bg-slate-600"><i class="fa-solid fa-plus mr-1"></i>Add item</button></div>
            <div class="overflow-x-auto">
              <table class="w-full min-w-[700px] text-left text-xs">
                <thead><tr class="border-b border-slate-700 text-slate-400"><th class="p-2">Product</th><th class="p-2">Quantity</th><th class="p-2">Unit price</th><th class="p-2">Line total</th><th class="p-2">Free</th><th class="p-2"></th></tr></thead>
                <tbody id="pos-edit-items" class="divide-y divide-slate-800"></tbody>
              </table>
            </div>
          </div>
          <div class="flex flex-wrap justify-end gap-2 border-t border-slate-800 pt-4">
            <button type="button" onclick="closePosSaleEdit()" class="rounded-lg bg-slate-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-600">Cancel</button>
            <button id="pos-edit-save-button" type="submit" class="rounded-lg bg-yellow-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-yellow-300"><i class="fa-solid fa-check mr-1"></i>Save Sale Changes</button>
          </div>
        </form>
      </div>
      <div id="pos-print-options-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center bg-black/80 p-4">
        <div class="w-full max-w-md space-y-4 rounded-2xl border border-yellow-500/40 bg-slate-900 p-6 shadow-2xl">
          <div class="flex items-start justify-between gap-3">
            <div><h3 class="text-lg font-black text-white">Choose a print view</h3><p class="mt-1 text-xs text-slate-400">Select a customer/product summary or the full transaction detail.</p></div>
            <button type="button" onclick="closePosPrintOptions()" class="text-slate-400 hover:text-white" aria-label="Close print options"><i class="fa-solid fa-xmark"></i></button>
          </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onclick="printPosSummary()" class="rounded-xl bg-yellow-400 p-4 text-left font-black text-slate-950 hover:bg-yellow-300"><i class="fa-solid fa-chart-pie mr-2"></i>Summary view<span class="mt-1 block text-xs font-medium">Walk-in, loyalty, totals & products</span></button>
            <button type="button" onclick="printPosDetailed()" class="rounded-xl bg-slate-800 p-4 text-left font-black text-white hover:bg-slate-700"><i class="fa-solid fa-list mr-2"></i>Detailed view<span class="mt-1 block text-xs font-medium text-slate-300">Full transaction list and items</span></button>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 5: ATTENDANCE -->
    <section id="tab-attendance" class="space-y-6 hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span class="px-2.5 py-0.5 text-xs font-extrabold uppercase bg-yellow-400 text-slate-950 rounded-full">Wall QR & Kiosk Attendance</span>
          <h2 class="text-2xl font-black mt-1">Staff Sign-In / Sign-Out & Wall QR System</h2>
          <p class="text-slate-400 text-sm">Print the Wall QR Poster and stick it in the shop. Staff simply scan the QR on their phone to clock in and out.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="openWallQrModal()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-yellow-400/20 flex items-center gap-2"><i class="fa-solid fa-print"></i> Print Wall QR Poster</button>
          <button onclick="openMobileQrPortal()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2"><i class="fa-solid fa-mobile-screen-button"></i> Open Mobile QR Scanner</button>
        </div>
      </div>
      <div class="card-highlight p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-start sm:items-center gap-4">
          <div onclick="openWallQrModal()" class="cursor-pointer bg-white p-2.5 rounded-xl shrink-0 border-2 border-yellow-400 shadow-md"><i class="fa-solid fa-qrcode text-4xl text-slate-950"></i></div>
          <div>
            <h3 class="font-extrabold text-sm sm:text-base text-yellow-400">How the Shop Wall QR Mobile Sign-In / Sign-Out Works</h3>
            <p class="text-xs text-slate-300 mt-1">1. Click <strong>"Print Wall QR Poster"</strong> and fix it on the Raihan Farm Shop wall. &bull; 2. Staff scan the QR with their phone camera (opens the <strong>Mobile Check-In Portal</strong> via <code>?qr=wall-checkin</code>). &bull; 3. Staff pick their name, enter their 4-digit PIN, and tap once to <strong>Sign In</strong> or <strong>Sign Out</strong>. The PIN is verified by the server.</p>
          </div>
        </div>
        <div class="bg-slate-950/90 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs shrink-0">
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Standard Shift Rule</span>
          <strong class="text-white">10.0 Hours</strong> <span class="text-yellow-400">(Extra = OT)</span>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="kiosk-cards"></div>
      <div class="card p-5 space-y-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 class="font-bold text-lg flex items-center gap-2"><i class="fa-solid fa-user-check text-yellow-400"></i> Attendance History (Staff Filter)</h3>
            <p class="text-xs text-slate-400">Inspect individual shift records, sign-in/out timestamps, and overtime hours.</p>
          </div>
          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <label class="text-xs text-slate-400 font-semibold">Filter Staff:</label>
            <select id="filter-staff-logs" onchange="renderAttendanceLogs()" class="px-3.5 py-2 rounded-xl text-sm font-semibold min-w-[200px]"><option value="ALL">All Staff</option></select>
            <button onclick="toggleManualLogForm()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-extrabold transition"><i class="fa-solid fa-plus mr-1"></i> Log Manual Shift</button>
          </div>
        </div>
        <div id="manual-log-form" class="hidden bg-slate-900 p-4 rounded-xl border border-yellow-500/30 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-yellow-400">Add Manual Shift / Overtime Record</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <select id="man-staff" class="px-3 py-2 rounded-lg text-sm"></select>
            <input type="date" id="man-date" class="px-3 py-2 rounded-lg text-sm">
            <input type="text" id="man-in" placeholder="Sign-in time" class="px-3 py-2 rounded-lg text-sm">
            <input type="text" id="man-out" placeholder="Sign-out time" class="px-3 py-2 rounded-lg text-sm">
            <input type="number" step="0.5" id="man-hours" placeholder="Total hours" class="px-3 py-2 rounded-lg text-sm">
            <button onclick="saveManualAttendance()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg px-4 py-2 text-sm transition">Save Shift</button>
          </div>
        </div>
        <div id="filtered-staff-banner" class="hidden bg-slate-900/90 border border-yellow-500/30 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4"></div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
                <th class="py-3 px-4">Date</th><th class="py-3 px-4">Staff</th><th class="py-3 px-4">Designation</th><th class="py-3 px-4">Sign In</th><th class="py-3 px-4">Sign Out</th><th class="py-3 px-4">Total Hours</th><th class="py-3 px-4">Overtime (Hrs)</th><th class="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody id="attendance-log-tbody" class="divide-y divide-slate-800/80"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TAB 6: PAYROLL -->
    <section id="tab-payroll" class="space-y-6 hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-2xl font-black">Month-End Salary, Allowances & Advances</h2>
          <p class="text-slate-400 text-sm">Auto-calculates shifts worked, overtime hours, allowances (food, fuel, slaughter bonus), and deducts cash advances.</p>
        </div>
        <button onclick="openAddStaffModal()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold transition shadow-lg shadow-yellow-400/20"><i class="fa-solid fa-user-plus mr-1.5"></i> Add New Staff Member</button>
      </div>
      <div id="archived-staff-reports" class="hidden card p-5 space-y-3">
        <div>
          <h3 class="font-bold text-base text-yellow-400">Archived Staff & Preserved Reports</h3>
          <p class="text-xs text-slate-400 mt-1">Archived staff can no longer sign in or clock attendance. Their past attendance and payroll records remain available here and in Attendance History.</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead><tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
              <th class="py-3 px-3">Staff</th><th class="py-3 px-3">Archived</th><th class="py-3 px-3">Shifts</th><th class="py-3 px-3">Total Hours</th><th class="py-3 px-3">Overtime</th><th class="py-3 px-3">Historical Payroll</th><th class="py-3 px-3">Access</th>
            </tr></thead>
            <tbody id="archived-staff-tbody" class="divide-y divide-slate-800"></tbody>
          </table>
        </div>
      </div>
      <div id="add-staff-modal" class="card-highlight p-5 hidden space-y-3">
        <div class="flex justify-between items-center">
          <h4 class="font-bold text-sm uppercase text-yellow-400"><i class="fa-solid fa-id-badge mr-1"></i> Register New Raihan Farm Shop Staff Member</h4>
          <button onclick="openAddStaffModal()" class="text-xs text-slate-400 hover:text-white">Close</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input type="text" id="new-staff-name" placeholder="Full Name" autocomplete="name" class="px-3 py-2 rounded-lg text-sm">
          <select id="new-staff-role" class="px-3 py-2 rounded-lg text-sm">
            <option value="Slaughter & Dressing Lead">Slaughter & Dressing Lead</option>
            <option value="Head Butcher">Head Butcher</option>
            <option value="POS Cashier & Packer">POS Cashier & Packer</option>
            <option value="Delivery Rider">Delivery Rider</option>
            <option value="Farm Transport Driver">Farm Transport Driver</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
          </select>
          <input type="tel" id="new-staff-phone" placeholder="Phone number (staff login)" autocomplete="tel" class="px-3 py-2 rounded-lg text-sm">
          <input type="password" id="new-staff-password" placeholder="Staff password (8+ characters)" minlength="8" autocomplete="new-password" class="px-3 py-2 rounded-lg text-sm">
          <input type="number" id="new-staff-base" placeholder="Monthly Base (Rs.)" class="px-3 py-2 rounded-lg text-sm">
          <input type="number" id="new-staff-otrate" placeholder="OT Rate/Hr (Rs.)" class="px-3 py-2 rounded-lg text-sm">
          <input type="number" id="new-staff-allowance" placeholder="Allowances (Rs.)" class="px-3 py-2 rounded-lg text-sm">
          <button onclick="saveNewStaff()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-lg px-4 py-2 text-sm font-black transition">Create Staff Account</button>
        </div>
      </div>
      <div class="card p-5 overflow-x-auto">
        <div class="mb-5 rounded-xl border border-slate-700 bg-slate-900/70 p-4 space-y-3">
          <div>
            <h3 class="font-bold text-sm text-yellow-400">Set Up Login for Existing Staff</h3>
            <p class="mt-1 text-xs text-slate-400">Give an existing staff member a phone number and password so they can update their own name, phone, and password.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select id="existing-staff-account-select" class="px-3 py-2 rounded-lg text-sm"></select>
            <input type="tel" id="existing-staff-account-phone" placeholder="Phone number (staff login)" autocomplete="tel" class="px-3 py-2 rounded-lg text-sm">
            <input type="password" id="existing-staff-account-password" placeholder="Temporary password (8+ characters)" minlength="8" autocomplete="new-password" class="px-3 py-2 rounded-lg text-sm">
            <button onclick="createExistingStaffAccount()" class="bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-4 py-2 text-sm font-bold transition">Create Staff Login</button>
          </div>
        </div>
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
              <th class="py-3 px-3">Staff & Role</th><th class="py-3 px-3">Shifts</th><th class="py-3 px-3">Base Salary</th><th class="py-3 px-3">OT Hours</th><th class="py-3 px-3">OT Pay</th><th class="py-3 px-3">Allowances (Rs.)</th><th class="py-3 px-3">Advances (Rs.)</th><th class="py-3 px-3 text-right">Net Month-End Salary</th><th class="py-3 px-3 text-center">Payslip</th><th class="py-3 px-3 text-center">Staff Access</th>
            </tr>
          </thead>
          <tbody id="payroll-tbody" class="divide-y divide-slate-800"></tbody>
        </table>
      </div>
    </section>

    <!-- TAB 7: DELIVERIES -->
    <section id="tab-deliveries" class="space-y-6 hidden">
      <div class="border-b border-slate-800 pb-4">
        <h2 class="text-2xl font-black">Delivery Dispatch & Weekly Subscriptions</h2>
        <p class="text-slate-400 text-sm">Schedule deliveries for today or any future date, manage weekly recurring subscribers, and send 1-click WhatsApp customer updates.</p>
      </div>
      <div class="card-highlight p-5">
        <h3 class="font-bold text-xs uppercase tracking-wider text-yellow-400 mb-3 flex items-center gap-2"><i class="fa-solid fa-truck-fast"></i> Schedule a Delivery</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          <input type="text" id="del-customer" placeholder="Customer / Hotel Name" class="px-3 py-2 rounded-lg text-sm">
          <input type="text" id="del-phone" placeholder="WhatsApp phone (optional)" class="px-3 py-2 rounded-lg text-sm">
          <input type="text" id="del-area" placeholder="Delivery Route / Address" class="px-3 py-2 rounded-lg text-sm">
          <input type="text" id="del-items" placeholder="Order details" class="px-3 py-2 rounded-lg text-sm">
          <input type="date" id="del-date" aria-label="Delivery date" required class="px-3 py-2 rounded-lg text-sm">
          <select id="del-slot" class="px-3 py-2 rounded-lg text-sm">
            <option value="Morning (07:00 AM - 10:00 AM)">Morning (7 AM - 10 AM)</option>
            <option value="Midday (11:00 AM - 02:00 PM)">Midday (11 AM - 2 PM)</option>
            <option value="Evening (04:00 PM - 07:00 PM)">Evening (4 PM - 7 PM)</option>
          </select>
          <button onclick="addDelivery()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-lg px-4 py-2 text-xs uppercase tracking-wider transition">+ Schedule Delivery</button>
        </div>
      </div>
      <div class="card p-5 overflow-x-auto">
        <h3 class="font-bold text-base text-white mb-3">Delivery Dispatch Board</h3>
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
              <th class="py-3 px-3">Date & Slot</th><th class="py-3 px-3">Customer</th><th class="py-3 px-3">Area / Route</th><th class="py-3 px-3">Meat Order Details</th><th class="py-3 px-3">Assigned Rider</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-right">Customer Alert</th>
            </tr>
          </thead>
          <tbody id="deliveries-tbody" class="divide-y divide-slate-800"></tbody>
        </table>
      </div>
      <div class="card p-5 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="font-bold text-base text-yellow-400 flex items-center gap-2"><i class="fa-solid fa-calendar-check"></i> Weekly Recurring Meat Box Subscriptions</h3>
          <p class="text-xs text-slate-400">Choose a dispatch date, then push any weekly subscriber directly into the delivery dispatch queue.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          <input type="text" id="sub-customer" placeholder="Subscriber Name" class="px-3 py-2 rounded-lg text-sm">
          <input type="text" id="sub-phone" placeholder="Phone Number" class="px-3 py-2 rounded-lg text-sm">
          <input type="text" id="sub-area" placeholder="Delivery Address" class="px-3 py-2 rounded-lg text-sm">
          <input type="text" id="sub-pack" placeholder="Weekly pack details" class="px-3 py-2 rounded-lg text-sm">
          <select id="sub-day" class="px-3 py-2 rounded-lg text-sm">
            <option value="Every Friday">Every Friday</option>
            <option value="Every Saturday">Every Saturday</option>
            <option value="Every Sunday">Every Sunday</option>
            <option value="Every Wednesday">Every Wednesday</option>
          </select>
          <input type="date" id="sub-push-date" aria-label="Subscription dispatch date" required class="px-3 py-2 rounded-lg text-sm">
          <div class="flex gap-2">
            <input type="number" id="sub-price" placeholder="Monthly Rs." class="w-full px-3 py-2 rounded-lg text-sm">
            <button onclick="addSubscription()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-lg px-4 py-2 text-xs shrink-0 transition">+ Add Sub</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-700 text-slate-400 text-xs uppercase">
                <th class="py-3 px-3">Subscriber</th><th class="py-3 px-3">Area</th><th class="py-3 px-3">Weekly Meat Box</th><th class="py-3 px-3">Delivery Day</th><th class="py-3 px-3">Monthly Rate</th><th class="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody id="subs-tbody" class="divide-y divide-slate-800"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TAB 8: CHART OF ACCOUNTS -->
    <section id="tab-coa" class="space-y-6 hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span class="px-2.5 py-0.5 text-xs font-extrabold uppercase bg-yellow-400 text-slate-950 rounded-full">Chart of Accounts</span>
          <h2 class="text-2xl font-black mt-1">Financial Ledger & Expense Tracking</h2>
          <p class="text-slate-400 text-sm">Post voucher entries and track farm, wages, utilities and operating expenses against account codes.</p>
        </div>
        <button onclick="openExpenseModal()" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-yellow-400/20"><i class="fa-solid fa-plus mr-1"></i> Post Expense Voucher</button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="card p-6 space-y-4 lg:col-span-1">
          <h3 class="font-black text-base text-yellow-400 border-b border-slate-800 pb-2">Account Summary</h3>
          <div id="coa-summary-list" class="space-y-2 text-xs"></div>
        </div>
        <div class="card p-6 space-y-4 lg:col-span-2">
          <h3 class="font-black text-base text-white border-b border-slate-800 pb-2">General Ledger & Voucher Entries</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 uppercase">
                  <th class="py-2 px-3">Date</th>
                  <th class="py-2 px-3">Account Code & Name</th>
                  <th class="py-2 px-3">Description</th>
                  <th class="py-2 px-3 text-right">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody id="coa-ledger-tbody" class="divide-y divide-slate-800/60"></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>

  <div id="edit-staff-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] hidden flex items-center justify-center p-4">
    <div class="w-full max-w-xl space-y-4 rounded-2xl border border-yellow-500/40 bg-slate-900 p-6 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div><h3 class="font-black text-base text-white">Edit Staff & Payroll</h3><p class="mt-1 text-xs text-slate-400">Admin-only update to staff details and payroll settings.</p></div>
        <button type="button" onclick="closeEditStaffModal()" class="text-slate-400 hover:text-white" aria-label="Close edit staff modal"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label class="text-xs font-semibold text-slate-400">Full name<input id="edit-staff-name" type="text" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"></label>
        <label class="text-xs font-semibold text-slate-400">Role<input id="edit-staff-role" type="text" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"></label>
        <label class="text-xs font-semibold text-slate-400">Attendance PIN<input id="edit-staff-pin" type="text" inputmode="numeric" maxlength="4" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"></label>
        <label class="text-xs font-semibold text-slate-400">Base salary (Rs.)<input id="edit-staff-base-salary" type="number" min="0" step="1" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"></label>
        <label class="text-xs font-semibold text-slate-400">Overtime rate / hour (Rs.)<input id="edit-staff-ot-rate" type="number" min="0" step="1" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"></label>
        <label class="text-xs font-semibold text-slate-400">Allowance (Rs.)<input id="edit-staff-allowance" type="number" min="0" step="1" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"></label>
        <label class="text-xs font-semibold text-slate-400">Advance (Rs.)<input id="edit-staff-advance" type="number" min="0" step="1" required class="mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"></label>
      </div>
      <div class="flex justify-end gap-2 border-t border-slate-800 pt-3">
        <button type="button" onclick="closeEditStaffModal()" class="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600">Cancel</button>
        <button id="edit-staff-save" type="button" onclick="saveStaffDetails()" class="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-yellow-300">Save Changes</button>
      </div>
    </div>
  </div>

  <div id="expense-voucher-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 class="font-black text-base text-white">Post Expense Voucher</h3>
          <p class="text-xs text-slate-400">Record new farm purchases, utilities, wages or operating costs.</p>
        </div>

        <button onclick="document.getElementById('expense-voucher-modal').classList.add('hidden')" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label class="block font-bold text-slate-400 mb-1">Date</label>
          <input type="date" id="expense-date" class="w-full px-3 py-2.5 rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-400 mb-1">Account</label>
          <select id="expense-account" class="w-full px-3 py-2.5 rounded-xl font-bold"></select>
        </div>
        <div class="sm:col-span-2">
          <label class="block font-bold text-slate-400 mb-1">Description</label>
          <input type="text" id="expense-description" placeholder="e.g. Feed purchase / utility bill / staff overtime" class="w-full px-3 py-2.5 rounded-xl font-bold">
        </div>
        <div class="sm:col-span-2">
          <label class="block font-bold text-slate-400 mb-1">Amount (Rs.)</label>
          <input type="number" id="expense-amount" min="0" step="0.01" placeholder="0.00" class="w-full px-3 py-2.5 rounded-xl font-bold">
        </div>
      </div>
      <div class="flex gap-2 pt-2">
        <button onclick="saveExpenseVoucher()" class="flex-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider">Save Voucher</button>
        <button onclick="document.getElementById('expense-voucher-modal').classList.add('hidden')" class="px-4 bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs uppercase">Cancel</button>
      </div>
    </div>
  </div>

  <div id="slaughter-edit-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div><h3 class="font-black text-base text-white">Edit Farm / Slaughter Record</h3><p class="text-xs text-slate-400">Admin-only update to an existing batch.</p></div>
        <button onclick="closeSlaughterEdit()" class="text-slate-400 hover:text-white" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <input type="hidden" id="edit-batch-id">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label class="block text-xs text-slate-400 mb-1">Date</label><input type="datetime-local" id="edit-batch-date" class="w-full px-3 py-2 rounded-lg text-sm"></div>
        <div><label class="block text-xs text-slate-400 mb-1">Farm / Supplier Source</label><input type="text" id="edit-batch-source" class="w-full px-3 py-2 rounded-lg text-sm"></div>
        <div><label class="block text-xs text-slate-400 mb-1">Intake Animal Type</label><select id="edit-batch-animal-type" class="w-full px-3 py-2 rounded-lg text-sm"><option value="Broiler">Broiler</option><option value="Layer">Layer</option><option value="Parents">Parents</option></select></div>
        <div><label class="block text-xs text-slate-400 mb-1">Animal Count (whole number)</label><input type="number" min="1" step="1" id="edit-batch-count" class="w-full px-3 py-2 rounded-lg text-sm"></div>
        <div><label class="block text-xs text-slate-400 mb-1">Live Weight (kg)</label><input type="number" min="0.01" step="0.01" id="edit-batch-live" class="w-full px-3 py-2 rounded-lg text-sm"></div>
        <div><label class="block text-xs text-red-300 mb-1">Dead Animals Before Slaughter</label><input type="number" min="0" step="1" id="edit-batch-dead-count" class="w-full px-3 py-2 rounded-lg text-sm"></div>
        <div><label class="block text-xs text-slate-400 mb-1">Slaughter Animal Type</label><select id="edit-batch-slaughter-animal-type" class="w-full px-3 py-2 rounded-lg text-sm"><option value="Broiler">Broiler</option><option value="Layer">Layer</option><option value="Parents">Parents</option></select></div>
        <div><label class="block text-xs text-slate-400 mb-1">Slaughtered Animal Count</label><input type="number" min="1" step="1" id="edit-batch-slaughter-count" class="w-full px-3 py-2 rounded-lg text-sm"></div>
      </div>
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-sm font-bold text-emerald-400">Dressed Items</h4>
          <button type="button" onclick="addSlaughterOutputRow('edit-slaughter-output-rows')" class="rounded-lg border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/10"><i class="fa-solid fa-plus mr-1"></i> Add Item</button>
        </div>
        <div id="edit-slaughter-output-rows" class="space-y-2"></div>
      </div>
      <div class="flex gap-2 pt-1">
        <button onclick="saveSlaughterEdit()" class="flex-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider">Save Changes</button>
        <button onclick="closeSlaughterEdit()" class="px-4 bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs uppercase">Cancel</button>
      </div>
    </div>
  </div>

</body>
</html>
`,Lr="raihan_farm_token",Da="".replace(/\/$/,""),jd=()=>{const E=new Date;return`${E.getFullYear()}-${String(E.getMonth()+1).padStart(2,"0")}-${String(E.getDate()).padStart(2,"0")}`},Se=(E,F=2)=>Number(E||0).toLocaleString(void 0,{minimumFractionDigits:F,maximumFractionDigits:F}),Md={BATCH_STARTED:"Batch started / animals received",FEED_PURCHASE:"Feed purchased",FEED_USE:"Feed used",TRANSPORT:"Transport",MORTALITY:"Mortality",DELIVERY:"Live delivery to Raihan Chicken Shop",WEIGHT_CHECK:"Weight check"};async function Xt(E,{method:F="GET",body:h,token:fe}={}){let O;try{O=await fetch(`${Da}/api${E}`,{method:F,headers:{"Content-Type":"application/json",...fe?{Authorization:`Bearer ${fe}`}:{}},body:h?JSON.stringify(h):void 0})}catch{throw new Error(`Cannot reach the server at ${Da||window.location.origin}.`)}const U=await O.json().catch(()=>({}));if(O.status===404){const ne=Da||window.location.origin;throw Object.assign(new Error(`The API endpoint was not found at ${ne}. Confirm the existing Vercel project uses the repository root and redeploy the combined frontend/API.`),{status:404})}if(!O.ok)throw Object.assign(new Error(U.error||`Request failed (${O.status}).`),{status:O.status});return U}function oe({label:E,children:F,className:h=""}){return c.createElement("label",{className:`block text-sm font-semibold text-slate-300 ${h}`},c.createElement("span",{className:"mb-1.5 block"},E),F)}function ye({type:E="text",...F}){return c.createElement("input",{type:E,...F,className:`w-full rounded-xl px-3 py-2.5 text-sm ${F.className||""}`})}function Ir(E){return c.createElement("select",{...E,className:`w-full rounded-xl px-3 py-2.5 text-sm ${E.className||""}`})}function Hc(){const[E,F]=be.useState(()=>localStorage.getItem(Lr)||""),[h,fe]=be.useState({username:"farm",password:""}),[O,U]=be.useState(""),[ne,Z]=be.useState(""),[me,G]=be.useState(""),[Ee,J]=be.useState({animalTypes:[],batches:[]}),[ue,Ue]=be.useState(!!E),[Ce,H]=be.useState(!1),[L,ve]=be.useState({animalTypeId:"",newAnimalType:"",source:"OWN_RAISED",supplier:"",purchaseAmountRs:"",startDate:jd(),initialCount:"",initialLiveWeightKg:""}),[N,X]=be.useState({batchId:"",type:"FEED_PURCHASE",date:jd(),quantityKg:"",amountRs:"",supplier:"",count:"",weightKg:"",note:""}),[ce,Fe]=be.useState({currentPassword:"",newPassword:""}),Pe=be.useMemo(()=>Ee.batches.filter(f=>f.currentCount>0),[Ee.batches]),Te=be.useMemo(()=>Ee.batches.flatMap(f=>(f.events||[]).map(C=>({...C,batchId:f.batchId,animalType:f.animalType}))).sort((f,C)=>`${C.date}-${C.createdAt}`.localeCompare(`${f.date}-${f.createdAt}`)),[Ee.batches]),Ae=be.useMemo(()=>Ee.batches.reduce((f,C)=>({animals:f.animals+Number(C.currentCount||0),liveWeight:f.liveWeight+Number(C.currentLiveWeightKg||0),feedBalance:f.feedBalance+Number(C.feedBalanceKg||0),delivered:f.delivered+Number(C.deliveredCount||0)}),{animals:0,liveWeight:0,feedBalance:0,delivered:0}),[Ee.batches]);async function vt(f=E){const C=await Xt("/farm",{token:f});J(C),X(b=>{var R;return{...b,batchId:C.batches.some(S=>S.batchId===b.batchId&&S.currentCount>0)?b.batchId:((R=C.batches.find(S=>S.currentCount>0))==null?void 0:R.batchId)||""}})}be.useEffect(()=>{if(!E){Ue(!1);return}let f=!0;return Ue(!0),Promise.all([Xt("/auth/me",{token:E}),Xt("/farm",{token:E})]).then(([C,b])=>{if(f){if(C.role!=="farm")throw new Error("This login is not a farm account.");J(b),Z("")}}).catch(C=>{f&&(localStorage.removeItem(Lr),F(""),J({animalTypes:[],batches:[]}),U(C.message))}).finally(()=>{f&&Ue(!1)}),()=>{f=!1}},[E]);async function dt(f){var C;f.preventDefault(),U(""),H(!0);try{const b=await Xt("/auth/login",{method:"POST",body:h});if(((C=b.user)==null?void 0:C.role)!=="farm")throw new Error("Use the farm account to sign in here.");localStorage.setItem(Lr,b.token),Ue(!0),F(b.token)}catch(b){U(b.message)}finally{H(!1)}}async function St(f){f.preventDefault(),Z(""),G(""),H(!0);try{let C=L.animalTypeId;if(C==="__new__"){const R=await Xt("/farm/animal-types",{method:"POST",token:E,body:{name:L.newAnimalType}});C=R.animalType.id,J(S=>({...S,animalTypes:[...S.animalTypes,R.animalType].sort((u,v)=>u.name.localeCompare(v.name))})),ve(S=>({...S,animalTypeId:C,newAnimalType:""}))}const{batch:b}=await Xt("/farm/batches",{method:"POST",token:E,body:{animalTypeId:C,source:L.source,supplier:L.supplier,purchaseAmountRs:Number(L.purchaseAmountRs||0),startDate:L.startDate,initialCount:Number(L.initialCount),initialLiveWeightKg:Number(L.initialLiveWeightKg)}});J(R=>({...R,batches:[b,...R.batches]})),ve(R=>({...R,animalTypeId:C,newAnimalType:"",supplier:"",purchaseAmountRs:"",initialCount:"",initialLiveWeightKg:""})),G("Batch created.")}catch(C){Z(C.message)}finally{H(!1)}}async function tt(f){f.preventDefault(),Z(""),G(""),H(!0);const C={type:N.type,date:N.date,note:N.note};N.type==="FEED_PURCHASE"?(C.quantityKg=Number(N.quantityKg),C.amountRs=Number(N.amountRs),C.supplier=N.supplier):N.type==="FEED_USE"?C.quantityKg=Number(N.quantityKg):N.type==="TRANSPORT"?C.amountRs=Number(N.amountRs||0):N.type==="MORTALITY"?(C.count=Number(N.count),N.weightKg!==""&&(C.weightKg=Number(N.weightKg))):N.type==="DELIVERY"?(C.count=Number(N.count),C.weightKg=Number(N.weightKg),C.amountRs=Number(N.amountRs||0)):N.type==="WEIGHT_CHECK"&&(C.weightKg=Number(N.weightKg));try{const{batch:b}=await Xt(`/farm/batches/${encodeURIComponent(N.batchId)}/events`,{method:"POST",token:E,body:C});J(R=>({...R,batches:R.batches.map(S=>S.batchId===b.batchId?b:S)})),X(R=>{var S;return{...R,batchId:b.currentCount>0?b.batchId:((S=Ee.batches.find(u=>u.batchId!==b.batchId&&u.currentCount>0))==null?void 0:S.batchId)||""}}),X(R=>({...R,quantityKg:"",amountRs:"",supplier:"",count:"",weightKg:"",note:""})),G("Batch event recorded.")}catch(b){Z(b.message)}finally{H(!1)}}async function ze(f){f.preventDefault(),Z(""),G(""),H(!0);try{await Xt("/farm/password",{method:"PUT",token:E,body:ce}),Fe({currentPassword:"",newPassword:""}),G("Password changed successfully.")}catch(C){Z(C.message)}finally{H(!1)}}function Ye(){localStorage.removeItem(Lr),F(""),J({animalTypes:[],batches:[]}),Z(""),G(""),fe({username:"farm",password:""})}async function nt(){Z(""),G("");try{await vt(),G("Farm records refreshed.")}catch(f){Z(f.message)}}return E?ue?c.createElement("main",{className:"min-h-screen p-8 text-slate-300"},"Loading farm records…"):c.createElement("main",{className:"min-h-screen px-4 py-5 sm:px-7 lg:px-10"},c.createElement("div",{className:"mx-auto max-w-7xl space-y-6"},c.createElement("header",{className:"flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between"},c.createElement("div",null,c.createElement("p",{className:"text-xs font-black uppercase tracking-[0.2em] text-emerald-400"},"Raihan Farm · Live animals only"),c.createElement("h1",{className:"mt-1 text-2xl font-black text-white sm:text-3xl"},"Farm operations dashboard"),c.createElement("p",{className:"mt-1 max-w-3xl text-sm text-slate-400"},"Manage own-raised and purchased batches. Deliveries record live animals for Raihan Chicken Shop without changing shop records.")),c.createElement("div",{className:"flex flex-wrap gap-2"},c.createElement("a",{href:"#batches",className:"rounded-xl border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200 hover:border-emerald-400"},"Batches"),c.createElement("a",{href:"#activity",className:"rounded-xl border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200 hover:border-emerald-400"},"Activity"),c.createElement("button",{type:"button",onClick:nt,className:"rounded-xl border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200 hover:border-emerald-400"},"Refresh"),c.createElement("button",{type:"button",onClick:Ye,className:"rounded-xl bg-slate-800 px-3 py-2 text-sm font-bold text-slate-200 hover:bg-red-900"},"Sign out"))),ne&&c.createElement("p",{role:"alert",className:"rounded-xl border border-red-500/40 bg-red-950/50 p-3 text-sm text-red-200"},ne),me&&c.createElement("p",{role:"status",className:"rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-sm text-emerald-200"},me),c.createElement("section",{"aria-label":"Farm summary",className:"grid gap-3 sm:grid-cols-2 lg:grid-cols-4"},[["Live animals",`${Ae.animals.toLocaleString()} head`,"Across all active batches"],["Current live weight",`${Se(Ae.liveWeight)} kg`,"Recorded batch total"],["Feed balance",`${Se(Ae.feedBalance)} kg`,"Purchased less feed used"],["Delivered to shop",`${Ae.delivered.toLocaleString()} head`,"Live animals only"]].map(([f,C,b])=>c.createElement("article",{key:f,className:"card p-4"},c.createElement("p",{className:"text-xs font-bold uppercase tracking-wider text-slate-400"},f),c.createElement("p",{className:"mt-2 text-2xl font-black text-emerald-300"},C),c.createElement("p",{className:"mt-1 text-xs text-slate-500"},b)))),c.createElement("section",{id:"batches",className:"grid items-start gap-5 xl:grid-cols-[1.4fr_1fr]"},c.createElement("div",{className:"card overflow-hidden"},c.createElement("div",{className:"flex items-center justify-between border-b border-slate-800 p-4"},c.createElement("div",null,c.createElement("h2",{className:"text-lg font-black text-white"},"Farm batches"),c.createElement("p",{className:"text-xs text-slate-400"},"Every purchase, event, and delivery stays linked to its batch.")),c.createElement("span",{className:"rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300"},Ee.batches.length," total")),c.createElement("div",{className:"divide-y divide-slate-800"},Ee.batches.length===0&&c.createElement("p",{className:"p-6 text-sm text-slate-400"},"No batches yet. Create an own-raised or purchased batch."),Ee.batches.map(f=>c.createElement("article",{key:f.batchId,className:"space-y-3 p-4"},c.createElement("div",{className:"flex flex-wrap items-start justify-between gap-2"},c.createElement("div",null,c.createElement("h3",{className:"font-black text-white"},f.animalType),c.createElement("p",{className:"mt-0.5 text-xs text-slate-400"},f.source==="PURCHASED"?`Purchased from ${f.supplier}`:"Own-raised"," · Started ",f.startDate),f.source==="PURCHASED"&&c.createElement("p",{className:"mt-1 text-xs text-slate-400"},"Purchase amount: Rs. ",Se(f.purchaseAmountRs,0)),c.createElement("p",{className:"font-mono text-[10px] text-slate-600"},f.batchId)),c.createElement("span",{className:`rounded-full px-2.5 py-1 text-xs font-bold ${f.currentCount?"bg-emerald-500/15 text-emerald-300":"bg-slate-800 text-slate-400"}`},f.currentCount?"Active":"Completed")),c.createElement("div",{className:"grid grid-cols-2 gap-2 sm:grid-cols-4"},[["Live now",`${Number(f.currentCount).toLocaleString()} head`],["Live weight",`${Se(f.currentLiveWeightKg)} kg`],["Feed balance",`${Se(f.feedBalanceKg)} kg`],["Started with",`${Number(f.initialCount).toLocaleString()} head · ${Se(f.initialLiveWeightKg)} kg`],["Feed purchased",`${Se(f.feedPurchasedKg)} kg`],["Delivered",`${Number(f.deliveredCount).toLocaleString()} head · ${Se(f.deliveredWeightKg)} kg`]].map(([C,b])=>c.createElement("div",{key:C,className:"rounded-lg bg-slate-900 p-2.5"},c.createElement("p",{className:"text-[10px] uppercase text-slate-500"},C),c.createElement("p",{className:"mt-1 text-sm font-bold text-slate-200"},b)))),c.createElement("div",{className:"flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400"},c.createElement("span",null,"Mortality: ",f.mortalityCount," head / ",Se(f.mortalityWeightKg)," kg"),c.createElement("span",null,"Feed used: ",Se(f.feedUsedKg)," kg"),c.createElement("span",null,"Measured weight gain/loss: +",Se(f.measuredGainKg)," / −",Se(f.measuredLossKg)," kg"),c.createElement("span",null,"Transport: Rs. ",Se(f.transportCostRs,0))))))),c.createElement("div",{className:"space-y-5"},c.createElement("form",{onSubmit:St,className:"card space-y-4 p-4"},c.createElement("div",null,c.createElement("h2",{className:"text-lg font-black text-white"},"Create a batch"),c.createElement("p",{className:"text-xs text-slate-400"},"For chicks raised at the farm or animals bought from another farm.")),c.createElement(oe,{label:"Animal type"},c.createElement(Ir,{required:!0,value:L.animalTypeId,onChange:f=>ve({...L,animalTypeId:f.target.value})},c.createElement("option",{value:""},"Choose animal type"),Ee.animalTypes.map(f=>c.createElement("option",{key:f.id,value:f.id},f.name)),c.createElement("option",{value:"__new__"},"＋ Add a new animal type…"))),L.animalTypeId==="__new__"&&c.createElement(oe,{label:"New animal type"},c.createElement(ye,{required:!0,maxLength:40,value:L.newAnimalType,onChange:f=>ve({...L,newAnimalType:f.target.value}),placeholder:"e.g. Goat"})),c.createElement("div",{className:"grid gap-3 sm:grid-cols-2"},c.createElement(oe,{label:"Batch source"},c.createElement(Ir,{value:L.source,onChange:f=>ve({...L,source:f.target.value})},c.createElement("option",{value:"OWN_RAISED"},"Own-raised at Raihan Farm"),c.createElement("option",{value:"PURCHASED"},"Purchased from outside farm"))),c.createElement(oe,{label:"Batch date"},c.createElement(ye,{type:"date",required:!0,value:L.startDate,onChange:f=>ve({...L,startDate:f.target.value})}))),L.source==="PURCHASED"&&c.createElement(oe,{label:"Outside farm / supplier"},c.createElement(ye,{required:!0,maxLength:100,value:L.supplier,onChange:f=>ve({...L,supplier:f.target.value})})),L.source==="PURCHASED"&&c.createElement(oe,{label:"Purchase amount (Rs.)"},c.createElement(ye,{type:"number",min:"0",step:"0.01",required:!0,value:L.purchaseAmountRs,onChange:f=>ve({...L,purchaseAmountRs:f.target.value})})),c.createElement("div",{className:"grid gap-3 sm:grid-cols-2"},c.createElement(oe,{label:"Animals received / placed"},c.createElement(ye,{type:"number",min:"1",step:"1",required:!0,value:L.initialCount,onChange:f=>ve({...L,initialCount:f.target.value})})),c.createElement(oe,{label:"Starting live weight (kg)"},c.createElement(ye,{type:"number",min:"0.01",step:"0.01",required:!0,value:L.initialLiveWeightKg,onChange:f=>ve({...L,initialLiveWeightKg:f.target.value})}))),c.createElement("button",{disabled:Ce,className:"w-full rounded-xl bg-emerald-400 px-4 py-2.5 font-black text-slate-950 disabled:opacity-60"},"Create farm batch")),c.createElement("form",{onSubmit:tt,className:"card space-y-4 p-4"},c.createElement("div",null,c.createElement("h2",{className:"text-lg font-black text-white"},"Record batch activity"),c.createElement("p",{className:"text-xs text-slate-400"},"All quantities and costs are recorded against the selected batch.")),c.createElement(oe,{label:"Active batch"},c.createElement(Ir,{required:!0,value:N.batchId,onChange:f=>X({...N,batchId:f.target.value})},c.createElement("option",{value:""},"Choose a batch"),Pe.map(f=>c.createElement("option",{key:f.batchId,value:f.batchId},f.animalType," · ",f.currentCount," head · ",f.startDate)))),c.createElement("div",{className:"grid gap-3 sm:grid-cols-2"},c.createElement(oe,{label:"Activity"},c.createElement(Ir,{value:N.type,onChange:f=>X({...N,type:f.target.value})},Object.entries(Md).map(([f,C])=>c.createElement("option",{key:f,value:f},C)))),c.createElement(oe,{label:"Activity date"},c.createElement(ye,{type:"date",required:!0,value:N.date,onChange:f=>X({...N,date:f.target.value})}))),["FEED_PURCHASE","FEED_USE"].includes(N.type)&&c.createElement(oe,{label:"Feed quantity (kg)"},c.createElement(ye,{type:"number",min:"0.01",step:"0.01",required:!0,value:N.quantityKg,onChange:f=>X({...N,quantityKg:f.target.value})})),N.type==="FEED_PURCHASE"&&c.createElement(c.Fragment,null,c.createElement("div",{className:"grid gap-3 sm:grid-cols-2"},c.createElement(oe,{label:"Purchase cost (Rs.)"},c.createElement(ye,{type:"number",min:"0",step:"0.01",required:!0,value:N.amountRs,onChange:f=>X({...N,amountRs:f.target.value})})),c.createElement(oe,{label:"Feed supplier (optional)"},c.createElement(ye,{maxLength:100,value:N.supplier,onChange:f=>X({...N,supplier:f.target.value})})))),N.type==="TRANSPORT"&&c.createElement(oe,{label:"Transport cost (Rs.)"},c.createElement(ye,{type:"number",min:"0",step:"0.01",required:!0,value:N.amountRs,onChange:f=>X({...N,amountRs:f.target.value})})),["MORTALITY","DELIVERY"].includes(N.type)&&c.createElement("div",{className:"grid gap-3 sm:grid-cols-2"},c.createElement(oe,{label:N.type==="MORTALITY"?"Animals lost":"Live animals delivered"},c.createElement(ye,{type:"number",min:"1",step:"1",required:!0,value:N.count,onChange:f=>X({...N,count:f.target.value})})),c.createElement(oe,{label:N.type==="MORTALITY"?"Mortality weight (kg, optional)":"Delivered live weight (kg)"},c.createElement(ye,{type:"number",min:"0.01",step:"0.01",required:N.type==="DELIVERY",value:N.weightKg,onChange:f=>X({...N,weightKg:f.target.value})}))),N.type==="DELIVERY"&&c.createElement(oe,{label:"Delivery amount (Rs., optional)"},c.createElement(ye,{type:"number",min:"0",step:"0.01",value:N.amountRs,onChange:f=>X({...N,amountRs:f.target.value})})),N.type==="WEIGHT_CHECK"&&c.createElement(oe,{label:"New total live weight for this batch (kg)"},c.createElement(ye,{type:"number",min:"0.01",step:"0.01",required:!0,value:N.weightKg,onChange:f=>X({...N,weightKg:f.target.value})})),c.createElement(oe,{label:"Note (optional)"},c.createElement(ye,{maxLength:240,value:N.note,onChange:f=>X({...N,note:f.target.value}),placeholder:"Short details"})),c.createElement("button",{disabled:Ce||!Pe.length,className:"w-full rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-2.5 font-black text-emerald-200 disabled:opacity-50"},"Save activity")))),c.createElement("section",{id:"activity",className:"card overflow-hidden"},c.createElement("div",{className:"border-b border-slate-800 p-4"},c.createElement("h2",{className:"text-lg font-black text-white"},"Batch activity history"),c.createElement("p",{className:"text-xs text-slate-400"},"Feed purchased and used, transport, mortality, live-animal deliveries, and measured weight changes.")),Te.length===0?c.createElement("p",{className:"p-5 text-sm text-slate-400"},"No activity recorded yet."):c.createElement("div",{className:"overflow-x-auto"},c.createElement("table",{className:"w-full min-w-[760px] text-left text-sm"},c.createElement("thead",{className:"bg-slate-900 text-xs uppercase text-slate-500"},c.createElement("tr",null,c.createElement("th",{className:"p-3"},"Date"),c.createElement("th",{className:"p-3"},"Batch / animal"),c.createElement("th",{className:"p-3"},"Activity"),c.createElement("th",{className:"p-3"},"Quantity / weight"),c.createElement("th",{className:"p-3"},"Cost / amount"),c.createElement("th",{className:"p-3"},"Details"))),c.createElement("tbody",{className:"divide-y divide-slate-800"},Te.map(f=>{const C=f.quantityKg!==void 0?`${Se(f.quantityKg)} kg`:f.count!==void 0?`${f.count} head${f.weightKg!==void 0?` · ${Se(f.weightKg)} kg`:""}`:f.weightKg!==void 0?`${Se(f.weightKg)} kg${f.changeKg!==void 0?` (${f.changeKg>0?"+":""}${Se(f.changeKg)} kg)`:""}`:"—";return c.createElement("tr",{key:f.id,className:"text-slate-300"},c.createElement("td",{className:"whitespace-nowrap p-3"},f.date),c.createElement("td",{className:"p-3"},c.createElement("span",{className:"font-bold text-white"},f.animalType),c.createElement("br",null),c.createElement("span",{className:"font-mono text-[10px] text-slate-600"},f.batchId)),c.createElement("td",{className:"whitespace-nowrap p-3"},Md[f.type]||f.type),c.createElement("td",{className:"whitespace-nowrap p-3"},f.type==="BATCH_STARTED"?`${f.count} head · ${Se(f.weightKg)} kg`:C),c.createElement("td",{className:"whitespace-nowrap p-3"},f.amountRs!==void 0?`Rs. ${Se(f.amountRs,0)}`:"—"),c.createElement("td",{className:"max-w-xs p-3 text-xs text-slate-400"},f.destination||f.supplier||f.note||"—"))}))))),c.createElement("details",{className:"card p-4"},c.createElement("summary",{className:"cursor-pointer font-bold text-slate-200"},"Change farm password"),c.createElement("form",{onSubmit:ze,className:"mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"},c.createElement(oe,{label:"Current password"},c.createElement(ye,{type:"password",required:!0,autoComplete:"current-password",value:ce.currentPassword,onChange:f=>Fe({...ce,currentPassword:f.target.value})})),c.createElement(oe,{label:"New password (at least 8 characters)"},c.createElement(ye,{type:"password",required:!0,minLength:8,autoComplete:"new-password",value:ce.newPassword,onChange:f=>Fe({...ce,newPassword:f.target.value})})),c.createElement("button",{disabled:Ce,className:"rounded-xl bg-slate-700 px-4 py-2.5 font-bold text-white disabled:opacity-60"},"Update password"))))):c.createElement("main",{className:"min-h-screen flex items-center justify-center p-4"},c.createElement("form",{onSubmit:dt,className:"card w-full max-w-md space-y-5 p-7"},c.createElement("div",null,c.createElement("p",{className:"text-xs font-black uppercase tracking-[0.2em] text-emerald-400"},"Raihan Farm"),c.createElement("h1",{className:"mt-2 text-3xl font-black text-white"},"Farm operations"),c.createElement("p",{className:"mt-2 text-sm text-slate-400"},"Separate farm records for live-animal batches and feed.")),O&&c.createElement("p",{role:"alert",className:"rounded-xl border border-red-500/40 bg-red-950/50 p-3 text-sm text-red-200"},O),c.createElement(oe,{label:"Username"},c.createElement(ye,{autoComplete:"username",required:!0,value:h.username,onChange:f=>fe({...h,username:f.target.value})})),c.createElement(oe,{label:"Password"},c.createElement(ye,{type:"password",autoComplete:"current-password",required:!0,value:h.password,onChange:f=>fe({...h,password:f.target.value})})),c.createElement("button",{disabled:Ce,className:"w-full rounded-xl bg-emerald-400 px-4 py-3 font-black text-slate-950 disabled:opacity-60"},Ce?"Signing in…":"Sign in to farm dashboard")))}window.RAIHAN_API_BASE="";function $c(){const[E,F]=be.useState(null),[h,fe]=be.useState("");return be.useEffect(()=>{var U;const O=new DOMParser().parseFromString(Uc,"text/html");document.body.className=O.body.className,window.location.search.includes("qr=wall-checkin")||(U=O.getElementById("login-modal"))==null||U.classList.remove("hidden"),F(O.body.innerHTML)},[]),be.useEffect(()=>{if(E===null)return;let O=!0;async function U(){try{for(const ne of["/js/config.js","/js/api.js","/js/app.js"])await new Promise((Z,me)=>{const G=document.createElement("script");G.src=ne,G.onload=Z,G.onerror=()=>me(new Error(`Unable to load ${ne}`)),document.body.appendChild(G)});if(O){if(typeof window.bootstrap!="function")throw new Error("ERP startup function is unavailable.");await window.bootstrap()}}catch(ne){O&&fe(ne.message)}}return U(),()=>{O=!1}},[E]),h?c.createElement("main",{role:"alert",className:"m-8 rounded-xl border border-red-500 bg-slate-900 p-6 text-red-200"},c.createElement("h1",{className:"text-lg font-bold"},"Unable to start Raihan Farm ERP"),c.createElement("p",{className:"mt-2"},h)):E===null?c.createElement("main",{className:"p-6 text-slate-200"},"Loading Raihan Farm ERP…"):c.createElement("div",{dangerouslySetInnerHTML:{__html:E}})}const Qc=window.location.pathname.replace(/\/+$/,"")==="/farm"?c.createElement(Hc,null):c.createElement($c,null);window.location.pathname.replace(/\/+$/,"")!=="/farm"&&localStorage.removeItem("raihan_erp_token");Bc.createRoot(document.getElementById("root")).render(Qc);
