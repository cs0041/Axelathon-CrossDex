// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
 
import "../CrossDex/interface/interfaceCrossDexRouter.sol";
import "../CrossDex/interface/interfaceCrossDexFactory.sol";
import "../CrossDex/interface/interfaceCrossDexPair.sol";
import "../CrossDex/interface/interfaceCrossDexERC20.sol";
import "./interface/interfaceAxelraToken.sol";
import "./interface/interfaceMainChainAxelraDexMsg.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 
contract ExcuteMainChainAxelraDexMsg is Ownable {

    ICrossDexRouter public crossDexRouter;
    ICrossDexFactory public crossDexFactory;
    IMainChainAxelraDexMsg public axelraDexMsg;
    string public contractChainName;


    modifier onlyAxelraDexMsg() {
        require(msg.sender ==  address(axelraDexMsg), "ExcuteAxelra: Caller must from AxelraDexMsg");
        _;
    }

    constructor(
        IMainChainAxelraDexMsg _axelraDexMsg,
        string memory _contractChainName
    )   {
        axelraDexMsg = _axelraDexMsg;
        contractChainName = _contractChainName;

    }

    function setCrossDexRouter(ICrossDexRouter _crossDexRouter) public onlyOwner {
        crossDexRouter = _crossDexRouter;
    }

    function setCrossDexFactory(ICrossDexFactory _crossDexFactory) public onlyOwner {
        crossDexFactory = _crossDexFactory;
    }


    function excuteBridgeAddLiquidity(bytes memory payload) external onlyAxelraDexMsg  {
        ( uint256 amount0, uint256 amount1, address addressToken0,  address addressToken1, bool isForceAdd,  address destinationAddressReceiveToken, string memory destinationChainReceiveToken) =  abi.decode(payload, (uint256,uint256,address,address,bool,address,string));
 
        IAToken(addressToken0).mint(address(this), amount0);
        IAToken(addressToken1).mint(address(this), amount1);

        IAToken(addressToken0).approve(address(crossDexRouter),amount0);
        IAToken(addressToken1).approve(address(crossDexRouter),amount1);

        if (keccak256(abi.encodePacked(destinationChainReceiveToken)) == keccak256(abi.encodePacked(contractChainName))) {
            crossDexRouter.addLiquidity(amount0, amount1, addressToken0, addressToken1,isForceAdd, destinationAddressReceiveToken, (block.timestamp + 20 minutes))  ;
        }else{

            address pairLP = crossDexFactory.getPair(addressToken0, addressToken1);
            
            uint256 beforeAddLiquidityBalanceToken0 = IAToken(addressToken0).balanceOf(address(this));
            uint256 beforeAddLiquidityBalanceToken1 = IAToken(addressToken1).balanceOf(address(this));
            uint256 beforeSwapBalanceLP = ICrossDexPair(pairLP).balanceOf(address(this));
            crossDexRouter.addLiquidity(amount0, amount1, addressToken0, addressToken1,isForceAdd, address(this), (block.timestamp + 20 minutes));
            uint256 amountToSendToken0 = IAToken(addressToken0).balanceOf(address(this)) - (beforeAddLiquidityBalanceToken0-amount0);
            uint256 amountToSendToken1 = IAToken(addressToken1).balanceOf(address(this)) - (beforeAddLiquidityBalanceToken1-amount1);
            uint256 amountToSendLP = ICrossDexPair(pairLP).balanceOf(address(this)) - beforeSwapBalanceLP;
            ICrossDexPair(pairLP).transfer(destinationAddressReceiveToken,amountToSendLP);

            if(amountToSendToken0 > 0 || amountToSendToken1 >0){
                address[] memory addressTokens = new address[](2);
                uint256[] memory amount = new uint256[](2);
                addressTokens[0] = addressToken0;
                amount[0] = amountToSendToken0;
                addressTokens[1] = addressToken1;
                amount[1] = amountToSendToken1;

                axelraDexMsg.bridgeToken(destinationChainReceiveToken,  addressTokens , amount, destinationAddressReceiveToken);
            }
        }
    }
    
    function excuteBridgeSwap(bytes memory payload) external onlyAxelraDexMsg {
        ( uint256 amountIn, uint256 amountOutMin, address addressTokenIN,  address addressTokenOut,   address destinationAddressReceiveToken, string memory destinationChainReceiveToken) =  abi.decode(payload, (uint256,uint256,address,address,address,string));
 
        IAToken(addressTokenIN).mint(address(this), amountIn);
        IAToken(addressTokenIN).approve(address(crossDexRouter),amountIn);
        if (keccak256(abi.encodePacked(destinationChainReceiveToken)) == keccak256(abi.encodePacked(contractChainName))) {
            crossDexRouter.swapExactTokensForTokens(amountIn,amountOutMin,addressTokenIN,addressTokenOut ,destinationAddressReceiveToken,(block.timestamp + 20 minutes));
        }else{
            uint256 beforeSwapBalance = IAToken(addressTokenOut).balanceOf(address(this));
            crossDexRouter.swapExactTokensForTokens(amountIn,amountOutMin, addressTokenIN, addressTokenOut, address(this),(block.timestamp + 20 minutes));
            uint256 AfterSwapBalance = IAToken(addressTokenOut).balanceOf(address(this));
            uint256 amountToSend = AfterSwapBalance - beforeSwapBalance;

            address[] memory addressTokens = new address[](1);
            uint256[] memory amount = new uint256[](1);
            addressTokens[0] = addressTokenOut;
            amount[0] = amountToSend;

            axelraDexMsg.bridgeToken(destinationChainReceiveToken,  addressTokens, amount, destinationAddressReceiveToken);
        }
    }


    function excuteBridgeRemoveLiquidity(address sender,bytes memory payload) external onlyAxelraDexMsg { 
        ( uint256 liquidity, address token0,  address token1,   address destinationAddressReceiveToken, string memory destinationChainReceiveToken) =  abi.decode(payload, (uint256,address,address,address,string));

        address pairLP = crossDexFactory.getPair(token0, token1);

        require(ICrossDexPair(pairLP).balanceOf(sender) >= liquidity,"ExcuteAxelra: INSUFFICIENT_USER_LIQUIDITY");
        if (keccak256(abi.encodePacked(destinationChainReceiveToken)) == keccak256(abi.encodePacked(contractChainName))) {
            ICrossDexPair(pairLP).removeLiquidityByAxelra(liquidity,sender,destinationAddressReceiveToken);
        }else{
            uint256 beforeRemoveLiquidityBalanceToken0 = IAToken(token0).balanceOf(address(this));
            uint256 beforeRemoveLiquidityBalanceToken1 = IAToken(token1).balanceOf(address(this));
            ICrossDexPair(pairLP).removeLiquidityByAxelra(liquidity,sender,address(this));
            uint256 afterRemoveLiquidityBalanceToken0 = IAToken(token0).balanceOf(address(this));
            uint256 afterRemoveLiquidityBalanceToken1 = IAToken(token1).balanceOf(address(this));
            uint256 amountToSendToken0 = afterRemoveLiquidityBalanceToken0 - beforeRemoveLiquidityBalanceToken0;
            uint256 amountToSendToken1 = afterRemoveLiquidityBalanceToken1 - beforeRemoveLiquidityBalanceToken1;

            address[] memory addressTokens = new address[](2);
            uint256[] memory amount = new uint256[](2);
            addressTokens[0] = token0;
            addressTokens[1] = token1;
            amount[0] = amountToSendToken0;
            amount[1] = amountToSendToken1;

           axelraDexMsg.bridgeToken(destinationChainReceiveToken,  addressTokens, amount, destinationAddressReceiveToken);
        }
    }

    function excuteBridgeToken(bytes memory payload) external onlyAxelraDexMsg{
        (address[] memory  addressTokens, uint256[] memory amounts,address to) =  abi.decode(payload, (address[],uint256[],address));
        for (uint256 i = 0; i<addressTokens.length; i++) {
            IAToken(addressTokens[i]).mint(to, amounts[i]);     
        }
    }

   function handleFailedBridgeSwap(address _sender,string calldata sourceChain,bytes memory payload) external onlyAxelraDexMsg {
        ( uint256 amountIn, , address addressTokenIN, ,  , ) =  abi.decode(payload, (uint256,uint256,address,address,address,string));

            IAToken(addressTokenIN).mint(address(this), amountIn);        
       
            address[] memory addressTokens = new address[](1);
            uint256[] memory amount = new uint256[](1);
            addressTokens[0] = addressTokenIN;
            amount[0] = amountIn;

            axelraDexMsg.bridgeToken(sourceChain,  addressTokens, amount, _sender);
    }

    function handleFailedBridgeAddLiquidity(address _sender,string calldata sourceChain,bytes memory payload) external onlyAxelraDexMsg {
         ( uint256 amount0, uint256 amount1, address addressToken0,  address addressToken1, , , ) =  abi.decode(payload, (uint256,uint256,address,address,bool,address,string));
            
            IAToken(addressToken0).mint(address(this), amount0);      
            IAToken(addressToken1).mint(address(this), amount1);      
 
            address[] memory addressTokens = new address[](2);
            uint256[] memory amount = new uint256[](2);
            addressTokens[0] = addressToken0;
            amount[0] = amount0;
            addressTokens[1] = addressToken1;
            amount[1] = amount1;

            axelraDexMsg.bridgeToken(sourceChain,  addressTokens, amount, _sender);
    }
    

    function mintToken(address token,address to, uint256 amount) external onlyAxelraDexMsg{
        IAToken(token).mint(to, amount);
    }
    
    function burnToken(address token,address to, uint256 amount) external onlyAxelraDexMsg{
        IAToken(token).burn(to, amount);
    }
    
 
}