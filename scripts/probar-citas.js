// Prueba de la lógica de citas con un Firestore en memoria (no toca la base real).
// Uso: node scripts/probar-citas.js
const path=require('path');const root=path.join(__dirname,'../src/');
// ── Firestore en memoria ──
const store={Usuarios:{},Citas:{}}; let seq=0; const pushes=[];
class TS{constructor(ms){this.ms=ms} toDate(){return new Date(this.ms)} toMillis(){return this.ms}
  static fromDate(d){return new TS(d.getTime())} static fromMillis(m){return new TS(m)}}
const cmpVal=v=>v instanceof TS?v.ms:v;
function query(col,filters=[]){return{
  where(f,op,v){return query(col,[...filters,[f,op,v]])},
  async get(){const docs=Object.entries(store[col]).filter(([id,d])=>filters.every(([f,op,v])=>{const a=cmpVal(d[f]),b=cmpVal(v);return op==='=='?a===b:op==='>='?a>=b:op==='<='?a<=b:false}))
    .map(([id,d])=>({id,data:()=>d,ref:docRef(col,id)}));return{docs,empty:!docs.length}}}}
function docRef(col,id){return{id,async get(){const d=store[col][id];return{id,exists:!!d,data:()=>d,ref:docRef(col,id)}},
  async update(ch){const d=store[col][id];for(const[k,v]of Object.entries(ch)){if(v&&v.__union)d[k]=[...(d[k]||[]),...v.__union];else if(v&&v.__ts)d[k]=new TS(Date.now());else d[k]=v}}}}
const db={collection:c=>({...query(c),doc:id=>docRef(c,id),async add(d){const id='c'+(++seq);const x={...d};for(const k in x)if(x[k]&&x[k].__ts)x[k]=new TS(Date.now());store[c][id]=x;return docRef(c,id)}})};
const adminMock={firestore:Object.assign(()=>{},{Timestamp:TS,FieldValue:{serverTimestamp:()=>({__ts:1}),arrayUnion:(...a)=>({__union:a})}}),
  messaging:()=>({send:async m=>{pushes.push(m)}}),auth:()=>({})};
const put=(p,e)=>{const r=require.resolve(p);require.cache[r]={id:r,filename:r,loaded:true,exports:e}};
put(root+'firebase.js',{db,admin:adminMock}); 
const Module=require('module');const origLoad=Module._load;Module._load=function(r,...a){if(r==='firebase-admin')return adminMock;return origLoad.call(this,r,...a)};
process.env.AUTH_MODE='report';
const C=require(root+'services/citas.services.js'); const I=C._internas;
// ── datos ──
const lv={enabled:true,open:'08:00',close:'17:00'};
store.Usuarios.T1={typeUser:'Taller',nombre:'Taller Los Hermanos',token:'tokT',cupo_por_hora:2,horarios_atencion:{lunes:lv,martes:lv,miercoles:lv,jueves:lv,viernes:lv,sabado:{enabled:true,open:'08:00',close:'12:00'},domingo:{enabled:false}}};
store.Usuarios.U1={typeUser:'Cliente',nombre:'Andrés',token:'tokU1'}; store.Usuarios.U2={typeUser:'Cliente',nombre:'María',token:'tokU2'}; store.Usuarios.U3={typeUser:'Cliente',nombre:'José'};
const call=async(fn,body,sesion)=>{let st=200,js;const res={status(c){st=c;return this},json(j){js=j;return this}};await fn({body,sesion},res);return{st,js}};
let ok=0,fail=0;const t=(n,c)=>{c?ok++:fail++;console.log((c?'✓':'✗')+' '+n)};
(async()=>{
 t('09:00 Caracas = 13:00 UTC', I.inicioUTC('2026-10-01','09:00').toISOString()==='2026-10-01T13:00:00.000Z');
 t('Horas lunes 8-17 → 08:00…16:00 (9)', I.horasDelDia(store.Usuarios.T1,'2026-10-05').join(',')==='08:00,09:00,10:00,11:00,12:00,13:00,14:00,15:00,16:00');
 t('Sábado 8-12 → 4 horas', I.horasDelDia(store.Usuarios.T1,'2026-10-03').length===4);
 t('Domingo cerrado', I.horasDelDia(store.Usuarios.T1,'2026-10-04').length===0);
 t('hora12', I.hora12('17:00')==='5:00 p. m.' && I.hora12('12:00')==='12:00 p. m.' && I.hora12('08:00')==='8:00 a. m.');
 const d=await call(C.disponibilidad,{uid_taller:'T1'}); t('Disponibilidad 14 días', d.st===200&&d.js.dias.length===14);
 t('Domingos sin horas', d.js.dias.filter(x=>I.diaSemana(x.fecha)==='domingo').every(x=>!x.abierto));
 const F='2026-10-06', H='10:00'; // martes futuro
 const c1=await call(C.crear,{uid_usuario:'U1',uid_taller:'T1',nombre_servicio:'Cambio de aceite',fecha:F,hora:H,vehiculo:{vehiculo_marca:'Toyota',vehiculo_placa:'ab123cd'}});
 t('Crear cita → 201 pendiente', c1.st===201&&c1.js.estado==='pendiente');
 t('Push al taller "Nueva cita"', pushes.some(p=>p.token==='tokT'&&p.data.secretCode==='CitaNueva'));
 t('Placa en mayúsculas', c1.js.vehiculo.placa==='AB123CD');
 const c2=await call(C.crear,{uid_usuario:'U2',uid_taller:'T1',fecha:F,hora:H}); t('2º auto misma hora (cupo 2) → 201', c2.st===201);
 const c3=await call(C.crear,{uid_usuario:'U3',uid_taller:'T1',fecha:F,hora:H}); t('3º auto misma hora → 409 OCUPADO', c3.st===409&&c3.js.codigo==='OCUPADO');
 const dup=await call(C.crear,{uid_usuario:'U1',uid_taller:'T1',fecha:F,hora:'11:00'}); t('Mismo conductor, mismo taller y día → 409 DUPLICADA', dup.st===409&&dup.js.codigo==='DUPLICADA');
 const fh=await call(C.crear,{uid_usuario:'U3',uid_taller:'T1',fecha:F,hora:'18:00'}); t('Fuera de horario → 409', fh.st===409&&fh.js.codigo==='FUERA_DE_HORARIO');
 const dom=await call(C.crear,{uid_usuario:'U3',uid_taller:'T1',fecha:'2026-10-04',hora:'10:00'}); t('Domingo → 409', dom.st===409);
 const disp=await call(C.disponibilidad,{uid_taller:'T1',fecha:F}); t('10:00 ya no aparece libre', disp.js.dias[0].horas.find(h=>h.hora===H).libre===false);
 const id=c1.js.id;
 const x1=await call(C.actualizar,{id,accion:'confirmar',uid:'U1'}); t('Conductor no puede confirmar → 400', x1.st===400);
 const x2=await call(C.actualizar,{id,accion:'confirmar',uid:'U3'}); t('Ajeno → 403', x2.st===403);
 const x3=await call(C.actualizar,{id,accion:'completar',uid:'T1'}); t('Completar sin confirmar → 409', x3.st===409);
 pushes.length=0;
 const x4=await call(C.actualizar,{id,accion:'confirmar',uid:'T1'}); t('Taller confirma → confirmada', x4.st===200&&x4.js.estado==='confirmada');
 t('Push al conductor "Cita confirmada"', pushes.some(p=>p.token==='tokU1'&&p.data.secretCode==='CitaConfirmada'));
 const x5=await call(C.actualizar,{id,accion:'reprogramar',fecha:F,hora:'14:00',uid:'U1'}); t('Conductor reprograma → vuelve a pendiente', x5.st===200&&x5.js.estado==='pendiente'&&store.Citas[id].hora==='14:00');
 t('Historial guarda 3 cambios', store.Citas[id].historial.length===3);
 const x6=await call(C.actualizar,{id,accion:'reprogramar',fecha:F,hora:'10:00',uid:'U1'});
 // 10:00 tiene U2 activa (1/2) → libre para mover
 t('Reprogramar a hora con cupo → 200', x6.st===200);
 const sesionEnforce=await call(C.crear,{uid_usuario:'U3',uid_taller:'T1',fecha:F,hora:'15:00'},{uid:'U3',rol:'Cliente'}); t('Con sesión usa el uid verificado', sesionEnforce.st===201&&store.Citas[sesionEnforce.js.id].uid_usuario==='U3');
 // recordatorio
 const r=store.Citas[id]; r.estado='confirmada'; r.inicio=TS.fromMillis(Date.now()+24*3600*1000); r.recordatorio_24h=false; pushes.length=0;
 await C.jobRecordatorios24h(); t('Recordatorio 24 h a conductor y taller', pushes.filter(p=>p.data.secretCode.startsWith('CitaRecordatorio')).length===2&&r.recordatorio_24h===true);
 pushes.length=0; await C.jobRecordatorios24h(); t('No se repite el recordatorio', pushes.length===0);
 const x7=await call(C.actualizar,{id,accion:'cancelar',uid:'U1',motivo:'Viaje'}); t('Conductor cancela → cancelada', x7.js.estado==='cancelada');
 const x8=await call(C.actualizar,{id,accion:'cancelar',uid:'U1'}); t('Cancelar dos veces → 409', x8.st===409);
 const mis=await call(C.misCitas,{uid_usuario:'U1'}); t('misCitas del conductor', mis.st===200&&mis.js.citas.length===1);
 const ag=await call(C.agendaTaller,{uid_taller:'T1'}); t('Agenda del taller (3 citas)', ag.js.citas.length===3);
 console.log(`\n${ok} bien, ${fail} mal`); process.exit(fail?1:0);
})();
