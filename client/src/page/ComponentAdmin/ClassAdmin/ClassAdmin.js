import React, { useEffect, useState } from "react";
import "./ClassAdmin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import ClassService from "../../../config/service/ClassService";
import ModalCustom from "../../../lib/ModalCustom/ModalCustom";
import ConfirmAlert from "../../../lib/ConfirmAlert/ConfirmAlert";
import ModalInput from "../../../lib/ModalInput/ModalInput";
import AddClass from "../../../lib/ModalInput/AddClass/AddClass";
import UpdateClass from "../../../lib/ModalInput/UpdateClass/UpdateClass";
import ViewStudentClass from "../../../lib/ModalInput/ViewStudentClass/ViewStudentClass";
import Loading from "../../../lib/Loading/Loading";

const ClassAdmin = () => {
  const [dropValue, setDropValue] = useState("All");
  const [state, setState] = useState(false);
  const [classroom, setClass] = useState([]);
  const [grade, setGrade] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [addState, setAddState] = useState(false);
  const [updateState, setUpdateState] = useState(false);
  const [viewState, setViewState] = useState(false);
  const [errorServer, setErrorServer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getClasses();
    getGrade();
  }, [state]);

  const Dropdown = ({ value, options, onChange }) => {
    return (
      <label>
        Type of class
        <select className="dropdown-account" value={value} onChange={onChange}>
          <option value="All">All</option>
          {options.map((option) => (
            <option key={option.key} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </label>
    );
  };

  const getClasses = () => {
    setIsLoading(true);
    ClassService.getClass()
      .then((response) => {
        const dataSources = response.allClasses.map((item, index) => {
          return {
            key: index + 1,
            id: item._id,
            name: item.class_name,
            grade: item.grade_name,
            teacher: item.teacher_name,
          };
        });
        setClass(dataSources);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getGrade = () => {
    setIsLoading(true);
    ClassService.getGrades()
      .then((response) => {
        const dataSources = response.allGrades.map((item, index) => {
          return {
            key: index + 1,
            id: item._id,
            name: item.grade_name,
          };
        });
        setGrade(dataSources);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getClassByGradeId = (id) => {
    setIsLoading(true);
    ClassService.getClassesByGradeId(id)
      .then((response) => {
        const dataSources = response.classes.map((item, index) => {
          return {
            key: index + 1,
            id: item._id,
            name: item.class_name,
            grade: item.grade_name,
            teacher: item.teacher_name,
          };
        });
        if (dataSources.length > 0) {
          setClass(dataSources);
          setIsLoading(false);
        } else {
          setClass([]);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const TableClasses = ({ classes, value }) => {
    const classItem = classes.map((item) => (
      <tr data-key={item.id} key={item.id}>
        <td>{item.name}</td>
        <td>{item.grade}</td>
        <td>{item.teacher}</td>
        <td onClick={click}>
          <i className="fa-regular fa-pen-to-square btn-edit"></i>
          <i className="fa-regular fa-trash-can btn-delete"></i>
          <i className="fa-regular fa-eye btn-view"></i>
        </td>
      </tr>
    ));

    function click(e) {
      const id = e.target.parentElement.parentElement.getAttribute("data-key");
      if (e.target.className.includes("btn-delete")) {
        setIsDelete(true);
        console.log(id);
        setId(id);
        setName(
          e.target.parentElement.parentElement.querySelectorAll("td")[0]
            .textContent +
            " from " +
            e.target.parentElement.parentElement.querySelectorAll("td")[1]
              .textContent
        );
      } else if (e.target.className.includes("btn-edit")) {
        //TODO edited
        setUpdateState(true);
        setId(id);
      } else if (e.target.className.includes("btn-view")) {
        setViewState(true);
        setId(id);
      }
    }

    let headerClass;
    if (!value) {
      headerClass = (
        <tr>
          <th>Name</th>
          <th>Grade</th>
          <th>Teacher</th>
          <th>Action</th>
        </tr>
      );
    }
    return (
      <table id="table">
        <thead>{headerClass}</thead>
        <tbody>{classItem}</tbody>
      </table>
    );
  };

  const handleCloseModalCustom = () => {
    setIsDelete(false);
  };

  const handleChange = (event) => {
    setDropValue(event.target.value);
    setKeyword("");
    grade.map((item) => {
      if (event.target.value === item.name) {
        getClassByGradeId(item.id);
      } else if (event.target.value === "All") {
        getClasses();
      }
    });
  };

  const handleDelete = () => {
    ClassService.deleteClassById(id).then((res) =>
      res.success ? setState(!state) : null
    );
    setIsDelete(false);
  };

  const ConfirmDelete = (
    <ModalCustom
      show={isDelete}
      content={
        <ConfirmAlert
          handleCloseModalCustom={handleCloseModalCustom}
          handleDelete={handleDelete}
          title={`Do you want to delete class ${name}?`}
        />
      }
      handleCloseModalCustom={handleCloseModalCustom}
    />
  );

  const handleInputCustom = () => {
    setAddState(false);
    setUpdateState(false);
    setViewState(false);
    setErrorServer(false);
  };

  const handleConfirmAddClass = (allValue) => {
    ClassService.addClass(allValue.grade, allValue.teacher, {
      class_name: allValue.name,
    }).then((res) => {
      if (res.success) {
        setState(!state);
        setErrorServer(false);
        setAddState(false);
      } else {
        setErrorServer(true);
        setAddState(true);
      }
    });
  };

  const handleConfirmUpdateClass = (allValue) => {
    if (allValue.teacher === allValue.currentlyTeacher) {
      ClassService.updateClassById(id, allValue.currentlyTeacher, {
        class_name: allValue.name,
      }).then((res) => {
        if (res.success) {
          setState(!state);
          setErrorServer(false);
          setUpdateState(false);
          setKeyword("");
        } else {
          console.log(res);
          setErrorServer(true);
          setUpdateState(true);
        }
      });
    } else {
      ClassService.updateClassById(id, allValue.teacher, {
        class_name: allValue.name,
      }).then((res) => {
        if (res.success) {
          setState(!state);
          setErrorServer(false);
          setUpdateState(false);
          setKeyword("");
        } else {
          setErrorServer(true);
          setUpdateState(true);
        }
      });
    }
  };

  const DivAddClass = (
    <ModalInput
      show={addState}
      handleInputCustom={handleInputCustom}
      content={
        <AddClass
          handleInputCustom={handleInputCustom}
          handleConfirmAddClass={handleConfirmAddClass}
          errorServer={errorServer}
        />
      }
    />
  );

  const DivUpdateClass = (
    <ModalInput
      show={updateState}
      handleInputCustom={handleInputCustom}
      content={
        <UpdateClass
          classID={id}
          handleInputCustom={handleInputCustom}
          handleConfirmUpdateClass={handleConfirmUpdateClass}
          errorServer={errorServer}
        />
      }
    />
  );

  const DivViewClass = (
    <ModalInput
      show={viewState}
      handleInputCustom={handleInputCustom}
      content={
        <ViewStudentClass classID={id} handleInputCustom={handleInputCustom} />
      }
    />
  );

  const handleAddClass = () => {
    setAddState(true);
  };

  const searchClass = (classroom) => {
    if (dropValue === "All") {
      return classroom.filter((classroom) =>
        classroom.teacher.toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      return classroom;
    }
  };

  const handleChangeSearch = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="main-container">
      <header>
        <div>
          <h3>Manage Class</h3>
          <Dropdown
            label="What do we eat?"
            options={grade}
            value={dropValue}
            onChange={handleChange}
          />
        </div>
        <div className="right-header">
          <button className="btn-account" onClick={handleAddClass}>
            Add class
          </button>
          <div className="search-box">
            <button className="btn-search">
              <FontAwesomeIcon
                className="icon-search"
                icon={faMagnifyingGlass}
              />
            </button>
            <input
              onChange={handleChangeSearch}
              className="input-search"
              type="text"
              placeholder="Search..."
              value={keyword}
            ></input>
          </div>
        </div>
      </header>
      <div className="table-content">
        <TableClasses classes={searchClass(classroom)} />
      </div>
      <footer>
                {/* <hr></hr>
                <div className="paging">
                    <button className="previous">
                        <FontAwesomeIcon
                            className="icon icon-previous"
                            icon={faArrowLeftLong}
                        />
                        Previous
                    </button>
                    <div className="list-number">
                        <button>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>...</button>
                        <button>4</button>
                        <button>5</button>
                        <button>6</button>
                    </div>
                    <button className="next">
                        Next
                        <FontAwesomeIcon
                            className="icon icon-next"
                            icon={faArrowRightLong}
                        />
                    </button>
                </div> */}
                {isDelete ? ConfirmDelete : null}
                {addState ? DivAddClass : null}
                {updateState ? DivUpdateClass : null}
                {viewState ? DivViewClass : null}
            </footer>
      <Loading isLoading={isLoading} />
    </div>
  );
};

export default ClassAdmin;
