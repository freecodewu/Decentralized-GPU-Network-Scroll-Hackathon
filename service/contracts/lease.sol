// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "./device.sol";

enum leaseType {Machine, Developer}
enum billingStatus {UnPayed, Payed, UnValid}
enum billingType {ProviderStake, DeveloperRent, TreasureBilling}

struct billingInfo {
    address user;
    // 质押的token, 后续需要返还账户
    uint id;
    uint leaseId;
    uint providerBlockedFund;
    uint recipientBlockedFunds;
    // 涉及的金额
    uint amount;  // 结算时候, 才会出现, 跟lease有关
    billingStatus status;
    billingType billType;
}

struct leaseInfo {
    address owner;
    uint leaseId;
    uint startTime;
    uint expireTime;
    uint deviceId;
}

contract Lease is Device {
    uint private leaseId = 0;
    uint private recipientLeaseId = 0;
    uint8 public platformSharingRatio = 0;


    leaseInfo [] public leaseProvider;
    leaseInfo [] public leaseRecipient;
    // leaseInfo [] public leaseDeveloper;

    function onlineLease(address _owner, uint _devcieId, uint _startTime, uint _endTime) internal returns(uint){
        leaseId = leaseId + 1;
        // deviceInfo memory device = devices[_devcieId];
        leaseProvider.push(leaseInfo(_owner, leaseId, _startTime, _endTime, _devcieId));
        return leaseId;
    }

    function providerStakeCalcute(uint _startTime, uint _endTime, Price memory _price) pure public returns(uint) {
        if ((_endTime - _startTime) > 3600) {
            return _price.serverPrice * 3600;
        }
        return _price.serverPrice * (_endTime - _startTime);
    }

    function recipientStakeCalcute(uint _startTime, uint _endTime, Price memory _price) pure public returns(uint) {
        return _price.serverPrice * (_endTime - _startTime);
    }

    function createRentLease(uint _deviceId, uint _startTime, uint _endTime) internal _curDeviceLease(_deviceId) returns (uint) {
        recipientLeaseId = recipientLeaseId + 1;
        leaseRecipient.push(leaseInfo(msg.sender, recipientLeaseId, _startTime, _endTime, _deviceId));
        return recipientLeaseId;

    }
    function renewalRentLease(uint _leaseId, uint _endTime) internal returns (leaseInfo memory) {
        // uint _period =  _endTime - leaseRecipient[_leaseId - 1].expireTime;
        if (leaseRecipient[_leaseId - 1].expireTime < _endTime) {
            leaseRecipient[_leaseId - 1].expireTime = _endTime;
        }
        return leaseRecipient[_leaseId - 1];
    }

    function terminateLease(uint _leaseId) public returns(leaseInfo memory) {
        leaseRecipient[_leaseId - 1].expireTime = block.timestamp;
        return leaseRecipient[_leaseId - 1];
    }

    function getLeaseByDeviceId(uint _deviceId) view public returns(leaseInfo memory) {
        for (uint i = leaseProvider.length - 1; i < leaseProvider.length; i--) {
            if (leaseProvider[i].deviceId == _deviceId) {
                return leaseProvider[i];
            }
        }

        revert("can't find lease!");
    }

    modifier _curDeviceLease(uint _deviceId) {

        // for (uint i = leaseRecipient.length - 1; i >= 0; i--) {
        //     if (leaseRecipient[i].deviceId == _deviceId) {
        //         require(leaseRecipient[i].expireTime > block.timestamp, "device already has lease");
        //     }
        // }
        _;
    }


    function concatenateStrings(string memory a, string memory b) public pure returns (string memory) {
        bytes memory strA = bytes(a);
        bytes memory strB = bytes(b);

        bytes memory result = new bytes(strA.length + strB.length);
        
        uint256 k = 0;
        for (uint256 i = 0; i < strA.length; i++) {
            result[k++] = strA[i];
        }
        
        for (uint256 i = 0; i < strB.length; i++) {
            result[k++] = strB[i];
        }
        
        return string(result);
    }

    function uintToString(uint256 number) public pure returns (string memory) {
        if (number == 0) {
            return "0";
        }
        
        uint256 temp = number;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        uint256 _index = digits - 1;
        
        while (number != 0) {
            buffer[_index--] = bytes1(uint8(48 + number % 10));
            number /= 10;
        }
        
        return string(buffer);
    }

}

// contract Billing is Lease{

//     function settle(billingInfo memory _billingInfo) internal {

//     }

//     function invalid(billingInfo memory _billInfo) internal{

//     }
// }

contract Billing is Lease {
    uint private providerBillingCounter = 0;
    uint private recipientBillingCounter = 0;
    billingInfo [] public providerBillings;
    billingInfo [] public recipientBillings;

    function getRecipientBillingByLeaseId(uint _leaseId) view public returns(billingInfo memory) {
        for (uint i = 0; i < recipientBillings.length; i++) {
            if (recipientBillings[i].leaseId == _leaseId) {
                return providerBillings[i];
            }
        }
        revert("can't find billing!");
    }
    function getProviderBillingByLeaseId(uint _leaseId) view public returns(billingInfo memory) {
        for (uint i = 0; i < providerBillings.length; i++) {
            if (providerBillings[i].leaseId == _leaseId) {
                return providerBillings[i];
            }
        }
        revert("can't find billing!");
    }

    function providerOfflineBilling(uint _billId) internal {
        if (providerBillings[_billId - 1].status == billingStatus.Payed) {
            revert("stake amount has already unblocked");
        }
        providerBillings[_billId - 1].status = billingStatus.Payed;
    }

    function providerOnlineBilling(uint _leaseId, uint _stakeAmount) internal {
        // 生成一个账单, 
        providerBillingCounter = providerBillingCounter + 1;
        providerBillings.push(billingInfo(msg.sender, providerBillingCounter, _leaseId, _stakeAmount, 0, 0, billingStatus.UnPayed, billingType.ProviderStake));
    }

    function createRentBilling(uint _leaseId, uint _stakeAmount) internal {

        // 生成一个账单, 
        recipientBillingCounter = recipientBillingCounter + 1;
        recipientBillings.push(billingInfo(msg.sender, recipientBillingCounter, _leaseId, 0, _stakeAmount, 0, billingStatus.UnPayed, billingType.DeveloperRent));
    }

    function renewalRentBilling(uint _billId, uint _stakeAmount) internal returns (uint) {
        if (_stakeAmount > recipientBillings[_billId - 1].recipientBlockedFunds) {
            uint extraStakeAmount = _stakeAmount - recipientBillings[_billId - 1].recipientBlockedFunds;
            recipientBillings[_billId - 1].recipientBlockedFunds = _stakeAmount;
            return extraStakeAmount;
        }
        return 0;
    }
    
    function terminateBilling(uint _billId, uint _stakeAmount) internal returns (uint){
        
        recipientBillings[_billId - 1].status = billingStatus.Payed;
        recipientBillings[_billId - 1].amount = _stakeAmount;
        return  recipientBillings[_billId - 1].recipientBlockedFunds;
    }

}


// struct billingInfo {
//     address user;
//     // 质押的token, 后续需要返还账户
//     uint providerBlockedFund;
//     uint recipientBlockedFunds;
//     // 涉及的金额
//     uint amount;  // 结算时候, 才会出现, 跟lease有关
//     billingStatus status;
//     billingType billType;
// }