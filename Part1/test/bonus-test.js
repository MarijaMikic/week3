// [bonus] unit test for bonus.circom
// Test for Magic Square
const chai = require("chai");
const {buildPoseidon}= require("circomlibjs");
const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Magic square circuit test", function () {
  this.timeout(100000000);

  
  it("Should compute correct solution", async () => {
    poseidon= await buildPoseidon();
    const circuit = await wasm_tester("contracts/circuits/bonus.circom");
    await circuit.loadConstraints();
    //assert.equal(circuit.nVars, 4372);
    //assert.equal(circuit.constraints.length, 4332);
    
    const privSalt = 5;
    const hash_buff = poseidon([privSalt, 2, 0, 4, 7, 5, 3, 6, 1, 0]);
    const pubSolnHash = poseidon.F.toString(hash_buff);
    const INPUT = {
      "puzzle": [
        ["0", "9", "0"],
        ["0", "0", "0"],
        ["0", "0", "8"]
      ],
      "solution": [
        ["2", "0", "4"],
        ["7", "5", "3"],
        ["6", "1", "0"]
      ],
      privSalt,
      pubSolnHash,
    }

    const witness = await circuit.calculateWitness(INPUT, true)

    //console.log(witness);

    assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
    assert(Fr.eq(Fr.e(witness[1]),Fr.e(pubSolnHash)));
  });
});