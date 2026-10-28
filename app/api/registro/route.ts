import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getDb } from '../../../db';
import { leads } from '../../../db/schema';
export const dynamic='force-dynamic';
const consentText='Acepto recibir información y recordatorios del taller por WhatsApp y correo';
export async function GET(){const id=(await cookies()).get('paguro_registro')?.value;if(!id)return Response.json({lead:null},{headers:{'Cache-Control':'no-store'}});const [lead]=await getDb().select().from(leads).where(eq(leads.id,id)).limit(1);return Response.json({lead:lead?{name:lead.name,email:lead.email,phone:lead.phone,status:lead.status,transactionId:lead.transactionId}:null},{headers:{'Cache-Control':'no-store'}})}
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Solicitud no válida.'},{status:403});
 try{const data=await request.json() as Record<string,unknown>;const name=String(data.name||'').trim(),email=String(data.email||'').trim().toLowerCase(),phone=String(data.phone||'').trim();
 if(name.length<3||name.length>120||!/^\S+@\S+\.\S+$/.test(email)||email.length>200||!/^3\d{9}$/.test(phone)||data.consent!==true)return Response.json({error:'Revisa tu nombre, correo, celular y la casilla de aceptación.'},{status:400});
 const jar=await cookies();const previous=jar.get('paguro_registro')?.value;let existing;
 if(previous){[existing]=await getDb().select({id:leads.id,status:leads.status}).from(leads).where(eq(leads.id,previous)).limit(1)}
 const id=existing?.id||crypto.randomUUID();
 if(existing)await getDb().update(leads).set({name,email,phone,...(existing.status==='pago_pendiente'?{amount:33225}:{})}).where(eq(leads.id,id));
 else await getDb().insert(leads).values({id,name,email,phone,amount:33225,consent:1,consentText,createdAt:new Date().toISOString(),utmSource:String(data.utmSource||'').slice(0,200),utmCampaign:String(data.utmCampaign||'').slice(0,200)});
 jar.set('paguro_registro',id,{httpOnly:true,secure:new URL(request.url).protocol==='https:',sameSite:'lax',maxAge:60*60*24*30,path:'/'});
 return Response.json({ok:true});
 }catch{return Response.json({error:'No pudimos guardar tus datos. Revisa tu conexión e intenta de nuevo.'},{status:500})}
}

