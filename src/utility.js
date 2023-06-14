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