

import * as React from "react"

function SvgComponent(props) {

  const {color} = {...props}
  return (
    <svg
      width={"100%"}
      height={"100%"}
      viewBox="0 0 15 29"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill={color} fillRule="evenodd">
        <path d="M3.86 1.219l9.697 12.152c.42.526.353 1.29-.152 1.735a1.144 1.144 0 01-1.652-.144L2.057 2.81a1.263 1.263 0 01.151-1.736 1.144 1.144 0 011.652.145z" />
        <path d="M3.86 27.339l9.697-12.152c.42-.527.353-1.29-.152-1.736a1.144 1.144 0 00-1.652.144L2.057 25.748c-.42.526-.354 1.29.151 1.735a1.144 1.144 0 001.652-.144z" />
      </g>
    </svg>
  )
}

export default SvgComponent
