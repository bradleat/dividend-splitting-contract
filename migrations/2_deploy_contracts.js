var ShareholderAgreement = artifacts.require("./ShareholderAgreement.sol");

module.exports = function(deployer) {
  deployer.deploy(ShareholderAgreement, 100000);
};
