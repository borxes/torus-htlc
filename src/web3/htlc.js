import Web3 from 'web3';
import { HTLC_ABI } from './htlc-abi';

const HTLC_ROPSTEN = '0x243785f6B65418191ea20B45FdE7069ffe4F8ceF';

export const newContract = async (web3, sender, receiver, hashlock, timelock, amount) => {

  const htlcContract = new web3.eth.Contract(HTLC_ABI, HTLC_ROPSTEN);
  const encoded = htlcContract.methods.newContract(receiver, hashlock, timelock)
    .encodeABI();
  const tx = {
    from: sender,
    to: HTLC_ROPSTEN,
    data: encoded,
    gasLimit: 200000,
    gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
    value: web3.utils.toWei(amount.toString(), 'ether'),
  };
  const txnHash = await web3.eth.sendTransaction(tx);
  return txnHash;
}

export const withdraw = async (web3, sender, contractId, preimage) => {
  const htlcContract = new web3.eth.Contract(HTLC_ABI, HTLC_ROPSTEN);
  const encoded = htlcContract.methods.withdraw(contractId, preimage)
    .encodeABI();
  const tx = {
    from: sender,
    to: HTLC_ROPSTEN,
    data: encoded,
    gasLimit: 200000,
    gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
  };
  console.log(tx);
  const txnHash = await web3.eth.sendTransaction(tx);
  return txnHash;
}

export const subscribe = async (callback) => {
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/59d4ada40c8e498c87238ff2f1e765ee')
  );
  const instance = new web3.eth.Contract(HTLC_ABI, HTLC_ROPSTEN);
  instance.once('LogHTLCNew', {
    fromBlock: 'latest'
  }, (error, event) => { console.log(`subscribe got event ${event.raw}`); callback(event.raw.topics[1]) });
}