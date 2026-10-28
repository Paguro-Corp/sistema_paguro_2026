import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getDb } from '../../../db';
import { leads } from '../../../db/schema';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Solicitud no válida.'},{status:403});
 const id=(await cookies()).get('paguro_registro')?.value;
 if(!id)return Response.json({error:'Primero completa tu registro.'},{status:401});
 try {
  const [lead]=await getDb().select({id:leads.id}).from(leads).where(eq(leads.id,id)).limit(1);
  if(!lead)return Response.json({error:'Primero completa tu registro.'},{status:401});
  await getDb().update(leads).set({checkoutAt:new Date().toISOString()}).where(eq(leads.id,id));
  return Response.json({ok:true,provider:'hotmart'});
 } catch {return Response.json({error:'No pudimos preparar tu reserva. Intenta de nuevo.'},{status:500})}
}
