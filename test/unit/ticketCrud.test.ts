import { assert, expect } from "chai"
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers"
import { network, deployments, ethers, run, getNamedAccounts } from "hardhat"
import { TicketCrud } from "../../typechain/TicketCrud"
import { developmentChains } from "../../helper-hardhat-config"
import { Address } from "hardhat-deploy/types"
import { string } from "hardhat/internal/core/params/argumentTypes"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("TicketCrud", async () => {
      let ticketCrud: TicketCrud
      let namedAccounts
      let deployer: string
      beforeEach(async () => {
        //const accounts = await ethers.getSigners()
        //const accountZero = accounts[0]
        namedAccounts = await getNamedAccounts()
        deployer = namedAccounts.deployer

        await deployments.fixture(["all"])
        ticketCrud = await ethers.getContract("TicketCrud", deployer)
      })
      describe("constructor", async () => {
        it("Set the owner correctly", async () => {
          const ownerAddress: string = await ticketCrud.getOwner()
          assert.equal(ownerAddress, deployer)
        })
      })
    })
