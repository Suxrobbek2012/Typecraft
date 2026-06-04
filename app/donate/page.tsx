import type { Metadata } from 'next'
import { DonatePage } from '@/components/DonatePage'

export const metadata: Metadata = {
  title: 'Support TypeCraft — Donate',
  description: 'Support TypeCraft development and get PRO status. Donate via card transfer.',
  robots: { index: true, follow: true },
}

export default function Donate() {
  return <DonatePage />
}
