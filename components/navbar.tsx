import React from "react"

const Navbar = () => {
  return (
    <div className="bg-white flex flex-row py-5 px-7">
        <a href={'/'}>EventMgr</a>
        <div className="flex ml-auto gap-4">
          <a href={'/'}>Home</a>
          <a href={'/add-event'}>Add Event</a>
        </div>
    </div>
  )
}

export default Navbar