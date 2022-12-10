const { expect } = require("chai");
const {ethers} = require("hardhat")
const web3 = require('web3');

const StreaXInEther = (n) =>{
    return  web3.utils.toWei(n.toString(), 'ether')
}

describe('StreaXContract', async() => {
    
    beforeEach(async()=>{
        [deployer,user1,user2] = await ethers.getSigners();
        const Contract = await ethers.getContractFactory('StreaX_Contract',deployer);
        Streax = await Contract.deploy();
    })

    describe('On Deployment',()=>{
        it('Initial totalsupply to be 100 StreaX in ether',async()=>{
            const Supply = await Streax.totalSupply();
            expect(Supply).to.be.equal(StreaXInEther(100));
        })

        it('All Supply is in Owners account',async()=>{
            const OwnerBal = await Streax.balanceOf(deployer.address);
            // console.log(OwnerBal);
            expect(OwnerBal).to.be.equal(StreaXInEther(100));
        })
    })
    describe('AfterDeployment ,Minting tokens and issuing if not owner',()=>{
        it('Trying to create and issue 100 StreaX token(in ether) if not owner and is throwing error',async()=>{
            try {
                await Streax.connect(user1).CreateTokens(StreaXInEther(100));
            } catch (error) {
                expect(error).to.be.exist;
            };
        });
    })

    describe('Creating and issueing 100 StreaX token(in ether) if owner',async()=>{
        
          it('Total Supply to be equal to 200 Streax in ether tokens',async()=>{
            await Streax.connect(deployer).CreateTokens(StreaXInEther(100));
            const Supply = await Streax.totalSupply();
            // console.log(Supply);
            expect(Supply).to.be.equal(StreaXInEther(200))
          })
          it('All 200 StreaX in ether token sent to Owner',async()=>{
            await Streax.connect(deployer).CreateTokens(StreaXInEther(100));
            const Bal = await Streax.balanceOf(deployer.address);
            // console.log(Supply);
            expect(Bal).to.be.equal(StreaXInEther(200))
          })
    })
    describe('Transferring Tokens from Owner to User account in ether using TransferToken function',()=>{
        it('Transferrring 50 StreaX token in ether from Owners(deployer) to User1 using TransferToken function',async()=>{
            await Streax.TransferTokens(user1.address,StreaXInEther(50));
            const OwnerBal = await Streax.balanceOf(deployer.address);
            const User1Bal = await Streax.balanceOf(user1.address);
        
            expect(OwnerBal).to.be.equal(StreaXInEther(50));
            expect(User1Bal).to.be.equal(StreaXInEther(50));
        })
        it('Transferring 150 Streax token in ether from Owners(deployer) to User1 using TransferToken function and it throws error', async()=>{
            try {
                await Streax.TransferTokens(user1.address,StreaXInEther(150));
            } catch (error) {
                expect(error).to.be.exist;
            }
        })
        it('Transferring 50 Streax in ether Tokens from Owner to user1 then 25 Streax in ether Tokens from user1 to user2',async()=>{
            await Streax.TransferTokens(user1.address,StreaXInEther(50));
            const OwnerBal = await Streax.balanceOf(deployer.address);
            const User1Bal = await Streax.balanceOf(user1.address);
            expect(OwnerBal).to.be.equal(StreaXInEther(50));
            expect(User1Bal).to.be.equal(StreaXInEther(50));
            await Streax.connect(user1).TransferTokens(user2.address,StreaXInEther(25));
            const user1bal = await Streax.balanceOf(user1.address);
            const user2bal = await Streax.balanceOf(user2.address);
            expect(user1bal).to.be.equal(StreaXInEther(25));
            expect(user2bal).to.be.equal(StreaXInEther(25));
        })
    })
    describe('Transferring Tokens from User1 to User2 account in ether using TransferFromToken function',async()=>{
          
        it('Transferrring Tokens from User1 to User2 without allowance and it throws error',async()=>{
            await Streax.TransferTokens(user1.address,StreaXInEther(50));
            const bal = await Streax.balanceOf(user1.address);
            expect(bal).to.be.equal(StreaXInEther(50));
            try {
                await Streax.TransferFromToken(user1.address,user2.address,StreaXInEther(10))
            } catch (error) {
                expect(error).to.be.exist;
            }
        })
        it('Transferring 50 Streax ether Tokens from User1 to User2 as third party using TransferFrom',async()=>{
            await Streax.TransferTokens(user1.address,StreaXInEther(50));
            const user1bal = await Streax.balanceOf(user1.address);
            expect(user1bal).to.be.equal(StreaXInEther(50));
            // User1 giving allowance to third party in this case deployer to send 50 streax in ether token to send to user2
            await Streax.connect(user1).approve(deployer.address,StreaXInEther(50));
            // using Transfer from function now as a third party
            await Streax.connect(deployer).TransferFromToken(user1.address,user2.address,StreaXInEther(50));
            const user2bal = await Streax.balanceOf(user2.address);
            expect(user2bal).to.be.equal(StreaXInEther(50));

        })
    })
})
