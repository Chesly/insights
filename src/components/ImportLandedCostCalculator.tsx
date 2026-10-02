"use client";
import { useMemo, useState } from "react";
import { printReport, shareReport, type PdfReport } from "@/lib/client-report";

function R(v:number){return new Intl.NumberFormat("en-ZA",{style:"currency",currency:"ZAR",maximumFractionDigits:2}).format(isFinite(v)?v:0)}
function inputCls(){return "w-full rounded-sm border border-gold/25 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-gold dark:border-gold/30 dark:bg-navy dark:text-white"}
function sel(e:React.FocusEvent<HTMLInputElement>){e.target.select()}

export default function ImportLandedCostCalculator(){
 const [unitForeign,setUnitForeign]=useState(5),[moq,setMoq]=useState(500),[qty,setQty]=useState(500),[fx,setFx]=useState(17.5);
 const [freight,setFreight]=useState(0),[insurance,setInsurance]=useState(0),[dutyRate,setDutyRate]=useState(0),[otherDuty,setOtherDuty]=useState(0);
 const [shippingMode,setShippingMode]=useState<"courier"|"air"|"sea">("courier"),[weightKg,setWeightKg]=useState(0),[lengthCm,setLengthCm]=useState(0),[widthCm,setWidthCm]=useState(0),[heightCm,setHeightCm]=useState(0),[packages,setPackages]=useState(1);
 const [clearing,setClearing]=useState(0),[local,setLocal]=useState(0),[other,setOther]=useState(0),[sell,setSell]=useState(0);
 const outsideSacu=true;
 const result=useMemo(()=>{
  const orderQty=Math.max(0,qty), minSpend=unitForeign*Math.max(0,moq), goodsForeign=unitForeign*orderQty, goods=goodsForeign*fx;
  const customsValue=goods; const duty=customsValue*(dutyRate/100); const uplift=outsideSacu?customsValue*.10:0;
  const importVat=(customsValue+uplift+duty+otherDuty)*.15;
  const landed=goods+freight+insurance+duty+otherDuty+importVat+clearing+local+other;
  const per=orderQty?landed/orderQty:0, revenue=sell*orderQty, profit=revenue-landed, margin=revenue?profit/revenue*100:0;
  const suggested30=per/(1-.30), breakEven=per;
  return {orderQty,minSpend,goodsForeign,goods,customsValue,duty,uplift,importVat,landed,per,revenue,profit,margin,suggested30,breakEven};
 },[unitForeign,moq,qty,fx,freight,insurance,dutyRate,otherDuty,clearing,local,other,sell]);
 const below=qty<moq;
 const volumeM3=(lengthCm*widthCm*heightCm*Math.max(1,packages))/1000000;
 const volumetricKg=(lengthCm*widthCm*heightCm*Math.max(1,packages))/5000;
 const chargeableKg=Math.max(weightKg,volumetricKg);
 function report():PdfReport{return{title:"Import Landed Cost & Profit Calculation",subtitle:"South Africa",summary:[`Total landed cost: ${R(result.landed)}`,`Landed cost per unit: ${R(result.per)}`,`Estimated gross profit: ${R(result.profit)} (${result.margin.toFixed(1)}%)`],sections:[
  {heading:"Supplier order",rows:[["Supplier currency","US dollar (USD)"],["Unit price (USD)","$"+unitForeign.toFixed(2)],["MOQ",String(moq)],["Order quantity",String(qty)],["USD/ZAR rate used","R"+fx.toFixed(4)+" per $1"],["Goods value",R(result.goods)]]},
  {heading:"Shipping",rows:[["Mode",shippingMode==="sea"?"Sea freight":shippingMode==="air"?"Air freight":"Courier / express"],["Actual weight",weightKg.toFixed(2)+" kg"],["Shipment volume",volumeM3.toFixed(3)+" m³"],["Indicative volumetric weight",volumetricKg.toFixed(2)+" kg"],["Indicative chargeable weight",chargeableKg.toFixed(2)+" kg"],["Freight quote used",R(freight)]]},
  {heading:"Import costs",rows:[["Freight",R(freight)],["Insurance",R(insurance)],["Customs value used",R(result.customsValue)],["Customs duty",R(result.duty)],["Other import duties/levies",R(otherDuty)],["Import VAT",R(result.importVat)],["Clearing/handling",R(clearing)],["Local delivery",R(local)],["Other costs",R(other)]]},
  {heading:"Commercial result",rows:[["Total landed cost",R(result.landed)],["Landed cost per unit",R(result.per)],["Selling price per unit",R(sell)],["Revenue",R(result.revenue)],["Gross profit before operating costs",R(result.profit)],["Gross margin",result.margin.toFixed(1)+"%"],["Price for 30% gross margin",R(result.suggested30)]]}
 ],footer:"Estimate only. Customs classification, valuation, origin, duties, rebates and VAT treatment can change the actual amount payable. Confirm the tariff code and clearing figures before ordering."}}
 async function share(){await shareReport(report(),"sa-import-landed-cost.pdf",`Import estimate: ${R(result.landed)} landed total, ${R(result.per)} per unit, ${result.margin.toFixed(1)}% gross margin at my selling price.`,"https://insights.chesly.tech/calculators/import-landed-cost-profit");}
 return <div className="space-y-8">
  <section><h2 className="text-lg font-bold text-navy dark:text-white">1. Supplier order & MOQ</h2><p className="mt-1 text-sm text-navy/60 dark:text-white/50">MOQ means Minimum Order Quantity — the smallest quantity the supplier will accept.</p><div className="mt-4 grid gap-4 sm:grid-cols-2">
   <label className="text-xs font-semibold">Unit price (US dollars)<input type="number" className={inputCls()} value={unitForeign} onChange={e=>setUnitForeign(+e.target.value||0)} onFocus={sel}/></label>
   <label className="text-xs font-semibold">MOQ (minimum units)<input type="number" className={inputCls()} value={moq} onChange={e=>setMoq(+e.target.value||0)} onFocus={sel}/></label>
   <label className="text-xs font-semibold">Quantity you plan to order<input type="number" className={inputCls()} value={qty} onChange={e=>setQty(+e.target.value||0)} onFocus={sel}/></label>
   <label className="text-xs font-semibold">USD exchange rate (R for $1)<input type="number" step=".01" className={inputCls()} value={fx} onChange={e=>setFx(+e.target.value||0)} onFocus={sel}/></label>
  </div>{below&&<p className="mt-3 border-l-4 border-red-700 bg-red-50 p-3 text-sm dark:bg-red-950/20">Your planned quantity is below the supplier MOQ by <b>{moq-qty} units</b>. At ${unitForeign.toFixed(2)} each, the supplier's minimum goods spend is {unitForeign*moq} in US dollars.</p>}
  <div className="mt-4 grid gap-3 sm:grid-cols-3"><Box l="Minimum goods spend" v={"$"+(unitForeign*moq).toFixed(2)}/><Box l="Your goods value" v={R(result.goods)}/><Box l="Units" v={String(qty)}/></div></section>
  <section><h2 className="text-lg font-bold text-navy dark:text-white">2. How will the goods get to South Africa?</h2><p className="mt-1 text-sm text-navy/60 dark:text-white/50">Choose a shipping method and enter the shipment details you know. The calculator does not invent a freight rate — use an actual supplier, courier or forwarder quote for the cost field below.</p>
  <div className="mt-4 grid grid-cols-3 gap-2 print:hidden">{(["courier","air","sea"] as const).map(m=><button key={m} type="button" onClick={()=>setShippingMode(m)} className={`border px-3 py-3 text-xs font-bold uppercase ${shippingMode===m?"border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy":"border-navy/15 text-navy dark:border-white/15 dark:text-white"}`}>{m==="courier"?"Courier / Express":m==="air"?"Air Freight":"Sea Freight"}</button>)}</div>
  <div className="mt-4 grid gap-4 sm:grid-cols-2"><N l="Actual shipment weight (kg)" v={weightKg} s={setWeightKg}/><N l="Number of packages / cartons" v={packages} s={setPackages}/><N l="Length per package (cm)" v={lengthCm} s={setLengthCm}/><N l="Width per package (cm)" v={widthCm} s={setWidthCm}/><N l="Height per package (cm)" v={heightCm} s={setHeightCm}/><N l="Freight quote (R)" v={freight} s={setFreight}/></div>
  <div className="mt-4 grid gap-3 sm:grid-cols-3"><Box l="Shipment volume" v={volumeM3.toFixed(3)+" m³"}/><Box l="Indicative volumetric weight" v={volumetricKg.toFixed(1)+" kg"}/><Box l="Indicative chargeable weight" v={chargeableKg.toFixed(1)+" kg"}/></div>
  <p className="mt-2 text-xs text-navy/50 dark:text-white/40">{shippingMode==="sea"?"Sea freight is often quoted using volume/container rules rather than this courier-style volumetric weight. Use your forwarder's actual quote.":"Carriers use their own volumetric divisors and minimum charges. The volumetric figure above is a planning indicator only; use the carrier's quoted chargeable weight and price."}</p>
  </section>
  <section><h2 className="text-lg font-bold text-navy dark:text-white">3. Customs & landing costs</h2><p className="mt-1 text-sm text-navy/60 dark:text-white/50">Enter figures from your clearing agent or tariff research where available. Customs duty depends on the correct tariff/HS classification.</p><div className="mt-4 grid gap-4 sm:grid-cols-2">
   <N l="Insurance (R) — optional" v={insurance} s={setInsurance}/><N l="Customs duty rate (%)" v={dutyRate} s={setDutyRate}/><N l="Other duties / levies (R) — optional" v={otherDuty} s={setOtherDuty}/><N l="Clearing / handling (R)" v={clearing} s={setClearing}/><N l="Local delivery (R) — optional" v={local} s={setLocal}/><N l="Other costs (R) — optional" v={other} s={setOther}/>
  </div><div className="mt-5 overflow-x-auto"><table className="w-full text-sm"><tbody>
   <Row l="Goods value in rand" v={R(result.goods)}/><Row l={`Customs duty (${dutyRate}%)`} v={R(result.duty)}/><Row l="Import VAT (15%)" v={R(result.importVat)}/><Row l="Freight + insurance" v={R(freight+insurance)}/><Row l="Clearing + local + other" v={R(clearing+local+other)}/><Row l="TOTAL LANDED COST" v={R(result.landed)} strong/><Row l="LANDED COST PER UNIT" v={R(result.per)} strong/>
  </tbody></table></div></section>
  <section><h2 className="text-lg font-bold text-navy dark:text-white">4. Will the product actually make money?</h2><div className="mt-4 max-w-sm"><N l="Planned selling price per unit (R)" v={sell} s={setSell}/></div><div className="mt-5 grid gap-3 sm:grid-cols-4"><Box l="Landed cost / unit" v={R(result.per)}/><Box l="Gross profit" v={R(result.profit)}/><Box l="Gross margin" v={result.margin.toFixed(1)+"%"}/><Box l="Price for 30% margin" v={R(result.suggested30)}/></div>
  {sell>0&&result.profit<0&&<p className="mt-3 border-l-4 border-red-700 bg-red-50 p-3 text-sm dark:bg-red-950/20">At this selling price you lose about <b>{R(Math.abs(result.profit))}</b> before normal business overheads, returns, marketing or marketplace fees.</p>}{sell>0&&result.profit>=0&&<p className="mt-3 border-l-4 border-green-700 bg-green-50 p-3 text-sm dark:bg-green-950/20">At this price the order leaves about <b>{R(result.profit)}</b> gross profit, or <b>{result.margin.toFixed(1)}%</b>, before normal business overheads, returns, marketing or marketplace fees.</p>}
  <div className="mt-5 flex gap-2 print:hidden"><button onClick={()=>{if(!printReport(report()))window.print()}} className="bg-gold px-4 py-2 text-xs font-bold uppercase text-white">Save / print report</button><button onClick={share} className="border border-green-700 px-4 py-2 text-xs font-bold uppercase text-green-700">Share result</button></div></section>
  <p className="text-xs leading-relaxed text-navy/50 dark:text-white/40">Important: this is a planning estimate, not a customs assessment. Confirm the correct tariff classification, origin, customs value, duty rate, rebates and clearing charges before placing an order.</p>
 </div>
}
function N({l,v,s}:{l:string;v:number;s:(n:number)=>void}){return <label className="text-xs font-semibold">{l}<input type="number" min="0" step=".01" className={inputCls()} value={v} onChange={e=>s(+e.target.value||0)} onFocus={sel}/></label>}
function Box({l,v}:{l:string;v:string}){return <div className="border border-navy/10 p-4 dark:border-white/10"><div className="text-xs uppercase text-navy/50 dark:text-white/40">{l}</div><div className="mt-1 font-mono text-lg font-extrabold text-navy dark:text-white">{v}</div></div>}
function Row({l,v,strong}:{l:string;v:string;strong?:boolean}){return <tr className={"border-b border-navy/10 dark:border-white/10 "+(strong?"bg-navy/5 font-bold dark:bg-white/5":"")}><td className="p-2">{l}</td><td className="p-2 text-right">{v}</td></tr>}
