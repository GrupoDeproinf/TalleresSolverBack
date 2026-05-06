"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var admin = require("firebase-admin");
var _require = require("../firebase"),
  db = _require.db;
var _require2 = require("firebase/auth"),
  getAuth = _require2.getAuth,
  signInWithEmailAndPassword = _require2.signInWithEmailAndPassword;
var _require3 = require("firebase-admin/firestore"),
  getFirestore = _require3.getFirestore;
var _require4 = require("../../firebaseConfig"),
  app = _require4.app; // Asegúrate de la ruta correcta

var getServicios = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var serviciosSnapshot, serviciosConTalleres, _iterator, _step, servicioDoc, servicioData, uidTaller, tallerSnapshot, tallerData;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return db.collection("Servicios").where("estatus", "==", true).get();
        case 3:
          serviciosSnapshot = _context.sent;
          // Crear un array para almacenar los servicios con sus talleres asociados
          serviciosConTalleres = []; // Iterar sobre los servicios y buscar los talleres relacionados
          _iterator = _createForOfIteratorHelper(serviciosSnapshot.docs);
          _context.prev = 6;
          _iterator.s();
        case 8:
          if ((_step = _iterator.n()).done) {
            _context.next = 23;
            break;
          }
          servicioDoc = _step.value;
          servicioData = servicioDoc.data(); // Agregar el uid del servicio al objeto de datos
          servicioData.uid_servicio = servicioDoc.id;

          // serviciosConTalleres contendrá los objetos con el `uid_servicio` incluido

          // Obtener el UID del taller del servicio
          uidTaller = servicioData.uid_taller; // Validar que uid_taller exista y sea una cadena válida
          if (!(uidTaller && typeof uidTaller === "string" && uidTaller.trim() !== "")) {
            _context.next = 20;
            break;
          }
          _context.next = 16;
          return db.collection("Usuarios").doc(uidTaller).get();
        case 16:
          tallerSnapshot = _context.sent;
          // Solo agregar el servicio si el taller existe y está aprobado
          if (tallerSnapshot.exists) {
            tallerData = tallerSnapshot.data(); // Verificar que el taller esté aprobado
            if (tallerData.status === "Aprobado") {
              // Agregar el servicio junto con el taller a la lista
              serviciosConTalleres.push(_objectSpread(_objectSpread({}, servicioData), {}, {
                taller: tallerData
              }));
            } else {
              console.warn("Taller ".concat(uidTaller, " no est\xE1 aprobado para el servicio ").concat(servicioDoc.id, ". Servicio excluido."));
            }
          } else {
            console.warn("Taller no encontrado para el servicio ".concat(servicioDoc.id, ". Servicio excluido."));
          }
          _context.next = 21;
          break;
        case 20:
          console.warn("UID de taller no v\xE1lido para el servicio ".concat(servicioDoc.id));
        case 21:
          _context.next = 8;
          break;
        case 23:
          _context.next = 28;
          break;
        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](6);
          _iterator.e(_context.t0);
        case 28:
          _context.prev = 28;
          _iterator.f();
          return _context.finish(28);
        case 31:
          console.log("Servicios con Talleres:", serviciosConTalleres);
          res.send(serviciosConTalleres);
          _context.next = 39;
          break;
        case 35:
          _context.prev = 35;
          _context.t1 = _context["catch"](0);
          console.error("Error obteniendo servicios y talleres:", _context.t1);
          res.status(500).send("Error obteniendo servicios y talleres.");
        case 39:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 35], [6, 25, 28, 31]]);
  }));
  return function getServicios(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var getDistanceKm = function getDistanceKm(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/** Obtiene lat y lng desde taller.ubicacion (soporta .lat/.lng o .latitude/.longitude como en GeoPoint) */
var getLatLngFromUbicacion = function getLatLngFromUbicacion(ubicacion) {
  var _ubicacion$lat, _ubicacion$lng;
  if (!ubicacion || _typeof(ubicacion) !== "object") return {
    lat: NaN,
    lng: NaN
  };
  var lat = (_ubicacion$lat = ubicacion.lat) !== null && _ubicacion$lat !== void 0 ? _ubicacion$lat : ubicacion.latitude;
  var lng = (_ubicacion$lng = ubicacion.lng) !== null && _ubicacion$lng !== void 0 ? _ubicacion$lng : ubicacion.longitude;
  return {
    lat: lat != null ? Number(lat) : NaN,
    lng: lng != null ? Number(lng) : NaN
  };
};
var calculateAverageScore = function calculateAverageScore(comments) {
  if (!Array.isArray(comments) || comments.length === 0) return 0;
  var totalScore = comments.reduce(function (sum, comment) {
    return sum + ((comment === null || comment === void 0 ? void 0 : comment.puntuacion) || 0);
  }, 0);
  var averageScore = totalScore / comments.length;
  return Math.min(Math.max(Math.ceil(averageScore), 0), 5);
};
var fetchCalificacionesServicio = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(uidService) {
    var snap;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return db.collection("Servicios").doc(uidService).collection("calificaciones").get();
        case 2:
          snap = _context2.sent;
          if (!snap.empty) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return", []);
        case 5:
          return _context2.abrupt("return", snap.docs.map(function (d) {
            return _objectSpread({
              id: d.id
            }, d.data());
          }));
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function fetchCalificacionesServicio(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
var enriquecerServiciosConPuntuacion = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(items) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!Array.isArray(items) || items.length === 0)) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return", []);
        case 2:
          return _context4.abrupt("return", Promise.all(items.map(/*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(item) {
              var comments, puntuacion;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return fetchCalificacionesServicio(item.id);
                  case 2:
                    comments = _context3.sent;
                    puntuacion = calculateAverageScore(comments);
                    return _context3.abrupt("return", _objectSpread(_objectSpread({}, item), {}, {
                      puntuacion: puntuacion
                    }));
                  case 5:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function (_x5) {
              return _ref4.apply(this, arguments);
            };
          }())));
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function enriquecerServiciosConPuntuacion(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
var getServiciosPaginados = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _ref6, _ref6$pageIndex, pageIndex, _ref6$pageSize, pageSize, _ref6$filter, filterNombre, uid_categoria, id, latitude, longitude, page, size, filterStr, userLat, userLng, sortByDistance, query, serviciosSnapshot, uidTalleresUnicos, serviciosPorTaller, _iterator2, _step2, servicioDoc, _data, uidTaller, IN_LIMIT, uids, talleresMap, i, chunk, talleresRef, snapshot, serviciosConTalleres, _iterator3, _step3, _loop, _ret, listado, totalCount, from, paginated, data;
    return _regeneratorRuntime().wrap(function _callee5$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _ref6 = req.body || {}, _ref6$pageIndex = _ref6.pageIndex, pageIndex = _ref6$pageIndex === void 0 ? 1 : _ref6$pageIndex, _ref6$pageSize = _ref6.pageSize, pageSize = _ref6$pageSize === void 0 ? 10 : _ref6$pageSize, _ref6$filter = _ref6.filter, filterNombre = _ref6$filter === void 0 ? "" : _ref6$filter, uid_categoria = _ref6.uid_categoria, id = _ref6.id, latitude = _ref6.latitude, longitude = _ref6.longitude;
          page = Math.max(1, parseInt(pageIndex, 10) || 1);
          size = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 10));
          filterStr = typeof filterNombre === "string" ? filterNombre.trim().toLowerCase() : "";
          userLat = latitude != null ? Number(latitude) : NaN;
          userLng = longitude != null ? Number(longitude) : NaN;
          sortByDistance = !Number.isNaN(userLat) && !Number.isNaN(userLng);
          query = db.collection("Servicios").where("estatus", "==", true);
          if (uid_categoria && typeof uid_categoria === "string" && uid_categoria.trim() !== "") {
            query = query.where("uid_categoria", "==", uid_categoria);
          }
          _context6.next = 12;
          return query.get();
        case 12:
          serviciosSnapshot = _context6.sent;
          // Extraer uid_taller únicos para batch get (evita N+1)
          uidTalleresUnicos = new Set();
          serviciosPorTaller = new Map();
          _iterator2 = _createForOfIteratorHelper(serviciosSnapshot.docs);
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              servicioDoc = _step2.value;
              _data = servicioDoc.data();
              uidTaller = _data.uid_taller;
              if (uidTaller && typeof uidTaller === "string" && uidTaller.trim() !== "") {
                uidTalleresUnicos.add(uidTaller);
                if (!serviciosPorTaller.has(uidTaller)) {
                  serviciosPorTaller.set(uidTaller, []);
                }
                serviciosPorTaller.get(uidTaller).push({
                  doc: servicioDoc,
                  data: _data
                });
              } else {
                console.warn("UID de taller no v\xE1lido para el servicio ".concat(servicioDoc.id));
              }
            }

            // Batch get de Usuarios (máx 30 por query en Firestore)
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          IN_LIMIT = 30;
          uids = Array.from(uidTalleresUnicos);
          talleresMap = new Map();
          i = 0;
        case 21:
          if (!(i < uids.length)) {
            _context6.next = 31;
            break;
          }
          chunk = uids.slice(i, i + IN_LIMIT);
          talleresRef = db.collection("Usuarios");
          _context6.next = 26;
          return talleresRef.where(admin.firestore.FieldPath.documentId(), "in", chunk).where("subscripcion_actual.status", "==", "Aprobado").get();
        case 26:
          snapshot = _context6.sent;
          snapshot.docs.forEach(function (d) {
            return talleresMap.set(d.id, d.data());
          });
        case 28:
          i += IN_LIMIT;
          _context6.next = 21;
          break;
        case 31:
          // Construir lista solo con talleres aprobados
          serviciosConTalleres = [];
          _iterator3 = _createForOfIteratorHelper(serviciosPorTaller);
          _context6.prev = 33;
          _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
            var _step3$value, uidTaller, talleres, tallerData, _iterator4, _step4, _step4$value, _servicioDoc, servicioData, item, _getLatLngFromUbicaci, tLat, tLng;
            return _regeneratorRuntime().wrap(function _loop$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  _step3$value = _slicedToArray(_step3.value, 2), uidTaller = _step3$value[0], talleres = _step3$value[1];
                  tallerData = talleresMap.get(uidTaller);
                  if (tallerData) {
                    _context5.next = 5;
                    break;
                  }
                  talleres.forEach(function (_ref7) {
                    var doc = _ref7.doc;
                    return console.warn("Taller no encontrado para el servicio ".concat(doc.id, ". Servicio excluido."));
                  });
                  return _context5.abrupt("return", 0);
                case 5:
                  if (!(tallerData.status !== "Aprobado")) {
                    _context5.next = 8;
                    break;
                  }
                  talleres.forEach(function (_ref8) {
                    var doc = _ref8.doc;
                    return console.warn("Taller ".concat(uidTaller, " no est\xE1 aprobado para el servicio ").concat(doc.id, ". Servicio excluido."));
                  });
                  return _context5.abrupt("return", 0);
                case 8:
                  _iterator4 = _createForOfIteratorHelper(talleres);
                  try {
                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                      _step4$value = _step4.value, _servicioDoc = _step4$value.doc, servicioData = _step4$value.data;
                      servicioData.uid_servicio = _servicioDoc.id;
                      item = _objectSpread(_objectSpread({
                        id: _servicioDoc.id
                      }, servicioData), {}, {
                        taller: tallerData
                      });
                      if (sortByDistance) {
                        _getLatLngFromUbicaci = getLatLngFromUbicacion(tallerData === null || tallerData === void 0 ? void 0 : tallerData.ubicacion), tLat = _getLatLngFromUbicaci.lat, tLng = _getLatLngFromUbicaci.lng;
                        if (!Number.isNaN(tLat) && !Number.isNaN(tLng)) {
                          item._distanceKm = getDistanceKm(userLat, userLng, tLat, tLng);
                        } else {
                          item._distanceKm = Infinity;
                        }
                      }
                      serviciosConTalleres.push(item);
                    }
                  } catch (err) {
                    _iterator4.e(err);
                  } finally {
                    _iterator4.f();
                  }
                case 10:
                case "end":
                  return _context5.stop();
              }
            }, _loop);
          });
          _iterator3.s();
        case 36:
          if ((_step3 = _iterator3.n()).done) {
            _context6.next = 43;
            break;
          }
          return _context6.delegateYield(_loop(), "t0", 38);
        case 38:
          _ret = _context6.t0;
          if (!(_ret === 0)) {
            _context6.next = 41;
            break;
          }
          return _context6.abrupt("continue", 41);
        case 41:
          _context6.next = 36;
          break;
        case 43:
          _context6.next = 48;
          break;
        case 45:
          _context6.prev = 45;
          _context6.t1 = _context6["catch"](33);
          _iterator3.e(_context6.t1);
        case 48:
          _context6.prev = 48;
          _iterator3.f();
          return _context6.finish(48);
        case 51:
          // 1) Ordenar TODA la data por distancia: más cercano primero; sin ubicación al final
          if (sortByDistance && serviciosConTalleres.length > 0) {
            serviciosConTalleres.sort(function (a, b) {
              var _a$_distanceKm, _b$_distanceKm;
              var distA = (_a$_distanceKm = a._distanceKm) !== null && _a$_distanceKm !== void 0 ? _a$_distanceKm : Infinity;
              var distB = (_b$_distanceKm = b._distanceKm) !== null && _b$_distanceKm !== void 0 ? _b$_distanceKm : Infinity;
              return distA - distB;
            });
          }

          // 2) Filtro por nombre_servicio (like) sobre la lista ya ordenada
          listado = serviciosConTalleres;
          if (filterStr.length > 0) {
            listado = listado.filter(function (s) {
              var nombre = s.nombre_servicio && String(s.nombre_servicio).toLowerCase() || "";
              return nombre.includes(filterStr);
            });
          }
          totalCount = listado.length;
          from = (page - 1) * size;
          paginated = listado.slice(from, from + size);
          _context6.next = 59;
          return enriquecerServiciosConPuntuacion(paginated);
        case 59:
          data = _context6.sent;
          res.status(200).json({
            data: data,
            totalCount: totalCount,
            pageIndex: page,
            pageSize: size
          });
          _context6.next = 67;
          break;
        case 63:
          _context6.prev = 63;
          _context6.t2 = _context6["catch"](0);
          console.error("Error obteniendo servicios paginados:", _context6.t2);
          res.status(500).send("Error obteniendo servicios paginados.");
        case 67:
        case "end":
          return _context6.stop();
      }
    }, _callee5, null, [[0, 63], [33, 45, 48, 51]]);
  }));
  return function getServiciosPaginados(_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}();
var saveContactService = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var _ref10, id, nombre_servicio, precio, taller, uid_servicio, uid_taller, usuario_id, usuario_nombre, usuario_email, serviceData;
    return _regeneratorRuntime().wrap(function _callee6$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _ref10 = req.body || {}, id = _ref10.id, nombre_servicio = _ref10.nombre_servicio, precio = _ref10.precio, taller = _ref10.taller, uid_servicio = _ref10.uid_servicio, uid_taller = _ref10.uid_taller, usuario_id = _ref10.usuario_id, usuario_nombre = _ref10.usuario_nombre, usuario_email = _ref10.usuario_email;
          if (!(!id || !nombre_servicio || !precio || !taller || !uid_taller || !usuario_id)) {
            _context7.next = 4;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            error: "Faltan campos obligatorios en el body de la solicitud."
          }));
        case 4:
          serviceData = {
            id: id,
            nombre_servicio: nombre_servicio,
            precio: precio,
            taller: taller,
            uid_servicio: uid_servicio || null,
            uid_taller: uid_taller,
            usuario: {
              id: usuario_id,
              nombre: usuario_nombre,
              email: usuario_email
            },
            fecha_creacion: admin.firestore.FieldValue.serverTimestamp()
          };
          _context7.next = 7;
          return db.collection("servicesContact").add(serviceData);
        case 7:
          return _context7.abrupt("return", res.status(200).json({
            message: "Servicio guardado exitosamente.",
            serviceData: serviceData
          }));
        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error("Error al guardar el servicio:", _context7.t0);
          return _context7.abrupt("return", res.status(500).json({
            error: "Error interno del servidor."
          }));
        case 14:
        case "end":
          return _context7.stop();
      }
    }, _callee6, null, [[0, 10]]);
  }));
  return function saveContactService(_x8, _x9) {
    return _ref9.apply(this, arguments);
  };
}();
var getServicesContact = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var serviciosContactSnapshot, serviciosContact;
    return _regeneratorRuntime().wrap(function _callee8$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return db.collection("servicesContact").get();
        case 3:
          serviciosContactSnapshot = _context9.sent;
          _context9.next = 6;
          return Promise.all(serviciosContactSnapshot.docs.map(/*#__PURE__*/function () {
            var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(doc) {
              var servicioContactData, uid_servicio, servicioDoc, servicioData;
              return _regeneratorRuntime().wrap(function _callee7$(_context8) {
                while (1) switch (_context8.prev = _context8.next) {
                  case 0:
                    servicioContactData = doc.data();
                    uid_servicio = servicioContactData.uid_servicio; // Buscar el servicio correspondiente en la colección "services"
                    _context8.next = 4;
                    return db.collection("Servicios").doc(uid_servicio).get();
                  case 4:
                    servicioDoc = _context8.sent;
                    // Verificar si existe el servicio
                    servicioData = servicioDoc.exists ? servicioDoc.data() : null;
                    return _context8.abrupt("return", _objectSpread(_objectSpread({
                      id: doc.id
                    }, servicioContactData), {}, {
                      // Datos de "servicesContact"
                      servicio: servicioData // Datos del servicio asociado
                    }));
                  case 7:
                  case "end":
                    return _context8.stop();
                }
              }, _callee7);
            }));
            return function (_x12) {
              return _ref12.apply(this, arguments);
            };
          }()));
        case 6:
          serviciosContact = _context9.sent;
          console.log("Servicios con detalles:", serviciosContact);

          // Enviar los datos como respuesta
          res.status(200).json(serviciosContact);
          _context9.next = 15;
          break;
        case 11:
          _context9.prev = 11;
          _context9.t0 = _context9["catch"](0);
          console.error("Error obteniendo servicios y detalles:", _context9.t0);
          res.status(500).send("Error obteniendo servicios y detalles.");
        case 15:
        case "end":
          return _context9.stop();
      }
    }, _callee8, null, [[0, 11]]);
  }));
  return function getServicesContact(_x10, _x11) {
    return _ref11.apply(this, arguments);
  };
}();
var getServicesCategories = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var _req$body, uid_categoria, id, serviciosSnapshot, serviciosValidos, _iterator5, _step5, servicioDoc, servicioData, uidTaller, tallerSnapshot, tallerData, serviciosAleatorios;
    return _regeneratorRuntime().wrap(function _callee9$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          // Obtener la categoría enviada en el request
          _req$body = req.body, uid_categoria = _req$body.uid_categoria, id = _req$body.id; // O req.body dependiendo del método HTTP
          if (uid_categoria) {
            _context10.next = 4;
            break;
          }
          return _context10.abrupt("return", res.status(400).send("Por favor, proporciona una categoría."));
        case 4:
          _context10.next = 6;
          return db.collection("Servicios").where("uid_categoria", "==", uid_categoria).where("uid_servicio", "!=", id == undefined ? '' : id).where("estatus", "==", true) // Solo servicios habilitados
          .get();
        case 6:
          serviciosSnapshot = _context10.sent;
          // Crear un array para almacenar los servicios válidos con talleres aprobados
          serviciosValidos = []; // Iterar sobre los servicios y validar los talleres asociados
          _iterator5 = _createForOfIteratorHelper(serviciosSnapshot.docs);
          _context10.prev = 9;
          _iterator5.s();
        case 11:
          if ((_step5 = _iterator5.n()).done) {
            _context10.next = 26;
            break;
          }
          servicioDoc = _step5.value;
          servicioData = servicioDoc.data(); // Agregar el uid del servicio al objeto de datos
          servicioData.uid_servicio = servicioDoc.id;

          // Obtener el UID del taller del servicio
          uidTaller = servicioData.uid_taller; // Validar que uid_taller exista y sea una cadena válida
          if (!(uidTaller && typeof uidTaller === "string" && uidTaller.trim() !== "")) {
            _context10.next = 23;
            break;
          }
          _context10.next = 19;
          return db.collection("Usuarios").doc(uidTaller).get();
        case 19:
          tallerSnapshot = _context10.sent;
          // Solo agregar el servicio si el taller existe y está aprobado
          if (tallerSnapshot.exists) {
            tallerData = tallerSnapshot.data(); // Verificar que el taller esté aprobado
            if (tallerData.status === "Aprobado") {
              // Agregar el servicio a la lista de servicios válidos
              serviciosValidos.push(_objectSpread({
                id: servicioDoc.id
              }, servicioData));
            } else {
              console.warn("Taller ".concat(uidTaller, " no est\xE1 aprobado para el servicio ").concat(servicioDoc.id, ". Servicio excluido."));
            }
          } else {
            console.warn("Taller no encontrado para el servicio ".concat(servicioDoc.id, ". Servicio excluido."));
          }
          _context10.next = 24;
          break;
        case 23:
          console.warn("UID de taller no v\xE1lido para el servicio ".concat(servicioDoc.id));
        case 24:
          _context10.next = 11;
          break;
        case 26:
          _context10.next = 31;
          break;
        case 28:
          _context10.prev = 28;
          _context10.t0 = _context10["catch"](9);
          _iterator5.e(_context10.t0);
        case 31:
          _context10.prev = 31;
          _iterator5.f();
          return _context10.finish(31);
        case 34:
          if (!(serviciosValidos.length === 0)) {
            _context10.next = 36;
            break;
          }
          return _context10.abrupt("return", res.status(200).json([]));
        case 36:
          // Obtener 3 servicios aleatorios de los servicios válidos
          serviciosAleatorios = serviciosValidos.sort(function () {
            return Math.random() - 0.5;
          }) // Ordenar aleatoriamente
          .slice(0, 3); // Tomar los primeros 3 elementos
          console.log("Servicios aleatorios con la categor\xEDa \"".concat(uid_categoria, "\":"), serviciosAleatorios);

          // Enviar los datos como respuesta
          res.status(200).json(serviciosAleatorios);
          _context10.next = 45;
          break;
        case 41:
          _context10.prev = 41;
          _context10.t1 = _context10["catch"](0);
          console.error("Error obteniendo servicios por categoría:", _context10.t1);
          res.status(500).send("Error obteniendo servicios por categoría.");
        case 45:
        case "end":
          return _context10.stop();
      }
    }, _callee9, null, [[0, 41], [9, 28, 31, 34]]);
  }));
  return function getServicesCategories(_x13, _x14) {
    return _ref13.apply(this, arguments);
  };
}();
var getSubscriptionsById = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var uid, subscripcionesSnapchot, subscripciones, subscripcionesAleatorios;
    return _regeneratorRuntime().wrap(function _callee10$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          // Obtener la categoría enviada en el request
          uid = req.body.uid; // O req.body dependiendo del método HTTP
          // Consultar los documentos que coincidan con la categoría
          _context11.next = 4;
          return db.collection("Subscripciones").where("taller_uid", "==", uid).get();
        case 4:
          subscripcionesSnapchot = _context11.sent;
          // Transformar el snapshot en un array de objetos con los datos de los documentos
          subscripciones = subscripcionesSnapchot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Si no hay subscripciones, devolver un arreglo vacío
          if (!(subscripciones.length === 0)) {
            _context11.next = 8;
            break;
          }
          return _context11.abrupt("return", res.status(200).json([]));
        case 8:
          // Obtener 3 subscripciones aleatorios
          subscripcionesAleatorios = subscripciones.sort(function () {
            return Math.random() - 0.5;
          }) // Ordenar aleatoriamente
          .slice(0, 3); // Tomar los primeros 3 elementos
          console.log("subscripciones aleatorios con el uid \"".concat(uid, "\":"), subscripcionesAleatorios);

          // Enviar los datos como respuesta
          res.status(200).json(subscripcionesAleatorios);
          _context11.next = 17;
          break;
        case 13:
          _context11.prev = 13;
          _context11.t0 = _context11["catch"](0);
          console.error("Error obteniendo subscripciones por id:", _context11.t0);
          res.status(500).send("Error obteniendo subscripciones por id.");
        case 17:
        case "end":
          return _context11.stop();
      }
    }, _callee10, null, [[0, 13]]);
  }));
  return function getSubscriptionsById(_x15, _x16) {
    return _ref14.apply(this, arguments);
  };
}();
var getProductsByCategory = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var uid_categoria, querySnapshot, products, tallerIds, talleresSnapshot, talleresMap, productsWithTaller;
    return _regeneratorRuntime().wrap(function _callee11$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          console.log("Cuerpo recibido:", req.body);
          uid_categoria = req.body.uid_categoria;
          if (!(!uid_categoria || typeof uid_categoria !== "string" || uid_categoria.trim() === "")) {
            _context12.next = 5;
            break;
          }
          return _context12.abrupt("return", res.status(200).json([]));
        case 5:
          _context12.next = 7;
          return db.collection("Servicios").where("uid_categoria", "==", uid_categoria.trim()).where("estatus", "==", true).get();
        case 7:
          querySnapshot = _context12.sent;
          if (!querySnapshot.empty) {
            _context12.next = 10;
            break;
          }
          return _context12.abrupt("return", res.status(200).json([]));
        case 10:
          // 2️⃣ Obtener productos y recopilar IDs de taller
          products = querySnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          });
          tallerIds = _toConsumableArray(new Set(products.map(function (p) {
            return p.uid_taller;
          }))); // evita duplicados
          // 3️⃣ Traer solo talleres aprobados que estén en esos IDs
          _context12.next = 14;
          return db.collection("Usuarios").where("status", "==", "Aprobado").where("typeUser", "==", "Taller").where("uid", "in", tallerIds).get();
        case 14:
          talleresSnapshot = _context12.sent;
          talleresMap = {};
          talleresSnapshot.forEach(function (doc) {
            talleresMap[doc.data().uid] = _objectSpread({
              id: doc.id
            }, doc.data());
          });

          // 4️⃣ Combinar producto con taller y filtrar solo productos con talleres aprobados
          productsWithTaller = products.map(function (product) {
            return _objectSpread(_objectSpread({}, product), {}, {
              taller: talleresMap[product.uid_taller] || null
            });
          }).filter(function (product) {
            // Solo incluir productos que tengan un taller aprobado asociado
            if (product.taller === null) {
              console.warn("Producto ".concat(product.id, " excluido: taller ").concat(product.uid_taller, " no encontrado o no aprobado."));
              return false;
            }
            return true;
          });
          return _context12.abrupt("return", res.status(200).json(productsWithTaller));
        case 21:
          _context12.prev = 21;
          _context12.t0 = _context12["catch"](0);
          return _context12.abrupt("return", res.status(200).json([]));
        case 24:
        case "end":
          return _context12.stop();
      }
    }, _callee11, null, [[0, 21]]);
  }));
  return function getProductsByCategory(_x17, _x18) {
    return _ref15.apply(this, arguments);
  };
}();
var getCommentsByService = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var uid_service, serviceDoc, commentsSnapshot, comments;
    return _regeneratorRuntime().wrap(function _callee12$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          uid_service = req.body.uid_service; // Validar que uid_service esté definido y sea un string no vacío
          if (!(!uid_service || typeof uid_service !== "string" || uid_service.trim() === "")) {
            _context13.next = 4;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            error: "uid_service es requerido y debe ser un string no vacío."
          }));
        case 4:
          _context13.next = 6;
          return db.collection("Servicios").doc(uid_service).get();
        case 6:
          serviceDoc = _context13.sent;
          if (serviceDoc.exists) {
            _context13.next = 9;
            break;
          }
          return _context13.abrupt("return", res.status(404).json({
            error: "No se encontró un servicio con este ID."
          }));
        case 9:
          _context13.next = 11;
          return db.collection("Servicios").doc(uid_service).collection("calificaciones") // Nombre de la subcolección
          .get();
        case 11:
          commentsSnapshot = _context13.sent;
          if (!commentsSnapshot.empty) {
            _context13.next = 14;
            break;
          }
          return _context13.abrupt("return", res.status(200).json([]));
        case 14:
          comments = commentsSnapshot.docs.map(function (commentDoc) {
            return _objectSpread({
              id: commentDoc.id
            }, commentDoc.data());
          }); // Responder con los comentarios encontrados
          return _context13.abrupt("return", res.status(200).json(comments));
        case 18:
          _context13.prev = 18;
          _context13.t0 = _context13["catch"](0);
          console.error("Error al obtener comentarios:", _context13.t0);
          return _context13.abrupt("return", res.status(500).json({
            error: "Error al obtener comentarios"
          }));
        case 22:
        case "end":
          return _context13.stop();
      }
    }, _callee12, null, [[0, 18]]);
  }));
  return function getCommentsByService(_x19, _x20) {
    return _ref16.apply(this, arguments);
  };
}();
var addCommentToService = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var _req$body2, uid_service, comentario, puntuacion, nombre_taller, uid_taller, usuario, etiquetas_rapidas, etiquetasNormalizadas, serviceRef, serviceDoc, newComment;
    return _regeneratorRuntime().wrap(function _callee13$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _req$body2 = req.body, uid_service = _req$body2.uid_service, comentario = _req$body2.comentario, puntuacion = _req$body2.puntuacion, nombre_taller = _req$body2.nombre_taller, uid_taller = _req$body2.uid_taller, usuario = _req$body2.usuario, etiquetas_rapidas = _req$body2.etiquetas_rapidas; // Validar que el objeto `usuario` y el campo `userId` existan
          if (!(!usuario || !usuario.uid)) {
            _context14.next = 4;
            break;
          }
          return _context14.abrupt("return", res.status(400).json({
            error: 'El objeto "usuario" con el campo "userId" es obligatorio.'
          }));
        case 4:
          etiquetasNormalizadas = Array.isArray(etiquetas_rapidas) ? etiquetas_rapidas.filter(function (t) {
            return typeof t === "string" && t.trim() !== "";
          }).map(function (t) {
            return t.trim();
          }).slice(0, 20) : []; // Referencia al documento del servicio por su ID
          serviceRef = db.collection("Servicios").doc(uid_service);
          _context14.next = 8;
          return serviceRef.get();
        case 8:
          serviceDoc = _context14.sent;
          if (serviceDoc.exists) {
            _context14.next = 11;
            break;
          }
          return _context14.abrupt("return", res.status(404).json({
            error: "No se encontró un servicio con este ID de documento."
          }));
        case 11:
          // Crear un nuevo comentario en la subcolección "calificaciones"
          newComment = {
            comentario: comentario !== null && comentario !== void 0 ? comentario : "",
            puntuacion: puntuacion,
            nombre_taller: nombre_taller,
            uid_taller: uid_taller,
            usuario: usuario,
            // Incluye el objeto `usuario` tal cual
            etiquetas_rapidas: etiquetasNormalizadas,
            fecha_creacion: new Date() // Fecha de creación
          };
          _context14.next = 14;
          return serviceRef.collection("calificaciones").add(newComment);
        case 14:
          return _context14.abrupt("return", res.status(201).json({
            message: "Comentario agregado exitosamente.",
            comment: newComment
          }));
        case 17:
          _context14.prev = 17;
          _context14.t0 = _context14["catch"](0);
          console.error("Error al agregar comentario:", _context14.t0);
          return _context14.abrupt("return", res.status(500).json({
            error: "Error al agregar comentario."
          }));
        case 21:
        case "end":
          return _context14.stop();
      }
    }, _callee13, null, [[0, 17]]);
  }));
  return function addCommentToService(_x21, _x22) {
    return _ref17.apply(this, arguments);
  };
}();
var validatePhone = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var _req$body3, phone, uid, snapshot, phoneExists;
    return _regeneratorRuntime().wrap(function _callee14$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _req$body3 = req.body, phone = _req$body3.phone, uid = _req$body3.uid; // Verificar que se proporcionen los parámetros necesarios
          if (phone) {
            _context15.next = 4;
            break;
          }
          return _context15.abrupt("return", res.status(400).send({
            message: "El número de teléfono es obligatorio."
          }));
        case 4:
          _context15.next = 6;
          return db.collection("Usuarios").where("phone", "==", phone).get();
        case 6:
          snapshot = _context15.sent;
          if (snapshot.empty) {
            _context15.next = 11;
            break;
          }
          phoneExists = snapshot.docs.some(function (doc) {
            return doc.id !== uid;
          });
          if (!phoneExists) {
            _context15.next = 11;
            break;
          }
          return _context15.abrupt("return", res.status(409).send({
            message: "El número de teléfono ya está registrado.",
            valid: false
          }));
        case 11:
          return _context15.abrupt("return", res.status(200).send({
            message: "El número de teléfono es válido.",
            valid: true
          }));
        case 14:
          _context15.prev = 14;
          _context15.t0 = _context15["catch"](0);
          console.error("Error al validar el número de teléfono:", _context15.t0);
          res.status(500).send({
            message: "Error al validar el número de teléfono.",
            error: _context15.t0.message
          });
        case 18:
        case "end":
          return _context15.stop();
      }
    }, _callee14, null, [[0, 14]]);
  }));
  return function validatePhone(_x23, _x24) {
    return _ref18.apply(this, arguments);
  };
}();
var validateEmail = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(req, res) {
    var _req$body4, email, uid, snapshot, phoneExists;
    return _regeneratorRuntime().wrap(function _callee15$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _req$body4 = req.body, email = _req$body4.email, uid = _req$body4.uid; // Verificar que se proporcionen los parámetros necesarios
          if (email) {
            _context16.next = 4;
            break;
          }
          return _context16.abrupt("return", res.status(400).send({
            message: "El correo electrónico es obligatorio."
          }));
        case 4:
          _context16.next = 6;
          return db.collection("Usuarios").where("email", "==", email).get();
        case 6:
          snapshot = _context16.sent;
          if (snapshot.empty) {
            _context16.next = 11;
            break;
          }
          phoneExists = snapshot.docs.some(function (doc) {
            return doc.id !== uid;
          });
          if (!phoneExists) {
            _context16.next = 11;
            break;
          }
          return _context16.abrupt("return", res.status(409).send({
            message: "El correo electrónico ya está registrado.",
            valid: false
          }));
        case 11:
          return _context16.abrupt("return", res.status(200).send({
            message: "El correo electrónico es válido.",
            valid: true
          }));
        case 14:
          _context16.prev = 14;
          _context16.t0 = _context16["catch"](0);
          console.error("Error al validar el correo electrónico:", _context16.t0);
          res.status(500).send({
            message: "Error al validar el correo electrónico.",
            error: _context16.t0.message
          });
        case 18:
        case "end":
          return _context16.stop();
      }
    }, _callee15, null, [[0, 14]]);
  }));
  return function validateEmail(_x25, _x26) {
    return _ref19.apply(this, arguments);
  };
}();
module.exports = {
  getSubscriptionsById: getSubscriptionsById,
  getServicios: getServicios,
  getServicesCategories: getServicesCategories,
  getServiciosPaginados: getServiciosPaginados,
  saveContactService: saveContactService,
  getServicesContact: getServicesContact,
  getProductsByCategory: getProductsByCategory,
  getCommentsByService: getCommentsByService,
  addCommentToService: addCommentToService,
  validatePhone: validatePhone,
  validateEmail: validateEmail,
  savePerfilView: savePerfilView,
  saveServiceContactView: saveServiceContactView
};

/* ─── Registra una visita al perfil de un taller ─────────────────────────── */
function savePerfilView(_x27, _x28) {
  return _savePerfilView.apply(this, arguments);
}
/* ─── Registra un contacto de botón (Llamada / Whatsapp / Contactar) ─────── */
function _savePerfilView() {
  _savePerfilView = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16(req, res) {
    var _ref20, id, nombre_taller, uid_taller, usuario, docData;
    return _regeneratorRuntime().wrap(function _callee16$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _ref20 = req.body || {}, id = _ref20.id, nombre_taller = _ref20.nombre_taller, uid_taller = _ref20.uid_taller, usuario = _ref20.usuario;
          if (uid_taller) {
            _context17.next = 4;
            break;
          }
          return _context17.abrupt("return", res.status(400).json({
            error: "uid_taller es obligatorio."
          }));
        case 4:
          docData = {
            nombre_taller: nombre_taller || null,
            uid_taller: uid_taller,
            usuario: {
              id: (usuario === null || usuario === void 0 ? void 0 : usuario.id) || null,
              email: (usuario === null || usuario === void 0 ? void 0 : usuario.email) || null,
              nombre: (usuario === null || usuario === void 0 ? void 0 : usuario.nombre) || null
            },
            fecha_creacion: admin.firestore.FieldValue.serverTimestamp()
          };
          _context17.next = 7;
          return db.collection("perfilViews").add(docData);
        case 7:
          return _context17.abrupt("return", res.status(200).json({
            message: "Vista registrada.",
            data: docData
          }));
        case 10:
          _context17.prev = 10;
          _context17.t0 = _context17["catch"](0);
          console.error("[savePerfilView] Error:", _context17.t0);
          return _context17.abrupt("return", res.status(500).json({
            error: "Error interno del servidor."
          }));
        case 14:
        case "end":
          return _context17.stop();
      }
    }, _callee16, null, [[0, 10]]);
  }));
  return _savePerfilView.apply(this, arguments);
}
function saveServiceContactView(_x29, _x30) {
  return _saveServiceContactView.apply(this, arguments);
}
function _saveServiceContactView() {
  _saveServiceContactView = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17(req, res) {
    var _ref21, nombre_taller, uid_taller, usuario, type, docData;
    return _regeneratorRuntime().wrap(function _callee17$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _ref21 = req.body || {}, nombre_taller = _ref21.nombre_taller, uid_taller = _ref21.uid_taller, usuario = _ref21.usuario, type = _ref21.type;
          if (uid_taller) {
            _context18.next = 4;
            break;
          }
          return _context18.abrupt("return", res.status(400).json({
            error: "uid_taller es obligatorio."
          }));
        case 4:
          docData = {
            nombre_taller: nombre_taller || null,
            uid_taller: uid_taller,
            usuario: {
              id: (usuario === null || usuario === void 0 ? void 0 : usuario.id) || null,
              email: (usuario === null || usuario === void 0 ? void 0 : usuario.email) || null,
              nombre: (usuario === null || usuario === void 0 ? void 0 : usuario.nombre) || null
            },
            fecha_creacion: admin.firestore.FieldValue.serverTimestamp(),
            type: type || null
          };
          _context18.next = 7;
          return db.collection("servicesContact").add(docData);
        case 7:
          return _context18.abrupt("return", res.status(200).json({
            message: "Contacto registrado.",
            data: docData
          }));
        case 10:
          _context18.prev = 10;
          _context18.t0 = _context18["catch"](0);
          console.error("[saveServiceContactView] Error:", _context18.t0);
          return _context18.abrupt("return", res.status(500).json({
            error: "Error interno del servidor."
          }));
        case 14:
        case "end":
          return _context18.stop();
      }
    }, _callee17, null, [[0, 10]]);
  }));
  return _saveServiceContactView.apply(this, arguments);
}