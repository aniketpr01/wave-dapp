const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  let wavesAddresses = [];
  let waveMapping = {};
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  waveMapping[owner.address] = 0;
  waveMapping[randomPerson.address] = 0;

  await waveContract.getTotalWaves();

  const firstWaveTxn = await waveContract.wave("A message!");
  await firstWaveTxn.wait();
  wavesAddresses.push(owner.address);
  waveMapping[owner.address] += 1;

  await waveContract.getTotalWaves();

  const secondWaveTxn = await waveContract
    .connect(randomPerson)
    .wave("Another message!");
  await secondWaveTxn.wait();
  wavesAddresses.push(randomPerson.address);
  waveMapping[randomPerson.address] += 1;

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  await waveContract.getTotalWaves();

  console.log("Array of addresses who waved are ");

  for (var i = 0; i < wavesAddresses.length; i++) {
    console.log(wavesAddresses[i]);
  }

  for (var key in waveMapping) {
    console.log("Address ", key, " waved: ", waveMapping[key], "times.");
  }

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
