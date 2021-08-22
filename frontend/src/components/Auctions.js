import React from "react";
import {ethers} from "ethers";
import contractAddress from "../contracts/contract-address.json";
import AuctionsArtifact from "../contracts/Auctions.json";
import {NoWalletDetected} from "./NoWalletDetected";
import {ConnectWallet} from "./ConnectWallet";
import {WaitingForTransactionMessage} from "./WaitingForTransactionMessage";
import {TransactionErrorMessage} from "./TransactionErrorMessage";
import {Dapp} from "./Dapp";
import {Create} from "./Create";
// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '5777';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export class Auctions extends Dapp{
    constructor(props) {
        super(props);
        this.initialState = {
            tokenData: undefined,
            auctions: undefined,
            selectedAddress: undefined,
            balance: undefined,
            txBeingSent: undefined,
            transactionError: undefined,
            networkError: undefined,
        };

        this.state = this.initialState;
    }

    render() {
        // Ethereum wallets inject the window.ethereum object. If it hasn't been
        // injected, we instruct the user to install MetaMask.
        if (window.ethereum === undefined) {
            return <NoWalletDetected/>;
        }

        // The next thing we need to do, is to ask the user to connect their wallet.
        // When the wallet gets connected, we are going to save the users's address
        // in the component's state. So, if it hasn't been saved yet, we have
        // to show the ConnectWallet component.
        //
        // Note that we pass it a callback that is going to be called when the user
        // clicks a button. This callback just calls the _connectWallet method.
        if (!this.state.selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={() => this._connectWallet()}
                    networkError={this.state.networkError}
                    dismiss={() => this._dismissNetworkError()}
                />
            );
        }

        // If the token data or the user's balance hasn't loaded yet, we show
        // a loading component.
        // if (!this.state.tokenData || !this.state.balance) {
        //     return <Loading/>;
        // }

        // If everything is loaded, we render the application.
        return (
            <div className="container p-4">
                <div className="row">
                    <div className="col-12">
                        <h1>
                            {/*{this.state.tokenData.name} ({this.state.tokenData.symbol})*/}
                        </h1>
                        <p>
                            Welcome <b>{this.state.selectedAddress}</b>, you have{" "}
                            <b>
                                {/*{this.state.balance.toString()} {this.state.tokenData.symbol}*/}
                            </b>
                            .
                        </p>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-12">
                        {/*
              Sending a transaction isn't an immidiate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
                        {this.state.txBeingSent && (
                            <WaitingForTransactionMessage txHash={this.state.txBeingSent}/>
                        )}

                        {/*
              Sending a transaction can fail in multiple ways.
              If that happened, we show a message here.
            */}
                        {this.state.transactionError && (
                            <TransactionErrorMessage
                                message={this._getRpcErrorMessage(this.state.transactionError)}
                                dismiss={() => this._dismissTransactionError()}
                            />
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        {/*
              If the user has no tokens, we don't show the Tranfer form
            */}
                        {/*{this.state.balance.eq(0) && (*/}
                        {/*    <NoTokensMessage selectedAddress={this.state.selectedAddress}/>*/}
                        {/*)}*/}

                        {/*
              This component displays a form that the user can use to send a
              transaction and transfer some tokens.
              The component doesn't have logic, it just calls the transferTokens
              callback.
            */}
                        {
                            <Create
                                createAuction={
                                    (startingBid, entryFee, biddingFee, objectName, objectDescription, auctionStartTime) =>{
                                        this._createAuction(startingBid, entryFee, biddingFee, objectName, objectDescription, auctionStartTime)
                                    }
                                }
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }

    async _connectWallet() {

        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!this._checkNetwork()) {
            return;
        }
        this._initialize(selectedAddress);
        window.ethereum.on("accountsChanged", ([newAddress]) => {
            this._stopPollingData();
            if (newAddress === undefined) {
                return this._resetState();
            }

            this._initialize(newAddress);
        });
        window.ethereum.on('chainChanged', () => {
            this._stopPollingData();
            this._resetState();
        });

    }

    _initialize(userAddress) {
        this.setState({
            selectedAddress: userAddress,
        });
        this._intializeEthers();
        this._getAuctions();
        this._startPollingData();
    }

    async _getAuctions() {
        const auctions = await this._auctions.allAuctions();
        this._myAuction.
        console.log(auctions);
        this.setState({auctions: auctions});
    }

    async _intializeEthers() {
        this._provider = new ethers.providers.Web3Provider(window.ethereum);
        this._auctions = new ethers.Contract(
            contractAddress.Auctions,
            AuctionsArtifact.abi,
            this._provider.getSigner(0)
        );
    }

    _stopPollingData() {
        clearInterval(this._pollDataInterval);
        this._pollDataInterval = undefined;
    }

    componentWillUnmount() {
        // We poll the user's balance, so we have to stop doing that when Dapp
        // gets unmounted
        this._stopPollingData();
    }

    _dismissTransactionError() {
        this.setState({transactionError: undefined});
    }

    _dismissNetworkError() {
        this.setState({networkError: undefined});
    }

    _getRpcErrorMessage(error) {
        if (error.data) {
            return error.data.message;
        }

        return error.message;
    }

    _resetState() {
        this.setState(this.initialState);
    }

    _startPollingData() {
        // this._pollDataInterval = setInterval(() => this._updateAuctions(), 1000);

        // We run it once immediately so we don't have to wait for it
        // this._updateAuctions();
    }
    async _updateAuctions() {
        const auctions = await this._auctions.allAuctions();
        console.log(JSON.stringify(auctions));
        this.setState({auctions: auctions});
    }


    _checkNetwork() {
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            return true;
        }

        this.setState({
            networkError: 'Please connect Metamask to Localhost:8545'
        });

        return false;
    }

    async _createAuction(startingBid,entryFee,biddingFee,objectName,objectDescription,auctionStartTime) {
        try {
            // this._dismissTransactionError();
            await this._auctions.createAuction(startingBid,entryFee,biddingFee,objectName,objectDescription,auctionStartTime);
            // this.setState({txBeingSent: tx.hash});
            // console.log(error);

            // We use .wait() to wait for the transaction to be mined. This method
            // returns the transaction's receipt.
            // const receipt = await tx.wait();

            // The receipt, contains a status flag, which is 0 to indicate an error.
            // if (receipt.status === 0) {
            //     // We can't know the exact error that made the transaction fail when it
            //     // was mined, so we throw this generic one.
            //     throw new Error("Transaction failed");
            // }

            // If we got here, the transaction was successful, so you may want to
            // update your state. Here, we update the user's balance.
            await this._updateAuctions();
        } catch (error) {
            // We check the error code to see if this error was produced because the
            // user rejected a tx. If that's the case, we do nothing.
            console.log(error);
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }

            // Other errors are logged and stored in the Dapp's state. This is used to
            // show them to the user, and for debugging.
            console.error(error);
            this.setState({transactionError: error});
        } finally {
            // If we leave the try/catch, we aren't sending a tx anymore, so we clear
            // this part of the state.
            this.setState({txBeingSent: undefined});
        }
    }
}
