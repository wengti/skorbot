

export const defaultPictures:Record<string, string> = {
    'red': '/images/profile_red.png',
    'orange': '/images/profile_orange.png',
    'green': '/images/profile_green.png',
    'purple': '/images/profile_purple.png',
    'blue': '/images/profile_blue.png',
}

export function getAProfilePicture() {
    const pictureKeys = Object.keys(defaultPictures)
    const randIdx = Math.floor(Math.random() * pictureKeys.length)
    return defaultPictures[pictureKeys[randIdx]]
}
