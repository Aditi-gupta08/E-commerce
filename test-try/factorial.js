
function factorial(n){
    if(n<0)
        return new Error('Number needs to be greater than zero !');

    let fac = 1;
    for(let i=1; i<=n; i++)
    {
        fac*= i;
    }

    return fac;
}

module.exports = {
    factorial
};