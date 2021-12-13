import React, { useState, useEffect } from "react";
import axios from "axios";
//import StudentsListComp from "./StudentsList";
import { Col, Card, CardBody } from "reactstrap";

import Loading from "../../components/loading";
//
//dialogs//
import { Grid, CircularProgress, Input, TextField } from "@material-ui/core";
import { Typography } from "../../components/Wrappers";
import Controls from "../../components/Dialogs/controls/Controls";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
//import Grid from "@material-ui/core/Grid";
import PageTitle from "../../components/PageTitle/PageTitle";
import { makeStyles } from "@material-ui/core/styles";

import Select from "@material-ui/core/Select";

import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import * as Joi from "joi";

import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    //justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    padding: theme.spacing(1),
    //textAlign: "center",
    color: theme.palette.text.secondary,
  },
  table: {
    //background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    //boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    //color: "white",
    //height: 38,
    padding: "5px 5px 5px 5px",
  },
  typo: {
    //color: theme.palette.text.hint,
    //color: theme.palette.text.primary,
    color: "#FE6B8B",
  },
  typename: {
    //color: theme.palette.text.hint,
    //color: theme.palette.text.primary,
    color: "#8C2BFF",
  },
}));

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

const GraduateList = (props) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
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

  const retrieveTutorials = () => {
    var rememberMe = localStorage.getItem("dataAuth");
    //const user = rememberMe ? localStorage.getItem("dataStudent") : "";
    var studentsData = JSON.parse(rememberMe);
    //var studentsFullname = studentsData.LAST_NAME;
    console.log(studentsData); //line std_code
    setIsLoading(true);
    const BASE_URL = "http://academic.pcru.ac.th/job-api/std-detail-end.php";
    try {
      //setError(false);
      //setIsLoading(true);
      axios
        .get(`${BASE_URL}?std_code=${studentsData}`)
        .then(function (response) {
          //console.log(response);
          //console.log(response.data);
          if (response.data.status === true && response.data.success === 1) {
            setTimeout(() => {
              console.log("xx");
              console.log("5555=", response.data.bunditSTD.STD_FNAME);
              setIsLoading(false);
              setData(response.data.bunditSTD); //รับค่า result
              //-- set ค่าให้กับตัวแปร Joi --//
              setValue("STD_CODE", response.data.bunditSTD.STD_ID);

              //-- จบส่วนของการ set ค่าให้กับตัวแปร Joi --//

              console.log("xxx=", response.data.bunditSTD.STD_ID);
              //localStorage.setItem("StudentData", response.data.id.data);
              //setError(false);
              //setIsLoading(false);
              //history.push("/app/dashboard");
            }, 1000);
          } else {
            //username ผิด
            //password ผิด
            console.log("wrong username");
            //dispatch({ type: "LOGIN_FAILURE" });
            //setError(true);
            //setIsLoading(false);
            setIsError(true);
            setIsLoading(false);
          }
        })
        .catch(function (error) {
          setIsError(true);
          setIsLoading(false);
          if (error.response) {
            //console.log(error.response.headers);
          } else if (error.request) {
            //setError(true);
            //console.log(error.request);
          } else {
            //setError(true);
            //console.log("Error", error.message);
          }
        });
    } catch (error) {
      console.log("err");
    }
  };
  useEffect(retrieveTutorials, []);

  ///console.log((Date.now() + 48 * 60 * 60 * 1000))
  const handleSubmitAdd = async (data) => {
    //e.preventDefault();
    console.log(data);
    //setIsAddLoading(true);
    try {
      console.log(data);
      //const result = await axios.post(`end-point`,values);
      const result = await axios.post(
        `http://academic.pcru.ac.th/job-dev/job-add.php`,
        data
      );
      if (result) {
        console.log("success");
        setTimeout(() => {
          //setIsAddLoading(false);
          //แจ้งบันทึก

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
      //setIsAddLoading(false);
      //loading false
      //error true
      //errorMsg "มีบางอย่างผิดพลาด"
    }
  };

  let content = <Loading msg=" กำลังโหลด..." />;

  if (!isLoading) {
    if (isError) {
      content = "error";
    } else {
      content = (
        <div>
          <form onSubmit={handleSubmit(handleSubmitAdd)}>
            <div className={classes.root}>
              <Typography className={classes.typo} variant="h3" size="sm">
                ตอนที่ 1 ข้อมูลทั่วไป
              </Typography>
              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={6}>
                  <div className="col-md-12">
                    <label className="control-label">1. สถานศึกษา : </label>
                    <small className={classes.typo}>
                      {"มหาวิทยาลัยราชภัฏเพชรบูรณ์"}
                    </small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">2. ชื่อ-สกุล : </label>
                    <small className={classes.typename}>
                      {data.PREFIX_NAME +
                        "" +
                        data.STD_FNAME +
                        " " +
                        data.STD_LNAME}
                    </small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">
                      3. เลขประจำตัวประชาชน :{" "}
                    </label>
                    <small className={classes.typo}>{data.CITIZEN_ID}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">
                      4. เลขประจำตัวนักศึกษา :{" "}
                    </label>
                    <small className={classes.typo}>{data.STD_ID}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">
                      5. วัน/เดือน/ปี เกิด :{" "}
                    </label>
                    <small className={classes.typo}>{data.BIRTHDAY}</small>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className="col-md-12">
                    <label className="control-label">6. สาขา : </label>
                    <small className={classes.typo}>
                      {data.UNI_PROGRAM_NAME}
                    </small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">7. คณะ : </label>
                    <small className={classes.typo}>{data.FAC_NAME}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">
                      8. สำเร็จการศึกษาหลักสูตร :{" "}
                    </label>
                    <small className={classes.typo}>{data.CURR_NAME}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">
                      9. คะแนนเฉลี่ยตลอดหลักสูตร (GPA) :{" "}
                    </label>
                    <small className={classes.typo}>{data.GPA}</small>
                  </div>
                </Grid>
              </Grid>

              <Typography className={classes.typo} variant="h5" size="sm">
                ที่อยู่ปัจจุบัน
              </Typography>

              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={4}>
                  <div className="col-md-12">
                    <label className="control-label">เลขที่ </label>
                    <small className={classes.typo}>{data.HOMEADD}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">หมู่ </label>
                    <small className={classes.typo}>{data.MOO}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">ซอย </label>
                    <small className={classes.typo}>{data.SOI}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">ถนน </label>
                    <small className={classes.typo}>{data.STREET}</small>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className="col-md-12">
                    <label className="control-label">ตำบล </label>
                    <small className={classes.typo}>{data.TUMBOL}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">อำเภอ </label>
                    <small className={classes.typo}>{data.AMPHUR}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">จังหวัด </label>
                    <small className={classes.typo}>{data.PROVINCE_NAME}</small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">รหัสไปรษณีย์ </label>
                    <small className={classes.typo}>{data.ZIPCODE}</small>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className="col-md-12">
                    <label className="control-label">โทรศัพท์(แก้ไขได้) </label>
                    <small className={classes.typo}>
                      {data.MOBILE_CONTACT}
                    </small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">E-mail </label>
                    <small className={classes.typo}>{data.EMAIL}</small>
                  </div>
                </Grid>
              </Grid>

              <Typography className={classes.typo} variant="h5" size="sm">
                ที่อยู่ปัจจุบัน
              </Typography>

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
            </div>
          </form>
        </div>
      );
    }
  }

  return (
    <>
      <PageTitle title="แบบสอบถามภาวะการมีงานทำของบัณฑิต ปีการศึกษา 2564 (บัณฑิตที่จบปีการศึกษา 2563)" />
      <Paper className={classes.paper}>
        <Col xl="12">
          <Card>
            <CardBody>
              <div className="blog-single">
                <div className="blog-box blog-details">{content}</div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Paper>
    </>
  );
};
export default GraduateList;
