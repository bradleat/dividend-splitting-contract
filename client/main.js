var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require("truffle-contract");
var ShareholderAgreementDefinition = require('../build/contracts/ShareholderAgreement.json');

var ShareholderAgreement = contract(ShareholderAgreementDefinition);
ShareholderAgreement.setProvider(provider);


var React = require('react');
var ReactDOM = require('react-dom');

var shareholderAgreement;
class App extends React.Component {
    constructor(){
        super();
        this.state = {
            shares: 0,
            amountOfDividendOwed: 0,
            weiOfUser: 0,
            votingForProposal: 'None',
            transferUser: '',
            transferAmount: 0,
            voteProposalShares: 0,
            voteProposalPrice: 0,
            voteProposalWallet: '',
            proposalNumberForVote: 0,
            proposalNumberForUnvote: 0,
            proposalNumberForBuyingShares: 0,
            numberOfSharesToBuy: 0,
            weiToBuySharesWith: 0,
            proposalNumberForDetails: 0
        };
        this.getDataForUser();
    }
    async getDataForUser(){
        const shares = await shareholderAgreement.getSharesFor.call(web3.eth.coinbase);
        const amountOfDividendOwed = await shareholderAgreement.amountOfDividendOwed.call(web3.eth.coinbase);
        const votingForProposal = await shareholderAgreement.shareholderVotingFor.call(web3.eth.coinbase);
        web3.eth.getBalance(web3.eth.coinbase, (err, balance) => {
            this.setState({
                shares: shares.valueOf(),
                amountOfDividendOwed: amountOfDividendOwed.valueOf(),
                weiOfUser: balance.valueOf(),
                votingForProposal: votingForProposal.valueOf()
            });

        });


        
    }
    render() {
        return (
            <div>
                <ul>
                    <li>Wei of User: {this.state.weiOfUser}</li>
                    <li>Shares: {this.state.shares}</li>
                    <li>Dividend Pending: {this.state.amountOfDividendOwed}</li>
                    <li>Voting For Proposal: {this.state.votingForProposal}</li>
                    <li><button onClick={async () => {
                        await shareholderAgreement.sendTransaction({gas: 4000000, from: web3.eth.coinbase, value: web3.toWei(500, 'finney')});
                        this.getDataForUser();
                    }}>Send Profits (500 finney)</button></li>
                    <li><button onClick={async () => {
                        await shareholderAgreement.payoutDividendOwed({gas: 4000000, from: web3.eth.coinbase});
                        this.getDataForUser();
                    }}>Get Dividend Owed</button></li>
                    <li>
                        User: <input type="text" value={this.state.transferUser} onChange={(event) => {
                            this.setState({
                                transferUser: event.target.value
                            })
                        }}/>
                        Shares: <input type="number" value={this.state.transferAmount} onChange={(event) => {
                            this.setState({
                                transferAmount: Number(event.target.value)
                            })
                        }}/>
                        <button onClick={async () => {
                            await shareholderAgreement.transfer(this.state.transferUser, this.state.transferAmount, {from: web3.eth.coinbase, gas: 4000000});
                            this.getDataForUser();
                        }}>Transfer Shares</button>
                    </li>
                    <li>
                        New Shares: <input type="number" value={this.state.voteProposalShares} onChange={(event) => {
                            this.setState({
                                voteProposalShares: Number(event.target.value)
                            })
                        }}/>
                        Price (wei): <input type="number" value={this.state.voteProposalPrice} onChange={(event) => {
                            this.setState({
                                voteProposalPrice: Number(event.target.value)
                            })
                        }}/>
                        Wallet (for fundraising): <input type="text" value={this.state.voteProposalWallet} onChange={(event) => {
                            this.setState({
                                voteProposalWallet: event.target.value
                            })
                        }}/>
                        <button onClick={async () => {
                            await shareholderAgreement.proposeVote(this.state.voteProposalShares, this.state.voteProposalPrice, this.state.voteProposalWallet, {from: web3.eth.coinbase, gas: 4000000});
                            this.getDataForUser();
                        }}>Propose Vote</button>
                    </li>
                    <li>
                        Proposal Number: <input type="number" value={this.state.proposalNumberForVote} onChange={(event) => {
                            this.setState({
                                proposalNumberForVote: Number(event.target.value)
                            })
                        }}/>
                        <button onClick={async () => {
                            await shareholderAgreement.vote(this.state.proposalNumberForVote,  {from: web3.eth.coinbase, gas: 4000000});
                            this.getDataForUser();
                        }}>Vote</button>
                    </li>
                    <li>
                        Proposal Number: <input type="number" value={this.state.proposalNumberForUnvote} onChange={(event) => {
                            this.setState({
                                proposalNumberForUnvote: Number(event.target.value)
                            })
                        }}/>
                        <button onClick={async () => {
                            await shareholderAgreement.vote(this.state.proposalNumberForUnvote,  {from: web3.eth.coinbase, gas: 4000000});
                            this.getDataForUser();
                        }}>Unvote</button>
                    </li>
                    <li>
                        Proposal Number: <input type="number" value={this.state.proposalNumberForBuyingShares} onChange={(event) => {
                            this.setState({
                                proposalNumberForBuyingShares: Number(event.target.value)
                            })
                        }}/>
                        Number of Shares: <input type="number" value={this.state.numberOfSharesToBuy} onChange={(event) => {
                            this.setState({
                                numberOfSharesToBuy: Number(event.target.value)
                            })
                        }}/>
                        Amount to Send: <input type="number" value={this.state.weiToBuySharesWith} onChange={(event) => {
                            this.setState({
                                weiToBuySharesWith: Number(event.target.value)
                            })
                        }}/>
                        <button onClick={async () => {
                            await shareholderAgreement.buyShares(this.state.proposalNumberForBuyingShares,  this.state.numberOfSharesToBuy, {value: this.state.weiToBuySharesWith, from: web3.eth.coinbase, gas: 4000000});
                            this.getDataForUser();
                        }}>Buy Shares</button>
                    </li>
                    <li>
                        Proposal Number: <input type="number" value={this.state.proposalNumberForDetails} onChange={(event) => {
                            this.setState({
                                proposalNumberForDetails: Number(event.target.value)
                            })
                        }}/>
                        <button onClick={async () => {
                            const proposal = await shareholderAgreement.votes(this.state.proposalNumberForDetails);
                            /*
                                uint numNewShares;
                                uint salePriceWei;
                                uint votesFor;
                                address proposedBy;
                                bool finished;
                                address walletForFundraising;
                                uint sharesSold;
                            */
                            alert(JSON.stringify({
                                numNewShares: proposal[0].valueOf(),
                                salePriceWei: proposal[1].valueOf(),
                                votesFor: proposal[2].valueOf(),
                                propsedBy: proposal[3],
                                voteFinished: proposal[4],
                                walletForFundraising: proposal[5],
                                sharesSold: proposal[6].valueOf(),
                            }, null, 4));
                        }}>Display Proposal Details</button>
                    </li>

                </ul>
            </div>
        );
    }
}
ShareholderAgreement.deployed().then((instance) => {
    shareholderAgreement = instance;
    window.debug = instance;
    ReactDOM.render(<App />, document.getElementById('outlet'));
});