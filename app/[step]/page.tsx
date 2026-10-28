import Funnel from '../funnel';
import { notFound, redirect } from 'next/navigation';
export default async function Page({params}: {params: Promise<{step:string}>}){const {step}=await params;if(step==='pago')redirect('/taller');if(!['taller','gracias'].includes(step))notFound();return <Funnel stage={step}/>}
