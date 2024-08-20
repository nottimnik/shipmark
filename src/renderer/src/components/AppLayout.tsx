import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

// Root layout component that defines the main structure of the page
export const RootLayout = ({ children, className, ...props }: ComponentProps<'main'>) => {
  return (
    // 'main' element with a flex row layout that occupies the full height of the screen
    // 'twMerge' is used to combine Tailwind classes with any additional classes passed via props
    <main className={twMerge('flex flex-row h-screen', className)} {...props}>
      {children} {/* Renders child components inside the main layout */}
    </main>
  )
}

// Sidebar layout component, typically for navigation or side content
export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  return (
    // 'aside' element with specific width, height, margin, and overflow styling
    // Height is set to be slightly taller than 100vh to account for potential offsets
    <aside
      className={twMerge('w-[250px] mt-10 h-[100vh + 10px] overflow-auto', className)}
      {...props}
    >
      {children} {/* Renders child components inside the sidebar */}
    </aside>
  )
}

// Content layout component, designed to be the main content area within the editor
export const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, className, ...props }, ref) => (
    // 'div' element that is flexible and scrollable, with a reference for further DOM manipulation
    <div ref={ref} className={twMerge('flex-1 overflow-auto', className)} {...props}>
      {children} {/* Renders child components inside the content area */}
    </div>
  )
)
