import * as React from "react"

function SvgComponent(props) {
  const {color}={...props};
  return (
    <svg
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 122.88 113.97"
      width="100%"
      height="100%"
      {...props}
    >
      <title>{"homepage"}</title>
      <path
        d="M18.69 73.37l40.49-40.51c2.14-2.14 2.41-2.23 4.63 0l40.38 40.51V114h-30V86.55a3.38 3.38 0 00-3.37-3.37H52.08a3.38 3.38 0 00-3.37 3.37V114h-30V73.37zM60.17.88L0 57.38l14.84 7.79 42.5-42.86c3.64-3.66 3.68-3.74 7.29-.16l43.41 43 14.84-7.79L62.62.79c-1.08-1-1.24-1.13-2.45.09z"
        fillRule="evenodd"
        fill={color ? color : "#fff"}
      />
    </svg>
  )
}

export default SvgComponent
