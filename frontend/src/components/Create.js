import React from "react";

export function Create({ createAuction}) {
    return (
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
                    createAuction(startingBid, entryFee, biddingFee, objectName, objectDescription, auctionStartTime);
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
    );
}
