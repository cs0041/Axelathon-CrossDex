// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 

contract axelraToken0 is ERC20, Ownable{
    address public axelraAddress;

    mapping(bytes32 => address) public tokenAddressMappingByChain;

    constructor( ) ERC20("Wrapper Token0", "wToken0"){}

    modifier onlyAxelraOrOwner() {
        require(msg.sender == axelraAddress || msg.sender ==  owner(),"invalid caller");
        _;
    }

    function mint(address to, uint256 amount) public onlyAxelraOrOwner {
        _mint(to, amount);
    }
    function burn(address to, uint256 amount) public onlyAxelraOrOwner {
         _burn(to, amount); 
    }

    function setAxelraAddress(address _axelraAddress)  public onlyOwner {
        axelraAddress = _axelraAddress;
    }

    
    // Link address contract Token in the destination chain
    function setDestinationAddressToekenMapping(string calldata chainName,address addressToken) public onlyOwner {
        tokenAddressMappingByChain[keccak256(abi.encode(chainName))] = addressToken;
    }

    function getDestinationAddressToken (string calldata chainName) public view  returns(address){
        return  tokenAddressMappingByChain[keccak256(abi.encode(chainName))];
    }
}