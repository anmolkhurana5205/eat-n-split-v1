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
    setIsAddFriendPanelOpen(false);
  }

  function handleSeletingFriend(id) {
    setSelectedFriend((selectedFriend) => (selectedFriend === id ? null : id));
    setIsAddFriendPanelOpen(false);
  }

  function handleSplitBill(value) {
    setFriendsList((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
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
          setBillPayer={setBillPayer}
          billPayer={billPayer}
          handleSplitBill={handleSplitBill}
          setSelectedFriend={setSelectedFriend}
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
    <li className={selectedFriend === friend.id ? `selected` : ``}>
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
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleOnSubmit(e) {
    e.preventDefault();
    // console.log(e);

    if (!name || !image) {
      alert("Please enter name and image URL!!!");
      return;
    }

    const id = crypto.randomUUID();

    const newItem = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    handleAddingFriend(newItem);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleOnSubmit(e)}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

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
  setSelectedFriend,
}) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");

  const friend = friendsList.filter((curr) => selectedFriend === curr.id);

  function handleOnSubmit(e) {
    e.preventDefault();
    // console.log(e);

    if (!bill || yourExpense === "") {
      alert(
        "Ohh! Seems like you didn't enter amounts properly. (please enter it and try again)"
      );
      return;
    }

    handleSplitBill(
      billPayer === selectedFriend ? -yourExpense : bill - yourExpense
    );

    // setBill("");
    // setYourExpense("");
    // setBillPayer(0);
    // power of state
    setSelectedFriend(null);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleOnSubmit(e)}>
      <h2>split the bill with {friend[0].name}</h2>
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
        onChange={(e) =>
          setYourExpense((yourExpense) =>
            +e.target.value > bill ? yourExpense : e.target.value
          )
        }
      />

      <label>🧑‍🤝‍🧑{friend[0].name} expense</label>
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
