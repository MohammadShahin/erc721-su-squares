import { Button, Flex, FlexProps, FormControl, FormHelperText, FormLabel, Heading, Image, Input, Text } from "@chakra-ui/react";
import React from "react";
import { SquareNFT } from "../types";

interface NftViewProps {
    nftMetadata?: SquareNFT;
    buyNft: (nft: SquareNFT, title: string, image: string) => Promise<any>;
}

export default function NftView({ nftMetadata, buyNft, ...flexProps }: NftViewProps & FlexProps) {

    const [title, setTitle] = React.useState('')
    const [image, setImage] = React.useState('')

    return (
        <Flex p='2' border={'dashed 1px gray'} borderRight={'none'} flexDir={'column'}
            alignItems='center' alignContent='center' textAlign={'center'} {...flexProps}>
            {nftMetadata ?
                <React.Fragment>
                    <Heading as={'h4'} color='#0070f3'>
                        Cell number {' ' + nftMetadata.tokenId}
                    </Heading>
                    {nftMetadata.owner ?
                        <React.Fragment>
                            <Text as={'h5'} color='#0070f3'>
                                Owner: {' ' + nftMetadata.owner}
                                <br />
                                Title: {' ' + nftMetadata.title}
                            </Text>
                            <Image src={nftMetadata.image} alt="" />
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Text>
                                The NFT is available for sale.
                            </Text>
                            <FormControl mt='10' display={'flex'} flexDir='column' alignItems={'center'} alignContent='center'>
                                <FormLabel>Title</FormLabel>
                                <Input type='text' value={title} onChange={event => setTitle(event.target.value)} />
                                <FormLabel>Image</FormLabel>
                                <Input type='text' value={image} onChange={event => setImage(event.target.value)} />
                                <Button mt='5' onClick={() => buyNft(nftMetadata, title, image)}>
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
