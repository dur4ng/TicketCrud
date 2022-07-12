//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.8;

//import "./Interfaces/ITicketCrud.sol";
import "hardhat/console.sol";

contract TicketCrud {
  error TicketCrud__OnlyOwner();
  error TicketCrud__NotEnouthValueForCreateTicket();
  error TicketCrud__UserAlreadyHasTicket();
  error TicketCrud__UserDoesntHaveTicket();

  struct Ticket {
    uint256 id;
    string name;
    string eventName;
  }

  modifier onlyOwner() {
    if (msg.sender != i_owner) revert TicketCrud__OnlyOwner();
    _;
  }
  modifier enoughValue() {
    if (msg.value < TICKET_PRICE)
      revert TicketCrud__NotEnouthValueForCreateTicket();
    _;
  }
  modifier noTicketPossession() {
    if (s_tickets[msg.sender].id != 0)
      revert TicketCrud__UserAlreadyHasTicket();
    _;
  }
  modifier ticketPossession() {
    if (s_tickets[msg.sender].id == 0)
      revert TicketCrud__UserDoesntHaveTicket();
    _;
  }

  uint256 constant TICKET_PRICE = 5000;
  address private immutable i_owner;

  uint256 autonumericCount = 0;
  mapping(address => Ticket) s_tickets;

  constructor() {
    i_owner = msg.sender;
  }

  function getOwner() external view returns (address) {
    return i_owner;
  }

  function showMyTicket()
    external
    view
    ticketPossession
    returns (Ticket memory)
  {
    return s_tickets[msg.sender];
  }

  function showTicket(address _address) external view returns (Ticket memory) {
    return s_tickets[_address];
  }

  function createTicket(string calldata _name, string calldata _eventName)
    external
    payable
    enoughValue
    noTicketPossession
  {
    autonumericCount = autonumericCount + 1;
    Ticket memory newTicket = Ticket({
      id: autonumericCount,
      name: _name,
      eventName: _eventName
    });
    s_tickets[msg.sender] = newTicket;
  }

  function deleteTicket() external ticketPossession {
    Ticket memory resetedTicket = Ticket(0, "", "");
    s_tickets[msg.sender] = resetedTicket;
  }

  function updateTicket(string calldata _name, string calldata _eventName)
    external
    ticketPossession
  {
    uint256 ticketId = s_tickets[msg.sender].id;
    Ticket memory updatedTicket = Ticket(ticketId, _name, _eventName);
    s_tickets[msg.sender] = updatedTicket;
  }

  function withdraw() external onlyOwner {
    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    require(callSuccess, "Call failed");
  }
}
