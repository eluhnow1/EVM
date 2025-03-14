# @version 0.3.7

# Event for campaign creation
event CampaignCreated:
    id: uint256
    creator: indexed(address)
    name: String[100]
    goal: uint256
    imageUrl: String[200]

# Event for donations
event DonationReceived:
    campaignId: indexed(uint256)
    donor: indexed(address)
    amount: uint256

# Event for fund withdrawals
event FundsWithdrawn:
    campaignId: indexed(uint256)
    recipient: indexed(address)
    amount: uint256

# Campaign struct as a dataclass
struct Campaign:
    creator: address
    name: String[100]
    description: String[500]
    goal: uint256
    amountRaised: uint256
    active: bool
    createdAt: uint256
    imageUrl: String[200]

# State variables
campaigns: public(HashMap[uint256, Campaign])
campaignCount: public(uint256)

@external
def __init__():
    """
    Initialize the contract with 0 campaigns
    """
    self.campaignCount = 0

@external
def createCampaign(
    _name: String[100], 
    _description: String[500], 
    _goal: uint256, 
    _imageUrl: String[200]
) -> uint256:
    """
    Create a new fundraising campaign
    
    @param _name: Name of the campaign
    @param _description: Description of the campaign
    @param _goal: Funding goal in wei
    @param _imageUrl: URL to campaign image
    @return: ID of the created campaign
    """
    newCampaign: Campaign = Campaign({
        creator: msg.sender,
        name: _name,
        description: _description,
        goal: _goal,
        amountRaised: 0,
        active: True,
        createdAt: block.timestamp,
        imageUrl: _imageUrl
    })
    
    self.campaigns[self.campaignCount] = newCampaign
    
    log CampaignCreated(
        self.campaignCount,
        msg.sender,
        _name,
        _goal,
        _imageUrl
    )
    
    self.campaignCount += 1
    return self.campaignCount - 1

@external
@payable
def donateToCampaign(_campaignId: uint256):
    """
    Donate to a campaign
    
    @param _campaignId: ID of the campaign to donate to
    """
    assert _campaignId < self.campaignCount, "Campaign does not exist"
    assert self.campaigns[_campaignId].active, "Campaign is not active"
    assert msg.value > 0, "Donation must be greater than 0"
    
    self.campaigns[_campaignId].amountRaised += msg.value
    
    log DonationReceived(_campaignId, msg.sender, msg.value)

@external
def withdrawFunds(_campaignId: uint256):
    """
    Withdraw funds from a campaign
    
    @param _campaignId: ID of the campaign to withdraw funds from
    """
    assert msg.sender == self.campaigns[_campaignId].creator, "Only the creator can withdraw funds"
    assert self.campaigns[_campaignId].amountRaised > 0, "No funds to withdraw"
    
    amount: uint256 = self.campaigns[_campaignId].amountRaised
    self.campaigns[_campaignId].amountRaised = 0
    
    send(self.campaigns[_campaignId].creator, amount)
    
    log FundsWithdrawn(_campaignId, self.campaigns[_campaignId].creator, amount)

@external
def toggleCampaignStatus(_campaignId: uint256):
    """
    Toggle the active status of a campaign
    
    @param _campaignId: ID of the campaign to toggle status
    """
    assert msg.sender == self.campaigns[_campaignId].creator, "Only the creator can toggle campaign status"
    self.campaigns[_campaignId].active = not self.campaigns[_campaignId].active

@view
@external
def getCampaign(_campaignId: uint256) -> (address, String[100], String[500], uint256, uint256, bool, uint256, String[200]):
    """
    Get details of a campaign
    
    @param _campaignId: ID of the campaign to get details of
    @return: Tuple containing campaign details
    """
    assert _campaignId < self.campaignCount, "Campaign does not exist"
    campaign: Campaign = self.campaigns[_campaignId]
    
    return (
        campaign.creator,
        campaign.name,
        campaign.description,
        campaign.goal,
        campaign.amountRaised,
        campaign.active,
        campaign.createdAt,
        campaign.imageUrl
    )

@view
@external
def getAllCampaigns() -> DynArray[uint256, 100]:
    """
    Get IDs of all campaigns
    
    @return: Array of campaign IDs
    """
    allCampaigns: DynArray[uint256, 100] = []
    
    for i in range(100):
        if i >= self.campaignCount:
            break
        allCampaigns.append(i)
    
    return allCampaigns