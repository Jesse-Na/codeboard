import { getAllFiles } from "@/lib/actions"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function RecordsTable() {
    // COMMENT OUT LATERRR
    const testUserId = "test-user-id";
    const records = await getAllFiles(testUserId);

    return (
    <Table>
      <TableCaption>A list of your saved files.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Record Id</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Code File</TableHead>
          <TableHead>Image File</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            {/* Record ID */}
            <TableCell className="font-medium">{record.id}</TableCell>

            {/* Room Name */}
            <TableCell>{record.room.name}</TableCell>

            {/* Code File */}
            <TableCell>{record.codeFile}</TableCell>

            {/* Image File */}
            <TableCell className="text-right">{record.boardFile}</TableCell>

            {/* Last Updated */}
            <TableCell className="text-right">{new Date(record.lastUpdated).toLocaleString()}</TableCell>

          </TableRow>
        ))}
      </TableBody>
  
    </Table>
  )
}
