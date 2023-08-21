// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


interface IExcutenAxelraDexMsg {
    function excuteBridgeAddLiquidity(bytes memory payload) external ;
    function excuteBridgeSwap(bytes memory payload) external ; 
    function excuteBridgeRemoveLiquidity(address sender,bytes memory payload) external ;
    function excuteBridgeToken(bytes memory payload) external ;
    function mintToken(address token,address to, uint256 amount) external;
    function burnToken(address token,address to, uint256 amount) external ;
    function redeemLiquidity(uint256 liquidity, address token0,  address token1) external ;
}