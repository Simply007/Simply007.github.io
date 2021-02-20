import React from 'react'

const UnknownComponent = ({ props }) => {
  return (
    <div>
      <h2>UNKNOWN COMPONENT</h2>
      {props.children}
    </div>
  )
}

export default UnknownComponent
