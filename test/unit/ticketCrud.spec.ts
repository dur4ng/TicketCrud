import { assert, expect } from "chai"
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers"
import { network, deployments, ethers, run, getNamedAccounts } from "hardhat"
import { TicketCrud } from "../../typechain/TicketCrud"
import { developmentChains } from "../../helper-hardhat-config"
import { solidity } from "ethereum-waffle"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("TicketCrud", async () => {
      let ticketCrud: TicketCrud
      let namedAccounts
      let deployer: string
      let accounts: SignerWithAddress[]
      let accountTwo: SignerWithAddress
      beforeEach(async () => {
        accounts = await ethers.getSigners()
        accountTwo = accounts[2]
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
      describe("getOwner", async () => {
        it("Return the deployer of the contract", async () => {
          const response: string = await ticketCrud.getOwner()

          assert.equal(response, deployer)
        })
      })
      describe("createTicket", async () => {
        it("Must be reverted if the user not sends enough ETH", async () => {
          await expect(
            ticketCrud.createTicket("newTicket", "newEvent")
          ).to.be.revertedWith("TicketCrud__NotEnouthValueForCreateTicket()")
        })
        it("Initially, a user doesn't have a ticket", async () => {
          await expect(ticketCrud.showMyTicket()).to.be.revertedWith(
            "TicketCrud__UserDoesntHaveTicket()"
          )
        })
        it("After creates a ticket, the user must has a ticket", async () => {
          const createTicketResponse = await ticketCrud.createTicket(
            "newTicket",
            "newEvent",
            {
              value: 5000,
            }
          )
          const showMyTicketResponse: TicketCrud.TicketStructOutput =
            await ticketCrud.showMyTicket()
          const expectedTicket: TicketCrud.TicketStruct = {
            id: "1",
            name: "newTicket",
            eventName: "newEvent",
          }

          assert.equal(showMyTicketResponse.id.toString(), expectedTicket.id)
        })
        it("Must be reverted if user already has a ticket", async () => {
          const createTicketResponse = await ticketCrud.createTicket(
            "newTicket",
            "newEvent",
            {
              value: 5000,
            }
          )
          await expect(
            ticketCrud.createTicket("newTicket", "newEvent", {
              value: 5000,
            })
          ).to.be.revertedWith("TicketCrud__UserAlreadyHasTicket()")
        })
      })
      describe("showMyTicket", async () => {
        it("Initially, a user doesn't have a ticket", async () => {
          await expect(ticketCrud.showMyTicket()).to.be.revertedWith(
            "TicketCrud__UserDoesntHaveTicket()"
          )
        })
        it("After creates a ticket, the user can show his ticket", async () => {
          const createTicketResponse = await ticketCrud.createTicket(
            "newTicket",
            "newEvent",
            {
              value: 5000,
            }
          )
          const showMyTicketResponse: TicketCrud.TicketStructOutput =
            await ticketCrud.showMyTicket()
          const expectedTicket: TicketCrud.TicketStruct = {
            id: "1",
            name: "newTicket",
            eventName: "newEvent",
          }

          assert.equal(showMyTicketResponse.id.toString(), expectedTicket.id)
        })
      })
      describe("showTicket", async () => {
        it("If the address used doesn't have a ticket return an empty struct", async () => {
          const showTicketResponse = await ticketCrud.showTicket(deployer)
          const expectedId = "0"
          assert.equal(showTicketResponse.id.toString(), expectedId)
        })
        it("Show the ticket of the address that the user passed as parameter", async () => {
          const createTicketResponse = await ticketCrud.createTicket(
            "newTicket",
            "newEvent",
            {
              value: 5000,
            }
          )
          const showTicketResponse = await ticketCrud.showTicket(deployer)
          const expectedId = "1"
          assert.equal(showTicketResponse.id.toString(), expectedId)
        })
      })

      describe("updateTicket", async () => {
        it("Revert the call if the user doesn't a ticket", async () => {
          await expect(
            ticketCrud.updateTicket("newName", "newEventName")
          ).to.be.revertedWith("TicketCrud__UserDoesntHaveTicket()")
        })
        it("Update the values of the ticket", async () => {
          const createTicketResponse = await ticketCrud.createTicket(
            "ticket",
            "event",
            {
              value: 5000,
            }
          )
          const updateTicketResponse = await ticketCrud.updateTicket(
            "newTicket",
            "newEvent"
          )
          const showMyTicketResponse = await ticketCrud.showMyTicket()
          const expectedTicketName = "newTicket"

          assert.equal(showMyTicketResponse.name, expectedTicketName)
        })
      })
      describe("deleteTicket", async () => {
        it("Revert the call if the user doesn't a ticket", async () => {
          await expect(ticketCrud.deleteTicket()).to.be.revertedWith(
            "TicketCrud__UserDoesntHaveTicket()"
          )
        })
        it("Reset the values of the address mapping position", async () => {
          const createTicketResponse = await ticketCrud.createTicket(
            "ticket",
            "event",
            {
              value: 5000,
            }
          )
          await ticketCrud.deleteTicket()
          const showTicketResponse = await ticketCrud.showTicket(deployer)
          const expectedTicketName = ""

          assert.equal(showTicketResponse.name, expectedTicketName)
        })
      })
      describe("withdraw", async () => {
        it("Revert the call if the sender is not the owner", async () => {
          const ticketCrudConnectedContract = await ticketCrud.connect(
            accountTwo
          )
          await expect(
            ticketCrudConnectedContract.withdraw()
          ).to.be.revertedWith("TicketCrud__OnlyOwner()")
        })
        it("Send the funds of the contract to the owner", async () => {
          const startingTicketCrudBalance =
            await ticketCrud.provider.getBalance(ticketCrud.address)
          const startingDeployerBalance = await ticketCrud.provider.getBalance(
            deployer
          )

          const withdrawResponse = await ticketCrud.withdraw()
          const withdrawReceipt = await withdrawResponse.wait(1)

          const endingTicketCrudBalance = await ticketCrud.provider.getBalance(
            ticketCrud.address
          )
          const endingDeployerBalance = await ticketCrud.provider.getBalance(
            deployer
          )

          const { gasUsed, effectiveGasPrice } = withdrawReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          assert.equal(endingTicketCrudBalance.toString(), "0")
          assert.equal(
            endingDeployerBalance.add(gasCost).toString(),
            startingDeployerBalance.add(startingTicketCrudBalance).toString()
          )
        })
      })
    })
