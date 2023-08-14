// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

 
import "./interface/interfaceCrossDexERC20.sol";

contract CrossDexERC20 is ICrossDexERC20 {
    uint256  public constant MAX_INT = 2**256 - 1 ;
    string public constant name = 'CrossDex LPs';
    string public constant symbol = 'CRD-LP';
    uint8 public constant decimals = 18;
    uint  public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    //  constructor() public {}

    function _mint(address to, uint value) internal {
        totalSupply = totalSupply + value;
        balanceOf[to] = balanceOf[to] + value ;
        emit Transfer(address(0), to, value);
    }

    function _burn(address from, uint value) internal {
        balanceOf[from] = balanceOf[from] - value;
        totalSupply = totalSupply - value ;
        emit Transfer(from, address(0), value);
    }

    function _approve(address owner, address spender, uint value) private {
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function _transfer(address from, address to, uint value) private {
        balanceOf[from] = balanceOf[from] - value ;
        balanceOf[to] = balanceOf[to] + value ;
        emit Transfer(from, to, value);
    }

    function approve(address spender, uint value) external returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function transfer(address to, uint value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    } 
    function transferFrom(address from, address to, uint value) public  returns (bool) {
        if (allowance[from][msg.sender] != MAX_INT) {
            allowance[from][msg.sender] = allowance[from][msg.sender] - value ;
        }
        _transfer(from, to, value);
        return true;
    }

}
