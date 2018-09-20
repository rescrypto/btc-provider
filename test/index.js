import BitcoinProvider from '../lib'

const btc = new BitcoinProvider('testnet')
let privateKey = btc.createPrivateKeyFromMnemonic('hire piece name bind bulb hour impulse student pair useless rubber embark');
console.log(privateKey);
let publicKey = btc.createPublicKey(privateKey);
console.log(publicKey);
btc.getBalance(publicKey).then(balance => {
    console.log(balance);
});
