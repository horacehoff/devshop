export default function fancy_name_to_id(name) {
    let underscored = name.replace(/ /g, '_');
    let alphanumeric = underscored.replace(/\W/g, '');
    console.log(alphanumeric.toLowerCase())
    return alphanumeric.toLowerCase();
}