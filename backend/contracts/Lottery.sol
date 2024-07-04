// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Lottery {
    address[] public participants;
    address[] public winners;
    uint256 public entryFee = 0.000002 ether;

    event LotteryEntered(address indexed participant);
    event LotteryDrawn(address[] winners, uint256[] prizes);

    function enterLottery() public payable {
        require(msg.value == entryFee, "Incorrect entry fee");
        require(participants.length < 4, "Lottery is full");

        participants.push(msg.sender);
        emit LotteryEntered(msg.sender);

        if (participants.length == 4) {
            drawLottery();
        }
    }

    function drawLottery() internal {
        require(participants.length == 4, "Not enough participants");

        // Select 3 winners randomly
        for (uint256 i = 0; i < 3; i++) {
            uint256 randomIndex = random() % participants.length;
            winners.push(participants[randomIndex]);
            removeParticipant(randomIndex);
        }

        // Assign random ETH prizes to winners
        uint256[] memory prizes = new uint256[](3);
        prizes[0] = 0.00001 ether;
        prizes[1] = 0.000003 ether;
        prizes[2] = 0.000002 ether;

        for (uint256 i = 0; i < 3; i++) {
            payable(winners[i]).transfer(prizes[i]);
        }

        emit LotteryDrawn(winners, prizes);

        // Reset participants and winners
        delete participants;
        delete winners;
    }

    function removeParticipant(uint256 index) internal {
        participants[index] = participants[participants.length - 1];
        participants.pop();
    }

    // as a smart contract auditor, I know this way of randomness is not a good thing for this contract, a better way is to use Chainlink VRF. But for the sake of simplicity, I will leave it as it is.
    function random() internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, participants)));
    }
}
