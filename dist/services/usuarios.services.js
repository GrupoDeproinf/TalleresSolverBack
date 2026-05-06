"use strict";

var _excluded = ["id"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var admin = require("firebase-admin");
var _require = require("../firebase"),
  db = _require.db,
  bucket = _require.bucket;
var _require2 = require('buffer'),
  Buffer = _require2.Buffer;
var _require3 = require("firebase/auth"),
  getAuth = _require3.getAuth,
  signInWithEmailAndPassword = _require3.signInWithEmailAndPassword;
var _require4 = require("firebase-admin/firestore"),
  getFirestore = _require4.getFirestore,
  GeoPoint = _require4.GeoPoint;
var _require5 = require("../../firebaseConfig"),
  app = _require5.app; // Asegúrate de la ruta correcta

var sendEmail = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(email, html, subject) {
    var axios, data, config, response;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          axios = require("axios");
          if (!(!email || !html)) {
            _context.next = 4;
            break;
          }
          throw new Error("Email, HTML y nombre son requeridos");
        case 4:
          data = JSON.stringify({
            sender: {
              name: "Solvers, C.A.",
              email: "info@solversapp.com"
            },
            to: [{
              email: email
            }],
            htmlContent: html,
            subject: subject,
            headers: {
              "X-Mailin-track": "0",
              // Desactiva todo el tracking
              "X-Mailin-track-clicks": "0" // Desactiva solo clicks
            }
          });
          config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://api.brevo.com/v3/smtp/email",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "api-key": process.env.BREVO_API_KEY
            },
            data: data
          };
          _context.next = 8;
          return axios.request(config);
        case 8:
          response = _context.sent;
          console.log("Email enviado exitosamente:", response.data);
          return _context.abrupt("return", {
            success: true,
            message: "Email enviado exitosamente",
            data: response.data
          });
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error("Error al enviar el email:", _context.t0);
          throw new Error("Error al enviar el email: ".concat(_context.t0.message));
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 13]]);
  }));
  return function sendEmail(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// Inicializar Firebase Auth y Firestore
var auth = getAuth(app); // Obtener la instancia de autenticación
// const db = getFirestore(); // Inicializar Firestore

var nodemailer = require("nodemailer");
var getUsuarios = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var result, usuarios;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return db.collection("Usuarios").get();
        case 3:
          result = _context2.sent;
          if (!result.empty) {
            _context2.next = 6;
            break;
          }
          return _context2.abrupt("return", res.status(404).send("No se encontraron usuarios"));
        case 6:
          usuarios = result.docs.map(function (doc) {
            return doc.data();
          });
          res.send(usuarios);
          _context2.next = 14;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error("Error al obtener usuarios:", _context2.t0); // Muestra el error en la consola del servidor
          res.status(500).send("Error al obtener usuarios: ".concat(_context2.t0.message)); // Muestra el mensaje del error
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 10]]);
  }));
  return function getUsuarios(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
var getNotificaciones = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var result, notificaciones;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return db.collection("Notificaciones").get();
        case 3:
          result = _context3.sent;
          if (!result.empty) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", res.status(200).json([]));
        case 6:
          notificaciones = result.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          });
          return _context3.abrupt("return", res.status(200).json(notificaciones));
        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error("Error al obtener notificaciones:", _context3.t0);
          return _context3.abrupt("return", res.status(500).send("Error al obtener notificaciones: ".concat(_context3.t0.message)));
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return function getNotificaciones(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

/** Solo sobrescribe claves presentes en incoming con valor !== undefined; el resto se conserva de existing. */
var mergeUsuarioNotificacionItem = function mergeUsuarioNotificacionItem(existing, incoming) {
  var out = _objectSpread({}, existing && _typeof(existing) === "object" ? existing : {});
  if (!incoming || _typeof(incoming) !== "object") return out;
  for (var _i = 0, _Object$keys = Object.keys(incoming); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    if (incoming[key] !== undefined) {
      out[key] = incoming[key];
    }
  }
  return out;
};
var saveUpdateNotificationUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _ref5, uiduser, uidvehicle, notificaciones, userRef, userSnap, userData, current, vehicleId, idx, vehicleConfig, currentNotificaciones, mergedNotificaciones, _iterator, _step, _loop, _ret, vehicleNotifications, updated;
    return _regeneratorRuntime().wrap(function _callee4$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _ref5 = req.body || {}, uiduser = _ref5.uiduser, uidvehicle = _ref5.uidvehicle, notificaciones = _ref5.notificaciones;
          if (!(!uiduser || typeof uiduser !== "string" || uiduser.trim() === "")) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            error: "uiduser es requerido."
          }));
        case 4:
          if (!(!uidvehicle || typeof uidvehicle !== "string" || uidvehicle.trim() === "")) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            error: "uidvehicle es requerido."
          }));
        case 6:
          if (Array.isArray(notificaciones)) {
            _context5.next = 8;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            error: "notificaciones debe ser un arreglo."
          }));
        case 8:
          userRef = db.collection("Usuarios").doc(uiduser.trim());
          _context5.next = 11;
          return userRef.get();
        case 11:
          userSnap = _context5.sent;
          if (userSnap.exists) {
            _context5.next = 14;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            error: "Usuario no encontrado."
          }));
        case 14:
          userData = userSnap.data() || {};
          current = Array.isArray(userData.notificacionesVehiculos) ? userData.notificacionesVehiculos : [];
          vehicleId = uidvehicle.trim();
          idx = current.findIndex(function (item) {
            return item && _typeof(item) === "object" && item.uidvehicle === vehicleId;
          });
          vehicleConfig = idx >= 0 && current[idx] && _typeof(current[idx]) === "object" ? current[idx] : null;
          currentNotificaciones = Array.isArray(vehicleConfig === null || vehicleConfig === void 0 ? void 0 : vehicleConfig.notificaciones) ? _toConsumableArray(vehicleConfig.notificaciones) : [];
          mergedNotificaciones = _toConsumableArray(currentNotificaciones);
          _iterator = _createForOfIteratorHelper(notificaciones);
          _context5.prev = 22;
          _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
            var inc, scRaw, sc, j, merged, _merged;
            return _regeneratorRuntime().wrap(function _loop$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  inc = _step.value;
                  if (!(!inc || _typeof(inc) !== "object")) {
                    _context4.next = 3;
                    break;
                  }
                  return _context4.abrupt("return", {
                    v: res.status(400).json({
                      error: "Cada elemento de notificaciones debe ser un objeto."
                    })
                  });
                case 3:
                  scRaw = inc.secretCode;
                  if (!(scRaw === undefined || scRaw === null || String(scRaw).trim() === "")) {
                    _context4.next = 6;
                    break;
                  }
                  return _context4.abrupt("return", {
                    v: res.status(400).json({
                      error: "Cada notificación debe incluir secretCode."
                    })
                  });
                case 6:
                  sc = String(scRaw).trim();
                  j = mergedNotificaciones.findIndex(function (n) {
                    return n && _typeof(n) === "object" && String(n.secretCode).trim() === sc;
                  });
                  if (j >= 0) {
                    merged = mergeUsuarioNotificacionItem(mergedNotificaciones[j], inc);
                    merged.secretCode = sc;
                    mergedNotificaciones[j] = merged;
                  } else {
                    _merged = mergeUsuarioNotificacionItem({
                      secretCode: sc
                    }, inc);
                    _merged.secretCode = sc;
                    mergedNotificaciones.push(_merged);
                  }
                case 9:
                case "end":
                  return _context4.stop();
              }
            }, _loop);
          });
          _iterator.s();
        case 25:
          if ((_step = _iterator.n()).done) {
            _context5.next = 32;
            break;
          }
          return _context5.delegateYield(_loop(), "t0", 27);
        case 27:
          _ret = _context5.t0;
          if (!_ret) {
            _context5.next = 30;
            break;
          }
          return _context5.abrupt("return", _ret.v);
        case 30:
          _context5.next = 25;
          break;
        case 32:
          _context5.next = 37;
          break;
        case 34:
          _context5.prev = 34;
          _context5.t1 = _context5["catch"](22);
          _iterator.e(_context5.t1);
        case 37:
          _context5.prev = 37;
          _iterator.f();
          return _context5.finish(37);
        case 40:
          vehicleNotifications = _objectSpread(_objectSpread({}, vehicleConfig && _typeof(vehicleConfig) === "object" ? vehicleConfig : {}), {}, {
            uidvehicle: vehicleId,
            notificaciones: mergedNotificaciones
          });
          if (idx >= 0) {
            updated = _toConsumableArray(current);
            updated[idx] = vehicleNotifications;
          } else {
            updated = [].concat(_toConsumableArray(current), [vehicleNotifications]);
          }
          _context5.next = 44;
          return userRef.update({
            notificacionesVehiculos: updated
          });
        case 44:
          return _context5.abrupt("return", res.status(200).json({
            message: "Notificaciones del vehículo guardadas correctamente.",
            uiduser: uiduser.trim(),
            uidvehicle: vehicleId
          }));
        case 47:
          _context5.prev = 47;
          _context5.t2 = _context5["catch"](0);
          console.error("Error al guardar/actualizar notificaciones de usuario:", _context5.t2);
          return _context5.abrupt("return", res.status(500).json({
            error: "Error al guardar notificaciones: ".concat(_context5.t2.message)
          }));
        case 51:
        case "end":
          return _context5.stop();
      }
    }, _callee4, null, [[0, 47], [22, 34, 37, 40]]);
  }));
  return function saveUpdateNotificationUser(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();
var updateNotificationUser = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _ref8, _updatedNotificacione, _ref9, _updatedNotificacione2, _ref10, _ref11, _ref12, _ref13, _ref7, uiduser, uidvehicle, secretCode, ultimaRevision, proximaRevision, ultimoKM, proximoKM, intervalodias, intervalokm, intervaloDias, intervaloKm, intervaloTiempoXVencer, intervaloKMXVencer, userRef, userSnap, userData, current, vehicleId, vehicleIndex, vehicleConfig, currentNotificaciones, notifIndex, updatedNotificaciones, dias, km, updatedVehicles;
    return _regeneratorRuntime().wrap(function _callee5$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _ref7 = req.body || {}, uiduser = _ref7.uiduser, uidvehicle = _ref7.uidvehicle, secretCode = _ref7.secretCode, ultimaRevision = _ref7.ultimaRevision, proximaRevision = _ref7.proximaRevision, ultimoKM = _ref7.ultimoKM, proximoKM = _ref7.proximoKM, intervalodias = _ref7.intervalodias, intervalokm = _ref7.intervalokm, intervaloDias = _ref7.intervaloDias, intervaloKm = _ref7.intervaloKm, intervaloTiempoXVencer = _ref7.intervaloTiempoXVencer, intervaloKMXVencer = _ref7.intervaloKMXVencer;
          if (!(!uiduser || typeof uiduser !== "string" || uiduser.trim() === "")) {
            _context6.next = 4;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            error: "uiduser es requerido."
          }));
        case 4:
          if (!(!uidvehicle || typeof uidvehicle !== "string" || uidvehicle.trim() === "")) {
            _context6.next = 6;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            error: "uidvehicle es requerido."
          }));
        case 6:
          if (!(!secretCode || typeof secretCode !== "string" || secretCode.trim() === "")) {
            _context6.next = 8;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            error: "secretCode es requerido."
          }));
        case 8:
          userRef = db.collection("Usuarios").doc(uiduser.trim());
          _context6.next = 11;
          return userRef.get();
        case 11:
          userSnap = _context6.sent;
          if (userSnap.exists) {
            _context6.next = 14;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            error: "Usuario no encontrado."
          }));
        case 14:
          userData = userSnap.data() || {};
          current = Array.isArray(userData.notificacionesVehiculos) ? userData.notificacionesVehiculos : [];
          vehicleId = uidvehicle.trim();
          vehicleIndex = current.findIndex(function (item) {
            return item && _typeof(item) === "object" && item.uidvehicle === vehicleId;
          });
          if (!(vehicleIndex < 0)) {
            _context6.next = 20;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            error: "No se encontró configuración de notificaciones para ese vehículo."
          }));
        case 20:
          vehicleConfig = current[vehicleIndex] || {};
          currentNotificaciones = Array.isArray(vehicleConfig.notificaciones) ? vehicleConfig.notificaciones : [];
          notifIndex = currentNotificaciones.findIndex(function (n) {
            return n && _typeof(n) === "object" && n.secretCode === secretCode.trim();
          });
          if (!(notifIndex < 0)) {
            _context6.next = 25;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            error: "No se encontró notificación para el secretCode indicado."
          }));
        case 25:
          updatedNotificaciones = _toConsumableArray(currentNotificaciones);
          dias = intervalodias !== undefined && intervalodias !== null ? intervalodias : intervaloDias !== undefined && intervaloDias !== null ? intervaloDias : (_ref8 = (_updatedNotificacione = updatedNotificaciones[notifIndex].intervalodias) !== null && _updatedNotificacione !== void 0 ? _updatedNotificacione : updatedNotificaciones[notifIndex].intervaloDias) !== null && _ref8 !== void 0 ? _ref8 : "";
          km = intervalokm !== undefined && intervalokm !== null ? intervalokm : intervaloKm !== undefined && intervaloKm !== null ? intervaloKm : (_ref9 = (_updatedNotificacione2 = updatedNotificaciones[notifIndex].intervalokm) !== null && _updatedNotificacione2 !== void 0 ? _updatedNotificacione2 : updatedNotificaciones[notifIndex].intervaloKM) !== null && _ref9 !== void 0 ? _ref9 : "";
          updatedNotificaciones[notifIndex] = _objectSpread(_objectSpread(_objectSpread({}, updatedNotificaciones[notifIndex]), {}, {
            ultimaRevision: (_ref10 = ultimaRevision !== null && ultimaRevision !== void 0 ? ultimaRevision : updatedNotificaciones[notifIndex].ultimaRevision) !== null && _ref10 !== void 0 ? _ref10 : "",
            proximaRevision: (_ref11 = proximaRevision !== null && proximaRevision !== void 0 ? proximaRevision : updatedNotificaciones[notifIndex].proximaRevision) !== null && _ref11 !== void 0 ? _ref11 : "",
            ultimoKM: (_ref12 = ultimoKM !== null && ultimoKM !== void 0 ? ultimoKM : updatedNotificaciones[notifIndex].ultimoKM) !== null && _ref12 !== void 0 ? _ref12 : "",
            proximoKM: (_ref13 = proximoKM !== null && proximoKM !== void 0 ? proximoKM : updatedNotificaciones[notifIndex].proximoKM) !== null && _ref13 !== void 0 ? _ref13 : "",
            intervalodias: dias,
            intervalokm: km
          }, intervaloTiempoXVencer !== undefined && intervaloTiempoXVencer !== null ? {
            intervaloTiempoXVencer: intervaloTiempoXVencer
          } : {}), intervaloKMXVencer !== undefined && intervaloKMXVencer !== null ? {
            intervaloKMXVencer: intervaloKMXVencer
          } : {});
          updatedVehicles = _toConsumableArray(current);
          updatedVehicles[vehicleIndex] = _objectSpread(_objectSpread({}, vehicleConfig), {}, {
            uidvehicle: vehicleId,
            notificaciones: updatedNotificaciones
          });
          _context6.next = 33;
          return userRef.update({
            notificacionesVehiculos: updatedVehicles
          });
        case 33:
          return _context6.abrupt("return", res.status(200).json({
            message: "Notificación del vehículo actualizada correctamente.",
            uiduser: uiduser.trim(),
            uidvehicle: vehicleId,
            secretCode: secretCode.trim()
          }));
        case 36:
          _context6.prev = 36;
          _context6.t0 = _context6["catch"](0);
          console.error("Error al actualizar notificación de usuario:", _context6.t0);
          return _context6.abrupt("return", res.status(500).json({
            error: "Error al actualizar notificaci\xF3n: ".concat(_context6.t0.message)
          }));
        case 40:
        case "end":
          return _context6.stop();
      }
    }, _callee5, null, [[0, 36]]);
  }));
  return function updateNotificationUser(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();
var getVehiculosByUsuarioUid = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var _ref15, uid, usuarioRef, usuarioDoc, vehiculosSnapshot, vehiculos;
    return _regeneratorRuntime().wrap(function _callee6$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _ref15 = req.body || {}, uid = _ref15.uid;
          if (!(!uid || typeof uid !== "string" || uid.trim() === "")) {
            _context7.next = 4;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            error: "Se debe proporcionar el uid del usuario."
          }));
        case 4:
          usuarioRef = db.collection("Usuarios").doc(uid.trim());
          _context7.next = 7;
          return usuarioRef.get();
        case 7:
          usuarioDoc = _context7.sent;
          if (usuarioDoc.exists) {
            _context7.next = 10;
            break;
          }
          return _context7.abrupt("return", res.status(404).json({
            error: "Usuario no encontrado."
          }));
        case 10:
          _context7.next = 12;
          return usuarioRef.collection("Vehiculos").get();
        case 12:
          vehiculosSnapshot = _context7.sent;
          vehiculos = vehiculosSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          });
          res.status(200).json(vehiculos);
          _context7.next = 21;
          break;
        case 17:
          _context7.prev = 17;
          _context7.t0 = _context7["catch"](0);
          console.error("Error al obtener vehículos del usuario:", _context7.t0);
          res.status(500).json({
            error: "Error al obtener veh\xEDculos: ".concat(_context7.t0.message)
          });
        case 21:
        case "end":
          return _context7.stop();
      }
    }, _callee6, null, [[0, 17]]);
  }));
  return function getVehiculosByUsuarioUid(_x12, _x13) {
    return _ref14.apply(this, arguments);
  };
}();
var getTiposVehiculo = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var snapshot, tipos;
    return _regeneratorRuntime().wrap(function _callee7$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return db.collection("Tipo_Vehiculo").get();
        case 3:
          snapshot = _context8.sent;
          if (!snapshot.empty) {
            _context8.next = 6;
            break;
          }
          return _context8.abrupt("return", res.status(200).json([]));
        case 6:
          tipos = snapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          });
          return _context8.abrupt("return", res.status(200).json(tipos));
        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.error("Error al obtener tipos de vehículo:", _context8.t0);
          return _context8.abrupt("return", res.status(500).json({
            error: "Error al obtener tipos de veh\xEDculo: ".concat(_context8.t0.message)
          }));
        case 14:
        case "end":
          return _context8.stop();
      }
    }, _callee7, null, [[0, 10]]);
  }));
  return function getTiposVehiculo(_x14, _x15) {
    return _ref16.apply(this, arguments);
  };
}();
var vehiculoCoalesceEmpty = function vehiculoCoalesceEmpty(v) {
  return v == null ? "" : v;
};
var vehiculoPayloadIsEmpty = function vehiculoPayloadIsEmpty(v) {
  return v == null || typeof v === "string" && v.trim() === "";
};
var vehiculoPayloadIsHttpUrl = function vehiculoPayloadIsHttpUrl(v) {
  return typeof v === "string" && /^https?:\/\//i.test(v.trim());
};
var vehiculoValueToTimestamp = function vehiculoValueToTimestamp(v) {
  if (!v) return "";
  var d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return admin.firestore.Timestamp.fromDate(d);
};
var vehiculoParseBase64File = function vehiculoParseBase64File(input) {
  if (!input || typeof input !== "string" || !input.trim()) return null;
  var s = input.trim();
  var contentType = "image/jpeg";
  var ext = "jpg";
  var dataUrl = /^data:([^;]+);base64,([\s\S]+)$/i.exec(s);
  if (dataUrl) {
    contentType = dataUrl[1].split(";")[0].trim().toLowerCase();
    s = dataUrl[2].replace(/\s/g, "");
  } else {
    s = s.replace(/\s/g, "");
  }
  var buffer;
  try {
    buffer = Buffer.from(s, "base64");
  } catch (_unused) {
    return null;
  }
  if (!buffer || !buffer.length) return null;
  if (dataUrl) {
    if (contentType.includes("pdf")) {
      ext = "pdf";
      contentType = "application/pdf";
    } else if (contentType.includes("png")) {
      ext = "png";
      contentType = "image/png";
    } else {
      ext = "jpg";
      contentType = "image/jpeg";
    }
  } else {
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      contentType = "image/jpeg";
      ext = "jpg";
    } else if (buffer[0] === 0x89 && buffer[1] === 0x50) {
      contentType = "image/png";
      ext = "png";
    } else if (buffer.slice(0, 4).toString("ascii") === "%PDF") {
      contentType = "application/pdf";
      ext = "pdf";
    }
  }
  return {
    buffer: buffer,
    contentType: contentType,
    ext: ext
  };
};
var vehiculoUploadDocumentFile = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(uidTrim, vehicleId, fileBaseName, base64Input) {
    var parsed, storagePath, file, baseUrl;
    return _regeneratorRuntime().wrap(function _callee8$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          parsed = vehiculoParseBase64File(base64Input);
          if (parsed) {
            _context9.next = 3;
            break;
          }
          return _context9.abrupt("return", "");
        case 3:
          storagePath = "vehicles/".concat(uidTrim, "/").concat(vehicleId, "/documents/").concat(fileBaseName, ".").concat(parsed.ext);
          file = bucket.file(storagePath);
          _context9.next = 7;
          return new Promise(function (resolve, reject) {
            file.save(parsed.buffer, {
              metadata: {
                contentType: parsed.contentType
              },
              "public": true,
              validation: "md5"
            }, function (err) {
              return err ? reject(err) : resolve();
            });
          });
        case 7:
          baseUrl = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(storagePath);
          return _context9.abrupt("return", "".concat(baseUrl, "?t=").concat(Date.now()));
        case 9:
        case "end":
          return _context9.stop();
      }
    }, _callee8);
  }));
  return function vehiculoUploadDocumentFile(_x16, _x17, _x18, _x19) {
    return _ref17.apply(this, arguments);
  };
}();
var vehiculoUploadMainImage = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(uidTrim, vehicleId, imagenBase64) {
    var raw, du, buffer, storagePath, file, baseUrl;
    return _regeneratorRuntime().wrap(function _callee9$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          if (!(!imagenBase64 || typeof imagenBase64 !== "string" || !imagenBase64.trim())) {
            _context10.next = 2;
            break;
          }
          return _context10.abrupt("return", "");
        case 2:
          raw = imagenBase64.trim();
          du = /^data:[^;]+;base64,([\s\S]+)$/i.exec(raw);
          if (du) raw = du[1].replace(/\s/g, "");else raw = raw.replace(/\s/g, "");
          buffer = Buffer.from(raw, "base64");
          storagePath = "vehicles/".concat(uidTrim, "/").concat(vehicleId, "/").concat(vehicleId, ".jpg");
          file = bucket.file(storagePath);
          _context10.next = 10;
          return new Promise(function (resolve, reject) {
            file.save(buffer, {
              metadata: {
                contentType: "image/jpeg"
              },
              "public": true,
              validation: "md5"
            }, function (err) {
              return err ? reject(err) : resolve();
            });
          });
        case 10:
          baseUrl = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(storagePath);
          return _context10.abrupt("return", "".concat(baseUrl, "?t=").concat(Date.now()));
        case 12:
        case "end":
          return _context10.stop();
      }
    }, _callee9);
  }));
  return function vehiculoUploadMainImage(_x20, _x21, _x22) {
    return _ref18.apply(this, arguments);
  };
}();

/** Crear: solo sube si hay base64; URL http(s) o vacío se ignoran para la subida. */
var vehiculoAppendCreateDocUrl = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(docUrlUpdates, uidTrim, vehicleId, raw, urlKey, fileBase) {
    var url;
    return _regeneratorRuntime().wrap(function _callee10$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          if (!vehiculoPayloadIsEmpty(raw)) {
            _context11.next = 2;
            break;
          }
          return _context11.abrupt("return");
        case 2:
          if (!vehiculoPayloadIsHttpUrl(raw)) {
            _context11.next = 4;
            break;
          }
          return _context11.abrupt("return");
        case 4:
          _context11.next = 6;
          return vehiculoUploadDocumentFile(uidTrim, vehicleId, fileBase, raw);
        case 6:
          url = _context11.sent;
          if (url) docUrlUpdates[urlKey] = url;
        case 8:
        case "end":
          return _context11.stop();
      }
    }, _callee10);
  }));
  return function vehiculoAppendCreateDocUrl(_x23, _x24, _x25, _x26, _x27, _x28) {
    return _ref19.apply(this, arguments);
  };
}();

/** Actualizar: vacío → limpiar; URL http(s) → mantener; base64 → subir. */
var vehiculoResolveUpdateDocUrl = /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(uidTrim, vehicleId, raw, urlKey, fileBase, existing) {
    var url;
    return _regeneratorRuntime().wrap(function _callee11$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          if (!vehiculoPayloadIsEmpty(raw)) {
            _context12.next = 2;
            break;
          }
          return _context12.abrupt("return", "");
        case 2:
          if (!vehiculoPayloadIsHttpUrl(raw)) {
            _context12.next = 4;
            break;
          }
          return _context12.abrupt("return", existing[urlKey] || "");
        case 4:
          _context12.next = 6;
          return vehiculoUploadDocumentFile(uidTrim, vehicleId, fileBase, raw);
        case 6:
          url = _context12.sent;
          return _context12.abrupt("return", url || existing[urlKey] || "");
        case 8:
        case "end":
          return _context12.stop();
      }
    }, _callee11);
  }));
  return function vehiculoResolveUpdateDocUrl(_x29, _x30, _x31, _x32, _x33, _x34) {
    return _ref20.apply(this, arguments);
  };
}();
var usuarioConductorUploadDoc = /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(uidTrim, fileBaseName, base64Input) {
    var parsed, storagePath, file, baseUrl;
    return _regeneratorRuntime().wrap(function _callee12$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          parsed = vehiculoParseBase64File(base64Input);
          if (parsed) {
            _context13.next = 3;
            break;
          }
          return _context13.abrupt("return", "");
        case 3:
          storagePath = "usuarios/".concat(uidTrim, "/documentos_conductor/").concat(fileBaseName, ".").concat(parsed.ext);
          file = bucket.file(storagePath);
          _context13.next = 7;
          return new Promise(function (resolve, reject) {
            file.save(parsed.buffer, {
              metadata: {
                contentType: parsed.contentType
              },
              "public": true,
              validation: "md5"
            }, function (err) {
              return err ? reject(err) : resolve();
            });
          });
        case 7:
          baseUrl = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(storagePath);
          return _context13.abrupt("return", "".concat(baseUrl, "?t=").concat(Date.now()));
        case 9:
        case "end":
          return _context13.stop();
      }
    }, _callee12);
  }));
  return function usuarioConductorUploadDoc(_x35, _x36, _x37) {
    return _ref21.apply(this, arguments);
  };
}();

/** Misma regla que vehículos: vacío → limpiar; URL http(s) → mantener; base64 → subir. El nombre en Firestore = bodyKey (ej. licencia_frente_base64 guarda la URL). */
var usuarioConductorResolveDocField = /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(uidTrim, raw, firestoreKey, fileBase, existing) {
    var url;
    return _regeneratorRuntime().wrap(function _callee13$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          if (!vehiculoPayloadIsEmpty(raw)) {
            _context14.next = 2;
            break;
          }
          return _context14.abrupt("return", "");
        case 2:
          if (!vehiculoPayloadIsHttpUrl(raw)) {
            _context14.next = 4;
            break;
          }
          return _context14.abrupt("return", existing[firestoreKey] || "");
        case 4:
          _context14.next = 6;
          return usuarioConductorUploadDoc(uidTrim, fileBase, raw);
        case 6:
          url = _context14.sent;
          return _context14.abrupt("return", url || existing[firestoreKey] || "");
        case 8:
        case "end":
          return _context14.stop();
      }
    }, _callee13);
  }));
  return function usuarioConductorResolveDocField(_x38, _x39, _x40, _x41, _x42) {
    return _ref22.apply(this, arguments);
  };
}();
var saveOrUpdateVehiculo = /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var body, uiduser, uidvehicle, imagen_base64, certificado_circulacion_frente_base64, certificado_circulacion_reverso_base64, rcv_documento_frente_base64, rcv_documento_reverso_base64, rcv_fecha_vencimiento, trimestres_frente_base64, trimestres_reverso_base64, trimestres_fecha_vencimiento, uidTrim, usuarioRef, usuarioDoc, vehiculosRef, isCreate, docData, newRef, _vehicleId, docUrlUpdates, _pathUrl, patch, vehicleId, vehicleRef, vehicleDoc, existing, pathUrl;
    return _regeneratorRuntime().wrap(function _callee14$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          body = req.body || {};
          uiduser = body.uiduser, uidvehicle = body.uidvehicle, imagen_base64 = body.imagen_base64, certificado_circulacion_frente_base64 = body.certificado_circulacion_frente_base64, certificado_circulacion_reverso_base64 = body.certificado_circulacion_reverso_base64, rcv_documento_frente_base64 = body.rcv_documento_frente_base64, rcv_documento_reverso_base64 = body.rcv_documento_reverso_base64, rcv_fecha_vencimiento = body.rcv_fecha_vencimiento, trimestres_frente_base64 = body.trimestres_frente_base64, trimestres_reverso_base64 = body.trimestres_reverso_base64, trimestres_fecha_vencimiento = body.trimestres_fecha_vencimiento;
          if (!(!uiduser || typeof uiduser !== "string" || uiduser.trim() === "")) {
            _context15.next = 5;
            break;
          }
          return _context15.abrupt("return", res.status(400).json({
            error: "Se debe proporcionar uiduser."
          }));
        case 5:
          uidTrim = uiduser.trim();
          usuarioRef = db.collection("Usuarios").doc(uidTrim);
          _context15.next = 9;
          return usuarioRef.get();
        case 9:
          usuarioDoc = _context15.sent;
          if (usuarioDoc.exists) {
            _context15.next = 12;
            break;
          }
          return _context15.abrupt("return", res.status(404).json({
            error: "Usuario no encontrado."
          }));
        case 12:
          vehiculosRef = usuarioRef.collection("Vehiculos");
          isCreate = !uidvehicle || typeof uidvehicle === "string" && uidvehicle.trim() === "";
          docData = {
            vehiculo_placa: vehiculoCoalesceEmpty(body.vehiculo_placa),
            vehiculo_marca: vehiculoCoalesceEmpty(body.vehiculo_marca),
            vehiculo_modelo: vehiculoCoalesceEmpty(body.vehiculo_modelo),
            vehiculo_anio: vehiculoCoalesceEmpty(body.vehiculo_anio),
            vehiculo_color: vehiculoCoalesceEmpty(body.vehiculo_color),
            tipo_vehiculo: vehiculoCoalesceEmpty(body.tipo_vehiculo),
            uid_tipo_vehiculo: vehiculoCoalesceEmpty(body.uid_tipo_vehiculo),
            KM: vehiculoCoalesceEmpty(body.KM),
            KM_correa_tiempo: vehiculoCoalesceEmpty(body.KM_correa_tiempo),
            KM_ultima_rotacion_cauchos: vehiculoCoalesceEmpty(body.KM_ultima_rotacion_cauchos),
            proximo_cambio_aceite: vehiculoValueToTimestamp(body.proximo_cambio_aceite),
            ultimo_cambio_bujias_filtro: vehiculoValueToTimestamp(body.ultimo_cambio_bujias_filtro),
            ultimo_cambio_pila_gasolina: vehiculoValueToTimestamp(body.ultimo_cambio_pila_gasolina),
            ultimo_lavado: vehiculoValueToTimestamp(body.ultimo_lavado),
            ultima_vez_gasolina: vehiculoValueToTimestamp(body.ultima_vez_gasolina),
            ultima_vez_alineacion: vehiculoValueToTimestamp(body.ultima_vez_alineacion),
            contratacion_RCV: vehiculoCoalesceEmpty(body.contratacion_RCV),
            grua: vehiculoCoalesceEmpty(body.grua),
            activo: vehiculoCoalesceEmpty(body.activo),
            por_defecto: vehiculoCoalesceEmpty(body.por_defecto),
            // Ficha técnica
            capacidad_tanque_combustible: vehiculoCoalesceEmpty(body.capacidad_tanque_combustible),
            cilindrada: vehiculoCoalesceEmpty(body.cilindrada),
            numero_cilindros: vehiculoCoalesceEmpty(body.numero_cilindros),
            tipo_aceite_motor: vehiculoCoalesceEmpty(body.tipo_aceite_motor),
            viscosidad_aceite_motor: vehiculoCoalesceEmpty(body.viscosidad_aceite_motor),
            marca_aceite_motor: vehiculoCoalesceEmpty(body.marca_aceite_motor),
            litros_aceite: vehiculoCoalesceEmpty(body.litros_aceite),
            tipo_aceite_diferencial: vehiculoCoalesceEmpty(body.tipo_aceite_diferencial),
            viscosidad_aceite_diferencial: vehiculoCoalesceEmpty(body.viscosidad_aceite_diferencial),
            tipo_aceite_transmision: vehiculoCoalesceEmpty(body.tipo_aceite_transmision),
            tipo_refrigerante: vehiculoCoalesceEmpty(body.tipo_refrigerante),
            tecnologia_refrigerante: vehiculoCoalesceEmpty(body.tecnologia_refrigerante),
            tipo_liga_frenos: vehiculoCoalesceEmpty(body.tipo_liga_frenos),
            amperaje_bateria: vehiculoCoalesceEmpty(body.amperaje_bateria),
            tamano_neumatico: vehiculoCoalesceEmpty(body.tamano_neumatico),
            tamano_rin: vehiculoCoalesceEmpty(body.tamano_rin),
            presion_neumatico: vehiculoCoalesceEmpty(body.presion_neumatico),
            marca_bujia: vehiculoCoalesceEmpty(body.marca_bujia),
            codigo_bujia: vehiculoCoalesceEmpty(body.codigo_bujia),
            nivel_blindaje: vehiculoCoalesceEmpty(body.nivel_blindaje),
            // Documentación (URLs en Storage; fechas como Timestamp)
            certificado_circulacion_frente_url: "",
            certificado_circulacion_reverso_url: "",
            rcv_documento_frente_url: "",
            rcv_documento_reverso_url: "",
            rcv_fecha_vencimiento: vehiculoValueToTimestamp(rcv_fecha_vencimiento),
            trimestres_frente_url: "",
            trimestres_reverso_url: "",
            trimestres_fecha_vencimiento: vehiculoValueToTimestamp(trimestres_fecha_vencimiento)
          };
          if (!isCreate) {
            _context15.next = 42;
            break;
          }
          _context15.next = 18;
          return vehiculosRef.add(docData);
        case 18:
          newRef = _context15.sent;
          _vehicleId = newRef.id;
          docUrlUpdates = {};
          _context15.next = 23;
          return vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, _vehicleId, certificado_circulacion_frente_base64, "certificado_circulacion_frente_url", "certificado_circulacion_frente");
        case 23:
          _context15.next = 25;
          return vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, _vehicleId, certificado_circulacion_reverso_base64, "certificado_circulacion_reverso_url", "certificado_circulacion_reverso");
        case 25:
          _context15.next = 27;
          return vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, _vehicleId, rcv_documento_frente_base64, "rcv_documento_frente_url", "rcv_documento_frente");
        case 27:
          _context15.next = 29;
          return vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, _vehicleId, rcv_documento_reverso_base64, "rcv_documento_reverso_url", "rcv_documento_reverso");
        case 29:
          _context15.next = 31;
          return vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, _vehicleId, trimestres_frente_base64, "trimestres_frente_url", "trimestres_frente");
        case 31:
          _context15.next = 33;
          return vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, _vehicleId, trimestres_reverso_base64, "trimestres_reverso_url", "trimestres_reverso");
        case 33:
          _context15.next = 35;
          return vehiculoUploadMainImage(uidTrim, _vehicleId, imagen_base64);
        case 35:
          _pathUrl = _context15.sent;
          patch = _objectSpread({}, docUrlUpdates);
          if (_pathUrl) patch.path = _pathUrl;
          if (!Object.keys(patch).length) {
            _context15.next = 41;
            break;
          }
          _context15.next = 41;
          return newRef.update(patch);
        case 41:
          return _context15.abrupt("return", res.status(201).json({
            message: "Vehículo creado.",
            uidvehicle: _vehicleId,
            path: _pathUrl || undefined,
            documentos: docUrlUpdates
          }));
        case 42:
          vehicleId = uidvehicle.trim();
          vehicleRef = vehiculosRef.doc(vehicleId);
          _context15.next = 46;
          return vehicleRef.get();
        case 46:
          vehicleDoc = _context15.sent;
          if (vehicleDoc.exists) {
            _context15.next = 49;
            break;
          }
          return _context15.abrupt("return", res.status(404).json({
            error: "Vehículo no encontrado en este usuario."
          }));
        case 49:
          existing = vehicleDoc.data() || {};
          _context15.next = 52;
          return vehiculoResolveUpdateDocUrl(uidTrim, vehicleId, certificado_circulacion_frente_base64, "certificado_circulacion_frente_url", "certificado_circulacion_frente", existing);
        case 52:
          docData.certificado_circulacion_frente_url = _context15.sent;
          _context15.next = 55;
          return vehiculoResolveUpdateDocUrl(uidTrim, vehicleId, certificado_circulacion_reverso_base64, "certificado_circulacion_reverso_url", "certificado_circulacion_reverso", existing);
        case 55:
          docData.certificado_circulacion_reverso_url = _context15.sent;
          _context15.next = 58;
          return vehiculoResolveUpdateDocUrl(uidTrim, vehicleId, rcv_documento_frente_base64, "rcv_documento_frente_url", "rcv_documento_frente", existing);
        case 58:
          docData.rcv_documento_frente_url = _context15.sent;
          _context15.next = 61;
          return vehiculoResolveUpdateDocUrl(uidTrim, vehicleId, rcv_documento_reverso_base64, "rcv_documento_reverso_url", "rcv_documento_reverso", existing);
        case 61:
          docData.rcv_documento_reverso_url = _context15.sent;
          _context15.next = 64;
          return vehiculoResolveUpdateDocUrl(uidTrim, vehicleId, trimestres_frente_base64, "trimestres_frente_url", "trimestres_frente", existing);
        case 64:
          docData.trimestres_frente_url = _context15.sent;
          _context15.next = 67;
          return vehiculoResolveUpdateDocUrl(uidTrim, vehicleId, trimestres_reverso_base64, "trimestres_reverso_url", "trimestres_reverso", existing);
        case 67:
          docData.trimestres_reverso_url = _context15.sent;
          pathUrl = "";
          if (!(imagen_base64 && typeof imagen_base64 === "string" && imagen_base64.trim())) {
            _context15.next = 76;
            break;
          }
          _context15.next = 72;
          return vehicleRef.update({
            path: admin.firestore.FieldValue["delete"]()
          });
        case 72:
          _context15.next = 74;
          return vehiculoUploadMainImage(uidTrim, vehicleId, imagen_base64);
        case 74:
          pathUrl = _context15.sent;
          if (pathUrl) {
            docData.path = pathUrl;
          }
        case 76:
          _context15.next = 78;
          return vehicleRef.update(docData);
        case 78:
          return _context15.abrupt("return", res.status(200).json({
            message: "Vehículo actualizado.",
            uidvehicle: vehicleId,
            path: pathUrl || undefined,
            documentos: {
              certificado_circulacion_frente_url: docData.certificado_circulacion_frente_url || undefined,
              certificado_circulacion_reverso_url: docData.certificado_circulacion_reverso_url || undefined,
              rcv_documento_frente_url: docData.rcv_documento_frente_url || undefined,
              rcv_documento_reverso_url: docData.rcv_documento_reverso_url || undefined,
              trimestres_frente_url: docData.trimestres_frente_url || undefined,
              trimestres_reverso_url: docData.trimestres_reverso_url || undefined
            }
          }));
        case 81:
          _context15.prev = 81;
          _context15.t0 = _context15["catch"](0);
          console.error("Error al guardar/actualizar vehículo:", _context15.t0);
          res.status(500).json({
            error: "Error al guardar veh\xEDculo: ".concat(_context15.t0.message)
          });
        case 85:
        case "end":
          return _context15.stop();
      }
    }, _callee14, null, [[0, 81]]);
  }));
  return function saveOrUpdateVehiculo(_x43, _x44) {
    return _ref23.apply(this, arguments);
  };
}();
var SaveClient = /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(req, res) {
    var _req$body, Nombre, cedula, phone, email, password, estado, base64, token, phoneRegex, userRecord, uid, imageUrl, buffer, file, infoUserCreated, htmlContent;
    return _regeneratorRuntime().wrap(function _callee15$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _req$body = req.body, Nombre = _req$body.Nombre, cedula = _req$body.cedula, phone = _req$body.phone, email = _req$body.email, password = _req$body.password, estado = _req$body.estado, base64 = _req$body.base64, token = _req$body.token; // Validar el formato del teléfono (ejemplo: debe tener 10 dígitos)
          phoneRegex = /^\d{10}$/;
          if (phoneRegex.test(phone)) {
            _context16.next = 5;
            break;
          }
          return _context16.abrupt("return", res.status(400).send("El teléfono debe contener 10 caracteres numéricos"));
        case 5:
          _context16.prev = 5;
          _context16.next = 8;
          return admin.auth().getUserByEmail(email);
        case 8:
          userRecord = _context16.sent;
          _context16.next = 11;
          return admin.auth().updateUser(userRecord.uid, {
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 11:
          userRecord = _context16.sent;
          _context16.next = 23;
          break;
        case 14:
          _context16.prev = 14;
          _context16.t0 = _context16["catch"](5);
          if (!(_context16.t0.code === "auth/user-not-found")) {
            _context16.next = 22;
            break;
          }
          _context16.next = 19;
          return admin.auth().createUser({
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 19:
          userRecord = _context16.sent;
          _context16.next = 23;
          break;
        case 22:
          throw _context16.t0;
        case 23:
          // Obtener el UID del usuario
          uid = userRecord.uid; // Subir la imagen de perfil al Storage
          imageUrl = "";
          if (!base64) {
            _context16.next = 31;
            break;
          }
          buffer = Buffer.from(base64, "base64");
          file = bucket.file("profileImages/".concat(uid, ".jpg"));
          _context16.next = 30;
          return file.save(buffer, {
            metadata: {
              contentType: "image/jpeg"
            },
            "public": true,
            validation: "md5"
          });
        case 30:
          imageUrl = "https://storage.googleapis.com/".concat(bucket.name, "/profileImages/").concat(uid, ".jpg");
        case 31:
          // Crear o actualizar el documento en la colección "Usuarios"
          infoUserCreated = {
            uid: uid,
            nombre: Nombre,
            cedula: cedula,
            phone: phone,
            typeUser: "Cliente",
            email: email,
            estado: estado,
            image_perfil: imageUrl,
            // Guardar la URL de la imagen de perfil
            token: token,
            createdAt: new Date()
          };
          _context16.next = 34;
          return db.collection("Usuarios").doc(uid).set(infoUserCreated, {
            merge: true
          });
        case 34:
          // Enviar correo de bienvenida
          htmlContent = "\n      <!DOCTYPE html>\n          <html>\n          <head>\n            <meta charset=\"utf-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <title>Bienvenido a Solvers</title>\n          </head>\n          <body style=\"font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #eef5f9;\">\n            <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width: 600px; width: 100%; margin: 20px auto; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0px 7px 30px 0px rgba(90, 114, 123, 0.11);\">\n              <!-- Header superior con borde azul -->\n              <tr>\n                <td style=\"height: 5px; background: linear-gradient(135deg, #5D87FF 0%, #4669d9 100%);\"></td>\n              </tr>\n\n              <!-- Logo y t\xEDtulo -->\n              <tr>\n                <td style=\"padding: 40px 30px; text-align: center; background-color: #ffffff;\">\n                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\">\n                    <tr>\n                      <td style=\"text-align: center;\">\n                        <img src=\"https://firebasestorage.googleapis.com/v0/b/talleres-solvers-app.firebasestorage.app/o/data%2Flogo%2Fsolverslogo.png?alt=media&token=c2937894-0be6-431b-a0df-4b5288fecfd5\" \n                            alt=\"Solvers Logo\" \n                            style=\"height: 40px; margin-bottom: 20px;\">\n                        <h1 style=\"margin: 0; font-size: 24px; color: #2B3445; font-weight: 600;\">\xA1Bienvenido a <strong>Solvers</strong>! Nos alegra tenerte con nosotros.</h1>\n                      </td>\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n              \n              <!-- Contenido principal -->\n              <tr>\n                <td style=\"padding: 0 30px 30px;\">\n                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\">\n                    <tr>\n                      <td>\n  <h2 style=\"margin: 0 0 20px; color: #2B3445; font-size: 18px; font-weight: 600;\">Hola ".concat(Nombre, ",</h2>\n  \n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    Has sido registrado exitosamente en nuestra plataforma de servicios de mec\xE1nica. Desde ahora, podr\xE1s solicitar ayuda de profesionales para resolver cualquier inconveniente con tu veh\xEDculo, est\xE9s donde est\xE9s.\n  </p>\n  \n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    Tu cuenta est\xE1 vinculada al correo:  \n    <span style=\"color: #5D87FF; font-weight: 600;\">").concat(email, "</span>\n  </p>\n\n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    \xBFListo para empezar? Ingresa a la app y solicita tu primer servicio cuando lo necesites.\n  </p>\n</td>\n\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n              \n              <!-- Footer -->\n              <tr>\n                <td style=\"background-color: #f5f6f8; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;\">\n                  <p style=\"margin: 0 0 10px; color: #2B3445; font-size: 14px; font-weight: 600;\">\n                    Solvers, C.A.\n                  </p>\n                  <p style=\"margin: 0 0 5px; color: #6C757D; font-size: 12px;\">\n                    Este es un correo autom\xE1tico, por favor no respondas a este mensaje.\n                  </p>\n                  <p style=\"margin: 0; color: #6C757D; font-size: 12px;\">\n                    \xA9 ").concat(new Date().getFullYear(), " Solvers, C.A. Todos los derechos reservados.\n                  </p>\n                </td>\n              </tr>\n            </table>\n          </body>\n          </html>\n    ");
          _context16.prev = 35;
          _context16.next = 38;
          return sendEmail(email, htmlContent, '¡Bienvenido a Solvers!');
        case 38:
          _context16.next = 43;
          break;
        case 40:
          _context16.prev = 40;
          _context16.t1 = _context16["catch"](35);
          console.error("Error al enviar el correo de bienvenida:", _context16.t1);
          // No interrumpimos el flujo si falla el envío del correo
        case 43:
          // Responder con el ID del documento creado o actualizado
          res.status(201).send({
            message: "Usuario guardado con éxito",
            uid: uid
          });
          _context16.next = 64;
          break;
        case 46:
          _context16.prev = 46;
          _context16.t2 = _context16["catch"](0);
          console.error("Error al guardar el usuario:", _context16.t2);

          // Manejar errores específicos de Firebase
          if (!(_context16.t2.code === "auth/email-already-exists")) {
            _context16.next = 53;
            break;
          }
          return _context16.abrupt("return", res.status(400).send({
            message: "El correo electrónico ya está en uso"
          }));
        case 53:
          if (!(_context16.t2.code === "auth/invalid-email")) {
            _context16.next = 57;
            break;
          }
          return _context16.abrupt("return", res.status(400).send({
            message: "El correo electrónico proporcionado no es válido"
          }));
        case 57:
          if (!(_context16.t2.code === "auth/weak-password")) {
            _context16.next = 61;
            break;
          }
          return _context16.abrupt("return", res.status(400).send({
            message: "La contraseña es demasiado débil"
          }));
        case 61:
          if (!(_context16.t2.code === "auth/phone-number-already-exists")) {
            _context16.next = 63;
            break;
          }
          return _context16.abrupt("return", res.status(400).send({
            message: "El número telefónico ya existe"
          }));
        case 63:
          // En caso de un error inesperado
          res.status(500).send("Error al guardar el usuario");
        case 64:
        case "end":
          return _context16.stop();
      }
    }, _callee15, null, [[0, 46], [5, 14], [35, 40]]);
  }));
  return function SaveClient(_x45, _x46) {
    return _ref24.apply(this, arguments);
  };
}();
var SaveTaller = /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16(req, res) {
    var _req$body2, Nombre, rif, phone, email, password, whats, metodos_pago, estado, base64, lat, lng, token, userRecord, uid, imageUrl, buffer, file, infoUserCreated, htmlContent;
    return _regeneratorRuntime().wrap(function _callee16$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          // Recibir los datos del taller desde el cuerpo de la solicitud
          _req$body2 = req.body, Nombre = _req$body2.Nombre, rif = _req$body2.rif, phone = _req$body2.phone, email = _req$body2.email, password = _req$body2.password, whats = _req$body2.whats, metodos_pago = _req$body2.metodos_pago, estado = _req$body2.estado, base64 = _req$body2.base64, lat = _req$body2.lat, lng = _req$body2.lng, token = _req$body2.token;
          _context17.prev = 2;
          _context17.next = 5;
          return admin.auth().getUserByEmail(email);
        case 5:
          userRecord = _context17.sent;
          _context17.next = 8;
          return admin.auth().updateUser(userRecord.uid, {
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 8:
          userRecord = _context17.sent;
          _context17.next = 20;
          break;
        case 11:
          _context17.prev = 11;
          _context17.t0 = _context17["catch"](2);
          if (!(_context17.t0.code === "auth/user-not-found")) {
            _context17.next = 19;
            break;
          }
          _context17.next = 16;
          return admin.auth().createUser({
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 16:
          userRecord = _context17.sent;
          _context17.next = 20;
          break;
        case 19:
          throw _context17.t0;
        case 20:
          // Obtener el UID del usuario
          uid = userRecord.uid; // Subir la imagen de perfil al Storage
          imageUrl = "";
          if (!base64) {
            _context17.next = 28;
            break;
          }
          buffer = Buffer.from(base64, "base64");
          file = bucket.file("profileImages/".concat(uid, ".jpg"));
          _context17.next = 27;
          return file.save(buffer, {
            metadata: {
              contentType: "image/jpeg"
            },
            "public": true,
            validation: "md5"
          });
        case 27:
          imageUrl = "https://storage.googleapis.com/".concat(bucket.name, "/profileImages/").concat(uid, ".jpg");
        case 28:
          // Crear o actualizar el documento en la colección "Usuarios"
          infoUserCreated = {
            uid: uid,
            nombre: Nombre,
            rif: rif,
            phone: phone,
            typeUser: "Taller",
            email: email,
            status: "Pendiente",
            whatsapp: whats,
            metodos_pago: metodos_pago,
            estado: estado,
            image_perfil: imageUrl,
            // Guardar la URL de la imagen de perfil
            ubicacion: {
              lat: lat,
              lng: lng
            },
            token: token
          };
          _context17.next = 31;
          return db.collection("Usuarios").doc(uid).set(infoUserCreated, {
            merge: true
          });
        case 31:
          htmlContent = "\n      <!DOCTYPE html>\n          <html>\n          <head>\n            <meta charset=\"utf-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <title>Bienvenido a Solvers</title>\n          </head>\n          <body style=\"font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #eef5f9;\">\n            <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width: 600px; width: 100%; margin: 20px auto; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0px 7px 30px 0px rgba(90, 114, 123, 0.11);\">\n              <!-- Header superior con borde azul -->\n              <tr>\n                <td style=\"height: 5px; background: linear-gradient(135deg, #5D87FF 0%, #4669d9 100%);\"></td>\n              </tr>\n\n              <!-- Logo y t\xEDtulo -->\n              <tr>\n                <td style=\"padding: 40px 30px; text-align: center; background-color: #ffffff;\">\n                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\">\n                    <tr>\n                      <td style=\"text-align: center;\">\n                        <img src=\"https://firebasestorage.googleapis.com/v0/b/talleres-solvers-app.firebasestorage.app/o/data%2Flogo%2Fsolverslogo.png?alt=media&token=c2937894-0be6-431b-a0df-4b5288fecfd5\" \n                            alt=\"Solvers Logo\" \n                            style=\"height: 40px; margin-bottom: 20px;\">\n                        <h1 style=\"margin: 0; font-size: 24px; color: #2B3445; font-weight: 600;\">\xA1Bienvenido a <strong>Solvers</strong>! Nos alegra tenerte con nosotros.</h1>\n                      </td>\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n              \n              <!-- Contenido principal -->\n              <tr>\n                <td style=\"padding: 0 30px 30px;\">\n                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\">\n                    <tr>\n                     <td>\n  <h2 style=\"margin: 0 0 20px; color: #2B3445; font-size: 18px; font-weight: 600;\">Hola ".concat(Nombre, ",</h2>\n  \n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    Tu taller ha sido registrado exitosamente en nuestra plataforma.\n  </p>\n  \n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    A partir de ahora podr\xE1s recibir solicitudes de clientes que necesitan asistencia con sus veh\xEDculos, gestionar tus servicios, y hacer crecer tu negocio con el respaldo de Solvers.\n  </p>\n  \n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    La cuenta del taller est\xE1 asociada al correo:  \n    <span style=\"color: #5D87FF; font-weight: 600;\">").concat(email, "</span>\n  </p>\n\n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    Te invitamos a explorar la app y configurar tus servicios para comenzar a recibir clientes.\n  </p>\n</td>\n\n\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n              \n              <!-- Footer -->\n              <tr>\n                <td style=\"background-color: #f5f6f8; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;\">\n                  <p style=\"margin: 0 0 10px; color: #2B3445; font-size: 14px; font-weight: 600;\">\n                    Solvers, C.A.\n                  </p>\n                  <p style=\"margin: 0 0 5px; color: #6C757D; font-size: 12px;\">\n                    Este es un correo autom\xE1tico, por favor no respondas a este mensaje.\n                  </p>\n                  <p style=\"margin: 0; color: #6C757D; font-size: 12px;\">\n                    \xA9 ").concat(new Date().getFullYear(), " Solvers, C.A. Todos los derechos reservados.\n                  </p>\n                </td>\n              </tr>\n            </table>\n          </body>\n          </html>\n    ");
          _context17.prev = 32;
          _context17.next = 35;
          return sendEmail(email, htmlContent, '¡Bienvenido a Solvers!');
        case 35:
          _context17.next = 40;
          break;
        case 37:
          _context17.prev = 37;
          _context17.t1 = _context17["catch"](32);
          console.error("Error al enviar el correo de bienvenida:", _context17.t1);
          // No interrumpimos el flujo si falla el envío del correo
        case 40:
          // Responder con el ID del documento creado o actualizado
          res.status(201).send({
            message: "Usuario guardado con éxito",
            uid: uid
          });
          _context17.next = 61;
          break;
        case 43:
          _context17.prev = 43;
          _context17.t2 = _context17["catch"](0);
          console.error("Error al guardar el usuario:", _context17.t2);

          // Manejar errores específicos de Firebase
          if (!(_context17.t2.code === "auth/email-already-exists")) {
            _context17.next = 50;
            break;
          }
          return _context17.abrupt("return", res.status(400).send({
            message: "Este email ya está registrado."
          }));
        case 50:
          if (!(_context17.t2.code === "auth/phone-number-already-exists")) {
            _context17.next = 54;
            break;
          }
          return _context17.abrupt("return", res.status(400).send({
            message: "Este número de teléfono ya está registrado."
          }));
        case 54:
          if (!(_context17.t2.code === "auth/invalid-phone-number")) {
            _context17.next = 58;
            break;
          }
          return _context17.abrupt("return", res.status(400).send({
            message: "El número de teléfono no es válido."
          }));
        case 58:
          if (!(_context17.t2.code === "auth/invalid-password")) {
            _context17.next = 60;
            break;
          }
          return _context17.abrupt("return", res.status(400).send({
            message: "La contraseña es inválida."
          }));
        case 60:
          // En caso de un error inesperado
          res.status(500).send("Error al guardar el usuario");
        case 61:
        case "end":
          return _context17.stop();
      }
    }, _callee16, null, [[0, 43], [2, 11], [32, 37]]);
  }));
  return function SaveTaller(_x47, _x48) {
    return _ref25.apply(this, arguments);
  };
}();
var SaveTallerExtended = /*#__PURE__*/function () {
  var _ref26 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17(req, res) {
    var _req$body3, nombre, cedula, rif, phone, email, password, Direccion, RegComercial, Caracteristicas, Experiencia, LinkFacebook, LinkInstagram, LinkTiktok, seguro, checked, whatsapp, metodos_pago, estado, base64, rifIdFiscal, permisoOperacion, logotipoNegocio, fotoFrenteTaller, fotoInternaTaller, lat, lng, token, horarios_atencion, userRecord, uid, imageUrl, rifIdFiscalUrl, permisoOperacionUrl, logotipoNegocioUrl, fotoFrenteTallerUrl, fotoInternaTallerUrl, buffer, file, _buffer, _file, _buffer2, _file2, _buffer3, _file3, _buffer4, _file4, _buffer5, _file5, infoUserCreated, htmlContent;
    return _regeneratorRuntime().wrap(function _callee17$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          // Recibir los datos del taller desde el cuerpo de la solicitud
          _req$body3 = req.body, nombre = _req$body3.nombre, cedula = _req$body3.cedula, rif = _req$body3.rif, phone = _req$body3.phone, email = _req$body3.email, password = _req$body3.password, Direccion = _req$body3.Direccion, RegComercial = _req$body3.RegComercial, Caracteristicas = _req$body3.Caracteristicas, Experiencia = _req$body3.Experiencia, LinkFacebook = _req$body3.LinkFacebook, LinkInstagram = _req$body3.LinkInstagram, LinkTiktok = _req$body3.LinkTiktok, seguro = _req$body3.seguro, checked = _req$body3.checked, whatsapp = _req$body3.whatsapp, metodos_pago = _req$body3.metodos_pago, estado = _req$body3.estado, base64 = _req$body3.base64, rifIdFiscal = _req$body3.rifIdFiscal, permisoOperacion = _req$body3.permisoOperacion, logotipoNegocio = _req$body3.logotipoNegocio, fotoFrenteTaller = _req$body3.fotoFrenteTaller, fotoInternaTaller = _req$body3.fotoInternaTaller, lat = _req$body3.lat, lng = _req$body3.lng, token = _req$body3.token, horarios_atencion = _req$body3.horarios_atencion;
          _context18.prev = 2;
          _context18.next = 5;
          return admin.auth().getUserByEmail(email);
        case 5:
          userRecord = _context18.sent;
          _context18.next = 8;
          return admin.auth().updateUser(userRecord.uid, {
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: nombre,
            disabled: false
          });
        case 8:
          userRecord = _context18.sent;
          _context18.next = 20;
          break;
        case 11:
          _context18.prev = 11;
          _context18.t0 = _context18["catch"](2);
          if (!(_context18.t0.code === "auth/user-not-found")) {
            _context18.next = 19;
            break;
          }
          _context18.next = 16;
          return admin.auth().createUser({
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: nombre,
            disabled: false
          });
        case 16:
          userRecord = _context18.sent;
          _context18.next = 20;
          break;
        case 19:
          throw _context18.t0;
        case 20:
          // Obtener el UID del usuario
          uid = userRecord.uid; // Subir las imágenes al Storage
          imageUrl = "";
          rifIdFiscalUrl = "";
          permisoOperacionUrl = "";
          logotipoNegocioUrl = "";
          fotoFrenteTallerUrl = "";
          fotoInternaTallerUrl = ""; // Subir imagen de perfil
          if (!(base64 && base64 !== "")) {
            _context18.next = 33;
            break;
          }
          buffer = Buffer.from(base64, "base64");
          file = bucket.file("profileImages/".concat(uid, ".jpg"));
          _context18.next = 32;
          return file.save(buffer, {
            metadata: {
              contentType: "image/jpeg"
            },
            "public": true,
            validation: "md5"
          });
        case 32:
          imageUrl = "https://storage.googleapis.com/".concat(bucket.name, "/profileImages/").concat(uid, ".jpg");
        case 33:
          if (!(rifIdFiscal && rifIdFiscal !== "")) {
            _context18.next = 39;
            break;
          }
          _buffer = Buffer.from(rifIdFiscal, "base64");
          _file = bucket.file("documents/".concat(uid, "/rifIdFiscal.jpg"));
          _context18.next = 38;
          return _file.save(_buffer, {
            metadata: {
              contentType: "image/jpeg"
            },
            "public": true,
            validation: "md5"
          });
        case 38:
          rifIdFiscalUrl = "https://storage.googleapis.com/".concat(bucket.name, "/documents/").concat(uid, "/rifIdFiscal.jpg");
        case 39:
          if (!(permisoOperacion && permisoOperacion !== "")) {
            _context18.next = 45;
            break;
          }
          _buffer2 = Buffer.from(permisoOperacion, "base64");
          _file2 = bucket.file("documents/".concat(uid, "/permisoOperacion.jpg"));
          _context18.next = 44;
          return _file2.save(_buffer2, {
            metadata: {
              contentType: "image/jpeg"
            },
            "public": true,
            validation: "md5"
          });
        case 44:
          permisoOperacionUrl = "https://storage.googleapis.com/".concat(bucket.name, "/documents/").concat(uid, "/permisoOperacion.jpg");
        case 45:
          if (!(logotipoNegocio && logotipoNegocio !== "")) {
            _context18.next = 51;
            break;
          }
          _buffer3 = Buffer.from(logotipoNegocio, "base64");
          _file3 = bucket.file("businessImages/".concat(uid, "/logotipoNegocio.jpg"));
          _context18.next = 50;
          return _file3.save(_buffer3, {
            metadata: {
              contentType: "image/jpeg"
            },
            "public": true,
            validation: "md5"
          });
        case 50:
          logotipoNegocioUrl = "https://storage.googleapis.com/".concat(bucket.name, "/businessImages/").concat(uid, "/logotipoNegocio.jpg");
        case 51:
          if (!(fotoFrenteTaller && fotoFrenteTaller !== "")) {
            _context18.next = 57;
            break;
          }
          _buffer4 = Buffer.from(fotoFrenteTaller, "base64");
          _file4 = bucket.file("businessImages/".concat(uid, "/fotoFrenteTaller.jpg"));
          _context18.next = 56;
          return _file4.save(_buffer4, {
            metadata: {
              contentType: "image/jpeg"
            },
            "public": true,
            validation: "md5"
          });
        case 56:
          fotoFrenteTallerUrl = "https://storage.googleapis.com/".concat(bucket.name, "/businessImages/").concat(uid, "/fotoFrenteTaller.jpg");
        case 57:
          if (!(fotoInternaTaller && fotoInternaTaller !== "")) {
            _context18.next = 63;
            break;
          }
          _buffer5 = Buffer.from(fotoInternaTaller, "base64");
          _file5 = bucket.file("businessImages/".concat(uid, "/fotoInternaTaller.jpg"));
          _context18.next = 62;
          return _file5.save(_buffer5, {
            metadata: {
              contentType: "image/jpeg"
            },
            "public": true,
            validation: "md5"
          });
        case 62:
          fotoInternaTallerUrl = "https://storage.googleapis.com/".concat(bucket.name, "/businessImages/").concat(uid, "/fotoInternaTaller.jpg");
        case 63:
          // Crear o actualizar el documento en la colección "Usuarios" con campos extendidos
          infoUserCreated = {
            uid: uid,
            nombre: nombre == undefined ? '' : nombre,
            rif: rif == undefined ? '' : rif,
            phone: phone == undefined ? '' : phone === null || phone === void 0 ? void 0 : phone.replace(/\s+/g, ""),
            typeUser: 'Taller',
            email: email == undefined ? '' : email.toLowerCase(),
            password: password,
            status: 'En espera por aprobación',
            Direccion: Direccion == undefined ? '' : Direccion,
            RegComercial: RegComercial == undefined ? '' : RegComercial,
            Caracteristicas: Caracteristicas == undefined ? '' : Caracteristicas,
            Experiencia: Experiencia == undefined ? '' : Experiencia,
            LinkFacebook: LinkFacebook == undefined ? '' : LinkFacebook,
            LinkInstagram: LinkInstagram == undefined ? '' : LinkInstagram,
            LinkTiktok: LinkTiktok == undefined ? '' : LinkTiktok,
            seguro: seguro == undefined ? '' : seguro,
            agenteAutorizado: checked == undefined ? false : checked,
            whatsapp: whatsapp == undefined ? '' : whatsapp,
            metodos_pago: metodos_pago == undefined ? [] : metodos_pago,
            estado: estado == undefined ? '' : estado,
            image_perfil: imageUrl,
            // Guardar la URL de la imagen de perfil
            rifIdFiscal: rifIdFiscalUrl,
            // URL del RIF ID Fiscal
            permisoOperacion: permisoOperacionUrl,
            // URL del Permiso de Operación
            logotipoNegocio: logotipoNegocioUrl,
            // URL del Logotipo del Negocio
            fotoFrenteTaller: fotoFrenteTallerUrl,
            // URL de la Foto Frente del Taller
            fotoInternaTaller: fotoInternaTallerUrl,
            // URL de la Foto Interna del Taller
            ubicacion: {
              lat: lat == undefined ? '' : lat,
              lng: lng == undefined ? '' : lng
            },
            token: token,
            createdAt: new Date(),
            horarios_atencion: horarios_atencion == undefined ? [] : horarios_atencion
          };
          _context18.next = 66;
          return db.collection("Usuarios").doc(uid).set(infoUserCreated, {
            merge: true
          });
        case 66:
          htmlContent = "\n      <!DOCTYPE html>\n          <html>\n          <head>\n            <meta charset=\"utf-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <title>Bienvenido a Solvers</title>\n          </head>\n          <body style=\"font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #eef5f9;\">\n            <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width: 600px; width: 100%; margin: 20px auto; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0px 7px 30px 0px rgba(90, 114, 123, 0.11);\">\n              <!-- Header superior con borde azul -->\n              <tr>\n                <td style=\"height: 5px; background: linear-gradient(135deg, #5D87FF 0%, #4669d9 100%);\"></td>\n              </tr>\n\n              <!-- Logo y t\xEDtulo -->\n              <tr>\n                <td style=\"padding: 40px 30px; text-align: center; background-color: #ffffff;\">\n                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\">\n                    <tr>\n                      <td style=\"text-align: center;\">\n                        <img src=\"https://firebasestorage.googleapis.com/v0/b/talleres-solvers-app.firebasestorage.app/o/data%2Flogo%2Fsolverslogo.png?alt=media&token=c2937894-0be6-431b-a0df-4b5288fecfd5\" \n                            alt=\"Solvers Logo\" \n                            style=\"height: 40px; margin-bottom: 20px;\">\n                        <h1 style=\"margin: 0; font-size: 24px; color: #2B3445; font-weight: 600;\">\xA1Bienvenido a <strong>Solvers</strong>! Nos alegra tenerte con nosotros.</h1>\n                      </td>\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n              \n              <!-- Contenido principal -->\n              <tr>\n                <td style=\"padding: 0 30px 30px;\">\n                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\">\n                    <tr>\n                     <td>\n  <h2 style=\"margin: 0 0 20px; color: #2B3445; font-size: 18px; font-weight: 600;\">Hola ".concat(nombre, ",</h2>\n  \n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    Tu taller ha sido registrado exitosamente en nuestra plataforma con informaci\xF3n extendida.\n  </p>\n  \n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    A partir de ahora podr\xE1s recibir solicitudes de clientes que necesitan asistencia con sus veh\xEDculos, gestionar tus servicios, y hacer crecer tu negocio con el respaldo de Solvers.\n  </p>\n  \n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    La cuenta del taller est\xE1 asociada al correo:  \n    <span style=\"color: #5D87FF; font-weight: 600;\">").concat(email, "</span>\n  </p>\n\n  <p style=\"margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;\">\n    Tu solicitud est\xE1 en proceso de revisi\xF3n. Te notificaremos una vez que sea aprobada.\n  </p>\n</td>\n\n\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n              \n              <!-- Footer -->\n              <tr>\n                <td style=\"background-color: #f5f6f8; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;\">\n                  <p style=\"margin: 0 0 10px; color: #2B3445; font-size: 14px; font-weight: 600;\">\n                    Solvers, C.A.\n                  </p>\n                  <p style=\"margin: 0 0 5px; color: #6C757D; font-size: 12px;\">\n                    Este es un correo autom\xE1tico, por favor no respondas a este mensaje.\n                  </p>\n                  <p style=\"margin: 0; color: #6C757D; font-size: 12px;\">\n                    \xA9 ").concat(new Date().getFullYear(), " Solvers, C.A. Todos los derechos reservados.\n                  </p>\n                </td>\n              </tr>\n            </table>\n          </body>\n          </html>\n    ");
          _context18.prev = 67;
          _context18.next = 70;
          return sendEmail(email, htmlContent, '¡Bienvenido a Solvers!');
        case 70:
          _context18.next = 75;
          break;
        case 72:
          _context18.prev = 72;
          _context18.t1 = _context18["catch"](67);
          console.error("Error al enviar el correo de bienvenida:", _context18.t1);
          // No interrumpimos el flujo si falla el envío del correo
        case 75:
          // Responder con el ID del documento creado o actualizado
          res.status(201).send({
            message: "Usuario guardado con éxito",
            uid: uid
          });
          _context18.next = 96;
          break;
        case 78:
          _context18.prev = 78;
          _context18.t2 = _context18["catch"](0);
          console.error("Error al guardar el usuario:", _context18.t2);

          // Manejar errores específicos de Firebase
          if (!(_context18.t2.code === "auth/email-already-exists")) {
            _context18.next = 85;
            break;
          }
          return _context18.abrupt("return", res.status(400).send({
            message: "Este email ya está registrado."
          }));
        case 85:
          if (!(_context18.t2.code === "auth/phone-number-already-exists")) {
            _context18.next = 89;
            break;
          }
          return _context18.abrupt("return", res.status(400).send({
            message: "Este número de teléfono ya está registrado."
          }));
        case 89:
          if (!(_context18.t2.code === "auth/invalid-phone-number")) {
            _context18.next = 93;
            break;
          }
          return _context18.abrupt("return", res.status(400).send({
            message: "El número de teléfono no es válido."
          }));
        case 93:
          if (!(_context18.t2.code === "auth/invalid-password")) {
            _context18.next = 95;
            break;
          }
          return _context18.abrupt("return", res.status(400).send({
            message: "La contraseña es inválida."
          }));
        case 95:
          // En caso de un error inesperado
          res.status(500).send("Error al guardar el usuario");
        case 96:
        case "end":
          return _context18.stop();
      }
    }, _callee17, null, [[0, 78], [2, 11], [67, 72]]);
  }));
  return function SaveTallerExtended(_x49, _x50) {
    return _ref26.apply(this, arguments);
  };
}();

// Función para autenticar usuarios
var authenticateUser = /*#__PURE__*/function () {
  var _ref27 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18(req, res) {
    var _req$body4, email, password, userCredential, user, result, resultAdmin, adminData, userData;
    return _regeneratorRuntime().wrap(function _callee18$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _req$body4 = req.body, email = _req$body4.email, password = _req$body4.password; // Validar que se proporcione el email y la contraseña
          if (!(!email || !password)) {
            _context19.next = 4;
            break;
          }
          return _context19.abrupt("return", res.status(400).send({
            message: "Email y contraseña son requeridos"
          }));
        case 4:
          _context19.next = 6;
          return signInWithEmailAndPassword(auth, email, password);
        case 6:
          userCredential = _context19.sent;
          user = userCredential.user; // Verificar si el usuario está autenticado
          if (user) {
            _context19.next = 10;
            break;
          }
          return _context19.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado"
          }));
        case 10:
          _context19.next = 12;
          return db.collection("Usuarios").where("email", "==", email).get();
        case 12:
          result = _context19.sent;
          if (!result.empty) {
            _context19.next = 25;
            break;
          }
          _context19.next = 16;
          return db.collection("Admins").where("email", "==", email).get();
        case 16:
          resultAdmin = _context19.sent;
          if (!resultAdmin.empty) {
            _context19.next = 21;
            break;
          }
          return _context19.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado ni en Usuarios ni en Admins"
          }));
        case 21:
          // Si se encuentra en "Admins", devolver los datos del usuario y el UID del documento
          adminData = resultAdmin.docs.map(function (doc) {
            return _objectSpread({
              uid: doc.id
            }, doc.data());
          });
          return _context19.abrupt("return", res.status(200).send({
            message: "Usuario autenticado exitosamente como Admin",
            userData: adminData[0] // Enviar el primer documento encontrado con el UID
          }));
        case 23:
          _context19.next = 27;
          break;
        case 25:
          // Si se encuentra en "Usuarios", devolver los datos del usuario y el UID del documento
          userData = result.docs.map(function (doc) {
            return _objectSpread({
              uid: doc.id
            }, doc.data());
          });
          return _context19.abrupt("return", res.status(200).send({
            message: "Usuario autenticado exitosamente",
            userData: userData[0] // Enviar el primer documento encontrado con el UID
          }));
        case 27:
          _context19.next = 41;
          break;
        case 29:
          _context19.prev = 29;
          _context19.t0 = _context19["catch"](0);
          // Manejo de errores
          console.error("Error al autenticar al usuario:", _context19.t0);
          if (!(_context19.t0.code === "auth/user-not-found")) {
            _context19.next = 36;
            break;
          }
          return _context19.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado en Firebase Authentication"
          }));
        case 36:
          if (!(_context19.t0.code === "auth/wrong-password")) {
            _context19.next = 40;
            break;
          }
          return _context19.abrupt("return", res.status(401).send({
            message: "Contraseña incorrecta"
          }));
        case 40:
          return _context19.abrupt("return", res.status(500).send({
            message: "Error al autenticar al usuario",
            error: _context19.t0.message // Incluir detalles para depuración
          }));
        case 41:
        case "end":
          return _context19.stop();
      }
    }, _callee18, null, [[0, 29]]);
  }));
  return function authenticateUser(_x51, _x52) {
    return _ref27.apply(this, arguments);
  };
}();
var getUserByUid = /*#__PURE__*/function () {
  var _ref28 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee19(req, res) {
    var uid, userDoc;
    return _regeneratorRuntime().wrap(function _callee19$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          // Obtener el UID desde los parámetros de la URL
          uid = req.body.uid;
          console.log(uid);

          // Buscar el documento del usuario con el UID en la colección "Usuarios"
          _context20.next = 5;
          return db.collection("Usuarios").doc(uid).get();
        case 5:
          userDoc = _context20.sent;
          if (!userDoc.exists) {
            _context20.next = 14;
            break;
          }
          console.log("Existe");
          console.log(userDoc);
          console.log("***********************************************");
          console.log(userDoc.data());
          // Si el documento existe, devolver los datos del usuario
          return _context20.abrupt("return", res.status(200).send({
            message: "Usuario encontrado",
            userData: userDoc.data() // Devuelve los datos del documento
          }));
        case 14:
          console.log("No Existe");
          // Si el documento no existe, devolver un mensaje de error
          return _context20.abrupt("return", res.status(404).send({
            message: "No se encontró el usuario con el UID proporcionado"
          }));
        case 16:
          _context20.next = 23;
          break;
        case 18:
          _context20.prev = 18;
          _context20.t0 = _context20["catch"](0);
          console.error("Error al obtener el usuario por UID:", _context20.t0);
          console.log("Dio errro");
          res.status(500).send("Error al obtener el usuario");
        case 23:
        case "end":
          return _context20.stop();
      }
    }, _callee19, null, [[0, 18]]);
  }));
  return function getUserByUid(_x53, _x54) {
    return _ref28.apply(this, arguments);
  };
}();
var SaveTallerAll = function SaveTallerAll(req, res) {
  try {
    var _req$body5 = req.body,
      uid = _req$body5.uid,
      base64 = _req$body5.base64,
      imageTodelete = _req$body5.imageTodelete;

    // Verificar que el UID no esté vacío
    if (!uid) {
      return res.status(400).send({
        message: "El UID es obligatorio."
      });
    }
    var getLastImageIndex = function getLastImageIndex() {
      return new Promise(function (resolve, reject) {
        var prefix = "profileImages/".concat(uid);
        bucket.getFiles({
          prefix: prefix
        }).then(function (_ref29) {
          var _ref30 = _slicedToArray(_ref29, 1),
            files = _ref30[0];
          var maxIndex = 0;
          files.forEach(function (file) {
            var match = file.name.match(/(\d+)\.jpg$/);
            if (match) {
              var index = parseInt(match[1], 10);
              if (index > maxIndex) {
                maxIndex = index;
              }
            }
          });
          resolve(maxIndex);
        })["catch"](function (error) {
          reject(error);
        });
      });
    };
    var processImage = function processImage(index) {
      return new Promise(function (resolve, reject) {
        if (base64 && base64.trim() !== '') {
          var newFileName = "profileImages/".concat(uid, "_").concat(index + 1, ".jpg");
          var buffer = Buffer.from(base64, 'base64');
          var file = bucket.file(newFileName);

          // Subir la nueva imagen
          file.save(buffer, {
            metadata: {
              contentType: 'image/jpeg'
            },
            "public": true,
            validation: 'md5'
          }).then(function () {
            var imageUrl = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(newFileName);
            req.body.image_perfil = imageUrl;
            resolve();
          })["catch"](function (error) {
            console.error("Error al guardar la nueva imagen:", error);
            reject(error);
          });
        } else {
          resolve();
        }
      });
    };
    var clearOldImageField = function clearOldImageField() {
      return new Promise(function (resolve, reject) {
        if (base64 && base64.trim() !== '' && imageTodelete && imageTodelete.trim() !== '') {
          db.collection("Usuarios").doc(uid).update({
            image_perfil: admin.firestore.FieldValue["delete"]()
          }).then(function () {
            return resolve();
          })["catch"](function (error) {
            return reject(error);
          });
        } else {
          resolve();
        }
      });
    };
    var deleteOldImage = function deleteOldImage() {
      return new Promise(function (resolve, reject) {
        if (base64 && base64.trim() !== '' && imageTodelete && imageTodelete.trim() !== '') {
          var file = bucket.file("profileImages/".concat(imageTodelete));
          file["delete"]().then(function () {
            return resolve();
          })["catch"](function (error) {
            if (error.code === 404) {
              resolve(); // Resolver incluso si no se encuentra la imagen a eliminar
            } else {
              console.error("Error al eliminar la imagen anterior:", error);
              reject(error);
            }
          });
        } else {
          resolve();
        }
      });
    };

    // Secuencia de ejecución de promesas
    getLastImageIndex().then(function (index) {
      if (base64 && base64.trim() !== '') {
        return clearOldImageField().then(function () {
          return deleteOldImage();
        }).then(function () {
          return processImage(index);
        });
      } else {
        return processImage(index);
      }
    }).then(function () {
      delete req.body.base64;
      delete req.body.imageTodelete;
      return db.collection("Usuarios").doc(uid).set(req.body, {
        merge: true
      });
    }).then(function () {
      // Responder con el ID del documento creado y un mensaje de éxito
      res.status(201).send({
        message: "Usuario actualizado con éxito",
        uid: uid
      });
    })["catch"](function (error) {
      console.error("Error al guardar el usuario:", error);

      // Manejar errores específicos
      if (error.code === "permission-denied") {
        res.status(403).send({
          message: "Permisos insuficientes para guardar el usuario."
        });
      } else if (error.code === "not-found") {
        res.status(404).send({
          message: "Usuario no encontrado."
        });
      } else {
        // Error general
        res.status(500).send({
          message: "Error al guardar el usuario",
          error: error.message
        });
      }
    });
  } catch (error) {
    console.error("Error al guardar el usuario:", error);

    // Manejar errores específicos
    if (error.code === "permission-denied") {
      return res.status(403).send({
        message: "Permisos insuficientes para guardar el usuario."
      });
    } else if (error.code === "not-found") {
      return res.status(404).send({
        message: "Usuario no encontrado."
      });
    }

    // Error general
    res.status(500).send({
      message: "Error al guardar el usuario",
      error: error.message
    });
  }
};
var TALLER_DOC_FIELD_PATHS = {
  rifIdFiscal: function rifIdFiscal(uid, ext) {
    return "documents/".concat(uid, "/rifIdFiscal.").concat(ext);
  },
  permisoOperacion: function permisoOperacion(uid, ext) {
    return "documents/".concat(uid, "/permisoOperacion.").concat(ext);
  },
  logotipoNegocio: function logotipoNegocio(uid, ext) {
    return "businessImages/".concat(uid, "/logotipoNegocio.").concat(ext);
  },
  fotoFrenteTaller: function fotoFrenteTaller(uid, ext) {
    return "businessImages/".concat(uid, "/fotoFrenteTaller.").concat(ext);
  },
  fotoInternaTaller: function fotoInternaTaller(uid, ext) {
    return "businessImages/".concat(uid, "/fotoInternaTaller.").concat(ext);
  }
};
var isWebOrGsUrl = function isWebOrGsUrl(s) {
  var t = String(s).trim();
  return /^https?:\/\//i.test(t) || /^gs:\/\//i.test(t);
};
var parseDataUrlBase64 = function parseDataUrlBase64(s) {
  var t = String(s).trim();
  var m = t.match(/^data:([^;]+);base64,([^]+)$/i);
  if (!m) return null;
  return {
    contentType: m[1].trim(),
    base64: m[2].replace(/\s/g, "")
  };
};
var looksLikeRawBase64 = function looksLikeRawBase64(s) {
  var t = String(s).trim();
  if (!t || isWebOrGsUrl(t) || /^data:/i.test(t)) return false;
  if (t.length < 80) return false;
  var clean = t.replace(/\s/g, "");
  return /^[A-Za-z0-9+/]+=*$/.test(clean);
};
var extAndContentType = function extAndContentType(mime) {
  var m = String(mime || "").toLowerCase();
  if (m.includes("png")) return {
    ext: "png",
    contentType: "image/png"
  };
  if (m.includes("webp")) return {
    ext: "webp",
    contentType: "image/webp"
  };
  if (m.includes("gif")) return {
    ext: "gif",
    contentType: "image/gif"
  };
  return {
    ext: "jpg",
    contentType: "image/jpeg"
  };
};
var uploadBufferToPath = function uploadBufferToPath(path, buffer, contentType) {
  var file = bucket.file(path);
  return file.save(buffer, {
    metadata: {
      contentType: contentType
    },
    "public": true,
    validation: "md5"
  });
};

/**
 * URL o gs:// se dejan igual; data:...;base64,... o base64 largo → Storage → URL;
 * texto corto (p. ej. RIF) se guarda tal cual.
 */
var resolveTallerDocumentacionField = /*#__PURE__*/function () {
  var _ref31 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee20(uid, fieldName, value) {
    var raw, trimmed, dataUrl, buffer, mimeHint, pathFn, _extAndContentType, ext, contentType, storagePath;
    return _regeneratorRuntime().wrap(function _callee20$(_context21) {
      while (1) switch (_context21.prev = _context21.next) {
        case 0:
          raw = value !== null && value !== void 0 ? value : "";
          trimmed = typeof raw === "string" ? raw.trim() : String(raw).trim();
          if (!(trimmed === "")) {
            _context21.next = 4;
            break;
          }
          return _context21.abrupt("return", "");
        case 4:
          if (!isWebOrGsUrl(trimmed)) {
            _context21.next = 6;
            break;
          }
          return _context21.abrupt("return", trimmed);
        case 6:
          dataUrl = parseDataUrlBase64(trimmed);
          mimeHint = "image/jpeg";
          if (!dataUrl) {
            _context21.next = 13;
            break;
          }
          buffer = Buffer.from(dataUrl.base64, "base64");
          mimeHint = dataUrl.contentType || "image/jpeg";
          _context21.next = 18;
          break;
        case 13:
          if (!looksLikeRawBase64(trimmed)) {
            _context21.next = 17;
            break;
          }
          buffer = Buffer.from(trimmed.replace(/\s/g, ""), "base64");
          _context21.next = 18;
          break;
        case 17:
          return _context21.abrupt("return", trimmed);
        case 18:
          pathFn = TALLER_DOC_FIELD_PATHS[fieldName];
          if (pathFn) {
            _context21.next = 21;
            break;
          }
          return _context21.abrupt("return", trimmed);
        case 21:
          _extAndContentType = extAndContentType(mimeHint), ext = _extAndContentType.ext, contentType = _extAndContentType.contentType;
          storagePath = pathFn(uid, ext);
          _context21.next = 25;
          return uploadBufferToPath(storagePath, buffer, contentType);
        case 25:
          return _context21.abrupt("return", "https://storage.googleapis.com/".concat(bucket.name, "/").concat(storagePath));
        case 26:
        case "end":
          return _context21.stop();
      }
    }, _callee20);
  }));
  return function resolveTallerDocumentacionField(_x55, _x56, _x57) {
    return _ref31.apply(this, arguments);
  };
}();
var UpdateTallerUsuarioDocs = /*#__PURE__*/function () {
  var _ref32 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee21(req, res) {
    var payload, uid, base64, imageTodelete, getLastImageIndex, processImage, clearOldImageField, deleteOldImage, index, keys, resolved;
    return _regeneratorRuntime().wrap(function _callee21$(_context22) {
      while (1) switch (_context22.prev = _context22.next) {
        case 0:
          _context22.prev = 0;
          payload = _objectSpread({}, req.body || {});
          uid = payload.uid, base64 = payload.base64, imageTodelete = payload.imageTodelete;
          if (uid) {
            _context22.next = 5;
            break;
          }
          return _context22.abrupt("return", res.status(400).send({
            message: "El UID es obligatorio."
          }));
        case 5:
          // Misma lógica que SaveTallerAll para foto de perfil (base64 / imageTodelete), sobre `payload`.
          getLastImageIndex = function getLastImageIndex() {
            return new Promise(function (resolve, reject) {
              var prefix = "profileImages/".concat(uid);
              bucket.getFiles({
                prefix: prefix
              }).then(function (_ref33) {
                var _ref34 = _slicedToArray(_ref33, 1),
                  files = _ref34[0];
                var maxIndex = 0;
                files.forEach(function (file) {
                  var match = file.name.match(/(\d+)\.jpg$/);
                  if (match) {
                    var _index = parseInt(match[1], 10);
                    if (_index > maxIndex) maxIndex = _index;
                  }
                });
                resolve(maxIndex);
              })["catch"](reject);
            });
          };
          processImage = function processImage(index) {
            return new Promise(function (resolve, reject) {
              if (base64 && base64.trim() !== "") {
                var newFileName = "profileImages/".concat(uid, "_").concat(index + 1, ".jpg");
                var buffer = Buffer.from(base64, "base64");
                var file = bucket.file(newFileName);
                file.save(buffer, {
                  metadata: {
                    contentType: "image/jpeg"
                  },
                  "public": true,
                  validation: "md5"
                }).then(function () {
                  payload.image_perfil = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(newFileName);
                  resolve();
                })["catch"](function (error) {
                  console.error("Error al guardar la nueva imagen:", error);
                  reject(error);
                });
              } else {
                resolve();
              }
            });
          };
          clearOldImageField = function clearOldImageField() {
            return new Promise(function (resolve, reject) {
              if (base64 && base64.trim() !== "" && imageTodelete && imageTodelete.trim() !== "") {
                db.collection("Usuarios").doc(uid).update({
                  image_perfil: admin.firestore.FieldValue["delete"]()
                }).then(function () {
                  return resolve();
                })["catch"](reject);
              } else {
                resolve();
              }
            });
          };
          deleteOldImage = function deleteOldImage() {
            return new Promise(function (resolve, reject) {
              if (base64 && base64.trim() !== "" && imageTodelete && imageTodelete.trim() !== "") {
                var file = bucket.file("profileImages/".concat(imageTodelete));
                file["delete"]().then(function () {
                  return resolve();
                })["catch"](function (error) {
                  if (error.code === 404) {
                    resolve();
                  } else {
                    console.error("Error al eliminar la imagen anterior:", error);
                    reject(error);
                  }
                });
              } else {
                resolve();
              }
            });
          };
          _context22.next = 11;
          return getLastImageIndex();
        case 11:
          index = _context22.sent;
          if (!(base64 && base64.trim() !== "")) {
            _context22.next = 17;
            break;
          }
          _context22.next = 15;
          return clearOldImageField();
        case 15:
          _context22.next = 17;
          return deleteOldImage();
        case 17:
          _context22.next = 19;
          return processImage(index);
        case 19:
          keys = ["rifIdFiscal", "permisoOperacion", "logotipoNegocio", "fotoFrenteTaller", "fotoInternaTaller"];
          _context22.next = 22;
          return Promise.all(keys.map(function (k) {
            var _payload$k;
            return resolveTallerDocumentacionField(uid, k, (_payload$k = payload[k]) !== null && _payload$k !== void 0 ? _payload$k : "").then(function (v) {
              return [k, v];
            });
          }));
        case 22:
          resolved = _context22.sent;
          resolved.forEach(function (_ref35) {
            var _ref36 = _slicedToArray(_ref35, 2),
              k = _ref36[0],
              v = _ref36[1];
            payload[k] = v;
          });
          delete payload.base64;
          delete payload.imageTodelete;
          Object.keys(payload).forEach(function (k) {
            if (payload[k] === undefined) delete payload[k];
          });
          _context22.next = 29;
          return db.collection("Usuarios").doc(uid).set(payload, {
            merge: true
          });
        case 29:
          return _context22.abrupt("return", res.status(201).send({
            message: "Usuario actualizado con éxito",
            uid: uid
          }));
        case 32:
          _context22.prev = 32;
          _context22.t0 = _context22["catch"](0);
          console.error("Error al actualizar documentación del taller:", _context22.t0);
          if (!(_context22.t0.code === "permission-denied")) {
            _context22.next = 37;
            break;
          }
          return _context22.abrupt("return", res.status(403).send({
            message: "Permisos insuficientes para guardar el usuario."
          }));
        case 37:
          if (!(_context22.t0.code === "not-found")) {
            _context22.next = 39;
            break;
          }
          return _context22.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado."
          }));
        case 39:
          return _context22.abrupt("return", res.status(500).send({
            message: "Error al guardar el usuario",
            error: _context22.t0.message
          }));
        case 40:
        case "end":
          return _context22.stop();
      }
    }, _callee21, null, [[0, 32]]);
  }));
  return function UpdateTallerUsuarioDocs(_x58, _x59) {
    return _ref32.apply(this, arguments);
  };
}();
var restorePass = /*#__PURE__*/function () {
  var _ref37 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee22(req, res) {
    var email, link, htmlContent;
    return _regeneratorRuntime().wrap(function _callee22$(_context23) {
      while (1) switch (_context23.prev = _context23.next) {
        case 0:
          email = req.body.email;
          if (email) {
            _context23.next = 3;
            break;
          }
          return _context23.abrupt("return", res.status(400).json({
            message: "El campo email es obligatorio"
          }));
        case 3:
          _context23.prev = 3;
          _context23.next = 6;
          return admin.auth().generatePasswordResetLink(email);
        case 6:
          link = _context23.sent;
          if (!(!link || typeof link !== 'string')) {
            _context23.next = 9;
            break;
          }
          throw new Error("No se pudo generar el link de restablecimiento");
        case 9:
          // HTML con enlace seguro
          htmlContent = "\n      <div style=\"font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;\">\n        <div style=\"background-color: #1e3a8a; padding: 40px 30px; text-align: center;\">\n          <h1 style=\"color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;\">Restablecer Contrase\xF1a</h1>\n        </div>\n        <div style=\"padding: 40px 30px;\">\n          <h2 style=\"color: #1e40af; margin: 0 0 20px 0; font-size: 24px; font-weight: 500;\">Hola,</h2>\n          <p style=\"color: #000000; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;\">\n            Hemos recibido una solicitud para restablecer la contrase\xF1a de tu cuenta.\n          </p>\n          <p style=\"color: #000000; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;\">\n            Usa el siguiente enlace para cambiar tu contrase\xF1a:\n          </p>\n          <div style=\"background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;\">\n            <p style=\"color: #1d4ed8; text-decoration: underline; font-weight: 600; font-size: 16px; word-break: break-all; line-height: 1.4;\">\n              ".concat(String(link), "\n            </p>\n          </div>\n          <p style=\"color: #3730a3; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0; text-align: center;\">\n            Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.\n          </p>\n        </div>\n        <div style=\"background-color: #eff6ff; padding: 20px 30px; text-align: center; border-top: 1px solid #bfdbfe;\">\n          <p style=\"color: #3730a3; font-size: 12px; margin: 0; line-height: 1.4;\">\n            Este enlace expirar\xE1 en 24 horas por motivos de seguridad.\n          </p>\n        </div>\n      </div>\n    "); // Enviar email
          _context23.next = 12;
          return sendEmail(email, htmlContent, 'Restablecer contraseña');
        case 12:
          res.status(200).json({
            message: "Si el correo existe, se enviará un enlace para restablecer la contraseña"
          });
          _context23.next = 19;
          break;
        case 15:
          _context23.prev = 15;
          _context23.t0 = _context23["catch"](3);
          console.error("❌ Error generando link:", _context23.t0);
          res.status(500).json({
            message: "Hubo un error al procesar la solicitud"
          });
        case 19:
        case "end":
          return _context23.stop();
      }
    }, _callee22, null, [[3, 15]]);
  }));
  return function restorePass(_x60, _x61) {
    return _ref37.apply(this, arguments);
  };
}();
var getTalleres = /*#__PURE__*/function () {
  var _ref38 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee23(req, res) {
    var estado, query, result, usuarios;
    return _regeneratorRuntime().wrap(function _callee23$(_context24) {
      while (1) switch (_context24.prev = _context24.next) {
        case 0:
          _context24.prev = 0;
          estado = req.body.estado; // Hacer la consulta base sin el filtro de estado
          _context24.next = 4;
          return db.collection("Usuarios")
          // .where("status", "!=", "Aprobado")
          .where("status", "==", "En espera por aprobación").where("typeUser", "==", "Taller");
        case 4:
          query = _context24.sent;
          _context24.next = 7;
          return query.get();
        case 7:
          result = _context24.sent;
          if (!result.empty) {
            _context24.next = 10;
            break;
          }
          return _context24.abrupt("return", res.status(404).send('No se encontraron usuarios con el tipo "Taller"'));
        case 10:
          usuarios = result.docs.map(function (doc) {
            return doc.data();
          }); // Filtrar en memoria según el estado
          if (!Array.isArray(estado)) {
            _context24.next = 17;
            break;
          }
          if (!(estado.length === 0)) {
            _context24.next = 14;
            break;
          }
          return _context24.abrupt("return", res.status(400).send("El array de estados está vacío."));
        case 14:
          // Filtrar los usuarios cuyo estado esté en el array
          usuarios = usuarios.filter(function (usuario) {
            return estado.includes(usuario.estado);
          });
          _context24.next = 23;
          break;
        case 17:
          if (!(typeof estado === "string")) {
            _context24.next = 21;
            break;
          }
          // Filtrar los usuarios con ese estado específico
          usuarios = usuarios.filter(function (usuario) {
            return usuario.estado === estado;
          });
          _context24.next = 23;
          break;
        case 21:
          if (!(estado !== undefined)) {
            _context24.next = 23;
            break;
          }
          return _context24.abrupt("return", res.status(400).send("El parámetro 'estado' debe ser un string o un array de strings."));
        case 23:
          res.send(usuarios);
          _context24.next = 30;
          break;
        case 26:
          _context24.prev = 26;
          _context24.t0 = _context24["catch"](0);
          console.error("Error al obtener usuarios:", _context24.t0);
          res.status(500).send("Error al obtener usuarios");
        case 30:
        case "end":
          return _context24.stop();
      }
    }, _callee23, null, [[0, 26]]);
  }));
  return function getTalleres(_x62, _x63) {
    return _ref38.apply(this, arguments);
  };
}();
var actualizarStatusUsuario = /*#__PURE__*/function () {
  var _ref39 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee24(req, res) {
    var _req$body6, _uid, nuevoStatus, certificador_nombre, certificador_key, motivoRechazo, updateData;
    return _regeneratorRuntime().wrap(function _callee24$(_context25) {
      while (1) switch (_context25.prev = _context25.next) {
        case 0:
          _context25.prev = 0;
          // Obtener el UID y el nuevo estado desde el cuerpo de la solicitud
          _req$body6 = req.body, _uid = _req$body6.uid, nuevoStatus = _req$body6.nuevoStatus, certificador_nombre = _req$body6.certificador_nombre, certificador_key = _req$body6.certificador_key, motivoRechazo = _req$body6.motivoRechazo; // Verificar que se haya proporcionado un UID y un nuevo estado
          if (!(!_uid || !nuevoStatus)) {
            _context25.next = 4;
            break;
          }
          return _context25.abrupt("return", res.status(400).send({
            message: "El UID y el nuevo estado son requeridos"
          }));
        case 4:
          // Construir el objeto de actualización
          updateData = {
            status: nuevoStatus,
            certificador_nombre: certificador_nombre,
            certificador_key: certificador_key
          }; // Incluir motivo de rechazo solo cuando aplica
          if (nuevoStatus === 'Rechazado' && motivoRechazo) {
            updateData.motivoRechazo = motivoRechazo;
          }

          // Actualizar el campo 'status' en el documento del usuario
          _context25.next = 8;
          return db.collection("Usuarios").doc(_uid).update(updateData);
        case 8:
          return _context25.abrupt("return", res.status(200).send({
            message: "El estado del usuario ha sido actualizado exitosamente"
          }));
        case 11:
          _context25.prev = 11;
          _context25.t0 = _context25["catch"](0);
          console.error("Error al actualizar el estado del usuario:", _context25.t0);
          return _context25.abrupt("return", res.status(500).send({
            message: "Error al actualizar el estado del usuario",
            error: _context25.t0.message // Incluir detalles para depuración
          }));
        case 15:
        case "end":
          return _context25.stop();
      }
    }, _callee24, null, [[0, 11]]);
  }));
  return function actualizarStatusUsuario(_x64, _x65) {
    return _ref39.apply(this, arguments);
  };
}();
var UpdateTaller = /*#__PURE__*/function () {
  var _ref40 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee25(req, res) {
    var _req$body7, _uid2, nombre, rif, phone, email, Direccion, RegComercial, Caracteristicas, Tarifa, Experiencia, LinkFacebook, LinkInstagram, LinkTiktok, Garantia, seguro, agenteAutorizado, updatedUserInfo;
    return _regeneratorRuntime().wrap(function _callee25$(_context26) {
      while (1) switch (_context26.prev = _context26.next) {
        case 0:
          _context26.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _req$body7 = req.body, _uid2 = _req$body7.uid, nombre = _req$body7.nombre, rif = _req$body7.rif, phone = _req$body7.phone, email = _req$body7.email, Direccion = _req$body7.Direccion, RegComercial = _req$body7.RegComercial, Caracteristicas = _req$body7.Caracteristicas, Tarifa = _req$body7.Tarifa, Experiencia = _req$body7.Experiencia, LinkFacebook = _req$body7.LinkFacebook, LinkInstagram = _req$body7.LinkInstagram, LinkTiktok = _req$body7.LinkTiktok, Garantia = _req$body7.Garantia, seguro = _req$body7.seguro, agenteAutorizado = _req$body7.agenteAutorizado; // Crear el objeto con los datos que se actualizarán en la colección "Usuarios"
          updatedUserInfo = {
            uid: _uid2,
            nombre: nombre == undefined ? "" : nombre,
            rif: rif == undefined ? "" : rif,
            phone: phone == undefined ? "" : phone,
            typeUser: "Taller",
            email: email == undefined ? "" : email,
            Direccion: Direccion == undefined ? "" : Direccion,
            RegComercial: RegComercial == undefined ? "" : RegComercial,
            Caracteristicas: Caracteristicas == undefined ? "" : Caracteristicas,
            Tarifa: Tarifa == undefined ? "" : Tarifa,
            Experiencia: Experiencia == undefined ? "" : Experiencia,
            LinkFacebook: LinkFacebook == undefined ? "" : LinkFacebook,
            LinkInstagram: LinkInstagram == undefined ? "" : LinkInstagram,
            LinkTiktok: LinkTiktok == undefined ? "" : LinkTiktok,
            Garantia: Garantia == undefined ? "" : Garantia,
            seguro: seguro == undefined ? "" : seguro,
            agenteAutorizado: agenteAutorizado == undefined ? false : agenteAutorizado
          }; // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
          _context26.next = 5;
          return db.collection("Usuarios").doc(_uid2).update(updatedUserInfo);
        case 5:
          // Responder con un mensaje de éxito
          res.status(200).send({
            message: "Usuario actualizado con éxito",
            uid: _uid2
          });
          _context26.next = 12;
          break;
        case 8:
          _context26.prev = 8;
          _context26.t0 = _context26["catch"](0);
          console.error("Error al actualizar el usuario:", _context26.t0);

          // En caso de error, responder con el mensaje correspondiente
          res.status(500).send({
            message: "Error al actualizar el usuario",
            error: _context26.t0.message
          });
        case 12:
        case "end":
          return _context26.stop();
      }
    }, _callee25, null, [[0, 8]]);
  }));
  return function UpdateTaller(_x66, _x67) {
    return _ref40.apply(this, arguments);
  };
}();
var UpdateClient = /*#__PURE__*/function () {
  var _ref41 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee26(req, res) {
    var _req$body8, _uid3, Nombre, cedula, phone, email, _base, _imageTodelete, estado, updatedUserInfo, getLastImageIndex, processImage, deleteOldImage;
    return _regeneratorRuntime().wrap(function _callee26$(_context27) {
      while (1) switch (_context27.prev = _context27.next) {
        case 0:
          try {
            // Recibir los datos del cliente desde el cuerpo de la solicitud
            _req$body8 = req.body, _uid3 = _req$body8.uid, Nombre = _req$body8.Nombre, cedula = _req$body8.cedula, phone = _req$body8.phone, email = _req$body8.email, _base = _req$body8.base64, _imageTodelete = _req$body8.imageTodelete, estado = _req$body8.estado; // Crear el objeto que se actualizará en la colección "Usuarios"
            updatedUserInfo = {
              nombre: Nombre,
              cedula: cedula,
              phone: phone,
              typeUser: "Cliente",
              email: email,
              uid: _uid3,
              estado: estado
            };
            getLastImageIndex = function getLastImageIndex() {
              return new Promise(function (resolve, reject) {
                var prefix = "profileImages/".concat(_uid3);
                bucket.getFiles({
                  prefix: prefix
                }).then(function (_ref42) {
                  var _ref43 = _slicedToArray(_ref42, 1),
                    files = _ref43[0];
                  var maxIndex = 0;
                  files.forEach(function (file) {
                    var match = file.name.match(/(\d+)\.jpg$/);
                    if (match) {
                      var index = parseInt(match[1], 10);
                      if (index > maxIndex) {
                        maxIndex = index;
                      }
                    }
                  });
                  resolve(maxIndex);
                })["catch"](function (error) {
                  reject(error);
                });
              });
            };
            processImage = function processImage(index) {
              return new Promise(function (resolve, reject) {
                if (_base && _base.trim() !== '') {
                  var newFileName = "profileImages/".concat(_uid3, "_").concat(index + 1, ".jpg");
                  var buffer = Buffer.from(_base, 'base64');
                  var file = bucket.file(newFileName);

                  // Subir la nueva imagen
                  file.save(buffer, {
                    metadata: {
                      contentType: 'image/jpeg'
                    },
                    "public": true,
                    validation: 'md5'
                  }).then(function () {
                    var imageUrl = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(newFileName);
                    updatedUserInfo.image_perfil = imageUrl;
                    resolve();
                  })["catch"](function (error) {
                    console.error("Error al guardar la nueva imagen:", error);
                    reject(error);
                  });
                } else {
                  resolve();
                }
              });
            };
            deleteOldImage = function deleteOldImage() {
              return new Promise(function (resolve, reject) {
                if (_imageTodelete && _imageTodelete.trim() !== '') {
                  var file = bucket.file("profileImages/".concat(_imageTodelete));
                  file["delete"]().then(function () {
                    return resolve();
                  })["catch"](function (error) {
                    if (error.code === 404) {
                      resolve(); // Resolver incluso si no se encuentra la imagen a eliminar
                    } else {
                      console.error("Error al eliminar la imagen anterior:", error);
                      reject(error);
                    }
                  });
                } else {
                  resolve();
                }
              });
            };
            getLastImageIndex().then(function (index) {
              return processImage(index);
            }).then(function () {
              // Eliminar el campo base64 y imageTodelete del cuerpo de la solicitud
              delete req.body.base64;
              delete req.body.imageTodelete;
            }).then(function () {
              return db.collection("Usuarios").doc(_uid3).update(updatedUserInfo);
            }).then(function () {
              if (_imageTodelete && _imageTodelete.trim() !== '') {
                return deleteOldImage();
              }
            }).then(function () {
              // Responder con un mensaje de éxito
              res.status(200).send({
                message: "Usuario actualizado con éxito",
                uid: _uid3
              });
            })["catch"](function (error) {
              console.error("Error al actualizar el usuario:", error);

              // Manejar posibles errores en la actualización del documento
              res.status(500).send("Error al actualizar el usuario");
            });
          } catch (error) {
            console.error("Error al actualizar el usuario:", error);

            // Manejar posibles errores en la actualización del documento
            res.status(500).send("Error al actualizar el usuario");
          }
        case 1:
        case "end":
          return _context27.stop();
      }
    }, _callee26);
  }));
  return function UpdateClient(_x68, _x69) {
    return _ref41.apply(this, arguments);
  };
}();
var getServicesByTalleruid = /*#__PURE__*/function () {
  var _ref44 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee27(req, res) {
    var uid_taller, servicesSnapshot, services;
    return _regeneratorRuntime().wrap(function _callee27$(_context28) {
      while (1) switch (_context28.prev = _context28.next) {
        case 0:
          _context28.prev = 0;
          // Obtener el UID_TALLER desde el cuerpo de la solicitud
          uid_taller = req.body.uid_taller;
          console.log(uid_taller);

          // Buscar en la colección "Servicios" los documentos donde uid_taller coincide
          _context28.next = 5;
          return db.collection("Servicios").where("uid_taller", "==", uid_taller).get();
        case 5:
          servicesSnapshot = _context28.sent;
          if (!servicesSnapshot.empty) {
            _context28.next = 9;
            break;
          }
          console.log("No se encontraron servicios para el UID_TALLER proporcionado");
          return _context28.abrupt("return", res.status(404).send({
            message: "No se encontraron servicios para el UID_TALLER proporcionado"
          }));
        case 9:
          // Mapear los datos de los documentos encontrados en un array
          services = servicesSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Enviar los servicios encontrados
          return _context28.abrupt("return", res.status(200).send({
            message: "Servicios encontrados",
            services: services
          }));
        case 13:
          _context28.prev = 13;
          _context28.t0 = _context28["catch"](0);
          console.error("Error al obtener los servicios por UID_TALLER:", _context28.t0);
          res.status(500).send("Error al obtener los servicios");
        case 17:
        case "end":
          return _context28.stop();
      }
    }, _callee27, null, [[0, 13]]);
  }));
  return function getServicesByTalleruid(_x70, _x71) {
    return _ref44.apply(this, arguments);
  };
}();
var getServiceByUid = /*#__PURE__*/function () {
  var _ref45 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee28(req, res) {
    var _uid4, serviceSnapshot, serviceData;
    return _regeneratorRuntime().wrap(function _callee28$(_context29) {
      while (1) switch (_context29.prev = _context29.next) {
        case 0:
          _context29.prev = 0;
          // Obtener el UID del servicio desde el cuerpo de la solicitud
          _uid4 = req.body.uid;
          console.log("UID del servicio:", _uid4);

          // Buscar el documento en la colección "Servicios" donde el campo "uid" coincide
          _context29.next = 5;
          return db.collection("Servicios").doc(_uid4).get();
        case 5:
          serviceSnapshot = _context29.sent;
          if (serviceSnapshot.exists) {
            _context29.next = 9;
            break;
          }
          console.log("No se encontró el servicio con el UID proporcionado");
          return _context29.abrupt("return", res.status(404).send({
            message: "No se encontró el servicio con el UID proporcionado"
          }));
        case 9:
          // Obtener los datos del documento encontrado
          serviceData = _objectSpread({
            id: serviceSnapshot.id
          }, serviceSnapshot.data()); // Enviar el servicio encontrado
          return _context29.abrupt("return", res.status(200).send({
            message: "Servicio encontrado",
            service: serviceData
          }));
        case 13:
          _context29.prev = 13;
          _context29.t0 = _context29["catch"](0);
          console.error("Error al obtener el servicio por UID:", _context29.t0);
          res.status(500).send("Error al obtener el servicio");
        case 17:
        case "end":
          return _context29.stop();
      }
    }, _callee28, null, [[0, 13]]);
  }));
  return function getServiceByUid(_x72, _x73) {
    return _ref45.apply(this, arguments);
  };
}();
var getServicesByTallerUidTrue = /*#__PURE__*/function () {
  var _ref46 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee29(req, res) {
    var _ref47, _uid5, serviceSnapshot, services;
    return _regeneratorRuntime().wrap(function _callee29$(_context30) {
      while (1) switch (_context30.prev = _context30.next) {
        case 0:
          _context30.prev = 0;
          // Obtener el UID del taller desde el cuerpo de la solicitud
          _ref47 = req.body || {}, _uid5 = _ref47.uid;
          console.log("UID del taller:", _uid5);
          if (!(!_uid5 || typeof _uid5 !== "string" || _uid5.trim() === "")) {
            _context30.next = 5;
            break;
          }
          return _context30.abrupt("return", res.status(400).send({
            message: "El campo uid es requerido."
          }));
        case 5:
          console.log("UID del servicio:", _uid5);

          // Buscar los servicios del taller
          _context30.next = 8;
          return db.collection("Servicios").where("uid_taller", "==", _uid5.trim()).where("estatus", "==", true).get();
        case 8:
          serviceSnapshot = _context30.sent;
          if (!serviceSnapshot.empty) {
            _context30.next = 12;
            break;
          }
          console.log("No se encontraron servicios para el UID proporcionado");
          return _context30.abrupt("return", res.status(404).send({
            message: "No se encontraron servicios para el UID proporcionado"
          }));
        case 12:
          // Obtener los datos de los documentos encontrados
          services = serviceSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Enviar los servicios encontrados
          return _context30.abrupt("return", res.status(200).send({
            message: "Servicios encontrados",
            services: services
          }));
        case 16:
          _context30.prev = 16;
          _context30.t0 = _context30["catch"](0);
          console.error("Error al obtener el servicio por UID:", _context30.t0);
          res.status(500).send("Error al obtener el servicio");
        case 20:
        case "end":
          return _context30.stop();
      }
    }, _callee29, null, [[0, 16]]);
  }));
  return function getServicesByTallerUidTrue(_x74, _x75) {
    return _ref46.apply(this, arguments);
  };
}();
var getActiveCategories = /*#__PURE__*/function () {
  var _ref48 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee30(req, res) {
    var categoriesSnapshot, categories;
    return _regeneratorRuntime().wrap(function _callee30$(_context31) {
      while (1) switch (_context31.prev = _context31.next) {
        case 0:
          _context31.prev = 0;
          _context31.next = 3;
          return db.collection("Categorias").where("estatus", "==", true).get();
        case 3:
          categoriesSnapshot = _context31.sent;
          if (!categoriesSnapshot.empty) {
            _context31.next = 7;
            break;
          }
          console.log("No se encontraron categorías activas");
          return _context31.abrupt("return", res.status(404).send({
            message: "No se encontraron categorías activas"
          }));
        case 7:
          // Mapear los datos de los documentos encontrados en un array
          categories = categoriesSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Enviar las categorías activas encontradas
          return _context31.abrupt("return", res.status(200).send({
            message: "Categorías activas encontradas",
            categories: categories
          }));
        case 11:
          _context31.prev = 11;
          _context31.t0 = _context31["catch"](0);
          console.error("Error al obtener las categorías activas:", _context31.t0);
          res.status(500).send("Error al obtener las categorías activas");
        case 15:
        case "end":
          return _context31.stop();
      }
    }, _callee30, null, [[0, 11]]);
  }));
  return function getActiveCategories(_x76, _x77) {
    return _ref48.apply(this, arguments);
  };
}();
var getSubcategoriesByCategoryUid = /*#__PURE__*/function () {
  var _ref49 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee31(req, res) {
    var uid_categoria, subcategoriesSnapshot, subcategories;
    return _regeneratorRuntime().wrap(function _callee31$(_context32) {
      while (1) switch (_context32.prev = _context32.next) {
        case 0:
          _context32.prev = 0;
          // Obtener el UID de la categoría desde el cuerpo de la solicitud
          uid_categoria = req.body.uid_categoria;
          console.log("UID de la categor\xEDa: ".concat(uid_categoria));

          // Referencia a la subcolección "Subcategoría" dentro del documento de la categoría especificada
          _context32.next = 5;
          return db.collection("Categorias").doc(uid_categoria).collection("Subcategorias").where("estatus", "==", true) // Filtro para obtener solo subcategorías activas
          .get();
        case 5:
          subcategoriesSnapshot = _context32.sent;
          if (!subcategoriesSnapshot.empty) {
            _context32.next = 9;
            break;
          }
          console.log("No se encontraron subcategorías para la categoría proporcionada");
          return _context32.abrupt("return", res.status(404).send({
            message: "No se encontraron subcategorías para la categoría proporcionada"
          }));
        case 9:
          // Mapear los datos de los documentos encontrados en un array
          subcategories = subcategoriesSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Enviar las subcategorías encontradas
          return _context32.abrupt("return", res.status(200).send({
            message: "Subcategorías encontradas",
            subcategories: subcategories
          }));
        case 13:
          _context32.prev = 13;
          _context32.t0 = _context32["catch"](0);
          console.error("Error al obtener las subcategorías por UID de categoría:", _context32.t0);
          res.status(500).send("Error al obtener las subcategorías");
        case 17:
        case "end":
          return _context32.stop();
      }
    }, _callee31, null, [[0, 13]]);
  }));
  return function getSubcategoriesByCategoryUid(_x78, _x79) {
    return _ref49.apply(this, arguments);
  };
}();

// const saveOrUpdateService = async (req, res) => {
//   try {
//     // Obtener los datos del servicio desde el cuerpo de la solicitud
//     const {
//       id,
//       categoria,
//       descripcion,
//       estatus,
//       garantia,
//       nombre_servicio,
//       precio,
//       subcategoria,
//       taller,
//       uid_categoria,
//       uid_servicio,
//       uid_subcategoria,
//       uid_taller,
//       puntuacion,
//       publicOrigin,
//       base64,
//       imageTodelete
//     } = req.body;

//     console.log("Datos del servicio:", req.body);

//     const serviceData = {
//       categoria,
//       descripcion,
//       estatus,
//       garantia,
//       nombre_servicio,
//       precio,
//       subcategoria,
//       taller,
//       uid_categoria,
//       uid_servicio,
//       uid_subcategoria,
//       uid_taller,
//       puntuacion
//     };

//     const getLastImageIndex = (id) => {
//       return new Promise((resolve, reject) => {
//         const prefix = `service_images/${id}`;
//         bucket.getFiles({ prefix })
//           .then(([files]) => {
//             let maxIndex = 0;
//             files.forEach(file => {
//               const match = file.name.match(/_(\d+)\.jpg$/);
//               if (match) {
//                 const index = parseInt(match[1], 10);
//                 if (index > maxIndex) {
//                   maxIndex = index;
//                 }
//               }
//             });
//             resolve(maxIndex);
//           })
//           .catch(error => {
//             reject(error);
//           });
//       });
//     };

//     const processImage = async (id) => {
//       let imageUrl = '';
//       if (base64 && base64.trim() !== '') {
//         const index = await getLastImageIndex(id);
//         const newFileName = `service_images/${id}_${index + 1}.jpg`;
//         const buffer = Buffer.from(base64, 'base64');
//         const file = bucket.file(newFileName);

//         await file.save(buffer, {
//           metadata: { contentType: 'image/jpeg' },
//           public: true,
//           validation: 'md5'
//         });

//         imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
//         serviceData.image = imageUrl;
//       }
//       return imageUrl;
//     };

//     const deleteOldImage = () => {
//       return new Promise((resolve, reject) => {
//         if (base64 && base64.trim() !== '' && imageTodelete && imageTodelete.trim() !== '') {
//           const file = bucket.file(`service_images/${imageTodelete}`);
//           file.delete()
//             .then(() => resolve())
//             .catch(error => {
//               if (error.code === 404) {
//                 resolve(); // Resolver incluso si no se encuentra la imagen a eliminar
//               } else {
//                 console.error("Error al eliminar la imagen anterior:", error);
//                 reject(error);
//               }
//             });
//         } else {
//           resolve();
//         }
//       });
//     };

//     // Si `id` tiene un valor, editar el documento en la colección "Servicios"
//     if (id) {
//       const serviceRef = db.collection("Servicios").doc(id);
//       const serviceSnapshot = await serviceRef.get();

//       if (!serviceSnapshot.exists) {
//         return res.status(404).send({
//           message: "No se encontró el servicio con el ID proporcionado para actualizar",
//         });
//       }

//       await serviceRef.update(serviceData);
//       console.log("Servicio actualizado:", id);

//       if (serviceData.estatus) {
//         if (!publicOrigin) {
//           const userId = uid_taller;
//           const userRef = db.collection("Usuarios").doc(userId);
//           const userDoc = await userRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
//             cantidadServicios -= 1;

//             await userRef.update({
//               "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
//             });
//           }
//         }

//         const imageUrl = await processImage(id);
//         await deleteOldImage();

//         if (base64 && base64.trim() !== '') {
//           // Actualizar el campo service_image en el documento del servicio solo si el base64 no está vacío ni es nulo
//           await serviceRef.update({ service_image: imageUrl });
//         }

//         return res.status(200).send({
//           message: "Servicio actualizado exitosamente",
//           service: { id, ...serviceData },
//         });
//       } else {
//         if (publicOrigin) {
//           const userId = uid_taller;
//           const userRef = db.collection("Usuarios").doc(userId);
//           const userDoc = await userRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
//             cantidadServicios += 1;

//             await userRef.update({
//               "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
//             });
//           }
//         }

//         const imageUrl = await processImage(id);
//         await deleteOldImage();

//         if (base64 && base64.trim() !== '') {
//           // Actualizar el campo service_image en el documento del servicio solo si el base64 no está vacío ni es nulo
//           await serviceRef.update({ service_image: imageUrl });
//         }

//         return res.status(200).send({
//           message: "Servicio actualizado exitosamente",
//           service: { id, ...serviceData },
//         });
//       }
//     } else {
//       const newServiceRef = await db.collection("Servicios").add(serviceData);
//       console.log("Servicio creado con ID:", newServiceRef.id);

//       if (serviceData.estatus) {
//         if (!publicOrigin) {
//           const userId = uid_taller;
//           const userRef = db.collection("Usuarios").doc(userId);
//           const userDoc = await userRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
//             cantidadServicios -= 1;

//             await userRef.update({
//               "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
//             });
//           }
//         }

//         serviceData.id = newServiceRef.id;
//         const imageUrl = await processImage(newServiceRef.id);
//         await deleteOldImage();

//         if (base64 && base64.trim() !== '') {
//           // Actualizar el campo service_image en el documento del servicio solo si el base64 no está vacío ni es nulo
//           await newServiceRef.update({ service_image: imageUrl });
//         }

//         return res.status(201).send({
//           message: "Servicio creado exitosamente",
//           service: { id: newServiceRef.id, ...serviceData },
//         });
//       } else {
//         if (publicOrigin) {
//           const userId = uid_taller;
//           const userRef = db.collection("Usuarios").doc(userId);
//           const userDoc = await userRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
//             cantidadServicios += 1;

//             await userRef.update({
//               "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
//             });
//           }
//         }

//         serviceData.id = newServiceRef.id;
//         const imageUrl = await processImage(newServiceRef.id);
//         await deleteOldImage();

//         if (base64 && base64.trim() !== '') {
//           // Actualizar el campo service_image en el documento del servicio solo si el base64 no está vacío ni es nulo
//           await newServiceRef.update({ service_image: imageUrl });
//         }

//         return res.status(201).send({
//           message: "Servicio creado exitosamente",
//           service: { id: newServiceRef.id, ...serviceData },
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error al guardar o actualizar el servicio:", error);
//     res.status(500).send(error);
//   }
// };

var saveOrUpdateService = /*#__PURE__*/function () {
  var _ref50 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee34(req, res) {
    var _req$body9, id, categoria, descripcion, estatus, garantia, nombre_servicio, precio, subcategoria, taller, uid_categoria, uid_servicio, uid_subcategoria, uid_taller, puntuacion, publicOrigin, images, edit, serviceData, getLastImageIndex, uploadImages, deleteOldImages, serviceRef, serviceSnapshot, userId, userRef, userDoc, userData, cantidadServicios, imageUrls, _userId, _userRef, _userDoc, _userData, _cantidadServicios, _imageUrls, newServiceRef, _userId2, _userRef2, _userDoc2, _userData2, _cantidadServicios2, _imageUrls2, _userId3, _userRef3, _userDoc3, _userData3, _cantidadServicios3, _imageUrls3;
    return _regeneratorRuntime().wrap(function _callee34$(_context35) {
      while (1) switch (_context35.prev = _context35.next) {
        case 0:
          _context35.prev = 0;
          // Obtener los datos del servicio desde el cuerpo de la solicitud
          _req$body9 = req.body, id = _req$body9.id, categoria = _req$body9.categoria, descripcion = _req$body9.descripcion, estatus = _req$body9.estatus, garantia = _req$body9.garantia, nombre_servicio = _req$body9.nombre_servicio, precio = _req$body9.precio, subcategoria = _req$body9.subcategoria, taller = _req$body9.taller, uid_categoria = _req$body9.uid_categoria, uid_servicio = _req$body9.uid_servicio, uid_subcategoria = _req$body9.uid_subcategoria, uid_taller = _req$body9.uid_taller, puntuacion = _req$body9.puntuacion, publicOrigin = _req$body9.publicOrigin, images = _req$body9.images, edit = _req$body9.edit;
          console.log("Datos del servicio:", req.body);
          serviceData = {
            categoria: categoria,
            descripcion: descripcion,
            estatus: estatus,
            garantia: garantia,
            nombre_servicio: nombre_servicio,
            precio: precio,
            subcategoria: subcategoria,
            taller: taller,
            uid_categoria: uid_categoria,
            uid_servicio: uid_servicio,
            uid_subcategoria: uid_subcategoria,
            uid_taller: uid_taller,
            puntuacion: puntuacion
          };
          console.log(serviceData);
          getLastImageIndex = function getLastImageIndex(id) {
            return new Promise(function (resolve, reject) {
              var prefix = "service_images/".concat(id);
              bucket.getFiles({
                prefix: prefix
              }).then(function (_ref51) {
                var _ref52 = _slicedToArray(_ref51, 1),
                  files = _ref52[0];
                var maxIndex = 0;
                files.forEach(function (file) {
                  var match = file.name.match(/_(\d+)\.jpg$/);
                  if (match) {
                    var index = parseInt(match[1], 10);
                    if (index > maxIndex) {
                      maxIndex = index;
                    }
                  }
                });
                resolve(maxIndex);
              })["catch"](function (error) {
                reject(error);
              });
            });
          };
          uploadImages = /*#__PURE__*/function () {
            var _ref53 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee32(id, images) {
              var imageUrls, i, _base2, index, newFileName, buffer, file, imageUrl;
              return _regeneratorRuntime().wrap(function _callee32$(_context33) {
                while (1) switch (_context33.prev = _context33.next) {
                  case 0:
                    imageUrls = [];
                    i = 0;
                  case 2:
                    if (!(i < (images === null || images === void 0 ? void 0 : images.length))) {
                      _context33.next = 17;
                      break;
                    }
                    _base2 = images[i];
                    _context33.next = 6;
                    return getLastImageIndex(id);
                  case 6:
                    index = _context33.sent;
                    newFileName = "service_images/".concat(id, "_").concat(index + 1, ".jpg");
                    buffer = Buffer.from(_base2, 'base64');
                    file = bucket.file(newFileName);
                    _context33.next = 12;
                    return file.save(buffer, {
                      metadata: {
                        contentType: 'image/jpeg'
                      },
                      "public": true,
                      validation: 'md5'
                    });
                  case 12:
                    imageUrl = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(newFileName);
                    imageUrls.push(imageUrl);
                  case 14:
                    i++;
                    _context33.next = 2;
                    break;
                  case 17:
                    return _context33.abrupt("return", imageUrls);
                  case 18:
                  case "end":
                    return _context33.stop();
                }
              }, _callee32);
            }));
            return function uploadImages(_x82, _x83) {
              return _ref53.apply(this, arguments);
            };
          }();
          deleteOldImages = /*#__PURE__*/function () {
            var _ref54 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee33(id) {
              var prefix, _yield$bucket$getFile, _yield$bucket$getFile2, files, _iterator2, _step2, file;
              return _regeneratorRuntime().wrap(function _callee33$(_context34) {
                while (1) switch (_context34.prev = _context34.next) {
                  case 0:
                    prefix = "service_images/".concat(id);
                    _context34.next = 3;
                    return bucket.getFiles({
                      prefix: prefix
                    });
                  case 3:
                    _yield$bucket$getFile = _context34.sent;
                    _yield$bucket$getFile2 = _slicedToArray(_yield$bucket$getFile, 1);
                    files = _yield$bucket$getFile2[0];
                    _iterator2 = _createForOfIteratorHelper(files);
                    _context34.prev = 7;
                    _iterator2.s();
                  case 9:
                    if ((_step2 = _iterator2.n()).done) {
                      _context34.next = 15;
                      break;
                    }
                    file = _step2.value;
                    _context34.next = 13;
                    return file["delete"]();
                  case 13:
                    _context34.next = 9;
                    break;
                  case 15:
                    _context34.next = 20;
                    break;
                  case 17:
                    _context34.prev = 17;
                    _context34.t0 = _context34["catch"](7);
                    _iterator2.e(_context34.t0);
                  case 20:
                    _context34.prev = 20;
                    _iterator2.f();
                    return _context34.finish(20);
                  case 23:
                  case "end":
                    return _context34.stop();
                }
              }, _callee33, null, [[7, 17, 20, 23]]);
            }));
            return function deleteOldImages(_x84) {
              return _ref54.apply(this, arguments);
            };
          }(); // Si `id` tiene un valor, editar el documento en la colección "Servicios"
          if (!id) {
            _context35.next = 67;
            break;
          }
          serviceRef = db.collection("Servicios").doc(id);
          _context35.next = 12;
          return serviceRef.get();
        case 12:
          serviceSnapshot = _context35.sent;
          if (serviceSnapshot.exists) {
            _context35.next = 15;
            break;
          }
          return _context35.abrupt("return", res.status(404).send({
            message: "No se encontró el servicio con el ID proporcionado para actualizar"
          }));
        case 15:
          _context35.next = 17;
          return serviceRef.update(serviceData);
        case 17:
          console.log("Servicio actualizado:", id);
          if (!serviceData.estatus) {
            _context35.next = 43;
            break;
          }
          if (publicOrigin) {
            _context35.next = 31;
            break;
          }
          userId = uid_taller;
          userRef = db.collection("Usuarios").doc(userId);
          _context35.next = 24;
          return userRef.get();
        case 24:
          userDoc = _context35.sent;
          if (!userDoc.exists) {
            _context35.next = 31;
            break;
          }
          userData = userDoc.data();
          cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
          cantidadServicios -= 1;
          _context35.next = 31;
          return userRef.update({
            "subscripcion_actual.cantidad_servicios": cantidadServicios.toString()
          });
        case 31:
          if (!edit) {
            _context35.next = 34;
            break;
          }
          _context35.next = 34;
          return deleteOldImages(id);
        case 34:
          _context35.next = 36;
          return uploadImages(id, images);
        case 36:
          imageUrls = _context35.sent;
          serviceData.service_image = imageUrls;
          _context35.next = 40;
          return serviceRef.update(serviceData);
        case 40:
          return _context35.abrupt("return", res.status(200).send({
            message: "Servicio actualizado exitosamente",
            service: _objectSpread({
              id: id
            }, serviceData)
          }));
        case 43:
          if (!publicOrigin) {
            _context35.next = 55;
            break;
          }
          _userId = uid_taller;
          _userRef = db.collection("Usuarios").doc(_userId);
          _context35.next = 48;
          return _userRef.get();
        case 48:
          _userDoc = _context35.sent;
          if (!_userDoc.exists) {
            _context35.next = 55;
            break;
          }
          _userData = _userDoc.data();
          _cantidadServicios = parseInt(_userData.subscripcion_actual.cantidad_servicios, 10) || 0;
          _cantidadServicios += 1;
          _context35.next = 55;
          return _userRef.update({
            "subscripcion_actual.cantidad_servicios": _cantidadServicios.toString()
          });
        case 55:
          if (!edit) {
            _context35.next = 58;
            break;
          }
          _context35.next = 58;
          return deleteOldImages(id);
        case 58:
          _context35.next = 60;
          return uploadImages(id, images);
        case 60:
          _imageUrls = _context35.sent;
          serviceData.service_image = _imageUrls;
          _context35.next = 64;
          return serviceRef.update(serviceData);
        case 64:
          return _context35.abrupt("return", res.status(200).send({
            message: "Servicio actualizado exitosamente",
            service: _objectSpread({
              id: id
            }, serviceData)
          }));
        case 65:
          _context35.next = 114;
          break;
        case 67:
          _context35.next = 69;
          return db.collection("Servicios").add(serviceData);
        case 69:
          newServiceRef = _context35.sent;
          console.log("Servicio creado con ID:", newServiceRef.id);
          if (!serviceData.estatus) {
            _context35.next = 94;
            break;
          }
          if (publicOrigin) {
            _context35.next = 84;
            break;
          }
          _userId2 = uid_taller;
          _userRef2 = db.collection("Usuarios").doc(_userId2);
          _context35.next = 77;
          return _userRef2.get();
        case 77:
          _userDoc2 = _context35.sent;
          if (!_userDoc2.exists) {
            _context35.next = 84;
            break;
          }
          _userData2 = _userDoc2.data();
          _cantidadServicios2 = parseInt(_userData2.subscripcion_actual.cantidad_servicios, 10) || 0;
          _cantidadServicios2 -= 1;
          _context35.next = 84;
          return _userRef2.update({
            "subscripcion_actual.cantidad_servicios": _cantidadServicios2.toString()
          });
        case 84:
          serviceData.id = newServiceRef.id;
          _context35.next = 87;
          return uploadImages(newServiceRef.id, images);
        case 87:
          _imageUrls2 = _context35.sent;
          serviceData.service_image = _imageUrls2;
          _context35.next = 91;
          return newServiceRef.update(serviceData);
        case 91:
          return _context35.abrupt("return", res.status(201).send({
            message: "Servicio creado exitosamente",
            service: _objectSpread({
              id: newServiceRef.id
            }, serviceData)
          }));
        case 94:
          if (!publicOrigin) {
            _context35.next = 106;
            break;
          }
          _userId3 = uid_taller;
          _userRef3 = db.collection("Usuarios").doc(_userId3);
          _context35.next = 99;
          return _userRef3.get();
        case 99:
          _userDoc3 = _context35.sent;
          if (!_userDoc3.exists) {
            _context35.next = 106;
            break;
          }
          _userData3 = _userDoc3.data();
          _cantidadServicios3 = parseInt(_userData3.subscripcion_actual.cantidad_servicios, 10) || 0;
          _cantidadServicios3 += 1;
          _context35.next = 106;
          return _userRef3.update({
            "subscripcion_actual.cantidad_servicios": _cantidadServicios3.toString()
          });
        case 106:
          serviceData.id = newServiceRef.id;
          _context35.next = 109;
          return uploadImages(newServiceRef.id, images);
        case 109:
          _imageUrls3 = _context35.sent;
          serviceData.service_image = _imageUrls3;
          _context35.next = 113;
          return newServiceRef.update(serviceData);
        case 113:
          return _context35.abrupt("return", res.status(201).send({
            message: "Servicio creado exitosamente",
            service: _objectSpread({
              id: newServiceRef.id
            }, serviceData)
          }));
        case 114:
          _context35.next = 120;
          break;
        case 116:
          _context35.prev = 116;
          _context35.t0 = _context35["catch"](0);
          console.error("Error al guardar o actualizar el servicio:", _context35.t0);
          res.status(500).send(_context35.t0);
        case 120:
        case "end":
          return _context35.stop();
      }
    }, _callee34, null, [[0, 116]]);
  }));
  return function saveOrUpdateService(_x80, _x81) {
    return _ref50.apply(this, arguments);
  };
}();
var getPlanes = /*#__PURE__*/function () {
  var _ref55 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee35(req, res) {
    var result, planes;
    return _regeneratorRuntime().wrap(function _callee35$(_context36) {
      while (1) switch (_context36.prev = _context36.next) {
        case 0:
          _context36.prev = 0;
          _context36.next = 3;
          return db.collection("Planes").where("status", "==", "Activo") // Filtrar documentos por status "Activo"
          .get();
        case 3:
          result = _context36.sent;
          if (!result.empty) {
            _context36.next = 6;
            break;
          }
          return _context36.abrupt("return", res.status(404).send('No se encontraron planes con el estado "Activo"'));
        case 6:
          planes = result.docs.map(function (doc) {
            return doc.data();
          });
          res.send(planes);
          _context36.next = 14;
          break;
        case 10:
          _context36.prev = 10;
          _context36.t0 = _context36["catch"](0);
          console.error("Error al obtener planes:", _context36.t0);
          res.status(500).send("Error al obtener planes");
        case 14:
        case "end":
          return _context36.stop();
      }
    }, _callee35, null, [[0, 10]]);
  }));
  return function getPlanes(_x85, _x86) {
    return _ref55.apply(this, arguments);
  };
}();
var getMetodosPago = /*#__PURE__*/function () {
  var _ref56 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee36(req, res) {
    var result, planes;
    return _regeneratorRuntime().wrap(function _callee36$(_context37) {
      while (1) switch (_context37.prev = _context37.next) {
        case 0:
          _context37.prev = 0;
          _context37.next = 3;
          return db.collection("MetodosPago").where("status", "==", true) // Filtrar documentos por status "Activo"
          .get();
        case 3:
          result = _context37.sent;
          if (!result.empty) {
            _context37.next = 6;
            break;
          }
          return _context37.abrupt("return", res.status(404).send('No se encontraron los metodos con el estado "true"'));
        case 6:
          planes = result.docs.map(function (doc) {
            return doc.data();
          });
          res.send(planes);
          _context37.next = 14;
          break;
        case 10:
          _context37.prev = 10;
          _context37.t0 = _context37["catch"](0);
          console.error("Error al obtener metodos:", _context37.t0);
          res.status(500).send("Error al obtener metodos");
        case 14:
        case "end":
          return _context37.stop();
      }
    }, _callee36, null, [[0, 10]]);
  }));
  return function getMetodosPago(_x87, _x88) {
    return _ref56.apply(this, arguments);
  };
}();

// Función para guardar la suscripción
var uploadImage = function uploadImage(file, buffer) {
  return new Promise(function (resolve, reject) {
    file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg'
      },
      "public": true,
      validation: 'md5'
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
var getDistanceKm = function getDistanceKm(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/** Convierte un escalar de coordenada (número, string "10,5", etc.) a número finito o NaN. */
var parseCoordScalar = function parseCoordScalar(v) {
  if (v == null || v === "") return NaN;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    var t = v.trim().replace(/\s/g, "").replace(",", ".");
    var n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
};
var getLatLngFromUbicacion = function getLatLngFromUbicacion(ubicacion) {
  var _ubicacion$lat, _ubicacion$lng;
  if (!ubicacion || _typeof(ubicacion) !== "object") return {
    lat: NaN,
    lng: NaN
  };
  if (ubicacion instanceof GeoPoint) {
    return {
      lat: ubicacion.latitude,
      lng: ubicacion.longitude
    };
  }
  if (typeof ubicacion.latitude === "number" && typeof ubicacion.longitude === "number" && Number.isFinite(ubicacion.latitude) && Number.isFinite(ubicacion.longitude)) {
    return {
      lat: ubicacion.latitude,
      lng: ubicacion.longitude
    };
  }
  var lat = (_ubicacion$lat = ubicacion.lat) !== null && _ubicacion$lat !== void 0 ? _ubicacion$lat : ubicacion.latitude;
  var lng = (_ubicacion$lng = ubicacion.lng) !== null && _ubicacion$lng !== void 0 ? _ubicacion$lng : ubicacion.longitude;
  return {
    lat: parseCoordScalar(lat),
    lng: parseCoordScalar(lng)
  };
};

/** Coordenadas del taller: `ubicacion` / `location` GeoPoint o { lat, lng }; respaldo `lat`/`lng` en raíz. */
var getLatLngTallerSimple = function getLatLngTallerSimple(t) {
  if (!t || _typeof(t) !== "object") return {
    lat: NaN,
    lng: NaN
  };
  var u = getLatLngFromUbicacion(t.ubicacion);
  if (!Number.isFinite(u.lat) || !Number.isFinite(u.lng)) {
    u = getLatLngFromUbicacion(t.location);
  }
  if (Number.isFinite(u.lat) && Number.isFinite(u.lng)) {
    return u;
  }
  return {
    lat: parseCoordScalar(t.lat),
    lng: parseCoordScalar(t.lng)
  };
};
var fetchServiciosByCategoriaId = /*#__PURE__*/function () {
  var _ref57 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee37(categoriaId) {
    return _regeneratorRuntime().wrap(function _callee37$(_context38) {
      while (1) switch (_context38.prev = _context38.next) {
        case 0:
          return _context38.abrupt("return", db.collection("Servicios").where("uid_categoria", "==", categoriaId).get());
        case 1:
        case "end":
          return _context38.stop();
      }
    }, _callee37);
  }));
  return function fetchServiciosByCategoriaId(_x89) {
    return _ref57.apply(this, arguments);
  };
}();
var getUniqueUidTalleres = function getUniqueUidTalleres(serviciosSnapshot) {
  var uidTalleres = new Set();
  serviciosSnapshot.docs.forEach(function (doc) {
    var data = doc.data() || {};
    var uidTaller = data.uid_taller;
    if (uidTaller && typeof uidTaller === "string" && uidTaller.trim() !== "") {
      uidTalleres.add(uidTaller.trim());
    }
  });
  return Array.from(uidTalleres);
};
var fetchUsuariosByUids = /*#__PURE__*/function () {
  var _ref58 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee38(uids) {
    var IN_LIMIT, talleres, uidsList, i, chunk, snapshot;
    return _regeneratorRuntime().wrap(function _callee38$(_context39) {
      while (1) switch (_context39.prev = _context39.next) {
        case 0:
          IN_LIMIT = 10; // Firestore 'in' limit
          talleres = [];
          uidsList = Array.isArray(uids) ? uids : [];
          i = 0;
        case 4:
          if (!(i < uidsList.length)) {
            _context39.next = 13;
            break;
          }
          chunk = uidsList.slice(i, i + IN_LIMIT);
          _context39.next = 8;
          return db.collection("Usuarios").where(admin.firestore.FieldPath.documentId(), "in", chunk).where("typeUser", "==", "Taller").where("status", "==", "Aprobado").where("subscripcion_actual.status", "==", "Aprobado").get();
        case 8:
          snapshot = _context39.sent;
          snapshot.docs.forEach(function (d) {
            talleres.push(_objectSpread({
              uid_taller: d.id
            }, d.data()));
          });
        case 10:
          i += IN_LIMIT;
          _context39.next = 4;
          break;
        case 13:
          return _context39.abrupt("return", talleres);
        case 14:
        case "end":
          return _context39.stop();
      }
    }, _callee38);
  }));
  return function fetchUsuariosByUids(_x90) {
    return _ref58.apply(this, arguments);
  };
}();

/** Distancia Haversine (km) entre la solicitud y cada taller; añade `kmDistance`; deja ≤ radiusKm y top `limit`. */
var filterTalleresCercanos = function filterTalleresCercanos(talleres, userLat, userLng) {
  var radiusKm = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
  if (!Array.isArray(talleres)) {
    return [];
  }
  var uLat = parseCoordScalar(userLat);
  var uLng = parseCoordScalar(userLng);
  if (!Number.isFinite(uLat) || !Number.isFinite(uLng)) {
    return [];
  }
  var withKm = talleres.map(function (t) {
    var _getLatLngTallerSimpl = getLatLngTallerSimple(t),
      lat = _getLatLngTallerSimpl.lat,
      lng = _getLatLngTallerSimpl.lng;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }
    var kmDistance = getDistanceKm(uLat, uLng, lat, lng);
    if (!Number.isFinite(kmDistance)) {
      return null;
    }
    return _objectSpread(_objectSpread({}, t), {}, {
      kmDistance: kmDistance
    });
  }).filter(Boolean);
  withKm.sort(function (a, b) {
    return a.kmDistance - b.kmDistance;
  });
  return withKm.filter(function (t) {
    return t.kmDistance <= radiusKm && t.kmDistance >= 0;
  }).slice(0, limit);
};
var saveSolicitud = /*#__PURE__*/function () {
  var _ref59 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee39(req, res) {
    var _ref60, nombreSolicitud, vehiculo, categoriaId, descripcion, urgencia, fotos, nombre_usuario, uid_usuario, phone_usuario, latitude, longitude, uid_taller, solicitudData, solicitudRef, solicitudId, userLat, userLng, idTallerDirigido, RADIO_KM_NOTIFICACION, talleresCercanos, talleresParaNotificar, tallerSnap, tallerUnico, d, serviciosSnapshot, uidTalleresUnicos, talleres, talleresConToken, imageUrls, i, _base3, path, buffer, file, url;
    return _regeneratorRuntime().wrap(function _callee39$(_context40) {
      while (1) switch (_context40.prev = _context40.next) {
        case 0:
          _context40.prev = 0;
          _ref60 = req.body || {}, nombreSolicitud = _ref60.nombreSolicitud, vehiculo = _ref60.vehiculo, categoriaId = _ref60.categoriaId, descripcion = _ref60.descripcion, urgencia = _ref60.urgencia, fotos = _ref60.fotos, nombre_usuario = _ref60.nombre_usuario, uid_usuario = _ref60.uid_usuario, phone_usuario = _ref60.phone_usuario, latitude = _ref60.latitude, longitude = _ref60.longitude, uid_taller = _ref60.uid_taller;
          if (!(!nombreSolicitud || !vehiculo || !vehiculo.id || !categoriaId)) {
            _context40.next = 4;
            break;
          }
          return _context40.abrupt("return", res.status(400).json({
            error: "nombreSolicitud, vehiculo (con id) y categoriaId son requeridos."
          }));
        case 4:
          solicitudData = {
            nombre_solicitud: nombreSolicitud,
            status: "En espera por aprobación",
            vehiculo: vehiculo,
            categoriaId: categoriaId,
            descripcion: descripcion || "",
            urgencia: urgencia || "",
            nombre_usuario: nombre_usuario || "",
            uid_usuario: uid_usuario || "",
            phone_usuario: phone_usuario || "",
            latitude: latitude !== null && latitude !== void 0 ? latitude : "",
            longitude: longitude !== null && longitude !== void 0 ? longitude : "",
            solicitud_images: [],
            fecha_solicitud: admin.firestore.Timestamp.now(),
            uid_taller: uid_taller || ""
          };
          _context40.next = 7;
          return db.collection("Solicitudes").add(solicitudData);
        case 7:
          solicitudRef = _context40.sent;
          solicitudId = solicitudRef.id;
          userLat = parseCoordScalar(latitude);
          userLng = parseCoordScalar(longitude);
          idTallerDirigido = uid_taller != null && String(uid_taller).trim() !== "" ? String(uid_taller).trim() : null;
          RADIO_KM_NOTIFICACION = 10;
          if (!idTallerDirigido) {
            _context40.next = 23;
            break;
          }
          _context40.next = 16;
          return db.collection("Usuarios").doc(idTallerDirigido).get();
        case 16:
          tallerSnap = _context40.sent;
          tallerUnico = null;
          if (tallerSnap.exists) {
            d = tallerSnap.data() || {};
            if (d.typeUser === "Taller" && d.status === "Aprobado") {
              tallerUnico = _objectSpread({
                uid_taller: tallerSnap.id
              }, d);
            }
          }
          talleresCercanos = tallerUnico ? [tallerUnico] : [];
          talleresParaNotificar = talleresCercanos;
          _context40.next = 32;
          break;
        case 23:
          _context40.next = 25;
          return fetchServiciosByCategoriaId(categoriaId);
        case 25:
          serviciosSnapshot = _context40.sent;
          uidTalleresUnicos = getUniqueUidTalleres(serviciosSnapshot);
          _context40.next = 29;
          return fetchUsuariosByUids(uidTalleresUnicos);
        case 29:
          talleres = _context40.sent;
          talleresCercanos = filterTalleresCercanos(talleres, userLat, userLng, RADIO_KM_NOTIFICACION, 10);
          talleresParaNotificar = talleresCercanos.filter(function (t) {
            return Number.isFinite(t.kmDistance) && t.kmDistance <= RADIO_KM_NOTIFICACION;
          });
        case 32:
          talleresConToken = talleresParaNotificar.filter(function (t) {
            return t.token && typeof t.token === "string" && t.token.trim() !== "";
          });
          _context40.next = 35;
          return Promise.allSettled(talleresConToken.map(function (taller) {
            var reqNotif = {
              body: {
                token: taller.token,
                title: "¡Nueva oportunidad!",
                body: "Un cliente cerca de ti necesita un servicio. Revisa los detalles y envía tu propuesta ahora.",
                secretCode: "NuevaSolicitud"
              }
            };
            var resNotif = {
              status: function status() {
                return {
                  send: function send() {}
                };
              }
            };
            return sendNotification(reqNotif, resNotif);
          }));
        case 35:
          imageUrls = [];
          if (!(Array.isArray(fotos) && fotos.length > 0)) {
            _context40.next = 52;
            break;
          }
          i = 0;
        case 38:
          if (!(i < fotos.length)) {
            _context40.next = 52;
            break;
          }
          _base3 = fotos[i];
          if (!(!_base3 || typeof _base3 !== "string" || !_base3.trim())) {
            _context40.next = 42;
            break;
          }
          return _context40.abrupt("continue", 49);
        case 42:
          path = "Solicitudes/".concat(solicitudId, "/").concat(i + 1, ".jpg");
          buffer = Buffer.from(_base3, "base64");
          file = bucket.file(path);
          _context40.next = 47;
          return uploadImage(file, buffer);
        case 47:
          url = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(path);
          imageUrls.push(url);
        case 49:
          i++;
          _context40.next = 38;
          break;
        case 52:
          if (!(imageUrls.length > 0)) {
            _context40.next = 55;
            break;
          }
          _context40.next = 55;
          return solicitudRef.update({
            solicitud_images: imageUrls
          });
        case 55:
          return _context40.abrupt("return", res.status(201).json({
            message: "Solicitud creada correctamente.",
            id: solicitudId,
            solicitud_images: imageUrls,
            talleres: talleresCercanos
          }));
        case 58:
          _context40.prev = 58;
          _context40.t0 = _context40["catch"](0);
          console.error("Error al guardar solicitud:", _context40.t0);
          return _context40.abrupt("return", res.status(500).json({
            error: "Error al guardar solicitud: ".concat(_context40.t0.message)
          }));
        case 62:
        case "end":
          return _context40.stop();
      }
    }, _callee39, null, [[0, 58]]);
  }));
  return function saveSolicitud(_x91, _x92) {
    return _ref59.apply(this, arguments);
  };
}();
var getSolicitudesByUsuario = /*#__PURE__*/function () {
  var _ref61 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee40(req, res) {
    var _ref62, uid_usuario, solo_ultima, status, snapshot, solicitudes;
    return _regeneratorRuntime().wrap(function _callee40$(_context41) {
      while (1) switch (_context41.prev = _context41.next) {
        case 0:
          _context41.prev = 0;
          _ref62 = req.body || {}, uid_usuario = _ref62.uid_usuario, solo_ultima = _ref62.solo_ultima, status = _ref62.status;
          if (!(!uid_usuario || typeof uid_usuario !== "string" || uid_usuario.trim() === "")) {
            _context41.next = 4;
            break;
          }
          return _context41.abrupt("return", res.status(400).json({
            error: "uid_usuario es requerido."
          }));
        case 4:
          _context41.next = 6;
          return db.collection("Solicitudes").where("uid_usuario", "==", uid_usuario.trim()).where("status", "==", status.trim()).get();
        case 6:
          snapshot = _context41.sent;
          if (!snapshot.empty) {
            _context41.next = 9;
            break;
          }
          return _context41.abrupt("return", res.status(200).json(solo_ultima ? null : []));
        case 9:
          solicitudes = snapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Si el flag viene en true, devolver solo la solicitud más nueva (por fecha_solicitud)
          if (!solo_ultima) {
            _context41.next = 13;
            break;
          }
          solicitudes.sort(function (a, b) {
            var _a$fecha_solicitud, _b$fecha_solicitud;
            var fa = (_a$fecha_solicitud = a.fecha_solicitud) !== null && _a$fecha_solicitud !== void 0 && _a$fecha_solicitud.toMillis ? a.fecha_solicitud.toMillis() : 0;
            var fb = (_b$fecha_solicitud = b.fecha_solicitud) !== null && _b$fecha_solicitud !== void 0 && _b$fecha_solicitud.toMillis ? b.fecha_solicitud.toMillis() : 0;
            return fb - fa; // más reciente primero
          });
          return _context41.abrupt("return", res.status(200).json(solicitudes[0] || null));
        case 13:
          return _context41.abrupt("return", res.status(200).json(solicitudes));
        case 16:
          _context41.prev = 16;
          _context41.t0 = _context41["catch"](0);
          console.error("Error al obtener solicitudes por usuario:", _context41.t0);
          return _context41.abrupt("return", res.status(500).json({
            error: "Error al obtener solicitudes: ".concat(_context41.t0.message)
          }));
        case 20:
        case "end":
          return _context41.stop();
      }
    }, _callee40, null, [[0, 16]]);
  }));
  return function getSolicitudesByUsuario(_x93, _x94) {
    return _ref61.apply(this, arguments);
  };
}();

/**
 * Solo solicitudes con el `status` pedido que no tengan ninguna fila en `Propuestas`
 * (coincidencia por `uid_solicitud` = id del documento en Solicitudes). Respuesta: array únicamente.
 */
var getSolicitudesByUsuarioAndStatus = /*#__PURE__*/function () {
  var _ref63 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee41(req, res) {
    var _ref64, status, uid_taller, snapshot, solicitudIds, idsConPropuesta, IN_LIMIT, i, chunk, propSnap, solicitudes, uidTallerTrim, servSnap, categoriasTaller;
    return _regeneratorRuntime().wrap(function _callee41$(_context42) {
      while (1) switch (_context42.prev = _context42.next) {
        case 0:
          _context42.prev = 0;
          _ref64 = req.body || {}, status = _ref64.status, uid_taller = _ref64.uid_taller;
          if (!(!status || typeof status !== "string" || status.trim() === "")) {
            _context42.next = 4;
            break;
          }
          return _context42.abrupt("return", res.status(400).json({
            error: "status es requerido."
          }));
        case 4:
          _context42.next = 6;
          return db.collection("Solicitudes").where("status", "==", status.trim()).get();
        case 6:
          snapshot = _context42.sent;
          if (!snapshot.empty) {
            _context42.next = 9;
            break;
          }
          return _context42.abrupt("return", res.status(200).json([]));
        case 9:
          solicitudIds = snapshot.docs.map(function (d) {
            return String(d.id).trim();
          });
          idsConPropuesta = new Set();
          IN_LIMIT = 10;
          i = 0;
        case 13:
          if (!(i < solicitudIds.length)) {
            _context42.next = 22;
            break;
          }
          chunk = solicitudIds.slice(i, i + IN_LIMIT).map(function (id) {
            return String(id).trim();
          });
          _context42.next = 17;
          return db.collection("Propuestas").where("uid_solicitud", "in", chunk).get();
        case 17:
          propSnap = _context42.sent;
          propSnap.docs.forEach(function (doc) {
            var raw = (doc.data() || {}).uid_solicitud;
            var uidSol = raw == null ? "" : String(raw).trim();
            if (uidSol !== "") {
              idsConPropuesta.add(uidSol);
            }
          });
        case 19:
          i += IN_LIMIT;
          _context42.next = 13;
          break;
        case 22:
          solicitudes = snapshot.docs.map(function (doc) {
            return _objectSpread(_objectSpread({}, doc.data()), {}, {
              id: doc.id
            });
          }).filter(function (s) {
            return !idsConPropuesta.has(String(s.id).trim());
          });
          if (!(uid_taller !== undefined && uid_taller !== null && uid_taller !== "")) {
            _context42.next = 32;
            break;
          }
          uidTallerTrim = String(uid_taller).trim();
          solicitudes = solicitudes.filter(function (s) {
            var st = s.uid_taller;
            var vacio = st == null || String(st).trim() === "";
            if (vacio) return true;
            return String(st).trim() === uidTallerTrim;
          });
          _context42.next = 28;
          return db.collection("Servicios").where("uid_taller", "==", uidTallerTrim).where("estatus", "==", true).get();
        case 28:
          servSnap = _context42.sent;
          categoriasTaller = new Set();
          servSnap.docs.forEach(function (doc) {
            var d = doc.data() || {};
            if (d.estatus !== true) return;
            var c = d.uid_categoria;
            if (c != null && String(c).trim() !== "") {
              categoriasTaller.add(String(c).trim());
            }
          });
          if (servSnap.empty || categoriasTaller.size === 0) {
            solicitudes = [];
          } else {
            solicitudes = solicitudes.filter(function (s) {
              var catId = s.categoriaId;
              if (catId == null || String(catId).trim() === "") {
                return false;
              }
              return categoriasTaller.has(String(catId).trim());
            });
          }
        case 32:
          return _context42.abrupt("return", res.status(200).json(solicitudes));
        case 35:
          _context42.prev = 35;
          _context42.t0 = _context42["catch"](0);
          console.error("Error al obtener solicitudes por status:", _context42.t0);
          return _context42.abrupt("return", res.status(500).json({
            error: "Error al obtener solicitudes: ".concat(_context42.t0.message)
          }));
        case 39:
        case "end":
          return _context42.stop();
      }
    }, _callee41, null, [[0, 35]]);
  }));
  return function getSolicitudesByUsuarioAndStatus(_x95, _x96) {
    return _ref63.apply(this, arguments);
  };
}();
var getSolicitudByServicioUid = /*#__PURE__*/function () {
  var _ref65 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee42(req, res) {
    var _ref66, uid_servicio, docRef, docSnap, solicitud;
    return _regeneratorRuntime().wrap(function _callee42$(_context43) {
      while (1) switch (_context43.prev = _context43.next) {
        case 0:
          _context43.prev = 0;
          _ref66 = req.body || {}, uid_servicio = _ref66.uid_servicio;
          if (!(!uid_servicio || typeof uid_servicio !== "string" || uid_servicio.trim() === "")) {
            _context43.next = 4;
            break;
          }
          return _context43.abrupt("return", res.status(400).json({
            error: "uid_servicio es requerido."
          }));
        case 4:
          docRef = db.collection("Solicitudes").doc(uid_servicio.trim());
          _context43.next = 7;
          return docRef.get();
        case 7:
          docSnap = _context43.sent;
          if (docSnap.exists) {
            _context43.next = 10;
            break;
          }
          return _context43.abrupt("return", res.status(200).json(null));
        case 10:
          solicitud = _objectSpread({
            id: docSnap.id
          }, docSnap.data());
          return _context43.abrupt("return", res.status(200).json(solicitud));
        case 14:
          _context43.prev = 14;
          _context43.t0 = _context43["catch"](0);
          console.error("Error al obtener solicitud por uid_servicio:", _context43.t0);
          return _context43.abrupt("return", res.status(500).json({
            error: "Error al obtener solicitud por uid_servicio: ".concat(_context43.t0.message)
          }));
        case 18:
        case "end":
          return _context43.stop();
      }
    }, _callee42, null, [[0, 14]]);
  }));
  return function getSolicitudByServicioUid(_x97, _x98) {
    return _ref65.apply(this, arguments);
  };
}();
var getPropuestasBySolicitud = /*#__PURE__*/function () {
  var _ref67 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee43(req, res) {
    var _ref68, uid_solicitud, propuestasSnapshot, propuestas;
    return _regeneratorRuntime().wrap(function _callee43$(_context44) {
      while (1) switch (_context44.prev = _context44.next) {
        case 0:
          _context44.prev = 0;
          _ref68 = req.body || {}, uid_solicitud = _ref68.uid_solicitud;
          if (!(!uid_solicitud || typeof uid_solicitud !== "string" || uid_solicitud.trim() === "")) {
            _context44.next = 4;
            break;
          }
          return _context44.abrupt("return", res.status(400).json({
            error: "uid_solicitud es requerido."
          }));
        case 4:
          _context44.next = 6;
          return db.collection("Propuestas").where("uid_solicitud", "==", uid_solicitud.trim()).get();
        case 6:
          propuestasSnapshot = _context44.sent;
          if (!propuestasSnapshot.empty) {
            _context44.next = 9;
            break;
          }
          return _context44.abrupt("return", res.status(200).json([]));
        case 9:
          propuestas = propuestasSnapshot.docs.map(function (doc) {
            var data = doc.data();
            var _idDoc = data.id,
              rest = _objectWithoutProperties(data, _excluded);
            return _objectSpread({
              id: doc.id
            }, rest);
          });
          return _context44.abrupt("return", res.status(200).json(propuestas));
        case 13:
          _context44.prev = 13;
          _context44.t0 = _context44["catch"](0);
          console.error("Error al obtener propuestas por solicitud:", _context44.t0);
          return _context44.abrupt("return", res.status(500).json({
            error: "Error al obtener propuestas: ".concat(_context44.t0.message)
          }));
        case 17:
        case "end":
          return _context44.stop();
      }
    }, _callee43, null, [[0, 13]]);
  }));
  return function getPropuestasBySolicitud(_x99, _x100) {
    return _ref67.apply(this, arguments);
  };
}();
var getUsuarioTokenBySolicitudUid = /*#__PURE__*/function () {
  var _ref69 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee44(uid_solicitud) {
    var solicitudSnap, solicitudData, uidUsuario, usuarioSnap, usuarioData, token;
    return _regeneratorRuntime().wrap(function _callee44$(_context45) {
      while (1) switch (_context45.prev = _context45.next) {
        case 0:
          if (!(!uid_solicitud || typeof uid_solicitud !== "string" || !uid_solicitud.trim())) {
            _context45.next = 2;
            break;
          }
          return _context45.abrupt("return", null);
        case 2:
          _context45.next = 4;
          return db.collection("Solicitudes").doc(uid_solicitud.trim()).get();
        case 4:
          solicitudSnap = _context45.sent;
          if (solicitudSnap.exists) {
            _context45.next = 7;
            break;
          }
          return _context45.abrupt("return", null);
        case 7:
          solicitudData = solicitudSnap.data() || {};
          uidUsuario = solicitudData.uid_usuario;
          if (!(!uidUsuario || typeof uidUsuario !== "string" || !uidUsuario.trim())) {
            _context45.next = 11;
            break;
          }
          return _context45.abrupt("return", null);
        case 11:
          _context45.next = 13;
          return db.collection("Usuarios").doc(uidUsuario.trim()).get();
        case 13:
          usuarioSnap = _context45.sent;
          if (usuarioSnap.exists) {
            _context45.next = 16;
            break;
          }
          return _context45.abrupt("return", null);
        case 16:
          usuarioData = usuarioSnap.data() || {};
          token = usuarioData.token;
          if (!(!token || typeof token !== "string" || !token.trim())) {
            _context45.next = 20;
            break;
          }
          return _context45.abrupt("return", null);
        case 20:
          return _context45.abrupt("return", token.trim());
        case 21:
        case "end":
          return _context45.stop();
      }
    }, _callee44);
  }));
  return function getUsuarioTokenBySolicitudUid(_x101) {
    return _ref69.apply(this, arguments);
  };
}();
var getUsuarioTokenByUid = /*#__PURE__*/function () {
  var _ref70 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee45(uid) {
    var usuarioSnap, usuarioData, token;
    return _regeneratorRuntime().wrap(function _callee45$(_context46) {
      while (1) switch (_context46.prev = _context46.next) {
        case 0:
          if (!(!uid || typeof uid !== "string" || !uid.trim())) {
            _context46.next = 2;
            break;
          }
          return _context46.abrupt("return", null);
        case 2:
          _context46.next = 4;
          return db.collection("Usuarios").doc(uid.trim()).get();
        case 4:
          usuarioSnap = _context46.sent;
          if (usuarioSnap.exists) {
            _context46.next = 7;
            break;
          }
          return _context46.abrupt("return", null);
        case 7:
          usuarioData = usuarioSnap.data() || {};
          token = usuarioData.token;
          if (!(!token || typeof token !== "string" || !token.trim())) {
            _context46.next = 11;
            break;
          }
          return _context46.abrupt("return", null);
        case 11:
          return _context46.abrupt("return", token.trim());
        case 12:
        case "end":
          return _context46.stop();
      }
    }, _callee45);
  }));
  return function getUsuarioTokenByUid(_x102) {
    return _ref70.apply(this, arguments);
  };
}();

/** Normaliza tipo de propuesta (cotizado / inspección) sin depender de tildes ni mayúsculas. */
var normalizarTipoPropuestaStatus = function normalizarTipoPropuestaStatus(statusValue) {
  return String(statusValue || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
var getNotificationPayloadForPropuestaStatus = function getNotificationPayloadForPropuestaStatus(statusValue) {
  var normalized = normalizarTipoPropuestaStatus(statusValue);
  if (normalized === "cotizado") {
    return {
      title: "¡Propuesta recibida! ✨",
      body: "Un taller ha respondido a tu solicitud de servicio. Revisa los detalles en la app."
    };
  }
  if (normalized === "inspeccion") {
    return {
      title: "¡Cita de revisión sugerida!",
      body: "Un taller desea realizar una inspección previa a tu vehículo para darte un diagnóstico exacto."
    };
  }
  return null;
};
var notifyUsuarioByPropuestaStatus = /*#__PURE__*/function () {
  var _ref71 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee46(uid_solicitud, statusValue, propuestaId) {
    var notification, token, reqNotif, resNotif;
    return _regeneratorRuntime().wrap(function _callee46$(_context47) {
      while (1) switch (_context47.prev = _context47.next) {
        case 0:
          notification = getNotificationPayloadForPropuestaStatus(statusValue);
          if (notification) {
            _context47.next = 3;
            break;
          }
          return _context47.abrupt("return");
        case 3:
          _context47.next = 5;
          return getUsuarioTokenBySolicitudUid(uid_solicitud);
        case 5:
          token = _context47.sent;
          if (token) {
            _context47.next = 8;
            break;
          }
          return _context47.abrupt("return");
        case 8:
          reqNotif = {
            body: {
              token: token,
              title: notification.title,
              body: notification.body,
              secretCode: "NuevaPropuesta"
            }
          };
          resNotif = {
            status: function status() {
              return {
                send: function send() {}
              };
            }
          };
          _context47.next = 12;
          return sendNotification(reqNotif, resNotif);
        case 12:
        case "end":
          return _context47.stop();
      }
    }, _callee46);
  }));
  return function notifyUsuarioByPropuestaStatus(_x103, _x104, _x105) {
    return _ref71.apply(this, arguments);
  };
}();
var notifyTallerPropuestaAceptada = /*#__PURE__*/function () {
  var _ref72 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee47(uid_taller) {
    var _ref73,
      _ref73$esInspeccion,
      esInspeccion,
      token,
      title,
      body,
      reqNotif,
      resNotif,
      _args48 = arguments;
    return _regeneratorRuntime().wrap(function _callee47$(_context48) {
      while (1) switch (_context48.prev = _context48.next) {
        case 0:
          _ref73 = _args48.length > 1 && _args48[1] !== undefined ? _args48[1] : {}, _ref73$esInspeccion = _ref73.esInspeccion, esInspeccion = _ref73$esInspeccion === void 0 ? false : _ref73$esInspeccion;
          _context48.next = 3;
          return getUsuarioTokenByUid(uid_taller);
        case 3:
          token = _context48.sent;
          if (token) {
            _context48.next = 6;
            break;
          }
          return _context48.abrupt("return");
        case 6:
          title = esInspeccion ? "Inspección aceptada" : "Tu propuesta fue aceptada";
          body = esInspeccion ? "El usuario aceptó la inspección de su vehículo. Coordiná la visita cuando puedas." : "Excelente noticia. El usuario acepto tu propuesta y pronto se pondra en contacto contigo.";
          reqNotif = {
            body: {
              token: token,
              title: title,
              body: body,
              secretCode: esInspeccion ? "InspeccionAceptada" : "PropuestaAceptada"
            }
          };
          resNotif = {
            status: function status() {
              return {
                send: function send() {}
              };
            }
          };
          _context48.next = 12;
          return sendNotification(reqNotif, resNotif);
        case 12:
        case "end":
          return _context48.stop();
      }
    }, _callee47);
  }));
  return function notifyTallerPropuestaAceptada(_x106) {
    return _ref72.apply(this, arguments);
  };
}();
var savePropuesta = /*#__PURE__*/function () {
  var _ref74 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee48(req, res) {
    var body, docRef;
    return _regeneratorRuntime().wrap(function _callee48$(_context49) {
      while (1) switch (_context49.prev = _context49.next) {
        case 0:
          _context49.prev = 0;
          body = req.body || {};
          body.fecha_propuesta = admin.firestore.Timestamp.now();
          _context49.next = 5;
          return db.collection("Propuestas").add(body);
        case 5:
          docRef = _context49.sent;
          _context49.next = 8;
          return docRef.update({
            id: docRef.id
          });
        case 8:
          _context49.next = 10;
          return notifyUsuarioByPropuestaStatus(body.uid_solicitud, body.status, docRef.id);
        case 10:
          return _context49.abrupt("return", res.status(201).json({
            message: "Propuesta creada correctamente.",
            id: docRef.id
          }));
        case 13:
          _context49.prev = 13;
          _context49.t0 = _context49["catch"](0);
          console.error("Error al guardar propuesta:", _context49.t0);
          return _context49.abrupt("return", res.status(500).json({
            error: "Error al guardar propuesta: ".concat(_context49.t0.message)
          }));
        case 17:
        case "end":
          return _context49.stop();
      }
    }, _callee48, null, [[0, 13]]);
  }));
  return function savePropuesta(_x107, _x108) {
    return _ref74.apply(this, arguments);
  };
}();
var updateSolicitudStatus = /*#__PURE__*/function () {
  var _ref75 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee49(req, res) {
    var body, uid_solicitud, status, solicitudRef, solicitudSnap, propuestasSnapshot, batch;
    return _regeneratorRuntime().wrap(function _callee49$(_context50) {
      while (1) switch (_context50.prev = _context50.next) {
        case 0:
          _context50.prev = 0;
          body = req.body || {};
          uid_solicitud = body.uid_solicitud, status = body.status;
          if (!(!uid_solicitud || typeof uid_solicitud !== "string" || uid_solicitud.trim() === "")) {
            _context50.next = 5;
            break;
          }
          return _context50.abrupt("return", res.status(400).json({
            error: "uid_solicitud es requerido."
          }));
        case 5:
          if (!(!status || typeof status !== "string" || status.trim() === "")) {
            _context50.next = 7;
            break;
          }
          return _context50.abrupt("return", res.status(400).json({
            error: "status es requerido."
          }));
        case 7:
          solicitudRef = db.collection("Solicitudes").doc(uid_solicitud.trim());
          _context50.next = 10;
          return solicitudRef.get();
        case 10:
          solicitudSnap = _context50.sent;
          if (solicitudSnap.exists) {
            _context50.next = 13;
            break;
          }
          return _context50.abrupt("return", res.status(404).json({
            error: "Solicitud no encontrada."
          }));
        case 13:
          _context50.next = 15;
          return solicitudRef.update({
            status: status.trim()
          });
        case 15:
          _context50.next = 17;
          return db.collection("Propuestas").where("uid_solicitud", "==", uid_solicitud.trim()).get();
        case 17:
          propuestasSnapshot = _context50.sent;
          if (propuestasSnapshot.empty) {
            _context50.next = 23;
            break;
          }
          batch = db.batch();
          propuestasSnapshot.docs.forEach(function (doc) {
            batch.update(doc.ref, {
              status: "Rechazada",
              fecha_rechazada: admin.firestore.Timestamp.now()
            });
          });
          _context50.next = 23;
          return batch.commit();
        case 23:
          return _context50.abrupt("return", res.status(200).json({
            message: "Status de la solicitud actualizado correctamente.",
            id: uid_solicitud.trim(),
            status: status.trim()
          }));
        case 26:
          _context50.prev = 26;
          _context50.t0 = _context50["catch"](0);
          console.error("Error al actualizar status de la solicitud:", _context50.t0);
          return _context50.abrupt("return", res.status(500).json({
            error: "Error al actualizar solicitud: ".concat(_context50.t0.message)
          }));
        case 30:
        case "end":
          return _context50.stop();
      }
    }, _callee49, null, [[0, 26]]);
  }));
  return function updateSolicitudStatus(_x109, _x110) {
    return _ref75.apply(this, arguments);
  };
}();
var updatePropuesta = /*#__PURE__*/function () {
  var _ref76 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee50(req, res) {
    var body, uid_propuesta, status, propuestaRef, propuestaSnap, propuestaData, statusLower, updatePropuestaData, uid_solicitud, uid_taller, solicitudRef, solicitudSnap, solicitudUpdate, tipoPropuestaNorm, esCotizado, esInspeccion, _propuestaData$nombre, _propuestaData$uid_ta, _propuestaData$coment, _propuestaData$fecha_, _propuestaData$precio, _propuestaData$tiempo, _propuestaData$nombre2, _propuestaData$uid_ta2, _propuestaData$coment2, _propuestaData$fecha_2, _i2, _Object$keys2, key;
    return _regeneratorRuntime().wrap(function _callee50$(_context51) {
      while (1) switch (_context51.prev = _context51.next) {
        case 0:
          _context51.prev = 0;
          body = req.body || {};
          uid_propuesta = body.uid_propuesta, status = body.status;
          if (!(!uid_propuesta || typeof uid_propuesta !== "string" || uid_propuesta.trim() === "")) {
            _context51.next = 5;
            break;
          }
          return _context51.abrupt("return", res.status(400).json({
            error: "uid_propuesta es requerido."
          }));
        case 5:
          if (!(!status || typeof status !== "string" || status.trim() === "")) {
            _context51.next = 7;
            break;
          }
          return _context51.abrupt("return", res.status(400).json({
            error: "status es requerido."
          }));
        case 7:
          propuestaRef = db.collection("Propuestas").doc(uid_propuesta.trim());
          _context51.next = 10;
          return propuestaRef.get();
        case 10:
          propuestaSnap = _context51.sent;
          if (propuestaSnap.exists) {
            _context51.next = 13;
            break;
          }
          return _context51.abrupt("return", res.status(404).json({
            error: "Propuesta no encontrada."
          }));
        case 13:
          propuestaData = propuestaSnap.data();
          statusLower = status.trim().toLowerCase();
          updatePropuestaData = {
            status: statusLower === "aceptada" ? "Aceptada" : "Rechazada"
          };
          if (statusLower === "aceptada") {
            updatePropuestaData.fecha_aceptada = admin.firestore.Timestamp.now();
          } else if (statusLower === "rechazada") {
            updatePropuestaData.fecha_rechazada = admin.firestore.Timestamp.now();
          }
          _context51.next = 19;
          return propuestaRef.update(updatePropuestaData);
        case 19:
          if (!(statusLower === "aceptada")) {
            _context51.next = 42;
            break;
          }
          uid_solicitud = propuestaData.uid_solicitud;
          uid_taller = propuestaData.uid_taller;
          if (!(!uid_solicitud || typeof uid_solicitud !== "string" || !uid_solicitud.trim())) {
            _context51.next = 24;
            break;
          }
          return _context51.abrupt("return", res.status(400).json({
            error: "La propuesta no tiene uid_solicitud; no se puede actualizar la solicitud."
          }));
        case 24:
          solicitudRef = db.collection("Solicitudes").doc(uid_solicitud.trim());
          _context51.next = 27;
          return solicitudRef.get();
        case 27:
          solicitudSnap = _context51.sent;
          if (solicitudSnap.exists) {
            _context51.next = 30;
            break;
          }
          return _context51.abrupt("return", res.status(404).json({
            error: "Solicitud no encontrada."
          }));
        case 30:
          solicitudUpdate = {};
          tipoPropuestaNorm = normalizarTipoPropuestaStatus(propuestaData.status);
          esCotizado = tipoPropuestaNorm === "cotizado";
          esInspeccion = tipoPropuestaNorm === "inspeccion";
          if (esCotizado) {
            solicitudUpdate.nombre_taller = (_propuestaData$nombre = propuestaData.nombre_taller) !== null && _propuestaData$nombre !== void 0 ? _propuestaData$nombre : "";
            solicitudUpdate.uid_taller = (_propuestaData$uid_ta = propuestaData.uid_taller) !== null && _propuestaData$uid_ta !== void 0 ? _propuestaData$uid_ta : "";
            solicitudUpdate.comentario = (_propuestaData$coment = propuestaData.comentario) !== null && _propuestaData$coment !== void 0 ? _propuestaData$coment : "";
            solicitudUpdate.fecha_propuesta = (_propuestaData$fecha_ = propuestaData.fecha_propuesta) !== null && _propuestaData$fecha_ !== void 0 ? _propuestaData$fecha_ : "";
            solicitudUpdate.precio_estimado = (_propuestaData$precio = propuestaData.precio_estimado) !== null && _propuestaData$precio !== void 0 ? _propuestaData$precio : "";
            solicitudUpdate.tiempo_estimado = (_propuestaData$tiempo = propuestaData.tiempo_estimado) !== null && _propuestaData$tiempo !== void 0 ? _propuestaData$tiempo : "";
          } else if (esInspeccion) {
            solicitudUpdate.nombre_taller = (_propuestaData$nombre2 = propuestaData.nombre_taller) !== null && _propuestaData$nombre2 !== void 0 ? _propuestaData$nombre2 : "";
            solicitudUpdate.uid_taller = (_propuestaData$uid_ta2 = propuestaData.uid_taller) !== null && _propuestaData$uid_ta2 !== void 0 ? _propuestaData$uid_ta2 : "";
            solicitudUpdate.comentario = (_propuestaData$coment2 = propuestaData.comentario) !== null && _propuestaData$coment2 !== void 0 ? _propuestaData$coment2 : "";
            solicitudUpdate.fecha_propuesta = (_propuestaData$fecha_2 = propuestaData.fecha_propuesta) !== null && _propuestaData$fecha_2 !== void 0 ? _propuestaData$fecha_2 : "";
          }
          solicitudUpdate.status = esInspeccion ? "Inspección aceptada" : "Aceptada";
          solicitudUpdate.uid_taller = uid_taller != null ? uid_taller : "";
          for (_i2 = 0, _Object$keys2 = Object.keys(body); _i2 < _Object$keys2.length; _i2++) {
            key = _Object$keys2[_i2];
            if (key !== "uid_propuesta" && key !== "status") {
              solicitudUpdate[key] = body[key];
            }
          }
          _context51.next = 40;
          return solicitudRef.update(solicitudUpdate);
        case 40:
          _context51.next = 42;
          return notifyTallerPropuestaAceptada(uid_taller, {
            esInspeccion: esInspeccion
          });
        case 42:
          return _context51.abrupt("return", res.status(200).json({
            message: "Propuesta actualizada correctamente.",
            id: uid_propuesta.trim()
          }));
        case 45:
          _context51.prev = 45;
          _context51.t0 = _context51["catch"](0);
          console.error("Error al actualizar propuesta:", _context51.t0);
          return _context51.abrupt("return", res.status(500).json({
            error: "Error al actualizar propuesta: ".concat(_context51.t0.message)
          }));
        case 49:
        case "end":
          return _context51.stop();
      }
    }, _callee50, null, [[0, 45]]);
  }));
  return function updatePropuesta(_x111, _x112) {
    return _ref76.apply(this, arguments);
  };
}();
var MS_TRES_DIAS = 3 * 24 * 60 * 60 * 1000;

/** Estados pendientes de respuesta del usuario (no Aceptada / Rechazada). */
var STATUS_PROPUESTA_PENDIENTE_JOB = ["Cotizado", "cotizado", "Inspeccion", "inspeccion", "Inspección", "inspección"];
var SOLICITUD_STATUS_EN_ESPERA = "En espera por aprobación";
var SOLICITUD_STATUS_CANCELADA_JOB = "Cancelado";

/**
 * Job: (1) Propuestas Cotizado/Inspección con fecha_propuesta > 3 días → Rechazada.
 * (2) Solicitudes "En espera por aprobación" con fecha_solicitud > 3 días y sin propuestas
 *     activas en Cotizado/Inspección → Cancelada.
 */
var jobRechazarPropuestasFechaPropuestaMayor3Dias = /*#__PURE__*/function () {
  var _ref77 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee51() {
    var limite, tsVencido, BATCH, snap, actualizadosPropuestas, batch, ops, _iterator3, _step3, doc, data, fp, propActivasSnap, solicitudesConPropuestaActiva, solicSnap, actualizadosSolicitudes, batchSol, opsSol, _iterator4, _step4, _doc;
    return _regeneratorRuntime().wrap(function _callee51$(_context52) {
      while (1) switch (_context52.prev = _context52.next) {
        case 0:
          _context52.prev = 0;
          limite = admin.firestore.Timestamp.fromMillis(Date.now() - MS_TRES_DIAS);
          tsVencido = admin.firestore.Timestamp.now();
          BATCH = 500;
          _context52.next = 6;
          return db.collection("Propuestas").where("fecha_propuesta", "<", limite).where("status", "in", STATUS_PROPUESTA_PENDIENTE_JOB).get();
        case 6:
          snap = _context52.sent;
          actualizadosPropuestas = 0;
          if (snap.empty) {
            _context52.next = 41;
            break;
          }
          batch = db.batch();
          ops = 0;
          _iterator3 = _createForOfIteratorHelper(snap.docs);
          _context52.prev = 12;
          _iterator3.s();
        case 14:
          if ((_step3 = _iterator3.n()).done) {
            _context52.next = 30;
            break;
          }
          doc = _step3.value;
          data = doc.data() || {};
          fp = data.fecha_propuesta;
          if (!(!fp || typeof fp.toMillis !== "function")) {
            _context52.next = 20;
            break;
          }
          return _context52.abrupt("continue", 28);
        case 20:
          batch.update(doc.ref, {
            status: "Rechazada",
            fecha_vencido: tsVencido
          });
          ops += 1;
          actualizadosPropuestas += 1;
          if (!(ops >= BATCH)) {
            _context52.next = 28;
            break;
          }
          _context52.next = 26;
          return batch.commit();
        case 26:
          batch = db.batch();
          ops = 0;
        case 28:
          _context52.next = 14;
          break;
        case 30:
          _context52.next = 35;
          break;
        case 32:
          _context52.prev = 32;
          _context52.t0 = _context52["catch"](12);
          _iterator3.e(_context52.t0);
        case 35:
          _context52.prev = 35;
          _iterator3.f();
          return _context52.finish(35);
        case 38:
          if (!(ops > 0)) {
            _context52.next = 41;
            break;
          }
          _context52.next = 41;
          return batch.commit();
        case 41:
          if (actualizadosPropuestas > 0) {
            console.log("jobRechazarPropuestasFechaPropuestaMayor3Dias: ".concat(actualizadosPropuestas, " propuesta(s) \u2192 Rechazada (>3 d\xEDas)."));
          }
          _context52.next = 44;
          return db.collection("Propuestas").where("status", "in", STATUS_PROPUESTA_PENDIENTE_JOB).get();
        case 44:
          propActivasSnap = _context52.sent;
          solicitudesConPropuestaActiva = new Set();
          propActivasSnap.docs.forEach(function (doc) {
            var u = (doc.data() || {}).uid_solicitud;
            if (u != null && String(u).trim() !== "") {
              solicitudesConPropuestaActiva.add(String(u).trim());
            }
          });
          _context52.next = 49;
          return db.collection("Solicitudes").where("status", "==", SOLICITUD_STATUS_EN_ESPERA).where("fecha_solicitud", "<", limite).get();
        case 49:
          solicSnap = _context52.sent;
          actualizadosSolicitudes = 0;
          if (solicSnap.empty) {
            _context52.next = 82;
            break;
          }
          batchSol = db.batch();
          opsSol = 0;
          _iterator4 = _createForOfIteratorHelper(solicSnap.docs);
          _context52.prev = 55;
          _iterator4.s();
        case 57:
          if ((_step4 = _iterator4.n()).done) {
            _context52.next = 71;
            break;
          }
          _doc = _step4.value;
          if (!solicitudesConPropuestaActiva.has(_doc.id)) {
            _context52.next = 61;
            break;
          }
          return _context52.abrupt("continue", 69);
        case 61:
          batchSol.update(_doc.ref, {
            status: SOLICITUD_STATUS_CANCELADA_JOB,
            fecha_vencido: tsVencido
          });
          opsSol += 1;
          actualizadosSolicitudes += 1;
          if (!(opsSol >= BATCH)) {
            _context52.next = 69;
            break;
          }
          _context52.next = 67;
          return batchSol.commit();
        case 67:
          batchSol = db.batch();
          opsSol = 0;
        case 69:
          _context52.next = 57;
          break;
        case 71:
          _context52.next = 76;
          break;
        case 73:
          _context52.prev = 73;
          _context52.t1 = _context52["catch"](55);
          _iterator4.e(_context52.t1);
        case 76:
          _context52.prev = 76;
          _iterator4.f();
          return _context52.finish(76);
        case 79:
          if (!(opsSol > 0)) {
            _context52.next = 82;
            break;
          }
          _context52.next = 82;
          return batchSol.commit();
        case 82:
          if (actualizadosSolicitudes > 0) {
            console.log("jobRechazarPropuestasFechaPropuestaMayor3Dias: ".concat(actualizadosSolicitudes, " solicitud(es) \u2192 ").concat(SOLICITUD_STATUS_CANCELADA_JOB, " (>3 d\xEDas, sin propuesta Cotizado/Inspecci\xF3n)."));
          }
          _context52.next = 88;
          break;
        case 85:
          _context52.prev = 85;
          _context52.t2 = _context52["catch"](0);
          console.error("Error en jobRechazarPropuestasFechaPropuestaMayor3Dias:", _context52.t2);
        case 88:
        case "end":
          return _context52.stop();
      }
    }, _callee51, null, [[0, 85], [12, 32, 35, 38], [55, 73, 76, 79]]);
  }));
  return function jobRechazarPropuestasFechaPropuestaMayor3Dias() {
    return _ref77.apply(this, arguments);
  };
}();
var getPropuestasByStatus = /*#__PURE__*/function () {
  var _ref78 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee52(req, res) {
    var _ref79, status, uid_taller, snapshot, propuestas;
    return _regeneratorRuntime().wrap(function _callee52$(_context53) {
      while (1) switch (_context53.prev = _context53.next) {
        case 0:
          _context53.prev = 0;
          _ref79 = req.body || {}, status = _ref79.status, uid_taller = _ref79.uid_taller;
          if (!(!status || typeof status !== "string" || status.trim() === "")) {
            _context53.next = 4;
            break;
          }
          return _context53.abrupt("return", res.status(400).json({
            error: "status es requerido."
          }));
        case 4:
          if (!(!uid_taller || typeof uid_taller !== "string" || uid_taller.trim() === "")) {
            _context53.next = 6;
            break;
          }
          return _context53.abrupt("return", res.status(400).json({
            error: "uid_taller es requerido."
          }));
        case 6:
          _context53.next = 8;
          return db.collection("Propuestas").where("status", "==", status.trim()).where("uid_taller", "==", uid_taller.trim()).get();
        case 8:
          snapshot = _context53.sent;
          if (!snapshot.empty) {
            _context53.next = 11;
            break;
          }
          return _context53.abrupt("return", res.status(200).json([]));
        case 11:
          propuestas = snapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          });
          return _context53.abrupt("return", res.status(200).json(propuestas));
        case 15:
          _context53.prev = 15;
          _context53.t0 = _context53["catch"](0);
          console.error("Error al obtener propuestas por status:", _context53.t0);
          return _context53.abrupt("return", res.status(500).json({
            error: "Error al obtener propuestas: ".concat(_context53.t0.message)
          }));
        case 19:
        case "end":
          return _context53.stop();
      }
    }, _callee52, null, [[0, 15]]);
  }));
  return function getPropuestasByStatus(_x113, _x114) {
    return _ref78.apply(this, arguments);
  };
}();
var ReportarPagoData = /*#__PURE__*/function () {
  var _ref80 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee53(req, res) {
    var _req$body10, uid, emailZelle, cod_ref, bancoTranfe, identificacion, telefono, amount, paymentMethod, nombre, vigencia, cant_services, date, montoPago, SelectedBanco, SelectedBancoDestino, nombre_taller, base64, userId, timestamp, imageUrl, newFileName, buffer, file, subscripcionData, subscripcionRef, subscripcionId, serviciosSnapshot, batch;
    return _regeneratorRuntime().wrap(function _callee53$(_context54) {
      while (1) switch (_context54.prev = _context54.next) {
        case 0:
          _req$body10 = req.body, uid = _req$body10.uid, emailZelle = _req$body10.emailZelle, cod_ref = _req$body10.cod_ref, bancoTranfe = _req$body10.bancoTranfe, identificacion = _req$body10.identificacion, telefono = _req$body10.telefono, amount = _req$body10.amount, paymentMethod = _req$body10.paymentMethod, nombre = _req$body10.nombre, vigencia = _req$body10.vigencia, cant_services = _req$body10.cant_services, date = _req$body10.date, montoPago = _req$body10.montoPago, SelectedBanco = _req$body10.SelectedBanco, SelectedBancoDestino = _req$body10.SelectedBancoDestino, nombre_taller = _req$body10.nombre_taller, base64 = _req$body10.base64;
          _context54.prev = 1;
          userId = uid;
          timestamp = new Date().toISOString(); // Generar la fecha y hora actuales
          imageUrl = '';
          if (!(base64 && base64.trim() !== '')) {
            _context54.next = 12;
            break;
          }
          newFileName = "paymentcommitment/".concat(paymentMethod, "_").concat(userId, "_").concat(timestamp, ".jpg");
          buffer = Buffer.from(base64, 'base64');
          file = bucket.file(newFileName); // Subir la nueva imagen usando la función `uploadImage`
          _context54.next = 11;
          return uploadImage(file, buffer);
        case 11:
          imageUrl = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(newFileName);
        case 12:
          subscripcionData = {
            cantidad_servicios: cant_services == undefined ? "" : cant_services,
            comprobante_pago: {
              bancoDestino: SelectedBancoDestino == undefined ? "" : SelectedBancoDestino,
              bancoOrigen: SelectedBanco == undefined ? "" : SelectedBanco,
              cedula: identificacion == undefined ? "" : identificacion,
              correo: emailZelle == undefined ? "" : emailZelle,
              fechaPago: date == undefined ? "" : date,
              metodo: paymentMethod == undefined ? "" : paymentMethod,
              monto: montoPago == undefined ? "" : montoPago,
              numReferencia: cod_ref == undefined ? "" : cod_ref,
              telefono: telefono == undefined ? "" : telefono,
              comprobante: imageUrl
            },
            monto: amount == undefined ? "" : amount,
            nombre: nombre == undefined ? "" : nombre,
            status: "Por Aprobar",
            taller_uid: userId == undefined ? "" : userId,
            vigencia: vigencia == undefined ? "" : vigencia,
            fecha_inicio: admin.firestore.Timestamp.now(),
            fecha_fin: vigencia ? admin.firestore.Timestamp.fromMillis(Date.now() + parseInt(vigencia) * 24 * 60 * 60 * 1000) : "",
            nombre_taller: nombre_taller == undefined ? "" : nombre_taller
          }; // Guardar en la colección Subscripciones
          _context54.next = 15;
          return db.collection('Subscripciones').add(subscripcionData);
        case 15:
          subscripcionRef = _context54.sent;
          subscripcionId = subscripcionRef.id; // Guardar en el campo subscripcion_actual del documento en la colección Usuarios
          _context54.next = 19;
          return db.collection('Usuarios').doc(userId).update({
            subscripcion_actual: subscripcionData
          });
        case 19:
          _context54.next = 21;
          return db.collection('Servicios').where('uid_taller', '==', userId).get();
        case 21:
          serviciosSnapshot = _context54.sent;
          batch = db.batch();
          serviciosSnapshot.forEach(function (doc) {
            batch.update(doc.ref, {
              estatus: false
            });
          });
          _context54.next = 26;
          return batch.commit();
        case 26:
          return _context54.abrupt("return", res.status(201).send({
            message: "Suscripción guardada con éxito."
          }));
        case 29:
          _context54.prev = 29;
          _context54.t0 = _context54["catch"](1);
          console.error("Error al guardar la suscripción:", _context54.t0);
          res.status(500).send("Error al guardar la suscripción");
        case 33:
        case "end":
          return _context54.stop();
      }
    }, _callee53, null, [[1, 29]]);
  }));
  return function ReportarPagoData(_x115, _x116) {
    return _ref80.apply(this, arguments);
  };
}();
var AsociarPlan = /*#__PURE__*/function () {
  var _ref81 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee54(req, res) {
    var _req$body11, uid, plan_uid, userId, timestamp, planRef, planData, userRef, userData, subscripcionData, subscripcionRef, subscripcionId, _planRef, _planData;
    return _regeneratorRuntime().wrap(function _callee54$(_context55) {
      while (1) switch (_context55.prev = _context55.next) {
        case 0:
          _req$body11 = req.body, uid = _req$body11.uid, plan_uid = _req$body11.plan_uid;
          _context55.prev = 1;
          userId = uid;
          timestamp = new Date().toISOString(); // Generar la fecha y hora actuales
          console.log("plan_uid", plan_uid);
          console.log("userId", userId);
          if (!(plan_uid == 'gratis')) {
            _context55.next = 27;
            break;
          }
          _context55.next = 9;
          return db.collection("Planes").doc('IPbc9VN1kmvIwrZHzNpd').get();
        case 9:
          planRef = _context55.sent;
          planData = planRef.data();
          _context55.next = 13;
          return db.collection("Usuarios").doc(userId).get();
        case 13:
          userRef = _context55.sent;
          userData = userRef.data();
          subscripcionData = {
            cantidad_servicios: planData.cantidad_servicios == undefined ? "" : planData.cantidad_servicios,
            comprobante_pago: {
              bancoDestino: "",
              bancoOrigen: "",
              cedula: "",
              correo: "",
              fechaPago: "",
              metodo: "",
              monto: "",
              numReferencia: "",
              telefono: "",
              comprobante: ""
            },
            monto: planData.monto == undefined ? "" : planData.monto,
            nombre: planData.nombre == undefined ? "" : planData.nombre,
            status: "Aprobado",
            taller_uid: userId == undefined ? "" : userId,
            vigencia: planData.vigencia == undefined ? "" : planData.vigencia,
            fecha_inicio: admin.firestore.Timestamp.now(),
            fecha_fin: planData.vigencia ? admin.firestore.Timestamp.fromMillis(Date.now() + parseInt(planData.vigencia) * 24 * 60 * 60 * 1000) : "",
            nombre_taller: userData.nombre == undefined ? "" : userData.nombre
          }; // Guardar en la colección Subscripciones
          console.log(subscripcionData);
          _context55.next = 19;
          return db.collection('Subscripciones').add(subscripcionData);
        case 19:
          subscripcionRef = _context55.sent;
          subscripcionId = subscripcionRef.id;
          console.log(subscripcionId);

          // Guardar en el campo subscripcion_actual del documento en la colección Usuarios
          _context55.next = 24;
          return db.collection('Usuarios').doc(userId).update({
            subscripcion_actual: subscripcionData
          });
        case 24:
          return _context55.abrupt("return", res.status(201).send({
            message: "Suscripción guardada con éxito."
          }));
        case 27:
          _context55.next = 29;
          return db.collection("Planes").doc(plan_uid).get();
        case 29:
          _planRef = _context55.sent;
          _planData = _planRef.data();
          console.log(_planData);
        case 32:
          _context55.next = 38;
          break;
        case 34:
          _context55.prev = 34;
          _context55.t0 = _context55["catch"](1);
          console.error("Error al asociar el plan:", _context55.t0);
          res.status(500).send("Error al asociar el plan");
        case 38:
        case "end":
          return _context55.stop();
      }
    }, _callee54, null, [[1, 34]]);
  }));
  return function AsociarPlan(_x117, _x118) {
    return _ref81.apply(this, arguments);
  };
}();
var getPlanesActivos3Days = /*#__PURE__*/function () {
  var _ref82 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee56() {
    var result, usuarios, fechaActual, fechaEn3Dias, usuariosEn3Dias;
    return _regeneratorRuntime().wrap(function _callee56$(_context57) {
      while (1) switch (_context57.prev = _context57.next) {
        case 0:
          _context57.prev = 0;
          _context57.next = 3;
          return db.collection("Usuarios").where("subscripcion_actual.status", "==", "Aprobado").get();
        case 3:
          result = _context57.sent;
          if (!result.empty) {
            _context57.next = 6;
            break;
          }
          return _context57.abrupt("return", console.log("No se encontraron usuarios"));
        case 6:
          usuarios = result.docs.map(function (doc) {
            return doc.data();
          });
          fechaActual = new Date();
          fechaEn3Dias = new Date();
          fechaEn3Dias.setDate(fechaActual.getDate() + 3);

          // Filtrar usuarios cuya fecha_fin esté a 3 días de la fecha actual
          usuariosEn3Dias = usuarios.filter(function (usuario) {
            var subscripcion_actual = usuario.subscripcion_actual;
            if (!subscripcion_actual || !subscripcion_actual.fecha_fin) {
              return false;
            }
            var fechaFin = subscripcion_actual.fecha_fin.toDate();

            // Verificar si la fecha_fin está entre hoy y 3 días
            var fechaInicio = new Date(fechaActual);
            fechaInicio.setHours(0, 0, 0, 0);
            var fechaFinComparacion = new Date(fechaEn3Dias);
            fechaFinComparacion.setHours(23, 59, 59, 999);
            return fechaFin >= fechaInicio && fechaFin <= fechaFinComparacion;
          });
          if (!(usuariosEn3Dias.length === 0)) {
            _context57.next = 13;
            break;
          }
          return _context57.abrupt("return", console.log("No se encontraron usuarios con subscripción que expire en 3 días"));
        case 13:
          // Mostrar los tokens de los usuarios que expiran en 3 días
          console.log("Usuarios con subscripción que expira en 3 días:");
          usuariosEn3Dias.forEach(/*#__PURE__*/function () {
            var _ref83 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee55(usuario) {
              var fechaFin, hoy, finDia, msPorDia, diasRestantes, titlePlazo, bodyPlazo, message, response;
              return _regeneratorRuntime().wrap(function _callee55$(_context56) {
                while (1) switch (_context56.prev = _context56.next) {
                  case 0:
                    console.log("Token: ".concat(usuario.token));
                    fechaFin = usuario.subscripcion_actual.fecha_fin.toDate();
                    hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    finDia = new Date(fechaFin);
                    finDia.setHours(0, 0, 0, 0);
                    msPorDia = 24 * 60 * 60 * 1000;
                    diasRestantes = Math.round((finDia.getTime() - hoy.getTime()) / msPorDia);
                    if (diasRestantes <= 0) {
                      titlePlazo = "Suscripción Expirada";
                      bodyPlazo = "Tu plan ha vencido. Tus servicios ya no son visibles en el mapa. Activa un plan hoy mismo.";
                    } else {
                      titlePlazo = "¡Mantén tu visibilidad!";
                      bodyPlazo = diasRestantes === 1 ? "Tu plan vence en 1 día. Renueva ahora para seguir recibiendo solicitudes de clientes." : "Tu plan vence en ".concat(diasRestantes, " d\xEDas. Renueva ahora para seguir recibiendo solicitudes de clientes.");
                    }

                    //Send Notifications
                    message = {
                      notification: {
                        title: titlePlazo,
                        body: bodyPlazo
                      },
                      data: {
                        secretCode: 'plantoexpire'
                      },
                      token: usuario.token
                    };
                    _context56.prev = 10;
                    _context56.next = 13;
                    return admin.messaging().send(message);
                  case 13:
                    response = _context56.sent;
                    console.log("Successfully sent message:", response);
                    _context56.next = 20;
                    break;
                  case 17:
                    _context56.prev = 17;
                    _context56.t0 = _context56["catch"](10);
                    console.error("Error sending message:", _context56.t0);
                  case 20:
                  case "end":
                    return _context56.stop();
                }
              }, _callee55, null, [[10, 17]]);
            }));
            return function (_x119) {
              return _ref83.apply(this, arguments);
            };
          }());
          _context57.next = 21;
          break;
        case 17:
          _context57.prev = 17;
          _context57.t0 = _context57["catch"](0);
          console.error("Error al actualizar usuarios y servicios:", _context57.t0); // Muestra el error en la consola del servidor
          console.log("Error al actualizar usuarios y servicios: ".concat(_context57.t0.message)); // Muestra el mensaje del error
        case 21:
        case "end":
          return _context57.stop();
      }
    }, _callee56, null, [[0, 17]]);
  }));
  return function getPlanesActivos3Days() {
    return _ref82.apply(this, arguments);
  };
}();
var getPlanesActivos = /*#__PURE__*/function () {
  var _ref84 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee57() {
    var result, usuarios, fechaActual, usuariosFiltrados, _iterator5, _step5, _loop2;
    return _regeneratorRuntime().wrap(function _callee57$(_context59) {
      while (1) switch (_context59.prev = _context59.next) {
        case 0:
          _context59.prev = 0;
          _context59.next = 3;
          return db.collection("Usuarios").where("subscripcion_actual.status", "==", "Aprobado").get();
        case 3:
          result = _context59.sent;
          if (!result.empty) {
            _context59.next = 6;
            break;
          }
          return _context59.abrupt("return", console.log("No se encontraron usuarios"));
        case 6:
          usuarios = result.docs.map(function (doc) {
            return doc.data();
          });
          fechaActual = new Date();
          usuariosFiltrados = usuarios.filter(function (usuario) {
            var _subscripcion_actual$, _subscripcion_actual$2;
            var subscripcion_actual = usuario.subscripcion_actual;

            // Si no existen fecha_inicio y fecha_fin, no tomar en cuenta este usuario
            if (!(subscripcion_actual !== null && subscripcion_actual !== void 0 && subscripcion_actual.fecha_inicio) || !(subscripcion_actual !== null && subscripcion_actual !== void 0 && subscripcion_actual.fecha_fin)) {
              return false;
            }
            var fechaInicio = subscripcion_actual === null || subscripcion_actual === void 0 || (_subscripcion_actual$ = subscripcion_actual.fecha_inicio) === null || _subscripcion_actual$ === void 0 ? void 0 : _subscripcion_actual$.toDate();
            var fechaFin = subscripcion_actual === null || subscripcion_actual === void 0 || (_subscripcion_actual$2 = subscripcion_actual.fecha_fin) === null || _subscripcion_actual$2 === void 0 ? void 0 : _subscripcion_actual$2.toDate();
            return fechaActual < fechaInicio || fechaActual > fechaFin;
          });
          if (!(usuariosFiltrados.length === 0)) {
            _context59.next = 11;
            break;
          }
          return _context59.abrupt("return", console.log("No se encontraron usuarios con subscripción fuera de vigencia"));
        case 11:
          // Actualizar subscripcion_actual.cantidad_servicios a 0 y estatus a false en "Servicios"
          _iterator5 = _createForOfIteratorHelper(usuariosFiltrados);
          _context59.prev = 12;
          _loop2 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop2() {
            var usuario, userRef, serviciosSnapshot, batch;
            return _regeneratorRuntime().wrap(function _loop2$(_context58) {
              while (1) switch (_context58.prev = _context58.next) {
                case 0:
                  usuario = _step5.value;
                  userRef = db.collection("Usuarios").doc(usuario.uid);
                  _context58.next = 4;
                  return userRef.update({
                    "subscripcion_actual.cantidad_servicios": 0,
                    "subscripcion_actual.status": 'Vencido'
                  });
                case 4:
                  _context58.next = 6;
                  return db.collection("Servicios").where("uid_taller", "==", usuario.uid).get();
                case 6:
                  serviciosSnapshot = _context58.sent;
                  batch = db.batch();
                  serviciosSnapshot.forEach(function (doc) {
                    var servicioRef = db.collection("Servicios").doc(doc.id);
                    batch.update(servicioRef, {
                      estatus: false
                    });
                  });
                  _context58.next = 11;
                  return batch.commit();
                case 11:
                case "end":
                  return _context58.stop();
              }
            }, _loop2);
          });
          _iterator5.s();
        case 15:
          if ((_step5 = _iterator5.n()).done) {
            _context59.next = 19;
            break;
          }
          return _context59.delegateYield(_loop2(), "t0", 17);
        case 17:
          _context59.next = 15;
          break;
        case 19:
          _context59.next = 24;
          break;
        case 21:
          _context59.prev = 21;
          _context59.t1 = _context59["catch"](12);
          _iterator5.e(_context59.t1);
        case 24:
          _context59.prev = 24;
          _iterator5.f();
          return _context59.finish(24);
        case 27:
          console.log("Usuarios y servicios actualizados correctamente.");
          _context59.next = 34;
          break;
        case 30:
          _context59.prev = 30;
          _context59.t2 = _context59["catch"](0);
          console.error("Error al actualizar usuarios y servicios:", _context59.t2); // Muestra el error en la consola del servidor
          console.log("Error al actualizar usuarios y servicios: ".concat(_context59.t2.message)); // Muestra el mensaje del error
        case 34:
        case "end":
          return _context59.stop();
      }
    }, _callee57, null, [[0, 30], [12, 21, 24, 27]]);
  }));
  return function getPlanesActivos() {
    return _ref84.apply(this, arguments);
  };
}();
var getPlanesVencidos = /*#__PURE__*/function () {
  var _ref85 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee58() {
    var result, usuarios, fechaActual, usuariosFiltrados, _iterator6, _step6, _loop3;
    return _regeneratorRuntime().wrap(function _callee58$(_context61) {
      while (1) switch (_context61.prev = _context61.next) {
        case 0:
          _context61.prev = 0;
          _context61.next = 3;
          return db.collection("Usuarios").where("subscripcion_actual.status", "==", "Vencido").get();
        case 3:
          result = _context61.sent;
          if (!result.empty) {
            _context61.next = 6;
            break;
          }
          return _context61.abrupt("return", console.log("No se encontraron usuarios"));
        case 6:
          usuarios = result.docs.map(function (doc) {
            return doc.data();
          });
          fechaActual = new Date();
          usuariosFiltrados = usuarios.filter(function (usuario) {
            var _subscripcion_actual$3, _subscripcion_actual$4;
            var subscripcion_actual = usuario.subscripcion_actual;

            // Si no existen fecha_inicio y fecha_fin, no tomar en cuenta este usuario
            if (!(subscripcion_actual !== null && subscripcion_actual !== void 0 && subscripcion_actual.fecha_inicio) || !(subscripcion_actual !== null && subscripcion_actual !== void 0 && subscripcion_actual.fecha_fin)) {
              return false;
            }
            var fechaInicio = subscripcion_actual === null || subscripcion_actual === void 0 || (_subscripcion_actual$3 = subscripcion_actual.fecha_inicio) === null || _subscripcion_actual$3 === void 0 ? void 0 : _subscripcion_actual$3.toDate();
            var fechaFin = subscripcion_actual === null || subscripcion_actual === void 0 || (_subscripcion_actual$4 = subscripcion_actual.fecha_fin) === null || _subscripcion_actual$4 === void 0 ? void 0 : _subscripcion_actual$4.toDate();
            return fechaActual < fechaInicio || fechaActual > fechaFin;
          });
          if (!(usuariosFiltrados.length === 0)) {
            _context61.next = 11;
            break;
          }
          return _context61.abrupt("return", console.log("No se encontraron usuarios con subscripción fuera de vigencia"));
        case 11:
          // Actualizar subscripcion_actual.cantidad_servicios a 0 y estatus a false en "Servicios"
          _iterator6 = _createForOfIteratorHelper(usuariosFiltrados);
          _context61.prev = 12;
          _loop3 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop3() {
            var usuario, userRef, serviciosSnapshot, batch;
            return _regeneratorRuntime().wrap(function _loop3$(_context60) {
              while (1) switch (_context60.prev = _context60.next) {
                case 0:
                  usuario = _step6.value;
                  userRef = db.collection("Usuarios").doc(usuario.uid);
                  _context60.next = 4;
                  return userRef.update({
                    "subscripcion_actual.cantidad_servicios": 0,
                    "subscripcion_actual.status": 'Vencido'
                  });
                case 4:
                  _context60.next = 6;
                  return db.collection("Servicios").where("uid_taller", "==", usuario.uid).get();
                case 6:
                  serviciosSnapshot = _context60.sent;
                  batch = db.batch();
                  serviciosSnapshot.forEach(function (doc) {
                    var servicioRef = db.collection("Servicios").doc(doc.id);
                    batch.update(servicioRef, {
                      estatus: false
                    });
                  });
                  _context60.next = 11;
                  return batch.commit();
                case 11:
                case "end":
                  return _context60.stop();
              }
            }, _loop3);
          });
          _iterator6.s();
        case 15:
          if ((_step6 = _iterator6.n()).done) {
            _context61.next = 19;
            break;
          }
          return _context61.delegateYield(_loop3(), "t0", 17);
        case 17:
          _context61.next = 15;
          break;
        case 19:
          _context61.next = 24;
          break;
        case 21:
          _context61.prev = 21;
          _context61.t1 = _context61["catch"](12);
          _iterator6.e(_context61.t1);
        case 24:
          _context61.prev = 24;
          _iterator6.f();
          return _context61.finish(24);
        case 27:
          console.log("Usuarios y servicios actualizados correctamente.");
          _context61.next = 34;
          break;
        case 30:
          _context61.prev = 30;
          _context61.t2 = _context61["catch"](0);
          console.error("Error al actualizar usuarios y servicios:", _context61.t2); // Muestra el error en la consola del servidor
          console.log("Error al actualizar usuarios y servicios: ".concat(_context61.t2.message)); // Muestra el mensaje del error
        case 34:
        case "end":
          return _context61.stop();
      }
    }, _callee58, null, [[0, 30], [12, 21, 24, 27]]);
  }));
  return function getPlanesVencidos() {
    return _ref85.apply(this, arguments);
  };
}();
var sendNotification = /*#__PURE__*/function () {
  var _ref86 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee59(req, res) {
    var _req$body12, token, title, body, secretCode, message, response;
    return _regeneratorRuntime().wrap(function _callee59$(_context62) {
      while (1) switch (_context62.prev = _context62.next) {
        case 0:
          _req$body12 = req.body, token = _req$body12.token, title = _req$body12.title, body = _req$body12.body, secretCode = _req$body12.secretCode;
          message = {
            notification: {
              title: title,
              body: body
            },
            data: {
              secretCode: secretCode
            },
            token: token
          };
          _context62.prev = 2;
          _context62.next = 5;
          return admin.messaging().send(message);
        case 5:
          response = _context62.sent;
          console.log("Successfully sent message:", response);
          res.status(200).send({
            message: "Notification sent successfully"
          });
          _context62.next = 14;
          break;
        case 10:
          _context62.prev = 10;
          _context62.t0 = _context62["catch"](2);
          console.error("Error sending message:", _context62.t0);
          res.status(500).send({
            message: "Error sending message",
            error: _context62.t0.message
          });
        case 14:
        case "end":
          return _context62.stop();
      }
    }, _callee59, null, [[2, 10]]);
  }));
  return function sendNotification(_x120, _x121) {
    return _ref86.apply(this, arguments);
  };
}();
var updateUsuarioDocumentacionConductor = /*#__PURE__*/function () {
  var _ref87 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee60(req, res) {
    var body, _uid6, uidTrim, userRef, userSnap, existing, patch, docFields, _i3, _docFields, _docFields$_i, bodyKey, fileBase, patchResponse, _i4, _Object$keys3, k, v;
    return _regeneratorRuntime().wrap(function _callee60$(_context63) {
      while (1) switch (_context63.prev = _context63.next) {
        case 0:
          _context63.prev = 0;
          body = req.body || {};
          _uid6 = body.uid;
          if (!(!_uid6 || typeof _uid6 !== "string" || String(_uid6).trim() === "")) {
            _context63.next = 5;
            break;
          }
          return _context63.abrupt("return", res.status(400).json({
            error: "Se debe proporcionar uid."
          }));
        case 5:
          uidTrim = String(_uid6).trim();
          userRef = db.collection("Usuarios").doc(uidTrim);
          _context63.next = 9;
          return userRef.get();
        case 9:
          userSnap = _context63.sent;
          if (userSnap.exists) {
            _context63.next = 12;
            break;
          }
          return _context63.abrupt("return", res.status(404).json({
            error: "Usuario no encontrado."
          }));
        case 12:
          existing = userSnap.data() || {};
          patch = {};
          docFields = [{
            bodyKey: "licencia_frente_base64",
            fileBase: "licencia_frente"
          }, {
            bodyKey: "licencia_reverso_base64",
            fileBase: "licencia_reverso"
          }, {
            bodyKey: "certificado_medico_frente_base64",
            fileBase: "certificado_medico_frente"
          }, {
            bodyKey: "certificado_medico_reverso_base64",
            fileBase: "certificado_medico_reverso"
          }];
          _i3 = 0, _docFields = docFields;
        case 16:
          if (!(_i3 < _docFields.length)) {
            _context63.next = 26;
            break;
          }
          _docFields$_i = _docFields[_i3], bodyKey = _docFields$_i.bodyKey, fileBase = _docFields$_i.fileBase;
          if (Object.prototype.hasOwnProperty.call(body, bodyKey)) {
            _context63.next = 20;
            break;
          }
          return _context63.abrupt("continue", 23);
        case 20:
          _context63.next = 22;
          return usuarioConductorResolveDocField(uidTrim, body[bodyKey], bodyKey, fileBase, existing);
        case 22:
          patch[bodyKey] = _context63.sent;
        case 23:
          _i3++;
          _context63.next = 16;
          break;
        case 26:
          if (Object.prototype.hasOwnProperty.call(body, "licencia_fecha_vencimiento")) {
            patch.licencia_fecha_vencimiento = vehiculoValueToTimestamp(body.licencia_fecha_vencimiento);
          }
          if (Object.prototype.hasOwnProperty.call(body, "certificado_medico_fecha_vencimiento")) {
            patch.certificado_medico_fecha_vencimiento = vehiculoValueToTimestamp(body.certificado_medico_fecha_vencimiento);
          }
          if (!(Object.keys(patch).length === 0)) {
            _context63.next = 30;
            break;
          }
          return _context63.abrupt("return", res.status(400).json({
            error: "No se enviaron campos para actualizar."
          }));
        case 30:
          _context63.next = 32;
          return userRef.update(patch);
        case 32:
          patchResponse = _objectSpread({}, patch);
          for (_i4 = 0, _Object$keys3 = Object.keys(patchResponse); _i4 < _Object$keys3.length; _i4++) {
            k = _Object$keys3[_i4];
            v = patchResponse[k];
            if (v && typeof v.toDate === "function") {
              patchResponse[k] = v.toDate().toISOString();
            }
          }
          return _context63.abrupt("return", res.status(200).json(_objectSpread({
            message: "Documentación de conductor actualizada.",
            uid: uidTrim
          }, patchResponse)));
        case 37:
          _context63.prev = 37;
          _context63.t0 = _context63["catch"](0);
          console.error("Error al actualizar documentación de conductor:", _context63.t0);
          return _context63.abrupt("return", res.status(500).json({
            message: "Error al actualizar documentación de conductor",
            error: _context63.t0.message
          }));
        case 41:
        case "end":
          return _context63.stop();
      }
    }, _callee60, null, [[0, 37]]);
  }));
  return function updateUsuarioDocumentacionConductor(_x122, _x123) {
    return _ref87.apply(this, arguments);
  };
}();
var UpdateUsuariosAll = /*#__PURE__*/function () {
  var _ref88 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee61(req, res) {
    var _uid7;
    return _regeneratorRuntime().wrap(function _callee61$(_context64) {
      while (1) switch (_context64.prev = _context64.next) {
        case 0:
          _context64.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _uid7 = req.body.uid; // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
          _context64.next = 4;
          return db.collection("Usuarios").doc(_uid7).update(req.body);
        case 4:
          // Responder con un mensaje de éxito
          res.status(200).send({
            message: "Usuario actualizado con éxito",
            uid: _uid7
          });
          _context64.next = 11;
          break;
        case 7:
          _context64.prev = 7;
          _context64.t0 = _context64["catch"](0);
          console.error("Error al actualizar el usuario:", _context64.t0);

          // En caso de error, responder con el mensaje correspondiente
          res.status(500).send({
            message: "Error al actualizar el usuario",
            error: _context64.t0.message
          });
        case 11:
        case "end":
          return _context64.stop();
      }
    }, _callee61, null, [[0, 7]]);
  }));
  return function UpdateUsuariosAll(_x124, _x125) {
    return _ref88.apply(this, arguments);
  };
}();
var deleteUserFromAuth = /*#__PURE__*/function () {
  var _ref89 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee62(req, res) {
    var _uid8;
    return _regeneratorRuntime().wrap(function _callee62$(_context65) {
      while (1) switch (_context65.prev = _context65.next) {
        case 0:
          _context65.prev = 0;
          _uid8 = req.body.uid;
          if (_uid8) {
            _context65.next = 4;
            break;
          }
          return _context65.abrupt("return", res.status(400).send({
            message: "El UID es requerido"
          }));
        case 4:
          _context65.next = 6;
          return admin.auth().deleteUser(_uid8);
        case 6:
          _context65.next = 8;
          return db.collection("Usuarios").doc(_uid8)["delete"]();
        case 8:
          return _context65.abrupt("return", res.status(200).send({
            message: "Usuario eliminado exitosamente de Firebase Authentication y Firestore"
          }));
        case 11:
          _context65.prev = 11;
          _context65.t0 = _context65["catch"](0);
          console.error("Error al eliminar al usuario:", _context65.t0);
          if (!(_context65.t0.code === "auth/user-not-found")) {
            _context65.next = 18;
            break;
          }
          return _context65.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado en Firebase Authentication"
          }));
        case 18:
          if (!(_context65.t0.code === "not-found")) {
            _context65.next = 22;
            break;
          }
          return _context65.abrupt("return", res.status(404).send({
            message: "Documento no encontrado en Firestore"
          }));
        case 22:
          return _context65.abrupt("return", res.status(500).send({
            message: "Error al eliminar al usuario",
            error: _context65.t0.message
          }));
        case 23:
        case "end":
          return _context65.stop();
      }
    }, _callee62, null, [[0, 11]]);
  }));
  return function deleteUserFromAuth(_x126, _x127) {
    return _ref89.apply(this, arguments);
  };
}();
var updateScheduleDate = /*#__PURE__*/function () {
  var _ref90 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee63(req, res) {
    var _req$body13, uid, scheduled_visit;
    return _regeneratorRuntime().wrap(function _callee63$(_context66) {
      while (1) switch (_context66.prev = _context66.next) {
        case 0:
          _req$body13 = req.body, uid = _req$body13.uid, scheduled_visit = _req$body13.scheduled_visit;
          _context66.next = 3;
          return db.collection("Usuarios").doc(uid).update({
            scheduled_visit: scheduled_visit
          });
        case 3:
          return _context66.abrupt("return", res.status(200).send({
            message: "Fecha de programación actualizada con éxito"
          }));
        case 4:
        case "end":
          return _context66.stop();
      }
    }, _callee63);
  }));
  return function updateScheduleDate(_x128, _x129) {
    return _ref90.apply(this, arguments);
  };
}();
var deleteVehiculo = /*#__PURE__*/function () {
  var _ref91 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee64(req, res) {
    var _ref92, uiduser, uidvehicle, userId, vehicleId, userRef, vehiculoRef, vehiculoDoc, userSnap, userData, currentNotif, notificacionesVehiculos, storagePath, file, batch;
    return _regeneratorRuntime().wrap(function _callee64$(_context67) {
      while (1) switch (_context67.prev = _context67.next) {
        case 0:
          _context67.prev = 0;
          _ref92 = req.body || {}, uiduser = _ref92.uiduser, uidvehicle = _ref92.uidvehicle;
          if (!(!uiduser || !uidvehicle)) {
            _context67.next = 4;
            break;
          }
          return _context67.abrupt("return", res.status(400).json({
            error: "uiduser y uidvehicle son requeridos."
          }));
        case 4:
          userId = String(uiduser).trim();
          vehicleId = String(uidvehicle).trim();
          if (!(!userId || !vehicleId)) {
            _context67.next = 8;
            break;
          }
          return _context67.abrupt("return", res.status(400).json({
            error: "uiduser y uidvehicle no pueden estar vacíos."
          }));
        case 8:
          userRef = db.collection("Usuarios").doc(userId);
          vehiculoRef = userRef.collection("Vehiculos").doc(vehicleId);
          _context67.next = 12;
          return vehiculoRef.get();
        case 12:
          vehiculoDoc = _context67.sent;
          if (vehiculoDoc.exists) {
            _context67.next = 15;
            break;
          }
          return _context67.abrupt("return", res.status(404).json({
            error: "Vehículo no encontrado para este usuario."
          }));
        case 15:
          _context67.next = 17;
          return userRef.get();
        case 17:
          userSnap = _context67.sent;
          userData = userSnap.data() || {};
          currentNotif = Array.isArray(userData.notificacionesVehiculos) ? userData.notificacionesVehiculos : [];
          notificacionesVehiculos = currentNotif.filter(function (item) {
            return !(item && _typeof(item) === "object" && item.uidvehicle === vehicleId);
          });
          storagePath = "vehicles/".concat(userId, "/").concat(vehicleId, "/").concat(vehicleId, ".jpg");
          file = bucket.file(storagePath);
          _context67.prev = 23;
          _context67.next = 26;
          return file["delete"]();
        case 26:
          _context67.next = 31;
          break;
        case 28:
          _context67.prev = 28;
          _context67.t0 = _context67["catch"](23);
          console.warn("No se pudo eliminar la imagen del vehículo:", _context67.t0.message || _context67.t0);
        case 31:
          batch = db.batch();
          batch["delete"](vehiculoRef);
          if (userSnap.exists) {
            batch.update(userRef, {
              notificacionesVehiculos: notificacionesVehiculos
            });
          }
          _context67.next = 36;
          return batch.commit();
        case 36:
          return _context67.abrupt("return", res.status(200).json({
            message: "Vehículo, su imagen (si existía) y sus notificaciones asociadas fueron eliminados correctamente.",
            uiduser: userId,
            uidvehicle: vehicleId
          }));
        case 39:
          _context67.prev = 39;
          _context67.t1 = _context67["catch"](0);
          console.error("Error al eliminar vehículo:", _context67.t1);
          return _context67.abrupt("return", res.status(500).json({
            error: "Error al eliminar veh\xEDculo: ".concat(_context67.t1.message)
          }));
        case 43:
        case "end":
          return _context67.stop();
      }
    }, _callee64, null, [[0, 39], [23, 28]]);
  }));
  return function deleteVehiculo(_x130, _x131) {
    return _ref91.apply(this, arguments);
  };
}();
var updateVehiculoKm = /*#__PURE__*/function () {
  var _ref93 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee65(req, res) {
    var _ref94, uid_user, uid_vehicle, km, kmNum, userId, vehicleId, userRef, userSnap, vehiculoRef, vehiculoSnap;
    return _regeneratorRuntime().wrap(function _callee65$(_context68) {
      while (1) switch (_context68.prev = _context68.next) {
        case 0:
          _context68.prev = 0;
          _ref94 = req.body || {}, uid_user = _ref94.uid_user, uid_vehicle = _ref94.uid_vehicle, km = _ref94.km;
          if (!(!uid_user || typeof uid_user !== "string" || uid_user.trim() === "")) {
            _context68.next = 4;
            break;
          }
          return _context68.abrupt("return", res.status(400).json({
            error: "uid_user es requerido."
          }));
        case 4:
          if (!(!uid_vehicle || typeof uid_vehicle !== "string" || uid_vehicle.trim() === "")) {
            _context68.next = 6;
            break;
          }
          return _context68.abrupt("return", res.status(400).json({
            error: "uid_vehicle es requerido."
          }));
        case 6:
          if (!(km === undefined || km === null || km === "")) {
            _context68.next = 8;
            break;
          }
          return _context68.abrupt("return", res.status(400).json({
            error: "km es requerido."
          }));
        case 8:
          kmNum = typeof km === "number" ? km : parseInt(String(km).trim(), 10);
          if (!(!Number.isFinite(kmNum) || kmNum < 0)) {
            _context68.next = 11;
            break;
          }
          return _context68.abrupt("return", res.status(400).json({
            error: "km debe ser un número entero mayor o igual a 0."
          }));
        case 11:
          userId = uid_user.trim();
          vehicleId = uid_vehicle.trim();
          userRef = db.collection("Usuarios").doc(userId);
          _context68.next = 16;
          return userRef.get();
        case 16:
          userSnap = _context68.sent;
          if (userSnap.exists) {
            _context68.next = 19;
            break;
          }
          return _context68.abrupt("return", res.status(404).json({
            error: "Usuario no encontrado."
          }));
        case 19:
          vehiculoRef = userRef.collection("Vehiculos").doc(vehicleId);
          _context68.next = 22;
          return vehiculoRef.get();
        case 22:
          vehiculoSnap = _context68.sent;
          if (vehiculoSnap.exists) {
            _context68.next = 25;
            break;
          }
          return _context68.abrupt("return", res.status(404).json({
            error: "Vehículo no encontrado en este usuario."
          }));
        case 25:
          _context68.next = 27;
          return vehiculoRef.update({
            KM: kmNum
          });
        case 27:
          return _context68.abrupt("return", res.status(200).json({
            message: "Kilometraje del vehículo actualizado.",
            uid_user: userId,
            uid_vehicle: vehicleId,
            KM: kmNum
          }));
        case 30:
          _context68.prev = 30;
          _context68.t0 = _context68["catch"](0);
          console.error("Error al actualizar KM del vehículo:", _context68.t0);
          return _context68.abrupt("return", res.status(500).json({
            error: "Error al actualizar KM: ".concat(_context68.t0.message)
          }));
        case 34:
        case "end":
          return _context68.stop();
      }
    }, _callee65, null, [[0, 30]]);
  }));
  return function updateVehiculoKm(_x132, _x133) {
    return _ref93.apply(this, arguments);
  };
}();

/** Deja solo ítems de notificaciones con active === true; elimina vehículos sin ninguna activa. */
var filterNotificacionesVehiculosSoloActivas = function filterNotificacionesVehiculosSoloActivas(notificacionesVehiculos) {
  if (!Array.isArray(notificacionesVehiculos)) return [];
  return notificacionesVehiculos.map(function (veh) {
    if (!veh || _typeof(veh) !== "object") return null;
    var list = Array.isArray(veh.notificaciones) ? veh.notificaciones : [];
    var notificaciones = list.filter(function (n) {
      return n && _typeof(n) === "object" && n.active === true;
    });
    return _objectSpread(_objectSpread({}, veh), {}, {
      notificaciones: notificaciones
    });
  }).filter(function (veh) {
    return veh && veh.notificaciones.length > 0;
  });
};
var vehiculoCamposNotificacionDesdeDoc = function vehiculoCamposNotificacionDesdeDoc(data) {
  var d = data && _typeof(data) === "object" ? data : {};
  return {
    vehiculo_marca: vehiculoCoalesceEmpty(d.vehiculo_marca),
    vehiculo_modelo: vehiculoCoalesceEmpty(d.vehiculo_modelo),
    vehiculo_placa: vehiculoCoalesceEmpty(d.vehiculo_placa),
    vehiculo_anio: vehiculoCoalesceEmpty(d.vehiculo_anio)
  };
};
var nombreUsuarioDesdeDocUsuario = function nombreUsuarioDesdeDocUsuario(u) {
  var _ref95, _u$nombre;
  if (!u || _typeof(u) !== "object") return "";
  var raw = (_ref95 = (_u$nombre = u.nombre) !== null && _u$nombre !== void 0 ? _u$nombre : u.Nombre) !== null && _ref95 !== void 0 ? _ref95 : u.nombre_usuario;
  return vehiculoCoalesceEmpty(raw);
};
var startOfDayLocal = function startOfDayLocal(d) {
  var x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/** proximaRevision en DD/MM/YYYY → inicio de ese día local, o null si no es válido. */
var parseProximaRevisionDDMMYYYY = function parseProximaRevisionDDMMYYYY(raw) {
  if (raw == null) return null;
  var str = String(raw).trim();
  var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  var day = parseInt(m[1], 10);
  var month = parseInt(m[2], 10) - 1;
  var year = parseInt(m[3], 10);
  var dt = new Date(year, month, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month || dt.getDate() !== day) return null;
  return startOfDayLocal(dt);
};
var describeVehiculoParaNotificacion = function describeVehiculoParaNotificacion(item) {
  var marca = vehiculoCoalesceEmpty(item.vehiculo_marca);
  var modelo = vehiculoCoalesceEmpty(item.vehiculo_modelo);
  var placa = vehiculoCoalesceEmpty(item.vehiculo_placa);
  var anio = vehiculoCoalesceEmpty(item.vehiculo_anio);
  var nucleo = "tu vehículo";
  if (marca || modelo) nucleo = [marca, modelo].filter(Boolean).join(" ").trim() || nucleo;
  var partes = [];
  if (placa) partes.push("placa ".concat(placa));
  if (anio !== "" && anio != null) partes.push("a\xF1o ".concat(anio));
  if (partes.length) return "".concat(nucleo, " (").concat(partes.join(", "), ")");
  return nucleo;
};
var lineaFechaProximaRevision = function lineaFechaProximaRevision(proximaRevision) {
  var prox = vehiculoCoalesceEmpty(proximaRevision);
  return prox ? "Ten\xEDas anotada la fecha ".concat(prox, ".") : "";
};
var lineaFechaProgramadaProxima = function lineaFechaProgramadaProxima(proximaRevision) {
  var prox = vehiculoCoalesceEmpty(proximaRevision);
  return prox ? "La fecha que tienes programada es el ".concat(prox, ".") : "";
};
var textoDiasRestantes = function textoDiasRestantes(dias) {
  return dias === 1 ? "Falta 1 día" : "Faltan ".concat(dias, " d\xEDas");
};

/** meta: { kind: 'vencida' } | { kind: 'proxima', diasRestantes: number } (1–7) */
var mensajeMantenimientoPushPorSecretCode = function mensajeMantenimientoPushPorSecretCode(item, meta) {
  var nombreUser = vehiculoCoalesceEmpty(item.nombre_usuario) || "amigo";
  var nombreTipo = vehiculoCoalesceEmpty(item.nombre) || "este mantenimiento";
  var veh = describeVehiculoParaNotificacion(item);
  var fechaTxtVenc = lineaFechaProximaRevision(item.proximaRevision);
  var fechaTxtProx = lineaFechaProgramadaProxima(item.proximaRevision);
  var cierreVenc = "Cuando puedas, agenda o revisa el servicio para seguir manejando con tranquilidad.";
  var cierreProx = "Te avisamos con tiempo para que puedas organizarlo sin apuros.";
  if (meta.kind === "proxima") {
    var diasTxt = textoDiasRestantes(meta.diasRestantes);
    switch (item.secretCode) {
      case "KMCorreTiempo":
        return {
          title: "Mantenimiento preventivo",
          body: "Est\xE1s cerca del vencimiento para revisar la correa de tiempo. Evita da\xF1os mayores al motor de tu ".concat(veh, ".")
        };
      case "UltimaAlineacionRuedas":
        return {
          title: "¡Conduce con precisión! 🛞",
          body: "Es momento de revisar la alineaci\xF3n y el balanceo seg\xFAn tu cronograma. Cuida tus neum\xE1ticos y conduce seguro."
        };
      case "UltimoAbastecimientoCombustible":
        return {
          title: "¡Revisa tu tanque!",
          body: "Seg\xFAn tu programaci\xF3n, est\xE1s cerca del l\xEDmite para repostar combustible en tu ".concat(veh, ". \xA1No esperes a que baje m\xE1s!")
        };
      case "UltimoCambioBujiasFiltro":
        return {
          title: "¡Asegura el encendido!",
          body: "Toca revisi\xF3n de buj\xEDas y filtros pronto. Asegura que tu ".concat(veh, " siempre arranque a la primera.")
        };
      case "UltimoLavado":
        return {
          title: "".concat(nombreUser, ", lavado en la mira"),
          body: "Hola ".concat(nombreUser, ", ").concat(diasTxt, " para el \xAB").concat(nombreTipo, "\xBB (lavado) de tu ").concat(veh, ". ").concat(fechaTxtProx, " Un buen lavado mantiene bonito el auto. ").concat(cierreProx)
        };
      case "UltimoMantenimientoSistemaInyeccion":
        return {
          title: "¡Potencia al máximo!",
          body: "Se acerca el mantenimiento de inyectores seg\xFAn tu registro. Mejora el rendimiento y el consumo de combustible."
        };
      case "UltimocambioAceite":
        return {
          title: "¿Hora de un servicio?",
          body: "Tu cambio de aceite est\xE1 cerca del l\xEDmite programado. Ag\xE9ndalo con un aliado y cuida el motor de tu ".concat(veh, ".")
        };
      default:
        return {
          title: "".concat(nombreUser, ", mantenimiento pr\xF3ximo"),
          body: "Hola ".concat(nombreUser, ", ").concat(diasTxt, " para \xAB").concat(nombreTipo, "\xBB de tu ").concat(veh, ". ").concat(fechaTxtProx, " ").concat(cierreProx)
        };
    }
  }
  switch (item.secretCode) {
    case "KMCorreTiempo":
      return {
        title: "ALERTA: Correa de tiempo",
        body: "L\xEDmite de mantenimiento excedido. Es urgente realizar este servicio en tu ".concat(veh, " para proteger el motor.")
      };
    case "UltimaAlineacionRuedas":
      return {
        title: "Alineación vencida",
        body: "Tu historial indica que ya expir\xF3 el tiempo o kilometraje para alinear. Evita el desgaste de tus cauchos."
      };
    case "UltimoAbastecimientoCombustible":
      return {
        title: "Alerta de Combustible",
        body: "Ya alcanzaste el intervalo programado para cargar combustible. Reporta tu carga ahora para no perder el control de tu historial."
      };
    case "UltimoCambioBujiasFiltro":
      return {
        title: "Mantenimiento de Bujías/Filtro",
        body: "Intervalo de servicio excedido. Reemplaza las buj\xEDas y los filtros para evitar desgaste innecesario en tu ".concat(veh, ".")
      };
    case "UltimoLavado":
      return {
        title: "".concat(nombreUser, ", momento de un buen lavado"),
        body: "Hola ".concat(nombreUser, ", para tu ").concat(veh, " la fecha de \xAB").concat(nombreTipo, "\xBB (lavado) ya pas\xF3. ").concat(fechaTxtVenc, " Un lavado ayuda a cuidar la pintura y el valor del auto. ").concat(cierreVenc)
      };
    case "UltimoMantenimientoSistemaInyeccion":
      return {
        title: "Servicio de Inyección pendiente",
        body: "Ya superaste el intervalo de limpieza programado. Evita fallas y mant\xE9n tu motor a punto."
      };
    case "UltimocambioAceite":
      return {
        title: "Cambio de Aceite requerido",
        body: "Ya alcanzaste el l\xEDmite para tu servicio de aceite. Real\xEDzalo ahora para mantener tu estatus operativo en \xF3ptimo."
      };
    default:
      return {
        title: "".concat(nombreUser, ", mantenimiento pendiente"),
        body: "Hola ".concat(nombreUser, ", tu ").concat(veh, " tiene vencido el mantenimiento de \xAB").concat(nombreTipo, "\xBB. ").concat(fechaTxtVenc, " ").concat(cierreVenc)
      };
  }
};
var enviarPushMantenimientoVencido = /*#__PURE__*/function () {
  var _ref96 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee66(item, title, body) {
    var token, reqNotif, resNotif;
    return _regeneratorRuntime().wrap(function _callee66$(_context69) {
      while (1) switch (_context69.prev = _context69.next) {
        case 0:
          token = item.token;
          if (!(!token || typeof token !== "string" || !token.trim())) {
            _context69.next = 4;
            break;
          }
          console.warn("Mantenimiento vencido: sin token FCM, uiduser=", item.uiduser);
          return _context69.abrupt("return");
        case 4:
          reqNotif = {
            body: {
              token: token.trim(),
              title: String(title).slice(0, 200),
              body: String(body).slice(0, 1024),
              secretCode: item.secretCode != null ? String(item.secretCode) : ""
            }
          };
          resNotif = {
            status: function status() {
              return {
                send: function send() {}
              };
            }
          };
          _context69.next = 8;
          return sendNotification(reqNotif, resNotif);
        case 8:
        case "end":
          return _context69.stop();
      }
    }, _callee66);
  }));
  return function enviarPushMantenimientoVencido(_x134, _x135, _x136) {
    return _ref96.apply(this, arguments);
  };
}();

/**
 * Por cada notificación activa: token, uiduser, uidvehicle, campos de la notificación y datos del doc Vehiculos.
 */
var expandNotificacionesVehiculosActivasConVehiculoDocs = /*#__PURE__*/function () {
  var _ref97 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee68(usuariosConActivas) {
    var items, cache, getCamposVehiculo, _iterator7, _step7, u, uiduser, token, bloques, _iterator8, _step8, veh, uidvehicle, camposVeh, notifs, _iterator9, _step9, notif;
    return _regeneratorRuntime().wrap(function _callee68$(_context71) {
      while (1) switch (_context71.prev = _context71.next) {
        case 0:
          items = [];
          cache = new Map();
          getCamposVehiculo = /*#__PURE__*/function () {
            var _ref98 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee67(uiduser, uidvehicle) {
              var key, snap, campos;
              return _regeneratorRuntime().wrap(function _callee67$(_context70) {
                while (1) switch (_context70.prev = _context70.next) {
                  case 0:
                    key = "".concat(uiduser, "::").concat(uidvehicle);
                    if (!cache.has(key)) {
                      _context70.next = 3;
                      break;
                    }
                    return _context70.abrupt("return", cache.get(key));
                  case 3:
                    _context70.next = 5;
                    return db.collection("Usuarios").doc(uiduser).collection("Vehiculos").doc(uidvehicle).get();
                  case 5:
                    snap = _context70.sent;
                    campos = snap.exists ? vehiculoCamposNotificacionDesdeDoc(snap.data()) : vehiculoCamposNotificacionDesdeDoc(null);
                    cache.set(key, campos);
                    return _context70.abrupt("return", campos);
                  case 9:
                  case "end":
                    return _context70.stop();
                }
              }, _callee67);
            }));
            return function getCamposVehiculo(_x138, _x139) {
              return _ref98.apply(this, arguments);
            };
          }();
          _iterator7 = _createForOfIteratorHelper(usuariosConActivas);
          _context71.prev = 4;
          _iterator7.s();
        case 6:
          if ((_step7 = _iterator7.n()).done) {
            _context71.next = 55;
            break;
          }
          u = _step7.value;
          uiduser = u.id;
          token = vehiculoCoalesceEmpty(u.token);
          bloques = Array.isArray(u.notificacionesVehiculos) ? u.notificacionesVehiculos : [];
          _iterator8 = _createForOfIteratorHelper(bloques);
          _context71.prev = 12;
          _iterator8.s();
        case 14:
          if ((_step8 = _iterator8.n()).done) {
            _context71.next = 45;
            break;
          }
          veh = _step8.value;
          if (!(!veh || _typeof(veh) !== "object")) {
            _context71.next = 18;
            break;
          }
          return _context71.abrupt("continue", 43);
        case 18:
          uidvehicle = veh.uidvehicle != null && String(veh.uidvehicle).trim() !== "" ? String(veh.uidvehicle).trim() : "";
          if (uidvehicle) {
            _context71.next = 21;
            break;
          }
          return _context71.abrupt("continue", 43);
        case 21:
          _context71.next = 23;
          return getCamposVehiculo(uiduser, uidvehicle);
        case 23:
          camposVeh = _context71.sent;
          notifs = Array.isArray(veh.notificaciones) ? veh.notificaciones : [];
          _iterator9 = _createForOfIteratorHelper(notifs);
          _context71.prev = 26;
          _iterator9.s();
        case 28:
          if ((_step9 = _iterator9.n()).done) {
            _context71.next = 35;
            break;
          }
          notif = _step9.value;
          if (!(!notif || _typeof(notif) !== "object" || notif.active !== true)) {
            _context71.next = 32;
            break;
          }
          return _context71.abrupt("continue", 33);
        case 32:
          items.push(_objectSpread(_objectSpread({
            token: token,
            uiduser: uiduser,
            uidvehicle: uidvehicle
          }, notif), {}, {
            nombre_usuario: nombreUsuarioDesdeDocUsuario(u)
          }, camposVeh));
        case 33:
          _context71.next = 28;
          break;
        case 35:
          _context71.next = 40;
          break;
        case 37:
          _context71.prev = 37;
          _context71.t0 = _context71["catch"](26);
          _iterator9.e(_context71.t0);
        case 40:
          _context71.prev = 40;
          _iterator9.f();
          return _context71.finish(40);
        case 43:
          _context71.next = 14;
          break;
        case 45:
          _context71.next = 50;
          break;
        case 47:
          _context71.prev = 47;
          _context71.t1 = _context71["catch"](12);
          _iterator8.e(_context71.t1);
        case 50:
          _context71.prev = 50;
          _iterator8.f();
          return _context71.finish(50);
        case 53:
          _context71.next = 6;
          break;
        case 55:
          _context71.next = 60;
          break;
        case 57:
          _context71.prev = 57;
          _context71.t2 = _context71["catch"](4);
          _iterator7.e(_context71.t2);
        case 60:
          _context71.prev = 60;
          _iterator7.f();
          return _context71.finish(60);
        case 63:
          return _context71.abrupt("return", items);
        case 64:
        case "end":
          return _context71.stop();
      }
    }, _callee68, null, [[4, 57, 60, 63], [12, 47, 50, 53], [26, 37, 40, 43]]);
  }));
  return function expandNotificacionesVehiculosActivasConVehiculoDocs(_x137) {
    return _ref97.apply(this, arguments);
  };
}();
var CRON_DEFAULTS_KM_BY_SECRET_CODE = {
  UltimocambioAceite: 500,
  KMCorreTiempo: 1000,
  UltimoMantenimientoSistemaInyeccion: 500,
  UltimaAlineacionRuedas: 300,
  UltimoAbastecimientoCombustible: 100,
  UltimoLavado: 100,
  UltimoCambioBujiasFiltro: 500
};
var cronGetWarningThresholdKm = function cronGetWarningThresholdKm(notif) {
  var _notif$secretCode;
  var fromApi = Number(notif === null || notif === void 0 ? void 0 : notif.intervaloKMXVencer);
  if (Number.isFinite(fromApi) && fromApi > 0) return Math.round(fromApi);
  var sc = String((_notif$secretCode = notif === null || notif === void 0 ? void 0 : notif.secretCode) !== null && _notif$secretCode !== void 0 ? _notif$secretCode : '').trim();
  if (sc && CRON_DEFAULTS_KM_BY_SECRET_CODE[sc] != null) {
    return CRON_DEFAULTS_KM_BY_SECRET_CODE[sc];
  }
  return 3000;
};
var CRON_DEFAULTS_DIAS_BY_SECRET_CODE = {
  UltimocambioAceite: 7,
  KMCorreTiempo: 15,
  UltimoMantenimientoSistemaInyeccion: 15,
  UltimaAlineacionRuedas: 7,
  UltimoAbastecimientoCombustible: 3,
  UltimoLavado: 3,
  UltimoCambioBujiasFiltro: 15
};
var cronGetWarningThresholdDias = function cronGetWarningThresholdDias(item) {
  var _item$secretCode;
  var fromApi = Number(item === null || item === void 0 ? void 0 : item.intervaloTiempoXVencer);
  if (Number.isFinite(fromApi) && fromApi > 0) return Math.round(fromApi);
  var sc = String((_item$secretCode = item === null || item === void 0 ? void 0 : item.secretCode) !== null && _item$secretCode !== void 0 ? _item$secretCode : '').trim();
  if (sc && CRON_DEFAULTS_DIAS_BY_SECRET_CODE[sc] != null) {
    return CRON_DEFAULTS_DIAS_BY_SECRET_CODE[sc];
  }
  return 7;
};

/** Usuarios de la colección Usuarios que tienen el campo notificacionesVehiculos definido y no nulo (Firestore: != null excluye ausencia del campo). */
var getUsuariosConNotificacionesVehiculos = /*#__PURE__*/function () {
  var _ref99 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee69() {
    var snapshot, usuarios, conActivas, items, hoy, conItemsParaPushMantenimiento, itemParaPushMantenimiento, _iterator10, _step10, _item, fechaProx, diasRestantes, warningThresholdDias, _iterator11, _step11, item, _mensajeMantenimiento, title, body;
    return _regeneratorRuntime().wrap(function _callee69$(_context72) {
      while (1) switch (_context72.prev = _context72.next) {
        case 0:
          _context72.prev = 0;
          _context72.next = 3;
          return db.collection("Usuarios").where("notificacionesVehiculos", "!=", null).get();
        case 3:
          snapshot = _context72.sent;
          if (!snapshot.empty) {
            _context72.next = 7;
            break;
          }
          console.log("Job notificacionesVehiculos: no hay usuarios con ese campo.");
          return _context72.abrupt("return", []);
        case 7:
          usuarios = snapshot.docs.map(function (doc) {
            var data = doc.data();
            var notificacionesVehiculos = filterNotificacionesVehiculosSoloActivas(data.notificacionesVehiculos);
            return _objectSpread(_objectSpread({
              id: doc.id
            }, data), {}, {
              notificacionesVehiculos: notificacionesVehiculos
            });
          });
          conActivas = usuarios.filter(function (u) {
            return u.notificacionesVehiculos.length > 0;
          });
          _context72.next = 11;
          return expandNotificacionesVehiculosActivasConVehiculoDocs(conActivas);
        case 11:
          items = _context72.sent;
          console.log("Job notificacionesVehiculos: ".concat(usuarios.length, " usuario(s) con campo; ").concat(conActivas.length, " con active === true; ").concat(items.length, " \xEDtem(s) expandido(s) con datos de Vehiculos/."));
          hoy = startOfDayLocal(new Date());
          conItemsParaPushMantenimiento = 0;
          itemParaPushMantenimiento = [];
          _iterator10 = _createForOfIteratorHelper(items);
          _context72.prev = 17;
          _iterator10.s();
        case 19:
          if ((_step10 = _iterator10.n()).done) {
            _context72.next = 33;
            break;
          }
          _item = _step10.value;
          fechaProx = parseProximaRevisionDDMMYYYY(_item.proximaRevision);
          if (fechaProx) {
            _context72.next = 24;
            break;
          }
          return _context72.abrupt("continue", 31);
        case 24:
          if (!(fechaProx < hoy)) {
            _context72.next = 28;
            break;
          }
          conItemsParaPushMantenimiento += 1;
          itemParaPushMantenimiento.push(_objectSpread(_objectSpread({}, _item), {}, {
            _mantenimientoPushMeta: {
              kind: "vencida"
            }
          }));
          return _context72.abrupt("continue", 31);
        case 28:
          diasRestantes = Math.round((fechaProx.getTime() - hoy.getTime()) / 86400000);
          warningThresholdDias = cronGetWarningThresholdDias(_item);
          if (diasRestantes >= 1 && diasRestantes <= warningThresholdDias) {
            conItemsParaPushMantenimiento += 1;
            itemParaPushMantenimiento.push(_objectSpread(_objectSpread({}, _item), {}, {
              _mantenimientoPushMeta: {
                kind: "proxima",
                diasRestantes: diasRestantes
              }
            }));
          }
        case 31:
          _context72.next = 19;
          break;
        case 33:
          _context72.next = 38;
          break;
        case 35:
          _context72.prev = 35;
          _context72.t0 = _context72["catch"](17);
          _iterator10.e(_context72.t0);
        case 38:
          _context72.prev = 38;
          _iterator10.f();
          return _context72.finish(38);
        case 41:
          if (!(conItemsParaPushMantenimiento > 0)) {
            _context72.next = 60;
            break;
          }
          _iterator11 = _createForOfIteratorHelper(itemParaPushMantenimiento);
          _context72.prev = 43;
          _iterator11.s();
        case 45:
          if ((_step11 = _iterator11.n()).done) {
            _context72.next = 52;
            break;
          }
          item = _step11.value;
          _mensajeMantenimiento = mensajeMantenimientoPushPorSecretCode(item, item._mantenimientoPushMeta), title = _mensajeMantenimiento.title, body = _mensajeMantenimiento.body;
          _context72.next = 50;
          return enviarPushMantenimientoVencido(item, title, body);
        case 50:
          _context72.next = 45;
          break;
        case 52:
          _context72.next = 57;
          break;
        case 54:
          _context72.prev = 54;
          _context72.t1 = _context72["catch"](43);
          _iterator11.e(_context72.t1);
        case 57:
          _context72.prev = 57;
          _iterator11.f();
          return _context72.finish(57);
        case 60:
          return _context72.abrupt("return", items);
        case 63:
          _context72.prev = 63;
          _context72.t2 = _context72["catch"](0);
          console.error("Error al obtener usuarios con notificacionesVehiculos:", _context72.t2);
          return _context72.abrupt("return", []);
        case 67:
        case "end":
          return _context72.stop();
      }
    }, _callee69, null, [[0, 63], [17, 35, 38, 41], [43, 54, 57, 60]]);
  }));
  return function getUsuariosConNotificacionesVehiculos() {
    return _ref99.apply(this, arguments);
  };
}();

/** secretCode en data FCM para km ≥ proximoKM (mantenimiento por odómetro vencido). */
var SECRET_CODE_PROXIMO_KM_SUPERADO = "ProximoKmSuperado";
/** secretCode en data FCM: faltan más de 0 y hasta 3000 km para llegar a proximoKM (3002 ya no entra). */
var SECRET_CODE_PROXIMO_KM_ADVERTENCIA = "ProximoKmAdvertenciaHasta3000";
var cronKmParseEnteroNoNegativo = function cronKmParseEnteroNoNegativo(raw) {
  if (raw === undefined || raw === null || raw === "") return null;
  var n = typeof raw === "number" ? raw : parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
};
var cronKmEnviarPushUsuario = /*#__PURE__*/function () {
  var _ref100 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee70(token, title, body, secretCode) {
    var reqNotif, resNotif;
    return _regeneratorRuntime().wrap(function _callee70$(_context73) {
      while (1) switch (_context73.prev = _context73.next) {
        case 0:
          if (!(!token || typeof token !== "string" || !token.trim())) {
            _context73.next = 2;
            break;
          }
          return _context73.abrupt("return", false);
        case 2:
          reqNotif = {
            body: {
              token: token.trim(),
              title: String(title).slice(0, 200),
              body: String(body).slice(0, 1024),
              secretCode: String(secretCode)
            }
          };
          resNotif = {
            status: function status() {
              return {
                send: function send() {}
              };
            }
          };
          _context73.prev = 4;
          _context73.next = 7;
          return sendNotification(reqNotif, resNotif);
        case 7:
          return _context73.abrupt("return", true);
        case 10:
          _context73.prev = 10;
          _context73.t0 = _context73["catch"](4);
          console.error("cronKm push:", _context73.t0.message, secretCode);
          return _context73.abrupt("return", false);
        case 14:
        case "end":
          return _context73.stop();
      }
    }, _callee70, null, [[4, 10]]);
  }));
  return function cronKmEnviarPushUsuario(_x140, _x141, _x142, _x143) {
    return _ref100.apply(this, arguments);
  };
}();
var cronKmMensajeSuperadoProximo = function cronKmMensajeSuperadoProximo(ctx) {
  var vehDesc = ctx.vehDesc;
  return {
    title: "Sincroniza tu odómetro",
    body: "Actualiza el kilometraje de tu ".concat(vehDesc, " para que tus recordatorios de mantenimiento sigan siendo exactos.")
  };
};
var cronKmMensajeAdvertenciaRango = function cronKmMensajeAdvertenciaRango(ctx) {
  var vehDesc = ctx.vehDesc;
  return {
    title: "Sincroniza tu odómetro",
    body: "Actualiza el kilometraje de tu ".concat(vehDesc, " para que tus recordatorios de mantenimiento sigan siendo exactos.")
  };
};

/**
 * KM del doc Vehiculos vs proximoKM en la notificación (active === true).
 * - Si KM >= proximoKM: push amistoso (superaste el km objetivo).
 * - Si faltan de 1 a 3000 km para proximoKM: push advertencia (1200 sí; 3002 no).
 */
var cronKmEvaluarNotificacionActiva = /*#__PURE__*/function () {
  var _ref102 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee71(_ref101) {
    var _ref103, _notif$ultimoKM, _ref104, _notif$intervalokm;
    var token, nombreUsuario, uidvehicle, notif, vehData, kmVehiculo, ultimoKM, intervalokm, kmDelta, nombreTipo, vehDesc, enviados, _cronKmMensajeSuperad, title, body, ok, warningThresholdKm, _cronKmMensajeAdverte, _title, _body, _ok;
    return _regeneratorRuntime().wrap(function _callee71$(_context74) {
      while (1) switch (_context74.prev = _context74.next) {
        case 0:
          token = _ref101.token, nombreUsuario = _ref101.nombreUsuario, uidvehicle = _ref101.uidvehicle, notif = _ref101.notif, vehData = _ref101.vehData;
          kmVehiculo = cronKmParseEnteroNoNegativo(vehData === null || vehData === void 0 ? void 0 : vehData.KM);
          if (!(kmVehiculo === null)) {
            _context74.next = 4;
            break;
          }
          return _context74.abrupt("return", {
            enviados: 0
          });
        case 4:
          ultimoKM = cronKmParseEnteroNoNegativo((_ref103 = (_notif$ultimoKM = notif.ultimoKM) !== null && _notif$ultimoKM !== void 0 ? _notif$ultimoKM : notif.ultimokm) !== null && _ref103 !== void 0 ? _ref103 : notif.ultimo_km);
          intervalokm = cronKmParseEnteroNoNegativo((_ref104 = (_notif$intervalokm = notif.intervalokm) !== null && _notif$intervalokm !== void 0 ? _notif$intervalokm : notif.intervaloKm) !== null && _ref104 !== void 0 ? _ref104 : notif.intervaloKM);
          if (!(ultimoKM === null || intervalokm === null || intervalokm <= 0)) {
            _context74.next = 8;
            break;
          }
          return _context74.abrupt("return", {
            enviados: 0
          });
        case 8:
          kmDelta = intervalokm - (kmVehiculo - ultimoKM);
          nombreTipo = vehiculoCoalesceEmpty(notif.nombre) || "este mantenimiento";
          vehDesc = describeVehiculoParaNotificacion(vehData || {});
          enviados = 0;
          if (!(kmDelta < 0)) {
            _context74.next = 19;
            break;
          }
          _cronKmMensajeSuperad = cronKmMensajeSuperadoProximo({
            nombre: nombreUsuario,
            vehDesc: vehDesc,
            nombreTipo: nombreTipo,
            kmVehiculo: kmVehiculo,
            proximoKM: ultimoKM + intervalokm
          }), title = _cronKmMensajeSuperad.title, body = _cronKmMensajeSuperad.body;
          _context74.next = 16;
          return cronKmEnviarPushUsuario(token, title, body, SECRET_CODE_PROXIMO_KM_SUPERADO);
        case 16:
          ok = _context74.sent;
          if (ok) enviados += 1;
          return _context74.abrupt("return", {
            enviados: enviados
          });
        case 19:
          warningThresholdKm = cronGetWarningThresholdKm(notif);
          if (!(kmDelta >= 1 && kmDelta <= warningThresholdKm)) {
            _context74.next = 26;
            break;
          }
          _cronKmMensajeAdverte = cronKmMensajeAdvertenciaRango({
            nombre: nombreUsuario,
            vehDesc: vehDesc,
            nombreTipo: nombreTipo,
            kmVehiculo: kmVehiculo,
            proximoKM: ultimoKM + intervalokm,
            kmRestantes: kmDelta
          }), _title = _cronKmMensajeAdverte.title, _body = _cronKmMensajeAdverte.body;
          _context74.next = 24;
          return cronKmEnviarPushUsuario(token, _title, _body, SECRET_CODE_PROXIMO_KM_ADVERTENCIA);
        case 24:
          _ok = _context74.sent;
          if (_ok) enviados += 1;
        case 26:
          return _context74.abrupt("return", {
            enviados: enviados
          });
        case 27:
        case "end":
          return _context74.stop();
      }
    }, _callee71);
  }));
  return function cronKmEvaluarNotificacionActiva(_x144) {
    return _ref102.apply(this, arguments);
  };
}();
var jobNotificacionesVehiculosProximoKm = /*#__PURE__*/function () {
  var _ref105 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee72() {
    var snapshot, totalEnviados, _iterator12, _step12, doc, data, bloques, token, nombreUsuario, uiduser, userRef, _iterator13, _step13, veh, uidvehicle, vehSnap, vehData, notifs, _iterator14, _step14, notif, _yield$cronKmEvaluarN, enviados;
    return _regeneratorRuntime().wrap(function _callee72$(_context75) {
      while (1) switch (_context75.prev = _context75.next) {
        case 0:
          _context75.prev = 0;
          _context75.next = 3;
          return db.collection("Usuarios").where("notificacionesVehiculos", "!=", null).get();
        case 3:
          snapshot = _context75.sent;
          if (!snapshot.empty) {
            _context75.next = 6;
            break;
          }
          return _context75.abrupt("return");
        case 6:
          totalEnviados = 0;
          _iterator12 = _createForOfIteratorHelper(snapshot.docs);
          _context75.prev = 8;
          _iterator12.s();
        case 10:
          if ((_step12 = _iterator12.n()).done) {
            _context75.next = 73;
            break;
          }
          doc = _step12.value;
          data = doc.data();
          bloques = filterNotificacionesVehiculosSoloActivas(data.notificacionesVehiculos);
          if (bloques.length) {
            _context75.next = 16;
            break;
          }
          return _context75.abrupt("continue", 71);
        case 16:
          token = vehiculoCoalesceEmpty(data.token);
          if (token) {
            _context75.next = 19;
            break;
          }
          return _context75.abrupt("continue", 71);
        case 19:
          nombreUsuario = nombreUsuarioDesdeDocUsuario(data) || "amigo";
          uiduser = doc.id;
          userRef = db.collection("Usuarios").doc(uiduser);
          _iterator13 = _createForOfIteratorHelper(bloques);
          _context75.prev = 23;
          _iterator13.s();
        case 25:
          if ((_step13 = _iterator13.n()).done) {
            _context75.next = 63;
            break;
          }
          veh = _step13.value;
          if (!(!veh || _typeof(veh) !== "object")) {
            _context75.next = 29;
            break;
          }
          return _context75.abrupt("continue", 61);
        case 29:
          uidvehicle = veh.uidvehicle != null && String(veh.uidvehicle).trim() !== "" ? String(veh.uidvehicle).trim() : "";
          if (uidvehicle) {
            _context75.next = 32;
            break;
          }
          return _context75.abrupt("continue", 61);
        case 32:
          _context75.next = 34;
          return userRef.collection("Vehiculos").doc(uidvehicle).get();
        case 34:
          vehSnap = _context75.sent;
          if (vehSnap.exists) {
            _context75.next = 37;
            break;
          }
          return _context75.abrupt("continue", 61);
        case 37:
          vehData = vehSnap.data() || {};
          notifs = Array.isArray(veh.notificaciones) ? veh.notificaciones : [];
          _iterator14 = _createForOfIteratorHelper(notifs);
          _context75.prev = 40;
          _iterator14.s();
        case 42:
          if ((_step14 = _iterator14.n()).done) {
            _context75.next = 53;
            break;
          }
          notif = _step14.value;
          if (!(!notif || _typeof(notif) !== "object" || notif.active !== true)) {
            _context75.next = 46;
            break;
          }
          return _context75.abrupt("continue", 51);
        case 46:
          _context75.next = 48;
          return cronKmEvaluarNotificacionActiva({
            token: token,
            nombreUsuario: nombreUsuario,
            uidvehicle: uidvehicle,
            notif: notif,
            vehData: vehData
          });
        case 48:
          _yield$cronKmEvaluarN = _context75.sent;
          enviados = _yield$cronKmEvaluarN.enviados;
          totalEnviados += enviados;
        case 51:
          _context75.next = 42;
          break;
        case 53:
          _context75.next = 58;
          break;
        case 55:
          _context75.prev = 55;
          _context75.t0 = _context75["catch"](40);
          _iterator14.e(_context75.t0);
        case 58:
          _context75.prev = 58;
          _iterator14.f();
          return _context75.finish(58);
        case 61:
          _context75.next = 25;
          break;
        case 63:
          _context75.next = 68;
          break;
        case 65:
          _context75.prev = 65;
          _context75.t1 = _context75["catch"](23);
          _iterator13.e(_context75.t1);
        case 68:
          _context75.prev = 68;
          _iterator13.f();
          return _context75.finish(68);
        case 71:
          _context75.next = 10;
          break;
        case 73:
          _context75.next = 78;
          break;
        case 75:
          _context75.prev = 75;
          _context75.t2 = _context75["catch"](8);
          _iterator12.e(_context75.t2);
        case 78:
          _context75.prev = 78;
          _iterator12.f();
          return _context75.finish(78);
        case 81:
          if (totalEnviados > 0) {
            console.log("Job proximoKM (Vehiculos): ".concat(totalEnviados, " notificaci\xF3n(es) enviada(s)."));
          }
          _context75.next = 87;
          break;
        case 84:
          _context75.prev = 84;
          _context75.t3 = _context75["catch"](0);
          console.error("Error en job notificaciones proximoKM:", _context75.t3);
        case 87:
        case "end":
          return _context75.stop();
      }
    }, _callee72, null, [[0, 84], [8, 75, 78, 81], [23, 65, 68, 71], [40, 55, 58, 61]]);
  }));
  return function jobNotificacionesVehiculosProximoKm() {
    return _ref105.apply(this, arguments);
  };
}();
var SECRET_CODE_LICENCIA_VENC = "licencia_fecha_vencimiento";
var SECRET_CODE_CERT_MEDICO_VENC = "certificado_medico_fecha_vencimiento";
var firestoreFechaToStartOfDayLocal = function firestoreFechaToStartOfDayLocal(v) {
  if (v == null) return null;
  var d;
  if (typeof v.toDate === "function") d = v.toDate();else if (v instanceof Date) d = new Date(v);else d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return startOfDayLocal(d);
};
var formatoFechaDDMMAAAA = function formatoFechaDDMMAAAA(fechaInicioDia) {
  var dd = String(fechaInicioDia.getDate()).padStart(2, "0");
  var mm = String(fechaInicioDia.getMonth() + 1).padStart(2, "0");
  var yyyy = fechaInicioDia.getFullYear();
  return "".concat(dd, "/").concat(mm, "/").concat(yyyy);
};

/** Vencida (antes de hoy) o faltan 1–30 días; si no aplica, null. */
var clasificarVencimientoDocumento = function clasificarVencimientoDocumento(fechaVencInicioDia) {
  var hoy = startOfDayLocal(new Date());
  if (fechaVencInicioDia < hoy) return {
    kind: "vencida"
  };
  var diasRestantes = Math.round((fechaVencInicioDia.getTime() - hoy.getTime()) / 86400000);
  if (diasRestantes >= 1 && diasRestantes <= 30) {
    return {
      kind: "proxima",
      diasRestantes: diasRestantes
    };
  }
  return null;
};

/** Vencida o faltan 1–31 días (~un mes); para RCV y trimestres del vehículo. */
var clasificarVencimientoDocumentoProximoMes = function clasificarVencimientoDocumentoProximoMes(fechaVencInicioDia) {
  var hoy = startOfDayLocal(new Date());
  if (fechaVencInicioDia < hoy) return {
    kind: "vencida"
  };
  var diasRestantes = Math.round((fechaVencInicioDia.getTime() - hoy.getTime()) / 86400000);
  if (diasRestantes >= 1 && diasRestantes <= 31) {
    return {
      kind: "proxima",
      diasRestantes: diasRestantes
    };
  }
  return null;
};
var enviarPushDocumentacionConductorJob = /*#__PURE__*/function () {
  var _ref106 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee73(token, title, body, secretCode) {
    var reqNotif, resNotif;
    return _regeneratorRuntime().wrap(function _callee73$(_context76) {
      while (1) switch (_context76.prev = _context76.next) {
        case 0:
          if (!(!token || typeof token !== "string" || !token.trim())) {
            _context76.next = 2;
            break;
          }
          return _context76.abrupt("return", false);
        case 2:
          reqNotif = {
            body: {
              token: token.trim(),
              title: String(title).slice(0, 200),
              body: String(body).slice(0, 1024),
              secretCode: String(secretCode)
            }
          };
          resNotif = {
            status: function status() {
              return {
                send: function send() {}
              };
            }
          };
          _context76.prev = 4;
          _context76.next = 7;
          return sendNotification(reqNotif, resNotif);
        case 7:
          return _context76.abrupt("return", true);
        case 10:
          _context76.prev = 10;
          _context76.t0 = _context76["catch"](4);
          console.error("Push documentación conductor:", _context76.t0.message, secretCode);
          return _context76.abrupt("return", false);
        case 14:
        case "end":
          return _context76.stop();
      }
    }, _callee73, null, [[4, 10]]);
  }));
  return function enviarPushDocumentacionConductorJob(_x145, _x146, _x147, _x148) {
    return _ref106.apply(this, arguments);
  };
}();

/**
 * Usuarios con licencia_fecha_vencimiento y/o certificado_medico_fecha_vencimiento.
 * Notifica si venció o faltan 1–30 días. secretCode en data: licencia_fecha_vencimiento | certificado_medico_fecha_vencimiento
 */
var jobNotificacionesLicenciaYCertificadoMedico = /*#__PURE__*/function () {
  var _ref107 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee75() {
    var _yield$Promise$all, _yield$Promise$all2, licSnap, certSnap, enviados, procesarCampo, _iterator15, _step15, doc, _iterator16, _step16, _doc2;
    return _regeneratorRuntime().wrap(function _callee75$(_context78) {
      while (1) switch (_context78.prev = _context78.next) {
        case 0:
          _context78.prev = 0;
          _context78.next = 3;
          return Promise.all([db.collection("Usuarios").where("licencia_fecha_vencimiento", "!=", null).get(), db.collection("Usuarios").where("certificado_medico_fecha_vencimiento", "!=", null).get()]);
        case 3:
          _yield$Promise$all = _context78.sent;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          licSnap = _yield$Promise$all2[0];
          certSnap = _yield$Promise$all2[1];
          enviados = 0;
          procesarCampo = /*#__PURE__*/function () {
            var _ref108 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee74(doc, campoFecha, secretCode, esLicencia) {
              var data, fechaFin, estado, token, nombre, fechaTxt, title, body, diasTxt, _diasTxt, ok;
              return _regeneratorRuntime().wrap(function _callee74$(_context77) {
                while (1) switch (_context77.prev = _context77.next) {
                  case 0:
                    data = doc.data();
                    fechaFin = firestoreFechaToStartOfDayLocal(data[campoFecha]);
                    if (fechaFin) {
                      _context77.next = 4;
                      break;
                    }
                    return _context77.abrupt("return");
                  case 4:
                    estado = clasificarVencimientoDocumento(fechaFin);
                    if (estado) {
                      _context77.next = 7;
                      break;
                    }
                    return _context77.abrupt("return");
                  case 7:
                    token = vehiculoCoalesceEmpty(data.token);
                    if (token) {
                      _context77.next = 10;
                      break;
                    }
                    return _context77.abrupt("return");
                  case 10:
                    nombre = nombreUsuarioDesdeDocUsuario(_objectSpread({}, data)) || "amigo";
                    fechaTxt = formatoFechaDDMMAAAA(fechaFin);
                    if (esLicencia) {
                      if (estado.kind === "vencida") {
                        title = "".concat(nombre, ", tu licencia est\xE1 vencida");
                        body = "Hola ".concat(nombre, ", tu licencia de conducir ya venci\xF3 (fecha l\xEDmite ").concat(fechaTxt, "). Renov\xE1la cuanto antes para seguir manejando con respaldo legal y tranquilidad.");
                      } else {
                        diasTxt = estado.diasRestantes === 1 ? "Falta 1 día" : "Faltan ".concat(estado.diasRestantes, " d\xEDas");
                        title = "".concat(nombre, ", licencia por vencer");
                        body = "Hola ".concat(nombre, ", ").concat(diasTxt, " para que venza tu licencia (").concat(fechaTxt, "). Te conviene iniciar la renovaci\xF3n con tiempo.");
                      }
                    } else if (estado.kind === "vencida") {
                      title = "".concat(nombre, ", certificado m\xE9dico vencido");
                      body = "Hola ".concat(nombre, ", tu certificado m\xE9dico para conducir ya venci\xF3 (fecha l\xEDmite ").concat(fechaTxt, "). Renu\xE9valo para mantener tu documentaci\xF3n al d\xEDa.");
                    } else {
                      _diasTxt = estado.diasRestantes === 1 ? "Falta 1 día" : "Faltan ".concat(estado.diasRestantes, " d\xEDas");
                      title = "".concat(nombre, ", certificado m\xE9dico por vencer");
                      body = "Hola ".concat(nombre, ", ").concat(_diasTxt, " para el vencimiento de tu certificado m\xE9dico (").concat(fechaTxt, "). Agenda tu cita m\xE9dica con anticipaci\xF3n.");
                    }
                    _context77.next = 15;
                    return enviarPushDocumentacionConductorJob(token, title, body, secretCode);
                  case 15:
                    ok = _context77.sent;
                    if (ok) enviados += 1;
                  case 17:
                  case "end":
                    return _context77.stop();
                }
              }, _callee74);
            }));
            return function procesarCampo(_x149, _x150, _x151, _x152) {
              return _ref108.apply(this, arguments);
            };
          }();
          _iterator15 = _createForOfIteratorHelper(licSnap.docs);
          _context78.prev = 10;
          _iterator15.s();
        case 12:
          if ((_step15 = _iterator15.n()).done) {
            _context78.next = 18;
            break;
          }
          doc = _step15.value;
          _context78.next = 16;
          return procesarCampo(doc, "licencia_fecha_vencimiento", SECRET_CODE_LICENCIA_VENC, true);
        case 16:
          _context78.next = 12;
          break;
        case 18:
          _context78.next = 23;
          break;
        case 20:
          _context78.prev = 20;
          _context78.t0 = _context78["catch"](10);
          _iterator15.e(_context78.t0);
        case 23:
          _context78.prev = 23;
          _iterator15.f();
          return _context78.finish(23);
        case 26:
          _iterator16 = _createForOfIteratorHelper(certSnap.docs);
          _context78.prev = 27;
          _iterator16.s();
        case 29:
          if ((_step16 = _iterator16.n()).done) {
            _context78.next = 35;
            break;
          }
          _doc2 = _step16.value;
          _context78.next = 33;
          return procesarCampo(_doc2, "certificado_medico_fecha_vencimiento", SECRET_CODE_CERT_MEDICO_VENC, false);
        case 33:
          _context78.next = 29;
          break;
        case 35:
          _context78.next = 40;
          break;
        case 37:
          _context78.prev = 37;
          _context78.t1 = _context78["catch"](27);
          _iterator16.e(_context78.t1);
        case 40:
          _context78.prev = 40;
          _iterator16.f();
          return _context78.finish(40);
        case 43:
          if (enviados > 0) {
            console.log("Job licencia/certificado m\xE9dico: ".concat(enviados, " notificaci\xF3n(es) enviada(s)."));
          }
          _context78.next = 49;
          break;
        case 46:
          _context78.prev = 46;
          _context78.t2 = _context78["catch"](0);
          console.error("Error en job licencia/certificado médico:", _context78.t2);
        case 49:
        case "end":
          return _context78.stop();
      }
    }, _callee75, null, [[0, 46], [10, 20, 23, 26], [27, 37, 40, 43]]);
  }));
  return function jobNotificacionesLicenciaYCertificadoMedico() {
    return _ref107.apply(this, arguments);
  };
}();
var SECRET_CODE_RCV_VENC = "rcv_fecha_vencimiento";
var SECRET_CODE_TRIMESTRES_VENC = "trimestres_fecha_vencimiento";

/** Usuarios/{uid}/Vehiculos/{id} → uid */
var uidUsuarioDesdeRutaVehiculo = function uidUsuarioDesdeRutaVehiculo(docRef) {
  var parts = docRef.path.split("/");
  if (parts.length >= 4 && parts[0] === "Usuarios" && parts[2] === "Vehiculos") {
    return parts[1];
  }
  return null;
};
var obtenerUsuarioLiteParaJobVehiculo = /*#__PURE__*/function () {
  var _ref109 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee76(uid, cache) {
    var snap, vacio, d, lite;
    return _regeneratorRuntime().wrap(function _callee76$(_context79) {
      while (1) switch (_context79.prev = _context79.next) {
        case 0:
          if (!cache.has(uid)) {
            _context79.next = 2;
            break;
          }
          return _context79.abrupt("return", cache.get(uid));
        case 2:
          _context79.next = 4;
          return db.collection("Usuarios").doc(uid).get();
        case 4:
          snap = _context79.sent;
          if (snap.exists) {
            _context79.next = 9;
            break;
          }
          vacio = {
            token: "",
            nombre: "amigo"
          };
          cache.set(uid, vacio);
          return _context79.abrupt("return", vacio);
        case 9:
          d = snap.data();
          lite = {
            token: vehiculoCoalesceEmpty(d.token),
            nombre: nombreUsuarioDesdeDocUsuario(d) || "amigo"
          };
          cache.set(uid, lite);
          return _context79.abrupt("return", lite);
        case 13:
        case "end":
          return _context79.stop();
      }
    }, _callee76);
  }));
  return function obtenerUsuarioLiteParaJobVehiculo(_x153, _x154) {
    return _ref109.apply(this, arguments);
  };
}();
var jobNotificacionesRcvYTrimestresVehiculos = /*#__PURE__*/function () {
  var _ref110 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee78() {
    var _yield$Promise$all3, _yield$Promise$all4, rcvSnap, trimSnap, userCache, enviados, procesarVehiculoCampo, _iterator17, _step17, doc, _iterator18, _step18, _doc3;
    return _regeneratorRuntime().wrap(function _callee78$(_context81) {
      while (1) switch (_context81.prev = _context81.next) {
        case 0:
          _context81.prev = 0;
          _context81.next = 3;
          return Promise.all([db.collectionGroup("Vehiculos").where("rcv_fecha_vencimiento", "!=", null).get(), db.collectionGroup("Vehiculos").where("trimestres_fecha_vencimiento", "!=", null).get()]);
        case 3:
          _yield$Promise$all3 = _context81.sent;
          _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 2);
          rcvSnap = _yield$Promise$all4[0];
          trimSnap = _yield$Promise$all4[1];
          userCache = new Map();
          enviados = 0;
          procesarVehiculoCampo = /*#__PURE__*/function () {
            var _ref111 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee77(doc, campoFecha, secretCode, esRcv) {
              var uid, data, fechaFin, estado, _yield$obtenerUsuario, token, nombre, veh, fechaTxt, title, body, diasTxt, ok;
              return _regeneratorRuntime().wrap(function _callee77$(_context80) {
                while (1) switch (_context80.prev = _context80.next) {
                  case 0:
                    uid = uidUsuarioDesdeRutaVehiculo(doc.ref);
                    if (uid) {
                      _context80.next = 3;
                      break;
                    }
                    return _context80.abrupt("return");
                  case 3:
                    data = doc.data();
                    fechaFin = firestoreFechaToStartOfDayLocal(data[campoFecha]);
                    if (fechaFin) {
                      _context80.next = 7;
                      break;
                    }
                    return _context80.abrupt("return");
                  case 7:
                    estado = clasificarVencimientoDocumentoProximoMes(fechaFin);
                    if (estado) {
                      _context80.next = 10;
                      break;
                    }
                    return _context80.abrupt("return");
                  case 10:
                    _context80.next = 12;
                    return obtenerUsuarioLiteParaJobVehiculo(uid, userCache);
                  case 12:
                    _yield$obtenerUsuario = _context80.sent;
                    token = _yield$obtenerUsuario.token;
                    nombre = _yield$obtenerUsuario.nombre;
                    if (token) {
                      _context80.next = 17;
                      break;
                    }
                    return _context80.abrupt("return");
                  case 17:
                    veh = describeVehiculoParaNotificacion(data);
                    fechaTxt = formatoFechaDDMMAAAA(fechaFin);
                    if (esRcv) {
                      if (estado.kind === "vencida") {
                        title = "Alerta: RCV Vencido";
                        body = "La p\xF3liza de tu ".concat(veh, " expir\xF3 el ").concat(fechaTxt, ". Evita inconvenientes y ponte al d\xEDa pronto.");
                      } else {
                        diasTxt = estado.diasRestantes === 1 ? "Falta 1 día" : "Faltan ".concat(estado.diasRestantes, " d\xEDas");
                        title = "¡Tu RCV vence pronto!";
                        body = "".concat(diasTxt, " para el vencimiento. Recuerda renovarlo con tiempo para circular tranquilo.");
                      }
                    } else if (estado.kind === "vencida") {
                      title = "Trimestre Vencido";
                      body = "El plazo de pago expir\xF3 el ".concat(fechaTxt, ". Te recomendamos regularizarlo para evitar recargos.");
                    } else {
                      title = "¡Día de Trimestres!";
                      body = "El impuesto de tu ".concat(veh, " vence pronto. Recuerda realizar tu pago municipal a tiempo.");
                    }
                    _context80.next = 22;
                    return enviarPushDocumentacionConductorJob(token, title, body, secretCode);
                  case 22:
                    ok = _context80.sent;
                    if (ok) enviados += 1;
                  case 24:
                  case "end":
                    return _context80.stop();
                }
              }, _callee77);
            }));
            return function procesarVehiculoCampo(_x155, _x156, _x157, _x158) {
              return _ref111.apply(this, arguments);
            };
          }();
          _iterator17 = _createForOfIteratorHelper(rcvSnap.docs);
          _context81.prev = 11;
          _iterator17.s();
        case 13:
          if ((_step17 = _iterator17.n()).done) {
            _context81.next = 19;
            break;
          }
          doc = _step17.value;
          _context81.next = 17;
          return procesarVehiculoCampo(doc, "rcv_fecha_vencimiento", SECRET_CODE_RCV_VENC, true);
        case 17:
          _context81.next = 13;
          break;
        case 19:
          _context81.next = 24;
          break;
        case 21:
          _context81.prev = 21;
          _context81.t0 = _context81["catch"](11);
          _iterator17.e(_context81.t0);
        case 24:
          _context81.prev = 24;
          _iterator17.f();
          return _context81.finish(24);
        case 27:
          _iterator18 = _createForOfIteratorHelper(trimSnap.docs);
          _context81.prev = 28;
          _iterator18.s();
        case 30:
          if ((_step18 = _iterator18.n()).done) {
            _context81.next = 36;
            break;
          }
          _doc3 = _step18.value;
          _context81.next = 34;
          return procesarVehiculoCampo(_doc3, "trimestres_fecha_vencimiento", SECRET_CODE_TRIMESTRES_VENC, false);
        case 34:
          _context81.next = 30;
          break;
        case 36:
          _context81.next = 41;
          break;
        case 38:
          _context81.prev = 38;
          _context81.t1 = _context81["catch"](28);
          _iterator18.e(_context81.t1);
        case 41:
          _context81.prev = 41;
          _iterator18.f();
          return _context81.finish(41);
        case 44:
          if (enviados > 0) {
            console.log("Job RCV/trimestres (Vehiculos): ".concat(enviados, " notificaci\xF3n(es) enviada(s)."));
          }
          _context81.next = 50;
          break;
        case 47:
          _context81.prev = 47;
          _context81.t2 = _context81["catch"](0);
          console.error("Error en job RCV/trimestres vehículos:", _context81.t2);
        case 50:
        case "end":
          return _context81.stop();
      }
    }, _callee78, null, [[0, 47], [11, 21, 24, 27], [28, 38, 41, 44]]);
  }));
  return function jobNotificacionesRcvYTrimestresVehiculos() {
    return _ref110.apply(this, arguments);
  };
}();
var SECRET_CODE_ACTUALIZAR_KM_VEHICULOS = "ActualizarKmVehiculos";

/**
 * Pone showModalKm = true en todos los documentos de Usuarios y envía push a quienes tengan token.
 * Pensado para ejecutarse ~cada 7 días vía cron (p. ej. semanal).
 */
/**
 * cargarKmVehiculos
 *
 * Se ejecuta semanalmente los lunes a las 10:00 AM (cron: '0 10 * * 1').
 *
 * Envía una notificación push a los usuarios que cumplan TODAS estas condiciones:
 *   1. Su campo `status` en la colección "Usuarios" sea "Aprobado".
 *   2. Tengan al menos un documento en su subcolección "Vehiculos".
 *   3. Tengan un token FCM válido registrado.
 *
 * Además de la notificación, marca `showModalKm: true` en el documento del usuario
 * para que la app muestre el modal de actualización de kilometraje al abrir la sesión.
 *
 * Si el token devuelve `registration-token-not-registered` (app desinstalada o token
 * expirado), lo limpia automáticamente en Firestore (`token: ""`).
 */
var cargarKmVehiculos = /*#__PURE__*/function () {
  var _ref112 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee80() {
    var snapshot, vehiculoChecks, aprobadosConVehiculo, BATCH, i, chunk, batch, _iterator19, _step19, doc, seenTokens, sinToken, pendientes, _iterator20, _step20, _doc4, data, token, vehDesc, pushes, invalidTokens, _i5, _chunk, batchResult, j, resp, _resp$error, code, _resp$error2;
    return _regeneratorRuntime().wrap(function _callee80$(_context83) {
      while (1) switch (_context83.prev = _context83.next) {
        case 0:
          _context83.prev = 0;
          _context83.next = 3;
          return db.collection("Usuarios").where("status", "==", "Aprobado").get();
        case 3:
          snapshot = _context83.sent;
          if (!snapshot.empty) {
            _context83.next = 7;
            break;
          }
          console.log("cargarKmVehiculos: no hay usuarios aprobados.");
          return _context83.abrupt("return");
        case 7:
          _context83.next = 9;
          return Promise.all(snapshot.docs.map(/*#__PURE__*/function () {
            var _ref113 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee79(doc) {
              var vehSnap;
              return _regeneratorRuntime().wrap(function _callee79$(_context82) {
                while (1) switch (_context82.prev = _context82.next) {
                  case 0:
                    _context82.next = 2;
                    return doc.ref.collection("Vehiculos").limit(1).get();
                  case 2:
                    vehSnap = _context82.sent;
                    return _context82.abrupt("return", vehSnap.empty ? null : doc);
                  case 4:
                  case "end":
                    return _context82.stop();
                }
              }, _callee79);
            }));
            return function (_x159) {
              return _ref113.apply(this, arguments);
            };
          }()));
        case 9:
          vehiculoChecks = _context83.sent;
          aprobadosConVehiculo = vehiculoChecks.filter(Boolean);
          if (!(aprobadosConVehiculo.length === 0)) {
            _context83.next = 14;
            break;
          }
          console.log("cargarKmVehiculos: ningún usuario aprobado tiene vehículos.");
          return _context83.abrupt("return");
        case 14:
          BATCH = 500; // 1. Marcar showModalKm=true en batches de Firestore
          i = 0;
        case 16:
          if (!(i < aprobadosConVehiculo.length)) {
            _context83.next = 26;
            break;
          }
          chunk = aprobadosConVehiculo.slice(i, i + BATCH);
          batch = db.batch();
          _iterator19 = _createForOfIteratorHelper(chunk);
          try {
            for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
              doc = _step19.value;
              batch.update(doc.ref, {
                showModalKm: true
              });
            }
          } catch (err) {
            _iterator19.e(err);
          } finally {
            _iterator19.f();
          }
          _context83.next = 23;
          return batch.commit();
        case 23:
          i += BATCH;
          _context83.next = 16;
          break;
        case 26:
          // 2. Construir mensajes deduplicando por token
          seenTokens = new Set();
          sinToken = 0; // messages guarda { message, doc } para poder limpiar tokens inválidos después
          pendientes = [];
          _iterator20 = _createForOfIteratorHelper(aprobadosConVehiculo);
          _context83.prev = 30;
          _iterator20.s();
        case 32:
          if ((_step20 = _iterator20.n()).done) {
            _context83.next = 46;
            break;
          }
          _doc4 = _step20.value;
          data = _doc4.data();
          token = vehiculoCoalesceEmpty(data.token);
          if (token) {
            _context83.next = 39;
            break;
          }
          sinToken++;
          return _context83.abrupt("continue", 44);
        case 39:
          if (!seenTokens.has(token)) {
            _context83.next = 41;
            break;
          }
          return _context83.abrupt("continue", 44);
        case 41:
          seenTokens.add(token);
          vehDesc = describeVehiculoParaNotificacion(data);
          pendientes.push({
            doc: _doc4,
            message: {
              notification: {
                title: "Sincroniza tu odómetro",
                body: "Actualiza el kilometraje de tu ".concat(vehDesc, " para que tus recordatorios de mantenimiento sigan siendo exactos.")
              },
              data: {
                secretCode: String(SECRET_CODE_ACTUALIZAR_KM_VEHICULOS)
              },
              token: token
            }
          });
        case 44:
          _context83.next = 32;
          break;
        case 46:
          _context83.next = 51;
          break;
        case 48:
          _context83.prev = 48;
          _context83.t0 = _context83["catch"](30);
          _iterator20.e(_context83.t0);
        case 51:
          _context83.prev = 51;
          _iterator20.f();
          return _context83.finish(51);
        case 54:
          // 3. Enviar en lotes de 500 usando sendEach (un solo request HTTP por lote)
          pushes = 0;
          invalidTokens = 0;
          _i5 = 0;
        case 57:
          if (!(_i5 < pendientes.length)) {
            _context83.next = 83;
            break;
          }
          _chunk = pendientes.slice(_i5, _i5 + BATCH);
          _context83.next = 61;
          return admin.messaging().sendEach(_chunk.map(function (p) {
            return p.message;
          }));
        case 61:
          batchResult = _context83.sent;
          j = 0;
        case 63:
          if (!(j < batchResult.responses.length)) {
            _context83.next = 80;
            break;
          }
          resp = batchResult.responses[j];
          if (!resp.success) {
            _context83.next = 69;
            break;
          }
          pushes++;
          _context83.next = 77;
          break;
        case 69:
          code = (_resp$error = resp.error) === null || _resp$error === void 0 || (_resp$error = _resp$error.errorInfo) === null || _resp$error === void 0 ? void 0 : _resp$error.code;
          if (!(code === "messaging/registration-token-not-registered")) {
            _context83.next = 76;
            break;
          }
          // Token expirado/desinstalación — limpiar en Firestore
          invalidTokens++;
          _context83.next = 74;
          return _chunk[j].doc.ref.update({
            token: ""
          });
        case 74:
          _context83.next = 77;
          break;
        case 76:
          console.error("cargarKmVehiculos push [".concat(_chunk[j].doc.id, "]:"), (_resp$error2 = resp.error) === null || _resp$error2 === void 0 ? void 0 : _resp$error2.message);
        case 77:
          j++;
          _context83.next = 63;
          break;
        case 80:
          _i5 += BATCH;
          _context83.next = 57;
          break;
        case 83:
          console.log("cargarKmVehiculos: ".concat(aprobadosConVehiculo.length, " usuario(s) aprobado(s) con veh\xEDculo(s); ") + "".concat(pushes, " push(es) enviados; ").concat(sinToken, " sin token; ").concat(invalidTokens, " token(s) inv\xE1lido(s) limpiados."));
          _context83.next = 89;
          break;
        case 86:
          _context83.prev = 86;
          _context83.t1 = _context83["catch"](0);
          console.error("Error en cargarKmVehiculos:", _context83.t1);
        case 89:
        case "end":
          return _context83.stop();
      }
    }, _callee80, null, [[0, 86], [30, 48, 51, 54]]);
  }));
  return function cargarKmVehiculos() {
    return _ref112.apply(this, arguments);
  };
}();
module.exports = {
  getUsuarios: getUsuarios,
  getNotificaciones: getNotificaciones,
  saveUpdateNotificationUser: saveUpdateNotificationUser,
  updateNotificationUser: updateNotificationUser,
  getVehiculosByUsuarioUid: getVehiculosByUsuarioUid,
  getTiposVehiculo: getTiposVehiculo,
  saveOrUpdateVehiculo: saveOrUpdateVehiculo,
  SaveClient: SaveClient,
  SaveTaller: SaveTaller,
  authenticateUser: authenticateUser,
  getUserByUid: getUserByUid,
  SaveTallerAll: SaveTallerAll,
  UpdateTallerUsuarioDocs: UpdateTallerUsuarioDocs,
  SaveTallerExtended: SaveTallerExtended,
  restorePass: restorePass,
  getTalleres: getTalleres,
  actualizarStatusUsuario: actualizarStatusUsuario,
  UpdateClient: UpdateClient,
  UpdateTaller: UpdateTaller,
  getServicesByTalleruid: getServicesByTalleruid,
  getServiceByUid: getServiceByUid,
  getActiveCategories: getActiveCategories,
  getSubcategoriesByCategoryUid: getSubcategoriesByCategoryUid,
  saveOrUpdateService: saveOrUpdateService,
  getPlanes: getPlanes,
  getMetodosPago: getMetodosPago,
  ReportarPagoData: ReportarPagoData,
  saveSolicitud: saveSolicitud,
  getSolicitudesByUsuario: getSolicitudesByUsuario,
  getSolicitudesByUsuarioAndStatus: getSolicitudesByUsuarioAndStatus,
  getSolicitudByServicioUid: getSolicitudByServicioUid,
  getPropuestasBySolicitud: getPropuestasBySolicitud,
  savePropuesta: savePropuesta,
  updateSolicitudStatus: updateSolicitudStatus,
  updatePropuesta: updatePropuesta,
  getPropuestasByStatus: getPropuestasByStatus,
  getPlanesActivos: getPlanesActivos,
  sendNotification: sendNotification,
  UpdateUsuariosAll: UpdateUsuariosAll,
  updateUsuarioDocumentacionConductor: updateUsuarioDocumentacionConductor,
  deleteUserFromAuth: deleteUserFromAuth,
  getPlanesActivos3Days: getPlanesActivos3Days,
  getUsuariosConNotificacionesVehiculos: getUsuariosConNotificacionesVehiculos,
  jobNotificacionesLicenciaYCertificadoMedico: jobNotificacionesLicenciaYCertificadoMedico,
  jobNotificacionesRcvYTrimestresVehiculos: jobNotificacionesRcvYTrimestresVehiculos,
  jobNotificacionesVehiculosProximoKm: jobNotificacionesVehiculosProximoKm,
  AsociarPlan: AsociarPlan,
  updateScheduleDate: updateScheduleDate,
  getPlanesVencidos: getPlanesVencidos,
  deleteVehiculo: deleteVehiculo,
  updateVehiculoKm: updateVehiculoKm,
  cargarKmVehiculos: cargarKmVehiculos,
  jobRechazarPropuestasFechaPropuestaMayor3Dias: jobRechazarPropuestasFechaPropuestaMayor3Dias,
  getServicesByTallerUidTrue: getServicesByTallerUidTrue
};