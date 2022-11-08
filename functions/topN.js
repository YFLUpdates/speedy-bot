export default function topN(arr, n){
    if(n > arr.length){
       return false;
    }
    return arr
    .slice()
    .sort((a, b) => {
       return b.count - a.count
    })
    .slice(0, n);
}