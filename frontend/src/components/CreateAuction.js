import React from "react";
import {ethers} from "ethers";
import contractAddress from "../contracts/contract-address.json";
import AuctionsArtifact from "../contracts/Auctions.json";
import {NoWalletDetected} from "./NoWalletDetected";
import {ConnectWallet} from "./ConnectWallet";
import {WaitingForTransactionMessage} from "./WaitingForTransactionMessage";
import {TransactionErrorMessage} from "./TransactionErrorMessage";
import {Dapp} from "./Dapp";
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
export class CreateAuction extends Dapp{

    render() {
        if (window.ethereum === undefined) {
            return <NoWalletDetected/>;
        }
        if (!this.state.selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={() => this._connectWallet()}
                    networkError={this.state.networkError}
                    dismiss={() => this._dismissNetworkError()}
                />
            );
        }
        return (
            <div className="container p-4">
                <div className="row">
                    <div className="col-12">
                        <h1>
                            Welcome <b>{this.state.selectedAddress}.</b>
                        </h1>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-12">

                        {this.state.txBeingSent && (
                            <WaitingForTransactionMessage txHash={this.state.txBeingSent}/>
                        )}
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

                        {
                            <div>
                                <h4>Create</h4>
                                <form
                                    onSubmit={(event) => {
                                        // This function just calls the transferTokens callback with the
                                        // form's data.
                                        event.preventDefault();

                                        const formData = new FormData(event.target);
                                        const objectName = formData.get("objectName");
                                        const objectDescription = formData.get("objectDescription");
                                        const startingBid = formData.get("startingBid");
                                        const entryFee = formData.get("entryFee");
                                        const biddingFee = formData.get("biddingFee");
                                        const auctionStartTime = Date.parse(formData.get("auctionStartTime"));
                                        this._createAuction(startingBid, entryFee, biddingFee, objectName, objectDescription, auctionStartTime);
                                    }}
                                >
                                    <div className="form-group">
                                        <label>The object name</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="objectName"
                                            placeholder="Object Name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>The Object Description</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="objectDescription"
                                            placeholder="Object Description"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>The Fee Entry</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="entryFee"
                                            placeholder="Entry Fee"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>The Bidding Fee</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="biddingFee"
                                            placeholder="Bidding Fee"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>The Starting Fee</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="startingBid"
                                            placeholder="Starting Fee"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>The Starting Time</label>
                                        <input
                                            className="form-control"
                                            type="datetime-local"
                                            name="auctionStartTime"
                                            placeholder="Starting Time"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input className="btn btn-primary" type="submit" value="Transfer"/>
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }


    async _createAuction(startingBid,entryFee,biddingFee,objectName,objectDescription,auctionStartTime) {
        try {
            this._provider = new ethers.providers.Web3Provider(window.ethereum);
            this._auctions = new ethers.Contract(
                contractAddress.Auctions,
                AuctionsArtifact.abi,
                this._provider.getSigner(0)
            );
            await this._auctions.createAuction(startingBid,entryFee,biddingFee,objectName,objectDescription,auctionStartTime);
        } catch (error) {
            console.log(error);
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }
            console.error(error);
            this.setState({transactionError: error});
        } finally {
            this.setState({txBeingSent: undefined});
        }
    }
}
