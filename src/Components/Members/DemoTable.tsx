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
import { ArrowUpDown, ChevronDown, Search, View } from "lucide-react";

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
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/src/Firebase/firebase";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/src/app/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export type Users = {
  uid: string;
  userName: string;
  University: string;
  Domains: string[];
  ProfilePic: string;
  // email: string;
  Role: string;
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "userName",
    header: "User Name",
    cell: ({ row }) => (
      <Link to={`/Profile/${row.original.uid}`}>
        <div className="capitalize flex items-center space-x-2 poppins-semibold">
          <Avatar className="size-10 border-2 border-gray-600">
            <AvatarImage src={row.original.ProfilePic} />
            <AvatarFallback>{"U"}</AvatarFallback>
          </Avatar>
          <span>{row.getValue("userName")}</span>
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "Role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("Role")}</div>,
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
          {Array.isArray(domains) && domains.length > 0 ? (
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
  const userId = useAppSelector((state) => state.profile.userId);
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
        const userSnapshot = await getDocs(
          query(userCollection, where("uid", "!=", userId))
        );
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
    <div className="w-[92%] bg-[#c2e5f3]  p-4 mt-6 text-black border-2 border-blue-500 rounded-xl">
      <div className="flex items-center py-3 space-x-2">
        <div className="relative">
          <div className="absolute left-2 top-2 cursor-pointer">
            <Search className="text-gray-600" />
          </div>
          <Input
            placeholder="Search Users..."
            value={
              (table.getColumn("userName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("userName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm pl-8 poppins-light border-2 border-blue-400  focus:bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus-visible:border-sky-800"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto border-2 border-gray-800 poppins-light bg-[#85cfed] border-dashed hover:border-double"
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
              className="ml-auto border-2 border-gray-800 poppins-light bg-[#87CEEB] border-dashed hover:border-double"
            >
              Filter by Role <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {data &&
              data.length > 0 &&
              Array.from(new Set(data.map((item) => item.Role)))
                .filter((role) => role !== null && role !== undefined) // Filter out null and undefined values
                .map((role) => {
                  const capitalizedRole =
                    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
                  return (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => {
                        table.getColumn("Role")?.setFilterValue(role);
                      }}
                    >
                      {capitalizedRole}
                    </DropdownMenuItem>
                  );
                })}
            <DropdownMenuItem
              onClick={() => {
                table.getColumn("Role")?.setFilterValue("");
              }}
            >
              Show All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto border-2 border-gray-800 poppins-light bg-[#87CEEB] border-dashed hover:border-double"
            >
              Filter by University <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {data &&
              data.length > 0 &&
              Array.from(new Set(data.map((item) => item.University))).map(
                (university) => {
                  const capitalizedUniversity =
                    university.charAt(0).toUpperCase() +
                    university.slice(1).toLowerCase();
                  return (
                    <DropdownMenuItem
                      key={university}
                      onClick={() => {
                        table
                          .getColumn("University")
                          ?.setFilterValue(university);
                      }}
                    >
                      {capitalizedUniversity}
                    </DropdownMenuItem>
                  );
                }
              )}
            <DropdownMenuItem
              onClick={() => {
                table.getColumn("University")?.setFilterValue("");
              }}
            >
              Show All
            </DropdownMenuItem>
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
