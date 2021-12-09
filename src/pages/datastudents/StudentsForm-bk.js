import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import Controls from "../../components/Dialogs/controls/Controls";
import { useForm, Form } from "../../components/Dialogs/useForm";
//import * as employeeService from "../../services/employeeService";
import Popup from "../../components/Dialogs/Popup";
import Loading from "../../components/loading";
import { Alert } from "reactstrap";
import Notification from "../../components/Dialogs/Notification";
import axios from "axios";
import useStyles from "./styles";

const schItems = [
  { id: "1", title: "ทุนเรียนดี" },
  { id: "2", title: "ทุนความสามารถฯ" },
  { id: "3", title: "ทุนสร้างชื่อเสียงฯ" },
];

const initialFValues = {
  id: 0,
  //std_code: "",
  //firstname: "",
  //lastname: "",

  mobile: "d",
  std_code: "",
  firstname: "",
  lastname: "",
  fac_name: "",
  fac_id: "",
  sch_name: "",
  birthday: "",
};

export default function EmployeeForm(props) {
  var classes = useStyles();
  const { addOrEdit, recordForEdit } = props;

  //const userDispatch = useUserDispatch();
  const [isError, setIsError] = useState(false); //fail
  // local
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  //const [error, setError] = useState(null);
  const [nonData, setNonData] = useState(false); //fail
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  ///
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("std_code" in fieldValues)
      temp.std_code = fieldValues.std_code ? "" : "กรอกรหัสนักศึกษา.";
    if ("firstname" in fieldValues)
      temp.firstname = fieldValues.firstname ? "" : "กรอกชื่อนักศึกษา.";
    if ("lastname" in fieldValues)
      temp.lastname = fieldValues.lastname ? "" : "กรอกนามสกุลนักศึกษา.";
    if ("sch_name" in fieldValues)
      temp.sch_name = fieldValues.sch_name.length != 0 ? "" : "กรอกสาขา.";
    if ("lastname" in fieldValues)
      temp.lastname = fieldValues.lastname ? "" : "กรอกสาขา.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
        ? ""
        : "Email is not valid.";
    if ("mobile" in fieldValues)
      temp.mobile = fieldValues.mobile ? "" : "Minimum 10 numbers required.";

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  ///
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, true, validate);

  // โหลดข้อมูล นศ.

  const addToRead = async () => {
    setIsLoading(true);
    axios
      .get(
        `http://academic.pcru.ac.th/dev/student-detail-end.php?stdcode=${props.StudentCode}`,
      )
      .then((res) => {
        if (res.data.status === true) {
          //cosole.log("พบข้อมูล")
          setIsError(false);
          setNonData(false);

          console.log(res.data);
          setValues({
            //เซตค่าเริ่มต้นตรงนี้
            std_code: res.data.data.STD_CODE,
            firstname: res.data.data.FIRST_NAME,
            lastname: res.data.data.LAST_NAME,
            fac_name: res.data.data.MAJOR_NAME,
            fac_id: res.data.data.MAJOR_CODE,
            sch_name: "1",
            birthday: new Date().toISOString().slice(0, 10),
          });
          setIsLoading(false);
        } else {
          setIsError(true);
          setNonData(true);
          //setIsError(true);
          //setNonData(false);
          console.log("ไม่พบข้อมูล");
          setIsLoading(false);
        }
        //console.log(res);
        //console.log(res);
      })
      .catch((error) => {
        setIsError(true);
        setIsLoading(false);
        console.error("onRejected function called: " + error.message);
      });
  };

  useEffect(() => {
    if (props.dataOpen) {
      addToRead();
      // validate();
    } else {
      resetForm();
    }
  }, [props.dataOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(validate(values));
    //return;
    const newsValues = {
      ...values,
      ...{
        fac_id: values.fac_id,
        sch_name: values.sch_name,
      },
    };
    console.log("xxxx", newsValues);
    //console.log(newsValues);
    //console.log({ ...values, ...{ ddddd: values.major }, ...{ xxx: "ddddd" } });
    //return;
    if (validate()) {
      //addOrEdit(values, resetForm);
      //init
      //loading true
      //error false
      //errorMsg ""

      setIsAddLoading(true);
      try {
        console.log(values);
        //const result = await axios.post(`end-point`,values);
        const result = await axios.post(
          `http://academic.pcru.ac.th/dev/student-add.php`,
          newsValues,
        );
        if (result) {
          console.log("success");
          setTimeout(() => {
            setIsAddLoading(false);
            //แจ้งบันทึก
            setNotify({
              isOpen: true,
              message: "เพิ่มข้อมูลนักศึกษา เรียบร้อยแล้ว",
              type: "success",
            });
            //
            props.onclose();
            props.loadRecords();
          }, 500);

          // success
          //loading false
          //error false
          //errorMsg ""
          //closePopup
          //refreshData
          //reset form
        }
      } catch (error) {
        console.log("error");
        setIsAddLoading(false);
        //loading false
        //error true
        //errorMsg "มีบางอย่างผิดพลาด"
      }
    }
  };
  /**/
  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

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
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={4} lg={3}>
              <Controls.Input
                name="std_code"
                label="รหัสนักศึกษา"
                value={values.std_code}
                onChange={handleInputChange}
                error={errors.std_code}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={5}>
              <Controls.Input
                label="ชื่อ"
                name="firstname"
                value={values.firstname}
                onChange={handleInputChange}
                error={errors.firstname}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Controls.Input
                label="สกุล"
                name="lastname"
                value={values.lastname}
                onChange={handleInputChange}
                error={errors.lastname}
                InputProps={{
                  readOnly: false,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3} md={4} lg={3}>
              <Controls.Input
                name="birthday"
                label="วัน/เดือน/ปีเกิด"
                value={values.birthday}
                defaultValue={new Date().toISOString().slice(0, 10)}
                type="date"
                onChange={handleInputChange}
                error={errors.birthday}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={4} lg={3}>
              <Controls.Input
                label="เบอร์โทรศัพท์"
                name="mobile"
                value={values.mobile}
                onChange={handleInputChange}
                error={errors.mobile}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Controls.RadioGroup
                name="sch_name"
                label="ประเภททุน"
                value={values.sch_name}
                onChange={handleInputChange}
                items={schItems}
              />
            </Grid>
            <Grid item xs={12}>
              <div>
                {isAddLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Controls.Button type="submit" text="Submit" />
                )}
              </div>
            </Grid>
          </Grid>
        </Form>
      );
    }
  }

  return (
    <>
      <Popup
        title="ข้อมูลนักศึกษาทุน"
        openPopup={props.dataOpen}
        setOpenPopup={props.onclose}
      >
        {content}
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
}
