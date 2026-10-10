// 第四季獎勵試算（依公文；不明確處排除並註明請見原文）
(function(root){
const best=(v,t)=>{let r=0;t.forEach(([th,a])=>{if(v>=th-1e-9)r=a});return r};
const MON=['10月','11月','12月'],END125=['115/11/27','115/12/28','116/1/28'];
// group: xx 新新人 / xr 新人 / gr 個人組; reg:'114'|'115'; t0: 10月(第10工作月)為報聘第幾個月; fyc:[萬,萬,萬]; fyp:萬(不含投資型)
function q4calc({group,reg,t0,fyc,fyp}){
 const items=[],notes=[],S=fyc.reduce((a,b)=>a+b,0),add=(n,a,d)=>{if(a>0)items.push([n,a,d])};
 // ---- 125 月獎金（新人組）
 if(group!=='gr')fyc.forEach((v,i)=>add(`125 新人組月獎金（${MON[i]}，FYC ${v}萬）`,best(v,group==='xx'?[[2,3000],[3,4000]]:[[3,3000],[4,4000]]),'結案 '+END125[i]));
 // ---- 125 季達標
 let qa=0;
 if(group==='gr')qa=(fyc.every(v=>v>=5)||S>=18)?25000:0;
 else qa=best(S,group==='xx'?[[8,3000],[11,6000],[14,12000]]:[[11,6000],[14,12000]]);
 add(`125 季達標獎金（季累計 ${S}萬）`,qa,'結案 116/1/28');
 if(group!=='gr'&&S>=18)add('125 新人組季累計≧18萬 額外加發',1000,'結案 116/1/28');
 // ---- 125 超標（競賽FYC；假設＝個人險FYC，無團險/加碼）
 if(qa>0){
  if(group!=='gr'&&S>=20)add('125 超標獎勵 新人組 競賽FYC≧20萬',10000,'結案 116/1/28');
  if(S>=25)add(group==='gr'?'125 超標獎勵 個人組 競賽FYC≧25萬':'125 超標獎勵 新人組 ≧25萬加發',10000,'結案 116/1/28');
  if(S>=35)add(`125 超標 25萬後每增10萬加發（${Math.floor((S-25)/10)}次）`,Math.floor((S-25)/10+1e-9)*15000,'結案 116/1/28');
 }
 if(S>=50)notes.push('競賽FYC≧50萬：高標獎勵需「個人險FYC成長率」(對114年基期)，本試算未計，請見原文第125號。');
 // ---- 128 FYP
 if(fyp>0){
  const per=best(fyp,[[100,1000],[200,3000],[500,5000],[1000,7000]]);
  add(`128 FYP獎勵（累計FYP ${fyp}萬，每達百萬 ${per.toLocaleString()}元）`,Math.min(500000,Math.floor(fyp/100+1e-9)*per),'結案 116/1/28');
  add('128 高FYP加碼',best(fyp,[[400,5000],[800,13000]]),'結案 116/1/28');
  if(fyp>=150)notes.push('128 FYP成長加碼（≧150萬且≧第三季累計FYP，3,000元）需第三季FYP，未計入。');
 }
 // ---- 新人績效獎勵（月月/季）
 if(group!=='gr'){
  const ts=[t0,t0+1,t0+2],mo=[];
  ts.forEach((t,i)=>{let a=0;
   if(reg==='114')a=t<=12?best(fyc[i],[[2,10000],[3,15000],[4,18000]]):t<=24?best(fyc[i],[[3,6000],[4,10000]]):0;
   else a=t<=24?(fyc[i]>=(t<=6?1.5:t<=12?2:3)-1e-9?10000:0):0;
   mo.push(a);add(`${reg}年新人月月獎金（${MON[i]}＝報聘第${t}個月）`,a,'依公司核發（請見原文）')});
  const aligned=t0%3===1&&t0+2<=24;
  if(aligned){
   if(reg==='114'){const tb=t0<=12?[[7.5,30000],[10.5,45000],[13.5,54000]]:[[10.5,18000],[13.5,30000]];
    add(`114年新人季通算獎金（第${t0}–${t0+2}個月，補發差額）`,Math.max(0,best(S,tb)-mo.reduce((a,b)=>a+b,0)),'依公司核發（請見原文）')}
   else add(`115年新人績效獎金（季，第${t0}–${t0+2}個月）`,S>=(t0<=6?6:t0<=12?7.5:9)-1e-9?10000:0,'依公司核發（請見原文）');
  }else notes.push(`第10–12工作月為報聘第${t0}–${t0+2}個月，未對齊報聘季（第1–3、4–6…個月），新人季獎金跨季計算，本試算未計，請見原文。`);
  if(ts.some(t=>t>24))notes.push('報聘超過24個月之月份已無新人績效獎勵。');
 }
 const total=items.reduce((a,b)=>a+b[1],0);return {items,total,notes};
}
root.q4calc=q4calc;if(typeof module!=='undefined')module.exports=q4calc;
})(typeof window!=='undefined'?window:globalThis);
