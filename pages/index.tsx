import Head from 'next/head'
import React from 'react'
import styles from '../styles/Home.module.css'
import { useAccount, useConnect, useDisconnect, useContract, useSigner } from 'wagmi'
// import { calculatorAbi } from '../src/abi'
import { useToast, Button, Input, Text, Flex, Box, Heading, NumberInput, NumberInputField, Drawer, DrawerContent, DrawerHeader, DrawerBody, useColorMode } from '@chakra-ui/react'
import { abi, address as contractAddress } from '../src/constants'
import { NFTGrid } from '../src/components'
import { SquareNFT } from '../src/types'
import NftView from '../src/components/NftView'
import { formatString } from '../src/utils'

const GRID_HEIGHT = 25;
const GRID_WIDTH = 40;

export default function Home() {

  // Wagmi
  // const { address, isConnected } = useAccount()
  const { address, isConnected } = useAccount()
  const { data: signer } = useSigner()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Contract metadata
  const contract = useContract({ address: contractAddress, abi, signerOrProvider: signer })
  const [contractName, setContractName] = React.useState<string>()
  const [contractSymbol, setContractSymbol] = React.useState<string>()
  const [cells, setCells] = React.useState<SquareNFT[][]>([[]])

  // ui
  const [selectedCell, setSelectedCell] = React.useState<SquareNFT>()
  const toast = useToast()

  React.useEffect(() => {
    // Getting from the contract.
    const newCells = Array(1000).fill('').map((_e, ind) => ({
      tokenId: ind,
      owner: "0x78d86E031605d2873f38dfa2657Fe92d8aC243f9",
      title: ind.toString(),
      image: "data:image/png;base64,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"
      // image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Y-nxR0cHA2VIf2dGc-YN3cevLZMerWvxLQ&usqp=CAU"
    }) as SquareNFT)

    const newCellsReshaped = []
    while (newCells.length) newCellsReshaped.push(newCells.splice(0, GRID_WIDTH));
    setCells(newCellsReshaped)
  }, [])

  React.useEffect(() => {
    const updateContractDetails = async () => {
      if (contract && isConnected) {
        const promises = [contract.name(), contract.symbol()]
        const promisesResult = await Promise.allSettled(promises)
        if (promisesResult[0].status === 'fulfilled') {
          setContractName(promisesResult[0].value)
        }
        if (promisesResult[1].status === 'fulfilled') {
          setContractSymbol(promisesResult[1].value)
        }
      }
    }
    updateContractDetails()
  }, [contract, isConnected])

  React.useEffect(() => {
    disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnClickCell = (cell: SquareNFT) => {
    setSelectedCell(cell)
  }

  const buyNft = async (nft: SquareNFT, title: string, image: string) => {
    try {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("foo");
        }, 300);
      })
      await promise
      toast({
        title: `NFT bought!`,
        description: `You've successfully purchased the NFT number ${nft.tokenId}.`,
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
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("foo");
        }, 300);
      })
      await promise
      toast({
        title: `NFT edited!`,
        description: `You've successfully edit the NFT number ${nft.tokenId}.`,
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
      toast({
        title: `NFT purchase failed!`,
        description: `You couldn't edit the NFT number ${nft.tokenId}. ${formatString(result)}.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
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

              <NftView w='20%' ml='auto' nftMetadata={selectedCell} buyNft={buyNft} editNft={editNft} userAddress={address!}/>
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
