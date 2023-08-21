// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/interfaceAxelraToken.sol";
import "./interface/interfaceExcuteAxelraDexMsg.sol";
 

// Import axelar libraries
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";

contract MainChainAxelraDexMsg is  Ownable, AxelarExecutable {
    // Store gas service
    IAxelarGasService public immutable gasService;
    IExcutenAxelraDexMsg public excuteAxelraDexMsg;
    mapping(bytes32 => string) public destinationAddressMapping;

    // Receive gateway and gas service
    constructor(
        IAxelarGateway _gateway,
        IAxelarGasService _gasService
    ) AxelarExecutable(address(_gateway)) {
        gasService = _gasService;
 
    }

    ////////////////////////////////////// Function but use like modifier ////////////////////////////////////// 
    function  checkDestinationAddressTokenMapping (address token, string memory destinationChain) private view   {
        require(IAToken(token).getDestinationAddressToken (destinationChain) != address(0),"Axelra: destinationTokenAddress zero");
    }
    function  checkDestinationAddressContract (string memory destinationAddress) pure  private    {
         require( bytes(destinationAddress).length != 0,"Axelra: destinationAddress zero" );
    }

    function setExcuteAxelraDexMsg(address _excuteAxelraDexMsg) public onlyOwner {
         excuteAxelraDexMsg = IExcutenAxelraDexMsg(_excuteAxelraDexMsg);
    }


    // Link contract in the destination chain
    event SetDestinationMapping(string chainName, string contractAddress);
    function setDestinationMapping(string calldata chainName, string calldata contractAddress) public onlyOwner {
        destinationAddressMapping[keccak256(abi.encode(chainName))] = contractAddress;
        emit SetDestinationMapping(chainName, contractAddress);
    }



    // Receive message
    event Unlock(address indexed to, uint8 action,address indexed tokenIn,uint amounIn);
    
    
    // bridgeToken
    function bridgeToken(
        string memory destinationChain,
        address[] memory addressToken,
        uint256[] memory amount,
        address to
    ) public payable {
        uint256 lengthAddressToken = addressToken.length;
        require(lengthAddressToken == amount.length,"Axelra: length addressToken must = length amount");
        // TODO: Fetch destinationAddress from destinationChain
        string memory destinationAddress = destinationAddressMapping[keccak256(abi.encode(destinationChain))];
        checkDestinationAddressContract(destinationAddress);
        
        address[] memory mappingAddressToken = new address[](lengthAddressToken);
        for(uint256 i = 0 ; i<lengthAddressToken;i++){
            checkDestinationAddressTokenMapping(addressToken[i],destinationChain);
            excuteAxelraDexMsg.burnToken(addressToken[i], msg.sender, amount[i]);
            mappingAddressToken[i] = IAToken(addressToken[i]).getDestinationAddressToken(destinationChain);
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
        (address _sender, uint8 _action, bytes memory _payload) = abi.decode(payload, (address,uint8,bytes));

        if(_action == 0){
            try excuteAxelraDexMsg.excuteBridgeSwap(_payload) {
            } catch {
                excuteAxelraDexMsg.handleFailedBridgeSwap(_sender,sourceChain,_payload);
            }
        }
        if(_action == 1){
            // no need to handle error
            excuteAxelraDexMsg.excuteBridgeToken(_payload);
        }
        if(_action == 2){
            try excuteAxelraDexMsg.excuteBridgeAddLiquidity(_payload) {
            } catch {
                excuteAxelraDexMsg.handleFailedBridgeAddLiquidity(_sender,sourceChain,_payload);
            }

        }
        if(_action == 3){
           // no need to handle error
           excuteAxelraDexMsg.excuteBridgeRemoveLiquidity(_sender,_payload);
        }
    }


    
}