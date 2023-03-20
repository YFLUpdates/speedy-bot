export default function dateIsValid(date) {
    return date instanceof Date && !isNaN(date);
}