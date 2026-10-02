export interface PdfSection { heading:string; rows:[string,string][] }
export interface PdfReport { title:string; subtitle?:string; summary:string[]; sections:PdfSection[]; footer?:string }

function esc(s:string){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]!));}

export function reportHtml(r:PdfReport){
 const sections=r.sections.map(s=>`<section><h2>${esc(s.heading)}</h2><table>${s.rows.map(([a,b])=>`<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</table></section>`).join("");
 return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(r.title)}</title><style>@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#132238;font-size:11px;line-height:1.45}header{border-bottom:3px solid #b48a36;padding-bottom:12px;margin-bottom:18px}h1{font-size:23px;margin:0;color:#132238}header p{margin:5px 0 0;color:#667085}.summary{background:#f7f3e9;border-left:4px solid #b48a36;padding:12px;margin:0 0 18px}.summary strong{display:block;font-size:14px;margin:2px 0}h2{font-size:13px;text-transform:uppercase;letter-spacing:.06em;margin:18px 0 6px;color:#132238}table{width:100%;border-collapse:collapse}td{padding:6px;border-bottom:1px solid #e6e8ec;vertical-align:top}td:first-child{width:45%;color:#667085}td:last-child{font-weight:600}.brand{font-weight:700;color:#b48a36;text-transform:uppercase;letter-spacing:.08em;font-size:10px}.footer{margin-top:24px;padding-top:10px;border-top:1px solid #ddd;color:#777;font-size:9px}.tools{margin-top:20px;padding:12px;background:#132238;color:white}.tools b{color:#e0bd68}.tools p{margin:3px 0}</style></head><body><header><div class="brand">Chesly.Tech Insights</div><h1>${esc(r.title)}</h1>${r.subtitle?`<p>${esc(r.subtitle)}</p>`:""}</header><div class="summary">${r.summary.map(x=>`<strong>${esc(x)}</strong>`).join("")}</div>${sections}<div class="tools"><b>Continue with Chesly.Tech Business Tools</b><p>Practical South African templates, trackers and toolkits: insights.chesly.tech/tools</p></div><div class="footer">${esc(r.footer||"Planning tool only. Verify programme, tender, legal, tax and financial requirements before relying on this report.")}<br>Generated at insights.chesly.tech</div></body></html>`;
}

export function printReport(r:PdfReport){
 const w=window.open("","_blank","noopener,noreferrer,width=900,height=1000");
 if(!w)return false;
 w.document.write(reportHtml(r));w.document.close();w.focus();setTimeout(()=>w.print(),250);return true;
}

export async function shareReport(r:PdfReport,fileName:string,shareText:string,url:string){
 const html=reportHtml(r);
 const file=new File([html],[fileName.replace(/\.pdf$/i,"")+".html"],{type:"text/html"});
 try{
  if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title:r.title,text:shareText,url,files:[file]});return "file";}
  if(navigator.share){await navigator.share({title:r.title,text:shareText,url});return "text";}
 }catch(e){if((e as Error).name==="AbortError")return "cancelled";}
 window.open(`https://wa.me/?text=${encodeURIComponent(shareText+"\n"+url)}`,"_blank","noopener,noreferrer");return "whatsapp";
}
