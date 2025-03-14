// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fundraiser {
    struct Campaign {
        address payable creator;
        string name;
        string description;
        uint256 goal;
        uint256 amountRaised;
        bool active;
        uint256 createdAt;
        string imageUrl;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount = 0;

    event CampaignCreated(
        uint256 id,
        address creator,
        string name,
        uint256 goal,
        string imageUrl
    );

    event DonationReceived(
        uint256 campaignId,
        address donor,
        uint256 amount
    );

    event FundsWithdrawn(
        uint256 campaignId,
        address recipient,
        uint256 amount
    );

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goal,
        string memory _imageUrl
    ) public returns (uint256) {
        Campaign memory newCampaign = Campaign({
            creator: payable(msg.sender),
            name: _name,
            description: _description,
            goal: _goal,
            amountRaised: 0,
            active: true,
            createdAt: block.timestamp,
            imageUrl: _imageUrl
        });

        campaigns[campaignCount] = newCampaign;
        
        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _name,
            _goal,
            _imageUrl
        );
        
        campaignCount++;
        return campaignCount - 1;
    }

    function donateToCampaign(uint256 _campaignId) public payable {
        require(_campaignId < campaignCount, "Campaign does not exist");
        require(campaigns[_campaignId].active, "Campaign is not active");
        require(msg.value > 0, "Donation must be greater than 0");

        Campaign storage campaign = campaigns[_campaignId];
        campaign.amountRaised += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(msg.sender == campaign.creator, "Only the creator can withdraw funds");
        require(campaign.amountRaised > 0, "No funds to withdraw");

        uint256 amount = campaign.amountRaised;
        campaign.amountRaised = 0;
        campaign.creator.transfer(amount);

        emit FundsWithdrawn(_campaignId, campaign.creator, amount);
    }

    function toggleCampaignStatus(uint256 _campaignId) public {
        require(msg.sender == campaigns[_campaignId].creator, "Only the creator can toggle campaign status");
        campaigns[_campaignId].active = !campaigns[_campaignId].active;
    }

    function getCampaign(uint256 _campaignId) public view returns (
        address creator,
        string memory name,
        string memory description,
        uint256 goal,
        uint256 amountRaised,
        bool active,
        uint256 createdAt,
        string memory imageUrl
    ) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        Campaign memory campaign = campaigns[_campaignId];
        
        return (
            campaign.creator,
            campaign.name,
            campaign.description,
            campaign.goal,
            campaign.amountRaised,
            campaign.active,
            campaign.createdAt,
            campaign.imageUrl
        );
    }

    function getAllCampaigns() public view returns (uint256[] memory) {
        uint256[] memory allCampaigns = new uint256[](campaignCount);
        
        for (uint256 i = 0; i < campaignCount; i++) {
            allCampaigns[i] = i;
        }
        
        return allCampaigns;
    }
}