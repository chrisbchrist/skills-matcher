import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import ReactTable from "react-table";
import SkillList from "./SkillList";
import PageCounter from "./PageCounter";
import Button from "./Button";
import PrintButton from "./PrintButton";
import Loader from "./Loader";

const Results = props => {
  const scrollRef = useRef(null);
  const [jobs, setJobs] = React.useState([]);

  //POST answers and store results on mount
 useEffect(() => {
    let answerObj = {
      SKAValueList: props.skills.map(skill => ({
        ElementId: skill.ElementId,
        DataValue: skill.DataValue
      }))
    };

    fetch("https://api.careeronestop.org/v1/skillsmatcher/eKVo73aZJi6gYRw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 2/8FL+RelJg9m5EvWAFVyzF2/FbEhiRrmwbA9E2By1H0UHVGA451zMfYQEZz013zXrFTbgakF1d0jBmF9aPnXw=="
      },
      body: JSON.stringify(answerObj)
    })
      .then(response => response.json())
      .then(response => {
        console.log(response.SKARankList);
        setJobs(response.SKARankList);
      });
  }, []);

  useEffect(() => {
    props.scrollToTop(scrollRef);
  }, [jobs]);

  // Not using modals for now
  // const toggleModal = () => {
  //   setSkillsModal(skillsModal => !skillsModal);
  // }

  const columns = [
    {
      Header: "Rank",
      accessor: "Rank",
      headerStyle: { whiteSpace: "unset" },
      headerClassName: "results__table-head",
      style: { whiteSpace: "unset" },
      //maxWidth: 100,
      width: "100%",
      minWidth: 55,
      Cell: ({ value }) => <div className="results__rank">{value}</div>
    },
    {
      Header: "Title",
      accessor: "OccupationTitle",
      headerStyle: { whiteSpace: "unset" },
      headerClassName: "results__table-head",
      style: { whiteSpace: "unset", padding: 10 },
      Cell: ({ row, original }) => (
        <a
          href={"https://www.onetonline.org/link/summary/" + original.OnetCode}
          target="_blank"
          className="results__link"
        >
          {original.OccupationTitle}
        </a>
      ),
      minWidth: 150
    },
    {
      Header: "Annual Wages",
      accessor: "AnnualWages",
      headerStyle: { whiteSpace: "unset" },
      style: { justifyContent: "center", textAlign: "center" },
      headerClassName: "results__table-head",
      Cell: ({ value }) =>
        value > 0 ? (
          <div className="results__td">
            <span className="mobile__label">Average Salary</span>
            <span className="results__dollar">$</span>
            {value.toLocaleString()}
          </div>
        ) : (
          <span>N/A</span>
        ),
      //maxWidth: 150,
      minWidth: 76,
      sortMethod: (a, b) => {
        return b - a;
      }
    },
    {
      Header: "Typical Education",
      accessor: "TypicalEducation",
      headerStyle: { whiteSpace: "unset" },
      headerClassName: "results__table-head",
      //maxWidth: 278,
      Cell: ({ value }) => (
        <div className="results__td">
          <span className="mobile__label">Typical Education</span>
          <span>{value}</span>
        </div>
      ),
      style: { whiteSpace: "unset", justifyContent: "center", textAlign: "center" },
      sortMethod: (a, b) => {
        const eduOrder = [
          "Doctoral or professional degree",
          "Master's degree",
          "Bachelor's degree",
          "Associate's degree",
          "Postsecondary non-degree award",
          "High school diploma or equivalent",
          "No formal educational credential"
        ];
        return eduOrder.indexOf(a) - eduOrder.indexOf(b);
      }
    },
    {
      Header: "Outlook",
      accessor: "Outlook",
      headerStyle: { whiteSpace: "unset" },
      style: { justifyContent: "center", textAlign: "center" },
      headerClassName: "results__table-head",
      //maxWidth: 150,
      Cell: ({ value }) => {
        const outlookClass =
          value == "Bright"
            ? "results__outlook--bright"
            : value == "Below Average"
            ? "results__outlook--below"
            : "";
        return (
          <div className="results__td">
            <span className="mobile__label">Job Outlook</span>
            <span className={outlookClass}>{value}</span>
          </div>
        );
      },
      sortMethod: (a, b) => {
        const sortOrder = ["Bright", "Average", "Below Average"];
        return sortOrder.indexOf(a) - sortOrder.indexOf(b);
      }
    }
  ];

  return (
    <Switch>
      <Route exact={true} path="/">
        <div className="matcher--results" ref={scrollRef}>
          <div className="matcher__instructions">
            <h2 className="matcher__section-header">Your Results</h2>
            <div className="matcher__accent"></div>
            <p className="results__list-info">
             Sort your results by selecting the title of each column. Click on the job title to view more information.
            </p>

            <p>You can also see your full list of skills to use for your resumé or other career activities.</p>
              <Link className="skill-list__link controls__btn controls__btn--blue" to={"/skills"}>View</Link>
          </div>
          <div className="matcher__utilities matcher__utilities--hide">
            <PrintButton/>
          </div>
          <div className="matcher__border">
            {/* <Loader loading={jobs.length < 1}/> */}
          <ReactTable
            noDataText="Loading Results..."
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                style: {
                  padding: 10,
                  display: "flex",
                  alignItems: "center"
                }
              };
            }}
            getTheadThProps={(state, rowInfo, column, instance) => {
              return {
                style: {
                  padding: "15px 10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }
              };
            }}
            onPageChange={page => {
              //Scroll to top on new results page
              props.scrollToTop(scrollRef);
            }}
            columns={columns}
            data={jobs}
            minRows={0}
            minWidth={300}
            nextText={<span>Next <i className="fas fa-chevron-right"/></span>}
            previousText={<span><i className="fas fa-chevron-left"/> Previous</span>}
            resizable={false}
            className="-striped -highlight results__table"
          />
          </div>
          <div className="controls controls--center">
            <Button text="Reset" icon={<i className="fas fa-redo-alt"/>} color={"orange"} function={props.reset}/>
          </div>
        </div>
      </Route>
      <Route
        path="/skills"
        render={() => <SkillList skills={props.skills} />}
      />
    </Switch>
  );
};

export default Results;
