//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const {buildPoseidon}= require("circomlibjs");
const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const assert = chai.assert;
describe("MastermindVariation test", function () {
    this.timeout(100000000);

    it("Testing the game - First attempt!", async () => {
        poseidon= await buildPoseidon();
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        const privSolnA=5;
        const privSolnB=2;
        const privSolnC=1;
        const privSolnD=4;
        const privSalt=6;
        const pubNumGuess=1;
        const hash_buff = poseidon([privSalt, privSolnA, privSolnB, privSolnC, privSolnD]);
        const pubSolnHash = poseidon.F.toString(hash_buff);
        const INPUT = {
        "pubGuessA":"1",
        "pubGuessB":"2",
        "pubGuessC":"3",
        "pubGuessD":"4",
        "pubNumHit":"2",
        "pubNumBlow":"1",
        pubSolnHash,
        pubNumGuess,
        privSolnA,
        privSolnB,
        privSolnC,
        privSolnD,
        privSalt
        }
        //console.log(INPUT);
        const witness = await circuit.calculateWitness(INPUT, true);
        //console.log(witness);
        //console.log(Fr.e(1));
        //console.log(Fr.e(witness[1]));
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(pubSolnHash)));

});


    it("Testing the game - Second time, mastermind solved!", async () => {
        poseidon= await buildPoseidon();
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        const privSolnA=1;
        const privSolnB=2;
        const privSolnC=3;
        const privSolnD=4;
        const privSalt=5;
        const pubNumGuess=2;
        const hash_buff = poseidon([privSalt, privSolnA, privSolnB, privSolnC, privSolnD]);
        const pubSolnHash = poseidon.F.toString(hash_buff);
        const INPUT = {
        "pubGuessA":"1",
        "pubGuessB":"2",
        "pubGuessC":"3",
        "pubGuessD":"4",
        "pubNumHit":"4",
        "pubNumBlow":"0",
        pubSolnHash,
        pubNumGuess,
        privSolnA,
        privSolnB,
        privSolnC,
        privSolnD,
        privSalt
        }
        //console.log(INPUT);
        const witness = await circuit.calculateWitness(INPUT, true);
        //console.log(witness);
        //console.log(Fr.e(1));
        //console.log(Fr.e(witness[1]));
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(pubSolnHash)));
    }); 

   
        
});