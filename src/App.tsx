import React, { useState } from "react";
import "./App.css";
import { utilityEmailValidation, utilitySetItem } from "./utilities";
import { Users } from "./interfaces/users";
import { Chat } from "./interfaces/chat";
import styled, { css } from "styled-components";

const ChatDiv = styled.div`
  width: 700px;
  margin: auto;
`;

const Div = styled.div<{ $myMessage?: boolean }>`
  background-color: rgb(75, 73, 73);
  color: white;
  border-radius: 20px;
  border: 2px solid;
  width: 500px;
  float: left;
  margin: 10px auto 10px auto;

  ${(props) =>
    props.$myMessage &&
    css`
      background-color: #4caf50;
      float: right;
    `}
`;

const Author = styled.h4`
  text-align: left;
  margin-left: 15px;
`;

const PubDate = styled.h5`
  text-align: right;
  margin-right: 15px;
`;

const Content = styled.p`
  font-size: 18px;
  width: 90%;
  margin: auto;
  text-align: left;
`;

const Delete = styled.button`
font-size: 16px;
border: 1px solid red;
color: red;
background: transparent;
cursor: pointer;
float: right;
margin-right: 15px;
margin-bottom: 10px;
opacity: 0.8;
`

function App() {
  const cachedEmail = localStorage.getItem("email");
  const cachedUsersString = localStorage.getItem("users");
  const cachedUsers: Users = !!cachedUsersString
    ? JSON.parse(cachedUsersString)
    : {};
  const cachedChatString = localStorage.getItem("chat");
  const cachedChat: Chat[] = !!cachedChatString
    ? JSON.parse(cachedChatString)
    : [];

  const [isLogged, setIsLogged] = useState(!!cachedEmail);
  const [inputEmail, setInputEmail] = useState(
    !!cachedEmail ? JSON.parse(cachedEmail) : ""
  );
  const [users, setUsers] = useState<Users>(cachedUsers);
  const [isEmailValid, setEmailValid] = useState(false);
  const [chat, setChat] = useState(cachedChat);
  const [message, setMessage] = useState("");

  function onClickLogin() {
    setIsLogged(true);
    utilitySetItem(inputEmail);
    if (!!users[inputEmail]) {
      const newUsers = {
        ...users,
        [inputEmail]: {
          counter: users[inputEmail].counter + 1,
          previousAccess: users[inputEmail].lastAccess,
          lastAccess: new Date().toLocaleString(),
        },
      };
      setUsers(newUsers);
      utilitySetItem(newUsers, "users");
    } else {
      const newUsers = {
        ...users,
        [inputEmail]: {
          ...users[inputEmail],
          lastAccess: new Date().toLocaleDateString(),
          previousAccess: null,
          counter: 1,
        },
      };
      setUsers(newUsers);
      utilitySetItem(newUsers, "users");
    }
  }

  function onClickLogout() {
    setIsLogged(false);
    setEmailValid(false);
    localStorage.removeItem("email");
    setInputEmail("");
  }

  function onChangeEmail(event: any) {
    if (utilityEmailValidation(event.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
    setInputEmail(event.target.value);
  }

  function onChangeMessage(event: any) {
    setMessage(event.target.value);
  }

  function sendMessage() {
    const newChat = [
      ...chat,
      {
        author: inputEmail,
        date: new Date().toLocaleString(),
        content: message,
      },
    ];
    setChat(newChat);
    utilitySetItem(newChat, "chat");
    setMessage("");
  }

  function deleteMsg(index: number) {
    const newChat: Chat[] = [...chat];
    newChat.splice(index, 1);
    setChat(newChat);
    utilitySetItem(newChat, "chat");
  }

  function printMessage(msg: Chat, index:number) {
    if (msg.author == inputEmail) {
      return (
        <Div key={index} $myMessage>
          <Author>{msg.author} (TU)</Author>
          <Content>{msg.content}</Content>
          <PubDate>{msg.date}</PubDate>
          <Delete onClick={() => deleteMsg(index)}>Elimina</Delete>
        </Div>
      );
    }
    return (
      <Div key={index}>
        <Author>{msg.author}</Author>
        <Content>{msg.content}</Content>
        <PubDate>{msg.date}</PubDate>
      </Div>
    );
  }

  function ChatComp() {
    return (
      <>
        <ChatDiv>{chat.map(printMessage)}</ChatDiv>
      </>
    );
  }

  if (isLogged) {
    return (
      <>
        {!!users[inputEmail] && users[inputEmail].counter > 1 ? (
          <header>
            <h2 id="accesses">{users[inputEmail].counter}</h2>
            <h3 id="previousAccess">
              Ultimo accesso rilevato: {users[inputEmail].previousAccess}
            </h3>
            <button onClick={onClickLogout} id="logout">
              Logout
            </button>
          </header>
        ) : (
          <header>
            <button onClick={onClickLogout} id="logout">
              Logout
            </button>
          </header>
        )}
        <ChatComp />
        <form id="sendMessageForm">
          <input
            placeholder="Nuovo messaggio"
            value={message}
            onChange={onChangeMessage}
          />
          <button onClick={sendMessage} disabled={!message} id="send">
            Invia
          </button>
        </form>
      </>
    );
  }
  return (
    <>
      <header></header>
      <div id="container">
        <form>
          <input
            placeholder="Inserisci email"
            value={inputEmail}
            onChange={onChangeEmail}
          />
          <button onClick={onClickLogin} disabled={!isEmailValid} id="login">
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
