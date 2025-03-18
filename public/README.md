# DeFund Me - Decentralized Fundraising Platform

A decentralized fundraising platform built on the Ethereum blockchain (Sepolia testnet). This project allows users to create fundraising campaigns and donate ETH to causes they support, all in a decentralized manner.

## Features

- Create fundraising campaigns with name, description, goal amount, and image
- Browse active campaigns on a responsive grid layout
- View campaign details including progress towards funding goal
- Donate ETH to campaigns using MetaMask
- Track fundraising progress with visual indicators

## Technologies Used

- Solidity for smart contracts
- Web3.js for blockchain interaction
- HTML/CSS/JavaScript for the frontend
- MetaMask for wallet integration
- Sepolia testnet for Ethereum testing

## Project Structure

```
/
├── index.html             # Home page with campaign grid
├── campaign.html          # Campaign details and donation page
├── create.html            # Create campaign page
├── css/
│   └── styles.css         # CSS styles for the application
├── js/
│   ├── app.js             # Main application logic
│   ├── web3.js            # Web3 and MetaMask integration
│   └── contract.js        # Smart contract integration
└── contracts/
    └── Fundraiser.sol     # The Solidity smart contract
```

## Smart Contract Setup

### Prerequisites

- MetaMask with Sepolia ETH
- Solidity compiler (solc)
- Remix IDE (easiest method) or Truffle Framework

### Deployment Steps

1. **Using Remix IDE (recommended for beginners):**
   - Visit [Remix IDE](https://remix.ethereum.org/)
   - Create a new file named `Fundraiser.sol` and paste the contract code
   - Compile the contract using the Solidity compiler tab
   - Switch to the "Deploy & Run Transactions" tab
   - Set the environment to "Injected Web3" (connects to MetaMask)
   - Make sure MetaMask is connected to Sepolia testnet
   - Deploy the contract and copy the deployed address
   - Copy the ABI from the compilation details

2. **Update the Frontend:**
   - Replace the placeholder contract address in `js/contract.js` with your deployed contract address
   - Replace the ABI in `js/contract.js` with the ABI from your compiled contract

## Running the Application

1. Make sure you have Sepolia ETH in your MetaMask wallet
   - Get Sepolia ETH from a faucet like [https://sepoliafaucet.com/](https://sepoliafaucet.com/)

2. Host the website on a local or remote web server
   - For local testing, you can use:
     ```
     npx http-server
     ```
     And access the site at http://localhost:8080

3. Connect your MetaMask wallet to the application
   - The application will prompt you to connect automatically
   - Make sure you're on the Sepolia testnet

4. Start creating campaigns or donate to existing ones!

## Development Notes

- The smart contract handles all fundraising logic on-chain
- Campaign images are stored as URLs (not on-chain) for efficiency
- Campaign state is managed entirely through the Ethereum blockchain
- Wallet connection is required for creating campaigns and donations
- All donations and transactions are made using Sepolia test ETH

## Get Sepolia ETH

For testing, you'll need Sepolia ETH. You can get some from these faucets:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://infura.io/faucet/sepolia)
- [QuickNode Sepolia Faucet](https://faucet.quicknode.com/ethereum/sepolia)

Remember to collect Sepolia ETH daily as mentioned in the assignment instructions!

## Note

This application is for educational purposes and runs on a testnet. Do not use real ETH with this application.