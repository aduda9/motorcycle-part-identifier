

const HONDA_PART_REGEX = /[a-zA-Z0-9]{5}-[a-zA-Z0-9]{3}-([a-zA-Z0-9]{5}|[a-zA-Z0-9]{3})/g;

const manufacturer_to_regex={
    "honda":HONDA_PART_REGEX,
}

export {
    manufacturer_to_regex,
}