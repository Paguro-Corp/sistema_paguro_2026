'use client';
import { useEffect, useRef } from 'react';
export const HOTMART_CHECKOUT = 'https://pay.hotmart.com/D93889393J?checkoutMode=2';
type HotmartWindow = Window & { jQuery?: { fn?: { fancybox?: unknown }; (element: HTMLElement): { fancybox: (options: object) => void } } };

// The official widget opens an iframe on desktop and navigates on mobile.
// This anchor stays out of React's tree because the vendor may remove it.
export function useHotmart(enabled: boolean, lead: {name:string;email:string;phone:string}|null) {
 const checkoutUrl = new URL(HOTMART_CHECKOUT);
 if (lead) {
  checkoutUrl.searchParams.set('name', lead.name);
  checkoutUrl.searchParams.set('email', lead.email);
  checkoutUrl.searchParams.set('phoneac', '57');
  checkoutUrl.searchParams.set('phonenumber', lead.phone);
 }
 const href = checkoutUrl.toString();
 const anchor = useRef<HTMLAnchorElement | null>(null);
 useEffect(() => {
  if (!enabled) return;
  const link = document.createElement('a');
  link.href = href;
  link.className = 'hotmart-fb hotmart__button-checkout';
  link.tabIndex = -1;
  link.setAttribute('aria-hidden', 'true');
  link.style.display = 'none';
  const image = document.createElement('img');
  image.src = 'https://static.hotmart.com/img/btn-buy-green.png';
  image.alt = 'Pagar con Hotmart';
  link.appendChild(image);
  document.body.appendChild(link);
  anchor.current = link;
  if (!document.querySelector('link[data-paguro-hotmart]')) {
   const css = document.createElement('link'); css.rel = 'stylesheet'; css.type = 'text/css';
   css.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
   css.dataset.paguroHotmart = 'true'; document.head.appendChild(css);
  }
  const jq = (window as HotmartWindow).jQuery;
  if (jq?.fn?.fancybox && !isMobile()) {
   jq(link).fancybox({ type:'iframe', toolbar:false, smallBtn:true, iframe:{css:{width:'600px'},attr:{allowpaymentrequest:'true'}} });
  } else if (!document.querySelector('script[data-paguro-hotmart]')) {
   const script = document.createElement('script'); script.type = 'text/javascript';
   script.src = 'https://static.hotmart.com/checkout/widget.min.js';
   script.dataset.paguroHotmart = 'true'; document.head.appendChild(script);
  }
  return () => { link.remove(); anchor.current = null; };
 }, [enabled, href]);
 return () => {
  const jq = (window as HotmartWindow).jQuery;
  if (anchor.current?.isConnected && jq?.fn?.fancybox && !isMobile()) {
   jq(anchor.current).fancybox({type:'iframe',toolbar:false,smallBtn:true,iframe:{css:{width:'600px'},attr:{allowpaymentrequest:'true'}}});
   anchor.current.click();
  } else window.location.assign(href);
 };
}
function isMobile(){return window.screen.width<=600 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)}
