import type { Metadata } from 'next'
import { UltraPage } from '@/components/UltraPage'

export const metadata: Metadata = {
  title: 'TypeCraft Ultra PRO — Animated Themes & Effects',
  description: 'Unleash ultimate immersion with gold, neon, aurora, and matrix themes, sound effects, CPM, and priority 3-day support queue.',
  robots: { index: true, follow: true },
}

export default function Ultra() {
  return <UltraPage />
}
