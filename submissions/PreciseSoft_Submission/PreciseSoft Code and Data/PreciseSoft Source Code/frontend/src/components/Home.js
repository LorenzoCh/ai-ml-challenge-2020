import React, { useState, useContext } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { withRouter } from "react-router-dom";
import { ClauseContext } from "../context/Context";
import { SET_CLAUSE } from "../context/action.types";
import { render } from "@testing-library/react";
//import firebase from "firebase/app";
import Result from "./Result";

class Home extends React.Component {
  //const[selectedFile,setSelectedFile]=useState([])
  //const { state,dispatch} = useContext(ClauseContext);
  //const { SET_CLAUSE }=state;

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      res: {  },
      buttonName: "Submit",
      fileSelect: false,
    };
  }
    
  uploadFile = async (e) => {
    e.preventDefault();
    this.setState({ fileSelect: false, buttonName: "Fetching the result..." });
    let file = this.state.files;
    //console.log('111')
    //console.log(this.state.files)
    const formData = new FormData();
    formData.append("file", file);
    //console.log(formData)
    await axios({
      url: "http://ec2-54-160-31-239.compute-1.amazonaws.com:5000/analysis",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "text/file",
      },
    })
      .then((response) => {
        this.setState({ res: response.data }, () => {
          console.log("Fetching response");
        });
      })
      .then(console.log("Uploaded"))
      .catch((error) => {
        console.log("error");
        //setResponse("error");
      });
    //alert("File uploaded successfully");
    // //this.props.history.push('/result')
    await this.props.history.push({
      pathname: "/result",
      state: { detail: this.state.res.results },
    });
  };

  onFileChange = (event) => {
    let files = event.target.files;
    this.setState({ files: files[0], fileSelect: true }, () => {
      console.log(this.state.files);
    });
  };

  render() {
    return (
      <div className='container'>
           
            <img src={ require('../images/preciselogo.png')} width="300" height="100" style={{marginTop:'10px'}} alt='' />
            <h4 style={{margin:'40px'}}><b>GSA EULA ANALYSIS TOOL</b></h4>
            {/* <div style={{align:'center',
             height: 350,
    width: 1200,
    display: "block",
    overflow: "auto",
    border:'3px solid gray',
    backgroundColor:'aliceblue',
    borderRadius:'50px'}}>
            */}
            <Card className='container' style={{minWidth: '275', height: 300,
    width: 1000,
    display: "block",
    overflow: "auto",backgroundColor:'aliceblue'}}>
            <div style={{margin:'50px',border:'20px',marginBottom:'20px'}}> 
            <p><b>UPLOAD A EULA FILE AND CLICK THE SUBMIT BUTTON TO VIEW THE RESULTS</b></p>
                <input type="file"  onChange={this.onFileChange} style={{margin:'40px',marginLeft:'120px',marginBottom:'10px'}} /> 
                <p>*Accepted file formats- Word (.docx) or PDF (.pdf)</p>
                <hr/>
            </div> 
            {/* {
            this.state.fileSelect !== false
              ?  */}
              <Button style={{maxWidth: '300px', maxHeight: '50px', minWidth: '300px', minHeight: '50px'}}
          variant="contained"
          color="primary"
          onClick={this.uploadFile} 
          disabled={
            this.state.files === undefined || this.state.fileSelect === false
              ? true
              : false
          }
        >
          {this.state.buttonName}
        </Button>
              
        </Card>
        </div>
    );
  }
}

export default Home;
