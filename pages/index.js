import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Files from "@/components/Files";
import logo from "../public/logo.png"
import landHouse from "../public/landsHouse.jpg"
import { ethers } from "ethers"
import LandAbi from './contractsData/Land.json'
import LandAddress from './contractsData/Land-address.json'
import LandProcessAbi from './contractsData/LandProcess.json'
import LandProcessAddress from './contractsData/LandProcess-address.json'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

export default function Home() {
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [title, setTitle] = useState("Luwinga plot 1");
  const [description, setDescription] = useState("10 by 10");
  const [landCid, setLandCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imgPath, setImgPath] = useState(landHouse)
  const [accounts, setAccount] = useState("0x")
  const [loading, setLoading] = useState("")
  const [landProcess, setLandProcess] = useState("")
  const [land, setLand] = useState("")
  const [totalSupply, setTotalSupply] = useState("0");
  const [latestUri, setLatestUri] = useState("")
  const [landTotalCounter, setLandTotalCounter] = useState(0)

  const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
  ? process.env.NEXT_PUBLIC_GATEWAY_URL
  : "https://gateway.pinata.cloud";

  var last, id, acc, first;
  useEffect(() => {
    web3Handler()
    getLatestUri()

  }, []);


  id = accounts;
  first = id.slice(0, 5);
  last = id.slice(-5,-1);
  acc = `${first} . . . ${last}`;
  

  const inputFile = useRef(null);

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
   loadContracts(signer)
}
 const loadContracts = async (signer) => {
    // Get deployed copies of contracts
   const landProcess = new ethers.Contract(LandProcessAddress.address, LandProcessAbi.abi, signer)
    setLandProcess(landProcess)
    const land = new ethers.Contract(LandAddress.address, LandAbi.abi, signer)
    setLand(land)
    setLoading(false)
  }
  const uploadFile = async (fileToUpload) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", fileToUpload, { filename: fileToUpload.name });
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const ipfsHash = await res.text();
      setCid(ipfsHash);
     
      setUploading(false);
      const url = `https://${ipfsHash}`
    setImgPath(url)
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };
 
  const handleChange = (e) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  const registerLand = async () =>{
    loadRecent()
  

     const uri = `https://${GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_TOKEN}`;
    
       // mint nft 
       try {
        await land.mint(uri.toString()).wait()
        // get tokenId of new nft 
        const id = await land.totalSupply()
   
    // approve marketplace to spend nft
     await land.setApprovalForAll(landProcess.target, true).wait()
    // // add nft to marketplace
     const listingPrice = ethers.formatUnits("1")
     await(await landProcess.makeItem(land.target, id, toWei(listingPrice))).wait()
         setLandTotalCounter(id.toString())
      } catch (e) {
        console.log(e.toString());
      }
       getLatestUri 
  }
  const getLatestUri = async () =>{

    try {
      const id = await land.totalSupply()
      const uri = await land.tokenURI(id)
    setLatestUri(uri);
    } catch (e) {
      console.log(e.toString())
    }
    
  }
  const getTotalSupply = async ()=>{
    const total = await land.totalSupply();
    setTotalSupply(total.toString());
  }

  const setDetails = async()=>{
    
  }
  
  const loadRecent = async () => {
    try {
      const res = await fetch("/api/files");
      const json = await res.json();
      setCid(json.ipfs_pin_hash);
      
      
    } catch (e) {
      console.log(e);
      alert("trouble loading files");
    }
    await getTotalSupply()
  };
 
  return (
    <>
      <Head>
        <title>Land Admin Panel</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={logo} />
      </Head>
      <main>
        <div className="hero-background">
          <div className="container">
          
            <div className="logo">
         
              <Image src={logo} alt="Lands logo" height={90} width={215} />
              <button onClick={loadRecent} className="btn btn-light">
                    {
                     acc
                    }
                  </button>
            </div>
            <div className="hero">
              <div className="copy">
                <h1>Land Registry</h1>
                
                 Welcome To Land Registry in Mzuzu City {totalSupply}


                
<div>

   
     
      
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="description">
              <FormLabel>description</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl id="coordinates">
              <FormLabel>coordinates</FormLabel>
              <Input type="text" />
            </FormControl>
            <Stack spacing={10}>
            
              <button
               onClick={setDetails}
                >
                Set
              </button>
            </Stack>
          </Stack>
        </Box>
      
   
  



                </div>
               
                <input
                  type="file"
                  id="file"
                  ref={inputFile}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <div className="flex-btns">
                  <button onClick={loadRecent} className="btn btn-light">
                    Load recent
                  </button>
                  <button
                    disabled={uploading}
                    onClick={() => inputFile.current.click()}
                    className="btn"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>

                  <button onClick={registerLand} className="btn btn-light">
                    Register Land
                  </button>
                </div>
                {cid && (
                  <div className="file-list">
                    <Files cid={cid} />
                  </div>
                )}
              </div>
              <div className="hero-img">
              
                <Image height={400} width={400} src={imgPath} alt="hero image of computer and code" />
              
              </div>
             
           
            </div>
          </div>
        </div>
       
        

      </main>
    </>
  );
}
