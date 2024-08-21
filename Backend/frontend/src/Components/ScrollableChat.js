import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../Config/ChatLogics.js";
import { ChatState } from "../Context/ChatProvider.js";

const ScrollableChat = React.memo(({ messages }) => {
    const { User } = ChatState();

    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => {
                const isLastFromSender = isLastMessage(messages, i, m.sender._id);

                return (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            flexDirection: m.sender._id === User.user._id ? 'row-reverse' : 'row',
                            alignItems: 'flex-end',
                            marginBottom: '10px'
                        }}
                    >
                        {/* Show avatar only for the last message from other users */}
                        {m.sender._id !== User.user._id && isLastFromSender && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr="1"
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === User.user._id ? "#BEE3F8" : "#B9F5D0"}`,
                                marginLeft: m.sender._id === User.user._id ? '10px' : '0',
                                marginRight: m.sender._id === User.user._id ? '0' : '10px',
                                marginTop: isSameUser(messages, m, i) ? '3px' : '10px',
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                display: 'inline-block'
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                );
            })}
        </ScrollableFeed>
    );
});

export default ScrollableChat;
