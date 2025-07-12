'use client'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { SquaresExclude, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Else, If } from '../atoms/if'

export default function ListMenuSidebar({
  sidebarCollapsed,
  handleLogout,
}: {
  readonly sidebarCollapsed: boolean
  readonly handleLogout: () => void
}) {
  const pathName = usePathname()
  return (
    <nav className="!px-2 !py-4 space-y-1">
      <div className="space-y-1">
        <If condition={!sidebarCollapsed}>
          <Button
            variant={pathName === '/admin/notes' ? 'contained' : 'text'}
            href="/admin/notes"
            startIcon={<SquaresExclude />}
            size="small"
            className={`!shadow-none !w-full flex !justify-start`}
          >
            {!sidebarCollapsed && 'Notes'}
          </Button>
          <Else key="else-1">
            <IconButton
              href="/admin/notes"
              aria-label="dashboard"
              color={pathName === '/admin/notes' ? 'primary' : 'default'}
            >
              <SquaresExclude />
            </IconButton>
          </Else>
        </If>
      </div>

      <div
        onClick={handleLogout}
        className={
          pathName === '/logout'
            ? 'group flex !mb-2 items-center gap-1 !px-3 !py-2 text-sm font-medium rounded-lg transition-colors duration-150 !text-white bg-blue-500 hover:bg-blue-600'
            : 'group flex items-center gap-1 !px-3 !py-2 text-sm font-medium rounded-lg transition-colors !text-black duration-150 hover:bg-gray-100'
        }
      >
        <LogOut className="w-4 h-4" />
        {!sidebarCollapsed && (
          <span
            className={
              sidebarCollapsed
                ? 'lg:opacity-0 lg:w-0 overflow-hidden'
                : 'opacity-100'
            }
          >
            Logout
          </span>
        )}
      </div>
    </nav>
  )
}
