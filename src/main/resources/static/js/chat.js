// 로그인 시스템으로 대체해야 함
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;

// SSE 연결 
const eventSource = new EventSource(
  `http://localhost:8080/chat/roomNum/${roomNum}`
);
eventSource.onmessage = (event) => {
  
  const data = JSON.parse(event.data);
  if (data.sender === username) { // 로그인한 사용자가 보내는 메시지
    // 파란박스 (오른쪽)
    initMyMessage(data);
  } else {
    // 회색박스 (왼쪽)
    initYourMessage(data);
  }
  
};


// 파란박스 만들기
function getSendMsgBox(data) {

  let md = data.createAt.substring(5, 10);
  let tm = data.createAt.substring(11, 16);
  let convertTime = tm + " | " + md;

  return `<div class="sent_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
    </div>`;
}

// 회색박스 만들기
function getReceiveMsgBox(data) {

  let md = data.createAt.substring(5, 10);
  let tm = data.createAt.substring(11, 16);
  let convertTime = tm + " | " + md;

  return `<div class="received_withd_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
    </div>`;
}


// 파란박스 초기화
function initMyMessage(data) {
  let chatBox = document.querySelector("#chat-box");
  let sendBox = document.createElement("div");
  sendBox.className = "outgoing_msg";
  sendBox.innerHTML = getSendMsgBox(data);
  chatBox.append(sendBox);

  document.documentElement.scrollTop = document.body.scrollHeight;
  
}

// 회색박스 초기화
function initYourMessage(data) {
  let chatBox = document.querySelector("#chat-box"); 
  let receivedBox = document.createElement("div");
  receivedBox.className = "received_msg";
  receivedBox.innerHTML = getReceiveMsgBox(data);
  chatBox.append(receivedBox);

  document.documentElement.scrollTop = document.body.scrollHeight;
}



// ajax로 채팅 메시지 전송
async function addMessage() {
  
  let msgInput = document.querySelector("#chat-outgoing-msg");
  

  let chat = {
    sender: username,
    roomNum: roomNum,
    msg: msgInput.value,
  };

  fetch("http://localhost:8080/chat", {
    method: "post", // http post method
    body: JSON.stringify(chat), // JS -> JSON
    headers: {
      "Content-Type": "Application/json; chatset=utf-8",
    },
  });

  msgInput.value = "";
}


// 버튼 누를 시
document
  .querySelector("#chat-outgoing-button")
  .addEventListener("click", () => {
    addMessage();
  });

// 엔터 누를 시 
document
  .querySelector("#chat-outgoing-msg")
  .addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      addMessage();
    }
  });
