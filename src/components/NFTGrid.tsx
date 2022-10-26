import {
  Table,
  Tbody,
  Tr,
  Td,
  TableCaption,
  TableContainer,
  Image,
  TableContainerProps,
  Box,
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

                  {row.map((elem, indexJ) => {
                    return <Td
                      key={elem.tokenId}
                      border={(elem.tokenId === selected?.tokenId) ? "solid red 3px!" : "dashed black 3px"}
                      p='0'
                      onClick={() => onClickCell(elem)}
                      _hover={{
                        border: 'solid #0070f3 3px'
                      }}
                    >
                      <Box
                        h={'24px!'}
                        w={'24px!'}>
                        <Image h='100%' w='100%' fill={'contain'} src={elem.owner ? elem.image : DEFAULT_IMAGE} alt=""></Image>
                      </Box>
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
