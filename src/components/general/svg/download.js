function SvgComponent(props) {
    const {color} = props;

    return (
      <svg 
        className={props.className}
        width={"100%"} height={"100%"} 
        viewBox="0 0 176 235"
        xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d="M125.131 0L176 51.109V224c0 6.075-4.925 11-11 11H11c-6.075 0-11-4.925-11-11V11C0 4.925 4.925 0 11 0h114.131zM96 85H79a8 8 0 00-8 8v54.633H48.33a8 8 0 00-5.914 13.387l39.28 43.12a8 8 0 0011.828 0l39.28-43.12a8 8 0 00-5.914-13.387h-22.892L104 93a8 8 0 00-8-8z"
          fillRule="evenodd"
        />
      </svg>
    )
}
export default SvgComponent;