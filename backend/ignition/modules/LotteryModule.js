const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LotteryModule", (m) => {
  // No specific parameters needed for deploying the Election contract
  const lottery = m.contract("Lottery", [], {});

  return { lottery };
});
