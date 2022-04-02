const {Transactions, Block, Blockchain} = require("./blockchain.js")
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const coin = new Blockchain();
const myKey = ec.keyFromPrivate('4bcbb6bf2c3ab9f27274e10bd4948ba28daccda0833d707e351c59894cd34bc0');
const myWalletAddress = myKey.getPublic('hex')

const tx1 = new Transactions(myWalletAddress, 'public key ', 10)
tx1.signTransaction(myKey)
coin.addTransactions(tx1)

coin.minePedingTransactions('kir')
coin.minePedingTransactions('kir')

console.log('Balance new ', coin.getBalanceAddress(myWalletAddress))

console.log(coin.isValid())


// coin.addBlock(new Block(Date.now().toString(), {from: 'Kir', to: "Alex", amount: 200}));
// coin.addBlock(new Block(Date.now().toString(), {from: 'Seva', to: "Farid", amount: 3300}));
// coin.addBlock(new Block(Date.now().toString(), {from: 'Odin', to: "Ragnar", amount: 7800}));

// console.log('is blockchain valid ' + coin.isValid())

// console.log('1 mining')
// coin.addBlock(new Block(Date.now().toString(), {from: 'Kir', to: "Alex", amount: 200}))
// console.log('2 mining')
// coin.addBlock(new Block(Date.now().toString(), {from: 'sixty', to: "mur", amount: 13}))


// coin.createTransactions(new Transactions('two', "one", 100))
// coin.createTransactions(new Transactions('one', "two", 50))
//
// console.log('start')
// coin.minePedingTransactions('kir')
//
// console.log('Balance', coin.getBalanceAddress('kir'))
//
// coin.minePedingTransactions('kir')
// console.log('Balance new ', coin.getBalanceAddress('kir'))
