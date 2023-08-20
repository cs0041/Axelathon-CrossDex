// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


interface ICrossDexRouter {
   function addLiquidity(uint256 amount0, uint256 amount1, address token0, address token1,bool isForceAdd, address to, uint256 deadline)  external ;
   function removeLiquidity(uint256 liquidity,  address token0, address token1, address to, uint256 deadline)  external ;
   function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin, address tokenIn, address tokenOut, address to, uint256 deadline) external ;
   function factory()external  returns (address); 

}