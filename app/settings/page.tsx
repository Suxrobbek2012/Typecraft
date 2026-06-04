import type { Metadata } from 'next'
import { SettingsPage } from '@/components/SettingsPage'

export const metadata: Metadata = {
  title: 'Settings — TypeCraft',
  description: 'Customize your TypeCraft experience — theme, caret, sounds, language and more.',
}

export default function Settings() {
  return <SettingsPage />
}
