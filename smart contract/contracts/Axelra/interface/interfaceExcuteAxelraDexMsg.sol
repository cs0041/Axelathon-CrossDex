// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


interface IExcutenAxelraDexMsg {
    function excuteBridgeAddLiquidity(bytes memory payload) external ;
    function excuteBridgeSwap(bytes memory payload) external ; 
    function excuteBridgeRemoveLiquidity(address sender,bytes memory payload) external ;
    function excuteBridgeToken(bytes memory payload) external ;
    function handleFailedBridgeSwap(address _sender,string calldata sourceChain,bytes memory payload) external;
    function handleFailedBridgeAddLiquidity(address _sender,string calldata sourceChain,bytes memory payload) external;
    function mintToken(address token,address to, uint256 amount) external;
    function burnToken(address token,address to, uint256 amount) external ;
}