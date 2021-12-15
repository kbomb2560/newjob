import React, { useMemo, useReducer, useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  Grid,
  Button,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import axios from "../../../axios/axios-pmis";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { string, object } from "yup";
import Select from "react-select";
import { makeStyles } from "@material-ui/core/styles";
import ErrorPage from "../../../components/Error/ErrorPage";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },

  tableRow: {
    "&$selected, &$selected:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  },
  hover: {},
  selected: {},
}));

const fetchDataDegree = async () => {
  const res = await axios.get(except-subject/degree/degree-select);
  return res.data;
};

const fetchDataOldSchool = async () => {
  const res = await axios.get(except-subject/old-school/old-school-select);
  return res.data;
};

const editDocument = async (data) => {
  const endPoint = except-subject/document/document;
  const res = await axios.put(endPoint, data);
  return res.data;
};

const SectionFormEditDocument = (props) => {
  const styles = useStyles();
  const [selectEditDegree, setSelectEditDegree] = useState({
    selectedOption: [],
  });
  const [selectEditOldSchool, setSelectEditOldSchool] = useState({
    selectedOption: [],
  });

  const resDataDegree = useQuery(["dataDegree"], () => fetchDataDegree(), {
    refetchOnWindowFocus: false,
    enabled: props.open,
  });

  const resDataOldSchool = useQuery(
    ["dataOldSchool"],
    () => fetchDataOldSchool(),
    {
      refetchOnWindowFocus: false,
      enabled: props.open,
    }
  );

  const resEditDocument = useMutation(editDocument, {
    onSuccess: (res) => {
      props.close();
      props.refreshData();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const schema = object().shape({
    studentId: string()
      .required("กรุณากรอกรหัสนักศึกษา")
      .length(12, "รหัสนักศึกษา 12 หลัก")
      .matches(/^[0-9]*$/, "ระบุตัวเลข"),
    documentNumber: string().required("กรุณากรอกเลขที่เอกสาร"),
    degree: string().required("กรุณาเลือกวุฒิเดิม"),
    oldSchool: string().required("กรุณาเลือกสถาบัน"),
    studentPhone: string().required("กรุณาเบอร์โทรศัพท์"),
    documentTerm: string().length(6, ""),
  });

  const { register, handleSubmit, watch, setValue, errors } = useForm({
    validationSchema: schema,
  });

  useEffect(() => {
    register({ name: "degree" });
    register({ name: "oldSchool" });
  }, [register]);

  useEffect(() => {
    if (props.open) {
      const {
        document_number,
        document_term,
        document_student_code,
        student_phone,
        document_old_school_id,
        document_degree_id,
        degree_name,
        old_school_name,
      } = props.data;
      setTimeout(() => {
        setValue("studentId", document_student_code);
        setValue("studentPhone", student_phone);
        setValue("documentTerm", document_term);
        setValue("documentNumber", document_number);
        setValue("oldSchool", document_old_school_id);
        setValue("degree", document_degree_id);
      });
      setSelectEditDegree({
        selectedOption: [{ value: document_degree_id, label: degree_name }],
      });
      setSelectEditOldSchool({
        selectedOption: [
          { value: document_old_school_id, label: old_school_name },
        ],
      });
    } else {
      setValue("studentId", "");
      setValue("studentPhone", "");
      setValue("documentTerm", "");
      setValue("documentNumber", "");
      setValue("oldSchool", "");
      setValue("degree", "");
      setSelectEditDegree({
        selectedOption: [],
      });
      setSelectEditOldSchool({
        selectedOption: [],
      });
    }
  }, [props.open]);

  const degreeStyles = useMemo(() => {
    return {
      control: (base, state) => ({
        ...base,
        borderRadius: 3,
        marginTop: 8,
        borderColor: !!errors.degree ? "red" : "#cccccc",
        "&:hover": {
          borderColor: "#00adb5",
        },
      }),
      menu: (base) => ({
        ...base,
        textAlign: "left",
      }),
    };
  }, [errors]);

  const oldSchoolStyles = useMemo(() => {
    return {
      control: (base, state) => ({
        ...base,
        borderRadius: 3,
        marginTop: 8,
        borderColor: !!errors.oldSchool ? "red" : "#cccccc",
        "&:hover": {
          borderColor: "#00adb5",
        },
      }),
      menu: (base) => ({
        ...base,
        textAlign: "left",
      }),
    };
  }, [errors]);

  const onSubmitEditDocumentHandler = async (data) => {
    resEditDocument.mutate({
      ...data,
      ...{ id: props.documentId[0].id },
    });
  };

  const onChangeSelectDegreeEditHandler = (e) => {
    setValue("degree", e === null ? null : e.value.toString());
    setSelectEditDegree({ e });
  };

  const onChangeSelectOldSchoolEditHandler = (e) => {
    setValue("oldSchool", e === null ? null : e.value.toString());
    setSelectEditOldSchool({ e });
  };

  let selectDegreeContent = "";
  let selectOldSchoolContent = "";
  if (!resDataDegree.isLoading || !resDataOldSchool.isLoading) {
    if (resDataDegree.isError || resDataOldSchool.isError) {
      selectDegreeContent = (
        <ErrorPage
          msgError={
            resDataDegree.error
              ? resDataDegree.error.response
                ? resDataDegree.error.response.data
                : JSON.stringify(resDataDegree.error.message)
              : ""
          }
        />
      );
      selectOldSchoolContent = (
        <ErrorPage
          msgError={
            resDataOldSchool.error
              ? resDataOldSchool.error.response
                ? resDataOldSchool.error.response.data
                : JSON.stringify(resDataOldSchool.error.message)
              : ""
          }
        />
      );
    } else {
      selectDegreeContent = (
        <Select
          name='degree'
          placeholder='วุฒิเดิม'
          value={selectEditDegree.selectedOption}
          options={resDataDegree.data}
          inputRef={register}
          isClearable
          onChange={onChangeSelectDegreeEditHandler}
          styles={degreeStyles}
          isSearchable={true}
        />
      );

      selectOldSchoolContent = (
        <Select
          name='oldSchool'
          placeholder='สถาบันเดิม'
          value={selectEditOldSchool.selectedOption}
          options={resDataOldSchool.data}
          inputRef={register}
          isClearable
          onChange={onChangeSelectOldSchoolEditHandler}
          styles={oldSchoolStyles}
          isSearchable={true}
        />
      );
    }
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      scroll={"paper"}
      height={100}
      open={props.open}
      id='editDocument'>
      <DialogTitle>แก้ไขเอกสาร</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmitEditDocumentHandler)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant='outlined'
                label='รหัสนักศึกษา'
                name='studentId'
                margin='none'
                size='small'
                inputRef={register}
                error={!!errors.studentId}
                disabled
              />
              <TextField
                fullWidth
                variant='outlined'
                label='เบอร์โทร'
                name='studentPhone'
                margin='dense'
                size='small'
                inputRef={register}
                error={!!errors.studentPhone}
              />
              <TextField
                fullWidth
                variant='outlined'
                label='เลขที่เอกสาร'
                name='documentNumber'
                margin='dense'
                size='small'
                inputRef={register}
                error={!!errors.documentNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant='outlined'
                label='ภาคการศึกษา'
                name='documentTerm'
                margin='none'
                size='small'
                inputRef={register}
                error={!!errors.documentTerm}
              />
              {selectDegreeContent}
              {selectOldSchoolContent}
            </Grid>
            <Grid item xs={12} sm={12}>
              <Paper className={styles.paper}>
                {props.data.document_student_name}
                <br />
                {props.data.student_major}
                <br />
                {props.data.student_faculty}
                <br />
                {props.data.GRP_NAME}
              </Paper>
            </Grid>
          </Grid>
          <DialogActions>
            {resEditDocument.isLoading && (
              <CircularProgress size={24} color='secondary' />
            )}
            {resEditDocument.isError && (
              <Typography color='secondary' display='block'>
                {resEditDocument.error
                  ? resEditDocument.error.response
                    ? resEditDocument.error.response.data
                    : JSON.stringify(resEditDocument.error.message)
                  : ""}
              </Typography>
            )}
            <Button
              type='submit'
              variant='contained'
              size='small'
              color='primary'>
              แก้ไข
            </Button>
            <Button
              onClick={props.close}
              variant='contained'
              size='small'
              color='secondary'>
              ยกเลิก
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionFormEditDocument;