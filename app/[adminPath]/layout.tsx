import AdminShell from '@/components/admin/AdminShell'

export default function AdminPathLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
