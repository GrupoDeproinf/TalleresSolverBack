"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
  getFirestore = _require4.getFirestore;
var _require5 = require("../../firebaseConfig"),
  app = _require5.app; // Asegúrate de la ruta correcta

// Inicializar Firebase Auth y Firestore
var auth = getAuth(app); // Obtener la instancia de autenticación
// const db = getFirestore(); // Inicializar Firestore

var nodemailer = require("nodemailer");
var getUsuarios = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var result, usuarios;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return db.collection("Usuarios").get();
        case 3:
          result = _context.sent;
          if (!result.empty) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", res.status(404).send("No se encontraron usuarios"));
        case 6:
          usuarios = result.docs.map(function (doc) {
            return doc.data();
          });
          res.send(usuarios);
          _context.next = 14;
          break;
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error("Error al obtener usuarios:", _context.t0); // Muestra el error en la consola del servidor
          res.status(500).send("Error al obtener usuarios: ".concat(_context.t0.message)); // Muestra el mensaje del error
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 10]]);
  }));
  return function getUsuarios(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var SaveClient = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body, Nombre, cedula, phone, email, password, estado, base64, token, phoneRegex, userRecord, uid, imageUrl, buffer, file, infoUserCreated;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _req$body = req.body, Nombre = _req$body.Nombre, cedula = _req$body.cedula, phone = _req$body.phone, email = _req$body.email, password = _req$body.password, estado = _req$body.estado, base64 = _req$body.base64, token = _req$body.token; // Validar el formato del teléfono (ejemplo: debe tener 10 dígitos)
          phoneRegex = /^\d{10}$/;
          if (phoneRegex.test(phone)) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return", res.status(400).send("El teléfono debe contener 10 caracteres numéricos"));
        case 5:
          _context2.prev = 5;
          _context2.next = 8;
          return admin.auth().getUserByEmail(email);
        case 8:
          userRecord = _context2.sent;
          _context2.next = 11;
          return admin.auth().updateUser(userRecord.uid, {
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 11:
          userRecord = _context2.sent;
          _context2.next = 23;
          break;
        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](5);
          if (!(_context2.t0.code === "auth/user-not-found")) {
            _context2.next = 22;
            break;
          }
          _context2.next = 19;
          return admin.auth().createUser({
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 19:
          userRecord = _context2.sent;
          _context2.next = 23;
          break;
        case 22:
          throw _context2.t0;
        case 23:
          // Obtener el UID del usuario
          uid = userRecord.uid; // Subir la imagen de perfil al Storage
          imageUrl = '';
          if (!base64) {
            _context2.next = 31;
            break;
          }
          buffer = Buffer.from(base64, 'base64');
          file = bucket.file("profileImages/".concat(uid, ".jpg"));
          _context2.next = 30;
          return file.save(buffer, {
            metadata: {
              contentType: 'image/jpeg'
            },
            "public": true,
            validation: 'md5'
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
            token: token
          };
          _context2.next = 34;
          return db.collection("Usuarios").doc(uid).set(infoUserCreated, {
            merge: true
          });
        case 34:
          // Responder con el ID del documento creado o actualizado
          res.status(201).send({
            message: "Usuario guardado con éxito",
            uid: uid
          });
          _context2.next = 55;
          break;
        case 37:
          _context2.prev = 37;
          _context2.t1 = _context2["catch"](0);
          console.error("Error al guardar el usuario:", _context2.t1);

          // Manejar errores específicos de Firebase
          if (!(_context2.t1.code === "auth/email-already-exists")) {
            _context2.next = 44;
            break;
          }
          return _context2.abrupt("return", res.status(400).send({
            message: "El correo electrónico ya está en uso"
          }));
        case 44:
          if (!(_context2.t1.code === "auth/invalid-email")) {
            _context2.next = 48;
            break;
          }
          return _context2.abrupt("return", res.status(400).send({
            message: "El correo electrónico proporcionado no es válido"
          }));
        case 48:
          if (!(_context2.t1.code === "auth/weak-password")) {
            _context2.next = 52;
            break;
          }
          return _context2.abrupt("return", res.status(400).send({
            message: "La contraseña es demasiado débil"
          }));
        case 52:
          if (!(_context2.t1.code === "auth/phone-number-already-exists")) {
            _context2.next = 54;
            break;
          }
          return _context2.abrupt("return", res.status(400).send({
            message: "El número telefónico ya existe"
          }));
        case 54:
          // En caso de un error inesperado
          res.status(500).send("Error al guardar el usuario");
        case 55:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 37], [5, 14]]);
  }));
  return function SaveClient(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var SaveTaller = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$body2, Nombre, rif, phone, email, password, whats, metodos_pago, estado, base64, lat, lng, token, userRecord, uid, imageUrl, buffer, file, infoUserCreated;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          // Recibir los datos del taller desde el cuerpo de la solicitud
          _req$body2 = req.body, Nombre = _req$body2.Nombre, rif = _req$body2.rif, phone = _req$body2.phone, email = _req$body2.email, password = _req$body2.password, whats = _req$body2.whats, metodos_pago = _req$body2.metodos_pago, estado = _req$body2.estado, base64 = _req$body2.base64, lat = _req$body2.lat, lng = _req$body2.lng, token = _req$body2.token;
          _context3.prev = 2;
          _context3.next = 5;
          return admin.auth().getUserByEmail(email);
        case 5:
          userRecord = _context3.sent;
          _context3.next = 8;
          return admin.auth().updateUser(userRecord.uid, {
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 8:
          userRecord = _context3.sent;
          _context3.next = 20;
          break;
        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](2);
          if (!(_context3.t0.code === "auth/user-not-found")) {
            _context3.next = 19;
            break;
          }
          _context3.next = 16;
          return admin.auth().createUser({
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 16:
          userRecord = _context3.sent;
          _context3.next = 20;
          break;
        case 19:
          throw _context3.t0;
        case 20:
          // Obtener el UID del usuario
          uid = userRecord.uid; // Subir la imagen de perfil al Storage
          imageUrl = '';
          if (!base64) {
            _context3.next = 28;
            break;
          }
          buffer = Buffer.from(base64, 'base64');
          file = bucket.file("profileImages/".concat(uid, ".jpg"));
          _context3.next = 27;
          return file.save(buffer, {
            metadata: {
              contentType: 'image/jpeg'
            },
            "public": true,
            validation: 'md5'
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
          _context3.next = 31;
          return db.collection("Usuarios").doc(uid).set(infoUserCreated, {
            merge: true
          });
        case 31:
          // Responder con el ID del documento creado o actualizado
          res.status(201).send({
            message: "Usuario guardado con éxito",
            uid: uid
          });
          _context3.next = 52;
          break;
        case 34:
          _context3.prev = 34;
          _context3.t1 = _context3["catch"](0);
          console.error("Error al guardar el usuario:", _context3.t1);

          // Manejar errores específicos de Firebase
          if (!(_context3.t1.code === "auth/email-already-exists")) {
            _context3.next = 41;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "Este email ya está registrado."
          }));
        case 41:
          if (!(_context3.t1.code === "auth/phone-number-already-exists")) {
            _context3.next = 45;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "Este número de teléfono ya está registrado."
          }));
        case 45:
          if (!(_context3.t1.code === "auth/invalid-phone-number")) {
            _context3.next = 49;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "El número de teléfono no es válido."
          }));
        case 49:
          if (!(_context3.t1.code === "auth/invalid-password")) {
            _context3.next = 51;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "La contraseña es inválida."
          }));
        case 51:
          // En caso de un error inesperado
          res.status(500).send("Error al guardar el usuario");
        case 52:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 34], [2, 11]]);
  }));
  return function SaveTaller(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// Función para autenticar usuarios
var authenticateUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$body3, email, password, userCredential, user, result, resultAdmin, adminData, userData;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body3 = req.body, email = _req$body3.email, password = _req$body3.password; // Validar que se proporcione el email y la contraseña
          if (!(!email || !password)) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return", res.status(400).send({
            message: "Email y contraseña son requeridos"
          }));
        case 4:
          _context4.next = 6;
          return signInWithEmailAndPassword(auth, email, password);
        case 6:
          userCredential = _context4.sent;
          user = userCredential.user; // Verificar si el usuario está autenticado
          if (user) {
            _context4.next = 10;
            break;
          }
          return _context4.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado"
          }));
        case 10:
          _context4.next = 12;
          return db.collection("Usuarios").where("email", "==", email).get();
        case 12:
          result = _context4.sent;
          if (!result.empty) {
            _context4.next = 25;
            break;
          }
          _context4.next = 16;
          return db.collection("Admins").where("email", "==", email).get();
        case 16:
          resultAdmin = _context4.sent;
          if (!resultAdmin.empty) {
            _context4.next = 21;
            break;
          }
          return _context4.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado ni en Usuarios ni en Admins"
          }));
        case 21:
          // Si se encuentra en "Admins", devolver los datos del usuario y el UID del documento
          adminData = resultAdmin.docs.map(function (doc) {
            return _objectSpread({
              uid: doc.id
            }, doc.data());
          });
          return _context4.abrupt("return", res.status(200).send({
            message: "Usuario autenticado exitosamente como Admin",
            userData: adminData[0] // Enviar el primer documento encontrado con el UID
          }));
        case 23:
          _context4.next = 27;
          break;
        case 25:
          // Si se encuentra en "Usuarios", devolver los datos del usuario y el UID del documento
          userData = result.docs.map(function (doc) {
            return _objectSpread({
              uid: doc.id
            }, doc.data());
          });
          return _context4.abrupt("return", res.status(200).send({
            message: "Usuario autenticado exitosamente",
            userData: userData[0] // Enviar el primer documento encontrado con el UID
          }));
        case 27:
          _context4.next = 41;
          break;
        case 29:
          _context4.prev = 29;
          _context4.t0 = _context4["catch"](0);
          // Manejo de errores
          console.error("Error al autenticar al usuario:", _context4.t0);
          if (!(_context4.t0.code === "auth/user-not-found")) {
            _context4.next = 36;
            break;
          }
          return _context4.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado en Firebase Authentication"
          }));
        case 36:
          if (!(_context4.t0.code === "auth/wrong-password")) {
            _context4.next = 40;
            break;
          }
          return _context4.abrupt("return", res.status(401).send({
            message: "Contraseña incorrecta"
          }));
        case 40:
          return _context4.abrupt("return", res.status(500).send({
            message: "Error al autenticar al usuario",
            error: _context4.t0.message // Incluir detalles para depuración
          }));
        case 41:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 29]]);
  }));
  return function authenticateUser(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var getUserByUid = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var uid, userDoc;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          // Obtener el UID desde los parámetros de la URL
          uid = req.body.uid;
          console.log(uid);

          // Buscar el documento del usuario con el UID en la colección "Usuarios"
          _context5.next = 5;
          return db.collection("Usuarios").doc(uid).get();
        case 5:
          userDoc = _context5.sent;
          if (!userDoc.exists) {
            _context5.next = 14;
            break;
          }
          console.log("Existe");
          console.log(userDoc);
          console.log("***********************************************");
          console.log(userDoc.data());
          // Si el documento existe, devolver los datos del usuario
          return _context5.abrupt("return", res.status(200).send({
            message: "Usuario encontrado",
            userData: userDoc.data() // Devuelve los datos del documento
          }));
        case 14:
          console.log("No Existe");
          // Si el documento no existe, devolver un mensaje de error
          return _context5.abrupt("return", res.status(404).send({
            message: "No se encontró el usuario con el UID proporcionado"
          }));
        case 16:
          _context5.next = 23;
          break;
        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          console.error("Error al obtener el usuario por UID:", _context5.t0);
          console.log("Dio errro");
          res.status(500).send("Error al obtener el usuario");
        case 23:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 18]]);
  }));
  return function getUserByUid(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var SaveTallerAll = function SaveTallerAll(req, res) {
  try {
    var _req$body4 = req.body,
      uid = _req$body4.uid,
      base64 = _req$body4.base64,
      imageTodelete = _req$body4.imageTodelete;

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
        }).then(function (_ref6) {
          var _ref7 = _slicedToArray(_ref6, 1),
            files = _ref7[0];
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
var restorePass = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var email;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          // Recibir el email del cuerpo de la solicitud
          email = req.body.email; // Generar el enlace de restablecimiento de contraseña
          _context6.next = 3;
          return admin.auth().generatePasswordResetLink(email).then(function (link) {
            return sendResetPasswordEmail(email, link, res);
          })["catch"](function (error) {
            // Some error occurred.
            console.log(error);
            res.status(500).send({
              message: "No existe el usuario",
              error: error
            });
          });
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function restorePass(_x11, _x12) {
    return _ref8.apply(this, arguments);
  };
}();
var sendResetPasswordEmail = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(email, resetLink, res) {
    var transporter, mailOptions;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          // Configura el transporter
          transporter = nodemailer.createTransport({
            service: "Gmail",
            // Puedes cambiarlo por el servicio de correo que uses
            auth: {
              user: "solverstalleres@gmail.com",
              // Tu correo electrónico
              pass: "difg cvzy ndhe fqzw" // Tu contraseña de correo electrónico
            }
          }); // Configura el contenido del correo
          mailOptions = {
            from: "solverstalleres@gmail.com",
            to: email,
            // Destinatario
            subject: "Restablecer Contraseña",
            html: "<p>Hola,</p>\n               <p>Sigue este enlace para restablecer tu contrase\xF1a: <a href=\"".concat(resetLink, "\">").concat(resetLink, "</a></p>\n               <p>Si no solicitaste restablecer tu contrase\xF1a, puedes ignorar este correo.</p>\n               <p>Gracias, Solvers</p>\n               <p>Tu equipo</p>")
          }; // Envía el correo
          _context7.prev = 2;
          _context7.next = 5;
          return transporter.sendMail(mailOptions);
        case 5:
          res.status(200).send({
            message: "Correo de restablecimiento enviado."
          });
          _context7.next = 11;
          break;
        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](2);
          console.error("Error al enviar el correo:", _context7.t0);
        case 11:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[2, 8]]);
  }));
  return function sendResetPasswordEmail(_x13, _x14, _x15) {
    return _ref9.apply(this, arguments);
  };
}();
var getTalleres = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var estado, result, usuarios;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          estado = req.body.estado;
          _context8.next = 4;
          return db.collection("Usuarios").where("status", "!=", "Aprobado").where("typeUser", "==", "Taller") // Filtrar documentos por typeUser
          .where("estado", "==", estado) // Filtrar documentos por typeUser
          .get();
        case 4:
          result = _context8.sent;
          if (!result.empty) {
            _context8.next = 7;
            break;
          }
          return _context8.abrupt("return", res.status(404).send('No se encontraron usuarios con el tipo "Taller"'));
        case 7:
          usuarios = result.docs.map(function (doc) {
            return doc.data();
          });
          res.send(usuarios);
          _context8.next = 15;
          break;
        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](0);
          console.error("Error al obtener usuarios:", _context8.t0);
          res.status(500).send("Error al obtener usuarios");
        case 15:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 11]]);
  }));
  return function getTalleres(_x16, _x17) {
    return _ref10.apply(this, arguments);
  };
}();
var actualizarStatusUsuario = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var _req$body5, uid, nuevoStatus, certificador_nombre, certificador_key;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          // Obtener el UID y el nuevo estado desde el cuerpo de la solicitud
          _req$body5 = req.body, uid = _req$body5.uid, nuevoStatus = _req$body5.nuevoStatus, certificador_nombre = _req$body5.certificador_nombre, certificador_key = _req$body5.certificador_key; // Verificar que se haya proporcionado un UID y un nuevo estado
          if (!(!uid || !nuevoStatus)) {
            _context9.next = 4;
            break;
          }
          return _context9.abrupt("return", res.status(400).send({
            message: "El UID y el nuevo estado son requeridos"
          }));
        case 4:
          _context9.next = 6;
          return db.collection("Usuarios").doc(uid).update({
            status: nuevoStatus,
            certificador_nombre: certificador_nombre,
            certificador_key: certificador_key
          });
        case 6:
          return _context9.abrupt("return", res.status(200).send({
            message: "El estado del usuario ha sido actualizado exitosamente"
          }));
        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          console.error("Error al actualizar el estado del usuario:", _context9.t0);
          return _context9.abrupt("return", res.status(500).send({
            message: "Error al actualizar el estado del usuario",
            error: _context9.t0.message // Incluir detalles para depuración
          }));
        case 13:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 9]]);
  }));
  return function actualizarStatusUsuario(_x18, _x19) {
    return _ref11.apply(this, arguments);
  };
}();
var UpdateTaller = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var _req$body6, uid, nombre, rif, phone, email, Direccion, RegComercial, Caracteristicas, Tarifa, Experiencia, LinkFacebook, LinkInstagram, LinkTiktok, Garantia, seguro, agenteAutorizado, updatedUserInfo;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _req$body6 = req.body, uid = _req$body6.uid, nombre = _req$body6.nombre, rif = _req$body6.rif, phone = _req$body6.phone, email = _req$body6.email, Direccion = _req$body6.Direccion, RegComercial = _req$body6.RegComercial, Caracteristicas = _req$body6.Caracteristicas, Tarifa = _req$body6.Tarifa, Experiencia = _req$body6.Experiencia, LinkFacebook = _req$body6.LinkFacebook, LinkInstagram = _req$body6.LinkInstagram, LinkTiktok = _req$body6.LinkTiktok, Garantia = _req$body6.Garantia, seguro = _req$body6.seguro, agenteAutorizado = _req$body6.agenteAutorizado; // Crear el objeto con los datos que se actualizarán en la colección "Usuarios"
          updatedUserInfo = {
            uid: uid,
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
          _context10.next = 5;
          return db.collection("Usuarios").doc(uid).update(updatedUserInfo);
        case 5:
          // Responder con un mensaje de éxito
          res.status(200).send({
            message: "Usuario actualizado con éxito",
            uid: uid
          });
          _context10.next = 12;
          break;
        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](0);
          console.error("Error al actualizar el usuario:", _context10.t0);

          // En caso de error, responder con el mensaje correspondiente
          res.status(500).send({
            message: "Error al actualizar el usuario",
            error: _context10.t0.message
          });
        case 12:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 8]]);
  }));
  return function UpdateTaller(_x20, _x21) {
    return _ref12.apply(this, arguments);
  };
}();
var UpdateClient = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var _req$body7, uid, Nombre, cedula, phone, email, base64, imageTodelete, estado, updatedUserInfo, getLastImageIndex, processImage, deleteOldImage;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          try {
            // Recibir los datos del cliente desde el cuerpo de la solicitud
            _req$body7 = req.body, uid = _req$body7.uid, Nombre = _req$body7.Nombre, cedula = _req$body7.cedula, phone = _req$body7.phone, email = _req$body7.email, base64 = _req$body7.base64, imageTodelete = _req$body7.imageTodelete, estado = _req$body7.estado; // Crear el objeto que se actualizará en la colección "Usuarios"
            updatedUserInfo = {
              nombre: Nombre,
              cedula: cedula,
              phone: phone,
              typeUser: "Cliente",
              email: email,
              uid: uid,
              estado: estado
            };
            getLastImageIndex = function getLastImageIndex() {
              return new Promise(function (resolve, reject) {
                var prefix = "profileImages/".concat(uid);
                bucket.getFiles({
                  prefix: prefix
                }).then(function (_ref14) {
                  var _ref15 = _slicedToArray(_ref14, 1),
                    files = _ref15[0];
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
                if (imageTodelete && imageTodelete.trim() !== '') {
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
            getLastImageIndex().then(function (index) {
              return processImage(index);
            }).then(function () {
              // Eliminar el campo base64 y imageTodelete del cuerpo de la solicitud
              delete req.body.base64;
              delete req.body.imageTodelete;
            }).then(function () {
              return db.collection("Usuarios").doc(uid).update(updatedUserInfo);
            }).then(function () {
              if (imageTodelete && imageTodelete.trim() !== '') {
                return deleteOldImage();
              }
            }).then(function () {
              // Responder con un mensaje de éxito
              res.status(200).send({
                message: "Usuario actualizado con éxito",
                uid: uid
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
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function UpdateClient(_x22, _x23) {
    return _ref13.apply(this, arguments);
  };
}();
var getServicesByTalleruid = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var uid_taller, servicesSnapshot, services;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          // Obtener el UID_TALLER desde el cuerpo de la solicitud
          uid_taller = req.body.uid_taller;
          console.log(uid_taller);

          // Buscar en la colección "Servicios" los documentos donde uid_taller coincide
          _context12.next = 5;
          return db.collection("Servicios").where("uid_taller", "==", uid_taller).get();
        case 5:
          servicesSnapshot = _context12.sent;
          if (!servicesSnapshot.empty) {
            _context12.next = 9;
            break;
          }
          console.log("No se encontraron servicios para el UID_TALLER proporcionado");
          return _context12.abrupt("return", res.status(404).send({
            message: "No se encontraron servicios para el UID_TALLER proporcionado"
          }));
        case 9:
          // Mapear los datos de los documentos encontrados en un array
          services = servicesSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Enviar los servicios encontrados
          return _context12.abrupt("return", res.status(200).send({
            message: "Servicios encontrados",
            services: services
          }));
        case 13:
          _context12.prev = 13;
          _context12.t0 = _context12["catch"](0);
          console.error("Error al obtener los servicios por UID_TALLER:", _context12.t0);
          res.status(500).send("Error al obtener los servicios");
        case 17:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 13]]);
  }));
  return function getServicesByTalleruid(_x24, _x25) {
    return _ref16.apply(this, arguments);
  };
}();
var getServiceByUid = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var _uid, serviceSnapshot, serviceData;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          // Obtener el UID del servicio desde el cuerpo de la solicitud
          _uid = req.body.uid;
          console.log("UID del servicio:", _uid);

          // Buscar el documento en la colección "Servicios" donde el campo "uid" coincide
          _context13.next = 5;
          return db.collection("Servicios").doc(_uid).get();
        case 5:
          serviceSnapshot = _context13.sent;
          if (serviceSnapshot.exists) {
            _context13.next = 9;
            break;
          }
          console.log("No se encontró el servicio con el UID proporcionado");
          return _context13.abrupt("return", res.status(404).send({
            message: "No se encontró el servicio con el UID proporcionado"
          }));
        case 9:
          // Obtener los datos del documento encontrado
          serviceData = _objectSpread({
            id: serviceSnapshot.id
          }, serviceSnapshot.data()); // Enviar el servicio encontrado
          return _context13.abrupt("return", res.status(200).send({
            message: "Servicio encontrado",
            service: serviceData
          }));
        case 13:
          _context13.prev = 13;
          _context13.t0 = _context13["catch"](0);
          console.error("Error al obtener el servicio por UID:", _context13.t0);
          res.status(500).send("Error al obtener el servicio");
        case 17:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 13]]);
  }));
  return function getServiceByUid(_x26, _x27) {
    return _ref17.apply(this, arguments);
  };
}();
var getActiveCategories = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var categoriesSnapshot, categories;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return db.collection("Categorias").where("estatus", "==", true).get();
        case 3:
          categoriesSnapshot = _context14.sent;
          if (!categoriesSnapshot.empty) {
            _context14.next = 7;
            break;
          }
          console.log("No se encontraron categorías activas");
          return _context14.abrupt("return", res.status(404).send({
            message: "No se encontraron categorías activas"
          }));
        case 7:
          // Mapear los datos de los documentos encontrados en un array
          categories = categoriesSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Enviar las categorías activas encontradas
          return _context14.abrupt("return", res.status(200).send({
            message: "Categorías activas encontradas",
            categories: categories
          }));
        case 11:
          _context14.prev = 11;
          _context14.t0 = _context14["catch"](0);
          console.error("Error al obtener las categorías activas:", _context14.t0);
          res.status(500).send("Error al obtener las categorías activas");
        case 15:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 11]]);
  }));
  return function getActiveCategories(_x28, _x29) {
    return _ref18.apply(this, arguments);
  };
}();
var getSubcategoriesByCategoryUid = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(req, res) {
    var uid_categoria, subcategoriesSnapshot, subcategories;
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          // Obtener el UID de la categoría desde el cuerpo de la solicitud
          uid_categoria = req.body.uid_categoria;
          console.log("UID de la categor\xEDa: ".concat(uid_categoria));

          // Referencia a la subcolección "Subcategoría" dentro del documento de la categoría especificada
          _context15.next = 5;
          return db.collection("Categorias").doc(uid_categoria).collection("Subcategorias").where("estatus", "==", true) // Filtro para obtener solo subcategorías activas
          .get();
        case 5:
          subcategoriesSnapshot = _context15.sent;
          if (!subcategoriesSnapshot.empty) {
            _context15.next = 9;
            break;
          }
          console.log("No se encontraron subcategorías para la categoría proporcionada");
          return _context15.abrupt("return", res.status(404).send({
            message: "No se encontraron subcategorías para la categoría proporcionada"
          }));
        case 9:
          // Mapear los datos de los documentos encontrados en un array
          subcategories = subcategoriesSnapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          }); // Enviar las subcategorías encontradas
          return _context15.abrupt("return", res.status(200).send({
            message: "Subcategorías encontradas",
            subcategories: subcategories
          }));
        case 13:
          _context15.prev = 13;
          _context15.t0 = _context15["catch"](0);
          console.error("Error al obtener las subcategorías por UID de categoría:", _context15.t0);
          res.status(500).send("Error al obtener las subcategorías");
        case 17:
        case "end":
          return _context15.stop();
      }
    }, _callee15, null, [[0, 13]]);
  }));
  return function getSubcategoriesByCategoryUid(_x30, _x31) {
    return _ref19.apply(this, arguments);
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
  var _ref20 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18(req, res) {
    var _req$body8, id, categoria, descripcion, estatus, garantia, nombre_servicio, precio, subcategoria, taller, uid_categoria, uid_servicio, uid_subcategoria, uid_taller, puntuacion, publicOrigin, images, edit, serviceData, getLastImageIndex, uploadImages, deleteOldImages, serviceRef, serviceSnapshot, userId, userRef, userDoc, userData, cantidadServicios, imageUrls, _userId, _userRef, _userDoc, _userData, _cantidadServicios, _imageUrls, newServiceRef, _userId2, _userRef2, _userDoc2, _userData2, _cantidadServicios2, _imageUrls2, _userId3, _userRef3, _userDoc3, _userData3, _cantidadServicios3, _imageUrls3;
    return _regeneratorRuntime().wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          // Obtener los datos del servicio desde el cuerpo de la solicitud
          _req$body8 = req.body, id = _req$body8.id, categoria = _req$body8.categoria, descripcion = _req$body8.descripcion, estatus = _req$body8.estatus, garantia = _req$body8.garantia, nombre_servicio = _req$body8.nombre_servicio, precio = _req$body8.precio, subcategoria = _req$body8.subcategoria, taller = _req$body8.taller, uid_categoria = _req$body8.uid_categoria, uid_servicio = _req$body8.uid_servicio, uid_subcategoria = _req$body8.uid_subcategoria, uid_taller = _req$body8.uid_taller, puntuacion = _req$body8.puntuacion, publicOrigin = _req$body8.publicOrigin, images = _req$body8.images, edit = _req$body8.edit;
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
              }).then(function (_ref21) {
                var _ref22 = _slicedToArray(_ref21, 1),
                  files = _ref22[0];
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
            var _ref23 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16(id, images) {
              var imageUrls, i, _base, index, newFileName, buffer, file, imageUrl;
              return _regeneratorRuntime().wrap(function _callee16$(_context16) {
                while (1) switch (_context16.prev = _context16.next) {
                  case 0:
                    imageUrls = [];
                    i = 0;
                  case 2:
                    if (!(i < images.length)) {
                      _context16.next = 17;
                      break;
                    }
                    _base = images[i];
                    _context16.next = 6;
                    return getLastImageIndex(id);
                  case 6:
                    index = _context16.sent;
                    newFileName = "service_images/".concat(id, "_").concat(index + 1, ".jpg");
                    buffer = Buffer.from(_base, 'base64');
                    file = bucket.file(newFileName);
                    _context16.next = 12;
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
                    _context16.next = 2;
                    break;
                  case 17:
                    return _context16.abrupt("return", imageUrls);
                  case 18:
                  case "end":
                    return _context16.stop();
                }
              }, _callee16);
            }));
            return function uploadImages(_x34, _x35) {
              return _ref23.apply(this, arguments);
            };
          }();
          deleteOldImages = /*#__PURE__*/function () {
            var _ref24 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17(id) {
              var prefix, _yield$bucket$getFile, _yield$bucket$getFile2, files, _iterator, _step, file;
              return _regeneratorRuntime().wrap(function _callee17$(_context17) {
                while (1) switch (_context17.prev = _context17.next) {
                  case 0:
                    prefix = "service_images/".concat(id);
                    _context17.next = 3;
                    return bucket.getFiles({
                      prefix: prefix
                    });
                  case 3:
                    _yield$bucket$getFile = _context17.sent;
                    _yield$bucket$getFile2 = _slicedToArray(_yield$bucket$getFile, 1);
                    files = _yield$bucket$getFile2[0];
                    _iterator = _createForOfIteratorHelper(files);
                    _context17.prev = 7;
                    _iterator.s();
                  case 9:
                    if ((_step = _iterator.n()).done) {
                      _context17.next = 15;
                      break;
                    }
                    file = _step.value;
                    _context17.next = 13;
                    return file["delete"]();
                  case 13:
                    _context17.next = 9;
                    break;
                  case 15:
                    _context17.next = 20;
                    break;
                  case 17:
                    _context17.prev = 17;
                    _context17.t0 = _context17["catch"](7);
                    _iterator.e(_context17.t0);
                  case 20:
                    _context17.prev = 20;
                    _iterator.f();
                    return _context17.finish(20);
                  case 23:
                  case "end":
                    return _context17.stop();
                }
              }, _callee17, null, [[7, 17, 20, 23]]);
            }));
            return function deleteOldImages(_x36) {
              return _ref24.apply(this, arguments);
            };
          }(); // Si `id` tiene un valor, editar el documento en la colección "Servicios"
          if (!id) {
            _context18.next = 67;
            break;
          }
          serviceRef = db.collection("Servicios").doc(id);
          _context18.next = 12;
          return serviceRef.get();
        case 12:
          serviceSnapshot = _context18.sent;
          if (serviceSnapshot.exists) {
            _context18.next = 15;
            break;
          }
          return _context18.abrupt("return", res.status(404).send({
            message: "No se encontró el servicio con el ID proporcionado para actualizar"
          }));
        case 15:
          _context18.next = 17;
          return serviceRef.update(serviceData);
        case 17:
          console.log("Servicio actualizado:", id);
          if (!serviceData.estatus) {
            _context18.next = 43;
            break;
          }
          if (publicOrigin) {
            _context18.next = 31;
            break;
          }
          userId = uid_taller;
          userRef = db.collection("Usuarios").doc(userId);
          _context18.next = 24;
          return userRef.get();
        case 24:
          userDoc = _context18.sent;
          if (!userDoc.exists) {
            _context18.next = 31;
            break;
          }
          userData = userDoc.data();
          cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
          cantidadServicios -= 1;
          _context18.next = 31;
          return userRef.update({
            "subscripcion_actual.cantidad_servicios": cantidadServicios.toString()
          });
        case 31:
          if (!edit) {
            _context18.next = 34;
            break;
          }
          _context18.next = 34;
          return deleteOldImages(id);
        case 34:
          _context18.next = 36;
          return uploadImages(id, images);
        case 36:
          imageUrls = _context18.sent;
          serviceData.service_image = imageUrls;
          _context18.next = 40;
          return serviceRef.update(serviceData);
        case 40:
          return _context18.abrupt("return", res.status(200).send({
            message: "Servicio actualizado exitosamente",
            service: _objectSpread({
              id: id
            }, serviceData)
          }));
        case 43:
          if (!publicOrigin) {
            _context18.next = 55;
            break;
          }
          _userId = uid_taller;
          _userRef = db.collection("Usuarios").doc(_userId);
          _context18.next = 48;
          return _userRef.get();
        case 48:
          _userDoc = _context18.sent;
          if (!_userDoc.exists) {
            _context18.next = 55;
            break;
          }
          _userData = _userDoc.data();
          _cantidadServicios = parseInt(_userData.subscripcion_actual.cantidad_servicios, 10) || 0;
          _cantidadServicios += 1;
          _context18.next = 55;
          return _userRef.update({
            "subscripcion_actual.cantidad_servicios": _cantidadServicios.toString()
          });
        case 55:
          if (!edit) {
            _context18.next = 58;
            break;
          }
          _context18.next = 58;
          return deleteOldImages(id);
        case 58:
          _context18.next = 60;
          return uploadImages(id, images);
        case 60:
          _imageUrls = _context18.sent;
          serviceData.service_image = _imageUrls;
          _context18.next = 64;
          return serviceRef.update(serviceData);
        case 64:
          return _context18.abrupt("return", res.status(200).send({
            message: "Servicio actualizado exitosamente",
            service: _objectSpread({
              id: id
            }, serviceData)
          }));
        case 65:
          _context18.next = 114;
          break;
        case 67:
          _context18.next = 69;
          return db.collection("Servicios").add(serviceData);
        case 69:
          newServiceRef = _context18.sent;
          console.log("Servicio creado con ID:", newServiceRef.id);
          if (!serviceData.estatus) {
            _context18.next = 94;
            break;
          }
          if (publicOrigin) {
            _context18.next = 84;
            break;
          }
          _userId2 = uid_taller;
          _userRef2 = db.collection("Usuarios").doc(_userId2);
          _context18.next = 77;
          return _userRef2.get();
        case 77:
          _userDoc2 = _context18.sent;
          if (!_userDoc2.exists) {
            _context18.next = 84;
            break;
          }
          _userData2 = _userDoc2.data();
          _cantidadServicios2 = parseInt(_userData2.subscripcion_actual.cantidad_servicios, 10) || 0;
          _cantidadServicios2 -= 1;
          _context18.next = 84;
          return _userRef2.update({
            "subscripcion_actual.cantidad_servicios": _cantidadServicios2.toString()
          });
        case 84:
          serviceData.id = newServiceRef.id;
          _context18.next = 87;
          return uploadImages(newServiceRef.id, images);
        case 87:
          _imageUrls2 = _context18.sent;
          serviceData.service_image = _imageUrls2;
          _context18.next = 91;
          return newServiceRef.update(serviceData);
        case 91:
          return _context18.abrupt("return", res.status(201).send({
            message: "Servicio creado exitosamente",
            service: _objectSpread({
              id: newServiceRef.id
            }, serviceData)
          }));
        case 94:
          if (!publicOrigin) {
            _context18.next = 106;
            break;
          }
          _userId3 = uid_taller;
          _userRef3 = db.collection("Usuarios").doc(_userId3);
          _context18.next = 99;
          return _userRef3.get();
        case 99:
          _userDoc3 = _context18.sent;
          if (!_userDoc3.exists) {
            _context18.next = 106;
            break;
          }
          _userData3 = _userDoc3.data();
          _cantidadServicios3 = parseInt(_userData3.subscripcion_actual.cantidad_servicios, 10) || 0;
          _cantidadServicios3 += 1;
          _context18.next = 106;
          return _userRef3.update({
            "subscripcion_actual.cantidad_servicios": _cantidadServicios3.toString()
          });
        case 106:
          serviceData.id = newServiceRef.id;
          _context18.next = 109;
          return uploadImages(newServiceRef.id, images);
        case 109:
          _imageUrls3 = _context18.sent;
          serviceData.service_image = _imageUrls3;
          _context18.next = 113;
          return newServiceRef.update(serviceData);
        case 113:
          return _context18.abrupt("return", res.status(201).send({
            message: "Servicio creado exitosamente",
            service: _objectSpread({
              id: newServiceRef.id
            }, serviceData)
          }));
        case 114:
          _context18.next = 120;
          break;
        case 116:
          _context18.prev = 116;
          _context18.t0 = _context18["catch"](0);
          console.error("Error al guardar o actualizar el servicio:", _context18.t0);
          res.status(500).send(_context18.t0);
        case 120:
        case "end":
          return _context18.stop();
      }
    }, _callee18, null, [[0, 116]]);
  }));
  return function saveOrUpdateService(_x32, _x33) {
    return _ref20.apply(this, arguments);
  };
}();
var getPlanes = /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee19(req, res) {
    var result, planes;
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _context19.next = 3;
          return db.collection("Planes").where("status", "==", "Activo") // Filtrar documentos por status "Activo"
          .get();
        case 3:
          result = _context19.sent;
          if (!result.empty) {
            _context19.next = 6;
            break;
          }
          return _context19.abrupt("return", res.status(404).send('No se encontraron planes con el estado "Activo"'));
        case 6:
          planes = result.docs.map(function (doc) {
            return doc.data();
          });
          res.send(planes);
          _context19.next = 14;
          break;
        case 10:
          _context19.prev = 10;
          _context19.t0 = _context19["catch"](0);
          console.error("Error al obtener planes:", _context19.t0);
          res.status(500).send("Error al obtener planes");
        case 14:
        case "end":
          return _context19.stop();
      }
    }, _callee19, null, [[0, 10]]);
  }));
  return function getPlanes(_x37, _x38) {
    return _ref25.apply(this, arguments);
  };
}();
var getMetodosPago = /*#__PURE__*/function () {
  var _ref26 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee20(req, res) {
    var result, planes;
    return _regeneratorRuntime().wrap(function _callee20$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          _context20.next = 3;
          return db.collection("MetodosPago").where("status", "==", true) // Filtrar documentos por status "Activo"
          .get();
        case 3:
          result = _context20.sent;
          if (!result.empty) {
            _context20.next = 6;
            break;
          }
          return _context20.abrupt("return", res.status(404).send('No se encontraron los metodos con el estado "true"'));
        case 6:
          planes = result.docs.map(function (doc) {
            return doc.data();
          });
          res.send(planes);
          _context20.next = 14;
          break;
        case 10:
          _context20.prev = 10;
          _context20.t0 = _context20["catch"](0);
          console.error("Error al obtener metodos:", _context20.t0);
          res.status(500).send("Error al obtener metodos");
        case 14:
        case "end":
          return _context20.stop();
      }
    }, _callee20, null, [[0, 10]]);
  }));
  return function getMetodosPago(_x39, _x40) {
    return _ref26.apply(this, arguments);
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
var ReportarPagoData = /*#__PURE__*/function () {
  var _ref27 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee21(req, res) {
    var _req$body9, uid, emailZelle, cod_ref, bancoTranfe, identificacion, telefono, amount, paymentMethod, nombre, vigencia, cant_services, date, montoPago, SelectedBanco, SelectedBancoDestino, nombre_taller, base64, userId, timestamp, imageUrl, newFileName, buffer, file, subscripcionData, subscripcionRef, subscripcionId, serviciosSnapshot, batch;
    return _regeneratorRuntime().wrap(function _callee21$(_context21) {
      while (1) switch (_context21.prev = _context21.next) {
        case 0:
          _req$body9 = req.body, uid = _req$body9.uid, emailZelle = _req$body9.emailZelle, cod_ref = _req$body9.cod_ref, bancoTranfe = _req$body9.bancoTranfe, identificacion = _req$body9.identificacion, telefono = _req$body9.telefono, amount = _req$body9.amount, paymentMethod = _req$body9.paymentMethod, nombre = _req$body9.nombre, vigencia = _req$body9.vigencia, cant_services = _req$body9.cant_services, date = _req$body9.date, montoPago = _req$body9.montoPago, SelectedBanco = _req$body9.SelectedBanco, SelectedBancoDestino = _req$body9.SelectedBancoDestino, nombre_taller = _req$body9.nombre_taller, base64 = _req$body9.base64;
          _context21.prev = 1;
          userId = uid;
          timestamp = new Date().toISOString(); // Generar la fecha y hora actuales
          imageUrl = '';
          if (!(base64 && base64.trim() !== '')) {
            _context21.next = 12;
            break;
          }
          newFileName = "paymentcommitment/".concat(paymentMethod, "_").concat(userId, "_").concat(timestamp, ".jpg");
          buffer = Buffer.from(base64, 'base64');
          file = bucket.file(newFileName); // Subir la nueva imagen usando la función `uploadImage`
          _context21.next = 11;
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
            nombre_taller: nombre_taller == undefined ? "" : nombre_taller
          }; // Guardar en la colección Subscripciones
          _context21.next = 15;
          return db.collection('Subscripciones').add(subscripcionData);
        case 15:
          subscripcionRef = _context21.sent;
          subscripcionId = subscripcionRef.id; // Guardar en el campo subscripcion_actual del documento en la colección Usuarios
          _context21.next = 19;
          return db.collection('Usuarios').doc(userId).update({
            subscripcion_actual: subscripcionData
          });
        case 19:
          _context21.next = 21;
          return db.collection('Servicios').where('uid_taller', '==', userId).get();
        case 21:
          serviciosSnapshot = _context21.sent;
          batch = db.batch();
          serviciosSnapshot.forEach(function (doc) {
            batch.update(doc.ref, {
              estatus: false
            });
          });
          _context21.next = 26;
          return batch.commit();
        case 26:
          return _context21.abrupt("return", res.status(201).send({
            message: "Suscripción guardada con éxito."
          }));
        case 29:
          _context21.prev = 29;
          _context21.t0 = _context21["catch"](1);
          console.error("Error al guardar la suscripción:", _context21.t0);
          res.status(500).send("Error al guardar la suscripción");
        case 33:
        case "end":
          return _context21.stop();
      }
    }, _callee21, null, [[1, 29]]);
  }));
  return function ReportarPagoData(_x41, _x42) {
    return _ref27.apply(this, arguments);
  };
}();
var getPlanesActivos = /*#__PURE__*/function () {
  var _ref28 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee22() {
    var result, usuarios, fechaActual, usuariosFiltrados, _iterator2, _step2, _loop;
    return _regeneratorRuntime().wrap(function _callee22$(_context23) {
      while (1) switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          _context23.next = 3;
          return db.collection("Usuarios").where("subscripcion_actual.status", "==", "Aprobado").get();
        case 3:
          result = _context23.sent;
          if (!result.empty) {
            _context23.next = 6;
            break;
          }
          return _context23.abrupt("return", console.log("No se encontraron usuarios"));
        case 6:
          usuarios = result.docs.map(function (doc) {
            return doc.data();
          });
          fechaActual = new Date();
          usuariosFiltrados = usuarios.filter(function (usuario) {
            var subscripcion_actual = usuario.subscripcion_actual;
            var fechaInicio = subscripcion_actual.fecha_inicio.toDate();
            var fechaFin = subscripcion_actual.fecha_fin.toDate();
            return fechaActual < fechaInicio || fechaActual > fechaFin;
          });
          if (!(usuariosFiltrados.length === 0)) {
            _context23.next = 11;
            break;
          }
          return _context23.abrupt("return", console.log("No se encontraron usuarios con subscripción fuera de vigencia"));
        case 11:
          // Actualizar subscripcion_actual.cantidad_servicios a 0 y estatus a false en "Servicios"
          _iterator2 = _createForOfIteratorHelper(usuariosFiltrados);
          _context23.prev = 12;
          _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
            var usuario, userRef, serviciosSnapshot, batch;
            return _regeneratorRuntime().wrap(function _loop$(_context22) {
              while (1) switch (_context22.prev = _context22.next) {
                case 0:
                  usuario = _step2.value;
                  userRef = db.collection("Usuarios").doc(usuario.uid);
                  _context22.next = 4;
                  return userRef.update({
                    "subscripcion_actual.cantidad_servicios": 0,
                    "subscripcion_actual.status": 'Vencido'
                  });
                case 4:
                  _context22.next = 6;
                  return db.collection("Servicios").where("uid_taller", "==", usuario.uid).get();
                case 6:
                  serviciosSnapshot = _context22.sent;
                  batch = db.batch();
                  serviciosSnapshot.forEach(function (doc) {
                    var servicioRef = db.collection("Servicios").doc(doc.id);
                    batch.update(servicioRef, {
                      estatus: false
                    });
                  });
                  _context22.next = 11;
                  return batch.commit();
                case 11:
                case "end":
                  return _context22.stop();
              }
            }, _loop);
          });
          _iterator2.s();
        case 15:
          if ((_step2 = _iterator2.n()).done) {
            _context23.next = 19;
            break;
          }
          return _context23.delegateYield(_loop(), "t0", 17);
        case 17:
          _context23.next = 15;
          break;
        case 19:
          _context23.next = 24;
          break;
        case 21:
          _context23.prev = 21;
          _context23.t1 = _context23["catch"](12);
          _iterator2.e(_context23.t1);
        case 24:
          _context23.prev = 24;
          _iterator2.f();
          return _context23.finish(24);
        case 27:
          console.log("Usuarios y servicios actualizados correctamente.");
          _context23.next = 34;
          break;
        case 30:
          _context23.prev = 30;
          _context23.t2 = _context23["catch"](0);
          console.error("Error al actualizar usuarios y servicios:", _context23.t2); // Muestra el error en la consola del servidor
          console.log("Error al actualizar usuarios y servicios: ".concat(_context23.t2.message)); // Muestra el mensaje del error
        case 34:
        case "end":
          return _context23.stop();
      }
    }, _callee22, null, [[0, 30], [12, 21, 24, 27]]);
  }));
  return function getPlanesActivos() {
    return _ref28.apply(this, arguments);
  };
}();
var sendNotification = /*#__PURE__*/function () {
  var _ref29 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee23(req, res) {
    var _req$body10, token, title, body, secretCode, message, response;
    return _regeneratorRuntime().wrap(function _callee23$(_context24) {
      while (1) switch (_context24.prev = _context24.next) {
        case 0:
          _req$body10 = req.body, token = _req$body10.token, title = _req$body10.title, body = _req$body10.body, secretCode = _req$body10.secretCode;
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
          _context24.prev = 2;
          _context24.next = 5;
          return admin.messaging().send(message);
        case 5:
          response = _context24.sent;
          console.log("Successfully sent message:", response);
          res.status(200).send({
            message: "Notification sent successfully"
          });
          _context24.next = 14;
          break;
        case 10:
          _context24.prev = 10;
          _context24.t0 = _context24["catch"](2);
          console.error("Error sending message:", _context24.t0);
          res.status(500).send({
            message: "Error sending message",
            error: _context24.t0.message
          });
        case 14:
        case "end":
          return _context24.stop();
      }
    }, _callee23, null, [[2, 10]]);
  }));
  return function sendNotification(_x43, _x44) {
    return _ref29.apply(this, arguments);
  };
}();
var UpdateUsuariosAll = /*#__PURE__*/function () {
  var _ref30 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee24(req, res) {
    var _uid2;
    return _regeneratorRuntime().wrap(function _callee24$(_context25) {
      while (1) switch (_context25.prev = _context25.next) {
        case 0:
          _context25.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _uid2 = req.body.uid; // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
          _context25.next = 4;
          return db.collection("Usuarios").doc(_uid2).update(req.body);
        case 4:
          // Responder con un mensaje de éxito
          res.status(200).send({
            message: "Usuario actualizado con éxito",
            uid: _uid2
          });
          _context25.next = 11;
          break;
        case 7:
          _context25.prev = 7;
          _context25.t0 = _context25["catch"](0);
          console.error("Error al actualizar el usuario:", _context25.t0);

          // En caso de error, responder con el mensaje correspondiente
          res.status(500).send({
            message: "Error al actualizar el usuario",
            error: _context25.t0.message
          });
        case 11:
        case "end":
          return _context25.stop();
      }
    }, _callee24, null, [[0, 7]]);
  }));
  return function UpdateUsuariosAll(_x45, _x46) {
    return _ref30.apply(this, arguments);
  };
}();
module.exports = {
  getUsuarios: getUsuarios,
  SaveClient: SaveClient,
  SaveTaller: SaveTaller,
  authenticateUser: authenticateUser,
  getUserByUid: getUserByUid,
  SaveTallerAll: SaveTallerAll,
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
  getPlanesActivos: getPlanesActivos,
  sendNotification: sendNotification,
  UpdateUsuariosAll: UpdateUsuariosAll
};