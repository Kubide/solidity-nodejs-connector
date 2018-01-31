const debug = require('debug')('kubide:index');
const EthConnector = require('./ethConnector.js');
const smartContractAbi = require('../contracts/OurToken.json');


// const infuraApikey = 'your-key';
// const providerUrl = `https://ropsten.infura.io/${infuraApikey}`;
const providerUrl = 'http://localhost:7545';
const ganacheMnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';


const a = async () => {
  const ethConnector = new EthConnector(providerUrl, smartContractAbi);

  /** First: Set environment */
  const web3 = await ethConnector.setWeb3();
  // debug('web3', web3);

  let mnemonic = await ethConnector.generateMnemonic();

  // We use the Ganache mnemonic
  mnemonic = ganacheMnemonic;
  debug('The mnemonic', mnemonic);

  const wallet = await ethConnector.createWallet(mnemonic);
  debug('Created wallet', wallet);

  const ownerAddress = await ethConnector.getAccountAddress(wallet);
  debug('Get Owner account address', ownerAddress);

  const ourTokenOwner = await ethConnector.loggedAddress(mnemonic, 0);
  debug('The owner of the Smart Contract', ourTokenOwner);

  const ourTokenDeployed = await ethConnector.truffleContract(ourTokenOwner);
  // debug('the the Smart Contract', ourTokenDeployed);

  let totalBalance = await ourTokenDeployed.totalSupply.call();
  debug('The total balance is', totalBalance);
  /** First: Set environment */

  /** Second: tests */

  // Set address
  const alice = await ethConnector.getAccountAddress(wallet, 1);
  debug('Get Alice account address ', alice);

  const bob = await ethConnector.getAccountAddress(wallet, 2);
  debug('Get Alice account address ', bob);

  const carol = await ethConnector.getAccountAddress(wallet, 3);
  debug('Get Alice account address ', carol);


  // Transfer from the Owner to Alice
  let cash = 1000;
  let balance = await ourTokenDeployed.balanceOf.call(ownerAddress);
  debug('The current owner\'s balance', balance);

  let tx = await ourTokenDeployed.transfer(alice, cash, { from: ownerAddress });
  // debug('The tx', tx);

  balance = await ourTokenDeployed.balanceOf.call(ownerAddress);
  debug('The new owner\'s balance', balance);

  balance = await ourTokenDeployed.balanceOf.call(alice);
  debug('The current Alice\'s balance', balance);


  // Transfer from the Alice to Bob

  // First, log in Alice
  const aliceLogged = await ethConnector.loggedAddress(mnemonic, 1);
  const aliceTokenAccess = await ethConnector.truffleContract(aliceLogged);

  cash = 50;

  tx = await aliceTokenAccess.transfer(bob, cash, { from: alice });
  // debug('The tx', tx);

  balance = await ourTokenDeployed.balanceOf.call(alice);
  debug('The new Alice\'s balance', balance);

  balance = await ourTokenDeployed.balanceOf.call(bob);
  debug('The current Bob\'s balance', balance);


  // Mint to Carol
  const quantityToAdd = 12002;
  tx = await ourTokenDeployed.mint(carol, quantityToAdd, { from: ownerAddress });
  // debug('The tx', tx);

  totalBalance = await ourTokenDeployed.totalSupply.call();
  debug('The total balance is', totalBalance);

  balance = await ourTokenDeployed.balanceOf.call(carol);
  debug('The current Carol\'s balance', balance);

  /** Second: tests */

  return true;
};

a();
