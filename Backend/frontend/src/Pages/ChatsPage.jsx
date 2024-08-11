import { Box, Flex } from "@chakra-ui/layout";
import { useState } from "react";
import ChatBox from "../Components/ChatBox";
import MyChats from "../Components/MyChats";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const { User } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <Box width="100%">
      {User && <SideDrawer />}
      <Flex justifyContent="space-between" p={"10px"}>
        {User && <MyChats fetchAgain={fetchAgain}/>}
        {User && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Flex>
    </Box>
  );
};

export default Chatpage;
