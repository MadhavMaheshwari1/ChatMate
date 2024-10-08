import { Box } from "@chakra-ui/layout";
import "../styles.css";
import SingleChat from "./SingleChat";
import React from "react";
import { ChatState } from "../Context/ChatProvider";

const ChatBox = React.memo(({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat.length !== 0 ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      h={"90vh"}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
});

export default ChatBox;