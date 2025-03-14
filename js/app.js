// app.js - Main application logic

// Check which page we're on and run the appropriate functions
document.addEventListener('DOMContentLoaded', async () => {
    // Determine which page we're on
    const path = window.location.pathname;
    
    // If we're on the home page
    if (path.endsWith('index.html') || path.endsWith('/')) {
        initHomePage();
    } 
    // If we're on the campaign details page
    else if (path.endsWith('campaign.html')) {
        initCampaignPage();
    } 
    // If we're on the create campaign page
    else if (path.endsWith('create.html')) {
        initCreatePage();
    }
});

// Initialize the home page
async function initHomePage() {
    const campaignsContainer = document.getElementById('campaigns-container');
    
    // Show loading message
    campaignsContainer.innerHTML = '<div class="loading">Loading campaigns...</div>';
    
    // Make sure web3 and contract are initialized
    if (await initWeb3() && await initContract()) {
        // Get all campaigns
        const campaigns = await getAllCampaigns();
        
        // Display campaigns or show message if none
        if (campaigns.length > 0) {
            displayCampaigns(campaigns);
        } else {
            campaignsContainer.innerHTML = '<p>No campaigns found. Be the first to create one!</p>';
        }
    } else {
        campaignsContainer.innerHTML = '<p>Failed to connect to the blockchain. Please make sure MetaMask is installed and connected to the Sepolia test network.</p>';
    }
}

// Display campaigns on the home page
function displayCampaigns(campaigns) {
    const campaignsContainer = document.getElementById('campaigns-container');
    campaignsContainer.innerHTML = '';
    
    // Sort campaigns by creation date (newest first)
    campaigns.sort((a, b) => b.createdAt - a.createdAt);
    
    // Create a card for each campaign
    campaigns.forEach(campaign => {
        if (!campaign.active) return; // Skip inactive campaigns
        
        const progressPercentage = (campaign.amountRaised / campaign.goal) * 100;
        
        const campaignCard = document.createElement('div');
        campaignCard.className = 'campaign-card';
        campaignCard.innerHTML = `
            <img src="${campaign.imageUrl}" alt="${campaign.name}" class="campaign-image">
            <div class="campaign-info">
                <h3>${campaign.name}</h3>
                <div class="campaign-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progressPercentage, 100)}%"></div>
                    </div>
                    <div class="progress-numbers">
                        <span>${campaign.amountRaised} ETH</span>
                        <span>Goal: ${campaign.goal} ETH</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add click event to navigate to campaign details
        campaignCard.addEventListener('click', () => {
            window.location.href = `campaign.html?id=${campaign.id}`;
        });
        
        campaignsContainer.appendChild(campaignCard);
    });
}

// Initialize the campaign details page
async function initCampaignPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');
    
    if (!campaignId) {
        window.location.href = 'index.html';
        return;
    }
    
    const campaignDetails = document.getElementById('campaign-details');
    const donateBtn = document.getElementById('donate-btn');
    
    // Show loading message
    campaignDetails.innerHTML = '<div class="loading">Loading campaign details...</div>';
    
    // Make sure web3 and contract are initialized
    if (await initWeb3() && await initContract()) {
        // Get campaign details
        const campaign = await getCampaign(campaignId);
        
        if (campaign) {
            displayCampaignDetails(campaign);
            
            // Set up donation button
            donateBtn.addEventListener('click', async () => {
                const amountInput = document.getElementById('donation-amount');
                const amount = amountInput.value;
                
                if (!amount || amount <= 0) {
                    alert('Please enter a valid donation amount');
                    return;
                }
                
                donateBtn.disabled = true;
                donateBtn.textContent = 'Processing...';
                
                const success = await donateToCampaign(campaignId, amount);
                
                if (success) {
                    alert('Donation successful! Thank you for your support.');
                    // Refresh the page to show updated amounts
                    window.location.reload();
                } else {
                    alert('Donation failed. Please try again.');
                    donateBtn.disabled = false;
                    donateBtn.textContent = 'Donate';
                }
            });
        } else {
            campaignDetails.innerHTML = '<p>Campaign not found or error loading campaign details.</p>';
        }
    } else {
        campaignDetails.innerHTML = '<p>Failed to connect to the blockchain. Please make sure MetaMask is installed and connected to the Sepolia test network.</p>';
    }
}

// Display campaign details
function displayCampaignDetails(campaign) {
    const campaignDetails = document.getElementById('campaign-details');
    const withdrawSection = document.getElementById('withdraw-section');
    const progressPercentage = (campaign.amountRaised / campaign.goal) * 100;
    
    campaignDetails.innerHTML = `
        <img src="${campaign.imageUrl}" alt="${campaign.name}" class="campaign-details-image">
        <div class="campaign-details-info">
            <h2>${campaign.name}</h2>
            <div class="campaign-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(progressPercentage, 100)}%"></div>
                </div>
                <div class="progress-numbers">
                    <span>${campaign.amountRaised} ETH raised</span>
                    <span>Goal: ${campaign.goal} ETH</span>
                </div>
            </div>
            <div class="campaign-description">
                ${campaign.description}
            </div>
            <div class="campaign-creator">
                Campaign created by: ${campaign.creator.substr(0, 6)}...${campaign.creator.substr(-4)}
                <br>
                Created on: ${campaign.createdAt.toLocaleDateString()}
            </div>
        </div>
    `;
    
    // Check if current user is the campaign creator
    if (isConnected && accounts[0].toLowerCase() === campaign.creator.toLowerCase()) {
        // Show withdraw section for campaign creator
        withdrawSection.style.display = 'block';
        
        // Set up withdraw button if there are funds to withdraw
        const withdrawBtn = document.getElementById('withdraw-btn');
        const withdrawStatus = document.getElementById('withdraw-status');
        
        if (parseFloat(campaign.amountRaised) <= 0) {
            withdrawBtn.disabled = true;
            withdrawBtn.textContent = 'No Funds to Withdraw';
            withdrawStatus.textContent = 'There are currently no funds available to withdraw.';
        } else {
            withdrawBtn.disabled = false;
            withdrawBtn.textContent = `Withdraw ${campaign.amountRaised} ETH`;
            
            // Add event listener for withdraw button
            withdrawBtn.addEventListener('click', async () => {
                if (confirm(`Are you sure you want to withdraw ${campaign.amountRaised} ETH from this campaign?`)) {
                    try {
                        withdrawBtn.disabled = true;
                        withdrawBtn.textContent = 'Processing...';
                        withdrawStatus.textContent = 'Transaction in progress...';
                        
                        const urlParams = new URLSearchParams(window.location.search);
                        const campaignId = urlParams.get('id');
                        
                        // Call the withdraw function
                        await withdrawCampaignFunds(campaignId);
                        
                        withdrawStatus.textContent = 'Funds successfully withdrawn to your wallet!';
                        withdrawBtn.textContent = 'Funds Withdrawn';
                        
                        // Refresh the page after a delay
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    } catch (error) {
                        console.error('Error withdrawing funds:', error);
                        withdrawStatus.textContent = 'Error withdrawing funds. Please try again.';
                        withdrawBtn.disabled = false;
                        withdrawBtn.textContent = `Withdraw ${campaign.amountRaised} ETH`;
                    }
                }
            });
        }
    } else {
        // Hide withdraw section for non-creators
        withdrawSection.style.display = 'none';
    }
}

// Initialize the create campaign page
async function initCreatePage() {
    const createForm = document.getElementById('create-campaign-form');
    const createBtn = document.getElementById('create-btn');
    
    // Make sure web3 and contract are initialized
    if (await initWeb3() && await initContract()) {
        // If wallet is not connected, show connect button
        if (!isConnected) {
            createForm.innerHTML = `
                <div class="wallet-notice">
                    <p>Please connect your wallet to create a campaign</p>
                    <button id="connect-wallet-btn" class="btn primary-btn">Connect Wallet</button>
                </div>
            `;
            
            document.getElementById('connect-wallet-btn').addEventListener('click', async () => {
                if (await connectWallet()) {
                    window.location.reload();
                }
            });
            
            return;
        }
        
        // Handle form submission
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('campaign-name').value;
            const description = document.getElementById('campaign-description').value;
            const goal = document.getElementById('campaign-goal').value;
            const imageUrl = document.getElementById('campaign-image').value;
            
            if (!name || !description || !goal || !imageUrl) {
                alert('Please fill in all fields');
                return;
            }
            
            createBtn.disabled = true;
            createBtn.textContent = 'Creating Campaign...';
            
            const success = await createCampaign(name, description, goal, imageUrl);
            
            if (success) {
                alert('Campaign created successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Failed to create campaign. Please try again.');
                createBtn.disabled = false;
                createBtn.textContent = 'Create Campaign';
            }
        });
    } else {
        createForm.innerHTML = '<p>Failed to connect to the blockchain. Please make sure MetaMask is installed and connected to the Sepolia test network.</p>';
    }
}