import { useState } from 'react'
import { FiSquare } from 'react-icons/fi'
import { HiOutlineSquare2Stack } from 'react-icons/hi2'
import { IoCloseSharp } from 'react-icons/io5'
import { VscChromeMinimize } from 'react-icons/vsc'

export const DraggableTopBar = () => {
  return (
    <header
      className="absolute inset-0 h-8 flex items-center justify-between"
      style={{ backgroundColor: '#121212' }}
    >
      <LeftSide />
      <RightSide />
    </header>
  )
}

import Logo from '../../../../resources/favicon-32x32.png'

const LeftSide = () => {
  return (
    <div>
      {' '}
      <img src={Logo} alt="" className="pl-1 h-7" />
    </div>
  )
}

const RightSide = () => {
  const [maximized, setMaximized] = useState(false)

  const handleMinimize = () => {
    window.electron.minimizeWindow()
  }

  const handleMaximize = () => {
    window.electron.maximizeWindow()
    setMaximized(!maximized)
  }

  const handleClose = () => {
    window.electron.closeWindow()
  }

  return (
    <div className="">
      <button className="titlebar-button minimize p-3 hover:bg-gray-500" onClick={handleMinimize}>
        <VscChromeMinimize />
      </button>
      <button className="titlebar-button maximize p-3 hover:bg-gray-500" onClick={handleMaximize}>
        {maximized ? <HiOutlineSquare2Stack size={15} /> : <FiSquare />}
      </button>
      <button className="titlebar-button close p-3 hover:bg-gray-500" onClick={handleClose}>
        <IoCloseSharp />
      </button>
    </div>
  )
}
