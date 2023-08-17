// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./CrossDexPair.sol";
import "./interface/interfaceCrossDexFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 
 

contract CrossDexFactory is ICrossDexFactory , Ownable {
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;
    address public router;

    function setRouter(address _router) public onlyOwner {
        router = _router;
    }


    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address token0, address token1,address to) external onlyOwner returns (address) {
        require(token0 != token1, "CrossDex: IDENTICAL_ADDRESSES");
        require(token0 != address(0), "CrossDex: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "CrossDex: PAIR_EXISTS"); // single check is sufficient
        

        bytes32 _salt = keccak256(abi.encodePacked(token0, token1));
        CrossDexPair newPair = new CrossDexPair{salt: _salt}(token0,token1,router);
        address pair = address(newPair);
        require(pair != address(0),"CrossDex: Fail_CreatePair");
        newPair.transferOwnership(to);

        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair );
        emit PairCreated(token0, token1, pair , allPairs.length);

        return pair;
    }

    // onnly use for secondary Chain
    function forceAddExistsPair(address token0, address token1, address pairLP) external onlyOwner {
        require(getPair[token0][token1] == address(0), "CrossDex: PAIR_EXISTS"); // single check is sufficient
        getPair[token0][token1] = pairLP;
        getPair[token1][token0] = pairLP; // populate mapping in the reverse direction

        allPairs.push(pairLP);
        emit PairCreated(token0, token1, pairLP , allPairs.length);

    }

}