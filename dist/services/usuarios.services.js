"use strict";

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
  db = _require.db;
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
          _context.next = 13;
          break;
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          res.status(500).send("Error al obtener usuarios");
        case 13:
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
    var _req$body, Nombre, cedula, phone, email, password, phoneRegex, userRecord, uid, infoUserCreated;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _req$body = req.body, Nombre = _req$body.Nombre, cedula = _req$body.cedula, phone = _req$body.phone, email = _req$body.email, password = _req$body.password; // Validar la entrada
          // if (!Nombre || !cedula || !phone || !email || !password) {
          //     return res.status(400).send('Todos los campos son requeridos');
          // }
          // Validar el formato del teléfono (ejemplo: debe tener 10 dígitos)
          phoneRegex = /^\d{10}$/; // Cambiar a la longitud deseada
          if (phoneRegex.test(phone)) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return", res.status(400).send("El teléfono debe contener 10 caracteres numéricos"));
        case 5:
          _context2.next = 7;
          return admin.auth().createUser({
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 7:
          userRecord = _context2.sent;
          // Obtener el UID generado por Firebase Authentication
          uid = userRecord.uid; // Crear el objeto que se guardará en la colección "Usuarios"
          infoUserCreated = {
            uid: uid,
            nombre: Nombre,
            cedula: cedula,
            phone: phone,
            typeUser: "Cliente",
            email: email
          }; // Guardar el objeto en la colección "Usuarios"
          _context2.next = 12;
          return db.collection("Usuarios").doc(uid).set(infoUserCreated);
        case 12:
          // Responder con el ID del documento creado y un mensaje de éxito
          res.status(201).send({
            message: "Usuario creado con éxito",
            uid: uid
          });
          _context2.next = 33;
          break;
        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error("Error al guardar el usuario:", _context2.t0);

          // Manejar errores específicos de Firebase
          if (!(_context2.t0.code === "auth/email-already-exists")) {
            _context2.next = 22;
            break;
          }
          return _context2.abrupt("return", res.status(400).send({
            message: "El correo electrónico ya está en uso"
          }));
        case 22:
          if (!(_context2.t0.code === "auth/invalid-email")) {
            _context2.next = 26;
            break;
          }
          return _context2.abrupt("return", res.status(400).send({
            message: "El correo electrónico proporcionado no es válido"
          }));
        case 26:
          if (!(_context2.t0.code === "auth/weak-password")) {
            _context2.next = 30;
            break;
          }
          return _context2.abrupt("return", res.status(400).send({
            message: "La contraseña es demasiado débil"
          }));
        case 30:
          if (!(_context2.t0.code === "auth/phone-number-already-exists")) {
            _context2.next = 32;
            break;
          }
          return _context2.abrupt("return", res.status(400).send({
            message: "El numero telefonico ya existe"
          }));
        case 32:
          // En caso de un error inesperado
          res.status(500).send("Error al guardar el usuario");
        case 33:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 15]]);
  }));
  return function SaveClient(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var SaveTaller = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$body2, Nombre, rif, phone, email, password, userByEmail, userByPhone, userRecord, uid, infoUserCreated;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _req$body2 = req.body, Nombre = _req$body2.Nombre, rif = _req$body2.rif, phone = _req$body2.phone, email = _req$body2.email, password = _req$body2.password; // Verificar si ya existe un usuario con ese email en Firebase Authentication
          _context3.prev = 2;
          _context3.next = 5;
          return admin.auth().getUserByEmail(email);
        case 5:
          userByEmail = _context3.sent;
          if (!userByEmail) {
            _context3.next = 8;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "Ya existe un usuario con este email."
          }));
        case 8:
          _context3.next = 12;
          break;
        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](2);
        case 12:
          _context3.prev = 12;
          _context3.next = 15;
          return admin.auth().getUserByPhoneNumber("+58".concat(phone));
        case 15:
          userByPhone = _context3.sent;
          if (!userByPhone) {
            _context3.next = 18;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "Ya existe un usuario con este número de teléfono."
          }));
        case 18:
          _context3.next = 22;
          break;
        case 20:
          _context3.prev = 20;
          _context3.t1 = _context3["catch"](12);
        case 22:
          _context3.next = 24;
          return admin.auth().createUser({
            email: email,
            password: password,
            phoneNumber: "+58".concat(phone),
            displayName: Nombre,
            disabled: false
          });
        case 24:
          userRecord = _context3.sent;
          // Obtener el UID generado por Firebase Authentication
          uid = userRecord.uid; // Crear el objeto que se guardará en la colección "Usuarios"
          infoUserCreated = {
            uid: uid,
            nombre: Nombre,
            rif: rif,
            phone: phone,
            typeUser: "Taller",
            email: email,
            status: "Pendiente"
          }; // Guardar el objeto en la colección "Usuarios"
          _context3.next = 29;
          return db.collection("Usuarios").doc(uid).set(infoUserCreated);
        case 29:
          // Responder con el ID del documento creado y un mensaje de éxito
          res.status(201).send({
            message: "Usuario creado con éxito",
            uid: uid
          });
          _context3.next = 52;
          break;
        case 32:
          _context3.prev = 32;
          _context3.t2 = _context3["catch"](0);
          if (!(_context3.t2.code === "auth/email-already-exists")) {
            _context3.next = 38;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "Este email ya está registrado."
          }));
        case 38:
          if (!(_context3.t2.code === "auth/phone-number-already-exists")) {
            _context3.next = 42;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "Este número de teléfono ya está registrado."
          }));
        case 42:
          if (!(_context3.t2.code === "auth/invalid-phone-number")) {
            _context3.next = 46;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "El número de teléfono no es válido."
          }));
        case 46:
          if (!(_context3.t2.code === "auth/invalid-password")) {
            _context3.next = 50;
            break;
          }
          return _context3.abrupt("return", res.status(400).send({
            message: "La contraseña es inválida."
          }));
        case 50:
          console.error("Error al guardar el usuario:", _context3.t2);
          res.status(500).send({
            message: "Error al guardar el usuario",
            error: _context3.t2.message
          });
        case 52:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 32], [2, 10], [12, 20]]);
  }));
  return function SaveTaller(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var authenticateUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var email, result, resultAdmin, adminData, userData;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          email = req.body.email;
          console.log(email);
          console.log(req.body);

          // Buscar en la colección "Usuarios" por email
          _context4.next = 6;
          return db.collection("Usuarios").where("email", "==", email).get();
        case 6:
          result = _context4.sent;
          if (!result.empty) {
            _context4.next = 20;
            break;
          }
          console.log("No se encontró el usuario en la colección Usuarios");

          // Buscar en la colección "Admins" si no se encuentra en "Usuarios"
          _context4.next = 11;
          return db.collection("Admins").where("email", "==", email).get();
        case 11:
          resultAdmin = _context4.sent;
          if (!resultAdmin.empty) {
            _context4.next = 16;
            break;
          }
          return _context4.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado ni en Usuarios ni en Admins"
          }));
        case 16:
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
        case 18:
          _context4.next = 22;
          break;
        case 20:
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
        case 22:
          _context4.next = 32;
          break;
        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](0);
          if (!(_context4.t0.code === "auth/user-not-found")) {
            _context4.next = 30;
            break;
          }
          return _context4.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado en Firebase Authentication"
          }));
        case 30:
          console.error("Error al autenticar al usuario:", _context4.t0);
          return _context4.abrupt("return", res.status(500).send({
            message: "Error al autenticar al usuario",
            error: _context4.t0.message // Incluir detalles para depuración
          }));
        case 32:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 24]]);
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
var SaveTallerAll = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var uid, result;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          uid = req.body.uid; // Verificar que el UID no esté vacío
          if (uid) {
            _context6.next = 4;
            break;
          }
          return _context6.abrupt("return", res.status(400).send({
            message: "El UID es obligatorio."
          }));
        case 4:
          _context6.next = 6;
          return db.collection("Usuarios").doc(uid).set(req.body);
        case 6:
          result = _context6.sent;
          if (result) {
            _context6.next = 9;
            break;
          }
          return _context6.abrupt("return", res.status(500).send({
            message: "Error al guardar el usuario en Firestore."
          }));
        case 9:
          // Responder con el ID del documento creado y un mensaje de éxito
          res.status(201).send({
            message: "Usuario actualizado con éxito",
            uid: uid
          });
          _context6.next = 22;
          break;
        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.error("Error al guardar el usuario:", _context6.t0);

          // Manejar errores específicos
          if (!(_context6.t0.code === "permission-denied")) {
            _context6.next = 19;
            break;
          }
          return _context6.abrupt("return", res.status(403).send({
            message: "Permisos insuficientes para guardar el usuario."
          }));
        case 19:
          if (!(_context6.t0.code === "not-found")) {
            _context6.next = 21;
            break;
          }
          return _context6.abrupt("return", res.status(404).send({
            message: "Usuario no encontrado."
          }));
        case 21:
          // Error general
          res.status(500).send({
            message: "Error al guardar el usuario",
            error: _context6.t0.message
          });
        case 22:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 12]]);
  }));
  return function SaveTallerAll(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var restorePass = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var email;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          // Recibir el email del cuerpo de la solicitud
          email = req.body.email; // Generar el enlace de restablecimiento de contraseña
          _context7.next = 3;
          return admin.auth().generatePasswordResetLink(email).then(function (link) {
            return sendResetPasswordEmail(email, link, req);
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
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function restorePass(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
var sendResetPasswordEmail = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(email, resetLink, req) {
    var transporter, mailOptions;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
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
          _context8.prev = 2;
          _context8.next = 5;
          return transporter.sendMail(mailOptions);
        case 5:
          res.status(200).send({
            message: "Correo de restablecimiento enviado."
          });
          _context8.next = 11;
          break;
        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](2);
          console.error("Error al enviar el correo:", _context8.t0);
        case 11:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[2, 8]]);
  }));
  return function sendResetPasswordEmail(_x15, _x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}();
var getTalleres = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var result, usuarios;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return db.collection("Usuarios").where("typeUser", "==", "Taller") // Filtrar documentos por typeUser
          .get();
        case 3:
          result = _context9.sent;
          if (!result.empty) {
            _context9.next = 6;
            break;
          }
          return _context9.abrupt("return", res.status(404).send('No se encontraron usuarios con el tipo "Taller"'));
        case 6:
          usuarios = result.docs.map(function (doc) {
            return doc.data();
          });
          res.send(usuarios);
          _context9.next = 14;
          break;
        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.error("Error al obtener usuarios:", _context9.t0);
          res.status(500).send("Error al obtener usuarios");
        case 14:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 10]]);
  }));
  return function getTalleres(_x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}();
var actualizarStatusUsuario = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var _req$body3, uid, nuevoStatus;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          // Obtener el UID y el nuevo estado desde el cuerpo de la solicitud
          _req$body3 = req.body, uid = _req$body3.uid, nuevoStatus = _req$body3.nuevoStatus; // Verificar que se haya proporcionado un UID y un nuevo estado
          if (!(!uid || !nuevoStatus)) {
            _context10.next = 4;
            break;
          }
          return _context10.abrupt("return", res.status(400).send({
            message: "El UID y el nuevo estado son requeridos"
          }));
        case 4:
          _context10.next = 6;
          return db.collection("Usuarios").doc(uid).update({
            status: nuevoStatus
          });
        case 6:
          return _context10.abrupt("return", res.status(200).send({
            message: "El estado del usuario ha sido actualizado exitosamente"
          }));
        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.error("Error al actualizar el estado del usuario:", _context10.t0);
          return _context10.abrupt("return", res.status(500).send({
            message: "Error al actualizar el estado del usuario",
            error: _context10.t0.message // Incluir detalles para depuración
          }));
        case 13:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 9]]);
  }));
  return function actualizarStatusUsuario(_x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}();
var UpdateTaller = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var _req$body4, uid, nombre, rif, phone, email, Direccion, RegComercial, Caracteristicas, Tarifa, Experiencia, LinkFacebook, LinkInstagram, LinkTiktok, Garantia, seguro, agenteAutorizado, updatedUserInfo;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _req$body4 = req.body, uid = _req$body4.uid, nombre = _req$body4.nombre, rif = _req$body4.rif, phone = _req$body4.phone, email = _req$body4.email, Direccion = _req$body4.Direccion, RegComercial = _req$body4.RegComercial, Caracteristicas = _req$body4.Caracteristicas, Tarifa = _req$body4.Tarifa, Experiencia = _req$body4.Experiencia, LinkFacebook = _req$body4.LinkFacebook, LinkInstagram = _req$body4.LinkInstagram, LinkTiktok = _req$body4.LinkTiktok, Garantia = _req$body4.Garantia, seguro = _req$body4.seguro, agenteAutorizado = _req$body4.agenteAutorizado; // Crear el objeto con los datos que se actualizarán en la colección "Usuarios"
          updatedUserInfo = {
            uid: uid,
            nombre: nombre == undefined ? '' : nombre,
            rif: rif == undefined ? '' : rif,
            phone: phone == undefined ? '' : phone,
            typeUser: 'Taller',
            email: email == undefined ? '' : email,
            Direccion: Direccion == undefined ? '' : Direccion,
            RegComercial: RegComercial == undefined ? '' : RegComercial,
            Caracteristicas: Caracteristicas == undefined ? '' : Caracteristicas,
            Tarifa: Tarifa == undefined ? '' : Tarifa,
            Experiencia: Experiencia == undefined ? '' : Experiencia,
            LinkFacebook: LinkFacebook == undefined ? '' : LinkFacebook,
            LinkInstagram: LinkInstagram == undefined ? '' : LinkInstagram,
            LinkTiktok: LinkTiktok == undefined ? '' : LinkTiktok,
            Garantia: Garantia == undefined ? '' : Garantia,
            seguro: seguro == undefined ? '' : seguro,
            agenteAutorizado: agenteAutorizado == undefined ? false : agenteAutorizado
          }; // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
          _context11.next = 5;
          return db.collection("Usuarios").doc(uid).update(updatedUserInfo);
        case 5:
          // Responder con un mensaje de éxito
          res.status(200).send({
            message: "Usuario actualizado con éxito",
            uid: uid
          });
          _context11.next = 12;
          break;
        case 8:
          _context11.prev = 8;
          _context11.t0 = _context11["catch"](0);
          console.error("Error al actualizar el usuario:", _context11.t0);

          // En caso de error, responder con el mensaje correspondiente
          res.status(500).send({
            message: "Error al actualizar el usuario",
            error: _context11.t0.message
          });
        case 12:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 8]]);
  }));
  return function UpdateTaller(_x22, _x23) {
    return _ref11.apply(this, arguments);
  };
}();
var UpdateClient = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var _req$body5, uid, Nombre, cedula, phone, email, updatedUserInfo;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          // Recibir los datos del cliente desde el cuerpo de la solicitud
          _req$body5 = req.body, uid = _req$body5.uid, Nombre = _req$body5.Nombre, cedula = _req$body5.cedula, phone = _req$body5.phone, email = _req$body5.email; // Crear el objeto que se actualizará en la colección "Usuarios"
          updatedUserInfo = {
            nombre: Nombre,
            cedula: cedula,
            phone: phone,
            typeUser: "Cliente",
            email: email,
            uid: uid
          }; // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
          _context12.next = 5;
          return db.collection("Usuarios").doc(uid).update(updatedUserInfo);
        case 5:
          // Responder con un mensaje de éxito
          res.status(200).send({
            message: "Usuario actualizado con éxito",
            uid: uid
          });
          _context12.next = 12;
          break;
        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          console.error("Error al actualizar el usuario:", _context12.t0);

          // Manejar posibles errores en la actualización del documento
          res.status(500).send("Error al actualizar el usuario");
        case 12:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 8]]);
  }));
  return function UpdateClient(_x24, _x25) {
    return _ref12.apply(this, arguments);
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
  UpdateTaller: UpdateTaller
};