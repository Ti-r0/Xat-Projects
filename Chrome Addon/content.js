async function fetchChatDetails(chatName) {
  try {
    const response = await fetch(`https://xat.com/web_gear/chat/roomid.php?v2&d=${chatName}`);
    const details = await response.json();
    updateChatDetails(details);
  } catch (error) {
    console.error('Error fetching chat details:', error);
  }
}

function getCurrentChatName() {
  const urlParts = window.location.pathname.split('/');
  return urlParts.length > 1 ? urlParts[1] : 'xat';
}

function displayHelper() {
  let container = document.querySelector('.chat-info-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'chat-info-container';
    document.body.prepend(container);

    const header = document.createElement('div');
    header.className = 'header';

    const headerTitle = document.createElement('span');
    headerTitle.innerText = 'Helper';
    header.appendChild(headerTitle);

    const closeButton = createButton('Close', '0', 'close-btn');
    closeButton.addEventListener('click', () => {
      container.style.display = 'none';
      createOpenButton();
    });
    header.appendChild(closeButton);

    container.appendChild(header);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const moreToolsButton = createButton('More Tools', '10px', 'main-btn');
    moreToolsButton.addEventListener('click', () => {
      toggleVisibility(toolsDiv);
      closeOtherDivs(toolsDiv);
    });

    const chatInfoButton = createButton('Chat Info', '10px', 'main-btn');
    chatInfoButton.addEventListener('click', () => {
      fetchChatDetails(getCurrentChatName());
      toggleVisibility(chatDetailsDiv);
    });

    const chatsButton = createButton('Chats', '10px', 'main-btn');
    chatsButton.addEventListener('click', () => {
      toggleVisibility(chatsDiv);
      closeOtherDivs(chatsDiv);
    });

    const toolsDiv = document.createElement('div');
    toolsDiv.className = 'tools-div';
    toolsDiv.style.display = 'none'; // Hide initially

    const announceButton = createButton('Announce', '10px', 'tool-btn');
    toolsDiv.appendChild(announceButton);

    const auser3Button = createButton('Auser3', '10px', 'tool-btn');
    auser3Button.addEventListener('click', async () => {
      try {
        const response = await fetch('https://xat.com/web_gear/chat/auser3.php');
        const text = await response.text();
        const params = new URLSearchParams(text);
        const userId = params.get('UserId');
        const k1 = params.get('k1');
        const k2 = params.get('k2');
        const url = `https://xat.com/login?&mode=1&UserId=${userId}&k1=${k1}&k2=${k2}`;
        window.open(url, '_blank');
      } catch (error) {
        console.error('Error fetching auser3 data:', error);
      }
    });

    const promotedChatsButton = createButton('Promoted Chats', '10px', 'tool-btn');
    promotedChatsButton.addEventListener('click', async () => {
      try {
        const promotedChatsDiv = document.querySelector('.promoted-chats');
        if (promotedChatsDiv) {
          promotedChatsDiv.remove();
        } else {
          const response = await fetch('https://api.xatblog.net/promoted');
          const data = await response.json();
          displayPromotedChatsData(container, data);
        }
      } catch (error) {
        console.error('Error fetching promoted chats:', error);
      }
    });

    const shortnameButton = createButton('Shortname Price', '10px', 'tool-btn');
    shortnameButton.addEventListener('click', () => {
      toggleVisibility(shortnameDiv);
    });

    const idToUsernameButton = createButton('ID to Username', '10px', 'tool-btn');
    idToUsernameButton.addEventListener('click', () => {
      toggleVisibility(idToUsernameDiv);
    });

    const usernameToIdButton = createButton('Username to ID', '10px', 'tool-btn');
    usernameToIdButton.addEventListener('click', () => {
      toggleVisibility(usernameToIdDiv);
    });

    const powersButton = createButton('Powers', '10px', 'tool-btn');
    powersButton.addEventListener('click', () => {
      toggleVisibility(powersDiv);
    });

    const historyButton = createButton('History', '10px', 'tool-btn');
    historyButton.addEventListener('click', () => {
      toggleHistoryDisplay(container);
    });

    buttonsContainer.appendChild(moreToolsButton);
    buttonsContainer.appendChild(chatInfoButton);
    buttonsContainer.appendChild(chatsButton);
    container.appendChild(buttonsContainer);
    container.appendChild(toolsDiv);

    toolsDiv.appendChild(auser3Button);
    toolsDiv.appendChild(promotedChatsButton);
    toolsDiv.appendChild(shortnameButton);
    toolsDiv.appendChild(idToUsernameButton);
    toolsDiv.appendChild(usernameToIdButton);
    toolsDiv.appendChild(powersButton);
    toolsDiv.appendChild(historyButton);

    const chatsDiv = document.createElement('div');
    chatsDiv.className = 'chats-div';
    container.appendChild(chatsDiv);

    const helpButton = createButton('Help', '10px', 'tool-btn');
    helpButton.addEventListener('click', () => window.open('https://xat.com/help', '_blank'));

    const tradeButton = createButton('Trade', '10px', 'tool-btn');
    tradeButton.addEventListener('click', () => window.open('https://xat.com/trade', '_blank'));

    chatsDiv.appendChild(helpButton);
    chatsDiv.appendChild(tradeButton);

    const chatDetailsDiv = document.createElement('div');
    chatDetailsDiv.className = 'chat-details';
    chatDetailsDiv.style.display = 'none'; // Hide initially
    container.appendChild(chatDetailsDiv);

    const shortnameDiv = createSearchForm('Shortname Price', 'shortnameInput', 'shortnameSearchButton', searchShortnamePrice);
    const idToUsernameDiv = createSearchForm('ID to Username', 'idToUsernameInput', 'idToUsernameSearchButton', searchIdToUsername);
    const usernameToIdDiv = createSearchForm('Username to ID', 'usernameToIdInput', 'usernameToIdSearchButton', searchUsernameToId);
    const powersDiv = createSearchForm('Power Info', 'powersInput', 'powersSearchButton', searchPowerInfo);
    container.appendChild(shortnameDiv);
    container.appendChild(idToUsernameDiv);
    container.appendChild(usernameToIdDiv);
    container.appendChild(powersDiv);

    // Add credits
    const credits = document.createElement('div');
    credits.innerHTML = 'Credits: Tiro/Rexor';
    credits.className = 'credits';
    container.appendChild(credits);

    function createOpenButton() {
      const openButton = createButton('Open Helper', '0', 'open-btn');
      openButton.addEventListener('click', () => {
        container.style.display = 'block';
        openButton.remove();
      });
      document.body.appendChild(openButton);
    }

    // Fetch initial chat details
    fetchChatDetails(getCurrentChatName());

    // Fetch announce data initially to determine if the button should be shown
    fetchAnnounceData().then(data => {
      if (data.BlackFriday && (data.BlackFriday.XatsBackBuy.ends > 0 || data.BlackFriday.XatsBackSpend.ends > 0)) {
        announceButton.style.display = 'block';
        announceButton.addEventListener('click', () => {
          displayAnnounceData(container, data);
        });
      } else {
        announceButton.style.display = 'none';
      }
    });
  }
}

async function fetchAnnounceData() {
  try {
    const response = await fetch(`https://xat.com/web_gear/chat/Announce.php`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching announce data:', error);
    return {};
  }
}

function updateChatDetails(details) {
  const container = document.querySelector('.chat-info-container');
  if (!container) return;

  // Clear existing content
  const existingContent = container.querySelector('.chat-details');
  if (existingContent) {
    existingContent.innerHTML = ''; // Clear the content instead of removing the element
  }

  // Update content
  existingContent.innerHTML = `
    <h4>Chat Info</h4>
    <p><strong>ID:</strong> ${details.id}</p>
    <p><strong>Name:</strong> ${details.g}</p>
    <p><strong>Description:</strong> ${details.d}</p>
    <p><strong>Radio IP:</strong> ${details.a.split('=')[4]}</p>
    <p><strong>Hex Color:</strong> ${details.a.split('=')[5]}</p>
  `;
}

function createButton(text, marginRight, className) {
  const button = document.createElement('button');
  button.innerText = text;
  button.style.marginRight = marginRight;
  button.className = className;
  return button;
}

function toggleVisibility(element) {
  element.style.display = element.style.display === 'none' ? 'block' : 'none';
}

function closeOtherDivs(exception) {
  const divs = document.querySelectorAll('.tools-div, .chats-div, .chat-details, .tool-form');
  divs.forEach(div => {
    if (div !== exception) {
      div.style.display = 'none';
    }
  });
}

function createSearchForm(title, inputId, buttonId, searchFunction) {
  const formDiv = document.createElement('div');
  formDiv.className = 'tool-form';
  formDiv.id = `${inputId}Form`;
  formDiv.innerHTML = `
    <h4>${title}</h4>
    <input type="text" id="${inputId}" placeholder="Enter ${title.toLowerCase()}" />
    <button id="${buttonId}" class="search-btn">Search</button>
    <div id="${inputId}Result"></div>
  `;

  document.body.appendChild(formDiv);
  document.getElementById(buttonId).addEventListener('click', searchFunction);

  return formDiv;
}

async function searchShortnamePrice() {
  const shortname = document.getElementById('shortnameInput').value;
  if (shortname) {
    try {
      const response = await fetch(`https://api.xatblog.net/nameprice/${shortname}`);
      const data = await response.json();
      if (data.code === 403) {
        displayResult('shortnameInputResult', shortname, `Sorry, ${data.message}`);
      } else {
        displayResult('shortnameInputResult', shortname, data.price);
        saveShortnameHistory(shortname, data.price);
      }
    } catch (error) {
      console.error('Error fetching shortname price:', error);
    }
  }
}

async function searchIdToUsername() {
  const id = document.getElementById('idToUsernameInput').value;
  if (id) {
    try {
      const response = await fetch(`https://api.xatblog.net/id2reg/${id}`);
      const data = await response.json();
      displayResult('idToUsernameInputResult', id, data.username);
    } catch (error) {
      console.error('Error fetching ID to username:', error);
    }
  }
}

async function searchUsernameToId() {
  const username = document.getElementById('usernameToIdInput').value;
  if (username) {
    try {
      const response = await fetch(`https://api.xatblog.net/reg2id/${username}`);
      const data = await response.json();
      displayResult('usernameToIdInputResult', username, data.xatid);
    } catch (error) {
      console.error('Error fetching username to ID:', error);
    }
  }
}

async function searchPowerInfo() {
  const power = document.getElementById('powersInput').value;
  if (power) {
    try {
      const response = await fetch(`https://api.xatblog.net/powersearch/${power}`);
      const data = await response.json();
      if (data.code === 200) {
        const powerDetails = data.power;
        const resultHTML = `
          <h4>Power Info: ${powerDetails.name}</h4>
          <p><strong>ID:</strong> ${powerDetails.id}</p>
          <p><strong>Description:</strong> ${powerDetails.description.long}</p>
          <p><strong>Prices:</strong> ${powerDetails.prices.fairtrade_min} - ${powerDetails.prices.fairtrade_max} xats (Store: ${powerDetails.prices.store} xats)</p>
          <p><strong>Status:</strong> ${powerDetails.status}</p>
          <p><strong>Released:</strong> ${powerDetails.released}</p>
          <p><strong>Smilies:</strong> ${powerDetails.smilies.join(', ')}</p>
          <p><strong>Categories:</strong> ${powerDetails.categories.join(', ')}</p>
        `;
        displayResult('powersInputResult', power, resultHTML);
      } else {
        displayResult('powersInputResult', power, `Sorry, ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching power info:', error);
    }
  }
}

function displayResult(resultId, input, result) {
  const resultDiv = document.querySelector(`#${resultId}`);
  resultDiv.innerHTML = `<p><strong>${input}:</strong> ${result}</p>`;
}

function displayAnnounceData(container, data) {
  const announceDiv = document.createElement('div');
  announceDiv.className = 'announce-div';
  announceDiv.innerHTML = `<h4>Announce Data</h4><pre>${formatAnnounceData(data)}</pre>`;
  container.appendChild(announceDiv);
  setTimeout(() => {
    announceDiv.remove();
  }, 5000);
}

function formatAnnounceData(data) {
  const formatted = {
    BlackFriday: {
      Promotion: data.BlackFriday.Promotion,
      ShortName: data.BlackFriday.ShortName,
      XatsBackBuy: {
        enabled: data.BlackFriday.XatsBackBuy.enabled,
        ends: data.BlackFriday.XatsBackBuy.ends > 0 ? new Date(data.BlackFriday.XatsBackBuy.ends * 1000).toLocaleString() : "Not Available right now"
      },
      XatsBackSpend: {
        enabled: data.BlackFriday.XatsBackSpend.enabled,
        ends: data.BlackFriday.XatsBackSpend.ends > 0 ? new Date(data.BlackFriday.XatsBackSpend.ends * 1000).toLocaleString() : "Not Available right now"
      }
    },
    Announce: data.Announce
  };
  return JSON.stringify(formatted, null, 2);
}

function displayPromotedChatsData(container, data) {
  const promotedChatsDiv = document.querySelector('.promoted-chats');
  if (promotedChatsDiv) {
    promotedChatsDiv.remove();
  }

  const newPromotedChatsDiv = document.createElement('div');
  newPromotedChatsDiv.className = 'promoted-chats';
  newPromotedChatsDiv.innerHTML = `<h4>Promoted Chats (${getCurrentChatName()})</h4>`;
  data.chats.forEach(chat => {
    newPromotedChatsDiv.innerHTML += `
      <p>
        <strong>${chat.name}</strong>: ${chat.description} 
        (<a href="https://xat.com/${chat.name}" target="_blank">Join</a>)
      </p>
    `;
  });

  container.appendChild(newPromotedChatsDiv);
  newPromotedChatsDiv.addEventListener('click', () => {
    newPromotedChatsDiv.style.display = 'none';
  });
}

function saveShortnameHistory(shortname, price) {
  const history = JSON.parse(localStorage.getItem('shortnameHistory') || '[]');
  const timestamp = new Date().toLocaleString();
  history.push({ shortname, price, timestamp });
  localStorage.setItem('shortnameHistory', JSON.stringify(history));
}

function toggleHistoryDisplay(container) {
  const historyDiv = document.getElementById('historyDiv');
  if (historyDiv) {
    historyDiv.remove();
  } else {
    const newHistoryDiv = document.createElement('div');
    newHistoryDiv.id = 'historyDiv';
    const history = JSON.parse(localStorage.getItem('shortnameHistory') || '[]').reverse(); // Reverse the order
    newHistoryDiv.innerHTML = '<h4>Shortname History</h4>';
    history.forEach(item => {
      newHistoryDiv.innerHTML += `<p><strong>${item.shortname}:</strong> ${item.price} (Checked on: ${item.timestamp})</p>`;
    });
    container.appendChild(newHistoryDiv);
  }
}


// Styles
const style = document.createElement('style');
style.innerHTML = `
  .chat-info-container {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    position: relative;
    max-width: 600px;
    margin: 0 auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #007bff;
    color: white;
    padding: 10px;
    border-radius: 5px 5px 0 0;
    font-weight: bold;
  }
  .close-btn {
    background-color: red;
  }
  .buttons-container {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .tools-div, .chats-div, .tool-form {
    display: none;
    margin-top: 10px;
  }
  .language-buttons {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
  }
  .tool-btn {
    margin-right: 10px;
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .main-btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
  }
  .open-btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    position: fixed;
    bottom: 10px;
    right: 10px;
  }
  .credits {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 10px;
  }
  .tool-form {
    margin-top: 10px;
  }
  .search-btn {
    margin-left: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .promoted-chats {
    margin-top: 10px;
  }
  .announce-div {
    margin-top: 10px;
  }
`;
document.head.appendChild(style);

// Initialize the helper
displayHelper();
