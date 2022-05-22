#!/bin/bash

cd contracts/circuits

if [ -f ./powersOfTau28_hez_final_20.ptau ]; then
    echo "powersOfTau28_hez_final_20.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_20.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_20.ptau
fi

echo "Compiling bonus.circom..."

# compile circuit

circom bonus.circom --r1cs --wasm --sym -o .
snarkjs r1cs info bonus.r1cs

# Start a new zkey and make a contribution

snarkjs groth16 setup bonus.r1cs powersOfTau28_hez_final_10.ptau circuit1_0000.zkey
snarkjs zkey contribute circuit1_0000.zkey circuit1_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey circuit1_final.zkey verification1_key.json

# generate solidity contract
snarkjs zkey export solidityverifier circuit1_final.zkey ../verifier.sol

cd ../..