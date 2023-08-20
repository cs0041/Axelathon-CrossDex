// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

 
import "./interface/interfaceCrossDexPair.sol";
import "./interface/interfaceCrossDexFactory.sol";
import "./interface/interfaceCrossDexERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrossDexRouter {

    ICrossDexFactory public immutable factory;

    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "CrossDex: EXPIRED");
        _;
    }

    constructor(address _factory) {
        factory = ICrossDexFactory(_factory);
    }

    function addLiquidity(uint256 amount0, uint256 amount1, address token0, address token1,bool isForceAdd, address to, uint256 deadline)  public  ensure(deadline) {
        address crossDexPair = factory.getPair(token0,token1);
         // create the pair if it doesn't exist yet
        if (crossDexPair == address(0)) {
            factory.createPair( token0,  token1);
            crossDexPair = factory.getPair(token0,token1);
        }
        require(crossDexPair != address(0),"CrossDex: Pair not exist");

        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        IERC20(token0).approve(crossDexPair,amount0);
        IERC20(token1).approve(crossDexPair,amount1);

        ICrossDexPair(crossDexPair).addLiquidity(amount0,amount1,to,isForceAdd);
    }

    function removeLiquidity(uint256 liquidity,  address token0, address token1, address to, uint256 deadline) public  ensure(deadline) {
        address crossDexPair = factory.getPair(token0,token1);
        require(crossDexPair != address(0),"CrossDex: Pair not exist");

        ICrossDexERC20(crossDexPair).transferFrom(msg.sender,address(this), liquidity);
        ICrossDexERC20(crossDexPair).approve(crossDexPair,liquidity);

        ICrossDexPair(crossDexPair).removeLiquidity(liquidity,to);
    }

    function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin, address tokenIn, address tokenOut, address to, uint256 deadline) public  ensure(deadline)  {
        address crossDexPair = factory.getPair(tokenIn,tokenOut);
        require(crossDexPair != address(0),"CrossDex: Pair not exist");

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(crossDexPair,amountIn);
  
        ICrossDexPair(crossDexPair).swap(amountIn,amountOutMin, tokenIn,to);
    }

    function getAmountsIn(uint256 amountOut, address tokenIn, address tokenOut) public view returns (uint256 amountIn) {
        address crossDexPair = factory.getPair(tokenIn,tokenOut);
        amountIn = ICrossDexPair(crossDexPair).getAmountsIn(amountOut,tokenIn);
    }
    
    function getAmountsOut(uint256 amountIn, address tokenIn, address tokenOut) public view returns (uint256 amountOut) {
        address crossDexPair = factory.getPair(tokenIn,tokenOut);
        amountOut = ICrossDexPair(crossDexPair).getAmountsOut(amountIn,tokenIn);
    }

    function quote(uint256 amount0, uint256 reserve0, uint256 reserve1) public pure returns (uint256 amount1) {
        require(amount0 > 0, "CrossDex: INSUFFICIENT_AMOUNT");
        require(reserve0 > 0 && reserve1 > 0, "CrossDex: INSUFFICIENT_LIQUIDITY");
        amount1 = ( amount0 * reserve1) / reserve0;
    }


    

}