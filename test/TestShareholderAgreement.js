var ShareholderAgreement = artifacts.require("./ShareholderAgreement.sol");

contract('ShareholderAgreement', function(accounts) {
  it("should put 100000 shares in the first account", function() {
    return ShareholderAgreement.deployed().then(function(instance) {
      return instance.getSharesFor.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 100000, "100000 wasn't in the first account");
    });
  });
  it("should attribute profit correctly if profit sent", function() {
    var agreement;
    return ShareholderAgreement.deployed().then(function(instance) {
      agreement = instance;
      return agreement.sendTransaction({from: accounts[0], value: web3.toWei(500, 'finney')});
    }).then(function(a) {
      return agreement.amountOfDividendOwed.call(accounts[0]);
    }).then(function (dividendOwed) {
      assert.equal(dividendOwed.valueOf(), web3.toWei(500, 'finney'), "profits weren't attributed");
    });
  });
  it("should payout profit correctly", function() {
    var agreement;
    return ShareholderAgreement.deployed().then(function(instance) {
      agreement = instance;
      return agreement.sendTransaction({from: accounts[0], value: web3.toWei(500, 'finney')});
    }).then(function(a) {
      return agreement.payoutDividendOwed({from: accounts[0]});
    }).then(function (res) {
      assert.equal(res.logs[0].event, 'DividendPaid', "dividend wasn't paid");
      assert.equal(res.logs[0].args.value.valueOf(), web3.toWei(1000, 'finney'), "profits weren't paid correctly");
    });
  });
  
  it("should allow a vote to be proposed and passed", function() {
    var agreement;
    return ShareholderAgreement.deployed().then(function(instance) {
      agreement = instance;
      return agreement.proposeVote(10, 10, accounts[0]);
    }).then(function() {
      return agreement.vote(1);
    }).then(function (res) {
      assert.equal(res.logs[0].event, 'ProposalPassed', "proposal wasn't passed");
    });
  });
  it("should allow someone to buy shares", function() {
    var agreement;
    return ShareholderAgreement.deployed().then(function(instance) {
      agreement = instance;
      return agreement.buyShares(1, 5, {from: accounts[0], value: 50});
    }).then(function(res) {
      assert.equal(res.logs[0].event, 'SharesIssued', "shares weren't issued");
    });
  });
  it("should payout profit correctly", function() {
    var agreement;
    return ShareholderAgreement.deployed().then(function(instance) {
      agreement = instance;
      return agreement.sendTransaction({from: accounts[0], value: web3.toWei(500, 'finney')});
    }).then(function(a) {
      return agreement.payoutDividendOwed({from: accounts[0]});
    }).then(function (res) {
      assert.equal(res.logs[0].event, 'DividendPaid', "dividend wasn't paid");
      assert.equal(res.logs[0].args.value.valueOf(), web3.toWei(500, 'finney'), "profits weren't paid correctly");
    });
  });
  it("should allow someone to buy shares", function() {
    var agreement;
    return ShareholderAgreement.deployed().then(function(instance) {
      agreement = instance;
      return agreement.buyShares(1, 5, {from: accounts[0], value: 50});
    }).then(function(res) {
      assert.equal(res.logs[0].event, 'SharesIssued', "shares weren't issued");
    });
  });
  it("should payout profit correctly", function() {
    var agreement;
    return ShareholderAgreement.deployed().then(function(instance) {
      agreement = instance;
      return agreement.sendTransaction({from: accounts[0], value: web3.toWei(500, 'finney')});
    }).then(function(a) {
      return agreement.payoutDividendOwed({from: accounts[0]});
    }).then(function (res) {
      assert.equal(res.logs[0].event, 'DividendPaid', "dividend wasn't paid");
      assert.equal(res.logs[0].args.value.valueOf(), web3.toWei(500, 'finney'), "profits weren't paid correctly");
    });
  });
  it("can transfer 50000 shares to a second account", function() {
    var agreement;
    return ShareholderAgreement.deployed().then(function(instance) {
      agreement = instance;
      return agreement.transfer(accounts[1], 50000);
    }).then(function(res) {
      return agreement.getSharesFor.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 50010, "50000 wasn't in the first account");
    }).then(function(res) {
      return agreement.getSharesFor.call(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 50000, "50000 wasn't in the second account");
    });
  });
});
