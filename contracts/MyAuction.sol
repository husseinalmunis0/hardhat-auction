pragma solidity ^0.7.0;
contract MyAuction {

    //auction owner
    address payable public owner;
    //***********************************************************************
    //auction ID
    uint public ID;
    //lowest number allowed to bid
    uint public startingBid;
    //entry fee
    uint public entryFee;
    //bidding fee (amount of money returned after the auction ends to all the losers)
    uint public biddingFee;
    //the object we want to sell
    string public objectName;
    string public objectDescription;
    //all participants
    address [] public participants;
    //auction start time
    uint public auctionStartTime;
    // Current state of the auction.
    address public highestBidder;
    uint public highestBid;
    //the time of the last bid
    uint public lastBidTime;
    // Highest bids for all the participants
    mapping(address => uint) allBids;
    // is the auction started
    bool started;
    //auction end time
    uint auctionEndTime;

    // Set to true at the end, disallows any change.
    // By default initialized to `false`.
    bool ended;
    //***********************************************************************

    // Events that will be emitted on changes.
    event AuctionStarted(address[] bidders, uint startAmount);
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    // Errors that describe failures.

    // The triple-slash comments are so-called natspec
    // comments. They will be shown when the user
    // is asked to confirm a transaction or
    // when an error is displayed.

//    /// The auction has already ended.
//    error AuctionAlreadyEnded();
//    // The auction didn't started
//    error AuctionNotStarted();
//    /// There is already a higher or equal bid.
//    error BidNotHighEnough(uint highestBid);
//    /// The auction has not ended yet.
//    error AuctionNotYetEnded();
//    /// The function auctionEnd has already been called.
//    error AuctionEndAlreadyCalled();
//    /// The function
//    error participantingFailed();
//    error CantEndYet();
    /// Create a simple auction with `_biddingTime`
    /// seconds bidding time on behalf of the
    /// beneficiary address `_beneficiary`.


    function getOwner() public view returns (address payable) {
        return owner;
    }

    function setOwner(address payable _owner) public {
        owner = _owner;
    }

    function getStartingBid() public view returns (uint) {
        return startingBid;
    }

    function setStartingBid(uint _startingBid) public {
        startingBid = _startingBid;
    }

    function getEntryFee() public view returns (uint) {
        return entryFee;
    }

    function setEntryFee(uint _entryFee) public {
        entryFee = _entryFee;
    }

    function getBiddingFee() public view returns (uint) {
        return biddingFee;
    }

    function setBiddingFee(uint _biddingFee) public {
        biddingFee = _biddingFee;
    }

    function getAuctionStartTime() public view returns (uint) {
        return auctionStartTime;
    }

    function setAuctionStartTime(uint _auctionStartTime) public {
        auctionStartTime = _auctionStartTime;
    }

    function getObjectName() public view returns (string memory) {
        return objectName;
    }

    function setObjectName(string memory _objectName) public {
        objectName = _objectName;
    }
    function getObjectDescription() public view returns (string memory) {
        return objectDescription;
    }

    function setObjectDescription(string memory _objectDescription) public {
        objectDescription = _objectDescription;
    }

    function participant() public payable{
        if(!started){
            bool sented1 = owner.send(biddingFee);
            bool sented2 = owner.send(entryFee);
            if(sented1&& sented2)
                participants.push(msg.sender);
            else
            revert ("participantingFailed");
        }
        else{
            revert ("AuctionNotStarted");
        }
    }

    function startAuction() public {
        if(owner==msg.sender){
            started=true;
            highestBid=startingBid;
            emit AuctionStarted(participants,startingBid);
        }
    }

    function bid(uint value) public payable {

        if (ended)
            revert ("AuctionAlreadyEnded");

        if (!started)
            revert ("AuctionNotStarted");

        if (value <= highestBid && value <=startingBid)
            revert ("BidNotHighEnough");
        else{
            highestBidder = msg.sender;
            highestBid = value;
            allBids[highestBidder] = highestBid;
            emit HighestBidIncreased(msg.sender, value);
        }
    }

    function endAuction() public{
        if(started){

            if(lastBidTime + 60 < block.timestamp){
                withdraw();
                ended=true;
            }
            else
                revert ("CantEndYet");
        }
        revert("AuctionNotStarted");
    }
    /// Withdraw a bid that was overbid.
    function withdraw() private {
        for(uint i=0; i<participants.length; i++){
            if(participants[i]!=highestBidder){
                payable(participants[i]).send(allBids[participants[i]]);
            }
        }
    }

}