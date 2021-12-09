import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip,
} from "@material-ui/core";
import useStyles from "../../styles";

const states = {
  ดำเนินการแล้ว: "success",
  อยู่ระหว่างดำเนินการ: "warning",
  ไม่ดำเนินการ: "secondary",
};

export default function TableComponent({ data }) {
  const classes = useStyles();
  var keys = Object.keys(data[0]).map((i) => i.toUpperCase());
  keys.shift(); // delete "id" key

  return (
    <Table className="mb-0">
      <TableHead>
        <TableRow>
          <TableCell className="pl-3 fw-normal">{"กำหนดการ"}</TableCell>
          <TableCell>{"ชื่อกิจกรรม"}</TableCell>
          <TableCell>{"เวลา"}</TableCell>
          <TableCell>{"จำนวนชั่วโมง"}</TableCell>
          <TableCell>{"หน่วยงาน"}</TableCell>
          <TableCell>{"ผู้รับผิดชอบ"}</TableCell>
          <TableCell>{"สถานะ"}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ id, name, email, product, price, date, city, status }) => (
          <TableRow key={id}>
            <TableCell className="pl-3 fw-normal">{name}</TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>{product}</TableCell>
            <TableCell>{price}</TableCell>
            <TableCell>{date}</TableCell>
            <TableCell>{city}</TableCell>
            <TableCell>
              <Chip
                label={status}
                classes={{ root: classes[states[status.toLowerCase()]] }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
