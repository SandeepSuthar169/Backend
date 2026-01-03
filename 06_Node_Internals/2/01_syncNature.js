function two(){
    console.log("two");
}
function one(){
    for(let i = 0; i< 10000000; i++) {}
    console.log("one");
}

two()
one()