export default function fancy_name_to_id(name) {
    let underscored = name.replace(/ /g, '_');
    let alphanumeric = underscored.replace(/\W/g, '');
    console.log("FANCIED TO: " + alphanumeric.toLowerCase())
    return alphanumeric.toLowerCase();
}


export function generateUniqueId(str) {
    let uniqueId = "";
    for (let i = 0; i < str.length; i++) {
        uniqueId += (str.charCodeAt(i) - 30);
    }
    return uniqueId;
}

export function generateUUID(str) {
    const timestamp = new Date().getTime();
    const uniqueStr = str + timestamp;
    let hash = 0;

    if (uniqueStr.length === 0) {
        return hash.toString();
    }

    for (let i = 0; i < uniqueStr.length; i++) {
        const char = uniqueStr.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32-bit integer
    }

    return hash.toString();
}