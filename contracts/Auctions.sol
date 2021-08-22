pragma solidity ^0.7.0;
import { MyAuction } from './MyAuction.sol';

contract Auctions {
    MyAuction[] public auctions;

    event AuctionCreated(MyAuction auctionContract, address owner, uint numAuctions, MyAuction[] allAuctions);

    function createAuction (
        uint _startingBid,
        uint _entryFee,
        uint _biddingFee,
        string calldata _objectName,
        string calldata _objectDescription,
        uint   _auctionStartTime) public {
        MyAuction newAuction = new MyAuction();
        newAuction.setOwner(payable(msg.sender));
        newAuction.setStartingBid(_startingBid);
        newAuction.setEntryFee(_entryFee);
        newAuction.setBiddingFee(_biddingFee);
        newAuction.setObjectName(_objectName);
        newAuction.setObjectDescription(_objectDescription);
        newAuction.setAuctionStartTime(_auctionStartTime);
        auctions.push(newAuction);
        emit AuctionCreated(newAuction, msg.sender, auctions.length, auctions);
    }

    function allAuctions() public returns ( MyAuction[] memory) {
        return auctions;
    }

    function getAuction(uint index) public returns (MyAuction){
        return auctions[index];
    }
}