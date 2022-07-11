// yarn hardhat node
// yarn hardhat run scripts/readPrice.ts --network localhost
import { ethers, getNamedAccounts } from "hardhat"
import { TicketCrud } from "../typechain/TicketCrud"

async function getOwner(): Promise<void> {
  // We get the contract to deploy
  const namedAccounts = await getNamedAccounts()
  const deployer = namedAccounts.deployer

  const ticketGrud: TicketCrud = await ethers.getContract(
    "TicketCrud",
    deployer
  )
  const owner: string = await ticketGrud.getOwner()

  console.log(`The owner is: ${owner}`)
}

getOwner().catch((error: string) => {
  console.error(error)
  process.exitCode = 1
})
