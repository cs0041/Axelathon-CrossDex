// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/access/Ownable.sol";

import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";

contract AxelraCrossDexMsg is Ownable, AxelarExecutable {
    uint256 public number;
    IAxelarGasService public immutable gasService;
    mapping(bytes32 => string) public destinationAddressMapping; // destinationAddressMapping[keccak256(destinationChain)] => destinationAddress / token contract

    constructor(
        address gateway_, address gasService_
    ) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasService_);
    }

    event SetDestinationAddress(string destinationChain, string destinationAddress);
    function setDestinationAddress(string calldata destinationChain, string calldata destinationAddress) public onlyOwner {
        destinationAddressMapping[keccak256(abi.encode(destinationChain))] = destinationAddress;
        emit SetDestinationAddress(destinationChain, destinationAddress);
    }

    function bridge(
        string calldata destinationChain,
        uint256 amount
    ) external payable {
        // TODO: Fetch destinationAddress from destinationChain
        string memory destinationAddress = destinationAddressMapping[keccak256(abi.encode(destinationChain))];

        if( bytes(destinationAddress).length == 0 ){
            revert("destinationAddress zero");
        }

        // TODO
        number++;
        // TODO: ABI encode payload
        bytes memory payload = abi.encode(msg.sender, amount);

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

        // TODO: Emit event
    }

    event Unlock(address indexed to, uint256 amount);

    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        // TODO: Validate sourceChain and sourceAddress
        require(
            keccak256(abi.encode(sourceAddress)) == keccak256(abi.encode( destinationAddressMapping[keccak256(abi.encode(sourceChain))] )),
            "Malicious"
        );

        // TODO: Decode payload
        (address to, uint256 amount) = abi.decode(payload, (address, uint256));

        // TODO
         number++;

        // TODO: Emit event
    }
}