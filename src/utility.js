import badwords from "./badwords.txt?raw"
import i18n from "i18next";
import data from "./interests.json";
import {useTranslation} from "react-i18next";


export default function fancy_name_to_id(name) {
    let convertedString = name.replace(/[\s_]/g, '-');

    // Remove non-alphanumeric characters
    convertedString = convertedString.replace(/[^a-zA-Z0-9-]/g, '');

    return convertedString;
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
    const uniqueStr = (Math.random() * 100) + str + timestamp;
    let hash = 0;

    if (uniqueStr.length === 0) {
        return hash.toString();
    }

    for (let i = 0; i < uniqueStr.length; i++) {
        const char = uniqueStr.charCodeAt(i);
        hash = ((hash << 5) - hash + char) & 0xffffffff;
    }

    return hash.toString();
}


export function profanityFilter(str) {
    let output = str;
    let email_regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    let phone_regex = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    output = output.replace(email_regex, "*")
    output = output.replace(phone_regex, "*")
    let badlist = badwords.split("\n");
    const regexPattern = new RegExp(`\\b(${badlist.join('|')})\\b`, 'gi');
    output = output.replace(regexPattern, "*")
    return output;
}

i18n.addResourceBundle("en", "interests", data.en)
i18n.addResourceBundle("fr", "interests", data.fr)

export const interests_data = ["🤖" + i18n.t('ai', {ns: "interests"}), "🌎" + i18n.t('web', {ns: "interests"}), "👨‍💻" + i18n.t('programming', {ns: "interests"}), "📱" + i18n.t('mobile', {ns: "interests"}), "🎮" + i18n.t('gaming', {ns: "interests"}), "📊" + i18n.t('data', {ns: "interests"}), "🔒" + i18n.t('security', {ns: "interests"}), "🎨" + i18n.t('design', {ns: "interests"}), "🛠" + i18n.t('build', {ns: "interests"})];
