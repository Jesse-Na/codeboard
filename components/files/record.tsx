"use client";

import { getAllFiles, S3Record } from "@/lib/actions";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function RecordsTable() {
  // COMMENT OUT LATERRR
  const testUserId = "test-user-id";
  const [records, setRecords] = useState<S3Record[]>([]);

  console.log(records);

  useEffect(() => {
    const fetchRecords = async () => {
      const records = await getAllFiles(testUserId);
      setRecords(records);
    };

    fetchRecords();
  }, []);

  const handleCodeDownload = (code: Uint8Array, codeFile: string) => {
    const blob = new Blob([new Uint8Array(code)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = codeFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBoardDownload = (board: Uint8Array, boardFile: string) => {
    const blob = new Blob([new Uint8Array(board)], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = boardFile;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <TableCell>
              {record.code && (
                <Button
                  onClick={() =>
                    handleCodeDownload(record.code!, record.codeFile!)
                  }
                >
                  Download
                </Button>
              )}
            </TableCell>

            {/* Image File */}
            <TableCell>
              {record.board && (
                <Button
                  onClick={() =>
                    handleBoardDownload(record.board!, record.boardFile!)
                  }
                >
                  Download
                </Button>
              )}
            </TableCell>

            {/* Last Updated */}
            <TableCell className="text-right">
              {new Date(record.lastUpdated).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
