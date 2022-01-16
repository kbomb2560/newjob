import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import StudentsListComp from "./StudentsList";
import { Col, Card, CardBody } from 'reactstrap';

import Loading from '../../components/loading';

//
//dialogs//
import { Grid, CircularProgress, Input, TextField } from '@material-ui/core';
import { Typography } from '../../components/Wrappers';
import Controls from '../../components/Dialogs/controls/Controls';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
//import Grid from "@material-ui/core/Grid";
import PageTitle from '../../components/PageTitle/PageTitle';
import { makeStyles } from '@material-ui/core/styles';

import SSelect from 'react-select';

//import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

import Select from '@material-ui/core/Select';

import { useForm, Controller } from 'react-hook-form';
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

import FolderIcon from '@material-ui/icons/Folder';
import List from '@material-ui/core/List';
import { tr } from 'date-fns/locale';

//*** */

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    //borderBottom: "2px dotted green",
    color: state.isSelected ? 'yellow' : 'black',
    backgroundColor: state.isSelected ? 'green' : 'white',
    whiteSpace: 'normal',
    fontSize: 16,
    display: 'flex',
  }),
  control: (provided) => ({
    ...provided,
    fontSize: 16,

    //marginTop: "5%",
  }),
};

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
  formControl: {
    margin: theme.spacing(3),
  },
}));
const WORK_CHECK_STATUS = Joi.any()
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
  });
const WORK_CHECK_STATUS_STRING = Joi.any()
  .when('QN_WORK_STATUS', {
    is: '1',
    then: Joi.string().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '2',
    then: Joi.string().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '5',
    then: Joi.string().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '6',
    then: Joi.string().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '7',
    then: Joi.string().required(),
  });
const WORK_CHECK_STATUS_NUMBER = Joi.any()
  .when('QN_WORK_STATUS', {
    is: '1',
    then: Joi.number().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '2',
    then: Joi.number().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '5',
    then: Joi.number().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '6',
    then: Joi.number().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '7',
    then: Joi.number().required(),
  });
const NOWORK_CHECK_STATUS_STRING = Joi.any()
  .when('QN_WORK_STATUS', {
    is: '3',
    then: Joi.string().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '4',
    then: Joi.string().required(),
  });

const WORK24_STATUS_NUMBER = Joi.any()
  .when('QN_WORK_STATUS', {
    is: '1',
    then: Joi.number().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '3',
    then: Joi.number().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '5',
    then: Joi.number().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '6',
    then: Joi.number().required(),
  })
  .when('QN_WORK_STATUS', {
    is: '7',
    then: Joi.number().required(),
  });
const WORKEDU_REQURIE_CHECK = Joi.any().when('QN_REQUIRE_EDU', {
  is: '1',
  then: Joi.string().required(),
  otherwise: Joi.any().allow(''),
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
    .required()
    .label('กรุณาเลือกจังหวัดภูมิลำเนา'),
  QN_MILITARY_STATUS: Joi.any().when('GENDER_ID', {
    is: '1',
    then: Joi.string()
      .pattern(new RegExp('^[0-1]'))
      .required()
      .label('กรุณาเลือกสถานภาพทหาร'),
  }),
  QN_ORDINATE_STATUS: Joi.any().when('GENDER_ID', {
    is: '1',
    then: Joi.string()
      .pattern(new RegExp('^[1-5]'))
      .required()
      .label('กรุณาเลือกสถานนักบวช'),
  }),

  QN_WORK_STATUS: Joi.string()
    .regex(/^[1-7]/)
    .required()
    .label('กรุณาเลือกสถานะภาพการมีงานทำ'),

  //======--ส่วนที่ 1 --======//
  //ประเภทงานที่ทำ
  QN_OCCUP_TYPE: WORK_CHECK_STATUS.label('กรุณาเลือกประเภทงานที่ทำ'),
  QN_OCCUP_TYPE_TXT: Joi.any().when('QN_OCCUP_TYPE', {
    is: '00',
    then: Joi.string().required().label('กรุณาระบุสาเหตุอื่น ๆ'),
  }),
  //========จบประเภทงานที่ทำ==========//
  //ความสามารถพิเศษ
  QN_TALENT: WORK_CHECK_STATUS.label('กรุณาเลือกความสามารถพิเศษ'),
  QN_TALENT_TXT: Joi.any().when('QN_TALENT', {
    is: '00',
    then: Joi.string().required().label('กรุณาระบุความสามารถอื่น ๆ'),
  }),
  //========ความสามารถพิเศษ==========//
  //========จบประเภทงานที่ทำ==========//
  //หน่วยงาน
  QN_WORK_NAME: WORK_CHECK_STATUS_STRING.label('ระบุชื่อสถานที่ทำงาน'),
  QN_WORK_ADD: WORK_CHECK_STATUS_STRING.label('ระบุเลขที่ตั้ง'),
  QN_WORK_MOO: WORK_CHECK_STATUS_NUMBER.allow('').label('ระบุหมู่'),
  QN_WORK_BUILDING: WORK_CHECK_STATUS_STRING.allow('')
    .allow(null)
    .label('ระบุอาคาร/ตึก'),
  QN_WORK_SOI: WORK_CHECK_STATUS_STRING.allow('')
    .allow(null)
    .label('ระบุตรอก/ซอย'),
  QN_WORK_STREET: WORK_CHECK_STATUS_STRING.allow('')
    .allow(null)
    .label('ระบุถนน'),
  QN_WORK_ZIPCODE: WORK_CHECK_STATUS_NUMBER.label('ระบุรหัสไปรษณีย์'),
  QN_WORK_TEL: WORK_CHECK_STATUS_STRING.allow('')
    .allow(null)
    .label('ระบุเบอร์โทรศัพท์'),
  QN_WORK_FAX: WORK_CHECK_STATUS_STRING.allow('')
    .allow(null)
    .label('ระบุเบอร์โทรสาร'),
  QN_WORK_EMAIL: WORK_CHECK_STATUS_STRING.allow('')
    .allow(null)
    .label('ระบุอีเมล์'),
  QN_SALARY: WORK_CHECK_STATUS_NUMBER.label('ระบุเงินเดือน'),

  //จังหวัดสถานที่ทำงาน
  JOB_QN_PROVINCE_ID: WORK_CHECK_STATUS_STRING.label(
    'กรุณาเลือกจังหวัดสถานที่ทำงาน'
  ),
  JOB_QN_DISTRICT_ID: WORK_CHECK_STATUS_STRING.label(
    'กรุณาเลือกอำเภอสถานที่ทำงาน'
  ),
  QN_WORK_TAMBON: WORK_CHECK_STATUS_STRING.label('กรุณาเลือกตำบลสถานที่ทำงาน'),

  //
  //QN_POS_ID: WORK_CHECK_STATUS,
  //========ตำแหน่งงาน==========//
  //========จบประเภทงานที่ทำ==========//
  //ตำแหน่งงาน

  QN_POS_ID: WORK_CHECK_STATUS_STRING,
  //========ตำแหน่งงาน==========//
  //========ประเทศที่ทำงาน==========//
  QN_WORK_NATION: WORK_CHECK_STATUS_STRING.label('กรุณาเลือกประเทศที่ทำงาน'),
  QN_WORKTYPE_ID: WORK_CHECK_STATUS_STRING.label(
    'กรุณาเลือกประเภทกิจการของที่ทำงาน'
  ),
  QN_STRATEGIC_ID: WORK_CHECK_STATUS_STRING.label(
    'กรุณาเลือกอุตสาหกรรมของสถานที่ทำงาน'
  ),

  QN_WORK_SATISFY: WORK_CHECK_STATUS_STRING.label('กรุณาเลือกความพอใจต่องานทำ'),
  QN_WORK_SATISFY_TXT: Joi.any().when('QN_WORK_SATISFY', {
    is: '00',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
  //==================//
  QN_TIME_FINDWORK: WORK_CHECK_STATUS_STRING.label(
    'กรุณาเลือกระยะเวลาการได้งานทำ'
  ),
  QN_MATCH_EDU: WORK_CHECK_STATUS_STRING.label(
    'กรุณาเลือกลักษะงานที่ทำตรงกับสาขาหรือไม่'
  ),
  QN_APPLY_EDU: WORK_CHECK_STATUS_STRING.label(
    'กรุณาเลือกการประยุกต์ใช้กับงานที่ทำ'
  ),
  /*
  QN_REQUIRE_EDU: WORK_CHECK_STATUS_STRING.label(
    'กรุณาเลือกความต้องการศึกษาต่อ'
  ),
  */
  QN_REQUIRE_EDU: WORK24_STATUS_NUMBER.label('กรุณาเลือกความต้องการศึกษาต่อ'),
  PB_DIPLOMA: Joi.string().required().label('กรุณาเลือกข้อมูลการได้รับรางวัล'),
  PB_DIPLOMA_NAME_TXT: Joi.any().when('PB_DIPLOMA', {
    is: '1',
    then: Joi.string().allow('').required(),
    otherwise: Joi.string().required().label('ระบุชื่อรางวัล'),
  }),
  PB_AGENCY_TXT: Joi.any().when('PB_DIPLOMA', {
    is: '1',
    then: Joi.string().allow('').required(),
    otherwise: Joi.string().required().label('ระบุหน่วยงานที่มอบรางวัล'),
  }),
  QN_ADDPROGRAM1: Joi.string().allow(''),
  QN_ADDPROGRAM2: Joi.string().allow(''),
  QN_ADDPROGRAM3: Joi.string().allow(''),
  QN_ADDPROGRAM4: Joi.string().allow(''),
  QN_ADDPROGRAM5: Joi.string().allow(''),
  QN_ADDPROGRAM6: Joi.string().allow(''),
  QN_ADDPROGRAM7: Joi.string().allow(''),
  QN_ADDPROGRAM8: Joi.string().allow(''),
  QN_ADDPROGRAM9: Joi.string().allow(''),
  QN_ADDPROGRAM7_TXT: Joi.any().when('QN_ADDPROGRAM7', {
    is: '1',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
  QN_COMMENT_PROGRAM: Joi.any().allow('').allow(null),
  QN_COMMENT_LEARN: Joi.any().allow('').allow(null),
  QN_COMMENT_ACTIVITY: Joi.any().allow('').allow(null),

  QN_LEVEL_EDU: WORKEDU_REQURIE_CHECK.label('ระบุระดับการศึกษา'), //ระดับการศึกษา
  QN_PROGRAM_EDU: WORKEDU_REQURIE_CHECK.label('กรุณาเลือก'),
  QN_PROGRAM_EDU_ID: Joi.any().when('QN_PROGRAM_EDU', {
    is: '2',
    then: Joi.string().required().label('ระบุข้อมูลสาขาวิชาอื่น ๆ'),
  }),
  QN_TYPE_UNIV: WORKEDU_REQURIE_CHECK.label('กรุณาเลือกข้อมูล'),
  QN_CAUSE_EDU: WORKEDU_REQURIE_CHECK.label('กรุณาเลือกข้อมูล'),
  QN_CAUSE_EDU_TXT: Joi.any().when('QN_CAUSE_EDU', {
    is: '0',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
  QN_PROB_EDU: WORKEDU_REQURIE_CHECK.required(),
  QN_PROB_EDU_TXT: Joi.any().when('QN_PROB_EDU', {
    is: '00',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
  //ไม่มีงานทำ
  QN_CAUSE_NOWORK: NOWORK_CHECK_STATUS_STRING.label('กรุณาเลือกข้อมูล'),
  QN_CAUSE_NOWORK_TXT: Joi.any().when('QN_CAUSE_NOWORK', {
    is: '0',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
  QN_PROB_FINDWORK: NOWORK_CHECK_STATUS_STRING.label('กรุณาเลือกข้อมูล'),
  QN_PROB_FINDWORK_TXT: Joi.any().when('QN_PROB_FINDWORK', {
    is: '00',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
  QN_WORKNEED_ID: NOWORK_CHECK_STATUS_STRING.label('กรุณาเลือกข้อมูล'),
  QN_WORKNEED_NATION: Joi.any().when('QN_WORKNEED_ID', {
    is: '2',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
  QN_WORKNEED_POSITION: Joi.any().when('QN_WORKNEED_ID', {
    is: '2',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
  QN_SKILL_DEVELOPMENT: Joi.any().when('QN_WORKNEED_ID', {
    is: '2',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
  QN_DISCLOSURE_AGREEMENT_ID: Joi.any().when('QN_WORKNEED_ID', {
    is: '2',
    then: Joi.string().required().label('ระบุข้อมูลอื่น ๆ'),
  }),
});

const GraduateList = (props) => {
  //จังหวัด
  const [provid, setProvid] = useState('0');
  //เกณฑ์ทหาร
  const [militaryid, setMilitaryID] = useState('9');
  //นักบวช
  const [ordinateid, setOrdinateID] = useState('0');
  //สถานภาพการทำงานปัจจุบัน
  const [jobstatus, setJobStatus] = useState('0');
  //ประเภทงานที่ทำ
  const [occupid, setOccupID] = useState('99');
  const [occupidTxT, setOccupIDTxT] = useState('');
  //ความสามารถพิเศษ
  const [talentid, setTalentID] = useState('99');
  const [talentTxT, setTalentIDTxT] = useState('');
  //ตำแหน่งงาน
  const [positionid, setPositionID] = useState('');
  //ประเทศที่ทำงาน
  //const [positionid, setPositionID] = useState("");
  const [worknationid, setWorkNationID] = useState('TH');
  //const [value, setVal] = useState('');

  //จังหวัด-job
  const [jobprovid, setJobProvid] = useState('0');
  //อำเภอ-job
  const [jobdistid, setJobDistid] = useState('0');
  //ตำบล-job
  const [jobsubdistid, setJobSubDistid] = useState('0');
  //
  const [worktypeid, setWorkTypeID] = useState('0');
  const [strategicid, setStrategicID] = useState('0');
  //ระดับการศึกษา
  const [leveleduid, setLevelEduID] = useState('0');
  const [programeduid, setProgramEduID] = useState('0');
  const [programeduid_id, setProgramEduID_ID] = useState('0');
  const [IsProgramEduIDShow, setIsProgramEduIDShow] = useState('0');

  const [typeunvid, setTypeUnivID] = useState('0');
  const [causeeduid, setCauseEduID] = useState('99');
  const [causeeduidtxt, setCauseEduIDTxT] = useState('');
  const [isShowCauseeduIdtxt, setIsShowCauseEduIDTxT] = useState(false);

  const [probeduid, setProbEduID] = useState('0');
  const [probeduidtxt, setProbEduIDTxT] = useState('');
  const [isShowProbeduIdtxt, setIsShowProbEduIDTxT] = useState(false);
  //ไม่มีงานทำ
  const [causnoworkid, setCauseNoWorkID] = useState('99');
  const [causenoworktxt, setCauseNoWorkTxT] = useState('');
  const [isShowCauseNoWorktxt, setIsShowCauseNoWorkTxT] = useState(false);
  //
  const [probfindwork, setProbFindWorkID] = useState('0');
  const [probfindworktxt, setProbFindWorkTxT] = useState('');
  const [isShowProbFindWorktxt, setIsShowProbFindWorkTxT] = useState(false);
  //
  const [disclosureid, setDisclosureID] = useState('99');
  //
  const [interworkneedid, setInterWorkNeedID] = useState('0');
  //การรับรางวัล
  const [diplomaid, setDiplomaID] = useState('0');
  const [diplomaTxT, setDiplomaTxT] = useState('');
  const [isdiplomaShow, setIsdiplomaShow] = useState(false);
  const [agencyTxT, setAgencyTxT] = useState('');
  const [isagencyShow, setIsAgencyShow] = useState(false);
  //พึงพอใจงานที่ทำ
  const [satisfyid, setSatisfyID] = useState('0');
  const [satisfyidTxT, setSatisfyIDTxT] = useState('');
  const [isSatisfyShow, setIsSatisfyShow] = useState(false);
  const [timefindworkid, setTimeFindWorkID] = useState('0');
  const [matcheduid, setMatchEduID] = useState('0');
  const [applyeduid, setApplyEduID] = useState('0');
  const [requireeduid, setRequireEduID] = useState('0');
  ///แสดงซ่อน การศึกษาต่อ
  const [isShowRequireEdu, setIsShowRequireEdu] = useState(false); //ข้อมูลการศึกษาต่อ
  const [isShowRequireEdu24, setisShowRequireEdu24] = useState(false); //ลิสเลือกการศึกษาต่อ
  //
  const [workneednationid, setWorkNeedNationID] = useState('0');
  ///แสดงซ่อน edu nation
  const [isShowInter, setIsShowInter] = useState(false); //ข้อมูลการหางานต่างประเทศ

  //ข้อเสอนแนะ//
  //1.ควรเพิ่มรายวิชา
  const [progrom1state, setProgram1Checked] = useState(false); //อังกฤษ
  const [progrom2state, setProgram2Checked] = useState(false); //คอมพิวเตอร์
  const [progrom3state, setProgram3Checked] = useState(false); //บัญชี
  const [progrom4state, setProgram4Checked] = useState(false); //การใช้อินเตอร์เน็ต
  const [progrom5state, setProgram5Checked] = useState(false); //การฝึกปฏิบัติ
  const [progrom6state, setProgram6Checked] = useState(false); //เทคนิควิจัย
  const [progrom7state, setProgram7Checked] = useState(false); //ระบุ
  const [progrom8state, setProgram8Checked] = useState(false); //ภาษาจีน
  const [progrom9state, setProgram9Checked] = useState(false); //ภาษาในอาเซียน
  //const [progrom7TxTstate, setProgram7TxT] = useState(false); //ข้อความที่ระบุ
  const [isShowProgram7TxT, setIsShowProgram7TxT] = useState(false);

  ///แสดงซ่อน การมีงานทำข้อ 1-2-5-6-7
  const [sShowJob12567, setIsShowJob12567] = useState(false);
  ///แสดงซ่อน การมีงานทำข้อ 3-4
  const [sShowJob34, setIsShowJob34] = useState(false);

  //แสดงซ่อน ข้อเสนอแนะ
  //ซ่อนแสดงประเภทงานที่ทำ
  const [isShow, setIsShow] = useState(false);
  //ซ่อนแสดงความสามารถพิเศษ
  const [isShowTalent, setIsShowTalent] = useState(false);
  //ซ่อนแสดงการเกณฑ์ทหาร
  const [isShowMILITARY, setIsShowMILITARY] = useState(false);
  //ซ่อนแสดงการบวช
  const [isShowORDINATE, setisShowORDINATE] = useState(false);
  //check QN
  const [refProvinceID, setrefProvinceID] = useState(''); //<--------------(Like this).

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
    methods,
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
              ///ตรวจสอบข้อมูลการตอบแบบสอบถาม//

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

              setData(response.data.bunditSTD); //รับค่า result

              //-- set ค่าให้กับตัวแปร Joi --//
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
    setValue('QN_POS_ID', e === null ? null : e.value.toString());
    setSelectEditPosition({ e });
  };

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
              if (res.data.QuestionaireSTD.QN_OCCUP_TYPE === '00') {
                setIsShow(true); //แสดง TextBox
              } else {
                setIsShow(false); //ซ่อน TextBox
              }

              //ประเภทความสามารถพิเศษ
              setTalentID(res.data.QuestionaireSTD.QN_TALENT);
              setTalentIDTxT(res.data.QuestionaireSTD.QN_TALENT_TXT);
              if (res.data.QuestionaireSTD.QN_TALENT === '00') {
                setIsShowTalent(true); //แสดง TextBox
              } else {
                setIsShowTalent(false); //ซ่อน TextBox
              }
              //สถานะการมีงานทำ
              setJobStatus(res.data.QuestionaireSTD.QN_WORK_STATUS);
              if (
                res.data.QuestionaireSTD.QN_WORK_STATUS === '1' ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === '2' ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === '5' ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === '6' ||
                res.data.QuestionaireSTD.QN_WORK_STATUS === '7'
              ) {
                if (res.data.QuestionaireSTD.QN_WORK_STATUS === '2') {
                  setIsShowJob12567(true); //แสดง TextBox
                  setIsShowRequireEdu(true);
                  setIsShowJob34(false);
                } else {
                  setIsShowJob12567(true); //แสดง TextBox
                  setIsShowRequireEdu(false);
                  setIsShowJob34(false);
                }
              } else {
                if (res.data.QuestionaireSTD.QN_WORK_STATUS === '4') {
                  setIsShowRequireEdu(true);
                  setIsShowJob12567(false); //ซ่อน TextBox
                  setIsShowJob34(true);
                } else {
                  setIsShowRequireEdu(false);
                  setIsShowJob12567(false); //ซ่อน TextBox
                  setIsShowJob34(true);
                }
              }

              setWorkNationID(res.data.QuestionaireSTD.QN_WORK_NATION);

              setJobProvid(res.data.QuestionaireSTD.JOB_QN_PROVINCE_ID);
              setJobDistid(res.data.QuestionaireSTD.JOB_QN_DISTRICT_ID);
              setJobSubDistid(res.data.QuestionaireSTD.QN_WORK_TAMBON);

              setWorkTypeID(res.data.QuestionaireSTD.QN_WORKTYPE_ID);
              setStrategicID(res.data.QuestionaireSTD.QN_STRATEGIC_ID);

              //ประเภทงานที่ทำ
              setSatisfyID(res.data.QuestionaireSTD.QN_WORK_SATISFY);
              setSatisfyIDTxT(res.data.QuestionaireSTD.QN_WORK_SATISFY_TXT);
              if (res.data.QuestionaireSTD.QN_WORK_SATISFY === '00') {
                setIsSatisfyShow(true); //แสดง TextBox
              } else {
                setIsSatisfyShow(false); //ซ่อน TextBox
              }

              setTimeFindWorkID(res.data.QuestionaireSTD.QN_TIME_FINDWORK);
              setMatchEduID(res.data.QuestionaireSTD.QN_MATCH_EDU);
              setApplyEduID(res.data.QuestionaireSTD.QN_APPLY_EDU);
              setRequireEduID(res.data.QuestionaireSTD.QN_REQUIRE_EDU);

              //ต้องการศึกษาต่อ

              //setJobStatus(res.data.QuestionaireSTD.QN_WORK_STATUS);
              if (res.data.QuestionaireSTD.QN_REQUIRE_EDU === '1') {
                //setIsShowJob12567(true); //แสดง TextBox
                //setIsShowJob34(false);
                setIsShowRequireEdu(true);
              } else {
                //setIsShowJob12567(false); //ซ่อน TextBox
                //setIsShowJob34(true);
                setIsShowRequireEdu(false);
              }
              //ระดับการศึกษา
              setLevelEduID(res.data.QuestionaireSTD.QN_LEVEL_EDU);
              setProgramEduID(res.data.QuestionaireSTD.QN_PROGRAM_EDU);
              setProgramEduID_ID(res.data.QuestionaireSTD.QN_PROGRAM_EDU_ID);
              //ตอนที่ 6 การรับรางวัล
              setDiplomaID(res.data.QuestionaireSTD.PB_DIPLOMA);
              setDiplomaTxT(res.data.QuestionaireSTD.PB_DIPLOMA_NAME_TXT);
              setAgencyTxT(res.data.QuestionaireSTD.PB_AGENCY_TXT);
              if (res.data.QuestionaireSTD.PB_DIPLOMA !== '1') {
                setIsdiplomaShow(true); //แสดง TextBox
              } else {
                setIsdiplomaShow(false); //ซ่อน TextBox
              }

              /*
              setAgencyTxT(res.data.QuestionaireSTD.PB_AGENCY_TXT);
              if (res.data.QuestionaireSTD.PB_DIPLOMA !== '1') {
                setIsAgencyShow(true); //แสดง TextBox
              } else {
                setIsAgencyShow(false); //ซ่อน TextBox
              }
              */
              //

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

              setValue('QN_POS_ID', res.data.QuestionaireSTD.QN_POS_ID);
              setValue(
                'QN_WORK_NATION',
                res.data.QuestionaireSTD.QN_WORK_NATION
              );
              setValue(
                'JOB_QN_PROVINCE_ID',
                res.data.QuestionaireSTD.JOB_QN_PROVINCE_ID
              );
              setValue(
                'JOB_QN_DISTRICT_ID',
                res.data.QuestionaireSTD.JOB_QN_DISTRICT_ID
              );
              setValue(
                'QN_WORK_TAMBON',
                res.data.QuestionaireSTD.QN_WORK_TAMBON
              );

              //set ค่าที่บันทึกไว้แล้ว
              setValue('QN_WORK_NAME', res.data.QuestionaireSTD.QN_WORK_NAME);
              setValue('QN_WORK_ADD', res.data.QuestionaireSTD.QN_WORK_ADD);
              setValue('QN_WORK_MOO', res.data.QuestionaireSTD.QN_WORK_MOO);

              setValue(
                'QN_WORK_BUILDING',
                res.data.QuestionaireSTD.QN_WORK_BUILDING
              );
              setValue('QN_WORK_SOI', res.data.QuestionaireSTD.QN_WORK_SOI);
              setValue(
                'QN_WORK_STREET',
                res.data.QuestionaireSTD.QN_WORK_STREET
              );
              setValue(
                'QN_WORK_ZIPCODE',
                res.data.QuestionaireSTD.QN_WORK_ZIPCODE
              );
              setValue('QN_WORK_TEL', res.data.QuestionaireSTD.QN_WORK_TEL);
              setValue('QN_WORK_FAX', res.data.QuestionaireSTD.QN_WORK_FAX);
              setValue('QN_WORK_EMAIL', res.data.QuestionaireSTD.QN_WORK_EMAIL);
              setValue('QN_SALARY', res.data.QuestionaireSTD.QN_SALARY);

              setValue(
                'QN_WORKTYPE_ID',
                res.data.QuestionaireSTD.QN_WORKTYPE_ID
              );
              setValue(
                'QN_STRATEGIC_ID',
                res.data.QuestionaireSTD.QN_STRATEGIC_ID
              );
              setValue(
                'QN_WORK_SATISFY',
                res.data.QuestionaireSTD.QN_WORK_SATISFY
              );
              setValue(
                'QN_WORK_SATISFY_TXT',
                res.data.QuestionaireSTD.QN_WORK_SATISFY_TXT
              );
              setValue(
                'QN_TIME_FINDWORK',
                res.data.QuestionaireSTD.QN_TIME_FINDWORK
              );
              setValue('QN_MATCH_EDU', res.data.QuestionaireSTD.QN_MATCH_EDU);
              setValue('QN_APPLY_EDU', res.data.QuestionaireSTD.QN_APPLY_EDU);
              setValue(
                'QN_REQUIRE_EDU',
                res.data.QuestionaireSTD.QN_REQUIRE_EDU
              );
              //ระดับการศึกษา
              setValue('QN_LEVEL_EDU', res.data.QuestionaireSTD.QN_LEVEL_EDU);
              //สาขาวิชาที่ต้องการศึกษาต่อ
              setValue(
                'QN_PROGRAM_EDU',
                res.data.QuestionaireSTD.QN_PROGRAM_EDU
              );
              if (res.data.QuestionaireSTD.QN_PROGRAM_EDU === '2') {
                setIsProgramEduIDShow(true); //แสดง TextBox
              } else {
                setIsProgramEduIDShow(false); //ซ่อน TextBox
              }
              setValue(
                'QN_PROGRAM_EDU_ID',
                res.data.QuestionaireSTD.QN_PROGRAM_EDU_ID
              );
              setTypeUnivID(res.data.QuestionaireSTD.QN_TYPE_UNIV);
              setValue('QN_TYPE_UNIV', res.data.QuestionaireSTD.QN_TYPE_UNIV);
              setCauseEduID(res.data.QuestionaireSTD.QN_CAUSE_EDU);
              setValue('QN_CAUSE_EDU', res.data.QuestionaireSTD.QN_CAUSE_EDU);

              if (res.data.QuestionaireSTD.QN_CAUSE_EDU === '0') {
                setIsShowCauseEduIDTxT(true); //แสดง TextBox
              } else {
                setIsShowCauseEduIDTxT(false); //ซ่อน TextBox
              }

              setProbEduID(res.data.QuestionaireSTD.QN_PROB_EDU);
              setValue('QN_PROB_EDU', res.data.QuestionaireSTD.QN_PROB_EDU);
              if (res.data.QuestionaireSTD.QN_PROB_EDU === '00') {
                setIsShowProbEduIDTxT(true); //แสดง TextBox
              } else {
                setIsShowProbEduIDTxT(false); //ซ่อน TextBox
              }
              //setAgencyTxT(res.data.QuestionaireSTD.PB_AGENCY_TXT);

              setValue(
                'QN_WORKNEED_POSITION',
                res.data.QuestionaireSTD.QN_WORKNEED_POSITION
              );
              setValue(
                'QN_SKILL_DEVELOPMENT',
                res.data.QuestionaireSTD.QN_SKILL_DEVELOPMENT
              );
              //การรับรางวัล
              setValue('PB_DIPLOMA', res.data.QuestionaireSTD.PB_DIPLOMA);
              setValue(
                'PB_DIPLOMA_NAME_TXT',
                res.data.QuestionaireSTD.PB_DIPLOMA_NAME_TXT
              );
              setValue('PB_AGENCY_TXT', res.data.QuestionaireSTD.PB_AGENCY_TXT);

              setValue(
                'QN_ADDPROGRAM1',
                res.data.QuestionaireSTD.QN_ADDPROGRAM1
              );
              if (res.data.QuestionaireSTD.QN_ADDPROGRAM1 === '1') {
                setProgram1Checked(true);
              } else {
                setProgram1Checked(false);
              }
              setValue(
                'QN_ADDPROGRAM2',
                res.data.QuestionaireSTD.QN_ADDPROGRAM2
              );
              if (res.data.QuestionaireSTD.QN_ADDPROGRAM2 === '1') {
                setProgram2Checked(true);
              } else {
                setProgram2Checked(false);
              }
              setValue(
                'QN_ADDPROGRAM3',
                res.data.QuestionaireSTD.QN_ADDPROGRAM3
              );
              if (res.data.QuestionaireSTD.QN_ADDPROGRAM3 === '1') {
                setProgram3Checked(true);
              } else {
                setProgram3Checked(false);
              }
              setValue(
                'QN_ADDPROGRAM4',
                res.data.QuestionaireSTD.QN_ADDPROGRAM4
              );
              if (res.data.QuestionaireSTD.QN_ADDPROGRAM4 === '1') {
                setProgram4Checked(true);
              } else {
                setProgram4Checked(false);
              }
              setValue(
                'QN_ADDPROGRAM5',
                res.data.QuestionaireSTD.QN_ADDPROGRAM5
              );
              if (res.data.QuestionaireSTD.QN_ADDPROGRAM5 === '1') {
                setProgram5Checked(true);
              } else {
                setProgram5Checked(false);
              }
              setValue(
                'QN_ADDPROGRAM6',
                res.data.QuestionaireSTD.QN_ADDPROGRAM6
              );
              if (res.data.QuestionaireSTD.QN_ADDPROGRAM6 === '1') {
                setProgram6Checked(true);
              } else {
                setProgram6Checked(false);
              }
              setValue(
                'QN_ADDPROGRAM7',
                res.data.QuestionaireSTD.QN_ADDPROGRAM7
              );
              setValue(
                'QN_ADDPROGRAM7_TXT',
                res.data.QuestionaireSTD.QN_ADDPROGRAM7_TXT
              );
              if (res.data.QuestionaireSTD.QN_ADDPROGRAM7 === '1') {
                setProgram7Checked(true);
                setIsShowProgram7TxT(true);
              } else {
                setProgram7Checked(false);
                setIsShowProgram7TxT(false);
              }
              setValue(
                'QN_ADDPROGRAM8',
                res.data.QuestionaireSTD.QN_ADDPROGRAM8
              );
              if (res.data.QuestionaireSTD.QN_ADDPROGRAM8 === '1') {
                setProgram8Checked(true);
              } else {
                setProgram8Checked(false);
              }
              setValue(
                'QN_ADDPROGRAM9',
                res.data.QuestionaireSTD.QN_ADDPROGRAM9
              );
              if (res.data.QuestionaireSTD.QN_ADDPROGRAM9 === '1') {
                setProgram9Checked(true);
              } else {
                setProgram9Checked(false);
              }

              //cm
              setValue(
                'QN_COMMENT_PROGRAM',
                res.data.QuestionaireSTD.QN_COMMENT_PROGRAM
              );
              setValue(
                'QN_COMMENT_LEARN',
                res.data.QuestionaireSTD.QN_COMMENT_LEARN
              );
              setValue(
                'QN_COMMENT_ACTIVITY',
                res.data.QuestionaireSTD.QN_COMMENT_ACTIVITY
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
              console.log('มีข้อมูลนี้ตอบแบบสอบถามแล้ว');
              //console.log("xxx=", response.data.bunditSTD.STD_ID);
              //localStorage.setItem("StudentData", response.data.id.data);
              //setError(false);
              //setIsLoading(false);
              //history.push("/app/dashboard");
            }, 1000);
          } else {
            //username ผิด
            //password ผิด
            console.log('ไม่พบข้อมูล');
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
  ///จังหวัด//
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
  ///ทหาร//
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
  ///นักบวช//
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
  ///สถานะการมีงานทำ//
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
  ///ประเภทงานที่ทำ//
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
  ///ความสามารถพิเศษ//
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
  //====================================
  ///ความตำแหน่งงาน//
  const [loadingPositionCr, setLoadingPositionCr] = useState(true);
  const [itemsPositionCr, setItemsPositionCr] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedPositionCr = false;
    async function PositionCrID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-position-end.php'
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
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedWorkNation = false;
    async function WorkNationID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-ref-nation-end.php'
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
    if (e.target.value === '1') {
      setIsShowMILITARY(true); //แสดง TextBox
      setisShowORDINATE(true);
    } else {
      setValue('QN_MILITARY_STATUS', ''); //กำหนดค่าว่าง
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
    { label: 'Loading ...', value: '' },
  ]);
  useEffect(() => {
    let unmountedJobsProvince = false;
    async function getJobProvinceID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/provinces-end.php'
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
    { label: 'Loading ...', value: '' },
  ]);
  useEffect(() => {
    let unmountedJobsDistrict = false;
    async function getJobDistrictID() {
      const response = await axios.get(
        `http://academic.pcru.ac.th/job-api/district-end.php?provincecode=${jobprovid}`
      );
      const body = await response.data.districtSTD;
      console.log('ccc> ', jobprovid);
      if (jobprovid != '0' && jobprovid != '') {
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
    { label: 'Loading ...', value: '' },
  ]);
  useEffect(() => {
    let unmountedJobSubDistrict = false;
    async function getJobSubDistrictID() {
      const response = await axios.get(
        `http://academic.pcru.ac.th/job-api/sub-district-end.php?districtcode=${jobdistid}`
      );
      const body = await response.data.subdistrictSTD;
      //console.log("ccc> ", body);
      if (jobprovid != '0' && jobprovid != '') {
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

  //====================================
  ///QN_WORKTYPE_ID ประเภทงานที่ทำ//
  const [loadingWorkTypeID, setLoadingWorkTypeID] = useState(true);
  const [itemsWorkTypeID, setItemsWorkTypeID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedWorkTypeID = false;
    async function WorkTypeID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-worktype-end.php'
      );
      const body = await response.data.WorkTypeSTD;
      //console.log("ccc> ", body);
      if (!unmountedWorkTypeID) {
        setItemsWorkTypeID(
          body.map(({ WORKTYPE_ID, WORKTYPE_NAME_TH }) => ({
            label: WORKTYPE_NAME_TH,
            value: WORKTYPE_ID,
          }))
        );
        setLoadingWorkTypeID(false);
      }
    }
    WorkTypeID();
    return () => {
      unmountedWorkTypeID = true;
    };
  }, []);
  //====================================

  //====================================
  ///QN_STRATEGIC_ID ประเภทงานที่ทำ//
  const [loadingStrategicID, setLoadingStrategicID] = useState(true);
  const [itemsStrategicID, setItemsStrategicID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedStrategicID = false;
    async function StrategicID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-strategic-end.php'
      );
      const body = await response.data.StrategicSTD;
      //console.log("ccc> ", body);
      if (!unmountedStrategicID) {
        setItemsStrategicID(
          body.map(({ st_id, st_name }) => ({
            label: st_name,
            value: st_id,
          }))
        );
        setLoadingStrategicID(false);
      }
    }
    StrategicID();
    return () => {
      unmountedStrategicID = true;
    };
  }, []);
  //====================================
  ///QN_WORK_SATISFY พึงพอใจงานที่ทำ/
  const [loadingSatisfyID, setLoadingSatisfyID] = useState(true);
  const [itemsSatisfyID, setItemsSatisfyID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedSatisfyID = false;
    async function SatisfyID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-worksatisfy-end.php'
      );
      const body = await response.data.worksatisfySTD;
      //console.log("ccc> ", body);
      if (!unmountedSatisfyID) {
        setItemsSatisfyID(
          body.map(({ WORK_SATISFY_ID, QN_SATISFY_NAME }) => ({
            label: QN_SATISFY_NAME,
            value: WORK_SATISFY_ID,
          }))
        );
        setLoadingSatisfyID(false);
      }
    }
    SatisfyID();
    return () => {
      unmountedSatisfyID = true;
    };
  }, []);
  //====================================

  //====================================
  ///QN_TIME_FINDWORK //
  const [loadingTimeFindWorkID, setLoadingTimeFindWorkID] = useState(true);
  const [itemsTimeFindWork, setItemsTimeFindWorkID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedTimeFindWorkID = false;
    async function TimeFindWorkID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-timefindwork-end.php'
      );
      const body = await response.data.timefindworkSTD;
      //console.log("ccc> ", body);
      if (!unmountedTimeFindWorkID) {
        setItemsTimeFindWorkID(
          body.map(({ QN_TIME_FINDWORK_ID, QN_TIME_FINDWORK }) => ({
            label: QN_TIME_FINDWORK,
            value: QN_TIME_FINDWORK_ID,
          }))
        );
        setLoadingTimeFindWorkID(false);
      }
    }
    TimeFindWorkID();
    return () => {
      unmountedTimeFindWorkID = true;
    };
  }, []);
  //====================================
  ///QN_MATCH_EDU //
  const [loadingMatchEduID, setLoadingMatchEduID] = useState(true);
  const [itemsMatchEdu, setItemsMatchEduID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedTimeMatchEduID = false;
    async function MatchEduID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-matchedu-end.php'
      );
      const body = await response.data.matcheduSTD;
      //console.log("ccc> ", body);
      if (!unmountedTimeMatchEduID) {
        setItemsMatchEduID(
          body.map(({ MATCH_EDU_ID, MATCH_EDU_NAME }) => ({
            label: MATCH_EDU_NAME,
            value: MATCH_EDU_ID,
          }))
        );
        setLoadingMatchEduID(false);
      }
    }
    MatchEduID();
    return () => {
      unmountedTimeMatchEduID = true;
    };
  }, []);
  //====================================
  ///QN_APPLY_EDU //
  const [loadingApplyEduID, setLoadingApplyEduID] = useState(true);
  const [itemsApplyEdu, setItemsApplyEduID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedTimeApplyEduID = false;
    async function ApplyEduID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-applyedu-end.php'
      );
      const body = await response.data.applyeduSTD;
      //console.log("ccc> ", body);
      if (!unmountedTimeApplyEduID) {
        setItemsApplyEduID(
          body.map(({ APPLY_ID, QN_APPLY_NAME }) => ({
            label: QN_APPLY_NAME,
            value: APPLY_ID,
          }))
        );
        setLoadingApplyEduID(false);
      }
    }
    ApplyEduID();
    return () => {
      unmountedTimeApplyEduID = true;
    };
  }, []);
  //====================================
  //====================================
  ///QN_REQUIRE_EDU //
  const [loadingRequireEduID, setLoadingRequireEduID] = useState(true);
  const [itemsRequireEdu, setItemsRequireEduID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountRequireEduID = false;
    async function RequireEduID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-eduneed-end.php'
      );
      const body = await response.data.eduneedSTD;
      //console.log("ccc> ", body);
      if (!unmountRequireEduID) {
        setItemsRequireEduID(
          body.map(({ REQUIRE_EDU_ID, REQUIRE_EDU_NAME }) => ({
            label: REQUIRE_EDU_NAME,
            value: REQUIRE_EDU_ID,
          }))
        );
        setLoadingRequireEduID(false);
      }
    }
    RequireEduID();
    return () => {
      unmountRequireEduID = true;
    };
  }, []);
  //==================================
  //====================================
  ///PB_DIPLOMA //
  const [loadingAwardID, setLoadingAwardID] = useState(true);
  const [itemAwardID, setItemAwardID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountAwardID = false;
    async function AwardID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-award-end.php'
      );
      const body = await response.data.awardSTD;
      //console.log("ccc> ", body);
      if (!unmountAwardID) {
        setItemAwardID(
          body.map(({ a_id, a_name }) => ({
            label: a_name,
            value: a_id,
          }))
        );
        setLoadingAwardID(false);
      }
    }
    AwardID();
    return () => {
      unmountAwardID = true;
    };
  }, []);
  //==================================
  //====================================
  ///QN_LEVEL_EDU //
  const [loadingLevelEduID, setLoadingLevelEduID] = useState(true);
  const [itemLevelEduID, setItemLevelEduID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountLevelEduID = false;
    async function LevelEduID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-lev-end.php'
      );
      const body = await response.data.edulevSTD;
      //console.log("ccc> ", body);
      if (!unmountLevelEduID) {
        setItemLevelEduID(
          body.map(({ LEV_ID, LEV_NAME_TH }) => ({
            label: LEV_NAME_TH,
            value: LEV_ID,
          }))
        );
        setLoadingLevelEduID(false);
      }
    }
    LevelEduID();
    return () => {
      unmountLevelEduID = true;
    };
  }, []);
  //==================================
  ///QN_PROGRAM_EDU //
  const [loadingProgramEdu, setLoadingProgramEdu] = useState(true);
  const [itemProgramEdu, setItemProgramEdu] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountProgramEdu = false;
    async function ProgramEdu() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-programeduid-end.php'
      );
      const body = await response.data.programeduidSTD;
      //console.log("ccc> ", body);
      if (!unmountProgramEdu) {
        setItemProgramEdu(
          body.map(({ PROGRAM_EDU_ID, PROGRAM_EDU_NAME }) => ({
            label: PROGRAM_EDU_NAME,
            value: PROGRAM_EDU_ID,
          }))
        );
        setLoadingProgramEdu(false);
      }
    }
    ProgramEdu();
    return () => {
      unmountProgramEdu = true;
    };
  }, []);
  //==================================
  ///QN_PROGRAM_EDU_ID //
  const [loadingProgramEduEID, setLoadingProgramEduEID] = useState(true);
  const [itemProgramEduEID, setItemProgramEduEID] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountProgramEduEID = false;
    async function ProgramEduEID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-programedu-end.php'
      );
      const body = await response.data.programeduSTD;
      //console.log("ccc> ", body);
      if (!unmountProgramEduEID) {
        setItemProgramEduEID(
          body.map(({ PROGRAM_ID, PROGRAM_NAME }) => ({
            label: PROGRAM_NAME,
            value: PROGRAM_ID,
          }))
        );
        setLoadingProgramEduEID(false);
      }
    }
    ProgramEduEID();
    return () => {
      unmountProgramEduEID = true;
    };
  }, []);
  //==================================

  ///QN_TYPE_UNIV //
  const [loadingTypeUni, setLoadingTypeUni] = useState(true);
  const [itemTypeUni, setItemTypeUni] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountTypeUni = false;
    async function TypeUni() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-typeuniv-end.php'
      );
      const body = await response.data.typeunivSTD;
      //console.log("ccc> ", body);
      if (!unmountTypeUni) {
        setItemTypeUni(
          body.map(({ TYPE_UNIV_ID, TYPE_UNIV_NAME }) => ({
            label: TYPE_UNIV_NAME,
            value: TYPE_UNIV_ID,
          }))
        );
        setLoadingTypeUni(false);
      }
    }
    TypeUni();
    return () => {
      unmountTypeUni = true;
    };
  }, []);
  //==================================
  ///QN_CAUSE_EDU //
  const [loadingCauseEdu, setLoadingCauseEdu] = useState(true);
  const [itemCauseEdu, setItemCauseEdu] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountCauseEdu = false;
    async function CauseEdu() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-cause-end.php'
      );
      const body = await response.data.causeeduSTD;
      //console.log("ccc> ", body);
      if (!unmountCauseEdu) {
        setItemCauseEdu(
          body.map(({ QN_CAUSE_EDU_ID, QN_CAUSE_EDU_NAME }) => ({
            label: QN_CAUSE_EDU_NAME,
            value: QN_CAUSE_EDU_ID,
          }))
        );
        setLoadingCauseEdu(false);
      }
    }
    CauseEdu();
    return () => {
      unmountCauseEdu = true;
    };
  }, []);
  //==================================
  ///QN_PROB_EDU //
  const [loadingProbEdu, setLoadingProbEdu] = useState(true);
  const [itemProbEdu, setItemProbEdu] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountProbEdu = false;
    async function ProbEdu() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-probedu-end.php'
      );
      const body = await response.data.probeduSTD;
      //console.log("ccc> ", body);
      if (!unmountProbEdu) {
        setItemProbEdu(
          body.map(({ PROB_EDU_ID, QN_PROB_EDU }) => ({
            label: QN_PROB_EDU,
            value: PROB_EDU_ID,
          }))
        );
        setLoadingProbEdu(false);
      }
    }
    ProbEdu();
    return () => {
      unmountProbEdu = true;
    };
  }, []);
  //==================================
  //
  ////
  ///QN_CAUSE_NOWORK //
  const [loadingCauseNoWork, setLoadingCauseNoWork] = useState(true);
  const [itemCauseNoWork, setItemCauseNoWork] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountCauseNoWork = false;
    async function CauseNoWork() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-causenowork-end.php'
      );
      const body = await response.data.causenoworkSTD;
      //console.log("ccc> ", body);
      if (!unmountCauseNoWork) {
        setItemCauseNoWork(
          body.map(({ NOWORK_ID, QN_CAUSE_NOWORK }) => ({
            label: QN_CAUSE_NOWORK,
            value: NOWORK_ID,
          }))
        );
        setLoadingCauseNoWork(false);
      }
    }
    CauseNoWork();
    return () => {
      unmountCauseNoWork = true;
    };
  }, []);
  //==================================
  //
  /////
  ///QN_PROB_FINDWORK //
  const [loadingProbFindWork, setLoadingProbFindWork] = useState(true);
  const [itemProbFindWork, setItemProbFindWork] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountProbFindWork = false;
    async function ProbFindWork() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-probfindwork-end.php'
      );
      const body = await response.data.probfindworkSTD;
      //console.log("ccc> ", body);
      if (!unmountProbFindWork) {
        setItemProbFindWork(
          body.map(({ PROB_ID, QN_PROB_FINDWORK }) => ({
            label: QN_PROB_FINDWORK,
            value: PROB_ID,
          }))
        );
        setLoadingProbFindWork(false);
      }
    }
    ProbFindWork();
    return () => {
      unmountProbFindWork = true;
    };
  }, []);
  //================================
  /////
  ///QN_WORKNEED_ID //
  const [loadingInterWorkNeed, setLoadingInterWorkNeed] = useState(true);
  const [itemInterWorkNeed, setItemInterWorkNeed] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountInterWorkNeed = false;
    async function InterWorkNeed() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-workneed-end.php'
      );
      const body = await response.data.workneedSTD;
      //console.log("ccc> ", body);
      if (!unmountInterWorkNeed) {
        setItemInterWorkNeed(
          body.map(({ WORKNEED_ID, WORKNEED_NAME_TH }) => ({
            label: WORKNEED_NAME_TH,
            value: WORKNEED_ID,
          }))
        );
        setLoadingInterWorkNeed(false);
      }
    }
    InterWorkNeed();
    return () => {
      unmountInterWorkNeed = true;
    };
  }, []);
  //==================================
  //====================================
  ///QN_WORK_NATION_NEED ประเทศที่ทำงาน//
  const [loadingWorkNationNeed, setLoadingWorkNationNeed] = useState(true);
  const [itemsWorkNationNeed, setItemsWorkNationNeed] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedWorkNationNeed = false;
    async function WorkNationIDNeed() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-neednation-end.php'
      );
      const body = await response.data.worknationSTD;
      //console.log("ccc> ", body);
      if (!unmountedWorkNationNeed) {
        setItemsWorkNationNeed(
          body.map(({ NATION_ID, NATION_NAME_ENG }) => ({
            label: NATION_NAME_ENG,
            value: NATION_ID,
          }))
        );
        setLoadingWorkNationNeed(false);
      }
    }
    WorkNationIDNeed();
    return () => {
      unmountedWorkNationNeed = true;
    };
  }, []);
  //====================================
  //
  //====================================
  ///QN_DISCLOSURE_AGREEMENT_ID เปิดเผยข้อมูล//
  const [loadingDisclosure, setLoadingDisclosure] = useState(true);
  const [itemsDisclosure, setItemsDisclosure] = useState([
    { label: 'Loading ...', value: '' },
  ]);

  useEffect(() => {
    let unmountedDisclosure = false;
    async function DisclosureID() {
      const response = await axios.get(
        'http://academic.pcru.ac.th/job-api/qn-disclosure-end.php'
      );
      const body = await response.data.disclosureSTD;
      //console.log("ccc> ", body);
      if (!unmountedDisclosure) {
        setItemsDisclosure(
          body.map(
            ({ DISCLOSURE_AGREEMENT_ID, DISCLOSURE_AGREEMENT_NAME_TH }) => ({
              label: DISCLOSURE_AGREEMENT_NAME_TH,
              value: DISCLOSURE_AGREEMENT_ID,
            })
          )
        );
        setLoadingDisclosure(false);
      }
    }
    DisclosureID();
    return () => {
      unmountedDisclosure = true;
    };
  }, []);
  //====================================
  //==

  //console.log("data > ",data);
  console.log('err=> ', errors);

  //[กรณีกดปุ่มบันทึกข้อมูล]
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
            message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
            type: 'success',
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
      console.log('error');
      setNotify({
        isOpen: true,
        message: 'การบันทึกข้อมูลผิดพลาดกรุณาติดต่อผู้ดูแลระบบ',
        type: 'warning',
      });
      //setIsAddLoading(false);
      //loading false
      //error true
      //errorMsg "มีบางอย่างผิดพลาด"
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
      setIsShowJob12567(true); //แสดง TextBox
      setIsShowJob34(false);
      setIsProgramEduIDShow(false);
      //setIsShowCauseNoWorkTxT(false); //แสดง TextBox
      if (e.target.value !== '2') {
        setisShowRequireEdu24(true);
        setIsShowRequireEdu(false);
      }
      if (e.target.value === '2') {
        setisShowRequireEdu24(false);
        setIsShowRequireEdu(true);
      }
      //setIsShowRequireEdu(true);
      setOccupID(e.target.value);
      setTalentID(e.target.value);
      setWorkNationID(e.target.value);
      setJobProvid('0');
      setJobDistid('0');
      setJobSubDistid('0');
      setWorkTypeID('0');
      setStrategicID('0');
      setSatisfyID('0');
      setTimeFindWorkID('0');
      setMatchEduID('0');
      setApplyEduID('0');
      setRequireEduID('0');
      setLevelEduID('0');
      setCauseEduID('99');
      setProbEduID('0');
      setCauseNoWorkID('99');
      setProbFindWorkID('0');
      setInterWorkNeedID('0');
    } else {
      setValue('QN_OCCUP_TYPE', ''); //กำหนดค่าว่าง
      setValue('QN_OCCUP_TYPE_TXT', ''); //กำหนดค่าว่าง
      setValue('QN_TALENT', ''); //กำหนดค่าว่าง
      setValue('QN_TALENT_TXT', ''); //กำหนดค่าว่าง
      setValue('QN_POS_ID', ''); //กำหนดค่าว่าง
      setSelectEditPosition({ e });
      setValue('QN_WORK_NATION', '');
      setValue('JOB_QN_PROVINCE_ID', '');
      setValue('JOB_QN_DISTRICT_ID', '');
      setValue('QN_WORK_TAMBON', '');
      setValue('QN_WORKTYPE_ID', '');
      setValue('QN_STRATEGIC_ID', '');
      setValue('QN_WORK_SATISFY', '');
      setValue('QN_WORK_SATISFY_TXT', '');
      setValue('QN_TIME_FINDWORK', '');
      setValue('QN_MATCH_EDU', '');
      setValue('QN_APPLY_EDU', '');
      setValue('QN_REQUIRE_EDU', '');
      setValue('QN_CAUSE_EDU', '');
      setValue('QN_PROB_EDU', '');
      setValue('QN_CAUSE_EDU_TXT', '');
      setValue('QN_PROB_EDU_TXT', '');
      setValue('QN_CAUSE_NOWORK', '');
      setValue('QN_CAUSE_NOWORK_TXT', '');
      setValue('QN_PROB_FINDWORK', '');
      setValue('QN_PROB_FINDWORK_TXT', '');
      setValue('QN_WORKNEED_ID', '');
      setValue('QN_WORK_NAME', '');
      setValue('QN_WORK_ADD', '');
      setValue('QN_WORK_MOO', '');
      setValue('QN_WORK_BUILDING', '');
      setValue('QN_WORK_SOI', '');
      setValue('QN_WORK_STREET', '');
      setValue('QN_WORK_ZIPCODE', '');
      setValue('QN_WORK_TEL', '');
      setValue('QN_WORK_FAX', '');
      setValue('QN_WORK_EMAIL', '');
      setValue('QN_SALARY', '');
      setValue('QN_MATCH_EDU', '');
      setValue('QN_APPLY_EDU', '');
      setValue('QN_STRATEGIC_ID', '');

      setIsShowJob12567(false); //ซ่อน TextBox
      setIsShowJob34(true);
      setIsProgramEduIDShow(false);
      if (e.target.value !== '4') {
        setisShowRequireEdu24(true);
        setIsShowRequireEdu(false);
      }
      if (e.target.value === '4') {
        setisShowRequireEdu24(false);
        setIsShowRequireEdu(true);
      }
    }
  };

  //setOccupID
  const OnchangeSelectOccupID = (e) => {
    setValue('QN_OCCUP_TYPE', e.target.value);
    setOccupID(e.target.value);

    if (e.target.value === '00') {
      setIsShow(true); //แสดง TextBox
    } else {
      setValue('QN_OCCUP_TYPE_TXT', ''); //กำหนดค่าว่าง
      setIsShow(false); //แสดง TextBox
    }
  };

  //setOccupID
  const OnchangeSelectTalentID = (e) => {
    setValue('QN_TALENT', e.target.value);
    setTalentID(e.target.value);
    if (e.target.value === '00') {
      setIsShowTalent(true); //แสดง TextBox
    } else {
      //setValue("QN_TALENT", ""); //กำหนดค่าว่าง
      setValue('QN_TALENT_TXT', ''); //กำหนดค่าว่าง
      setIsShowTalent(false); //แสดง TextBox
    }
  };
  //setWorkNationID
  const OnchangeSelectWorkNationID = (e) => {
    setValue('QN_WORK_NATION', e.target.value);
    setWorkNationID(e.target.value);
  };
  //setProvinceID
  const OnchangeSelectJobProvince = (e) => {
    setValue('JOB_QN_PROVINCE_ID', e.target.value);
    setValue('QN_WORK_TAMBON', '');
    setValue('JOB_QN_DISTRICT_ID', '');
    setJobProvid(e.target.value);
    setJobSubDistid(e.target.value);
    //setProvid(e.target.value);
  };
  //setDistrictID
  const OnchangeSelectDistrict = (e) => {
    setValue('JOB_QN_DISTRICT_ID', e.target.value);
    setJobDistid(e.target.value);
  };
  //setSubdistrictID
  const OnchangeSelectSubDistrict = (e) => {
    setValue('QN_WORK_TAMBON', e.target.value);
    setJobSubDistid(e.target.value);
  };

  //setWorkNationID
  const OnchangeSelectWorkTypeID = (e) => {
    setValue('QN_WORKTYPE_ID', e.target.value);
    setWorkTypeID(e.target.value);
  };
  //setStrategicID
  const OnchangeSelectStrategicID = (e) => {
    setValue('QN_STRATEGIC_ID', e.target.value);
    setStrategicID(e.target.value);
  };
  //setSatisfyID
  const OnchangeSelectSatisfyID = (e) => {
    setValue('QN_WORK_SATISFY', e.target.value);
    setSatisfyID(e.target.value);

    if (e.target.value === '00') {
      setIsSatisfyShow(true); //แสดง TextBox
    } else {
      setValue('QN_WORK_SATISFY_TXT', ''); //กำหนดค่าว่าง
      setIsSatisfyShow(false); //แสดง TextBox
    }
  };
  //QN_TIME_FINDWORK
  const OnchangeSelectTimeFindWorkID = (e) => {
    setValue('QN_TIME_FINDWORK', e.target.value);
    setTimeFindWorkID(e.target.value);
  };
  //QN_MATCH_EDU
  const OnchangeSelectMatchEduID = (e) => {
    setValue('QN_MATCH_EDU', e.target.value);
    setMatchEduID(e.target.value);
  };
  //QN_APPLY_EDU
  const OnchangeSelectApplyEduID = (e) => {
    setValue('QN_APPLY_EDU', e.target.value);
    setApplyEduID(e.target.value);
  };
  //QN_REQUIRE_EDU
  const OnchangeSelectRequireEduID = (e) => {
    setValue('QN_REQUIRE_EDU', e.target.value);
    setRequireEduID(e.target.value);
    if (e.target.value === '1') {
      //setIsShowJob12567(true); //แสดง TextBox
      //setIsShowJob34(false);
      setIsShowRequireEdu(true);
    } else {
      //setIsShowJob12567(false); //ซ่อน TextBox
      //setIsShowJob34(true);
      setIsShowRequireEdu(false);
      //setLevelEduID('0');
      setValue('QN_LEVEL_EDU', '');
    }
  };

  //setAwardID
  const OnchangeSelectAwardID = (e) => {
    setValue('PB_DIPLOMA', e.target.value);
    setDiplomaID(e.target.value);
    if (e.target.value !== '1') {
      setIsdiplomaShow(true); //แสดง TextBox
      setIsAgencyShow(true); //แสดง TextBox
    } else {
      setValue('PB_DIPLOMA_NAME_TXT', ''); //กำหนดค่าว่าง
      setValue('PB_AGENCY_TXT', ''); //กำหนดค่าว่าง
      setIsdiplomaShow(false); //แสดง TextBox
      setIsAgencyShow(false); //แสดง TextBox
    }
  };
  //EDU
  //setOccupID
  const OnchangeSelectLevelEduID = (e) => {
    setValue('QN_LEVEL_EDU', e.target.value);
    setLevelEduID(e.target.value);
  };
  //
  //setProgramEdu
  const OnchangeSelectProgramEdu = (e) => {
    setValue('QN_PROGRAM_EDU', e.target.value);
    setProgramEduID(e.target.value);

    if (e.target.value === '2') {
      setIsProgramEduIDShow(true); //แสดง TextBox
    } else {
      setValue('QN_PROGRAM_EDU_ID', ''); //กำหนดค่าว่าง
      setIsProgramEduIDShow(false); //แสดง TextBox
    }
  };
  //setProgramEduEID
  const OnchangeSelectProgramEduEID = (e) => {
    setValue('QN_PROGRAM_EDU_ID', e.target.value);
    setProgramEduID_ID(e.target.value);
  };

  //setTypeUnivID
  const OnchangeSelectTypeUnivID = (e) => {
    setValue('QN_TYPE_UNIV', e.target.value);
    setTypeUnivID(e.target.value);
  };
  //
  //setCauseEduID
  const OnchangeSelectCauseEduID = (e) => {
    setValue('QN_CAUSE_EDU', e.target.value);
    setCauseEduID(e.target.value);
    if (e.target.value === '0') {
      setIsShowCauseEduIDTxT(true); //แสดง TextBox
    } else {
      setValue('QN_CAUSE_EDU_TXT', ''); //กำหนดค่าว่าง
      setIsShowCauseEduIDTxT(false); //แสดง TextBox
    }
  };
  //setProbEduID
  const OnchangeSelectProbEduID = (e) => {
    setValue('QN_PROB_EDU', e.target.value);
    setProbEduID(e.target.value);
    if (e.target.value === '00') {
      setIsShowProbEduIDTxT(true); //แสดง TextBox
    } else {
      setValue('QN_PROB_EDU_TXT', ''); //กำหนดค่าว่าง
      setIsShowProbEduIDTxT(false); //แสดง TextBox
    }
  };
  ///P1
  const handleCm1Change = (e) => {
    //1
    setProgram1Checked(e.target.checked);
    if (e.target.checked === true) {
      setValue('QN_ADDPROGRAM1', '1');
    } else {
      setValue('QN_ADDPROGRAM1', '');
    }
  };

  ///no Work ไม่มีงานทำ
  //setCauseNoWorkID
  const OnchangeSelectCauseNoWorkID = (e) => {
    setValue('QN_CAUSE_NOWORK', e.target.value);
    setCauseNoWorkID(e.target.value);
    if (e.target.value === '0') {
      setIsShowCauseNoWorkTxT(true); //แสดง TextBox
    } else {
      setValue('QN_CAUSE_NOWORK_TXT', ''); //กำหนดค่าว่าง
      setIsShowCauseNoWorkTxT(false); //แสดง TextBox
    }
  };
  //
  //setProbFindWorkID
  const OnchangeSelectProbFindWorkID = (e) => {
    setValue('QN_PROB_FINDWORK', e.target.value);
    setProbFindWorkID(e.target.value);
    if (e.target.value === '00') {
      setIsShowProbFindWorkTxT(true); //แสดง TextBox
    } else {
      setValue('QN_PROB_FINDWORK_TXT', ''); //กำหนดค่าว่าง
      setIsShowProbFindWorkTxT(false); //แสดง TextBox
    }
  };
  //
  //setInterWorkNeedID
  const OnchangeSelectInterWorkNeedID = (e) => {
    setValue('QN_WORKNEED_ID', e.target.value);
    setInterWorkNeedID(e.target.value);
    if (e.target.value === '02') {
      setIsShowInter(true); //แสดง TextBox การทำงานต่างประเทศ
    } else {
      //setInterWorkNeedID('0');
      setIsShowInter(false); //แสดง TextBox ทำงานภายในประเทศ ค่าที่เกี่ยวข้องต้องเป็นค่าว่าง
      setValue('QN_WORKNEED_NATION', '');
      setValue('QN_WORKNEED_POSITION', '');
      setValue('QN_SKILL_DEVELOPMENT', '');
      setValue('QN_DISCLOSURE_AGREEMENT_ID', '');
      /* ว่าง
QN_WORKNEED_NATION
QN_WORKNEED_POSITION
QN_SKILL_DEVELOPMENT
QN_DISCLOSURE_AGREEMENT_ID

      */
    }
  };
  //
  //setDisclosureID
  const OnchangeSelectDisclosureID = (e) => {
    setValue('QN_DISCLOSURE_AGREEMENT_ID', e.target.value);
    setDisclosureID(e.target.value);
  };
  //setWorkNeedNationID
  const OnchangeSelectWorkNeedNationID = (e) => {
    setValue('QN_WORKNEED_NATION', e.target.value);
    setWorkNeedNationID(e.target.value);
  };
  //

  const handleCm2Change = (e) => {
    //2
    setProgram2Checked(e.target.checked);
    if (e.target.checked === true) {
      setValue('QN_ADDPROGRAM2', '1');
    } else {
      setValue('QN_ADDPROGRAM2', '');
    }
  };
  const handleCm3Change = (e) => {
    //3
    setProgram3Checked(e.target.checked);
    if (e.target.checked === true) {
      setValue('QN_ADDPROGRAM3', '1');
    } else {
      setValue('QN_ADDPROGRAM3', '');
    }
  };
  const handleCm4Change = (e) => {
    //4
    setProgram4Checked(e.target.checked);
    if (e.target.checked === true) {
      setValue('QN_ADDPROGRAM4', '1');
    } else {
      setValue('QN_ADDPROGRAM4', '');
    }
  };
  const handleCm5Change = (e) => {
    //5
    setProgram5Checked(e.target.checked);
    if (e.target.checked === true) {
      setValue('QN_ADDPROGRAM5', '1');
    } else {
      setValue('QN_ADDPROGRAM5', '');
    }
  };
  const handleCm6Change = (e) => {
    //6
    setProgram6Checked(e.target.checked);
    if (e.target.checked === true) {
      setValue('QN_ADDPROGRAM6', '1');
    } else {
      setValue('QN_ADDPROGRAM6', '');
    }
  };
  const handleCm7Change = (e) => {
    //7
    setProgram7Checked(e.target.checked);
    if (e.target.checked === true) {
      setValue('QN_ADDPROGRAM7', '1');
      //show
      setIsShowProgram7TxT(true); //แสดง TextBox
      //
    } else {
      setValue('QN_ADDPROGRAM7', '');
      setValue('QN_ADDPROGRAM7_TXT', '');
      setIsShowProgram7TxT(false); //แสดง TextBox
    }
  };
  const handleCm8Change = (e) => {
    //8
    setProgram8Checked(e.target.checked);
    if (e.target.checked === true) {
      setValue('QN_ADDPROGRAM8', '1');
    } else {
      setValue('QN_ADDPROGRAM8', '');
    }
  };
  const handleCm9Change = (e) => {
    //9
    setProgram9Checked(e.target.checked);
    if (e.target.checked === true) {
      setValue('QN_ADDPROGRAM9', '1');
    } else {
      setValue('QN_ADDPROGRAM9', '');
    }
  };

  let content = <Loading msg=' กำลังโหลด...' />;

  if (!isLoading) {
    if (isError) {
      content = 'error';
    } else {
      content = (
        <div>
          <form onSubmit={handleSubmit(handleSubmitAdd)}>
            <div className={classes.root}>
              <Typography className={classes.typo} variant='h3' size='sm'>
                ตอนที่ 1 ข้อมูลทั่วไป
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <div className='col-md-12'>
                    <label className='control-label'>1. สถานศึกษา : </label>
                    <small className={classes.typo}>
                      {'มหาวิทยาลัยราชภัฏเพชรบูรณ์'}
                    </small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>2. ชื่อ-สกุล : </label>
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
                      3. เลขประจำตัวประชาชน :{' '}
                    </label>
                    <small className={classes.typo}>{data.CITIZEN_ID}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      4. เลขประจำตัวนักศึกษา :{' '}
                    </label>
                    <small className={classes.typo}>{data.STD_ID}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      5. วัน/เดือน/ปี เกิด :{' '}
                    </label>
                    <small className={classes.typo}>{data.BIRTHDAY}</small>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className='col-md-12'>
                    <label className='control-label'>6. สาขา : </label>
                    <small className={classes.typo}>
                      {data.UNI_PROGRAM_NAME}
                    </small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>7. คณะ : </label>
                    <small className={classes.typo}>{data.FAC_NAME}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      8. สำเร็จการศึกษาหลักสูตร :{' '}
                    </label>
                    <small className={classes.typo}>{data.CURR_NAME}</small>
                  </div>
                  <div className='col-md-12'>
                    <label className='control-label'>
                      9. คะแนนเฉลี่ยตลอดหลักสูตร (GPA) :{' '}
                    </label>
                    <small className={classes.typo}>{data.GPA}</small>
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={0}>
                <Typography className={classes.typo} variant='h5' size='sm'>
                  ที่อยู่ปัจจุบัน
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={4}>
                    <div className='col-md-12'>
                      <label className='control-label'>เลขที่ </label>
                      <small className={classes.typo}>{data.HOMEADD}</small>
                    </div>
                    <div className='col-md-12'>
                      <label className='control-label'>หมู่ </label>
                      <small className={classes.typo}>{data.MOO}</small>
                    </div>
                    <div className='col-md-12'>
                      <label className='control-label'>ซอย </label>
                      <small className={classes.typo}>{data.SOI}</small>
                    </div>
                    <div className='col-md-12'>
                      <label className='control-label'>ถนน </label>
                      <small className={classes.typo}>{data.STREET}</small>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div className='col-md-12'>
                      <label className='control-label'>ตำบล </label>
                      <small className={classes.typo}>{data.TUMBOL}</small>
                    </div>
                    <div className='col-md-12'>
                      <label className='control-label'>อำเภอ </label>
                      <small className={classes.typo}>{data.AMPHUR}</small>
                    </div>
                    <div className='col-md-12'>
                      <label className='control-label'>จังหวัด </label>
                      <small className={classes.typo}>
                        {data.PROVINCE_NAME}
                      </small>
                    </div>
                    <div className='col-md-12'>
                      <label className='control-label'>รหัสไปรษณีย์ </label>
                      <small className={classes.typo}>{data.ZIPCODE}</small>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div className='col-md-12'>
                      <label className='control-label'>
                        เบอร์โทรศัพท์ (แก้ไขได้){' '}
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
                          primary='ภูมิลำเนา (จังหวัด)'
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
                          placeHolder={'-เลือกจังหวัด-'}
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
                            primary='สถานะการเกณฑ์ทหาร : (เฉพาะเพศชาย)'
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
                            placeHolder={'-เลือกสถานะการเกณฑ์ทหารฯ-'}
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
                            primary='สถานะการเป็นนักบวชปัจจุบัน'
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
                            placeHolder={'-เลือกสถานะการเป็นนักบวช-'}
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
                          primary='สถานะภาพการทำงานปัจจุบัน'
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
                          placeHolder={'-เลือกสถานะภาพการทำงานปัจจุบัน-'}
                          onChange={(e) => OnchangeSelectJobStatusID(e)}
                          options={itemsJob}
                        />
                      </small>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {sShowJob12567 ? (
                <Grid container spacing={0}>
                  <Typography className={classes.typo} variant='h3' size='sm'>
                    ตอนที่ 2 สำหรับผู้ที่ทำงานแล้ว
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
                            primary='ประเภทงานที่ทำ'
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
                            placeHolder={'-เลือกประเภทงานที่ทำ-'}
                            onChange={(e) => OnchangeSelectOccupID(e)}
                            options={itemsOcc}
                          />
                        </small>
                        {isShow ? (
                          <small className={classes.typo}>
                            <TextField
                              {...register('QN_OCCUP_TYPE_TXT')}
                              variant='outlined'
                              label='อื่นๆ ระบุ'
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
                            primary='ความสามารถพิเศษ'
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
                            placeHolder={'-เลือกความสามารถพิเศษ-'}
                            onChange={(e) => OnchangeSelectTalentID(e)}
                            options={itemsTalent}
                          />
                        </small>
                        {isShowTalent ? (
                          <small className={classes.typo}>
                            <TextField
                              {...register('QN_TALENT_TXT')}
                              variant='outlined'
                              label='อื่นๆ ระบุ'
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
                            primary='ชื่อตำแหน่งงาน'
                            secondary={secondary ? 'Secondary text' : null}
                            style={{ color: orange[500], fontSize: 30 }}
                          />
                        </ListItem>

                        <small className={classes.typo}>
                          <SSelect
                            {...register('QN_POS_ID')}
                            error={errors.QN_POS_ID?.message}
                            value={selectEditPosition.selectedOption}
                            onChange={onChangeSelectPositionEditHandler}
                            options={itemsPositionCr}
                            styles={customStyles}
                          />
                          {errors.QN_POS_ID ? (
                            <div>
                              <span className='text-danger'>
                                {'กรุณาเลือกตำแหน่งงาน'}
                              </span>
                            </div>
                          ) : null}
                        </small>
                      </div>
                    </Grid>

                    <Grid container spacing={0}>
                      <Typography
                        className={classes.typo}
                        variant='h3'
                        size='sm'
                      >
                        สถานที่ทำงานปัจจุบัน
                      </Typography>

                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              ชื่อหน่วยงาน{' '}
                            </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_NAME')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_NAME}
                                helperText={errors.QN_WORK_NAME?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>เลขที่ </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_ADD')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_ADD}
                                helperText={errors.QN_WORK_ADD?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>หมู่ </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_MOO')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_MOO}
                                helperText={errors.QN_WORK_MOO?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>อาคาร/ตึก </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_BUILDING')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_BUILDING}
                                helperText={errors.QN_WORK_BUILDING?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>ตรอก/ซอย </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_SOI')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_SOI}
                                helperText={errors.QN_WORK_SOI?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>ถนน </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_STREET')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_STREET}
                                helperText={errors.QN_WORK_STREET?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className='col-md-12'>
                            <label className='control-label'>จังหวัด </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('JOB_QN_PROVINCE_ID') }}
                                error={errors.JOB_QN_PROVINCE_ID?.message}
                                defaultValue={jobprovid}
                                value={jobprovid}
                                placeHolder={'-เลือกจังหวัด-'}
                                onChange={(e) => OnchangeSelectJobProvince(e)}
                                options={itemsJobsProvince}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className='col-md-12'>
                            <label className='control-label'>อำเภอ </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('JOB_QN_DISTRICT_ID') }}
                                error={errors.JOB_QN_DISTRICT_ID?.message}
                                defaultValue={jobdistid}
                                value={jobdistid}
                                placeHolder={'-เลือกอำเภอ-'}
                                onChange={(e) => OnchangeSelectDistrict(e)}
                                options={itemsJobsDistrict}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className='col-md-12'>
                            <label className='control-label'>ตำบล </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('QN_WORK_TAMBON') }}
                                error={errors.QN_WORK_TAMBON?.message}
                                defaultValue={jobsubdistid}
                                value={jobsubdistid}
                                placeHolder={'-เลือกตำบล-'}
                                onChange={(e) => OnchangeSelectSubDistrict(e)}
                                options={itemsJobSubDistrict}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              รหัสไปรษณีย์{' '}
                            </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_ZIPCODE')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_ZIPCODE}
                                helperText={errors.QN_WORK_ZIPCODE?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className='col-md-12'>
                            <label className='control-label'>โทรศัพท์ </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_TEL')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_TEL}
                                helperText={errors.QN_WORK_TEL?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className='col-md-12'>
                            <label className='control-label'>โทรสาร </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_FAX')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_FAX}
                                helperText={errors.QN_WORK_FAX?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className='col-md-12'>
                            <label className='control-label'>อีเมล์ </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORK_EMAIL')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORK_EMAIL}
                                helperText={errors.QN_WORK_EMAIL?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              ประเทศที่ทำงาน{' '}
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('QN_WORK_NATION') }}
                                error={errors.QN_WORK_NATION?.message}
                                defaultValue={worknationid}
                                value={worknationid}
                                placeHolder={'-ประเทศที่ทำงาน-'}
                                onChange={(e) => OnchangeSelectWorkNationID(e)}
                                options={itemsWorkNation}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              ประเภทกิจการ{' '}
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('QN_WORKTYPE_ID') }}
                                error={errors.QN_WORKTYPE_ID?.message}
                                defaultValue={worktypeid}
                                value={worktypeid}
                                placeHolder={'-โปรดระบุ-'}
                                onChange={(e) => OnchangeSelectWorkTypeID(e)}
                                options={itemsWorkTypeID}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              สถานประกอบการอุตสาหกรรมเป้าหมาย ตามยุทธศาสตร์ชาติ
                              20 ปี(พ.ศ.2561-2580){' '}
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('QN_STRATEGIC_ID') }}
                                error={errors.QN_STRATEGIC_ID?.message}
                                defaultValue={strategicid}
                                value={strategicid}
                                placeHolder={'-โปรดระบุ-'}
                                onChange={(e) => OnchangeSelectStrategicID(e)}
                                options={itemsStrategicID}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              เงือนเดือน/รายได้เฉลี่ยต่อเดือน(บาท)
                            </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_SALARY')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_SALARY}
                                helperText={errors.QN_SALARY?.message}
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              ท่านมีความพอใจต่องานที่ทำหรือไม่ โปรดระบุ
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('QN_WORK_SATISFY') }}
                                error={errors.QN_WORK_SATISFY?.message}
                                defaultValue={satisfyid}
                                value={satisfyid}
                                placeHolder={'-เลือก-'}
                                onChange={(e) => OnchangeSelectSatisfyID(e)}
                                options={itemsSatisfyID}
                              />
                            </small>
                            {isSatisfyShow ? (
                              <small className={classes.typo}>
                                <TextField
                                  {...register('QN_WORK_SATISFY_TXT')}
                                  variant='outlined'
                                  label='อื่นๆ ระบุ'
                                  fullWidth
                                  error={!!errors.QN_WORK_SATISFY_TXT}
                                  helperText={
                                    errors.QN_WORK_SATISFY_TXT?.message
                                  }
                                  InputProps={{
                                    readOnly: false,
                                  }}
                                  size='small'
                                />
                              </small>
                            ) : null}
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              หลังจากสำเร็จการศึกษาได้งานทำในระยะเวลาเท่าไร
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('QN_TIME_FINDWORK') }}
                                error={errors.QN_TIME_FINDWORK?.message}
                                defaultValue={timefindworkid}
                                value={timefindworkid}
                                placeHolder={'-โปรดระบุ-'}
                                onChange={(e) =>
                                  OnchangeSelectTimeFindWorkID(e)
                                }
                                options={itemsTimeFindWork}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              งานที่ทำตรงกับสาขาที่ได้สำเร็จการศึกษาหรือไม่
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('QN_MATCH_EDU') }}
                                error={errors.QN_MATCH_EDU?.message}
                                defaultValue={matcheduid}
                                value={matcheduid}
                                placeHolder={'-โปรดระบุ-'}
                                onChange={(e) => OnchangeSelectMatchEduID(e)}
                                options={itemsMatchEdu}
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              ท่านสามารถนำความรู้จากสาขาวิชาที่เรียนมาประยุกต์ใช้กับหน้าที่การงานที่ทำอยู่ขณะนี้เพียงใด
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('QN_APPLY_EDU') }}
                                error={errors.QN_APPLY_EDU?.message}
                                defaultValue={applyeduid}
                                value={applyeduid}
                                placeHolder={'-โปรดระบุ-'}
                                onChange={(e) => OnchangeSelectApplyEduID(e)}
                                options={itemsApplyEdu}
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
                  <Typography className={classes.typo} variant='h3' size='sm'>
                    ตอนที่ 3 สำหรับผู้ที่ยังไม่ได้ทำงาน
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <div className='col-md-12'>
                        <label className='control-label'>
                          สาเหตุที่ยังไม่ได้ทำงาน
                        </label>
                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_CAUSE_NOWORK') }}
                            error={errors.QN_CAUSE_NOWORK?.message}
                            defaultValue={causnoworkid}
                            value={causnoworkid}
                            placeHolder={'-เลือกสาเหตุ-'}
                            onChange={(e) => OnchangeSelectCauseNoWorkID(e)}
                            options={itemCauseNoWork}
                          />
                        </small>
                        {isShowCauseNoWorktxt ? (
                          <small className={classes.typo}>
                            <TextField
                              {...register('QN_CAUSE_NOWORK_TXT')}
                              variant='outlined'
                              label='อื่นๆ ระบุ'
                              fullWidth
                              error={!!errors.QN_CAUSE_NOWORK_TXT}
                              helperText={errors.QN_CAUSE_NOWORK_TXT?.message}
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
                      <div className='col-md-12'>
                        <label className='control-label'>
                          ท่านมีปัญหาในการหางานทำหลังสำเร็จการศึกษาหรือไม่
                        </label>
                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_PROB_FINDWORK') }}
                            error={errors.QN_PROB_FINDWORK?.message}
                            defaultValue={probfindwork}
                            value={probfindwork}
                            placeHolder={'-เลือกปัญหา-'}
                            onChange={(e) => OnchangeSelectProbFindWorkID(e)}
                            options={itemProbFindWork}
                          />
                        </small>
                        {isShowProbFindWorktxt ? (
                          <small className={classes.typo}>
                            <TextField
                              {...register('QN_PROB_FINDWORK_TXT')}
                              variant='outlined'
                              label='อื่นๆ ระบุ'
                              fullWidth
                              error={!!errors.QN_PROB_FINDWORK_TXT}
                              helperText={errors.QN_PROB_FINDWORK_TXT?.message}
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
                      <div className='col-md-12'>
                        <label className='control-label'>
                          ความต้องการทำงาน
                        </label>
                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_WORKNEED_ID') }}
                            error={errors.QN_WORKNEED_ID?.message}
                            defaultValue={interworkneedid}
                            value={interworkneedid}
                            placeHolder={'-เลือกสาเหตุ-'}
                            onChange={(e) => OnchangeSelectInterWorkNeedID(e)}
                            options={itemInterWorkNeed}
                          />
                        </small>
                      </div>
                    </Grid>
                    {isShowInter ? (
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              ประเทศที่ต้องการทำงาน
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{ ...register('QN_WORKNEED_NATION') }}
                                error={errors.QN_WORKNEED_NATION?.message}
                                defaultValue={workneednationid}
                                value={workneednationid}
                                placeHolder={'-โปรดระบุ-'}
                                onChange={(e) =>
                                  OnchangeSelectWorkNeedNationID(e)
                                }
                                options={itemsWorkNationNeed}
                              />
                            </small>
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              ตำแหน่งที่ต้องการทำงาน{' '}
                            </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_WORKNEED_POSITION')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_WORKNEED_POSITION}
                                helperText={
                                  errors.QN_WORKNEED_POSITION?.message
                                }
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              ความต้องการพัฒนาทักษะ หลักสูตร{' '}
                            </label>
                            <small className={classes.typo}>
                              <TextField
                                {...register('QN_SKILL_DEVELOPMENT')}
                                variant='outlined'
                                fullWidth
                                error={!!errors.QN_SKILL_DEVELOPMENT}
                                helperText={
                                  errors.QN_SKILL_DEVELOPMENT?.message
                                }
                                InputProps={{
                                  readOnly: false,
                                }}
                                size='small'
                              />
                            </small>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className='col-md-12'>
                            <label className='control-label'>
                              ความประสงค์ในการเปิดเผยข้อมูลแก่นายจ้าง/สถานประกอบการ
                            </label>
                            <small className={classes.typo}>
                              <SelectProvince
                                refs={{
                                  ...register('QN_DISCLOSURE_AGREEMENT_ID'),
                                }}
                                error={
                                  errors.QN_DISCLOSURE_AGREEMENT_ID?.message
                                }
                                defaultValue={disclosureid}
                                value={disclosureid}
                                placeHolder={'-โปรดระบุ-'}
                                onChange={(e) => OnchangeSelectDisclosureID(e)}
                                options={itemsDisclosure}
                              />
                            </small>
                          </div>
                        </Grid>
                      </Grid>
                    ) : null}
                  </Grid>
                </Grid>
              ) : null}
              {isShowRequireEdu24 ? (
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={3}>
                    <div className='col-md-12'>
                      <label className='control-label'>
                        ความต้องการศึกษาต่อ
                      </label>
                      <small className={classes.typo}>
                        <SelectProvince
                          refs={{ ...register('QN_REQUIRE_EDU') }}
                          error={errors.QN_REQUIRE_EDU?.message}
                          defaultValue={requireeduid}
                          value={requireeduid}
                          placeHolder={'-โปรดระบุ-'}
                          onChange={(e) => OnchangeSelectRequireEduID(e)}
                          options={itemsRequireEdu}
                        />
                      </small>
                    </div>
                  </Grid>
                </Grid>
              ) : null}
              {isShowRequireEdu ? (
                <Grid container spacing={0}>
                  <Typography className={classes.typo} variant='h3' size='sm'>
                    ตอนที่ 4 การศึกษาต่อ
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <div className='col-md-12'>
                        <label className='control-label'>
                          1. ระดับการศึกษาที่ท่านต้องการศึกษาต่อ/กำลังศึกษาต่อ
                        </label>
                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_LEVEL_EDU') }}
                            error={errors.QN_LEVEL_EDU?.message}
                            defaultValue={leveleduid}
                            value={leveleduid}
                            placeHolder={'-เลือก-'}
                            onChange={(e) => OnchangeSelectLevelEduID(e)}
                            options={itemLevelEduID}
                          />
                        </small>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <div className='col-md-12'>
                        <label className='control-label'>
                          2. สาขาวิชาที่ท่านต้องการศึกษา/กำลังศึกษาต่อ
                        </label>
                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_PROGRAM_EDU') }}
                            error={errors.QN_PROGRAM_EDU?.message}
                            defaultValue={programeduid}
                            value={programeduid}
                            placeHolder={'-เลือก-'}
                            onChange={(e) => OnchangeSelectProgramEdu(e)}
                            options={itemProgramEdu}
                          />
                        </small>
                        {IsProgramEduIDShow ? (
                          <small className={classes.typo}>
                            <SelectProvince
                              refs={{ ...register('QN_PROGRAM_EDU_ID') }}
                              error={errors.QN_PROGRAM_EDU_ID?.message}
                              defaultValue={programeduid_id}
                              value={programeduid_id}
                              placeHolder={'-เลือก-'}
                              onChange={(e) => OnchangeSelectProgramEduEID(e)}
                              options={itemProgramEduEID}
                            />
                          </small>
                        ) : null}
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <div className='col-md-12'>
                        <label className='control-label'>
                          3.
                          ประเภทของสถาบันการศึกษา/มหาวิทยาลัยที่ท่านต้องการศึกษา/กำลังศึกษาต่อ
                        </label>
                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_TYPE_UNIV') }}
                            error={errors.QN_TYPE_UNIV?.message}
                            defaultValue={typeunvid}
                            value={typeunvid}
                            placeHolder={'-เลือก-'}
                            onChange={(e) => OnchangeSelectTypeUnivID(e)}
                            options={itemTypeUni}
                          />
                        </small>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className='col-md-12'>
                        <label className='control-label'>
                          4. เหตุผลที่ทำให้ท่านตัดสินใจศึกษาต่อ
                        </label>
                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_CAUSE_EDU') }}
                            error={errors.QN_CAUSE_EDU?.message}
                            defaultValue={causeeduid}
                            value={causeeduid}
                            placeHolder={'-เลือกสาเหตุ-'}
                            onChange={(e) => OnchangeSelectCauseEduID(e)}
                            options={itemCauseEdu}
                          />
                        </small>
                        {isShowCauseeduIdtxt ? (
                          <small className={classes.typo}>
                            <TextField
                              {...register('QN_CAUSE_EDU_TXT')}
                              variant='outlined'
                              label='อื่นๆ ระบุ'
                              fullWidth
                              error={!!errors.QN_CAUSE_EDU_TXT}
                              helperText={errors.QN_CAUSE_EDU_TXT?.message}
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
                      <div className='col-md-12'>
                        <label className='control-label'>
                          5. ท่านมีปัญหาในการศึกษาต่อหรือไม่
                        </label>
                        <small className={classes.typo}>
                          <SelectProvince
                            refs={{ ...register('QN_PROB_EDU') }}
                            error={errors.QN_PROB_EDU?.message}
                            defaultValue={probeduid}
                            value={probeduid}
                            placeHolder={'-เลือกสาเหตุ-'}
                            onChange={(e) => OnchangeSelectProbEduID(e)}
                            options={itemProbEdu}
                          />
                        </small>
                        {isShowProbeduIdtxt ? (
                          <small className={classes.typo}>
                            <TextField
                              {...register('QN_PROB_EDU_TXT')}
                              variant='outlined'
                              label='อื่นๆ ระบุ'
                              fullWidth
                              error={!!errors.QN_PROB_EDU_TXT}
                              helperText={errors.QN_PROB_EDU_TXT?.message}
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

              <Grid container spacing={0}>
                <Typography className={classes.typo} variant='h3' size='sm'>
                  ตอนที่ 5 ข้อเสนอแนะ
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <div className='col-md-12'>
                      <label className='control-label'>
                        1. ท่านคิดว่าในหลักสูตรของสถาบัน
                        ควรเพิ่มรายวิชาหรือความรู้เรื่องใดที่จะเอื้อประโยชน์ต่อการประกอบอาชีพของท่านได้มากยิ่งขึ้น
                        (เลือกได้มากกว่า 1 ข้อ)
                      </label>
                      <small className={classes.typo}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={4}>
                            <div className='col-md-12'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={progrom1state}
                                    onChange={handleCm1Change}
                                  />
                                }
                                label='ภาษาอังกฤษ'
                                refs={{ ...register('QN_ADDPROGRAM1') }}
                                error={errors.QN_ADDPROGRAM1?.message}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className='col-md-12'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={progrom2state}
                                    onChange={handleCm2Change}
                                  />
                                }
                                label='คอมพิวเตอร์'
                                refs={{ ...register('QN_ADDPROGRAM2') }}
                                error={errors.QN_ADDPROGRAM2?.message}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className='col-md-12'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={progrom3state}
                                    onChange={handleCm3Change}
                                  />
                                }
                                label='บัญชี'
                                refs={{ ...register('QN_ADDPROGRAM3') }}
                                error={errors.QN_ADDPROGRAM3?.message}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className='col-md-12'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={progrom4state}
                                    onChange={handleCm4Change}
                                  />
                                }
                                label='การใช้อินเตอร์เน็ต'
                                refs={{ ...register('QN_ADDPROGRAM4') }}
                                error={errors.QN_ADDPROGRAM4?.message}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className='col-md-12'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={progrom5state}
                                    onChange={handleCm5Change}
                                  />
                                }
                                label='การฝึกปฏิบัติงานจริง'
                                refs={{ ...register('QN_ADDPROGRAM5') }}
                                error={errors.QN_ADDPROGRAM5?.message}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className='col-md-12'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={progrom6state}
                                    onChange={handleCm6Change}
                                  />
                                }
                                label='เทคนิคการวิจัย'
                                refs={{ ...register('QN_ADDPROGRAM6') }}
                                error={errors.QN_ADDPROGRAM6?.message}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className='col-md-12'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={progrom8state}
                                    onChange={handleCm8Change}
                                  />
                                }
                                label='ภาษาจีน'
                                refs={{ ...register('QN_ADDPROGRAM8') }}
                                error={errors.QN_ADDPROGRAM8?.message}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className='col-md-12'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={progrom9state}
                                    onChange={handleCm9Change}
                                  />
                                }
                                label='ภาษาในอาเซียน'
                                refs={{ ...register('QN_ADDPROGRAM9') }}
                                error={errors.QN_ADDPROGRAM9?.message}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className='col-md-12'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={progrom7state}
                                    onChange={handleCm7Change}
                                  />
                                }
                                label='อื่น ๆ'
                                refs={{ ...register('QN_ADDPROGRAM7') }}
                                error={errors.QN_ADDPROGRAM7?.message}
                              />
                              {isShowProgram7TxT ? (
                                <small className={classes.typo}>
                                  <TextField
                                    {...register('QN_ADDPROGRAM7_TXT')}
                                    variant='outlined'
                                    label='ระบุเพิ่มเติม'
                                    fullWidth
                                    error={!!errors.QN_ADDPROGRAM7_TXT}
                                    helperText={
                                      errors.QN_ADDPROGRAM7_TXT?.message
                                    }
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
                      </small>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <div className='col-md-12'>
                      <label className='control-label'>
                        2. ข้อเสนอแนะเกี่ยวกับหลักสูตรและสาขาวิชาที่เรียน{' '}
                      </label>
                      <small className={classes.typo}>
                        <TextField
                          {...register('QN_COMMENT_PROGRAM')}
                          variant='outlined'
                          fullWidth
                          error={!!errors.QN_COMMENT_PROGRAM}
                          helperText={errors.QN_COMMENT_PROGRAM?.message}
                          InputProps={{
                            readOnly: false,
                          }}
                          size='small'
                        />
                      </small>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <div className='col-md-12'>
                      <label className='control-label'>
                        3. ข้อเสนอแนะเกี่ยวกับการเรียนการสอน{' '}
                      </label>
                      <small className={classes.typo}>
                        <TextField
                          {...register('QN_COMMENT_LEARN')}
                          variant='outlined'
                          fullWidth
                          error={!!errors.QN_COMMENT_LEARN}
                          helperText={errors.QN_COMMENT_LEARN?.message}
                          InputProps={{
                            readOnly: false,
                          }}
                          size='small'
                        />
                      </small>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div className='col-md-12'>
                      <label className='control-label'>
                        4. ข้อเสนอแนะเกี่ยวกับกิจกรรมพัฒนานักศึกษา{' '}
                      </label>
                      <small className={classes.typo}>
                        <TextField
                          {...register('QN_COMMENT_ACTIVITY')}
                          variant='outlined'
                          fullWidth
                          error={!!errors.QN_COMMENT_ACTIVITY}
                          helperText={errors.QN_COMMENT_ACTIVITY?.message}
                          InputProps={{
                            readOnly: false,
                          }}
                          size='small'
                        />
                      </small>
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={0}>
                <Typography className={classes.typo} variant='h3' size='sm'>
                  ตอนที่ 6 การรับรางวัล
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <div className='col-md-12'>
                      <label className='control-label'>
                        เคยได้รับประกาศเกียรติคุณยกย่องในด้านใด หลังจบการศึกษา
                        เคยรับรางวัล ดังนี้
                      </label>
                      <small className={classes.typo}>
                        <SelectProvince
                          refs={{ ...register('PB_DIPLOMA') }}
                          error={errors.PB_DIPLOMA?.message}
                          defaultValue={diplomaid}
                          value={diplomaid}
                          placeHolder={'-เลือก-'}
                          onChange={(e) => OnchangeSelectAwardID(e)}
                          options={itemAwardID}
                        />
                      </small>
                      {isdiplomaShow ? (
                        <small className={classes.typo}>
                          <TextField
                            {...register('PB_DIPLOMA_NAME_TXT')}
                            variant='outlined'
                            label='ชื่อรางวัล'
                            fullWidth
                            error={!!errors.PB_DIPLOMA_NAME_TXT}
                            helperText={errors.PB_DIPLOMA_NAME_TXT?.message}
                            InputProps={{
                              readOnly: false,
                            }}
                            size='small'
                          />

                          <TextField
                            {...register('PB_AGENCY_TXT')}
                            variant='outlined'
                            label='หน่วยงานที่มอบรางวัล'
                            fullWidth
                            error={!!errors.PB_AGENCY_TXT}
                            helperText={errors.PB_AGENCY_TXT?.message}
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
                      <Controls.Button type='submit' text='บันทึกข้อมูล' />
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
      <PageTitle title='แบบสอบถามภาวะการมีงานทำของบัณฑิต ปีการศึกษา 2564 (บัณฑิตที่จบปีการศึกษา 2563)' />
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
