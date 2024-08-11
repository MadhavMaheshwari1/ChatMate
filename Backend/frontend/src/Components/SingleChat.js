import { Box, Text, Flex, IconButton, Spinner, useToast, FormControl, Input } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FaEye } from "react-icons/fa6";
import { ChatState } from "../Context/ChatProvider";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client"
import Lottie from "react-lottie";
import animationData from "../Animations/typing.json";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat, setSelectedChat, User, notification, setNotification } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const toast = useToast();
    const [istyping, setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${User.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", User.user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.off("setup");
            socket.disconnect();
        };
    }, [User.user]);

    const fetchMessages = async () => {
        if (selectedChat.length === 0) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${User.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        return () => {
            socket.emit("leave chat", selectedChat._id);
        };
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });

        return () => {
            socket.off("message recieved");
        };
    }, [notification, fetchAgain, messages]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    return (
        <>
            {selectedChat.length === 0 ? (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize={"3xl"} pb={3} color={"black"}>
                        Click on a user to start chatting
                    </Text>
                </Box>
            ) : (
                <Box
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat([])}
                    />
                    {selectedChat.isGroupChat === "false" ? (
                        <>
                            <Flex h="85vh" flexDir={"column"} w="100%" gap={"10px"}>
                                <Flex w="100%" justifyContent="space-between">
                                    <div>{getSender(User, selectedChat.users)}</div>
                                    <ProfileModal User={getSenderFull(User, selectedChat.users)}>
                                        <FaEye style={{ cursor: 'pointer' }} />{" "}
                                    </ProfileModal>
                                </Flex>
                                <Box
                                    display="flex"
                                    p={3}
                                    bg="#E8E8E8"
                                    w="100%"
                                    h="100%"
                                    borderRadius="lg"
                                    overflowY="hidden"
                                >
                                    {loading ? (
                                        <Spinner
                                            size="xl"
                                            w={20}
                                            h={20}
                                            alignSelf="center"
                                            margin="auto"
                                        />
                                    ) : (
                                        <div className="messages" style={{ width: "100%" }}>
                                            <ScrollableChat messages={messages} />
                                        </div>
                                    )}
                                </Box>
                                <FormControl id="message" isRequired mt={2} onKeyDown={sendMessage}>
                                    {istyping ? (
                                        <div>
                                            <Lottie
                                                options={defaultOptions}
                                                height={50}
                                                width={70}
                                                style={{ marginBottom: 15, marginLeft: 0,padding:10 }}
                                            />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    <Input
                                        variant="filled"
                                        bg="#E0E0E0"
                                        placeholder="Enter a message.."
                                        value={newMessage}
                                        onChange={typingHandler}
                                        height="60px"
                                        fontSize="lg"
                                        padding="16px"
                                        width="100%"
                                    />
                                </FormControl>
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Flex h="85vh" flexDir={"column"} w="100%" gap={"10px"}>
                                <Flex w="100%" justifyContent="space-between">
                                    <div>{selectedChat.chatName.toUpperCase()}</div>
                                    <div>
                                        <UpdateGroupChatModal
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                            fetchMessages={fetchMessages}
                                        />
                                    </div>
                                </Flex>
                                <Box
                                    display="flex"
                                    p={3}
                                    bg="#E8E8E8"
                                    w="100%"
                                    h="100%"
                                    borderRadius="lg"
                                    overflowY="hidden"
                                >
                                    {loading ? (
                                        <Spinner
                                            size="xl"
                                            w={20}
                                            h={20}
                                            alignSelf="center"
                                            margin="auto"
                                        />
                                    ) : (
                                        <div className="messages" style={{ width: "100%" }}>
                                            <ScrollableChat messages={messages} />
                                        </div>
                                    )}
                                </Box>
                                <FormControl id="message" isRequired mt={2} onKeyDown={sendMessage}>
                                    <Input
                                        variant="filled"
                                        bg="#E0E0E0"
                                        placeholder="Enter a message.."
                                        value={newMessage}
                                        onChange={typingHandler}
                                        height="60px"
                                        fontSize="lg"
                                        padding="16px"
                                        width="100%"
                                    />
                                </FormControl>
                            </Flex>
                        </>
                    )}
                </Box>
            )}
        </>
    );
};

export default SingleChat;
