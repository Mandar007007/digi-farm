import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as io from "socket.io-client";
import MyTimer from "./Timer";
import { useNavigate } from "react-router-dom";
import { Button, Input, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import axios from "axios";


// Set up the socket connection
const socket = io.connect("https://digi-farm-backend.vercel.app");

const AuctionRoom = () => {
  const [expirTime, setExpirTime] = useState<number | null>(null);
  const [bidderEmail, setBidderEmail] = useState<string>("teamm2d007@gmail.com");
  const [auction, setAuction] = useState({
    _id: "",
    userId: "",
    cropName: "",
    winner: "",
    expireTime: "",
    bidPrice: "",
    currentBidder: "",
  });
  const navigate = useNavigate();
  const [placeBidAmount, setPlaceBidAmount] = useState<number>(1);
  const [bids, setBids] = useState<{ bidAmount: number }[]>([]);
  const [chat, setChat] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [bidder, setBidder] = useState<string>("No Bidder");
  const auc = useSelector((state: any) => state.user.auction);
  const user = useSelector((state: any) => state.user.user);
  const [history, setHistory] = useState<string[]>([]);
  const [emailData, setEmailData] = useState({
    email: bidderEmail,
    subject: "Auction Winner Confirmation",
    winnerName: auction?.currentBidder ? auction.currentBidder : "",
    cropName: "Baajro",
    finalBidAmount: "500",
    auctionDate: "2022-02-15",
    ownerAccountDetails: "Owner's Bank Account Details",
  });
  const toast = useToast();

  const onExpire = async () => {
    setEmailData({ ...emailData, email: bidderEmail });
    console.log("onExpire", bidderEmail);

    try {
      setBids(bids);
      navigate("/");
      await axios.post("https://digi-farm-backend.vercel.app/api/v1/sendmail", emailData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Mail sent to user");
      navigate("/auction");
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async () => {
    try {
      if (message === "") {
        toast({
          title: 'Message Error',
          description: "Please enter a message",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        return;
      }
      socket.emit("message-passed", { auction_id: auc._id, message: message });
      setMessage("");
    } catch (e) {
      console.log("error" + e);
    }
  };

  useEffect(() => {
    setAuction(auc);
    const expireT = new Date(auc?.expireTime).getTime();
    setExpirTime(expireT);
    socket.emit("joinAuction", { auctionId: auc?._id, userId: user?._id });
    setBidder(auc?.bidder);
  }, [auc]);

  useEffect(() => {
    setBidder(localStorage.getItem("bidder") as string);
  },[])

  useEffect(() => {
    const handleUpdateAuction = (updatedAuction: any) => {
      setBidder(updatedAuction.bidder);
      localStorage.setItem('bidder', updatedAuction.bidder)
      setAuction({
        ...updatedAuction.updatedAuction,
        winner: "",
      });
      setBidderEmail(updatedAuction.bidderEmail);

      const currentTime = new Date().toLocaleTimeString();
      const message = `${currentTime} Bid from ${updatedAuction.bidder} of Amount ${updatedAuction.updatedAuction.bidPrice}`;
      setHistory((prevHistory) => [...prevHistory, message]);
    };

    const handleMessageToAll = (data: string) => {
      console.log(data)
      setChat((prevChat) => [...prevChat, data.message]);
    };

    socket.on("updateAuction", handleUpdateAuction);
    socket.on("message-to-all", handleMessageToAll);

    return () => {
      socket.off("updateAuction", handleUpdateAuction);
      socket.off("message-to-all", handleMessageToAll);
    };
  }, []);

  const placeBid = (amount: number) => {
    console.log(amount);
    socket.emit("placeBid", {
      auction: auction,
      bidAmount: amount,
      bidder: user.name,
      bidderEmail: user.email,
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1 className="text-3xl">Auction Room of {auction?.cropName}</h1>
      <div className="flex justify-center md:flex-row flex-col max-md:items-center ">
        <div className="glassy-effect p-4 shadow-md rounded-md m-2 w-[90%] md:w-[500px]">
          <p>Current Bidder: {bidder} </p>
          <p>Current Price: {auction?.bidPrice} </p>
          <div className="m-auto">
            <Input
              bg={"white"}
              w={48}
              color={"black"}
              type="number"
              onChange={(e) => setPlaceBidAmount(parseInt(e.target.value, 10))}
            ></Input>
            <Button className="m-4" onClick={() => placeBid(placeBidAmount)}>
              Place Bid
            </Button>
            <div className="grid grid-cols-4 space-x-2 justify-center mb-4">
              <Button
                onClick={() =>
                  placeBid(bids.length > 0 ? bids[bids.length - 1].bidAmount + 50 : 50)
                }
              >
                +50
              </Button>
              <Button
                onClick={() =>
                  placeBid(bids.length > 0 ? bids[bids.length - 1].bidAmount + 100 : 100)
                }
              >
                +100
              </Button>
              <Button
                onClick={() =>
                  placeBid(bids.length > 0 ? bids[bids.length - 1].bidAmount + 200 : 200)
                }
              >
                +200
              </Button>
              <Button
                onClick={() =>
                  placeBid(bids.length > 0 ? bids[bids.length - 1].bidAmount + 500 : 500)
                }
              >
                +500
              </Button>
            </div>
          </div>
          {expirTime && (
            <MyTimer expiryTimestamp={expirTime} onExpire={onExpire} />
          )}
        </div>

        <div className="glassy-effect h-[500px] w-[90%] md:w-[500px] m-2 p-2 shadow-md rounded-md">
          <Tabs variant="enclosed">
            <TabList>
              <Tab color={"white"}>History</Tab>
              <Tab color={"white"}>Live Chat</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <div>
                  <h1 className="text-xl font-semibold m-1 mb-3">
                    History of Auction
                  </h1>
                  <div className="overflow-y-auto h-[400px]">
                    {history.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p
                          key={index}
                          className="bg-gray-200 text-black my-2 p-1 w-2/3 mx-auto rounded-md text-sm shadow-md"
                        >
                          {message}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div>
                  <h1 className="text-xl font-semibold m-1 mb-3">Live Chat</h1>
                  <div className="overflow-y-scroll overflow-x-hidden h-[320px]">
                    {chat.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p
                          key={index}
                          className="bg-gray-200 text-black my-2 p-1 w-2/3 mx-auto rounded-md text-sm shadow-md"
                        >
                          {message}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2 m-1">
                  <Input
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    className="text-black"
                    value={message}
                    bg={"white"}
                  ></Input>
                  <Button onClick={sendMessage}>Send</Button>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;
