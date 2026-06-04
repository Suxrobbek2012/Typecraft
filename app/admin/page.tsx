import { redirect } from 'next/navigation'

const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-dashboard'

export default function AdminIndex() {
  redirect(`/${adminPath}/dashboard`)
}
