const crypto = require('crypto'), SHA256 = message => crypto.createHash("sha256").update(message).digest('hex')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transactions{
  constructor(from, to, amount){

    this.from = from
    this.to = to
    this.amount = amount
  }
  getHash(){
    return SHA256(this.from + this.to + this.amount).toString();
  }
  signTransaction(signKey){
    if(signKey.getPublic('hex') !== this.from){
      throw new Error('You cannot sign')
    }


    const hashTx = this.getHash();
    const sig = signKey.sign(hashTx, 'base64')
    this.signature = sig.toDER('hex')
  }
  isValid(){
    if(this.from === null) return true;

    if(!this.signature || this.signature.lenght === 0){
      throw new Error('No signature')
    }

    const publicKey = ec.keyFromPublic(this.from, 'hex')
    return publicKey.verify(this.getHash(), this.signature)
  }
}

class Block {
 constructor(timestamp="", transaction, preHash="") {
   this.timestamp = timestamp;
   this.transaction = transaction;
   this.hash = this.getHash();
   this.preHash = "";
   this.nonce = 0;

 }
 getHash() {
   return SHA256(this.preHash + this.timestamp + this.nonce + JSON.stringify(this.transaction));
 }
 mineBlock(difficulty){
   while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
     this.nonce++;
     this.hash = this.getHash()
   }
   console.log('Block mined ' + this.hash)
 }
 hasValidTransaction(){
   for(const tx of this.transaction){
     if(!tx.isValid()){
       return false;
     }
   }
   return true;
 }
}






class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 150;
  }

  createGenesisBlock(){
    return new Block(Date.now().toString(), 'ff', '0');
  }
  getLastBlock() {
    return this.chain[this.chain.length -1];
  }
  // addBlock(block){
  //   block.preHash = this.getLastBlock().hash;
  //
  //   // block.hash = block.getHash();
  //   block.mineBlock(this.difficulty);
  //
  //   this.chain.push(Object.freeze(block));
  // }
  minePedingTransactions(miningRewardAddress){
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('succesfully mined!');
    

    this.chain.push(block);
    this.pendingTransactions = [
      new Transactions(null, miningRewardAddress, this.miningReward)
    ]
  }

  addTransactions(transaction){

    if(!transaction.from || !transaction.to){
      throw new Error('Must include')
    }

    if(!transaction.isValid()){
      throw new Error('Cannot add invalid transaction to chain')
    }

    this.pendingTransactions.push(transaction);
  }

  getBalanceAddress(address){
    let balance = 0;

    for(const block of this.chain){
      for(const trans of block.transaction){
        if (trans.from === address){
          balance -= trans.amount
        }
        if (trans.to === address){
          balance += trans.amount
        }
      }


    }
    return balance
  }

  isValid(blockchain = this) {
    for (let i = 1; i < blockchain.chain.length; i++) {
      const currentBlock = blockchain.chain[i];
      const preBlock = blockchain.chain[i-1];

      if(!currentBlock.hasValidTransaction()){
        return false;
      }

      if (currentBlock.hash !== currentBlock.getHash() || preBlock.hash !== currentBlock.preHash){
        return false;
      }

    }

    return true;
  }
}


module.exports = {Block, Blockchain, Transactions}
