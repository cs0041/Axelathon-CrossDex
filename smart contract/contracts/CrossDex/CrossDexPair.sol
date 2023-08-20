// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CrossDexERC20.sol";

contract CrossDexPair is CrossDexERC20 {
    IERC20 public immutable token0;
    IERC20 public immutable token1;

    uint256 public reserve0;
    uint256 public reserve1;

    constructor(address _token0, address _token1)  {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }
    
    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;

    }

    function getAmountsIn(uint256 _amountOut,address _tokenIn) external  view returns(uint256 amountIn) {
         bool isToken0 = _tokenIn == address(token0);
        (uint256 reserveIn, uint256 reserveOut) = isToken0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
        
        amountIn =  ((reserveOut*reserveIn)/(reserveOut-_amountOut)) - reserveIn;
        return amountIn;
        
      
    }
    function getAmountsOut(uint256 _amountIn,address _tokenIn) external  view returns(uint256 amountOut) {
        bool isToken0 = _tokenIn == address(token0);
        (uint256 reserveIn, uint256 reserveOut) = isToken0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    

        uint256 amountInWithFee = (_amountIn * 1000) / 1000;
        amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
        return amountOut;
    }


    function _update(uint256 _reserve0, uint256 _reserve1) private {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
    }

    function swap(uint256 _amountIn,uint256 _amountOutMin, address _tokenIn,address to) external returns (uint256 amountOut) {
        require( _tokenIn != address(0),"CrossDex: Address Zero");
        require( _tokenIn == address(token0) || _tokenIn == address(token1), "CrossDex: Invalid token");
        require(_amountIn > 0, "CrossDex: Amount Zero");

        bool isToken0 = _tokenIn == address(token0);
        (IERC20 tokenIn, IERC20 tokenOut, uint256 reserveIn, uint256 reserveOut) = isToken0
            ? (token0, token1, reserve0, reserve1)
            : (token1, token0, reserve1, reserve0);

        require(_amountOutMin < reserveOut , "CrossDex: INSUFFICIENT_LIQUIDITY");

        tokenIn.transferFrom(msg.sender, address(this), _amountIn);


        // 0.0% fee
        uint256 amountInWithFee = (_amountIn * 1000) / 1000;
        amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
        require(amountOut>=_amountOutMin,"CrossDex: Slipage");

        tokenOut.transfer(to, amountOut);

        _update(token0.balanceOf(address(this)), token1.balanceOf(address(this)));
    }

    function addLiquidity(uint256 _amount0, uint256 _amount1,address to,bool isForceAdd) external returns (uint256 liquidity) {
        
        token0.transferFrom(msg.sender, address(this), _amount0);
        token1.transferFrom(msg.sender, address(this), _amount1);

        uint256 famount0;
        uint256 famount1;


        if (reserve0 > 0 || reserve1 > 0) {
            if(isForceAdd && reserve0 * _amount1 != reserve1 * _amount0){
                // try force amount0 frist 
                famount0 = _amount0;
                famount1 = (reserve1 * _amount0) / reserve0;
                if(famount1>_amount1){
                    // try  force amount1
                    famount0 = (reserve0 * _amount1) / reserve1;
                    famount1 = _amount1;
                    require(famount0 <= _amount0,"CrossDex: Fail ForceAdd");
                }
            }else{
                famount0 = _amount0;
                famount1 = _amount1;
            }

            // check equation
            {
                uint256 tempMul0 = (reserve0 * famount1);
                uint256 tempMul1 = (reserve1 * famount0);
                if( tempMul0 > tempMul1){
                    require( (tempMul0 - tempMul1)/ 10 ** 18 <= 1000, "CrossDex: INSUFFICIENT_AMOUNT x / y != dx / dy");
                }else{
                    require( (tempMul1 - tempMul0)/ 10 ** 18 <= 1000, "CrossDex: INSUFFICIENT_AMOUNT x / y != dx / dy");
                }

            }
        }else{
            famount0 = _amount0;
            famount1 = _amount1;
        }

        if (totalSupply == 0) {
            liquidity = _sqrt(famount0 * famount1);
        } else {
            liquidity = _min(
                (famount0 * totalSupply) / reserve0,
                (famount1 * totalSupply) / reserve1
            );
        }
        require(liquidity > 0, "CrossDex: Liquidity Zero");
        _mint(to, liquidity);

        // refund if not using all token add lp
        if(_amount0>famount0){
            token0.transfer(msg.sender,_amount0 - famount0);
        }
 
        if(_amount1>famount1){
            token1.transfer(msg.sender, _amount1 - famount1);
        }
 
        _update(token0.balanceOf(address(this)), token1.balanceOf(address(this)));
    }

    function removeLiquidity(uint256 liquidity, address to) external returns (uint256 amount0, uint256 amount1) {
        transferFrom(msg.sender, address(this), liquidity);

        uint256 bal0 = token0.balanceOf(address(this));
        uint256 bal1 = token1.balanceOf(address(this));

        amount0 = (liquidity * bal0) / totalSupply;
        amount1 = (liquidity * bal1) / totalSupply;
        require(amount0 > 0 && amount1 > 0, "CrossDex: amount0 or amount1 = 0");

        _burn(address(this), liquidity);
        _update(bal0 - amount0, bal1 - amount1);

        token0.transfer(to, amount0);
        token1.transfer(to, amount1);
    }

    function _sqrt(uint256 y) private pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        return x <= y ? x : y;
    }
}

 
 