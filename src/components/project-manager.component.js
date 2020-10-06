/*
Implementation to perform the Github sign in and Repository creation
 */
import React, {useEffect, useState} from 'react';
import {render} from 'react-dom'
import axios from 'axios';
import GitHubLogin from "../auth/github-login.component";

const ProjectManager = () =>{

    //Initialize the state values
    const[accessToken, setAccessToken] = useState("");
    const[githubCode, setGithubCode] = useState("")
    const[name, setName] = useState("");
    const[description, setDescription] = useState("");
    const[gitIgnore, setGitIgnore] = useState("");
    const[visibility, setVisibility] = useState("");


    useEffect(()=>{

    }, []);

    /*--Onchange events----*/
    const onChangeProjectName = (e)=>{
        setName(e.target.value);
    }

    const onChangeProjectDescription = (e) =>{
        setDescription(e.target.value)
    }

    const onChangeGitIgnore = (e) =>{
        setGitIgnore(e.target.value);
    }

    const onChangeVisibility = (e) =>{
        setVisibility(e.target.value)
    }

    /*-------------------------------*/

    /*
        Function to create a github repository by calling the github resource server
     */
    const onInitializeProject = (e)=>{
        e.preventDefault();

        console.log(name + description + visibility + gitIgnore + githubCode)

        //set the body with data
        const data = {
            name : name, //name of the repository
            description : description, //description of the repository
            gitignore_template : gitIgnore, //gitignore template name
            visibility : visibility //the visibility to set a public or private repository
        }

        console.log(accessToken)

        //Call the API to create a github repository
        axios.post("https://api.github.com/user/repos", data,{
            headers:{
                'Content-Type': 'application/json',
                Accept : 'application/vnd.github.v3+json', //set the accept header
                Authorization: `Bearer ${accessToken}` //send the access token as a bearer token
            }
        } )
            .then(res=>{
                console.log(res.data)

                //From the response data, pop up the git hub created project in a new tab
                window.open("https://github.com/" + res.data.full_name, "_blank")
                alert("Success");

            })
            .catch(err=>{
                console.log(err);
                alert("Error in creating the repository")
            })

    }

    const onSuccess = (response)=>{
        console.log(response);

        //set the authorization code returned by github
        setGithubCode(response.code);

        //create the request body with client id, client secret and code
        const data = {
            "client_id" : "715b876ce17dc7050d42",
            "client_secret" : "d889105fe5f309c3eed9ed00d15e1212454936b8",
            "code" : response.code
        }

        //send the authorization code returned by github to exchange it with an access token
        axios.post("https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token", data)
            .then(res=>{
                console.log("token" + res.data)
                detachToken(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
    }

    //show error on failure
    const onFailure = (response)=>{
        console.log(response);
        alert("Error in signing in");
    }

    //function used to detach the access token from the returned response string
    //this function will detach the token after the & character
    const detachToken = (tokenResponse) =>{
        let newString = tokenResponse.substring(13, tokenResponse.length)
        let splitedString = newString.split("&");
        setAccessToken(splitedString[0]);
    }

    return(

        <div className="container-fluid">
            <div className="row">
                <div className="col">
                </div>
                <div className="col-6">
                    <div>
                        <h3 className="display-4 text-center"> Manage your project </h3>

                        <form>
                            <div className="form-group">
                                <label >Project name</label>
                                <input type="text" className="form-control"
                                       value = {name}
                                       onChange={onChangeProjectName}
                                       aria-describedby="emailHelp" placeholder="Project name" required/>

                            </div>
                            <div className="form-group">
                                <label >Project Description</label>
                                <input type="text" className="form-control"
                                       value = {description}
                                       onChange={onChangeProjectDescription}
                                       placeholder="Project Description" required/>
                            </div>


                            <hr/>

                            {githubCode === "" ?
                                <>
                                    <h5 className="display-5 text-center"> Connect this project to GitHub</h5>
                                    <small  className="form-text text-muted text-center">Please authorize with Git Hub to create a github repository to this project</small>
                                </>
                                :

                                <>

                                    <div className="form-group">
                                        <label >Git ignore</label>
                                        <select className="form-control" onChange={onChangeGitIgnore}>
                                            <option value="" selected disabled> Please Select </option>
                                            <option value="C"> C </option>
                                            <option value="C++" > C++ </option>
                                            <option value="Java" > Java </option>
                                            <option value="Python" > Python </option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label >Visibility</label>
                                        <select className="form-control" onChange={onChangeVisibility}>
                                            <option value="" selected disabled> Please Select </option>
                                            <option value="Public"> Public </option>
                                            <option value="Private" > Private</option>
                                        </select>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                        </div>
                                        <div className="col text-center">
                                            <button style={{align : "center"}} type="submit" className="btn btn-primary text-center" onClick={onInitializeProject}>Initialize Project</button>
                                        </div>
                                        <div className="col">
                                        </div>
                                    </div>
                                </>
                            }

                        </form>

                    </div>
                </div>
                <div className="col">

                </div>
            </div>

            {githubCode === "" ?
                <div className="row">
                    <div className="col">
                    </div>
                    <div className="col text-center">
                        <br/>
                        <GitHubLogin clientId="715b876ce17dc7050d42"
                                     scope="repo"
                                     redirectUri=""
                                     onSuccess={onSuccess}
                                     onFailure={onFailure}
                                     className="btn btn-secondary"/>

                    </div>
                    <div className="col">
                    </div>
                </div>
                :
                <></>
            }

        </div>

    )
}

export default ProjectManager