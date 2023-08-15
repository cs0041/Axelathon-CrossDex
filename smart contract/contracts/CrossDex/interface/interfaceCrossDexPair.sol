// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


interface ICrossDexPair {
    function getAmountsIn(uint256 _amountOut,address _tokenIn) external  view returns(uint256 amountIn);
    function getAmountsOut(uint256 _amountIn,address _tokenIn) external  view returns(uint256 amountOut);
    function swap(uint256 _amountIn,uint256 _amountOutMin, address _tokenIn,address to) external   returns (uint256 amountOut); 
    function addLiquidity(uint256 _amount0, uint256 _amount1,address to,bool isForceAdd) external returns (uint256 liquidity);
    function removeLiquidity(  uint256 _shares,address to ) external returns (uint256 amount0, uint256 amount1);
    function getReserves() external view returns (uint256 _reserve0, uint256 _reserve1);
}