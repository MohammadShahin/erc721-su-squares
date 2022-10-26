import { Button, Flex, FlexProps, FormControl, FormHelperText, FormLabel, Heading, Image, Input, Text } from "@chakra-ui/react";
import React from "react";
import { SquareNFT } from "../types";

interface NftViewProps {
    nftMetadata?: SquareNFT;
    userAddress: string;
    buyNft: (nft: SquareNFT, title: string, image: string) => Promise<any>;
    editNft: (nft: SquareNFT, title: string, image: string) => Promise<any>;
}

export default function NftView({ nftMetadata, buyNft, userAddress, ...flexProps }: NftViewProps & FlexProps) {

    const [titleEdit, setTitleEdit] = React.useState('')
    const [imageEdit, setImageEdit] = React.useState('')

    const [titleBuy, setTitleBuy] = React.useState('')
    const [imageBuy, setImageBuy] = React.useState('')


    return (
        <Flex p='2' border={'dashed 1px gray'} borderRight={'none'} flexDir={'column'}
            alignItems='center' alignContent='center' textAlign={'center'} {...flexProps} >
            {nftMetadata ?
                <React.Fragment>
                    <Heading as={'h4'} color='#0070f3'>
                        Cell number {' ' + nftMetadata.tokenId}
                    </Heading>
                    {nftMetadata.owner ?
                        <React.Fragment>
                            <Text as={'h5'} color='#0070f3' wordBreak={'break-word'}>
                                Owner: {' ' + nftMetadata.owner}
                                <br />
                                Title: {' ' + nftMetadata.title}
                            </Text>
                            <Image src={nftMetadata.image} alt="" w='95%' />
                            {nftMetadata.owner === userAddress &&
                                <FormControl mt='10' display={'flex'} flexDir='column' alignItems={'center'} alignContent='center'>
                                    <FormLabel>Title</FormLabel>
                                    <Input type='text' value={titleEdit} onChange={event => setTitleEdit(event.target.value)} />
                                    <FormLabel>Image</FormLabel>
                                    <Input type='text' value={imageEdit} onChange={event => setImageEdit(event.target.value)} />
                                    <Button mt='5' onClick={() => buyNft(nftMetadata, titleBuy, imageBuy)}>
                                        Edit this NFT
                                    </Button>
                                    <FormHelperText>We&apos;ll never share your email.</FormHelperText>
                                </FormControl>
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
                                <FormHelperText>We&apos;ll never share your email.</FormHelperText>
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
