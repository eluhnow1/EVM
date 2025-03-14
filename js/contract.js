// contract.js - Handles contract interaction

// Contract ABI (will be replaced with the actual ABI after compilation)
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "goal",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imageUrl",
				"type": "string"
			}
		],
		"name": "CampaignCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_goal",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_imageUrl",
				"type": "string"
			}
		],
		"name": "createCampaign",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignId",
				"type": "uint256"
			}
		],
		"name": "donateToCampaign",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "DonationReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsWithdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignId",
				"type": "uint256"
			}
		],
		"name": "toggleCampaignStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignId",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "campaignCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "campaigns",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountRaised",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "imageUrl",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllCampaigns",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignId",
				"type": "uint256"
			}
		],
		"name": "getCampaign",
		"outputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountRaised",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "imageUrl",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Contract address (will be filled after deployment)
const contractAddress = "0x6B8f2858F3205254C58b9fC2f7cf16fF37cD5101"; // Replace with actual contract address after deployment

let fundraiserContract;

// Initialize contract
async function initContract() {
    if (!web3) return false;
    
    try {
        fundraiserContract = new web3.eth.Contract(contractABI, contractAddress);
        return true;
    } catch (error) {
        console.error("Error initializing contract:", error);
        return false;
    }
}

// Get all campaigns
async function getAllCampaigns() {
    try {
        const campaignIds = await fundraiserContract.methods.getAllCampaigns().call();
        const campaigns = [];
        
        for (const id of campaignIds) {
            const campaign = await fundraiserContract.methods.getCampaign(id).call();
            campaigns.push({
                id: id,
                creator: campaign[0],
                name: campaign[1],
                description: campaign[2],
                goal: web3.utils.fromWei(campaign[3], 'ether'),
                amountRaised: web3.utils.fromWei(campaign[4], 'ether'),
                active: campaign[5],
                createdAt: new Date(campaign[6] * 1000), // Convert from unix timestamp
                imageUrl: campaign[7]
            });
        }
        
        return campaigns;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
}

// Get single campaign by ID
async function getCampaign(id) {
    try {
        const campaign = await fundraiserContract.methods.getCampaign(id).call();
        
        return {
            id: id,
            creator: campaign[0],
            name: campaign[1],
            description: campaign[2],
            goal: web3.utils.fromWei(campaign[3], 'ether'),
            amountRaised: web3.utils.fromWei(campaign[4], 'ether'),
            active: campaign[5],
            createdAt: new Date(campaign[6] * 1000), // Convert from unix timestamp
            imageUrl: campaign[7]
        };
    } catch (error) {
        console.error(`Error fetching campaign with ID ${id}:`, error);
        return null;
    }
}

// Create a new campaign
async function createCampaign(name, description, goal, imageUrl) {
    if (!isConnected) {
        alert("Please connect your wallet first");
        return false;
    }
    
    try {
        const goalInWei = web3.utils.toWei(goal.toString(), 'ether');
        
        const result = await fundraiserContract.methods
            .createCampaign(name, description, goalInWei, imageUrl)
            .send({ from: accounts[0] });
        
        return result;
    } catch (error) {
        console.error("Error creating campaign:", error);
        return false;
    }
}

// Donate to a campaign
async function donateToCampaign(id, amount) {
    if (!isConnected) {
        alert("Please connect your wallet first");
        return false;
    }
    
    try {
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
        
        const result = await fundraiserContract.methods
            .donateToCampaign(id)
            .send({ from: accounts[0], value: amountInWei });
        
        return result;
    } catch (error) {
        console.error("Error donating to campaign:", error);
        return false;
    }
}

// Withdraw funds from a campaign (only for campaign creator)
async function withdrawCampaignFunds(id) {
    if (!isConnected) {
        alert("Please connect your wallet first");
        return false;
    }
    
    try {
        const result = await fundraiserContract.methods
            .withdrawFunds(id)
            .send({ from: accounts[0] });
        
        return result;
    } catch (error) {
        console.error("Error withdrawing funds:", error);
        throw error; // Rethrow to handle in the UI
    }
}

// Initialize contract when page loads
window.addEventListener('DOMContentLoaded', async () => {
    if (await initWeb3()) {
        await initContract();
    }
});