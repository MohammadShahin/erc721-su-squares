import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  height: number;
  width: number;
  onClickCell: (x: number, y: number) => void;
  cells: string[][];
}

export default function NFTGrid({ height, width, onClickCell, cells }: Props) {

  return (
    <TableContainer>
      <Table variant='simple'>
        <TableCaption>The Game</TableCaption>
        <Tbody>
          {
            cells.map((row, index) => {
              return (
                <Tr key={index}>

                  {row.map((elem) => {
                    return elem
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
