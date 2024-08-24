// import WebSocket from "ws";

var init = (host, port) => {
  console.log({ host, port });
  const socket = new WebSocket(`ws://${host}:${port}`);

  // Initial array of items
  let items = [""];

  // Function to render the list
  function renderList() {
    const ul = document.getElementById("container");
    if (!ul) return;
    ul.innerHTML = ""; // Clear existing list
    items.forEach((item) => {
      const pre = document.createElement("pre");
      pre.textContent = item;
      ul.appendChild(pre);
    });
    window.scrollTo(0, document.body.scrollHeight);
  }

  // Function to add a new item
  function addItem(newItem) {
    items.push(newItem);
    renderList();
  }

  // Function to remove an item
  function removeItem(index) {
    items.splice(index, 1);
    renderList();
  }

  // Initial render
  renderList();
  // Listen for messages
  socket.addEventListener("message", function (event) {
    try {
      // addItem(JSON.parse(event.data).message);
      const newItems = JSON.parse(event.data).messages;
      items = [...newItems];
      renderList();
    } catch (err) {
      console.error(err);
      return;
    }
  });
};
