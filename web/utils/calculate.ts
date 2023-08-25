export const calculateLPReceived = (
  totalSupply: string,
  amount0: string,
  amount1: string,
  reserve0:string,
  reserve1:string,
  )  => {
  let liquidity = 0
  if (Number(totalSupply) == 0) {
    liquidity = _sqrt(Number(amount0) * Number(amount1))
  } else {
    liquidity = Math.min(
      (Number(amount0) * Number(totalSupply)) / Number(reserve0),
      (Number(amount1) * Number(totalSupply)) / Number(reserve1)
    )
  }

  return liquidity
    
}
export const calculateShareOfPoolPercentage = (
  totalSupply: string,
  amountUserLP: string|number
) => {
  return Number(amountUserLP) / (Number(totalSupply) / 100)
}

export const calculateAmountTokenBackWhenRemoveLP = (
  totalSupply: string,
  amountUserLP: string|number,
  reserve0:string,
  reserve1:string,
) => {

  let token0 = 0
  let token1 = 0
  token0 = (Number(amountUserLP) * Number(reserve0)/Number(totalSupply))
  token1 = (Number(amountUserLP) * Number(reserve1)/Number(totalSupply))
  return {
    token0,
    token1
  }
}

export const calculatePriceImpact = (
  inputIn: string,
  inputOut: string,
  reserve0:string,
  reserve1:string,
) => {

 return (Number(reserve1) / Number(reserve0) - Number(inputOut) / Number(inputIn)) / 
  (Number(reserve1) / Number(reserve0) / 100)
}

const  _sqrt = (y:number) =>   {
    let z = 0
    if (y > 3) {
            z = y;
            let x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
    } else if (y != 0) {
            z = 1;
    }
    return z
}
