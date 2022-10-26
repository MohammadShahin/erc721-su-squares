import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Image,
  TableContainerProps,
  Center,
} from "@chakra-ui/react";
import React from "react";
import { SquareNFT } from "../types";

interface Props {
  onClickCell: (cell: SquareNFT) => void;
  cells: SquareNFT[][];
  selected?: SquareNFT;
}

const DEFAULT_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtI9BTbaraRUMrlcezkibJLdX213clvDUWQQ&usqp=CAU"


export default function NFTGrid({ onClickCell, cells, selected, ...tableContainerProps }: Props & TableContainerProps) {

  return (
    <TableContainer {...tableContainerProps}>
      <Table variant='unstyled' >
        <Tbody >
          {
            cells.map((row, indexI) => {
              return (
                <Tr key={indexI} w="100%" p="1">

                  {row.map((elem) => {
                    return <Td
                      key={elem.tokenId}
                      alignContent='center'
                      alignItems='center'
                      border={(elem.tokenId === selected?.tokenId) ? "solid red 3px!" : "dashed black 3px"}
                      p='0'
                      onClick={() => onClickCell(elem)}
                      _hover={{
                        border: 'solid #0070f3 3px'
                      }}
                    >
                      <Center
                        m='auto'
                        h={'24px!'}
                        w={'24px!'}>
                        <Image display='block' w='100%!' h='100%!' fill={'cover'} m='auto' src={elem.owner ? elem.image : DEFAULT_IMAGE} alt=""></Image>
                      </Center>  
                    </Td>
                  })}
                </Tr>
              )
            })
          }
        </Tbody>
      </Table>
    </TableContainer>
  )
}
