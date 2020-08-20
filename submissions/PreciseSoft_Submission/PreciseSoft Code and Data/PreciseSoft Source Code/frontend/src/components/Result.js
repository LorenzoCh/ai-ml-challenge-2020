import React from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

//icons for table
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => (
    <Button variant="contained" color="primary">
      Download
    </Button>
  )),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Clause",
          field: "text",
          editable: "never",
          render: (rowData) => rowData.text.substr(0, 40) + "...",
        },

        {
          title: "Prediction",
          field: "result",
          lookup: { problematic: "Problematic", acceptable: "Acceptable" },
        },
        {
          title: "Confidence",
          field: "score",
          editable: "never",
        },
      ],
      data: props.location.state.detail,
      cannotEdit: true,
      retrainData: [],
      editOrSave: "Edit",
      backOrCancel: "Back",
    };
  }
  //handles when edit button is clicked

  handleEdit = (event) => {
    event.preventDefault();
    this.setState({
      cannotEdit: false,
      editOrSave: "Save",
      backOrCancel: "Cancel",
    });
  };

  //handles when save button is clicked

  handleSave = (event) => {
    event.preventDefault();
    const data = this.state.retrainData;
    axios
      .post("http://ec2-54-160-31-239.compute-1.amazonaws.com:5000/retrain", {
        data,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
      })
      .then((res) => {
        console.log("Uploaded");
      })
      .catch((error) => {
        console.log("Error");
      });
    alert("Changes Saved");

    this.setState({
      cannotEdit: true,
      retrainData: [],
      editOrSave: "Edit",
      backOrCancel: "Back",
    });
  };

  render() {
    var retrainArray = this.state.retrainData;
    return (
      <div>
        <h3>Results</h3>
        <div
          style={{ margin: "100px", marginTop: "50px", marginBottom: "50px" }}
        >
          <MaterialTable
            options={{
              exportButton: true,
              searchFieldVariant: "outlined",
              searchFieldStyle: { height: 47 },
            }}
            icons={tableIcons}
            title="Results"
            columns={this.state.columns}
            data={this.state.data}
            editable={{
              isEditHidden: (rowData) => this.state.cannotEdit,
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...this.state.data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    this.setState({ data: [...dataUpdate] });
                    const clause = this.state.data[index].text;
                    const editPredict = this.state.data[index].result;
                    retrainArray.push({
                      clause: clause,
                      prediction: editPredict,
                    });
                    this.setState({
                      retrainData: retrainArray,
                    });
                    resolve();
                  }, 1000);
                }),
            }}
            detailPanel={(rowData) => {
              return (
                <div
                  style={{
                    fontSize: 15,
                    margin: "50px",
                  }}
                >
                  {rowData.text}
                </div>
              );
            }}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
          />
        </div>
        <div>
          <Button
            variant="contained"
            style={{
              alignItems: "center",
              justifyItems: "center",
              marginRight: 50,
            }}
            color={this.state.cannotEdit === false ? "primary" : ""}
            onClick={() => {
              this.state.cannotEdit === false
                ? this.setState({
                    cannotEdit: true,
                    backOrCancel: "Back",
                    editOrSave: "Edit",
                  })
                : this.props.history.push("/");
            }}
          >
            {this.state.backOrCancel}
          </Button>
          <Button
            variant="contained"
            style={{
              alignItems: "center",
              justifyItems: "center",
              marginLeft: 50,
            }}
            color="secondary"
            onClick={
              this.state.cannotEdit === true ? this.handleEdit : this.handleSave
            }
          >
            {this.state.editOrSave}
          </Button>
        </div>
      </div>
    );
  }
}

export default Result;
