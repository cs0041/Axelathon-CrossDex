// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


interface ICrossDexPair {

    // for dex
    function getAmountsIn(uint256 _amountOut,address _tokenIn) external  view returns(uint256 amountIn);
    function getAmountsOut(uint256 _amountIn,address _tokenIn) external  view returns(uint256 amountOut);
    function swap(uint256 _amountIn,uint256 _amountOutMin, address _tokenIn,address to) external   returns (uint256 amountOut); 
    function addLiquidity(uint256 _amount0, uint256 _amount1,address to,bool isForceAdd) external returns (uint256 liquidity);
    function removeLiquidity(  uint256 _shares,address to ) external returns (uint256 amount0, uint256 amount1);
    function getReserves() external view returns (uint256 _reserve0, uint256 _reserve1);


    // for token
    function mint(address to, uint256 amount) external;
    function burn(address to, uint256 amount) external;
    function getTokenAddressMappingByChain (string calldata chainName) external view  returns(address);
    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
    function transferOwnership(address newOwner) external ;
   
}