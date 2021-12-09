/*
import React, { useState, useEffect } from "react";
//import Highlighter from "react-highlight-words";
import { Alert } from "reactstrap";
import axios from "axios";
import Loading from "../components/loading";

const getAllStudent = (props) => {
  //console.log(props.typeNews); //รับค่า props เพือแยกประเภทข่าว
  const [data, setData] = useState([]); //post

  const [record, setRecord] = useState([]);

  const [isLoading, setIsLoading] = useState(false); //load data
  const [isError, setIsError] = useState(false); //fail
  const [nonData, setNonData] = useState(false); //fail

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://academic.pcru.ac.th/api/all-rule.php`,
      );
      const data = await res.data; //รับข้อมูลแล้ว
      //   .then((response) => {
      if (data.success === 0) {
        //console.log("data success : ", data.success);
        setIsError(true);
        setNonData(true);
      } else {
        setIsError(false);
        setNonData(false);
      }
      //setSearch(response.data.rules);
      //console.log("xxxx", data.success);
      setData(data.rules);
      //console.log(response.data);
      setIsLoading(false);
      //     });
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) loadRecords();
    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
  }, []);

  //const allNews = data.length;
  //const data = await search; //รับข้อมูลแล้ว

  const badgeStyle = (typeRules) => {
    switch (typeRules) {
      case "1":
        return "primary";
      case "2":
        return "info";
      case "3":
        return "success";
      case "4":
        return "secondary";
      case "5":
        return "danger";
      case "6":
        return "warning";
      case "7":
        return "pink";
      default:
        return "light";
    }
  };

  let content = <Loading msg="กำลังโหลด" />;

  if (!isLoading) {
    if (isError) {
      //content = "ไม่สามารถโหลดข้อมูลได้";
      //      console.log("eeerrrx");
      if (nonData) {
        content = (
          <Alert color="light dark">
            <p>{"ไม่พบข้อมูลที่ค้นหา!"}</p>
          </Alert>
        );
      } else {
        content = (
          <Alert color="light dark">
            <p>{"ไม่สามารถโหลดข้อมูลได้! กรุณาติดต่อผู้ดูแลระบบ"}</p>
          </Alert>
        );
      }
    } else {
      content = (
        <div>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.rufilestous}</TableCell>
                <TableCell>{item.ruftitle}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(item);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="secondary"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "ลบแท้ติ?",
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(item.id);
                        },
                      });
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </div>
      );
    }
  }

  //console.log(data);
  return <div>{content}</div>;
};
export default getAllStudent;
*/
