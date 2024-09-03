import { useState } from 'react'
import {
  FaCheck,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt
} from 'react-icons/fa'

const SortButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState(0)
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  function getIcon() {
    switch (type) {
      case 0:
        return <FaSortAmountDownAlt />
      case 1:
        return <FaSortAmountUpAlt />
      case 2:
        return <FaSortAlphaUp />
      case 3:
        return <FaSortAlphaDown />
      default:
        return null
    }
  }

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full px-3 py-2 text-white font-medium rounded-md focus:outline-none hover:bg-zinc-600/50"
      >
        {getIcon()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 origin-top-right border text-white border-white/20 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
          style={{ backgroundColor: '#121212', fontSize: 14 }}
        >
          <div
            className="p-2"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
              className="px-2 flex  p-1 rounded-sm  hover:bg-stone-600  justify-between items-center"
              role="menuitem"
              onClick={() => {
                setType(0)
              }}
            >
              Most Recent {type === 0 ? <FaCheck /> : <></>}
            </a>
            <a
              href="#"
              className="px-2 flex  p-1 rounded-sm  hover:bg-stone-600  justify-between items-center"
              role="menuitem"
              onClick={() => {
                setType(1)
              }}
            >
              Least Recent {type === 1 ? <FaCheck /> : <></>}
            </a>
            <hr
              style={{
                height: '2px',
                backgroundColor: '#303030',
                border: 'none',
                marginTop: 5,
                marginBottom: 5
              }}
            />
            <a
              href="#"
              className="px-2 flex  p-1 rounded-sm  hover:bg-stone-600  justify-between items-center"
              role="menuitem"
              onClick={() => {
                setType(2)
              }}
            >
              A to Z {type === 2 ? <FaCheck /> : <></>}
            </a>

            <a
              type="submit"
              className=" px-2 flex  p-1 rounded-sm  hover:bg-stone-600  justify-between items-center"
              role="menuitem"
              onClick={() => {
                setType(3)
              }}
            >
              Z to A {type === 3 ? <FaCheck /> : <></>}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default SortButton
