import Head from 'next/head'
import React from 'react'
import styles from '../styles/Home.module.css'
import { useAccount, useConnect, useDisconnect, useContract, useSigner } from 'wagmi'
// import { calculatorAbi } from '../src/abi'
import { useToast, Button, Text, Flex, Box, Heading, Spinner } from '@chakra-ui/react'
import { abi, address as contractAddress } from '../src/constants'
import { NFTGrid } from '../src/components'
import { SquareNFT } from '../src/types'
import NftView from '../src/components/NftView'
import { formatString } from '../src/utils'
import { ethers } from 'ethers'


const GRID_HEIGHT = 25;
const GRID_WIDTH = 40;
const MAX_SUPPLY = 1000;

export default function Home() {

  // Wagmi
  // const { address, isConnected } = useAccount()
  const { address, isConnected } = useAccount()
  const { data: signer } = useSigner()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Contract metadata
  const contract = useContract({ address: contractAddress, abi, signerOrProvider: signer })
  // const contract = useContract({ address: contractAddress, abi, signerOrProvider: provider })
  const [contractName, setContractName] = React.useState<string>()
  const [contractSymbol, setContractSymbol] = React.useState<string>()
  const [cells, setCells] = React.useState<SquareNFT[][]>([[]])

  // ui
  const [selectedCell, setSelectedCell] = React.useState<SquareNFT>()
  const [nftsLoading, setNftsLoading] = React.useState(false)
  const [contractDetailsLoading, setContractDetailsLoading] = React.useState(false)
  const loading = React.useMemo(() => {
    return nftsLoading || contractDetailsLoading
  }, [nftsLoading, contractDetailsLoading])
  const toast = useToast()

  const handleRetrieveNfts = React.useCallback(async () => {

    if (!signer || !contract) return
    if (cells.length === GRID_HEIGHT) return
    setNftsLoading(true)
    const emptyArray = Array(MAX_SUPPLY).fill('')
    const nftsPromises = emptyArray.map(async (_, tokenId) => {
      const owner: string = await contract.ownerOf(tokenId)
      const [title, image] = await contract.getTokenInfo(tokenId)

      return {
        tokenId,
        owner,
        title,
        image
      } as SquareNFT
    })

    const newCells = await Promise.allSettled(nftsPromises)
    const newCells2 = newCells.map((nft, tokenId) => {
      if (nft.status === 'fulfilled') {
        return nft.value;
      }
      return {
        tokenId
      } as SquareNFT
    })
    const newCellsReshaped: SquareNFT[][] = []
    while (newCells2.length) newCellsReshaped.push(newCells2.splice(0, GRID_WIDTH));
    console.log(newCellsReshaped)
    setCells(newCellsReshaped)
    setNftsLoading(false)
  }, [contract, signer, cells])

  const updateContractDetails = React.useCallback(async () => {
    if (contract && signer && !contractName && !contractSymbol) {
      setContractDetailsLoading(true)
      const promises = [contract.name(), contract.symbol()]
      const promisesResult = await Promise.allSettled(promises)
      if (promisesResult[0].status === 'fulfilled') {
        setContractName(promisesResult[0].value)
      }
      if (promisesResult[1].status === 'fulfilled') {
        setContractSymbol(promisesResult[1].value)
      }
      setContractDetailsLoading(false)
    }
  }, [contract, signer, contractName, contractSymbol])

  React.useEffect(() => {
    updateContractDetails()
    handleRetrieveNfts()
  }, [updateContractDetails, handleRetrieveNfts])

  React.useEffect(() => {
    disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnClickCell = (cell: SquareNFT) => {
    setSelectedCell(cell)
  }

  const buyNft = async (nft: SquareNFT, title: string, image: string) => {
    try {
      if (!contract) throw Error("Contract is not defined");
      if (!address) throw Error("You're not connected");
      toast.closeAll()
      toast({
        title: `Buying NFT number ${nft.tokenId}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      const overrides = {
        value: ethers.utils.parseEther("0.001")
      }
      const tx = await contract.safeMint(address, nft.tokenId, title, image, overrides);
      await tx.wait()
      toast.closeAll()
      toast({
        title: `NFT bought!`,
        description: `You've successfully purchased the NFT number ${nft.tokenId}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
    catch (e) {
      console.log(e)
      let result = 'unknow';
      if (typeof e === "string") {
        result = e
      } else if (e instanceof Error) {
        result = e.message
      }
      toast.closeAll()
      toast({
        title: `NFT purchase failed!`,
        description: `You couldn't purchase the NFT number ${nft.tokenId}. ${formatString(result)}.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const editNft = async (nft: SquareNFT, title: string, image: string) => {
    try {
      if (!contract) throw Error("Contract is not defined");
      toast.closeAll()
      toast({
        title: `Editing NFT number ${nft.tokenId} info!`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      console.log(title, image)
      const tx = await contract.setTokenTitleAndImage(nft.tokenId, title, image);
      await tx.wait()
      toast.closeAll()
      toast({
        title: `NFT edited!`,
        description: `You've successfully edited the NFT number ${nft.tokenId}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
    catch (e) {
      let result = 'unknow';
      if (typeof e === "string") {
        result = e
      } else if (e instanceof Error) {
        result = e.message
      }
      toast.closeAll()
      toast({
        title: `NFT edit failed!`,
        description: `You couldn't edit the NFT number ${nft.tokenId}. ${formatString(result)}.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }


  const transferNft = async (nft: SquareNFT, toAddress: string) => {
    try {
      if (!contract) throw Error("Contract is not defined");
      if (!address) throw Error("You're not connected");
      toast.closeAll()
      toast({
        title: `Transfer ownership of NFT number ${nft.tokenId}!`,
        description: `You're transferring the ownership of the NFT to ${toAddress}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      const tx = await contract.transferFrom(address, toAddress, nft.tokenId);
      await tx.wait()
      toast.closeAll()
      toast({
        title: `NFT edited!`,
        description: `You've successfully edited the NFT number ${nft.tokenId}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
    catch (e) {
      let result = 'unknow';
      if (typeof e === "string") {
        result = e
      } else if (e instanceof Error) {
        result = e.message
      }
      toast.closeAll()
      toast({
        title: `NFT edit failed!`,
        description: `You couldn't edit the NFT number ${nft.tokenId}. ${formatString(result)}.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (loading) {
    return (
      <Box p="0 2rem">
        <Head>
          <title>ERC20 Contract</title>
          {/* <meta name="description" content="Generated by create next app" /> */}
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </main>
      </Box>
    )
  }

  return (
    <Box p="0 2rem">
      <Head>
        <title>ERC20 Contract</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {isConnected ?
          <React.Fragment>
            <Heading as='h1' fontSize={"4rem"} lineHeight="1.1">
              Welcome to <span className={styles.blue}>Blockchain SU-Squares Contract</span>
            </Heading>

            <Heading mt='10'>
              The address of the contract is <span className={styles.blue}>{contractAddress}</span>
            </Heading>

            <Text mt='10'>
              The name of the contract is <span className={styles.blue}>{contractName}</span>
              <br />
              The symbol of the contract is <span className={styles.blue}>{contractSymbol}</span>
              <br />
            </Text>

            <Heading mt='10' mb="10">
              Your address: <span className={styles.blue}>{address}</span>
            </Heading>
            <Flex flexDir={'row'} w='100%' p='0' >
              <NFTGrid w='80%' mr='auto' onClickCell={handleOnClickCell} cells={cells} selected={selectedCell} />

              <NftView w='20%' h='100%' ml='auto' nftMetadata={selectedCell} userAddress={address!} 
              buyNft={buyNft} editNft={editNft} transferNft={transferNft} />
            </Flex>

          </React.Fragment>
          :
          <React.Fragment>
            <Heading fontSize={"4rem"} lineHeight="1.1">
              Welcome to <span className={styles.blue}>Blockchain ERC20 Contract</span>
            </Heading>
            <Text >
              Please connect to metamask to continue.
            </Text>
            <div className={styles.inputs}>
              <Button onClick={() => {
                connect({ connector: connectors[0] })
              }}>Connect Wallet</Button>
            </div>
          </React.Fragment>
        }
      </main>
    </Box>
  )
}
