"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, View } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/Firebase/firebase";
import { useEffect } from "react";
import { Link } from "react-router-dom";
export type Users = {
  uid: string;
  userName: string;
  University: string;
  Domains: string[];
  email: string;
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "userName",
    header: "User Name",
    cell: ({ row }) => (
      <div className="capitalize poppins-semibold">
        {row.getValue("userName")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "University", // Make sure the accessorKey matches the field name
    header: "University", // Set the header title
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("University")}</div>
    ), // Display the University value
  },
  {
    accessorKey: "Domains",
    header: () => <div className="text-right">Domains</div>,
    cell: ({ row }) => {
      const domains = row.getValue("Domains") as string[];
      return (
        <div className="text-right">
          {domains ? (
            domains.map((domain, index) => (
              <div key={index} className="capitalize">
                {domain}
              </div>
            ))
          ) : (
            <div>No domains</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "uid",
    header: () => <div className="text-right">Profile</div>,
    cell: ({ row }) => {
      const uid = row.getValue("uid") as string;
      return (
        <div className="text-right">
          <Link to={`/Profile/${uid}`} className="no-underline text-black">
            <Button className="bg-[#87CEEB] flex items-center text-xs poppins-semibold border-gray-600 border-2  text-black hover:bg-slate-300 border-dashed hover:border-double">
              <View className="size-4" />
              Profile
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export function DataTableDemo() {
  const [data, setData] = React.useState<Users[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = collection(db, "users");
        const userSnapshot = await getDocs(userCollection);
        const users: Users[] = [];
        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          users.push(userData as Users);
        });
        console.log("Data", users);
        setData(users);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, [table]);
  return (
    <div className="w-[96%] bg-[#c2e5f3]  p-4 mt-6 text-black border-2 border-blue-500 rounded-xl">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search Users..."
          value={
            (table.getColumn("userName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("userName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm poppins-light border-2 border-blue-400"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto border-2 border-blue-400"
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto border-2 border-blue-400"
            >
              Filter by University <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {data &&
              data.length > 0 &&
              Array.from(new Set(data.map((item) => item.University))).map(
                (university) => {
                  return (
                    <DropdownMenuItem
                      key={university}
                      onClick={() => {
                        table
                          .getColumn("University")
                          ?.setFilterValue(university);
                      }}
                    >
                      {university}
                    </DropdownMenuItem>
                  );
                }
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[#89CFF3] border-2 border-blue-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                // <Link
                //   to={`/Profile/${row.original.uid}`}
                //   className="w-full h-full block"
                // >
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    index % 2 === 0 ? "bg-[#c2e5f3] " : "bg-[#CDF5FD]"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                // </Link>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
