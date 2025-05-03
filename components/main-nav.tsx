import Link from 'next/link'
import { Shield } from 'lucide-react'

export function MainNav() {
  return (
    <div className="flex items-center gap-6 justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <Shield className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">PolyPass</span>
      </Link>
    </div>
  )
}
