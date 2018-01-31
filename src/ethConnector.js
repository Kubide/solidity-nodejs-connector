const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');
const ProviderEngine = require('web3-provider-engine');
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
const Web3Subprovider = require('web3-provider-engine/subproviders/web3.js');
const Web3 = require('web3');
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
const HDWalletProvider = require('truffle-hdwallet-provider');
const truffleContract = require('truffle-contract');
const debug = require('debug')('kubide:component:blockchain');

class EthConnector {
  constructor(providerURL, smartContractAbi) {
    this.providerUrl = providerURL;
    this.smartContractAbi = smartContractAbi;
  }

  async setWeb3() {
    // set the provider you want from Web3.providers
    const web3 = new Web3(new Web3.providers.HttpProvider(this.providerUrl));

    return web3;
  }


  async generateMnemonic() {
    return bip39.generateMnemonic();
  }

  async createWallet(mnemonic) {
    return hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
  }

  async getAccountAddress(hdwallet, accountNumber = 0) {
    // Get the first account using the standard hd path.
    const walletHdpath = "m/44'/60'/0'/0/";
    const wallet = hdwallet.derivePath(`${walletHdpath}${accountNumber}`).getWallet();
    const address = `0x${wallet.getAddress().toString('hex')}`;
    return address;
  }


  async loggedAddress(mnemonic, address = 0) {
    const provider = new HDWalletProvider(mnemonic, this.providerUrl, address);
    return provider;
  }

  async truffleContract(owner) {
    const MyContract = truffleContract(this.smartContractAbi);
    MyContract.setProvider(owner);
    const instance = await MyContract.deployed();
    return instance;
  }
}

module.exports = EthConnector;
