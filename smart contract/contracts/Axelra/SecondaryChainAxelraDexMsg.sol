// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../CrossDex/interface/interfaceCrossDexRouter.sol";
import "../CrossDex/interface/interfaceCrossDexFactory.sol";
import "../CrossDex/interface/interfaceCrossDexPair.sol";
import "../CrossDex/interface/interfaceCrossDexERC20.sol";
import "./interface/interfaceAxelraToken.sol";

// Import axelar libraries
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";

contract SecondaryChainAxelraDexMsg is  Ownable, AxelarExecutable,ReentrancyGuard {
    // Store gas service
    IAxelarGasService public immutable gasService;
    mapping(bytes32 => string) public destinationAddressMapping;
    string public contractMainChainName;

    // Receive gateway and gas service
    constructor(
        IAxelarGateway _gateway,
        IAxelarGasService _gasService,
        string memory _contractMainChainName
    ) AxelarExecutable(address(_gateway)) {
        gasService = _gasService;
        contractMainChainName = _contractMainChainName;
    }

    ////////////////////////////////////// Function but use like modifier ////////////////////////////////////// 
    function  checkDestinationAddressTokenMapping (address token, string memory destinationChain) private view   {
        require(IAToken(token).getDestinationAddressToken (destinationChain) != address(0),"Axelra: destinationTokenAddress zero");
    }
    function  checkDestinationAddressContract (string memory destinationAddress) pure  private    {
         require( bytes(destinationAddress).length != 0,"Axelra: destinationAddress zero" );
    }

    // Link contract in the destination chain
    event SetDestinationMapping(string chainName, string contractAddress);
    function setDestinationMapping(string calldata chainName, string calldata contractAddress) public onlyOwner {
        destinationAddressMapping[keccak256(abi.encode(chainName))] = contractAddress;
        emit SetDestinationMapping(chainName, contractAddress);
    }


    // bridgeSwap
    function bridgeSwap(
        uint256 amountIn,
        uint256 amountOutMin,
        address addressTokenIN, 
        address addressTokenOut, 
        address destinationAddressReceiveToken,
        string memory destinationChainReceiveToken
    ) external payable nonReentrant{
        // TODO: Fetch destinationAddress from destinationChain
        string memory destinationAddress = destinationAddressMapping[keccak256(abi.encode(contractMainChainName))];
        string memory destinationAddressChainReceiveToken = destinationAddressMapping[keccak256(abi.encode(destinationChainReceiveToken))];

        checkDestinationAddressContract(destinationAddress);
        checkDestinationAddressContract(destinationAddressChainReceiveToken);
        checkDestinationAddressTokenMapping(addressTokenIN,destinationChainReceiveToken);
        checkDestinationAddressTokenMapping(addressTokenOut,destinationChainReceiveToken);
        checkDestinationAddressTokenMapping(addressTokenIN,contractMainChainName);
        checkDestinationAddressTokenMapping(addressTokenOut,contractMainChainName);

  
        IAToken(addressTokenIN).burn(msg.sender, amountIn);

        bytes memory swapPayload = abi.encode(
            amountIn,
            amountOutMin,
            IAToken(addressTokenIN).getDestinationAddressToken(contractMainChainName) ,
            IAToken(addressTokenOut).getDestinationAddressToken(contractMainChainName),
            destinationAddressReceiveToken,
            destinationChainReceiveToken
            );
        bytes memory payload = abi.encode(msg.sender, 0,swapPayload);

        // TODO: Pay gas fee to gas receiver contract
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
                address(this),
                contractMainChainName,
                destinationAddress,
                payload,
                msg.sender
            );
        }

        // TODO: Submit a cross-chain message passing transaction
        gateway.callContract(contractMainChainName, destinationAddress, payload);
    }

    // bridgeRemoveLiquidity
    function bridgeRemoveLiquidity(
        uint256 amountliquidity,
        address token0, 
        address token1, 
        address destinationAddressReceiveToken,
        string memory destinationChainReceiveToken
    ) external payable nonReentrant{
        // TODO: Fetch destinationAddress from destinationChain
        string memory destinationAddress = destinationAddressMapping[keccak256(abi.encode(contractMainChainName))];
        string memory destinationAddressChainReceiveToken = destinationAddressMapping[keccak256(abi.encode(destinationChainReceiveToken))];

        checkDestinationAddressContract(destinationAddressChainReceiveToken);
        checkDestinationAddressContract(destinationAddress);
        checkDestinationAddressTokenMapping(token0,destinationChainReceiveToken);
        checkDestinationAddressTokenMapping(token1,destinationChainReceiveToken);
        checkDestinationAddressTokenMapping(token0,contractMainChainName);
        checkDestinationAddressTokenMapping(token1,contractMainChainName);

        bytes memory removeLiquidityPayload = abi.encode(
            amountliquidity,
            IAToken(token0).getDestinationAddressToken(contractMainChainName) ,
            IAToken(token1).getDestinationAddressToken(contractMainChainName),
            destinationAddressReceiveToken,
            destinationChainReceiveToken
            );
        bytes memory payload = abi.encode(msg.sender, 3, removeLiquidityPayload);

        // TODO: Pay gas fee to gas receiver contract
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
                address(this),
                contractMainChainName,
                destinationAddress,
                payload,
                msg.sender
            );
        }

        // TODO: Submit a cross-chain message passing transaction
        gateway.callContract(contractMainChainName, destinationAddress, payload);
    }

    // bridgeAddLiquidity
    function bridgeAddLiquidity(
        uint256 amount0,
        uint256 amount1,
        address addressToken0, 
        address addressToken1, 
        bool isForceAdd,
        address destinationAddressReceiveToken,
        string memory destinationChainReceiveToken
    ) external payable nonReentrant{
        // TODO: Fetch destinationAddress from destinationChain
        string memory destinationAddress = destinationAddressMapping[keccak256(abi.encode(contractMainChainName))];
        string memory destinationAddressChainReceiveToken = destinationAddressMapping[keccak256(abi.encode(destinationChainReceiveToken))];


        checkDestinationAddressContract(destinationAddressChainReceiveToken);
        checkDestinationAddressContract(destinationAddress);
        checkDestinationAddressTokenMapping(addressToken0,destinationChainReceiveToken);
        checkDestinationAddressTokenMapping(addressToken1,destinationChainReceiveToken);
        checkDestinationAddressTokenMapping(addressToken0,contractMainChainName);
        checkDestinationAddressTokenMapping(addressToken1,contractMainChainName);
     
        IAToken(addressToken0).burn(msg.sender, amount0);
        IAToken(addressToken1).burn(msg.sender, amount1);

        bytes memory addLiquidityPayload = abi.encode(
            amount0,
            amount1,
            IAToken(addressToken0).getDestinationAddressToken(contractMainChainName) ,
            IAToken(addressToken1).getDestinationAddressToken(contractMainChainName),
            isForceAdd,
            destinationAddressReceiveToken,
            destinationChainReceiveToken
            );
        bytes memory payload = abi.encode(msg.sender, 2,addLiquidityPayload);

        // TODO: Pay gas fee to gas receiver contract
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
                address(this),
                contractMainChainName,
                destinationAddress,
                payload,
                msg.sender
            );
        }

        // TODO: Submit a cross-chain message passing transaction
        gateway.callContract(contractMainChainName, destinationAddress, payload);
    }

    // bridgeToken
    function bridgeToken(
        string memory destinationChain,
        address[] memory addressToken,
        uint256[] memory amount,
        address to
    ) public payable nonReentrant{
        uint256 lengthAddressToken = addressToken.length;
        require(lengthAddressToken == amount.length,"Axelra: length addressToken must = length amount");
        // TODO: Fetch destinationAddress from destinationChain
        string memory destinationAddress = destinationAddressMapping[keccak256(abi.encode(destinationChain))];

        checkDestinationAddressContract(destinationAddress);
        
        address[] memory mappingAddressToken = new address[](lengthAddressToken);
        for(uint256 i = 0 ; i<lengthAddressToken;i++){
            checkDestinationAddressTokenMapping(addressToken[i],destinationChain);
            IAToken(addressToken[i]).burn(msg.sender, amount[i]);
            mappingAddressToken[i] = IAToken(addressToken[i]).getDestinationAddressToken (destinationChain);
        }


        bytes memory bridgeTokenPayload = abi.encode(mappingAddressToken,amount,to);
        bytes memory payload = abi.encode(msg.sender, 1,bridgeTokenPayload);

        // TODO: Pay gas fee to gas receiver contract
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }

        // TODO: Submit a cross-chain message passing transaction
        gateway.callContract(destinationChain, destinationAddress, payload);

    }

    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        // TODO: Validate sourceChain and sourceAddress
        require(
            keccak256(abi.encode(sourceAddress)) == keccak256(abi.encode( destinationAddressMapping[
                keccak256(abi.encode(sourceChain))
            ] )),
            "Axelra: Forbidden"
        );

        // TODO: Decode payload
        ( , uint8 _action, bytes memory _payload) = abi.decode(payload, (address,uint8,bytes));

        if(_action == 1){
            excuteBridgeToken(_payload);
        }

 
    }


    function excuteBridgeToken(bytes memory payload) internal {
        (address[] memory  addressTokens, uint256[] memory amounts,address to) =  abi.decode(payload, (address[],uint256[],address));
        for (uint256 i = 0; i<addressTokens.length; i++) {
            IAToken(addressTokens[i]).mint(to, amounts[i]);     
        }
    }
 
}