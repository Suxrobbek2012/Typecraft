import type { Metadata } from 'next'
import { SupportPage } from '@/components/SupportPage'

export const metadata: Metadata = {
  title: 'Support — TypeCraft',
  description: 'Submit a support ticket. Get help with your TypeCraft account, subscription, and typing features.',
  robots: { index: true, follow: true },
}

export default function Support() {
  return <SupportPage />
}
