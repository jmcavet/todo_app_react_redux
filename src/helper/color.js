
export function reverseColor(color) {
    return color.r * 0.299 + color.g * 0.587 + color.b * 0.114 > 140
        ? '#000000'
        : '#ffffff'
}

export function rgbCode(color) {
    return `rgb(
            ${color.r},
            ${color.g},
            ${color.b},
            ${color.a})`
}
