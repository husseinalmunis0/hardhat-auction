// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  const Auctions = await ethers.getContractFactory("Auctions");
  const auctions = await Auctions.deploy();
  await auctions.deployed();
  const MyAuction = await ethers.getContractFactory("MyAuction");
  const myAuction = await MyAuction.deploy();
  await myAuction.deployed();
  console.log("Token address:", token.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token,auctions,myAuction);
}

function saveFrontendFiles(token,auctions,myAuction) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Token: token.address,Auctions: auctions.address,MyAuction:myAuction.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    contractsDir + "/Token.json",
    JSON.stringify(TokenArtifact, null, 2)
  );

  const AuctionsArtifact = artifacts.readArtifactSync("Auctions");
  fs.writeFileSync(
      contractsDir + "/Auctions.json",
      JSON.stringify(AuctionsArtifact, null, 2)
  );

  const MyAuctionArtifact = artifacts.readArtifactSync("MyAuction");
  fs.writeFileSync(
      contractsDir + "/MyAuction.json",
      JSON.stringify(MyAuctionArtifact, null, 2)
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
