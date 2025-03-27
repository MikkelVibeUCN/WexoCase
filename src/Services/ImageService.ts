
export function getFullImagePath(path: string) {
    return `https://image.tmdb.org/t/p/original${path}`
}

export function getFullImagePathWithWidth(path: string, width: number) {
    return `https://image.tmdb.org/t/p/w${width + path}`
}