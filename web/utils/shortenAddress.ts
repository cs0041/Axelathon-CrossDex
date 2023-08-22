export const shortenAddress = (address:string|undefined) => {
    if(address==undefined || address == ''){
        return '-'
    }else{
       return `${address.slice(0,5)}...${address.slice(address.length-4)}`
    }
}