
let array = [{
    name: 'carry',
    from: 'beijing'
}, {
    name: 'tom',
    from: 'chendu'
}, {
    name: 'jan',
    from: 'beijing'
}, , {
    name: 'carry',
    from: 'beijing'
}]
let obj = {}
const result = array.reduce((l1, l2) => {
    if (!obj[l2.name]) {
        obj[l2.name] = true
        l1.push(l2)
    }
    return l1
},[])
console.log(result)
// function quchong(){
//     const obj = {}
//     array.forEach(res=>{
//         obj[JSON.stringify(res)] = res
//     })
//     array = Object.keys(obj).map(res=>{
//         return JSON.parse(res)
//     })
//     console.log(array)
// }
// quchong()
// function quchong(data) {
//     let obj = {}
//     const result = data.reduce((item, res) => {
//         obj[res.name] ? '' : obj[res.name] = true && item.push(res)
//         return item
//     }, [])
//     console.log(result)
//     return result
// }
// quchong([{ name: 1, id: 13 }, { name: 2, id: 15 }, { name: 1, id: 14 }])
// function N(x) {
//     return x.toUpperCase()
// }
// function v(x) {
//     return x + '!'
// }
// function compose(...x) {
//     return (...info) => {
//         let l2 = info
//         x.forEach((item) => {
//             l2 = item(l2)
//         })
//         return l2
//     }
// }
// const cout = compose(v,N)
// cout('aacc')
// console.log(cout('aacc'))