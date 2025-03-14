// web3.js - Handles Web3 and MetaMask connections

let web3;
let accounts = [];
let isConnected = false;

// Function to initialize Web3
async function initWeb3() {
    // Check if MetaMask is installed
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            
            // Request account access if needed
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isConnected = accounts.length > 0;
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', function (newAccounts) {
                accounts = newAccounts;
                isConnected = accounts.length > 0;
                updateUI();
            });

            // Check if we're on the Sepolia test network
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0xaa36a7') { // Sepolia chain ID
                displayNetworkError();
            }

            return true;
        } catch (error) {
            console.error("User denied account access or error occurred:", error);
            return false;
        }
    } 
    // If no web3 provider
    else {
        console.log('No web3 provider detected');
        displayNoMetaMaskError();
        return false;
    }
}

// Function to connect to MetaMask
async function connectWallet() {
    try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        isConnected = accounts.length > 0;
        updateUI();
        return true;
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        return false;
    }
}

// Display error if not on Sepolia
function displayNetworkError() {
    const errorHTML = `
        <div class="wallet-notice">
            <p>Please connect to the Sepolia Test Network in MetaMask to use this application.</p>
            <button onclick="switchToSepolia()" class="btn primary-btn">Switch to Sepolia</button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', errorHTML);
}

// Function to switch to Sepolia network
async function switchToSepolia() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
        });
    } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0xaa36a7',
                            chainName: 'Sepolia Test Network',
                            nativeCurrency: {
                                name: 'Sepolia ETH',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            rpcUrls: ['https://sepolia.infura.io/v3/'],
                            blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                        },
                    ],
                });
            } catch (addError) {
                console.error("Error adding Sepolia network:", addError);
            }
        }
        console.error("Error switching to Sepolia network:", error);
    }
}

// Display error if MetaMask not installed
function displayNoMetaMaskError() {
    const errorHTML = `
        <div class="wallet-notice">
            <p>MetaMask is not installed. Please install MetaMask to use this application.</p>
            <a href="https://metamask.io/" target="_blank" class="btn primary-btn">Install MetaMask</a>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', errorHTML);
}

// Function to update UI based on connection status
function updateUI() {
    // This will be filled based on the page we're on
}

// Initialize web3 when page loads
window.addEventListener('DOMContentLoaded', initWeb3);
