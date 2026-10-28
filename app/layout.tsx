import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'De tu local a toda Colombia · Sistema Paguro', description: 'Mismos productos. Más clientes. Taller en vivo para comerciantes de San Victorino. 5 de noviembre, 7:00 p. m.', icons: { icon: '/brand/emblema.png' } };
export default function Layout({children}: {children: React.ReactNode}) {return <html lang="es-CO"><body>{children}</body></html>}
