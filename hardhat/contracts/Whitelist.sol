//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.17;

contract Whitelist {
    uint8 public maxWhitlistedAddresses;

    mapping(address => bool) public whitelistedAddresses;

    uint8 public numAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddress) {
        maxWhitlistedAddresses = _maxWhitelistedAddress;
    }

    function addAddressToWhitelist() public {
        require(!whitelistedAddresses[msg.sender], 'Sender has already been whitelisted');
        require(numAddressesWhitelisted < maxWhitlistedAddresses, 'Whitelist limit has been reached');
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}
