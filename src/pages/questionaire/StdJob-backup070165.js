import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import StudentsListComp from "./StudentsList";
import { Col, Card, CardBody } from 'reactstrap';

import Loading from '../../components/loading';

//
//dialogs//
import { Grid, CircularProgress, TextField } from '@material-ui/core';
import { Typography } from '../../components/Wrappers';
import Controls from '../../components/Dialogs/controls/Controls';
//import FormHelperText from '@material-ui/core/FormHelperText';
//import FormControl from '@material-ui/core/FormControl';
//import MenuItem from '@material-ui/core/MenuItem';
//import Grid from "@material-ui/core/Grid";
import PageTitle from '../../components/PageTitle/PageTitle';
import { makeStyles } from '@material-ui/core/styles';

//import Select from '@material-ui/core/Select';

import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import * as Joi from 'joi';

import Paper from '@material-ui/core/Paper';
import { listProvince } from '../../services/listEndPointService';
import { listMilitary } from '../../services/listEndPointService';
import { listOrdinate } from '../../services/listEndPointService';
import { listWorkstatus } from '../../services/listEndPointService';
import { listOccupType } from '../../services/listEndPointService';
//import { exist } from 'joi';
import Notification from '../../components/Dialogs/Notification';

import SelectProvince from '../../components/Forms/Selects';
import {
  green,
  orange,
  red,
  blue,
  pink,
  teal,
  purple,
} from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
//pro
//import DropDownProvinces from "./dropdownProvinces";

//*** */

import ListItem from '@material-ui/core/ListItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';

import ListItemText from '@material-ui/core/ListItemText';

//import FolderIcon from '@material-ui/icons/Folder';
//import List from '@material-ui/core/List';

//*** */

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    //justifyContent: "center",
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    '& > .fa': {
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
    padding: '5px 5px 5px 5px',
  },
  typo: {
    //color: theme.palette.text.hint,
    //color: theme.palette.text.primary,
    color: '#FE6B8B',
  },
  typename: {
    //color: theme.palette.text.hint,
    //color: theme.palette.text.primary,
    color: '#8C2BFF',
  },
}));

const dataStudents = Joi.object({
  //???????????????????????????????????????????????????????????????????????????????????????
  TELEPHONEUPDATE: Joi.string().required(),
  //????????????????????????????????? qn
  GENDER_ID: Joi.string(),
  CITIZEN_ID: Joi.string(),
  UNIV_ID: Joi.string(),
  STD_ID: Joi.string(),
  REF_QN_PROVINCE_ID: Joi.string()
    .regex(/^[1-99]/)
    .required(),
  QN_MILITARY_STATUS: Joi.any().when('GENDER_ID', {
    is: '1',
    then: Joi.string()
      .pattern(new RegExp('^[0-1]'))
      .required()
      .label('???????????????????????????????????????????????????????????????'),
  }),
  QN_ORDINATE_STATUS: Joi.any().when('GENDER_ID', {
    is: '1',
    then: Joi.string().pattern(new RegExp('^[1-5]')).required(),
  }),

  QN_WORK_STATUS: Joi.string()
    .regex(/^[1-7]/)
    .required()
    .label('????????????????????????????????????????????????????????????????????????????????????'),

  //======--????????????????????? 1 --======//
  //??????????????????????????????????????????
  QN_OCCUP_TYPE: Joi.any()
    .when('QN_WORK_STATUS', {
      is: '1',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    })
    .when('QN_WORK_STATUS', {
      is: '2',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    })
    .when('QN_WORK_STATUS', {
      is: '5',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    })
    .when('QN_WORK_STATUS', {
      is: '6',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    })
    .when('QN_WORK_STATUS', {
      is: '7',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    }),
  QN_OCCUP_TYPE_TXT: Joi.any().when('QN_OCCUP_TYPE', {
    is: '00',
    then: Joi.string().required(),
  }),
  //========????????????????????????????????????????????????==========//
  //?????????????????????????????????????????????
  QN_TALENT: Joi.any()
    .when('QN_WORK_STATUS', {
      is: '1',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    })
    .when('QN_WORK_STATUS', {
      is: '2',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    })
    .when('QN_WORK_STATUS', {
      is: '5',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    })
    .when('QN_WORK_STATUS', {
      is: '6',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    })
    .when('QN_WORK_STATUS', {
      is: '7',
      then: Joi.string()
        .regex(/^[00-05]/)
        .required(),
    }),
  QN_TALENT_TXT: Joi.any().when('QN_TALENT', {
    is: '00',
    then: Joi.string().required(),
  }),
  //========?????????????????????????????????????????????==========//
});

const GraduateList = (props) => {
  //?????????????????????
  const [provid, setProvid] = useState('0');
  //???????????????????????????
  const [militaryid, setMilitaryID] = useState('9');
  //??????????????????
  const [ordinateid, setOrdinateID] = useState('0');
  //?????????????????????????????????????????????????????????????????????
  const [jobstatus, setJobStatus] = useState('0');
  //??????????????????????????????????????????
  const [occupid, setOccupID] = useState('99');
  const [occupidTxT, setOccupIDTxT] = useState('');
  //?????????????????????????????????????????????
  const [talentid, setTalentID] = useState('99');
  const [talentTxT, setTalentIDTxT] = useState('');
  //const [value, setVal] = useState('');

  ///???????????????????????? ??????????????????????????????????????? 1-2-6-7
  const [isShowJob1267, setIsShowJob1267] = useState(false);

  //??????????????????????????????????????????????????????????????????
  const [isShow, setIsShow] = useState(false);
  //?????????????????????????????????????????????????????????????????????
  const [isShowTalent, setIsShowTalent] = useState(false);
  //????????????????????????????????????????????????????????????
  const [isShowMILITARY, setIsShowMILITARY] = useState(false);
  //??????????????????????????????????????????
  const [isShowORDINATE, setisShowORDINATE] = useState(false);
  //check QN
  //const [refProvinceID, setrefProvinceID] = useState(""); //<--------------(Like this).

  const [genderCk, setGenderCk] = useState('');
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
    message: '',
    type: '',
  });

  const retrieveTutorials = () => {
    var rememberMe = localStorage.getItem('dataAuth');
    //const user = rememberMe ? localStorage.getItem("dataStudent") : "";
    var studentsData = JSON.parse(rememberMe);
    //var studentsFullname = studentsData.LAST_NAME;
    //console.log(studentsData); //line std_code
    setIsLoading(true);
    const BASE_URL = 'http://academic.pcru.ac.th/job-api/std-detail-end.php';
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
              ///????????????????????????????????????????????????????????????????????????????????????//

              //----------------------------

              //end Ordinate_status

              //----------------------------
              //console.log("xx");
              //console.log("5555=", response.data.bunditSTD.STD_FNAME);
              setIsLoading(false);

              if (response.data.bunditSTD.GENDER_ID === '1') {
                setIsShowMILITARY(true);
                setisShowORDINATE(true);
              } else {
                setIsShowMILITARY(false);
                setisShowORDINATE(false);
              }

              setData(response.data.bunditSTD); //?????????????????? result

              //-- set ????????????????????????????????????????????? Joi --//
              setGenderCk(response.data.bunditSTD.GENDER_ID);
              //setValue("STD_CODE", response.data.bunditSTD.STD_ID);
              setValue('STD_ID', response.data.bunditSTD.STD_ID);
              setValue('CITIZEN_ID', response.data.bunditSTD.CITIZEN_ID);
              setValue('UNIV_ID', response.data.bunditSTD.UNIV_ID);
              setValue('GENDER_ID', response.data.bunditSTD.GENDER_ID);
              setValue(
                'TELEPHONEUPDATE',
                response.data.bunditSTD.MOBILE_CONTACT
              );

              //-- ???????????????????????????????????? set ????????????????????????????????????????????? Joi --//

              //console.log("xxx=", response.data.bunditSTD.STD_ID);
              //localStorage.setItem("StudentData", response.data.id.data);
              //setError(false);
              //setIsLoading(false);
              //history.push("/app/dashboard");
            }, 1000);
          } else {
            //username ?????????
            //password ?????????
            console.log('wrong username');
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
      console.log('err');
    }
  };
  useEffect(retrieveTutorials, []);

  ///
  useEffect(() => {
    loadCheckQN();
  }, []);
  /** */
  const loadCheckQN = () => {
    var rememberMeX = localStorage.getItem('dataAuth');
    //const user = rememberMe ? localStorage.getItem("dataStudent") : "";
    var studentsDataQN = JSON.parse(rememberMeX);
    const BASE_URL_QN =
      'http://academic.pcru.ac.th/job-api/qn-checkstd-end.php';
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
              ///????????????????????????????????????????????????????????????????????????????????????//
              //
              //console.log("xx");
              //console.log("std=", res.data.QuestionaireSTD.STD_ID);
              setIsLoading(false);
              //-- set ????????????????????????????????????????????? Joi --//
              //setVal(res.data.QuestionaireSTD.REF_QN_PROVINCE_ID);

              setProvid(res.data.QuestionaireSTD.REF_QN_PROVINCE_ID);
              setMilitaryID(res.data.QuestionaireSTD.QN_MILITARY_STATUS);
              setOrdinateID(res.data.QuestionaireSTD.QN_ORDINATE_STATUS);

              //??????????????????????????????????????????
              setOccupID(res.data.QuestionaireSTD.QN_OCCUP_TYPE);
              setOccupIDTxT(res.data.QuestionaireSTD.QN_OCCUP_TYPE_TXT);
              if (res.data.QuestionaireSTD.QN_OCCUP_TYPE === '00') {
                setIsShow(true); //???????????? TextBox
              } else {
                setIsShow(false); //???????????? TextBox
              }

              //???????????????????????????????????????????????????????????????
              setTalentID(res.data.QuestionaireSTD.QN_TALENT);
              setTalentIDTxT(res.data.QuestionaireSTD.QN_TALENT_TXT);
              if (res.data.QuestionaireSTD.QN_TALENT === '00') {
                setIsShowTalent(true); //???????????? TextBox
              } else {
                setIsShowTalent(false); //???????????? TextBox
              }
              //?????????????????????????????????????????????
              setJobStatus(res.data.QuestionaireSTD.QN_WORK_STATUS);
              if (
                res.data.QuestionaireSTD.QN_WORK_STATUS === '1' ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === '2' ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === '5' ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === '6' ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === '7'
              ) {
                setIsShowJob1267(true); //???????????? TextBox
              } else {
                setIsShowJob1267(false); //???????????? TextBox
              }

              setValue('GENDER_ID', res.data.QuestionaireSTD.GENDER_ID);
              setValue(
                'QN_MILITARY_STATUS',
                res.data.QuestionaireSTD.QN_MILITARY_STATUS
              );
              setValue(
                'QN_ORDINATE_STATUS',
                res.data.QuestionaireSTD.QN_ORDINATE_STATUS
              );
              setValue(
                'QN_WORK_STATUS',
                res.data.QuestionaireSTD.QN_WORK_STATUS
              );
              setValue(
                'REF_QN_PROVINCE_ID',
                res.data.QuestionaireSTD.REF_QN_PROVINCE_ID
              );
              setValue('QN_OCCUP_TYPE', res.data.QuestionaireSTD.QN_OCCUP_TYPE);
              setValue(
                'QN_OCCUP_TYPE_TXT',
                res.data.QuestionaireSTD.QN_OCCUP_TYPE_TXT
              );
              setValue('QN_TALENT', res.data.QuestionaireSTD.QN_TALENT);
              setValue('QN_TALENT_TXT', res.data.QuestionaireSTD.QN_TALENT_TXT);

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
              //-- ???????????????????????????????????? set ????????????????????????????????????????????? Joi --//
              console.log('?????????????????????????????????????????????????????????????????????????????????');
              //console.log("xxx=", response.data.bunditSTD.STD_ID);
              //localStorage.setItem("StudentData", response.data.id.data);
              //setError(false);
              //setIsLoading(false);
              //history.push("/app/dashboard");
            }, 1000);
          } else {
            //username ?????????
            //password ?????????
            console.log('?????????????????????????????????');
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
      console.log('err');
    }
  };
  //====================================
  //====================================

  //====================================
  ///?????????????????????//
  //const [isLoading, setIsLoading] = useState(false);
  //const [isError, setIsError] = useState(false);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([{ label: 'Loading ...', value: '' }]);

  useEffect(() => {
    let unmounted = false;
    async function getProvinceID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/provinces-end.php'
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
  ///????????????//
  const [loadingmili, setLoadingMili] = useState(true);
  const [itemsMili, setItemsMili] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedMili = false;
    async function MilitaryID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/military-status-end.php'
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
  ///??????????????????//
  const [loadingordi, setLoadingOrdi] = useState(true);
  const [itemsOrdi, setItemsOrdi] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedOrdi = false;
    async function OrdinateID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/ordinate-status-end.php'
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
  ///?????????????????????????????????????????????//
  const [loadingJob, setLoadingJob] = useState(true);
  const [itemsJob, setItemsJob] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedJob = false;
    async function JobStatusID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/work-status-end.php'
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
  ///??????????????????????????????????????????//
  const [loadingOcc, setLoadingOcc] = useState(true);
  const [itemsOcc, setItemsOcc] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedOcc = false;
    async function OccupID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/occup-type-end.php'
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
  ///?????????????????????????????????????????????//
  const [loadingTalent, setLoadingTalent] = useState(true);
  const [itemsTalent, setItemsTalent] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedTalent = false;
    async function TalentID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-talent-end.php'
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

  ///
  ///load province
  /*
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
  */
  //end loadprovince

  ///load military_status
  /*
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
  */
  //end military_status

  ///load Ordinate_status
  /*
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
  */
  //end Ordinate_status

  ///load Ordinate_status
  /*
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
  */
  //end Ordinate_status

  ///load Occuptype
  /*
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
  */
  //end Occuptype

  //

  //???????????????????????????????????? ?????????????????????????????????????????? textbox ???????????????????????????????????????
  const handleChange_MILITARY = (e) => {
    e.preventDefault(); // prevent the default action
    if (e.target.value === '1') {
      setIsShowMILITARY(true); //???????????? TextBox
      setisShowORDINATE(true);
    } else {
      setValue('QN_MILITARY_STATUS', ''); //????????????????????????????????????
      setIsShowMILITARY(false); //???????????? TextBox
      setisShowORDINATE(false);
    }
  };

  //?????????????????????????????????????????? ?????????????????????????????????????????? textbox ????????????????????????????????????
  /*
  const handleChange_QN_OCCUP_TYPE = (e) => {
    e.preventDefault(); // prevent the default action
    if (e.target.value === "00") {
      setIsShow(true); //???????????? TextBox
    } else {
      setValue("QN_OCCUP_TYPE_TXT", ""); //????????????????????????????????????
      setIsShow(false); //???????????? TextBox
    }
  };
*/
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
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (result) {
        console.log('success');
        setTimeout(() => {
          setNotify({
            isOpen: true,
            message: '???????????????????????????????????????????????????????????????????????????',
            type: 'success',
          });
          //setIsAddLoading(false);
          //??????????????????????????????
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
      console.log('error');
      setNotify({
        isOpen: true,
        message: '????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
        type: 'warning',
      });
      //setIsAddLoading(false);
      //loading false
      //error true
      //errorMsg "???????????????????????????????????????????????????"
    }
  };

  //setProvinceID
  const OnchangeSelectProvince = (e) => {
    setValue('REF_QN_PROVINCE_ID', e.target.value);
    setProvid(e.target.value);
  };
  //setMilitaryID
  const OnchangeSelectMilitaryID = (e) => {
    setValue('QN_MILITARY_STATUS', e.target.value);
    setMilitaryID(e.target.value);
  };
  //setOrdinateID
  const OnchangeSelectOrdinateID = (e) => {
    setValue('QN_ORDINATE_STATUS', e.target.value);
    setOrdinateID(e.target.value);
  };
  //setJobID
  const OnchangeSelectJobStatusID = (e) => {
    e.preventDefault(); // prevent the default action
    setValue('QN_WORK_STATUS', e.target.value);
    setJobStatus(e.target.value);
    if (
      e.target.value === '1' ||
      e.target.value === '2' ||
      e.target.value === '5' ||
      e.target.value === '6' ||
      e.target.value === '7'
    ) {
      setIsShowJob1267(true); //???????????? TextBox
      //setValue("QN_OCCUP_TYPE", e.target.value);
      setOccupID(e.target.value);
      setTalentID(e.target.value);
    } else {
      setValue('QN_OCCUP_TYPE', ''); //????????????????????????????????????
      setValue('QN_OCCUP_TYPE_TXT', ''); //????????????????????????????????????
      //setValue('QN_WORK_STATUS', '');
      setIsShowJob1267(false); //???????????? TextBox
    }
  };

  //setOccupID
  const OnchangeSelectOccupID = (e) => {
    setValue('QN_OCCUP_TYPE', e.target.value);
    setOccupID(e.target.value);

    if (e.target.value === '00') {
      setIsShow(true); //???????????? TextBox
    } else {
      setValue('QN_OCCUP_TYPE_TXT', ''); //????????????????????????????????????
      setIsShow(false); //???????????? TextBox
    }
  };
  //setOccupID
  const OnchangeSelectTalentID = (e) => {
    setValue('QN_TALENT', e.target.value);
    setTalentID(e.target.value);
    if (e.target.value === '00') {
      setIsShowTalent(true); //???????????? TextBox
    } else {
      //setValue("QN_TALENT", ""); //????????????????????????????????????
      setValue('QN_TALENT_TXT', ''); //????????????????????????????????????
      setIsShowTalent(false); //???????????? TextBox
    }
  };
  let content = <Loading msg=' ???????????????????????????...' />;

  if (!isLoading) {
    if (isError) {
      content = 'error';
    } else {
      content = (
        <div>
          <form onSubmit={handleSubmit(handleSubmitAdd)}>
            <div className={classes.root}>
              <Typography className={classes.typo} variant='h3' size='sm'>
                ?????????????????? 1 ????????????????????????????????????
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <div className='col-md-12'>
                    <label className='control-label'>1. ??????????????????????????? : </label>
                    <small className={classes.typo}>
                      {'??????????????????????????????????????????????????????????????????????????????'}
                    </small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>2. ????????????-???????????? : </label>
                    <small className={classes.typename}>
                      {data.PREFIX_NAME +
                        '' +
                        data.STD_FNAME +
                        ' ' +
                        data.STD_LNAME}
                    </small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      3. ?????????????????????????????????????????????????????? :{' '}
                    </label>
                    <small className={classes.typo}>{data.CITIZEN_ID}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      4. ????????????????????????????????????????????????????????? :{' '}
                    </label>
                    <small className={classes.typo}>{data.STD_ID}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      5. ?????????/???????????????/?????? ???????????? :{' '}
                    </label>
                    <small className={classes.typo}>{data.BIRTHDAY}</small>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className='col-md-12'>
                    <label className='control-label'>6. ???????????? : </label>
                    <small className={classes.typo}>
                      {data.UNI_PROGRAM_NAME}
                    </small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>7. ????????? : </label>
                    <small className={classes.typo}>{data.FAC_NAME}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      8. ?????????????????????????????????????????????????????????????????? :{' '}
                    </label>
                    <small className={classes.typo}>{data.CURR_NAME}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      9. ????????????????????????????????????????????????????????????????????? (GPA) :{' '}
                    </label>
                    <small className={classes.typo}>{data.GPA}</small>
                  </div>
                </Grid>
              </Grid>

              <Typography className={classes.typo} variant='h5' size='sm'>
                ?????????????????????????????????????????????
              </Typography>

              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <div className='col-md-12'>
                    <label className='control-label'>?????????????????? </label>
                    <small className={classes.typo}>{data.HOMEADD}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>???????????? </label>
                    <small className={classes.typo}>{data.MOO}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>????????? </label>
                    <small className={classes.typo}>{data.SOI}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>????????? </label>
                    <small className={classes.typo}>{data.STREET}</small>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className='col-md-12'>
                    <label className='control-label'>???????????? </label>
                    <small className={classes.typo}>{data.TUMBOL}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>??????????????? </label>
                    <small className={classes.typo}>{data.AMPHUR}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>????????????????????? </label>
                    <small className={classes.typo}>{data.PROVINCE_NAME}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>???????????????????????????????????? </label>
                    <small className={classes.typo}>{data.ZIPCODE}</small>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      ??????????????????????????????????????? (????????????????????????){' '}
                    </label>
                    <small className={classes.typo}>
                      <TextField
                        {...register('TELEPHONEUPDATE')}
                        variant='outlined'
                        fullWidth
                        error={!!errors.TELEPHONEUPDATE}
                        helperText={errors.TELEPHONEUPDATE?.message}
                        InputProps={{
                          readOnly: false,
                        }}
                        size='small'
                      />
                    </small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>E-mail </label>
                    <small className={classes.typo}>{data.EMAIL}</small>
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <div className='col-md-6'>
                    <ListItem disableGutters={true}>
                      <ListItemIcon>
                        <Icon
                          className='fa fa-home'
                          style={{ color: green[500], fontSize: 30 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary='??????????????????????????? (?????????????????????)'
                        secondary={secondary ? 'Secondary text' : null}
                        style={{ color: green[500], fontSize: 30 }}
                      />
                    </ListItem>
                    <small className={classes.typo}>
                      <SelectProvince
                        refs={{ ...register('REF_QN_PROVINCE_ID') }}
                        error={errors.REF_QN_PROVINCE_ID?.message}
                        defaultValue={provid}
                        value={provid}
                        placeHolder={'-????????????????????????????????????-'}
                        onChange={(e) => OnchangeSelectProvince(e)}
                        options={items}
                      />
                    </small>
                  </div>
                </Grid>
                {isShowMILITARY ? (
                  <Grid item xs={12} sm={4}>
                    <div className='col-md-6'>
                      <ListItem disableGutters={true}>
                        <ListItemIcon>
                          <Icon
                            className='fa fa-fighter-jet'
                            style={{ color: orange[500], fontSize: 30 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary='??????????????????????????????????????????????????? : (?????????????????????????????????)'
                          secondary={secondary ? 'Secondary text' : null}
                          style={{ color: orange[500], fontSize: 30 }}
                        />
                      </ListItem>
                      <small className={classes.typo}>
                        <SelectProvince
                          refs={{ ...register('QN_MILITARY_STATUS') }}
                          error={errors.QN_MILITARY_STATUS?.message}
                          defaultValue={militaryid}
                          value={militaryid}
                          placeHolder={'-?????????????????????????????????????????????????????????????????????-'}
                          onChange={(e) => OnchangeSelectMilitaryID(e)}
                          options={itemsMili}
                        />
                      </small>
                    </div>
                  </Grid>
                ) : null}
                {isShowORDINATE ? (
                  <Grid item xs={12} sm={4}>
                    <div className='col-md-6'>
                      <ListItem disableGutters={true}>
                        <ListItemIcon>
                          <Icon
                            className='fa fa-eye'
                            style={{ color: orange[500], fontSize: 30 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary='??????????????????????????????????????????????????????????????????????????????'
                          secondary={secondary ? 'Secondary text' : null}
                          style={{ color: orange[500], fontSize: 30 }}
                        />
                      </ListItem>

                      <small className={classes.typo}>
                        <SelectProvince
                          refs={{ ...register('QN_ORDINATE_STATUS') }}
                          error={errors.QN_ORDINATE_STATUS?.message}
                          defaultValue={ordinateid}
                          value={ordinateid}
                          placeHolder={'-?????????????????????????????????????????????????????????????????????-'}
                          onChange={(e) => OnchangeSelectOrdinateID(e)}
                          options={itemsOrdi}
                        />
                      </small>
                    </div>
                  </Grid>
                ) : null}
                <Grid item xs={12} sm={4}>
                  <div className='col-md-6'>
                    <ListItem disableGutters={true}>
                      <ListItemIcon>
                        <Icon
                          className='fa fa-child'
                          style={{ color: purple[500], fontSize: 30 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary='????????????????????????????????????????????????????????????????????????'
                        secondary={secondary ? 'Secondary text' : null}
                        style={{ color: purple[500], fontSize: 30 }}
                      />
                    </ListItem>

                    <small className={classes.typo}>
                      <SelectProvince
                        refs={{ ...register('QN_WORK_STATUS') }}
                        error={errors.QN_WORK_STATUS?.message}
                        defaultValue={jobstatus}
                        value={jobstatus}
                        placeHolder={'-???????????????????????????????????????????????????????????????????????????????????????-'}
                        onChange={(e) => OnchangeSelectJobStatusID(e)}
                        options={itemsJob}
                      />
                    </small>
                  </div>
                </Grid>
              </Grid>
              {isShowJob1267 ? (
                <Grid container spacing={0}>
                  <Typography className={classes.typo} variant='h3' size='sm'>
                    ?????????????????? 2 ???????????????????????????????????????????????????????????????
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <div className='col-md-6'>
                        <ListItem disableGutters={true}>
                          <ListItemIcon>
                            <Icon
                              className='fa fa-car'
                              style={{ color: orange[500], fontSize: 30 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary='??????????????????????????????????????????'
                            secondary={secondary ? 'Secondary text' : null}
                            style={{ color: orange[500], fontSize: 30 }}
                          />
                        </ListItem>

                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_OCCUP_TYPE') }}
                            error={errors.QN_OCCUP_TYPE?.message}
                            defaultValue={occupid}
                            value={occupid}
                            placeHolder={'-?????????????????????????????????????????????????????????-'}
                            onChange={(e) => OnchangeSelectOccupID(e)}
                            options={itemsOcc}
                          />
                        </small>
                        {isShow ? (
                          <small className={classes.typo}>
                            <TextField
                              {...register('QN_OCCUP_TYPE_TXT')}
                              variant='outlined'
                              label='??????????????? ????????????'
                              fullWidth
                              error={!!errors.QN_OCCUP_TYPE_TXT}
                              helperText={errors.QN_OCCUP_TYPE_TXT?.message}
                              InputProps={{
                                readOnly: false,
                              }}
                              size='small'
                            />
                          </small>
                        ) : null}
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <div className='col-md-6'>
                        <ListItem disableGutters={true}>
                          <ListItemIcon>
                            <Icon
                              className='fa fa-car'
                              style={{ color: orange[500], fontSize: 30 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary='?????????????????????????????????????????????'
                            secondary={secondary ? 'Secondary text' : null}
                            style={{ color: orange[500], fontSize: 30 }}
                          />
                        </ListItem>

                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_TALENT') }}
                            error={errors.QN_TALENT?.message}
                            defaultValue={talentid}
                            value={talentid}
                            placeHolder={'-????????????????????????????????????????????????????????????-'}
                            onChange={(e) => OnchangeSelectTalentID(e)}
                            options={itemsTalent}
                          />
                        </small>
                        {isShowTalent ? (
                          <small className={classes.typo}>
                            <TextField
                              {...register('QN_TALENT_TXT')}
                              variant='outlined'
                              label='??????????????? ????????????'
                              fullWidth
                              error={!!errors.QN_TALENT_TXT}
                              helperText={errors.QN_TALENT_TXT?.message}
                              InputProps={{
                                readOnly: false,
                              }}
                              size='small'
                            />
                          </small>
                        ) : null}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}

              <TextField
                {...register('GENDER_ID')}
                type='hidden'
                error={!!errors.GENDER_ID}
                helperText={errors.GENDER_ID?.message}
                InputProps={{
                  readOnly: true,
                }}
                onChange={(e) => handleChange_MILITARY(e)}
              />
              <TextField
                {...register('STD_ID')}
                type='hidden'
                error={!!errors.STD_ID}
                helperText={errors.STD_ID?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                {...register('CITIZEN_ID')}
                type='hidden'
                error={!!errors.CITIZEN_ID}
                helperText={errors.CITIZEN_ID?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                {...register('UNIV_ID')}
                type='hidden'
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
                        color='secondary'
                      />
                    ) : (
                      <Controls.Button type='submit' text='????????????????????????????????????' />
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
      <PageTitle title='???????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????? 2564 (??????????????????????????????????????????????????????????????? 2563)' />
      <Paper className={classes.paper}>
        <Col xl='12'>
          <Card>
            <CardBody>
              <div className='blog-single'>
                <div className='blog-box blog-details'>{content}</div>
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
