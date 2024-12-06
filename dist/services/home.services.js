"use strict";

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
          return db.collection("Servicios").get();
        case 3:
          serviciosSnapshot = _context.sent;
          // Crear un array para almacenar los servicios con sus talleres asociados
          serviciosConTalleres = []; // Iterar sobre los servicios y buscar los talleres relacionados
          _iterator = _createForOfIteratorHelper(serviciosSnapshot.docs);
          _context.prev = 6;
          _iterator.s();
        case 8:
          if ((_step = _iterator.n()).done) {
            _context.next = 24;
            break;
          }
          servicioDoc = _step.value;
          servicioData = servicioDoc.data(); // Agregar el uid del servicio al objeto de datos
          servicioData.uid_servicio = servicioDoc.id;

          // serviciosConTalleres contendrá los objetos con el `uid_servicio` incluido

          // Obtener el UID del taller del servicio
          uidTaller = servicioData.uid_taller; // Validar que uid_taller exista y sea una cadena válida
          if (!(uidTaller && typeof uidTaller === "string" && uidTaller.trim() !== "")) {
            _context.next = 21;
            break;
          }
          _context.next = 16;
          return db.collection("Usuarios").doc(uidTaller).get();
        case 16:
          tallerSnapshot = _context.sent;
          // Si el taller existe, agregar su información al servicio
          tallerData = tallerSnapshot.exists ? tallerSnapshot.data() : null; // Agregar el servicio junto con el taller a la lista
          serviciosConTalleres.push(_objectSpread(_objectSpread({}, servicioData), {}, {
            taller: tallerData
          }));
          _context.next = 22;
          break;
        case 21:
          console.warn("UID de taller no v\xE1lido para el servicio ".concat(servicioDoc.id));
        case 22:
          _context.next = 8;
          break;
        case 24:
          _context.next = 29;
          break;
        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](6);
          _iterator.e(_context.t0);
        case 29:
          _context.prev = 29;
          _iterator.f();
          return _context.finish(29);
        case 32:
          console.log("Servicios con Talleres:", serviciosConTalleres);
          res.send(serviciosConTalleres);
          _context.next = 40;
          break;
        case 36:
          _context.prev = 36;
          _context.t1 = _context["catch"](0);
          console.error("Error obteniendo servicios y talleres:", _context.t1);
          res.status(500).send("Error obteniendo servicios y talleres.");
        case 40:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 36], [6, 26, 29, 32]]);
  }));
  return function getServicios(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var saveContactService = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _ref3, id, nombre_servicio, precio, taller, uid_servicio, uid_taller, usuario_id, usuario_nombre, usuario_email, serviceData;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _ref3 = req.body || {}, id = _ref3.id, nombre_servicio = _ref3.nombre_servicio, precio = _ref3.precio, taller = _ref3.taller, uid_servicio = _ref3.uid_servicio, uid_taller = _ref3.uid_taller, usuario_id = _ref3.usuario_id, usuario_nombre = _ref3.usuario_nombre, usuario_email = _ref3.usuario_email;
          if (!(!id || !nombre_servicio || !precio || !taller || !uid_taller || !usuario_id)) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            error: 'Faltan campos obligatorios en el body de la solicitud.'
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
          _context2.next = 7;
          return db.collection('servicesContact').add(serviceData);
        case 7:
          return _context2.abrupt("return", res.status(200).json({
            message: 'Servicio guardado exitosamente.',
            serviceData: serviceData
          }));
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error al guardar el servicio:', _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            error: 'Error interno del servidor.'
          }));
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 10]]);
  }));
  return function saveContactService(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var getServicesContact = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var serviciosSnapshot, servicios;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return db.collection("servicesContact").get();
        case 3:
          serviciosSnapshot = _context3.sent;
          // Transformar el snapshot en un array de objetos con los datos de los documentos
          servicios = serviciosSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          });
          console.log("Servicios con Talleres:", servicios);

          // Enviar los datos transformados como respuesta
          res.status(200).json(servicios);
          _context3.next = 13;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("Error obteniendo servicios y talleres:", _context3.t0);
          res.status(500).send("Error obteniendo servicios y talleres.");
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function getServicesContact(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
var getServicesCategories = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$body, nombre_categoria, id, serviciosSnapshot, servicios, serviciosAleatorios;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          // Obtener la categoría enviada en el request
          _req$body = req.body, nombre_categoria = _req$body.nombre_categoria, id = _req$body.id; // O req.body dependiendo del método HTTP
          if (nombre_categoria) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return", res.status(400).send("Por favor, proporciona una categoría."));
        case 4:
          _context4.next = 6;
          return db.collection("Servicios").where("nombre_categoria", "==", nombre_categoria).where("uid_servicio", "!=", id) // Filtrar por categoría
          .get();
        case 6:
          serviciosSnapshot = _context4.sent;
          // Transformar el snapshot en un array de objetos con los datos de los documentos
          servicios = serviciosSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Si no hay servicios, devolver un arreglo vacío
          if (!(servicios.length === 0)) {
            _context4.next = 10;
            break;
          }
          return _context4.abrupt("return", res.status(200).json([]));
        case 10:
          // Obtener 3 servicios aleatorios
          serviciosAleatorios = servicios.sort(function () {
            return Math.random() - 0.5;
          }) // Ordenar aleatoriamente
          .slice(0, 3); // Tomar los primeros 3 elementos
          console.log("Servicios aleatorios con la categor\xEDa \"".concat(nombre_categoria, "\":"), serviciosAleatorios);

          // Enviar los datos como respuesta
          res.status(200).json(serviciosAleatorios);
          _context4.next = 19;
          break;
        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](0);
          console.error("Error obteniendo servicios por categoría:", _context4.t0);
          res.status(500).send("Error obteniendo servicios por categoría.");
        case 19:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 15]]);
  }));
  return function getServicesCategories(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();
module.exports = {
  getServicios: getServicios,
  saveContactService: saveContactService,
  getServicesContact: getServicesContact,
  getServicesCategories: getServicesCategories
};