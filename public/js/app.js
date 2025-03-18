// Initialize the edit campaign page
async function initEditCampaignPage() {
    const editForm = document.getElementById('edit-campaign-form');
    const updateBtn = document.getElementById('update-btn');
    
    // Get campaign ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');
    
    if (!campaignId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Make sure web3 and contract are initialized
    if (await initWeb3() && await initContract()) {
        // If wallet is not connected, show connect button
        if (!isConnected) {
            editForm.innerHTML = `
                <div class="wallet-notice">
                    <p>Please connect your wallet to edit this campaign</p>
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
        
        // Get campaign details
        const campaign = await getCampaign(campaignId);
        
        if (!campaign) {
            editForm.innerHTML = '<p>Campaign not found or error loading campaign details.</p>';
            return;
        }
        
        // Check if current user is the campaign creator
        if (accounts[0].toLowerCase() !== campaign.creator.toLowerCase()) {
            editForm.innerHTML = `
                <div class="wallet-notice">
                    <p>Only the campaign creator can edit this campaign.</p>
                    <a href="campaign.html?id=${campaignId}" class="btn secondary-btn">Back to Campaign</a>
                </div>
            `;
            return;
        }
        
        // Fill form with campaign details
        document.getElementById('campaign-id').value = campaignId;
        
        const nameField = document.getElementById('campaign-name');
        const descriptionField = document.getElementById('campaign-description');
        const goalField = document.getElementById('campaign-goal');
        const imageUrlField = document.getElementById('campaign-image');
        
        nameField.value = campaign.name;
        descriptionField.value = campaign.description;
        goalField.value = campaign.goal;
        imageUrlField.value = campaign.imageUrl;
        
        // Update character counters
        const nameCharCount = document.getElementById('name-char-count');
        const descCharCount = document.getElementById('desc-char-count');
        const urlCharCount = document.getElementById('url-char-count');
        
        if (nameCharCount) nameCharCount.textContent = campaign.name.length;
        if (descCharCount) descCharCount.textContent = campaign.description.length;
        if (urlCharCount) urlCharCount.textContent = campaign.imageUrl.length;
        
        // Show current amount raised
        const goalHelpText = document.getElementById('goal-help-text');
        const currentRaised = document.getElementById('current-raised');
        if (currentRaised) {
            currentRaised.textContent = campaign.amountRaised;
            goalField.min = campaign.amountRaised;
        }
        
        // Set up image preview
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview && campaign.imageUrl) {
            imagePreview.src = campaign.imageUrl;
            imagePreview.onerror = () => {
                imagePreview.src = 'https://placehold.co/600x400?text=Image+Error';
            };
        }
        
        // Add character counter events
        nameField.addEventListener('input', function() {
            if (nameCharCount) {
                nameCharCount.textContent = this.value.length;
                if (this.value.length > 100) {
                    nameCharCount.style.color = 'red';
                } else {
                    nameCharCount.style.color = '';
                }
            }
        });
        
        descriptionField.addEventListener('input', function() {
            if (descCharCount) {
                descCharCount.textContent = this.value.length;
                if (this.value.length > 500) {
                    descCharCount.style.color = 'red';
                } else {
                    descCharCount.style.color = '';
                }
            }
        });
        
        imageUrlField.addEventListener('input', function() {
            if (urlCharCount) {
                urlCharCount.textContent = this.value.length;
                if (this.value.length > 200) {
                    urlCharCount.style.color = 'red';
                } else {
                    urlCharCount.style.color = '';
                }
            }
            
            // Update image preview on input
            if (imagePreview) {
                imagePreview.src = this.value || 'https://placehold.co/600x400?text=No+Image';
            }
        });
        
        // Handle form submission
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('campaign-id').value;
            const name = nameField.value;
            const description = descriptionField.value;
            const goal = goalField.value;
            const imageUrl = imageUrlField.value;
            
            // Validate input
            const validationError = validateCampaignInput(name, description, goal, imageUrl);
            if (validationError) {
                alert(validationError);
                return;
            }
            
            // Check that goal is not less than amount raised
            if (parseFloat(goal) < parseFloat(campaign.amountRaised)) {
                alert(`Goal cannot be less than the current amount raised (${campaign.amountRaised} ETH)`);
                return;
            }
            
            updateBtn.disabled = true;
            updateBtn.textContent = 'Updating Campaign...';
            
            try {
                const success = await updateCampaign(id, name, description, goal, imageUrl);
                
                if (success) {
                    alert('Campaign updated successfully!');
                    window.location.href = `campaign.html?id=${id}`;
                } else {
                    updateBtn.disabled = false;
                    updateBtn.textContent = 'Update Campaign';
                }
            } catch (error) {
                console.error("Campaign update error:", error);
                updateBtn.disabled = false;
                updateBtn.textContent = 'Update Campaign';
            }
        });
    } else {
        editForm.innerHTML = '<p>Failed to connect to the blockchain. Please make sure MetaMask is installed and connected to the Sepolia test network.</p>';
    }
}// app.js - Main application logic

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
    // If we're on the edit campaign page
    else if (path.endsWith('edit-campaign.html')) {
        initEditCampaignPage();
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
        
        // Check if image URL exists and handles image error
        const imageUrl = campaign.imageUrl || 'https://placehold.co/600x400?text=No+Image';
        
        const campaignCard = document.createElement('div');
        campaignCard.className = 'campaign-card';
        campaignCard.innerHTML = `
            <img src="${imageUrl}" alt="${campaign.name}" class="campaign-image" onerror="this.src='https://placehold.co/600x400?text=Image+Error'">
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
    
    // Check if image URL exists and handles image error
    const imageUrl = campaign.imageUrl || 'https://placehold.co/600x400?text=No+Image';
    
    campaignDetails.innerHTML = `
        <img src="${imageUrl}" alt="${campaign.name}" class="campaign-details-image" onerror="this.src='https://placehold.co/600x400?text=Image+Error'">
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
        // Create owner actions section before the withdraw section
        const ownerActionsHTML = `
            <div class="owner-actions">
                <h3>Campaign Owner Actions</h3>
                <p>As the creator of this campaign, you can manage it using these options:</p>
                <div class="owner-actions-buttons">
                    <a href="edit-campaign.html?id=${campaign.id}" class="btn primary-btn">Edit Campaign</a>
                    <button id="toggle-status-btn" class="btn secondary-btn">${campaign.active ? 'Pause Campaign' : 'Activate Campaign'}</button>
                </div>
                <p class="owner-actions-note">Note: Pausing a campaign will prevent new donations, but won't affect funds already raised.</p>
            </div>
        `;
        
        // Insert owner actions section before withdraw section
        withdrawSection.insertAdjacentHTML('beforebegin', ownerActionsHTML);
        
        // Set up the toggle status button
        const toggleStatusBtn = document.getElementById('toggle-status-btn');
        toggleStatusBtn.addEventListener('click', async () => {
            try {
                toggleStatusBtn.disabled = true;
                toggleStatusBtn.textContent = 'Processing...';
                
                // Call the toggleCampaignStatus function
                await toggleCampaignStatus(campaign.id);
                
                alert(`Campaign ${campaign.active ? 'paused' : 'activated'} successfully!`);
                window.location.reload();
            } catch (error) {
                console.error('Error toggling campaign status:', error);
                alert('Failed to update campaign status. Please try again.');
                toggleStatusBtn.disabled = false;
                toggleStatusBtn.textContent = campaign.active ? 'Pause Campaign' : 'Activate Campaign';
            }
        });
        
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
        
        // Add help text and limits for fields
        const descriptionField = document.getElementById('campaign-description');
        if (descriptionField) {
            descriptionField.maxLength = 500;
            
            // Add help text if it doesn't exist
            const descParent = descriptionField.parentElement;
            let helpText = descParent.querySelector('.help-text');
            if (!helpText) {
                helpText = document.createElement('p');
                helpText.className = 'help-text';
                descParent.appendChild(helpText);
            }
            helpText.textContent = 'Describe your campaign (maximum 500 characters)';
        }
        
        const nameField = document.getElementById('campaign-name');
        if (nameField) {
            nameField.maxLength = 100;
            
            // Add help text if it doesn't exist
            const nameParent = nameField.parentElement;
            let helpText = nameParent.querySelector('.help-text');
            if (!helpText) {
                helpText = document.createElement('p');
                helpText.className = 'help-text';
                nameParent.appendChild(helpText);
            }
            helpText.textContent = 'Maximum 100 characters';
        }
        
        const imageUrlField = document.getElementById('campaign-image');
        if (imageUrlField) {
            imageUrlField.maxLength = 200;
            
            // Add help text if it doesn't exist
            const imgParent = imageUrlField.parentElement;
            let helpText = imgParent.querySelector('.help-text');
            if (!helpText) {
                helpText = document.createElement('p');
                helpText.className = 'help-text';
                imgParent.appendChild(helpText);
            }
            
            // Update help text with more specific guidance
            helpText.innerHTML = `Image URL must be less than 200 characters. 
                <br>For LinkedIn images, use a direct image service like <a href="https://imgur.com" target="_blank">Imgur</a> instead.
                <br>URL character count: <span id="url-char-count">0</span>/200`;
            
            // Add character counter
            imageUrlField.addEventListener('input', function() {
                const charCount = document.getElementById('url-char-count');
                if (charCount) {
                    charCount.textContent = this.value.length;
                    if (this.value.length > 200) {
                        charCount.style.color = 'red';
                    } else {
                        charCount.style.color = '';
                    }
                }
            });
        }
        
        // Handle form submission
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('campaign-name').value;
            const description = document.getElementById('campaign-description').value;
            const goal = document.getElementById('campaign-goal').value;
            const imageUrl = document.getElementById('campaign-image').value;
            
            // Validate input
            const validationError = validateCampaignInput(name, description, goal, imageUrl);
            if (validationError) {
                alert(validationError);
                return;
            }
            
            createBtn.disabled = true;
            createBtn.textContent = 'Creating Campaign...';
            
            try {
                const success = await createCampaign(name, description, goal, imageUrl);
                
                if (success) {
                    alert('Campaign created successfully!');
                    window.location.href = 'index.html';
                } else {
                    createBtn.disabled = false;
                    createBtn.textContent = 'Create Campaign';
                }
            } catch (error) {
                console.error("Campaign creation error:", error);
                createBtn.disabled = false;
                createBtn.textContent = 'Create Campaign';
            }
        });
    } else {
        createForm.innerHTML = '<p>Failed to connect to the blockchain. Please make sure MetaMask is installed and connected to the Sepolia test network.</p>';
    }
}