delete global._bitcore;
let bitcore = require('bitcore-lib');
import * as explorers from 'bitcore-explorers';
import * as unit from "bitcore-lib/lib/unit";

export default class BitcoinProvider {
    constructor(network) {

        if(network==='mainnet'){
            this.insight = new explorers.Insight('mainnet');
            this.minerFee = unit.fromMilis(0.028).toSatoshis();
            bitcore.Networks.defaultNetwork = bitcore.Networks.mainnet;
        }else{
            this.insight = new explorers.Insight('testnet');
            this.minerFee = unit.fromMilis(0.028).toSatoshis();
            bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
        }

    }


     createPrivateKey() {
        return new bitcore.PrivateKey().toString()

    }


    getBalance(address) {
        return new Promise((resolve, reject) => {
            this.insight.getUnspentUtxos(address, (error, utxos) => {
                if (error) {
                    reject(error)
                } else {
                    let balance = bitcore.Unit(0, 'satoshis').toSatoshis();
                    for (let i = 0; i < utxos.length; i++) {
                        balance += bitcore.Unit(parseInt(utxos[i]['satoshis']), 'satoshis').toSatoshis();
                    }
                    balance = bitcore.Unit(balance, 'satoshis').toBTC()
                    resolve(balance)

                }
            });
        });
    }

    bytesCount(inTrCount, outTrCount) {
        return inTrCount * 180 + outTrCount * 34 + 10 + 1;
    }

    createPublicKey(PrivateKey) {
        return new bitcore.PrivateKey(PrivateKey).toAddress().toString()


    }


     createTransaction (from, to, amountBTC, minerFeePerByte, privateKey) {


         let amount =  bitcore.Unit(amountBTC, 'BTC').toSatoshis()
         return new Promise( (resolve, reject)=> {

            this.insight.getUnspentUtxos(from, (error, utxos)=> {
                if (error) {
                    return reject(error);
                } else {
                    if (utxos.length == 0) {
                        return reject("You don't have enough Satoshis to cover the miner fee.");
                    }
                    let balance = unit.fromSatoshis(0).toSatoshis();
                    for (let i = 0; i < utxos.length; i++) {
                        balance += unit.fromSatoshis(parseInt(utxos[i]['satoshis'])).toSatoshis();
                    }
                    let trBytesCount = this.bytesCount(utxos.length, 2);
                    let minerFee = trBytesCount * minerFeePerByte;
                    if ((balance - amount - this.minerFee) > 0) {

                        try {
                            let bitcore_transaction = new bitcore.Transaction()
                                .from(utxos)
                                .to(bitcore.Address.fromString(to), +amount)
                                .fee(this.minerFee)
                                .change(from)
                                .sign(privateKey)
                                .serialize();
                            this.insight.broadcast(bitcore_transaction, function(error, body) {
                                if (error) {
                                    reject('Error in broadcast: ' + error);
                                } else {
                                    resolve({
                                        transactionId: body
                                    });
                                }
                            });

                        } catch (error) {
                            return reject(error.message);
                        }
                    } else {
                        return reject("You don't have enough Satoshis to cover the miner fee.");
                    }
                }
            });
        });
    }





}