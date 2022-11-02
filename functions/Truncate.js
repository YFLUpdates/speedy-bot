export default function truncate(input, number) {
    if (input.length > number) {
       return input.substring(0, number) + '...';
    }
    return input;
}