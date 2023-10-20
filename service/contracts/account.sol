// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/access/Ownable.sol";
contract AccountFactory is Ownable {

    struct accountInfo {
        address addr;
        uint balance;
        uint providerBlockedFunds;
        uint recipientBlockedFunds;
        string info;
    }
    mapping (address => accountInfo) ownerToAccount;

    function register() public returns (accountInfo memory accountinfo) {
        // 测试这里是否能判断key是否存在
        if (ownerToAccount[msg.sender].addr == address(0)) {
            ownerToAccount[msg.sender] = accountInfo(msg.sender, 0, 0, 0, "");
        }
        return ownerToAccount[msg.sender];
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function cancellation() public  {
        delete(ownerToAccount[msg.sender]);
    }

    function setProviderInfo(string memory _info) public _needAccountExist(msg.sender){
        ownerToAccount[msg.sender].info = _info;
    }

    function onlineBlockedFund(address user, uint _stakeAmount) public {
        require(_stakeAmount <= ownerToAccount[user].balance, "balance not enough! please stake");
        ownerToAccount[user].balance -= _stakeAmount;
        ownerToAccount[user].providerBlockedFunds += _stakeAmount;
    }

    function offlineUnBlockedFund(address user, uint _stakeAmount) public {
        ownerToAccount[user].balance += _stakeAmount;
        ownerToAccount[user].providerBlockedFunds -= _stakeAmount;
    }

    function rentBlockedFund(address user, uint _stakeAmount) public {
        require(_stakeAmount <= ownerToAccount[user].balance, "balance not enough! please stake");
        ownerToAccount[user].balance -= _stakeAmount;
        ownerToAccount[user].recipientBlockedFunds += _stakeAmount;
    }

    function rentUnBlockedFund(address _recipient, address _provider, uint _stakeAmount, uint _unBlockedAmount) public {
        ownerToAccount[_recipient].recipientBlockedFunds -= _unBlockedAmount;
        if (_stakeAmount < _unBlockedAmount) {
            ownerToAccount[_recipient].balance += _unBlockedAmount - _stakeAmount;
        }
        ownerToAccount[_provider].balance += _stakeAmount;
    }

    // 这里如何判断质押多少代币呢
    function stake() payable public _needAccountExist(msg.sender) {
        accountInfo storage info = ownerToAccount[msg.sender];
        if (info.addr == address(0)) {
            info.addr = msg.sender;
            info.balance = msg.value;
            ownerToAccount[msg.sender] = info;
            return ;
        }
        ownerToAccount[msg.sender].balance = ownerToAccount[msg.sender].balance + msg.value;
    }

    function unstake(uint amount) payable public {
        accountInfo memory info = ownerToAccount[msg.sender];
        require(info.balance >= amount, "amount not enough");
        ownerToAccount[msg.sender].balance = ownerToAccount[msg.sender].balance - amount;
        payable(msg.sender).transfer(amount);
    }

    modifier _needAccountExist(address _user) {
        require(ownerToAccount[_user].addr != address(0), "need register first");
        _;
    }

    function isRegister(address _user) public view returns(bool){
        return ownerToAccount[_user].addr != address(0);
    }

    function getAccount(address _addr) view public _needAccountExist(_addr) returns (accountInfo memory)  {
        return ownerToAccount[_addr];
    }
}