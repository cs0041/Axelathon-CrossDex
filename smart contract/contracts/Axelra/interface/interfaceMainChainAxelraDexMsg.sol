// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


interface IMainChainAxelraDexMsg {
    function bridgeToken(
        string memory destinationChain,
        address[] memory addressToken,
        uint256[] memory amount,
        address to
    ) external payable;
}