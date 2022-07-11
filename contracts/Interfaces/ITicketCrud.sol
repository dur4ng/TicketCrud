// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

/// @title ITicketCrud
/// @author dur4n
/// @notice Contract that permits crud operations over a ticket object
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.
interface ITicketCrud {
  error TicketCrud__OnlyOwner();
  error TicketCrud__NotEnoughETHForTicket();

  struct Ticket {
    string name;
    string eventName;
  }

  function createTicket(Ticket memory _newTicket) external;

  function deleteTicket() external;

  function updateTicket(string calldata name, string calldata eventName)
    external;

  function showMyTicket() external returns (Ticket calldata);

  function showTicket(string calldata _ticketName)
    external
    returns (Ticket calldata);

  function hasTicket() external returns (bool);

  function withdraw() external;
}
