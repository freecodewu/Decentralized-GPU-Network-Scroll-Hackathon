var HelperContract = artifacts.require("Helper");
var AccountFactoryContract = artifacts.require("AccountFactory");

module.exports = function(deployer) {
    // 部署步骤
    deployer.deploy(AccountFactoryContract).then(function(){
      return deployer.deploy(HelperContract, AccountFactoryContract.address);
    });
  };