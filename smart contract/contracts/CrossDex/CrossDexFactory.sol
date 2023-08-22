// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./CrossDexPair.sol";
import "./interface/interfaceCrossDexFactory.sol";
 
 
contract CrossDexFactory is ICrossDexFactory  {
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;
    address public axelraAddress;

    constructor(address _axelraAddress) {
        axelraAddress = _axelraAddress;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address token0, address token1) external returns (address) {
        require(token0 != token1, "CrossDex: IDENTICAL_ADDRESSES");
        require(token0 != address(0), "CrossDex: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "CrossDex: PAIR_EXISTS"); // single check is sufficient
        

        bytes32 _salt = keccak256(abi.encodePacked(token0, token1));
        CrossDexPair newPair = new CrossDexPair{salt: _salt}(token0,token1,axelraAddress);
        address pair = address(newPair);
        require(pair != address(0),"CrossDex: Fail_CreatePair");
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair );
        emit PairCreated(token0, token1, pair , allPairs.length);

        return pair;
    }
}