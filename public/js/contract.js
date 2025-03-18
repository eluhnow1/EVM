// Toggle campaign status (pause/activate)
async function toggleCampaignStatus(id) {
    if (!isConnected) {
        alert("Please connect your wallet first");
        return false;
    }
    
    try {
        // Estimate gas first
        const gasEstimate = await fundraiserContract.methods
            .toggleCampaignStatus(id)
            .estimateGas({ from: accounts[0] })
            .catch(error => {
                console.error("Gas estimation failed:", error);
                throw new Error("This transaction is likely to fail. You may not be the campaign owner.");
            });
        
        // Add 30% buffer to gas estimate
        const gasLimit = Math.floor(gasEstimate * 1.3);
        
        console.log("Toggle status details:", {
            campaignId: id,
            estimatedGas: gasEstimate,
            gasLimit: gasLimit
        });
        
        // Send transaction with higher gas limit
        const result = await fundraiserContract.methods
            .toggleCampaignStatus(id)
            .send({ 
                from: accounts[0],
                gas: gasLimit 
            });
        
        return result;
    } catch (error) {
        console.error("Error toggling campaign status:", error);
        alert("Status update failed: " + (error.message || "Unknown error"));
        throw error;
    }
}// contract.js - Handles contract interaction

// Contract ABI (formatted for readability)
const contractABI = [
	{
	  "type": "event",
	  "name": "CampaignCreated",
	  "inputs": [
		{
		  "name": "id",
		  "type": "uint256",
		  "indexed": false
		},
		{
		  "name": "creator",
		  "type": "address",
		  "indexed": true
		},
		{
		  "name": "name",
		  "type": "string",
		  "indexed": false
		},
		{
		  "name": "goal",
		  "type": "uint256",
		  "indexed": false
		},
		{
		  "name": "imageUrl",
		  "type": "string",
		  "indexed": false
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "DonationReceived",
	  "inputs": [
		{
		  "name": "campaignId",
		  "type": "uint256",
		  "indexed": true
		},
		{
		  "name": "donor",
		  "type": "address",
		  "indexed": true
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": false
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "FundsWithdrawn",
	  "inputs": [
		{
		  "name": "campaignId",
		  "type": "uint256",
		  "indexed": true
		},
		{
		  "name": "recipient",
		  "type": "address",
		  "indexed": true
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": false
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "CampaignUpdated",
	  "inputs": [
		{
		  "name": "id",
		  "type": "uint256",
		  "indexed": true
		},
		{
		  "name": "name",
		  "type": "string",
		  "indexed": false
		},
		{
		  "name": "description",
		  "type": "string",
		  "indexed": false
		},
		{
		  "name": "goal",
		  "type": "uint256",
		  "indexed": false
		},
		{
		  "name": "imageUrl",
		  "type": "string",
		  "indexed": false
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "constructor",
	  "stateMutability": "nonpayable",
	  "inputs": []
	},
	{
	  "type": "function",
	  "name": "createCampaign",
	  "stateMutability": "nonpayable",
	  "inputs": [
		{
		  "name": "_name",
		  "type": "string"
		},
		{
		  "name": "_description",
		  "type": "string"
		},
		{
		  "name": "_goal",
		  "type": "uint256"
		},
		{
		  "name": "_imageUrl",
		  "type": "string"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256"
		}
	  ]
	},
	{
	  "type": "function",
	  "name": "updateCampaign",
	  "stateMutability": "nonpayable",
	  "inputs": [
		{
		  "name": "_campaignId",
		  "type": "uint256"
		},
		{
		  "name": "_name",
		  "type": "string"
		},
		{
		  "name": "_description",
		  "type": "string"
		},
		{
		  "name": "_goal",
		  "type": "uint256"
		},
		{
		  "name": "_imageUrl",
		  "type": "string"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "bool"
		}
	  ]
	},
	{
	  "type": "function",
	  "name": "donateToCampaign",
	  "stateMutability": "payable",
	  "inputs": [
		{
		  "name": "_campaignId",
		  "type": "uint256"
		}
	  ],
	  "outputs": []
	},
	{
	  "type": "function",
	  "name": "withdrawFunds",
	  "stateMutability": "nonpayable",
	  "inputs": [
		{
		  "name": "_campaignId",
		  "type": "uint256"
		}
	  ],
	  "outputs": []
	},
	{
	  "type": "function",
	  "name": "toggleCampaignStatus",
	  "stateMutability": "nonpayable",
	  "inputs": [
		{
		  "name": "_campaignId",
		  "type": "uint256"
		}
	  ],
	  "outputs": []
	},
	{
	  "type": "function",
	  "name": "getCampaign",
	  "stateMutability": "view",
	  "inputs": [
		{
		  "name": "_campaignId",
		  "type": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "address"
		},
		{
		  "name": "",
		  "type": "string"
		},
		{
		  "name": "",
		  "type": "string"
		},
		{
		  "name": "",
		  "type": "uint256"
		},
		{
		  "name": "",
		  "type": "uint256"
		},
		{
		  "name": "",
		  "type": "bool"
		},
		{
		  "name": "",
		  "type": "uint256"
		},
		{
		  "name": "",
		  "type": "string"
		}
	  ]
	},
	{
	  "type": "function",
	  "name": "getAllCampaigns",
	  "stateMutability": "view",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256[]"
		}
	  ]
	},
	{
	  "type": "function",
	  "name": "campaigns",
	  "stateMutability": "view",
	  "inputs": [
		{
		  "name": "arg0",
		  "type": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "tuple",
		  "components": [
			{
			  "name": "creator",
			  "type": "address"
			},
			{
			  "name": "name",
			  "type": "string"
			},
			{
			  "name": "description",
			  "type": "string"
			},
			{
			  "name": "goal",
			  "type": "uint256"
			},
			{
			  "name": "amountRaised",
			  "type": "uint256"
			},
			{
			  "name": "active",
			  "type": "bool"
			},
			{
			  "name": "createdAt",
			  "type": "uint256"
			},
			{
			  "name": "imageUrl",
			  "type": "string"
			}
		  ]
		}
	  ]
	},
	{
	  "type": "function",
	  "name": "campaignCount",
	  "stateMutability": "view",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256"
		}
	  ]
	}
  ];

// Contract address (will be filled after deployment)
const contractAddress = "0xB2fdeffC6381268479407f67A163DB5A91ee486b"; 

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
        // Convert goal to Wei
        const goalInWei = web3.utils.toWei(goal.toString(), 'ether');
        
        // Estimate gas first to check if the transaction is likely to succeed
        const gasEstimate = await fundraiserContract.methods
            .createCampaign(name, description, goalInWei, imageUrl)
            .estimateGas({ from: accounts[0] })
            .catch(error => {
                console.error("Gas estimation failed:", error);
                throw new Error("This transaction is likely to fail. Please check your inputs or contract state.");
            });
        
        // Add 30% buffer to gas estimate for safety
        const gasLimit = Math.floor(gasEstimate * 1.3);
        
        console.log("Transaction details:", {
            name: name,
            description: description,
            goalInWei: goalInWei,
            imageUrl: imageUrl,
            estimatedGas: gasEstimate,
            gasLimit: gasLimit
        });
        
        // Send transaction with higher gas limit
        const result = await fundraiserContract.methods
            .createCampaign(name, description, goalInWei, imageUrl)
            .send({ 
                from: accounts[0],
                gas: gasLimit
            });
        
        return result;
    } catch (error) {
        console.error("Error creating campaign:", error);
        alert("Transaction failed: " + (error.message || "Unknown error"));
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
        
        // Estimate gas first
        const gasEstimate = await fundraiserContract.methods
            .donateToCampaign(id)
            .estimateGas({ 
                from: accounts[0], 
                value: amountInWei 
            })
            .catch(error => {
                console.error("Gas estimation failed:", error);
                throw new Error("This donation is likely to fail. Please check your inputs or try a different amount.");
            });
        
        // Add 30% buffer to gas estimate
        const gasLimit = Math.floor(gasEstimate * 1.3);
        
        console.log("Donation details:", {
            campaignId: id,
            amountInWei: amountInWei,
            estimatedGas: gasEstimate,
            gasLimit: gasLimit
        });
        
        // Send transaction with higher gas limit
        const result = await fundraiserContract.methods
            .donateToCampaign(id)
            .send({ 
                from: accounts[0], 
                value: amountInWei,
                gas: gasLimit 
            });
        
        return result;
    } catch (error) {
        console.error("Error donating to campaign:", error);
        alert("Donation failed: " + (error.message || "Unknown error"));
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
        // Get campaign details to check if there are funds to withdraw
        const campaign = await getCampaign(id);
        if (parseFloat(campaign.amountRaised) <= 0) {
            alert("No funds available to withdraw");
            return false;
        }
        
        // Estimate gas first
        const gasEstimate = await fundraiserContract.methods
            .withdrawFunds(id)
            .estimateGas({ from: accounts[0] })
            .catch(error => {
                console.error("Gas estimation failed:", error);
                throw new Error("Withdraw transaction is likely to fail. You may not be the campaign creator or there are no funds to withdraw.");
            });
        
        // Add 30% buffer to gas estimate
        const gasLimit = Math.floor(gasEstimate * 1.3);
        
        console.log("Withdraw details:", {
            campaignId: id,
            estimatedGas: gasEstimate,
            gasLimit: gasLimit
        });
        
        // Send transaction with higher gas limit
        const result = await fundraiserContract.methods
            .withdrawFunds(id)
            .send({ 
                from: accounts[0],
                gas: gasLimit 
            });
        
        return result;
    } catch (error) {
        console.error("Error withdrawing funds:", error);
        alert("Withdrawal failed: " + (error.message || "Unknown error"));
        throw error; // Rethrow to handle in the UI
    }
}

// Update an existing campaign (only creator can update)
async function updateCampaign(id, name, description, goal, imageUrl) {
    if (!isConnected) {
        alert("Please connect your wallet first");
        return false;
    }
    
    try {
        // Convert goal to Wei
        const goalInWei = web3.utils.toWei(goal.toString(), 'ether');
        
        // Estimate gas first to check if the transaction is likely to succeed
        const gasEstimate = await fundraiserContract.methods
            .updateCampaign(id, name, description, goalInWei, imageUrl)
            .estimateGas({ from: accounts[0] })
            .catch(error => {
                console.error("Gas estimation failed:", error);
                throw new Error("This transaction is likely to fail. Please check your inputs or contract state.");
            });
        
        // Add 30% buffer to gas estimate for safety
        const gasLimit = Math.floor(gasEstimate * 1.3);
        
        console.log("Update transaction details:", {
            id: id,
            name: name,
            description: description,
            goalInWei: goalInWei,
            imageUrl: imageUrl,
            estimatedGas: gasEstimate,
            gasLimit: gasLimit
        });
        
        // Send transaction with higher gas limit
        const result = await fundraiserContract.methods
            .updateCampaign(id, name, description, goalInWei, imageUrl)
            .send({ 
                from: accounts[0],
                gas: gasLimit
            });
        
        return result;
    } catch (error) {
        console.error("Error updating campaign:", error);
        alert("Update failed: " + (error.message || "Unknown error"));
        return false;
    }
}

// Utility function to validate campaign input
function validateCampaignInput(name, description, goal, imageUrl) {
    // Check for empty fields
    if (!name || !description || !goal || !imageUrl) {
        return "All fields are required";
    }
    
    // Check name length (Vyper has String[100] limit)
    if (name.length > 100) {
        return "Name must be less than 100 characters";
    }
    
    // Check description length (Vyper has String[500] limit)
    if (description.length > 500) {
        return "Description must be less than 500 characters";
    }
    
    // Check imageUrl length (Vyper has String[200] limit)
    if (imageUrl.length > 200) {
        return "Image URL is too long (maximum 200 characters). Please use a shorter URL or an image hosting service like imgur.com";
    }
    
    // Check goal is a positive number
    if (isNaN(goal) || parseFloat(goal) <= 0) {
        return "Goal must be a positive number";
    }
    
    return null; // No errors
}

// Initialize contract when page loads
window.addEventListener('DOMContentLoaded', async () => {
    if (await initWeb3()) {
        await initContract();
    }
});