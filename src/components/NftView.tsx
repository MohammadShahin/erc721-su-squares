import { Button, Flex, FlexProps, FormControl, FormHelperText, FormLabel, Heading, Image, Input, Link, Text } from "@chakra-ui/react";
import React from "react";
import { SquareNFT } from "../types";
import NextLink from "next/link"

interface NftViewProps {
    nftMetadata?: SquareNFT;
    userAddress: string;
    buyNft: (nft: SquareNFT, title: string, image: string) => Promise<any>;
    editNft: (nft: SquareNFT, title: string, image: string) => Promise<any>;
    transferNft: (nft: SquareNFT, toAddress: string) => Promise<any>;
}

export default function NftView({ nftMetadata, userAddress, editNft, buyNft, transferNft, ...flexProps }: NftViewProps & FlexProps) {

    // Editing
    const [titleEdit, setTitleEdit] = React.useState('')
    const [imageEdit, setImageEdit] = React.useState('')

    // Buying
    const [titleBuy, setTitleBuy] = React.useState('')
    const [imageBuy, setImageBuy] = React.useState('')

    // Transferring
    const [toAddress, setToAddress] = React.useState('')

    return (
        <Flex p='2' flexDir={'column'} alignItems='center' alignContent='center' textAlign={'center'} {...flexProps} >
            {nftMetadata ?
                <React.Fragment>
                    <Heading as={'h4'} color='#0070f3'>
                        Cell number {' ' + nftMetadata.tokenId}
                    </Heading>
                    {nftMetadata.owner ?
                        <React.Fragment>
                            <Text as={'h5'} color='#0070f3' wordBreak={'break-word'}>
                                Owner: {nftMetadata.owner === userAddress ? "You" : ' ' + nftMetadata.owner}
                                <br />
                                Title: {' ' + nftMetadata.title}
                                <br />
                                Image link: <NextLink href={nftMetadata.image!} passHref>
                                    <Link isExternal>
                                        Here
                                    </Link>
                                </NextLink>
                            </Text>
                            <Image src={nftMetadata.image} alt="" w='95%' />
                            {nftMetadata.owner === userAddress &&
                            <React.Fragment>
                                <FormControl mt='10' display={'flex'} flexDir='column' alignItems={'center'} alignContent='center'>
                                    <FormLabel>Title</FormLabel>
                                    <Input type='text' value={titleEdit} onChange={event => setTitleEdit(event.target.value)} />
                                    <FormLabel>Image</FormLabel>
                                    <Input type='text' value={imageEdit} onChange={event => setImageEdit(event.target.value)} />
                                    <Button mt='5' onClick={() => editNft(nftMetadata, titleEdit, imageEdit)}>
                                        Edit this NFT
                                    </Button>
                                    <FormHelperText fontWeight={10} color={'red'}>Both title and image will be edited!</FormHelperText>
                                </FormControl>

                                <FormControl mt='10' display={'flex'} flexDir='column' alignItems={'center'} alignContent='center'>
                                    <FormLabel>Transfer to</FormLabel>
                                    <Input placeholder="0xa2F.." type='text' value={toAddress} onChange={event => setToAddress(event.target.value)} />
                                    <Button mt='5' onClick={() => transferNft(nftMetadata, toAddress)}>
                                        Transfer
                                    </Button>
                                    <FormHelperText fontWeight={10} color={'red'}>You will loss ownership of this NFT!</FormHelperText>
                                </FormControl>
                            </React.Fragment>
                                
                                
                            }

                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Text>
                                The NFT is available for sale.
                            </Text>
                            <FormControl mt='10' display={'flex'} flexDir='column' alignItems={'center'} alignContent='center'>
                                <FormLabel>Title</FormLabel>
                                <Input type='text' value={titleBuy} onChange={event => setTitleBuy(event.target.value)} />
                                <FormLabel>Image</FormLabel>
                                <Input type='text' value={imageBuy} onChange={event => setImageBuy(event.target.value)} />
                                <Button mt='5' onClick={() => buyNft(nftMetadata, titleBuy, imageBuy)}>
                                    Buy this NFT
                                </Button>
                                <FormHelperText>Input NFT info</FormHelperText>
                            </FormControl>

                        </React.Fragment>
                    }
                </React.Fragment>
                :
                <Heading as={'h4'} color='#0070f3'>
                    No square selected.
                </Heading>
            }
        </Flex>
    )
}
