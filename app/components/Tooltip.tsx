"use client"

const Tooltip = () => {
  return (
    <div className='tooltip-container'>
      <span className='tooltip-trigger cursor-pointer underline'>Learn about Toll calculation</span>
      <div className='tooltip-content hidden bg-white shadow-md p-4 rounded-md absolute top-full left-1/2 translate-x-1/2'>
        Tooltip
      </div>
    </div>
  )
}

export default Tooltip
