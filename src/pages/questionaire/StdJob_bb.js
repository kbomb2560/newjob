import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios from "axios";
//import StudentsListComp from "./StudentsList";
import { Col, Card, CardBody } from "reactstrap";

import Loading from "../../components/loading";
//
//dialogs//
import { Grid, CircularProgress, Input, TextField } from "@material-ui/core";
import { Typography } from "../../components/Wrappers";
import Controls from "../../components/Dialogs/controls/Controls";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
//import Grid from "@material-ui/core/Grid";
import PageTitle from "../../components/PageTitle/PageTitle";
import { makeStyles } from "@material-ui/core/styles";

import Select from "@material-ui/core/Select";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import * as Joi from "joi";

import Paper from "@material-ui/core/Paper";
import { listProvince } from "../../services/listEndPointService";
import { listMilitary } from "../../services/listEndPointService";
import { listOrdinate } from "../../services/listEndPointService";
import { listWorkstatus } from "../../services/listEndPointService";
import { listOccupType } from "../../services/listEndPointService";
import { exist } from "joi";
import Notification from "../../components/Dialogs/Notification";
import {
  green,
  orange,
  red,
  blue,
  pink,
  teal,
  purple,
} from "@material-ui/core/colors";
import Icon from "@material-ui/core/Icon";
//pro
//import DropDownProvinces from "./dropdownProvinces";

//*** */

import ListItem from "@material-ui/core/ListItem";

import ListItemIcon from "@material-ui/core/ListItemIcon";

import ListItemText from "@material-ui/core/ListItemText";

import FolderIcon from "@material-ui/icons/Folder";
import List from "@material-ui/core/List";

//*** */

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    //justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
    "& > .fa": {
      margin: theme.spacing(2),
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
  //สำหรับข้อมูลผู้สำเร็จการศึกษา
  TELEPHONEUPDATE: Joi.string().required(),
  //สำหรับฟอร์ม qn
  GENDER_ID_CHECK: Joi.string(),
  STD_ID: Joi.string(),
  REF_QN_PROVINCE_ID: Joi.string()
    .regex(/^[1-99]/)
    .required(),
  QN_MILITARY_STATUS: Joi.any().when("GENDER_ID_CHECK", {
    is: "1",
    then: Joi.string()
      .pattern(new RegExp("^[0-1]"))
      .required()
      .label("กรุณาเลือกสถานภาพทหาร"),
  }),
  QN_ORDINATE_STATUS: Joi.any().when("GENDER_ID_CHECK", {
    is: "1",
    then: Joi.string().pattern(new RegExp("^[1-5]")).required(),
  }),

  QN_WORK_STATUS: Joi.string()
    .regex(/^[1-7]/)
    .required()
    .label("กรุณาเลือกสถานะภาพการมีงานทำ"),

  QN_OCCUP_TYPE: Joi.string()
    .regex(/^[00-05]/)
    .required(),

  QN_OCCUP_TYPE_TXT: Joi.any().when("QN_OCCUP_TYPE", {
    is: "00",
    then: Joi.string().required(),
  }),
});

const GraduateList = (props) => {
  //ซ่อนแสดงประเภทงานที่ทำ
  const [isShow, setIsShow] = useState(false);
  //ซ่อนแสดงการเกณฑ์ทหาร
  const [isShowMILITARY, setIsShowMILITARY] = useState(false);
  //ซ่อนแสดงการบวช
  const [isShowORDINATE, setisShowORDINATE] = useState(false);
  //check QN
  const [refProvinceID, setrefProvinceID] = useState(""); //<--------------(Like this).

  //
  const [secondary, setSecondary] = useState(false);
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
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const retrieveTutorials = () => {
    var rememberMe = localStorage.getItem("dataAuth");
    //const user = rememberMe ? localStorage.getItem("dataStudent") : "";
    var studentsData = JSON.parse(rememberMe);
    //var studentsFullname = studentsData.LAST_NAME;
    //console.log(studentsData); //line std_code
    setIsLoading(true);
    const BASE_URL = "https://academic.pcru.ac.th/job-api/std-detail-end.php";
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
              ///ตรวจสอบข้อมูลการตอบแบบสอบถาม//

              //----------------------------

              //end Ordinate_status

              //----------------------------

              //

              //console.log("xx");
              //console.log("5555=", response.data.bunditSTD.STD_FNAME);
              setIsLoading(false);
              if (response.data.bunditSTD.GENDER_ID === "1") {
                setIsShowMILITARY(true);
                setisShowORDINATE(true);
              } else {
                setIsShowMILITARY(false);
                setisShowORDINATE(false);
              }
              setData(response.data.bunditSTD); //รับค่า result

              //-- set ค่าให้กับตัวแปร Joi --//
              //setValue("STD_CODE", response.data.bunditSTD.STD_ID);
              setValue("STD_ID", response.data.bunditSTD.STD_ID);
              setValue(
                "TELEPHONEUPDATE",
                response.data.bunditSTD.MOBILE_CONTACT
              );
              setValue("GENDER_ID_CHECK", response.data.bunditSTD.GENDER_ID);
              //-- จบส่วนของการ set ค่าให้กับตัวแปร Joi --//

              //console.log("xxx=", response.data.bunditSTD.STD_ID);
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

  ///
  useEffect(() => {
    loadCheckQN();
  }, []);
  /** */
  const loadCheckQN = () => {
    var rememberMeX = localStorage.getItem("dataAuth");
    //const user = rememberMe ? localStorage.getItem("dataStudent") : "";
    var studentsDataQN = JSON.parse(rememberMeX);
    const BASE_URL_QN =
      "https://academic.pcru.ac.th/job-api/qn-checkstd-end.php";
    try {
      //setError(false);
      //setIsLoading(true);
      axios
        .get(`${BASE_URL_QN}?std_code=${studentsDataQN}`)
        .then(function (res) {
          //console.log(response);
          //console.log(response.data);
          if (res.data.status === true && res.data.success === 1) {
            setTimeout(() => {
              ///ตรวจสอบข้อมูลการตอบแบบสอบถาม//
              //
              //console.log("xx");
              console.log("std=", res.data.QuestionaireSTD.STD_ID);
              setIsLoading(false);
              //-- set ค่าให้กับตัวแปร Joi --//

              setValue(
                "REF_QN_PROVINCE_ID",
                res.data.QuestionaireSTD.REF_QN_PROVINCE_ID
              ); /*
              setrefProvinceID(res.data.QuestionaireSTD.REF_QN_PROVINCE_ID);
              */
              /*
            setrefProvinceID(
              res.data.QuestionaireSTD.REF_QN_PROVINCE_ID
            );
            */
              console.log(
                "province =",
                res.data.QuestionaireSTD.REF_QN_PROVINCE_ID
              );
              //-- จบส่วนของการ set ค่าให้กับตัวแปร Joi --//
              console.log("มีข้อมูลนี้ตอบแบบสอบถามแล้ว");
              //console.log("xxx=", response.data.bunditSTD.STD_ID);
              //localStorage.setItem("StudentData", response.data.id.data);
              //setError(false);
              //setIsLoading(false);
              //history.push("/app/dashboard");
            }, 1000);
          } else {
            //username ผิด
            //password ผิด
            console.log("ไม่พบข้อมูล");
            //dispatch({ type: "LOGIN_FAILURE" });
            //setError(true);
            //setIsLoading(false);
          }
        })
        .catch(function (error) {
          setIsError(true);
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
  //====================================
  ///จังหวัด//
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([{ label: "Loading ...", value: "" }]);
  const [value, setValue] = useState();
  useEffect(() => {
    let unmounted = false;
    async function getCharacters() {
      const response = await axios.get(
        "https://academic.pcru.ac.th/job-api/provinces-end.php"
      );
      const body = await response.json();
      console.log("oo=>", body);
      if (!unmounted) {
        setItems(
          body.results.map(({ name }) => ({
            label: name,
            value: name,
          }))
        );
        setLoading(false);
      }
    }
    getCharacters();
    return () => {
      unmounted = true;
    };
  }, []);
  //====================================
  ///

  ///load province
  useEffect(() => {
    register({ name: "xProvince" });
  }, [register]);

  const fetchDataProvince = async () => {
    const res = await axios.get(
      "https://academic.pcru.ac.th/job-api/provinces-end.php"
    );
    return res.data;
  };

  const [province, setProvince] = useState([]);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    listProvince()
      .then((res) => {
        //setProvince(res.data);
        setProvince(res.data.provinceSTD);
        //console.log(res.data.provinceSTD);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //
  const resDataProvince = useQuery(
    ["dataProvince"],
    () => fetchDataProvince()
    /*
  {
    refetchOnWindowFocus: false,
    enabled: props.open,
  }
  */
  );
  console.log("xxx=>", resDataProvince);

  //end loadprovince

  ///load military_status
  const [military, setMilitary] = useState([]);
  useEffect(() => {
    loadDataMilitary();
  }, []);
  const loadDataMilitary = () => {
    listMilitary()
      .then((res) => {
        //setProvince(res.data);
        setMilitary(res.data.MilitarySTD);
        //console.log(res.data.provinceSTD);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //end military_status

  ///load Ordinate_status
  const [ordinate, setOrdinate] = useState([]);
  useEffect(() => {
    loadDataOrdinate();
  }, []);
  const loadDataOrdinate = () => {
    listOrdinate()
      .then((res) => {
        //setProvince(res.data);
        setOrdinate(res.data.OrdinateSTD);
        //console.log(res.data.provinceSTD);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //end Ordinate_status

  ///load Ordinate_status
  const [workstatus, setWorkstatus] = useState([]);
  useEffect(() => {
    loadDataWorkstatus();
  }, []);
  const loadDataWorkstatus = () => {
    listWorkstatus()
      .then((res) => {
        //setProvince(res.data);
        setWorkstatus(res.data.WorkstatusSTD);
        //console.log(res.data.provinceSTD);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //end Ordinate_status

  ///load Occuptype
  const [occuptype, setOccuptype] = useState([]);
  useEffect(() => {
    loadDataOccuptype();
  }, []);
  const loadDataOccuptype = () => {
    listOccupType()
      .then((res) => {
        //setProvince(res.data);
        setOccuptype(res.data.OccuptypeSTD);
        //console.log(res.data.provinceSTD);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //end Occuptype

  //

  //การเกณฑ์ทหาร สำหรับแสดงซ่อน textbox กรณีตอบอื่นๆฃ
  const handleChange_MILITARY = (e) => {
    e.preventDefault(); // prevent the default action
    if (e.target.value === "1") {
      setIsShowMILITARY(true); //แสดง TextBox
      setisShowORDINATE(true);
    } else {
      setValue("QN_MILITARY_STATUS", ""); //กำหนดค่าว่าง
      setIsShowMILITARY(false); //ซ่อน TextBox
      setisShowORDINATE(false);
    }
  };

  //ประเภทงานที่ทำ สำหรับแสดงซ่อน textbox กรณีตอบอื่นๆ
  const handleChange_QN_OCCUP_TYPE = (e) => {
    e.preventDefault(); // prevent the default action
    if (e.target.value === "00") {
      setIsShow(true); //แสดง TextBox
    } else {
      setValue("QN_OCCUP_TYPE_TXT", ""); //กำหนดค่าว่าง
      setIsShow(false); //ซ่อน TextBox
    }
  };

  ///console.log((Date.now() + 48 * 60 * 60 * 1000))
  const handleSubmitAdd = async (data) => {
    //e.preventDefault();
    //console.log(data);
    //setIsAddLoading(true);
    //reset();
    //return;
    try {
      console.log(data);
      //const result = await axios.post(`end-point`,values);
      const result = await axios.post(
        `https://academic.pcru.ac.th/job-api/qn-add-end.php`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (result) {
        console.log("success");
        setTimeout(() => {
          setNotify({
            isOpen: true,
            message: "บันทึกข้อมูลเรียบร้อยแล้ว",
            type: "success",
          });
          //setIsAddLoading(false);
          //แจ้งบันทึก
          //
          //props.onclose();
          //props.loadRecords();
        }, 1000);

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
      setNotify({
        isOpen: true,
        message: "การบันทึกข้อมูลผิดพลาดกรุณาติดต่อผู้ดูแลระบบ",
        type: "warning",
      });
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
              <Grid container spacing={1}>
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

              <Grid container spacing={1}>
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
                    <label className="control-label">
                      เบอร์โทรศัพท์ (แก้ไขได้){" "}
                    </label>
                    <small className={classes.typo}>
                      <TextField
                        {...register("TELEPHONEUPDATE")}
                        variant="outlined"
                        fullWidth
                        error={!!errors.TELEPHONEUPDATE}
                        helperText={errors.TELEPHONEUPDATE?.message}
                        InputProps={{
                          readOnly: false,
                        }}
                        size="small"
                      />
                    </small>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">E-mail </label>
                    <small className={classes.typo}>{data.EMAIL}</small>
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <div className="col-md-6">
                    <ListItem disableGutters={true}>
                      <ListItemIcon>
                        <Icon
                          className="fa fa-home"
                          style={{ color: green[500], fontSize: 30 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="ภูมิลำเนา (จังหวัด)"
                        secondary={secondary ? "Secondary text" : null}
                        style={{ color: green[500], fontSize: 30 }}
                      />
                    </ListItem>

                    {/* ///
ข้อมูล
/// */}

                    <small className={classes.typo}>
                      <FormControl fullWidth error>
                        <Select
                          disabled={loading}
                          value={value}
                          onChange={(e) => setValue(e.currentTarget.value)}
                        >
                          ...
                        </Select>
                        <Select
                          {...register("REF_QN_PROVINCE_ID")}
                          error={!!errors.REF_QN_PROVINCE_ID}
                          defaultValue={"0"}
                          fullWidth
                        >
                          <MenuItem value={"0"}>
                            <em>-เลือกจังหวัด-</em>
                          </MenuItem>
                          {province.map((item, index) => (
                            <MenuItem key={index} value={item.code}>
                              {item.name_th}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors.REF_QN_PROVINCE_ID?.message}
                        </FormHelperText>
                      </FormControl>
                    </small>
                  </div>
                </Grid>
                {isShowMILITARY ? (
                  <Grid item xs={12} sm={4}>
                    <div className="col-md-6">
                      <ListItem disableGutters={true}>
                        <ListItemIcon>
                          <Icon
                            className="fa fa-fighter-jet"
                            style={{ color: orange[500], fontSize: 30 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="สถานะการเกณฑ์ทหาร : (เฉพาะเพศชาย)"
                          secondary={secondary ? "Secondary text" : null}
                          style={{ color: orange[500], fontSize: 30 }}
                        />
                      </ListItem>

                      <small className={classes.typo}>
                        <FormControl fullWidth error>
                          <Select
                            {...register("QN_MILITARY_STATUS")}
                            error={!!errors.QN_MILITARY_STATUS}
                            defaultValue={"9"}
                            fullWidth
                          >
                            <MenuItem value={"9"}>
                              <em>-เลือกสถานะการเกณฑ์ทหารฯ-</em>
                            </MenuItem>
                            {military.map((item, index) => (
                              <MenuItem
                                key={index}
                                value={item.MILITARY_STATUS_ID}
                                style={{ whiteSpace: "normal" }}
                              >
                                {item.MILITARY_STATUS_ID}
                                {". "}
                                {item.MILITARY_STATUS_NAME}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {errors.QN_MILITARY_STATUS?.message}
                          </FormHelperText>
                        </FormControl>
                      </small>
                    </div>
                  </Grid>
                ) : null}
                {isShowORDINATE ? (
                  <Grid item xs={12} sm={4}>
                    <div className="col-md-6">
                      <ListItem disableGutters={true}>
                        <ListItemIcon>
                          <Icon
                            className="fa fa-eye"
                            style={{ color: orange[500], fontSize: 30 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="สถานะการเป็นนักบวชปัจจุบัน"
                          secondary={secondary ? "Secondary text" : null}
                          style={{ color: orange[500], fontSize: 30 }}
                        />
                      </ListItem>

                      <small className={classes.typo}>
                        <FormControl fullWidth error>
                          <Select
                            {...register("QN_ORDINATE_STATUS")}
                            error={!!errors.QN_ORDINATE_STATUS}
                            defaultValue={"0"}
                            fullWidth
                          >
                            <MenuItem value={"0"}>
                              <em>-เลือกสถานะการเป็นนักบวช-</em>
                            </MenuItem>
                            {ordinate.map((item, index) => (
                              <MenuItem
                                key={index}
                                value={item.ORDINATE_STATUS_ID}
                                style={{ whiteSpace: "normal" }}
                              >
                                {item.ORDINATE_STATUS_ID}
                                {". "}
                                {item.ORDINATE_STATUS_NAME}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {errors.QN_ORDINATE_STATUS?.message}
                          </FormHelperText>
                        </FormControl>
                      </small>
                    </div>
                  </Grid>
                ) : null}
                <Grid item xs={12} sm={4}>
                  <div className="col-md-6">
                    <ListItem disableGutters={true}>
                      <ListItemIcon>
                        <Icon
                          className="fa fa-child"
                          style={{ color: purple[500], fontSize: 30 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="สถานะภาพการทำงานปัจจุบัน"
                        secondary={secondary ? "Secondary text" : null}
                        style={{ color: purple[500], fontSize: 30 }}
                      />
                    </ListItem>

                    <small className={classes.typo}>
                      <FormControl fullWidth error>
                        <Select
                          {...register("QN_WORK_STATUS")}
                          error={!!errors.QN_WORK_STATUS}
                          defaultValue={"0"}
                          fullWidth
                        >
                          <MenuItem value={"0"}>
                            <em>-เลือกสถานะภาพการทำงานปัจจุบัน-</em>
                          </MenuItem>
                          {workstatus.map((item, index) => (
                            <MenuItem
                              key={index}
                              value={item.STATUS_ID}
                              style={{ whiteSpace: "normal" }}
                            >
                              {item.STATUS_ID}
                              {". "}
                              {item.WORKSTATUS_NAME_TH}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors.QN_WORK_STATUS?.message}
                        </FormHelperText>
                      </FormControl>
                    </small>
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={0}>
                <Grid item xs={12} sm={4}>
                  <Typography className={classes.typo} variant="h3" size="sm">
                    ตอนที่ 2 สำหรับผู้ที่ทำงานแล้ว
                  </Typography>
                  <div className="col-md-6">
                    <ListItem disableGutters={true}>
                      <ListItemIcon>
                        <Icon
                          className="fa fa-car"
                          style={{ color: orange[500], fontSize: 30 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="ประเภทงานที่ทำ"
                        secondary={secondary ? "Secondary text" : null}
                        style={{ color: orange[500], fontSize: 30 }}
                      />
                    </ListItem>

                    <small className={classes.typo}>
                      <FormControl fullWidth error>
                        <Select
                          {...register("QN_OCCUP_TYPE")}
                          error={!!errors.QN_OCCUP_TYPE}
                          defaultValue={"99"}
                          fullWidth
                          onChange={handleChange_QN_OCCUP_TYPE}
                        >
                          <MenuItem value={"99"}>
                            <em>-เลือกประเภทงานที่ทำ-</em>
                          </MenuItem>
                          {occuptype.map((item, index) => (
                            <MenuItem
                              key={index}
                              value={item.OCCUP_ID}
                              style={{ whiteSpace: "normal" }}
                            >
                              {item.OCCUP_ID}
                              {". "}
                              {item.OCCUP_NAME}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors.QN_OCCUP_TYPE?.message}
                        </FormHelperText>
                      </FormControl>
                    </small>
                    {isShow ? (
                      <small className={classes.typo}>
                        <TextField
                          {...register("QN_OCCUP_TYPE_TXT")}
                          variant="outlined"
                          label="อื่นๆ ระบุ"
                          fullWidth
                          error={!!errors.QN_OCCUP_TYPE_TXT}
                          helperText={errors.QN_OCCUP_TYPE_TXT?.message}
                          InputProps={{
                            readOnly: false,
                          }}
                          size="small"
                        />
                      </small>
                    ) : null}
                  </div>
                </Grid>
              </Grid>

              <TextField
                {...register("GENDER_ID_CHECK")}
                type="hidden"
                error={!!errors.GENDER_ID_CHECK}
                helperText={errors.GENDER_ID_CHECK?.message}
                InputProps={{
                  readOnly: true,
                }}
                onChange={handleChange_MILITARY}
              />
              <TextField
                {...register("STD_ID")}
                type="hidden"
                error={!!errors.STD_ID}
                helperText={errors.STD_ID?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Grid container spacing={0}>
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
      <PageTitle title="แบบสอบถามภาวะการมีงานทำของบัณฑิต ปีการศึกษา 2565 (บัณฑิตที่จบปีการศึกษา 2564)" />
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
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};
export default GraduateList;
