## Bitcoin provider ##

Makes it easy to work with a bitcoin wallet.

## Install ##
``` bash
npm i --save btc-provider
```
## Include ##
```
var BitcoinProvider = require("btc-provider").default;
```
or for ES-2015
```
import BitcoinProvider from 'btc-provider'
```

## Initialize ##
```javascript
const bitcoinProvider = new BitcoinProvider('testnet'); // or mainnet
```
## Usage ##

#### Create private key ####
```javascript
const privateKey = bitcoinProvider.createPrivateKey();
```
#### Create private key from mnemonic ####
```javascript
const privateKey = bitcoinProvider.createPrivateKeyFromMnemonic(mnemonic);

let mnemonic = 'absurd green cannon quarter call spray upper diet defense convince live assist'
or 
let mnemonic = bitcoinProvider.generateMnemonic()
```
#### Create public key ####
```javascript
const publicKey = bitcoinProvider.createPublicKey(privateKey);
```

#### Get balance ####
```javascript
const balance = bitcoinProvider.getBalance(publicKey);
```
#### Create transaction ####
```javascript
bitcoinProvider.createTransaction(from, to, amount, minerFeePerByte, privateKey).then(transaction=>{
    console.log(transaction);
});
```

```
from - your public key 
to - address of the recipient
amount - amount in btc
minerFeePerByte - default equal 0.028 Satoshis
privateKey - your private key
```

