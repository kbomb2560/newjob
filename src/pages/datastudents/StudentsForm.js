import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Input, TextField } from "@material-ui/core";
import Controls from "../../components/Dialogs/controls/Controls";
import { Alert, AlertTitle } from "@material-ui/lab";

//

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
//import { useForm, Form } from "../../components/Dialogs/useForm";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import * as Joi from "joi";

//import * as employeeService from "../../services/employeeService";
import Popup from "../../components/Dialogs/Popup";
import Loading from "../../components/loading";
//import { Alert } from "reactstrap";
import Notification from "../../components/Dialogs/Notification";
import axios from "axios";
import useStyles from "./styles";

const schItems = [
  { id: "1", title: "ทุนเรียนดี" },
  { id: "2", title: "ทุนความสามารถฯ" },
  { id: "3", title: "ทุนสร้างชื่อเสียงฯ" },
];

const dataStudents = Joi.object({
  TERM_YEAR: Joi.string().required(),
  STD_CODE: Joi.number().positive().integer().required(),
  //std_code: Joi.string().required(),
  PREFIX_NAME: Joi.string().required(),
  FIRST_NAME: Joi.string().required(),
  LAST_NAME: Joi.string().required(),
  FAC_CODE: Joi.string().required(),
  FAC_NAME: Joi.string().required(),
  MAJOR_CODE: Joi.string().required(),
  MAJOR_NAME: Joi.string().required(),
  ADMIN_ID: Joi.string().required(),
  SCH_NAME: Joi.string()
    .regex(/^[1-3]/)
    .required(),

  //BIRTHDAY: Joi.string(),
  /*
  BIRTHDAY: Joi.date()
    .raw()
    .required()
    .greater("1990-01-01")
    .less("2015-01-01"),
    */
  //BIRTHDAY: Joi.date().min(Joi.ref('BIRTHDAY')).required(),
  //to: Joi.date().min(Joi.ref('BIRTHDAY')).required()
});

export default function EmployeeForm(props) {
  var classes = useStyles();
  const { addOrEdit, recordForEdit } = props;

  //const [values, setValues] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm({
    resolver: joiResolver(dataStudents),
  });

  //const userDispatch = useUserDispatch();
  const [isError, setIsError] = useState(false); //fail
  // local

  const [age, setAge] = useState("");
  //const [SCH_NAME, setSCH_NAME] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  //const [error, setError] = useState(null);
  const [nonData, setNonData] = useState(false); //fail
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

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
          setValue("STD_CODE", res.data.data.STD_CODE);
          setValue("PREFIX_NAME", res.data.data.PREFIX_NAME);
          setValue("FIRST_NAME", res.data.data.FIRST_NAME);
          setValue("LAST_NAME", res.data.data.LAST_NAME);

          setValue("FAC_NAME", res.data.data.FAC_NAME);
          setValue("MAJOR_NAME", res.data.data.MAJOR_NAME);

          //hidden
          setValue("FAC_CODE", res.data.data.FAC_CODE); //hidden
          setValue("MAJOR_CODE", res.data.data.MAJOR_CODE); //hidden

          //
          var rememberMe = localStorage.getItem("dataAuth");
          //const user = rememberMe ? localStorage.getItem("dataStudent") : "";
          var adminData = JSON.parse(rememberMe);
          setValue("ADMIN_ID", adminData.EMP_CODE); //hidden

          //
          //console.log(values.std_code);
          /*
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
          */
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
      reset();
      //resetForm();
    }
  }, [props.dataOpen]);

  /*
  const handleSubmitAdd = (data, e) => {
    alert(JSON.stringify(data));

    console.log("xxxxx");
    */
  //    console.log(data);
  //return;
  //console.log(errors.firstname);
  console.log(errors);

  ///console.log((Date.now() + 48 * 60 * 60 * 1000))
  const handleSubmitAdd = async (data) => {
    //e.preventDefault();
    console.log(data);
    //return;
    /*   */
    /*
    const newsValues = {
      ...data,
      ...{
        fac_id: values.fac_id,
        sch_name: values.sch_name,
      },
    };
    */
    //console.log("xxxx", newsValues);
    //console.log(newsValues);
    //console.log({ ...values, ...{ ddddd: values.major }, ...{ xxx: "ddddd" } });
    //return;
    //  if (validate()) {
    //addOrEdit(values, resetForm);
    //init
    //loading true
    //error false
    //errorMsg ""

    setIsAddLoading(true);
    try {
      console.log(data);
      //const result = await axios.post(`end-point`,values);
      const result = await axios.post(
        `http://academic.pcru.ac.th/dev/student-add.php`,
        data,
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
  };

  //console.log("xyz");
  /**/
  /*
  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);
*/
  let content = (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        size={30}
        className={classes.loginLoader}
        color="secondary"
      />
    </div>
  );

  if (!isLoading) {
    if (isError) {
      //content = "ไม่สามารถโหลดข้อมูลได้";
      //      console.log("eeerrrx");
      if (nonData) {
        content = (
          <Alert severity="warning">
            <AlertTitle>{"แจ้งเตือน"}</AlertTitle>
            {"ไม่พบข้อมูลที่ค้นหา!"}
          </Alert>
        );
      } else {
        content = (
          <Alert severity="error">
            <AlertTitle>{"แจ้งเตือน"}</AlertTitle>
            {"ไม่สามารถโหลดข้อมูลได้! กรุณาติดต่อผู้ดูแลระบบ!!"}
          </Alert>
        );
      }
    } else {
      content = (
        <form onSubmit={handleSubmit(handleSubmitAdd)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2} md={2} lg={2}>
              <TextField
                {...register("TERM_YEAR")}
                variant="outlined"
                label="ภาค/ปีการศึกษา"
                fullWidth
                error={!!errors.TERM_YEAR}
                helperText={errors.TERM_YEAR?.message}
                InputProps={{
                  readOnly: false,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={10} md={10} lg={10}>
              <InputLabel
                shrink
                id="demo-simple-select-placeholder-label-label"
              >
                ประเภททุน
              </InputLabel>
              <Select
                {...register("SCH_NAME")}
                error={!!errors.SCH_NAME}
                helperText={errors.SCH_NAME?.message}
                defaultValue={"0"}
              >
                <MenuItem value={"0"}>
                  <em>-เลือกประเภททุนที่ได้รับ-</em>
                </MenuItem>
                <MenuItem value={"1"}>ทุนเรียนดี</MenuItem>
                <MenuItem value={"2"}>ทุนความสามารถพิเศษ</MenuItem>
                <MenuItem value={"3"}>ทุนสร้างชื่อเสียง</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={2} md={2} lg={2}>
              <TextField
                {...register("STD_CODE")}
                variant="outlined"
                label="รหัสนักศึกษา"
                fullWidth
                error={!!errors.STD_CODE}
                helperText={errors.STD_CODE?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2} md={2} lg={2}>
              <TextField
                {...register("PREFIX_NAME")}
                variant="outlined"
                label="คำนำหน้า"
                fullWidth
                error={!!errors.PREFIX_NAME}
                helperText={errors.PREFIX_NAME?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3}>
              <TextField
                {...register("FIRST_NAME")}
                variant="outlined"
                label="ชื่อ"
                fullWidth
                error={!!errors.FIRST_NAME}
                helperText={errors.FIRST_NAME?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3}>
              <TextField
                {...register("LAST_NAME")}
                variant="outlined"
                label="นามสกุล"
                fullWidth
                error={!!errors.LAST_NAME}
                helperText={errors.LAST_NAME?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <TextField
                {...register("FAC_NAME")}
                variant="outlined"
                label="ชื่อคณะ"
                fullWidth
                error={!!errors.FAC_NAME}
                helperText={errors.FAC_NAME?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <TextField
                {...register("MAJOR_NAME")}
                variant="outlined"
                label="ชื่อสาขาวิชา"
                fullWidth
                error={!!errors.MAJOR_NAME}
                helperText={errors.MAJOR_NAME?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {/* <Grid item xs={12} sm={3} md={3} lg={3}>
              <TextField
                {...register("BIRTHDAY")}
                variant="outlined"
                label="วัน/เดือน/ปีเกิด"
                fullWidth
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                error={!!errors.BIRTHDAY}
                helperText={errors.BIRTHDAY?.message}
              />
            </Grid> */}

            <TextField
              {...register("FAC_CODE")}
              type="hidden"
              error={!!errors.FAC_CODE}
              helperText={errors.FAC_CODE?.message}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              {...register("ADMIN_ID")}
              type="hidden"
              error={!!errors.ADMIN_ID}
              helperText={errors.ADMIN_ID?.message}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              {...register("MAJOR_CODE")}
              type="hidden"
              error={!!errors.MAJOR_CODE}
              helperText={errors.MAJOR_CODE?.message}
              InputProps={{
                readOnly: true,
              }}
            />
            <Grid item xs={12}>
              <div>
                {isAddLoading ? (
                  <CircularProgress
                    size={26}
                    className={classes.loginLoader}
                    color="secondary"
                  />
                ) : (
                  <Controls.Button type="submit" text="บันทึกข้อมูล" />
                )}
              </div>
            </Grid>
          </Grid>
        </form>
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
