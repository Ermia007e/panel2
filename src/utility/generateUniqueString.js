export default function generateUniqueString(minLength = 5, maxLength = 30) {
    // Ensure the length is within the specified range


    // Generate a random length between minLength and maxLength
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    // Create a pool of characters (letters and digits)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueString = '';

    // Generate the unique string
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueString += characters[randomIndex];
    }

    return uniqueString;
}
