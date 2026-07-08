import { Outlet } from 'react-router-dom'
import { Box } from '@/components/primitives'

export default function ConsoleLayout() {
  return (
    <Box className="h-full overflow-hidden flex flex-col">
      <Outlet />
    </Box>
  )
}
