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
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
//import Grid from "@material-ui/core/Grid";
import PageTitle from "../../components/PageTitle/PageTitle";
import { makeStyles } from "@material-ui/core/styles";

import SSelect from "react-select";

//import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Select from "@material-ui/core/Select";

import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import * as Joi from "joi";

import Paper from "@material-ui/core/Paper";
import { listProvince } from "../../services/listEndPointService";
import { listMilitary } from "../../services/listEndPointService";
import { listOrdinate } from "../../services/listEndPointService";
import { listWorkstatus } from "../../services/listEndPointService";
import { listOccupType } from "../../services/listEndPointService";
//import { exist } from 'joi';
import Notification from "../../components/Dialogs/Notification";

import SelectProvince from "../../components/Forms/Selects";
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

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    //borderBottom: "2px dotted green",
    color: state.isSelected ? "yellow" : "black",
    backgroundColor: state.isSelected ? "green" : "white",
    whiteSpace: "normal",
    fontSize: 16,
    display: "flex",
  }),
  control: (provided) => ({
    ...provided,
    fontSize: 16,
    padding: 9,

    //marginTop: "5%",
  }),
};

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
const WORK_CHECK_STATUS = Joi.any()
  .when("QN_WORK_STATUS", {
    is: "1",
    then: Joi.string()
      .regex(/^[00-05]/)
      .required(),
  })
  .when("QN_WORK_STATUS", {
    is: "2",
    then: Joi.string()
      .regex(/^[00-05]/)
      .required(),
  })
  .when("QN_WORK_STATUS", {
    is: "5",
    then: Joi.string()
      .regex(/^[00-05]/)
      .required(),
  })
  .when("QN_WORK_STATUS", {
    is: "6",
    then: Joi.string()
      .regex(/^[00-05]/)
      .required(),
  })
  .when("QN_WORK_STATUS", {
    is: "7",
    then: Joi.string()
      .regex(/^[00-05]/)
      .required(),
  });
const WORK_CHECK_STATUS_STRING = Joi.any()
  .when("QN_WORK_STATUS", {
    is: "1",
    then: Joi.string().required(),
  })
  .when("QN_WORK_STATUS", {
    is: "2",
    then: Joi.string().required(),
  })
  .when("QN_WORK_STATUS", {
    is: "5",
    then: Joi.string().required(),
  })
  .when("QN_WORK_STATUS", {
    is: "6",
    then: Joi.string().required(),
  })
  .when("QN_WORK_STATUS", {
    is: "7",
    then: Joi.string().required(),
  });
const dataStudents = Joi.object({
  //สำหรับข้อมูลผู้สำเร็จการศึกษา
  TELEPHONEUPDATE: Joi.string().required(),
  //สำหรับฟอร์ม qn
  GENDER_ID: Joi.string(),
  CITIZEN_ID: Joi.string(),
  UNIV_ID: Joi.string(),
  STD_ID: Joi.string(),
  REF_QN_PROVINCE_ID: Joi.string()
    .regex(/^[1-99]/)
    .required(),
  QN_MILITARY_STATUS: Joi.any().when("GENDER_ID", {
    is: "1",
    then: Joi.string()
      .pattern(new RegExp("^[0-1]"))
      .required()
      .label("กรุณาเลือกสถานภาพทหาร"),
  }),
  QN_ORDINATE_STATUS: Joi.any().when("GENDER_ID", {
    is: "1",
    then: Joi.string().pattern(new RegExp("^[1-5]")).required(),
  }),

  QN_WORK_STATUS: Joi.string()
    .regex(/^[1-7]/)
    .required()
    .label("กรุณาเลือกสถานะภาพการมีงานทำ"),

  //======--ส่วนที่ 1 --======//
  //ประเภทงานที่ทำ
  QN_OCCUP_TYPE: WORK_CHECK_STATUS,
  QN_OCCUP_TYPE_TXT: Joi.any().when("QN_OCCUP_TYPE", {
    is: "00",
    then: Joi.string().required(),
  }),
  //========จบประเภทงานที่ทำ==========//
  //ความสามารถพิเศษ
  QN_TALENT: WORK_CHECK_STATUS,
  QN_TALENT_TXT: Joi.any().when("QN_TALENT", {
    is: "00",
    then: Joi.string().required(),
  }),
  //========ความสามารถพิเศษ==========//
  //========จบประเภทงานที่ทำ==========//
  //ตำแหน่งงาน

  //จังหวัดสถานที่ทำงาน
  JOB_QN_PROVINCE_ID: WORK_CHECK_STATUS_STRING,
  JOB_QN_DISTRICT_ID: WORK_CHECK_STATUS_STRING,
  JOB_QN_SUBDISTRICT_ID: WORK_CHECK_STATUS_STRING,

  //
  //QN_POS_ID: WORK_CHECK_STATUS,
  //========ตำแหน่งงาน==========//
  //========จบประเภทงานที่ทำ==========//
  //ตำแหน่งงาน

  QN_POS_ID: WORK_CHECK_STATUS_STRING,
  //========ตำแหน่งงาน==========//
  //========ประเทศที่ทำงาน==========//
  QN_WORK_NATION: WORK_CHECK_STATUS_STRING,
  //========ตำแหน่งงาน==========//
});

const GraduateList = (props) => {
  //จังหวัด
  const [provid, setProvid] = useState("0");
  //เกณฑ์ทหาร
  const [militaryid, setMilitaryID] = useState("9");
  //นักบวช
  const [ordinateid, setOrdinateID] = useState("0");
  //สถานภาพการทำงานปัจจุบัน
  const [jobstatus, setJobStatus] = useState("0");
  //ประเภทงานที่ทำ
  const [occupid, setOccupID] = useState("99");
  const [occupidTxT, setOccupIDTxT] = useState("");
  //ความสามารถพิเศษ
  const [talentid, setTalentID] = useState("99");
  const [talentTxT, setTalentIDTxT] = useState("");
  //ตำแหน่งงาน
  const [positionid, setPositionID] = useState("");
  //ประเทศที่ทำงาน
  //const [positionid, setPositionID] = useState("");
  const [worknationid, setWorkNationID] = useState("TH");
  //const [value, setVal] = useState('');

  //จังหวัด-job
  const [jobprovid, setJobProvid] = useState("0");
  //อำเภอ-job
  const [jobdistid, setJobDistid] = useState("0");
  //ตำบล-job
  const [jobsubdistid, setJobSubDistid] = useState("0");
  //
  ///แสดงซ่อน การมีงานทำข้อ 1-2-5-6-7
  const [sShowJob12567, setIsShowJob12567] = useState(false);
  ///แสดงซ่อน การมีงานทำข้อ 3-4
  const [sShowJob34, setIsShowJob34] = useState(false);
  //ซ่อนแสดงประเภทงานที่ทำ
  const [isShow, setIsShow] = useState(false);
  //ซ่อนแสดงความสามารถพิเศษ
  const [isShowTalent, setIsShowTalent] = useState(false);
  //ซ่อนแสดงการเกณฑ์ทหาร
  const [isShowMILITARY, setIsShowMILITARY] = useState(false);
  //ซ่อนแสดงการบวช
  const [isShowORDINATE, setisShowORDINATE] = useState(false);
  //check QN
  const [refProvinceID, setrefProvinceID] = useState(""); //<--------------(Like this).

  const [genderCk, setGenderCk] = useState("");
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
    methods,
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
              ///ตรวจสอบข้อมูลการตอบแบบสอบถาม//

              //----------------------------

              //end Ordinate_status

              //----------------------------
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
              setGenderCk(response.data.bunditSTD.GENDER_ID);
              //setValue("STD_CODE", response.data.bunditSTD.STD_ID);
              setValue("STD_ID", response.data.bunditSTD.STD_ID);
              setValue("CITIZEN_ID", response.data.bunditSTD.CITIZEN_ID);
              setValue("UNIV_ID", response.data.bunditSTD.UNIV_ID);
              setValue("GENDER_ID", response.data.bunditSTD.GENDER_ID);
              setValue(
                "TELEPHONEUPDATE",
                response.data.bunditSTD.MOBILE_CONTACT
              );

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
  //regis

  const [selectEditPosition, setSelectEditPosition] = useState({
    selectedOption: [],
  });
  /*
  useEffect(() => {
    register({ name: "REF_QN_PROVINCE_ID" });
  }, [register]);
  */
  /**/
  const onChangeSelectPositionEditHandler = (e) => {
    setValue("QN_POS_ID", e === null ? null : e.value.toString());
    setSelectEditPosition({ e });
  };

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
      "http://academic.pcru.ac.th/job-api/qn-checkstd-end.php";
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
              //console.log("std=", res.data.QuestionaireSTD.STD_ID);
              setIsLoading(false);
              //-- set ค่าให้กับตัวแปร Joi --//
              //setVal(res.data.QuestionaireSTD.REF_QN_PROVINCE_ID);

              setProvid(res.data.QuestionaireSTD.REF_QN_PROVINCE_ID);
              setPositionID(res.data.QuestionaireSTD.QN_POS_ID);
              /****ทดสอบรับค่า */
              //QN_POS_ID
              axios
                .get(`http://academic.pcru.ac.th/job-api/qn-position-end.php`)
                .then(function (presponse) {
                  const pbody = presponse.data.position_careerSTD;

                  //console.log("xxxx> ", pbody);
                  //console.log("pos_id> ", res.data.QuestionaireSTD.QN_POS_ID);

                  const positionOBJ = pbody.find(
                    (prov) => prov.POS_ID == res.data.QuestionaireSTD.QN_POS_ID
                  );
                  //console.log("xxxx", positionOBJ.POS_ID);
                  if (res.data.QuestionaireSTD.QN_POS_ID) {
                    setSelectEditPosition({
                      selectedOption: [
                        {
                          value: positionOBJ.POS_ID,
                          label: positionOBJ.POS_NAME,
                        },
                      ],
                    });
                  } else {
                    setSelectEditPosition({
                      selectedOption: [],
                    });
                  }
                });

              ///

              //****จบการรรับค่า */
              /* 
              setSelectEditPosition({
                selectedOption: [
                  {
                    value: res.data.QuestionaireSTD.REF_QN_PROVINCE_ID,
                    label: res.data.QuestionaireSTD.REF_QN_PROVINCE_ID,
                  },
                ],
              });
               */
              setMilitaryID(res.data.QuestionaireSTD.QN_MILITARY_STATUS);
              setOrdinateID(res.data.QuestionaireSTD.QN_ORDINATE_STATUS);

              //ประเภทงานที่ทำ
              setOccupID(res.data.QuestionaireSTD.QN_OCCUP_TYPE);
              setOccupIDTxT(res.data.QuestionaireSTD.QN_OCCUP_TYPE_TXT);
              if (res.data.QuestionaireSTD.QN_OCCUP_TYPE === "00") {
                setIsShow(true); //แสดง TextBox
              } else {
                setIsShow(false); //ซ่อน TextBox
              }

              //ประเภทความสามารถพิเศษ
              setTalentID(res.data.QuestionaireSTD.QN_TALENT);
              setTalentIDTxT(res.data.QuestionaireSTD.QN_TALENT_TXT);
              if (res.data.QuestionaireSTD.QN_TALENT === "00") {
                setIsShowTalent(true); //แสดง TextBox
              } else {
                setIsShowTalent(false); //ซ่อน TextBox
              }
              //สถานะการมีงานทำ
              setJobStatus(res.data.QuestionaireSTD.QN_WORK_STATUS);
              if (
                res.data.QuestionaireSTD.QN_WORK_STATUS === "1" ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === "2" ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === "5" ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === "6" ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === "7"
              ) {
                setIsShowJob12567(true); //แสดง TextBox
                setIsShowJob34(false);
              } else {
                setIsShowJob12567(false); //ซ่อน TextBox
                setIsShowJob34(true);
              }

              setWorkNationID(res.data.QuestionaireSTD.QN_WORK_NATION);
              setValue("GENDER_ID", res.data.QuestionaireSTD.GENDER_ID);
              setValue(
                "QN_MILITARY_STATUS",
                res.data.QuestionaireSTD.QN_MILITARY_STATUS
              );
              setValue(
                "QN_ORDINATE_STATUS",
                res.data.QuestionaireSTD.QN_ORDINATE_STATUS
              );
              setValue(
                "QN_WORK_STATUS",
                res.data.QuestionaireSTD.QN_WORK_STATUS
              );
              setValue(
                "REF_QN_PROVINCE_ID",
                res.data.QuestionaireSTD.REF_QN_PROVINCE_ID
              );
              setValue("QN_OCCUP_TYPE", res.data.QuestionaireSTD.QN_OCCUP_TYPE);
              setValue(
                "QN_OCCUP_TYPE_TXT",
                res.data.QuestionaireSTD.QN_OCCUP_TYPE_TXT
              );
              setValue("QN_TALENT", res.data.QuestionaireSTD.QN_TALENT);
              setValue("QN_TALENT_TXT", res.data.QuestionaireSTD.QN_TALENT_TXT);

              setValue("QN_POS_ID", res.data.QuestionaireSTD.QN_POS_ID);
              setValue(
                "QN_WORK_NATION",
                res.data.QuestionaireSTD.QN_WORK_NATION
              );
              /*
              setrefProvinceID(res.data.QuestionaireSTD.REF_QN_PROVINCE_ID);
              */
              /*
            setrefProvinceID(
              res.data.QuestionaireSTD.REF_QN_PROVINCE_ID
            );
            */
              /*
              console.log('GENDER_ID =', res.data.QuestionaireSTD.GENDER_ID);

              console.log(
                'province =',
                res.data.QuestionaireSTD.REF_QN_PROVINCE_ID
              );
              */
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
  //====================================
  ///จังหวัด//
  //const [isLoading, setIsLoading] = useState(false);
  //const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([{ label: "Loading ...", value: "" }]);
  useEffect(() => {
    let unmounted = false;
    async function getProvinceID() {
      const response = await axios.get(
        "http://academic.pcru.ac.th/job-api/provinces-end.php"
      );
      const body = await response.data.provinceSTD;
      //console.log("ccc> ", body);
      if (!unmounted) {
        setItems(
          body.map(({ code, name_th }) => ({
            label: name_th,
            value: code,
          }))
        );
        setLoading(false);
      }
    }
    getProvinceID();
    return () => {
      unmounted = true;
    };
  }, []);
  //====================================

  //====================================
  ///ทหาร//
  const [loadingmili, setLoadingMili] = useState(true);
  const [itemsMili, setItemsMili] = useState([
    { label: "Loading ...", value: "" },
  ]);

  useEffect(() => {
    let unmountedMili = false;
    async function MilitaryID() {
      const response = await axios.get(
        "http://academic.pcru.ac.th/job-api/military-status-end.php"
      );
      const body = await response.data.MilitarySTD;
      //console.log("ccc> ", body);
      if (!unmountedMili) {
        setItemsMili(
          body.map(({ MILITARY_STATUS_ID, MILITARY_STATUS_NAME }) => ({
            label: MILITARY_STATUS_NAME,
            value: MILITARY_STATUS_ID,
          }))
        );
        setLoadingMili(false);
      }
    }
    MilitaryID();
    return () => {
      unmountedMili = true;
    };
  }, []);
  //====================================
  //====================================
  ///นักบวช//
  const [loadingordi, setLoadingOrdi] = useState(true);
  const [itemsOrdi, setItemsOrdi] = useState([
    { label: "Loading ...", value: "" },
  ]);

  useEffect(() => {
    let unmountedOrdi = false;
    async function OrdinateID() {
      const response = await axios.get(
        "http://academic.pcru.ac.th/job-api/ordinate-status-end.php"
      );
      const body = await response.data.OrdinateSTD;
      //console.log("ccc> ", body);
      if (!unmountedOrdi) {
        setItemsOrdi(
          body.map(({ ORDINATE_STATUS_ID, ORDINATE_STATUS_NAME }) => ({
            label: ORDINATE_STATUS_NAME,
            value: ORDINATE_STATUS_ID,
          }))
        );
        setLoadingOrdi(false);
      }
    }
    OrdinateID();
    return () => {
      unmountedOrdi = true;
    };
  }, []);
  //====================================
  //====================================
  ///สถานะการมีงานทำ//
  const [loadingJob, setLoadingJob] = useState(true);
  const [itemsJob, setItemsJob] = useState([
    { label: "Loading ...", value: "" },
  ]);

  useEffect(() => {
    let unmountedJob = false;
    async function JobStatusID() {
      const response = await axios.get(
        "http://academic.pcru.ac.th/job-api/work-status-end.php"
      );
      const body = await response.data.WorkstatusSTD;
      //console.log("ccc> ", body);
      if (!unmountedJob) {
        setItemsJob(
          body.map(({ STATUS_ID, WORKSTATUS_NAME_TH }) => ({
            label: WORKSTATUS_NAME_TH,
            value: STATUS_ID,
          }))
        );
        setLoadingJob(false);
      }
    }
    JobStatusID();
    return () => {
      unmountedJob = true;
    };
  }, []);
  //====================================
  //====================================
  ///ประเภทงานที่ทำ//
  const [loadingOcc, setLoadingOcc] = useState(true);
  const [itemsOcc, setItemsOcc] = useState([
    { label: "Loading ...", value: "" },
  ]);

  useEffect(() => {
    let unmountedOcc = false;
    async function OccupID() {
      const response = await axios.get(
        "http://academic.pcru.ac.th/job-api/occup-type-end.php"
      );
      const body = await response.data.OccuptypeSTD;
      //console.log("ccc> ", body);
      if (!unmountedOcc) {
        setItemsOcc(
          body.map(({ OCCUP_ID, OCCUP_NAME }) => ({
            label: OCCUP_NAME,
            value: OCCUP_ID,
          }))
        );
        setLoadingOcc(false);
      }
    }
    OccupID();
    return () => {
      unmountedOcc = true;
    };
  }, []);
  //====================================
  //====================================
  ///ความสามารถพิเศษ//
  const [loadingTalent, setLoadingTalent] = useState(true);
  const [itemsTalent, setItemsTalent] = useState([
    { label: "Loading ...", value: "" },
  ]);

  useEffect(() => {
    let unmountedTalent = false;
    async function TalentID() {
      const response = await axios.get(
        "http://academic.pcru.ac.th/job-api/qn-talent-end.php"
      );
      const body = await response.data.TalentSTD;
      //console.log("ccc> ", body);
      if (!unmountedTalent) {
        setItemsTalent(
          body.map(({ TALENT_ID, QN_TALENT_NAME }) => ({
            label: QN_TALENT_NAME,
            value: TALENT_ID,
          }))
        );
        setLoadingTalent(false);
      }
    }
    TalentID();
    return () => {
      unmountedTalent = true;
    };
  }, []);
  //====================================
  //====================================
  ///ความตำแหน่งงาน//
  const [loadingPositionCr, setLoadingPositionCr] = useState(true);
  const [itemsPositionCr, setItemsPositionCr] = useState([
    { label: "Loading ...", value: "" },
  ]);

  useEffect(() => {
    let unmountedPositionCr = false;
    async function PositionCrID() {
      const response = await axios.get(
        "http://academic.pcru.ac.th/job-api/qn-position-end.php"
      );
      const body = await response.data.position_careerSTD;
      //console.log("ccc> ", body);
      if (!unmountedPositionCr) {
        setItemsPositionCr(
          body.map(({ POS_ID, POS_NAME }) => ({
            label: POS_NAME,
            value: POS_ID,
          }))
        );
        setLoadingPositionCr(false);
      }
    }
    PositionCrID();
    return () => {
      unmountedPositionCr = true;
    };
  }, []);
  //====================================
  //====================================
  ///QN_WORK_NATION ประเทศที่ทำงาน//
  const [loadingWorkNation, setLoadingWorkNation] = useState(true);
  const [itemsWorkNation, setItemsWorkNation] = useState([
    { label: "Loading ...", value: "" },
  ]);

  useEffect(() => {
    let unmountedWorkNation = false;
    async function WorkNationID() {
      const response = await axios.get(
        "http://academic.pcru.ac.th/job-api/qn-ref-nation-end.php"
      );
      const body = await response.data.worknationSTD;
      //console.log("ccc> ", body);
      if (!unmountedWorkNation) {
        setItemsWorkNation(
          body.map(({ NATION_ID, NATION_NAME_ENG }) => ({
            label: NATION_NAME_ENG,
            value: NATION_ID,
          }))
        );
        setLoadingWorkNation(false);
      }
    }
    WorkNationID();
    return () => {
      unmountedWorkNation = true;
    };
  }, []);
  //====================================

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

  //====================================
  ///จังหวัด//
  //const [isLoading, setIsLoading] = useState(false);
  //const [isError, setIsError] = useState(false);
  const [loadingJobsProvince, setLoadingJobsProvince] = useState(true);
  const [itemsJobsProvince, setItemsJobsProvince] = useState([
    { label: "Loading ...", value: "" },
  ]);
  useEffect(() => {
    let unmountedJobsProvince = false;
    async function getJobProvinceID() {
      const response = await axios.get(
        "http://academic.pcru.ac.th/job-api/provinces-end.php"
      );
      const body = await response.data.provinceSTD;
      //console.log("ccc> ", body);
      if (!unmountedJobsProvince) {
        setItemsJobsProvince(
          body.map(({ code, name_th }) => ({
            label: name_th,
            value: code,
          }))
        );
        setLoadingJobsProvince(false);
      }
    }
    getJobProvinceID();
    return () => {
      unmountedJobsProvince = true;
    };
  }, []);
  //====================================+
  //console.log("data> ", jobprovid);

  const [loadingJobsDistrict, setLoadingJobsDistrict] = useState(true);
  const [itemsJobsDistrict, setItemsJobsDistrict] = useState([
    { label: "Loading ...", value: "" },
  ]);
  useEffect(() => {
    let unmountedJobsDistrict = false;
    async function getJobDistrictID() {
      const response = await axios.get(
        `http://academic.pcru.ac.th/job-api/district-end.php?provincecode=${jobprovid}`
      );
      const body = await response.data.districtSTD;
      //console.log("ccc> ", body);
      if (jobprovid != "0") {
        if (!unmountedJobsDistrict) {
          setItemsJobsDistrict(
            body.map(({ DISTRICT_ID, DISTRICT_NAME_TH }) => ({
              label: DISTRICT_NAME_TH,
              value: DISTRICT_ID,
            }))
          );
          setLoadingJobsDistrict(false);
        }
      }
    }
    getJobDistrictID();
    return () => {
      unmountedJobsDistrict = true;
    };
  }, [jobprovid]);
  //====================================

  //====================================+
  //console.log("data> ", jobprovid);

  const [loadingJobSubDistrict, setLoadingJobSubDistrict] = useState(true);
  const [itemsJobSubDistrict, setItemsJobSubDistrict] = useState([
    { label: "Loading ...", value: "" },
  ]);
  useEffect(() => {
    let unmountedJobSubDistrict = false;
    async function getJobSubDistrictID() {
      const response = await axios.get(
        `http://academic.pcru.ac.th/job-api/sub-district-end.php?districtcode=${jobdistid}`
      );
      const body = await response.data.subdistrictSTD;
      //console.log("ccc> ", body);
      if (jobdistid != "0") {
        if (!unmountedJobSubDistrict) {
          setItemsJobSubDistrict(
            body.map(({ SUB_DISTRICT_ID, SUB_DISTRICT_NAME_TH }) => ({
              label: SUB_DISTRICT_NAME_TH,
              value: SUB_DISTRICT_ID,
            }))
          );
          setLoadingJobSubDistrict(false);
        }
      }
    }
    getJobSubDistrictID();
    return () => {
      unmountedJobSubDistrict = true;
    };
  }, [jobdistid]);
  //====================================

  ///console.log((Date.now() + 48 * 60 * 60 * 1000))
  const handleSubmitAdd = async (data) => {
    //e.preventDefault();
    console.log(data);
    //setIsAddLoading(true);
    //reset();
    //return;
    try {
      console.log(data);
      //const result = await axios.post(`end-point`,values);
      const result = await axios.post(
        `http://academic.pcru.ac.th/job-api/qn-add-end.php`,
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

  //setProvinceID
  const OnchangeSelectProvince = (e) => {
    setValue("REF_QN_PROVINCE_ID", e.target.value);
    setProvid(e.target.value);
  };
  //setMilitaryID
  const OnchangeSelectMilitaryID = (e) => {
    setValue("QN_MILITARY_STATUS", e.target.value);
    setMilitaryID(e.target.value);
  };
  //setOrdinateID
  const OnchangeSelectOrdinateID = (e) => {
    setValue("QN_ORDINATE_STATUS", e.target.value);
    setOrdinateID(e.target.value);
  };
  //setJobID
  const OnchangeSelectJobStatusID = (e) => {
    e.preventDefault(); // prevent the default action
    setValue("QN_WORK_STATUS", e.target.value);
    setJobStatus(e.target.value);
    if (
      e.target.value === "1" ||
      e.target.value === "2" ||
      e.target.value === "5" ||
      e.target.value === "6" ||
      e.target.value === "7"
    ) {
      setIsShowJob12567(true); //แสดง TextBox
      setIsShowJob34(false);
      //setValue("QN_OCCUP_TYPE", e.target.value);
      setOccupID(e.target.value);
      setTalentID(e.target.value);
      //setPositionID(e.target.value);
      //setPositionID({ e });
      setWorkNationID(e.target.value);
    } else {
      setValue("QN_OCCUP_TYPE", ""); //กำหนดค่าว่าง
      setValue("QN_OCCUP_TYPE_TXT", ""); //กำหนดค่าว่าง
      setValue("QN_TALENT", ""); //กำหนดค่าว่าง
      setValue("QN_TALENT_TXT", ""); //กำหนดค่าว่าง
      setValue("QN_POS_ID", ""); //กำหนดค่าว่าง
      setSelectEditPosition({ e });
      setValue("QN_WORK_NATION", "");
      setValue("JOB_QN_PROVINCE_ID", "");
      setValue("JOB_QN_DISTRICT_ID", "");
      setValue("JOB_QN_SUBDISTRICT_ID", "");
      //setValue('QN_WORK_STATUS', '');
      setIsShowJob12567(false); //ซ่อน TextBox
      setIsShowJob34(true);
    }
  };

  //setOccupID
  const OnchangeSelectOccupID = (e) => {
    setValue("QN_OCCUP_TYPE", e.target.value);
    setOccupID(e.target.value);

    if (e.target.value === "00") {
      setIsShow(true); //แสดง TextBox
    } else {
      setValue("QN_OCCUP_TYPE_TXT", ""); //กำหนดค่าว่าง
      setIsShow(false); //แสดง TextBox
    }
  };
  //setOccupID
  const OnchangeSelectTalentID = (e) => {
    setValue("QN_TALENT", e.target.value);
    setTalentID(e.target.value);
    if (e.target.value === "00") {
      setIsShowTalent(true); //แสดง TextBox
    } else {
      //setValue("QN_TALENT", ""); //กำหนดค่าว่าง
      setValue("QN_TALENT_TXT", ""); //กำหนดค่าว่าง
      setIsShowTalent(false); //แสดง TextBox
    }
  };
  //setWorkNationID
  const OnchangeSelectWorkNationID = (e) => {
    setValue("QN_WORK_NATION", e.target.value);
    setWorkNationID(e.target.value);
  };
  //setProvinceID
  const OnchangeSelectJobProvince = (e) => {
    setValue("JOB_QN_PROVINCE_ID", e.target.value);
    setJobProvid(e.target.value);
    setJobSubDistid(e.target.value);
    //setProvid(e.target.value);
  };
  //setDistrictID
  const OnchangeSelectDistrict = (e) => {
    setValue("JOB_QN_DISTRICT_ID", e.target.value);
    setJobDistid(e.target.value);
  };
  //setSubdistrictID
  const OnchangeSelectSubDistrict = (e) => {
    setValue("JOB_QN_SUBDISTRICT_ID", e.target.value);
    setJobSubDistid(e.target.value);
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

                    <small className={classes.typo}>
                      <SelectProvince
                        refs={{ ...register("REF_QN_PROVINCE_ID") }}
                        error={errors.REF_QN_PROVINCE_ID?.message}
                        defaultValue={provid}
                        value={provid}
                        placeHolder={"-เลือกจังหวัด-"}
                        onChange={(e) => OnchangeSelectProvince(e)}
                        options={items}
                      />
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
                        <SelectProvince
                          refs={{ ...register("QN_MILITARY_STATUS") }}
                          error={errors.QN_MILITARY_STATUS?.message}
                          defaultValue={militaryid}
                          value={militaryid}
                          placeHolder={"-เลือกสถานะการเกณฑ์ทหารฯ-"}
                          onChange={(e) => OnchangeSelectMilitaryID(e)}
                          options={itemsMili}
                        />
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
                        <SelectProvince
                          refs={{ ...register("QN_ORDINATE_STATUS") }}
                          error={errors.QN_ORDINATE_STATUS?.message}
                          defaultValue={ordinateid}
                          value={ordinateid}
                          placeHolder={"-เลือกสถานะการเป็นนักบวช-"}
                          onChange={(e) => OnchangeSelectOrdinateID(e)}
                          options={itemsOrdi}
                        />
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
                      <SelectProvince
                        refs={{ ...register("QN_WORK_STATUS") }}
                        error={errors.QN_WORK_STATUS?.message}
                        defaultValue={jobstatus}
                        value={jobstatus}
                        placeHolder={"-เลือกสถานะภาพการทำงานปัจจุบัน-"}
                        onChange={(e) => OnchangeSelectJobStatusID(e)}
                        options={itemsJob}
                      />
                    </small>
                  </div>
                </Grid>
              </Grid>
              {sShowJob12567 ? (
                <Grid container spacing={0}>
                  <Typography className={classes.typo} variant="h3" size="sm">
                    ตอนที่ 2 สำหรับผู้ที่ทำงานแล้ว
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
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
                          <SelectProvince
                            refs={{ ...register("QN_OCCUP_TYPE") }}
                            error={errors.QN_OCCUP_TYPE?.message}
                            defaultValue={occupid}
                            value={occupid}
                            placeHolder={"-เลือกประเภทงานที่ทำ-"}
                            onChange={(e) => OnchangeSelectOccupID(e)}
                            options={itemsOcc}
                          />
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

                    <Grid item xs={12} sm={4}>
                      <div className="col-md-6">
                        <ListItem disableGutters={true}>
                          <ListItemIcon>
                            <Icon
                              className="fa fa-car"
                              style={{ color: orange[500], fontSize: 30 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary="ความสามารถพิเศษ"
                            secondary={secondary ? "Secondary text" : null}
                            style={{ color: orange[500], fontSize: 30 }}
                          />
                        </ListItem>

                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register("QN_TALENT") }}
                            error={errors.QN_TALENT?.message}
                            defaultValue={talentid}
                            value={talentid}
                            placeHolder={"-เลือกความสามารถพิเศษ-"}
                            onChange={(e) => OnchangeSelectTalentID(e)}
                            options={itemsTalent}
                          />
                        </small>
                        {isShowTalent ? (
                          <small className={classes.typo}>
                            <TextField
                              {...register("QN_TALENT_TXT")}
                              variant="outlined"
                              label="อื่นๆ ระบุ"
                              fullWidth
                              error={!!errors.QN_TALENT_TXT}
                              helperText={errors.QN_TALENT_TXT?.message}
                              InputProps={{
                                readOnly: false,
                              }}
                              size="small"
                            />
                          </small>
                        ) : null}
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className="col-md-6">
                        <ListItem disableGutters={true}>
                          <ListItemIcon>
                            <Icon
                              className="fa fa-car"
                              style={{ color: orange[500], fontSize: 30 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary="ชื่อตำแหน่งงาน"
                            secondary={secondary ? "Secondary text" : null}
                            style={{ color: orange[500], fontSize: 30 }}
                          />
                        </ListItem>

                        <small className={classes.typo}>
                          {/* <SelectProvince
                            refs={{ ...register("QN_TALENT") }}
                            error={errors.QN_TALENT?.message}
                            defaultValue={talentid}
                            value={talentid}
                            placeHolder={"-เลือกความสามารถพิเศษ-"}
                            onChange={(e) => OnchangeSelectTalentID(e)}
                            options={itemsTalent}
                          /> */}
                          <SSelect
                            {...register("QN_POS_ID")}
                            error={errors.QN_POS_ID?.message}
                            value={selectEditPosition.selectedOption}
                            onChange={onChangeSelectPositionEditHandler}
                            options={itemsPositionCr}
                            styles={customStyles}
                          />
                          {errors.QN_POS_ID ? (
                            <div>
                              <span className="text-danger">
                                {"กรุณาเลือกตำแหน่งงาน"}
                              </span>
                            </div>
                          ) : null}
                        </small>
                      </div>
                    </Grid>

                    <Grid container spacing={0}>
                      <Typography
                        className={classes.typo}
                        variant="h3"
                        size="sm"
                      >
                        สถานที่ทำงานปัจจุบัน
                      </Typography>

                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">
                              ชื่อหน่วยงาน{" "}
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
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <div className="col-md-12">
                            <label className="control-label">หมู่ </label>
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
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">อาคาร/ตึก </label>
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
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className="col-md-12">
                            <label className="control-label">ตรอก/ซอย </label>
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
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <div className="col-md-12">
                            <label className="control-label">ถนน </label>
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
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">จังหวัด </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register("JOB_QN_PROVINCE_ID") }}
                                error={errors.JOB_QN_PROVINCE_ID?.message}
                                defaultValue={jobprovid}
                                value={jobprovid}
                                placeHolder={"-เลือกจังหวัด-"}
                                onChange={(e) => OnchangeSelectJobProvince(e)}
                                options={itemsJobsProvince}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">อำเภอ </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register("JOB_QN_DISTRICT_ID") }}
                                error={errors.JOB_QN_DISTRICT_ID?.message}
                                defaultValue={jobdistid}
                                value={jobdistid}
                                placeHolder={"-เลือกอำเภอ-"}
                                onChange={(e) => OnchangeSelectDistrict(e)}
                                options={itemsJobsDistrict}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">ตำบล </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register("JOB_QN_SUBDISTRICT_ID") }}
                                error={errors.JOB_QN_SUBDISTRICT_ID?.message}
                                defaultValue={jobsubdistid}
                                value={jobsubdistid}
                                placeHolder={"-เลือกตำบล-"}
                                onChange={(e) => OnchangeSelectSubDistrict(e)}
                                options={itemsJobSubDistrict}
                              />
                            </small>
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">
                              รหัสไปรษณีย์{" "}
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
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">โทรศัพท์ </label>
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
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">โทรสาร </label>
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
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">อีเมล์ </label>
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
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className="col-md-12">
                            <label className="control-label">
                              ประเทศที่ทำงาน{" "}
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register("QN_WORK_NATION") }}
                                error={errors.QN_WORK_NATION?.message}
                                defaultValue={worknationid}
                                value={worknationid}
                                placeHolder={"-ประเทศที่ทำงาน-"}
                                onChange={(e) => OnchangeSelectWorkNationID(e)}
                                options={itemsWorkNation}
                              />
                            </small>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}

              {sShowJob34 ? (
                <Grid container spacing={0}>
                  <Typography className={classes.typo} variant="h3" size="sm">
                    ตอนที่ 3 สำหรับผู้ที่ยังไม่ได้ทำงาน
                  </Typography>

                  <Grid container spacing={1}></Grid>
                </Grid>
              ) : null}

              <TextField
                {...register("GENDER_ID")}
                type="hidden"
                error={!!errors.GENDER_ID}
                helperText={errors.GENDER_ID?.message}
                InputProps={{
                  readOnly: true,
                }}
                onChange={(e) => handleChange_MILITARY(e)}
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
              <TextField
                {...register("CITIZEN_ID")}
                type="hidden"
                error={!!errors.CITIZEN_ID}
                helperText={errors.CITIZEN_ID?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                {...register("UNIV_ID")}
                type="hidden"
                error={!!errors.UNIV_ID}
                helperText={errors.UNIV_ID?.message}
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
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};
export default GraduateList;
