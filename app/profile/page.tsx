import type { Metadata } from 'next'
import { ProfilePage } from '@/components/ProfilePage'

export const metadata: Metadata = {
  title: 'Profile — TypeCraft',
  robots: { index: false, follow: false },
}

export default function Profile() {
  return <ProfilePage />
}
