// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract EosFundraising {
    uint public projectCount = 0;
    mapping(uint => Project) public projects;

    struct Project {
        uint id;
        string infoCid;
        uint collectedAmount;
        uint needToCollect;
        address author;
    }

    event ProjectCreated (
        uint id,
        string infoCid,
        uint collectedAmount,
        uint needToCollect,
        address author
    );

    event ProjectTipped(
        uint projectId,
        address from,
        uint amount
    );

    constructor() {}

    function uploadProject(string memory _infoCid, uint _needToCollect) public {
        require(_needToCollect > 0);
        require(bytes(_infoCid).length > 0);
        require(msg.sender!= address(0));

        projectCount++;
        projects[projectCount] = Project(projectCount, _infoCid, 0, _needToCollect, msg.sender);
        emit ProjectCreated(projectCount, _infoCid, 0, _needToCollect, msg.sender);
    }

    function donateToProject(uint _id) public payable {
        require(_id > 0 && _id <=projectCount);
        Project memory _project = projects[_id];
        address _author = _project.author;
        payable(_author).transfer(msg.value);
        _project.collectedAmount = _project.collectedAmount + msg.value;
        projects[_id] = _project;
        emit ProjectTipped(_id, msg.sender, msg.value);
    }
}
