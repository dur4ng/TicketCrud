//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.8;

//import "./Interfaces/ITicketCrud.sol";

contract TicketCrud {
  error TicketCrud__OnlyOwner();
  error TicketCrud__NotEnoughETHForTicket();

  struct Ticket {
    string name;
    string eventName;
  }

  modifier onlyOwner() {
    if (msg.sender != i_owner) revert TicketCrud__OnlyOwner();
    _;
  }
  modifier notEnoughValue() {
    if (msg.value < TICKET_PRICE) revert TicketCrud__NotEnoughETHForTicket();
    _;
  }

  uint256 constant TICKET_PRICE = 5000;
  address private immutable i_owner;

  mapping(address => Ticket) s_tickets;

  constructor() {
    i_owner = msg.sender;
  }

  function getOwner() external view returns (address) {
    return i_owner;
  }

  function createTicket(string calldata name, string calldata eventName)
    external
    payable
    notEnoughValue
  {}

  function deleteTicket() external {}

  function updateTicket(string calldata name, string calldata eventName)
    external
  {}

  function showMyTicket() external returns (Ticket memory) {
    Ticket memory tmpTicket = Ticket({name: "tmp", eventName: "tmpEvent"});
    return tmpTicket;
  }

  function showTicket(Ticket memory _ticketName)
    external
    returns (Ticket memory)
  {
    Ticket memory tmpTicket = Ticket({name: "tmp", eventName: "tmpEvent"});
    return tmpTicket;
  }

  function hasTicket() external returns (bool) {
    return true;
  }

  function withdraw() external onlyOwner {}
}
