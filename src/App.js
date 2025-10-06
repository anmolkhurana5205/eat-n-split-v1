import { useState } from "react";

const friends = [
  {
    id: 1,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 2,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 3,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friendsList, setFriendsList] = useState(friends);
  const [isAddFriendPanelOpen, setIsAddFriendPanelOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [billPayer, setBillPayer] = useState(0);

  function handlePressingAddFriend() {
    setIsAddFriendPanelOpen((isAddFriendPanelOpen) => !isAddFriendPanelOpen);
  }

  function handleAddingFriend(item) {
    setFriendsList((friendsList) => [...friendsList, item]);
  }

  function handleSeletingFriend(id) {
    if (selectedFriend === id) {
      setSelectedFriend(null);
      return;
    }
    setSelectedFriend(id);
  }

  function handleSplitBill(bill, yourExpense) {
    if (billPayer === 0) {
      setFriendsList((friends) =>
        friends.map((friend) =>
          friend.id === selectedFriend
            ? { ...friend, balance: friend.balance + (bill - yourExpense) }
            : friend
        )
      );
    } else if (billPayer === selectedFriend) {
      setFriendsList((friends) =>
        friends.map((friend) =>
          friend.id === selectedFriend
            ? { ...friend, balance: friend.balance - yourExpense }
            : friend
        )
      );
    }
  }

  return (
    <div className="app">
      <div className="sidebar">
        <List
          friends={friendsList}
          handleSeletingFriend={handleSeletingFriend}
          selectedFriend={selectedFriend}
        />

        {isAddFriendPanelOpen && (
          <FormAddFriend handleAddingFriend={handleAddingFriend} />
        )}

        <Button onClick={handlePressingAddFriend}>
          {!isAddFriendPanelOpen ? "Add Friend" : "Close"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          friendsList={friendsList}
          setFriendsList={setFriendsList}
          billPayer={billPayer}
          setBillPayer={setBillPayer}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function List({ friends, handleSeletingFriend, selectedFriend }) {
  return (
    <>
      <ul>
        {friends.map((friend) => (
          <Friend
            handleSeletingFriend={handleSeletingFriend}
            friend={friend}
            key={friend.id}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </>
  );
}

function Friend({ friend, handleSeletingFriend, selectedFriend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <Button onClick={() => handleSeletingFriend(friend.id)}>
        {selectedFriend === friend.id ? `Close` : `Select`}
      </Button>
      <p
        className={`${friend.balance > 0 ? "green" : ""} ${
          friend.balance < 0 ? "red" : ""
        }`}
      >
        {`${
          friend.balance > 0 ? `${friend.name} owe you ${friend.balance}$` : ""
        } ${
          friend.balance < 0
            ? `You owe ${friend.name} ${Math.abs(friend.balance)}$`
            : ""
        } ${friend.balance === 0 ? `You and ${friend.name} are even` : ""}`}
      </p>
    </li>
  );
}

function FormAddFriend({ handleAddingFriend }) {
  function handleOnSubmit(e) {
    e.preventDefault();
    // console.log(e);

    if (!e.target[0].value) {
      alert("Please enter name of the friend!!!");
      return;
    }

    if (!e.target[1].value) {
      e.target[1].value = "https://i.pravatar.cc/48?u=499472";
    }

    const newItem = {
      id: Date.now(),
      name: e.target[0].value,
      image: e.target[1].value,
      balance: 0,
    };

    handleAddingFriend(newItem);

    e.target[0].value = "";
    e.target[1].value = "";
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleOnSubmit(e)}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input type="text" />

      <label>🖼️Image URL</label>
      <input type="text" />

      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormSplitBill({
  selectedFriend,
  friendsList,
  setBillPayer,
  billPayer,
  handleSplitBill,
}) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");

  const friend = friendsList.filter((curr) => selectedFriend === curr.id);

  function handleOnSubmit(e) {
    e.preventDefault();
    // console.log(e);

    if (!e.target[0].value) {
      alert(
        "Ohh! Seems like you didn't enter total billing amount. (please enter it and try again)"
      );
      return;
    }

    handleSplitBill(bill, yourExpense);

    setBill("");
    setYourExpense("");
    setBillPayer(0);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleOnSubmit(e)}>
      <h2>{`split the bill with ${friend[0].name}`}</h2>
      <label>💰Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label>🧍🏻Your expense</label>
      <input
        type="number"
        value={yourExpense}
        onChange={(e) => setYourExpense(+e.target.value)}
      />

      <label>{`🧑‍🤝‍🧑${friend[0].name} expense`}</label>
      <input
        type="number"
        value={bill - yourExpense ? bill - yourExpense : ""}
        disabled
      />

      <label>🤑Who is paying the bill ?</label>
      <select value={billPayer} onChange={(e) => setBillPayer(+e.target.value)}>
        <option value={0}>You</option>
        <option value={friend[0].id}>{`${friend[0].name}`}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
