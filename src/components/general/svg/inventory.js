import * as React from "react"

function SvgComponent(props) {

  const {color} ={...props}

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 122.878 110.041"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.149 0h120.583c.631 0 1.146.518 1.146 1.149v28.383a1.15 1.15 0 01-1.146 1.149H1.149A1.152 1.152 0 010 29.532V1.149C0 .518.518 0 1.149 0zm6.075 36.787h108.433c.526 0 .962.43.962.961v71.331a.967.967 0 01-.962.962H7.224a.965.965 0 01-.961-.962v-71.33c0-.532.432-.962.961-.962zm37.781 11.739h32.87c3.529 0 6.419 2.888 6.419 6.417s-2.89 6.416-6.419 6.416h-32.87c-3.532 0-6.419-2.887-6.419-6.416 0-3.529 2.888-6.417 6.419-6.417z"
        fill={color ? color : "#fff"}
      />
      
    </svg>
  )
}

export default SvgComponent
