import React, { useEffect, useState } from "react";
import "./AccountAdmin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import AccountService from "../../../config/service/AccountService";
import ModalCustom from "../../../lib/ModalCustom/ModalCustom";
import ConfirmAlert from "../../../lib/ConfirmAlert/ConfirmAlert";
import ModalInput from "../../../lib/ModalInput/ModalInput";
import AddAccount from "../../../lib/ModalInput/AddAccount/AddAccount";
import UpdateAccount from "../../../lib/ModalInput/UpdateAccount/UpdateAccount";
import Loading from "../../../lib/Loading/Loading";

function AccountAdmin() {
  const [parents, setParents] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [dropValue, setDropValue] = useState("teacher");
  const [state, setState] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [addState, setAddState] = useState(false);
  const [updateState, setUpdateState] = useState(false);
  const [errorServer, setErrorServer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getParents();
    getAdmins();
    getTeachers();
  }, [state]);

  const options = [
    { key: 1, label: "Admin", value: "admin" },
    { key: 2, label: "Parents", value: "parents" },
    { key: 3, label: "Teacher", value: "teacher" },
  ];

  const Dropdown = ({ value, options, onChange }) => {
    return (
      <label>
        Type of account
        <select className="dropdown-account" value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.key} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  };

  const handleChange = (event) => {
    setIsLoading(false);
    setDropValue(event.target.value);
    setKeyword("");
  };

  const getParents = () => {
    setIsLoading(true);
    AccountService.getAccountsParents()
      .then((response) => {
        const dataSources = response.allParents.map((item, index) => {
          return {
            key: index + 1,
            id: item._id,
            name: item.parent_name,
            email: item.parent_email,
            address: item.parent_address,
            birth: item.parent_dateofbirth,
            phone: item.parent_phone,
            job: item.parent_job,
            gender: item.parent_gender,
          };
        });
        setParents(dataSources);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAdmins = () => {
    setIsLoading(true);
    AccountService.getAccountsAdmin()
      .then((response) => {
        const dataSources = response.alladmin.map((item, index) => {
          return {
            key: index + 1,
            id: item._id,
            name: item.admin_username,
            email: item.admin_email,
          };
        });
        setAdmin(dataSources);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTeachers = () => {
    setIsLoading(true);
    AccountService.getAccountsTeacher()
      .then((response) => {
        const dataSources = response.allTeachers.map((item, index) => {
          return {
            key: index + 1,
            id: item._id,
            name: item.teacher_name,
            email: item.teacher_email,
            age: item.teacher_age,
            gender: item.teacher_gender,
            phone: item.teacher_phone,
          };
        });
        setTeacher(dataSources);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const TableAccounts = ({ accounts, value }) => {
    const accountItem = accounts.map((item) => (
      <tr data-key={item.id} key={item.id}>
        <td>{item.email}</td>
        <td>{item.name}</td>
        <td>{value.toUpperCase()}</td>
        <td onClick={click}>
          <i className="fa-regular fa-pen-to-square btn-edit"></i>
          <i className="fa-regular fa-trash-can btn-delete"></i>
        </td>
      </tr>
    ));

    function click(e) {
      const id = e.target.parentElement.parentElement.getAttribute("data-key");
      if (e.target.className.includes("btn-delete")) {
        setIsDelete(true);
        setId(id);
        setName(
          e.target.parentElement.parentElement.querySelectorAll("td")[1]
            .textContent
        );
      } else if (e.target.className.includes("btn-edit")) {
        setUpdateState(true);
        setId(id);
      }
    }

    let headerAccount;
    if (value === "parents" || value === "admin" || value === "teacher") {
      headerAccount = (
        <tr>
          <th>User name</th>
          <th>Full name</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      );
    }
    return (
      <table id="table">
        <thead>{headerAccount}</thead>
        <tbody>{accountItem}</tbody>
      </table>
    );
  };

  const handleCloseModalCustom = () => {
    setIsDelete(false);
  };

  const handleDelete = () => {
    if (dropValue === "admin")
      AccountService.deleteAccountAdminById(id)
        .then((res) => {
          if (res.success) {
            setState(!state);
            setIsDelete(false);
          }
        });
    else if (dropValue === "parents")
      AccountService.deleteAccountParentsById(id).then((res) => {
        if (res.success) {
          setState(!state);
          setIsDelete(false);
        }
      });
    else AccountService.deleteAccountTeacherById(id).then((res) => {
      if (res.success) {
        setState(!state);
        setIsDelete(false);
      }
    });
  };

  const ConfirmDelete = (
    <ModalCustom
      show={isDelete}
      content={
        <ConfirmAlert
          handleCloseModalCustom={handleCloseModalCustom}
          handleDelete={handleDelete}
          title={`Do you want to delete the ${name}?`}
        />
      }
      handleCloseModalCustom={handleCloseModalCustom}
    />
  );

  const handleInputCustom = () => {
    setAddState(false);
    setUpdateState(false);
    setErrorServer(false);
  };

  const handleConfirmAddAccount = (allValue, type) => {
    if (type === "admin") {
      AccountService.addAccountAdmin({
        admin_username: allValue.name,
        admin_password: allValue.password,
        admin_email: allValue.email,
      })
        .then((res) => {
          if (res.success) {
            setState(!state);
            setDropValue(type);
            setErrorServer(false);
            setAddState(false);
          } else {
            setErrorServer(true);
            setAddState(true);
          }
        })
        .catch((error) => console.log("error", error));
    } else if (type === "teacher") {
      var formData = new FormData();
      formData.append("teacher_name", allValue.name);
      formData.append("teacher_age", allValue.age);
      formData.append("teacher_gender", allValue.gender);
      formData.append("teacher_phone", allValue.phone);
      formData.append("teacher_email", allValue.email);
      formData.append("teacher_password", allValue.password);
      if (!!allValue.img)
        formData.append("teacher_img", allValue.img, allValue.img.name);
      AccountService.addAccountTeacher(formData)
        .then((res) => {
          if (res.success) {
            setState(!state);
            setDropValue(type);
            setErrorServer(false);
            setAddState(false);
          } else {
            setErrorServer(true);
            setAddState(true);
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      var formData = new FormData();
      formData.append("parent_name", allValue.name);
      formData.append("parent_dateofbirth", allValue.dateOfBirth);
      formData.append("parent_gender", allValue.gender);
      formData.append("parent_phone", allValue.phone);
      formData.append("parent_email", allValue.email);
      formData.append("parent_password", allValue.password);
      formData.append("parent_job", allValue.job);
      formData.append("parent_address", allValue.address);
      if (!!allValue.img)
        formData.append("parent_img", allValue.img, allValue.img.name);
      AccountService.addAccountParents(formData)
        .then((res) => {
          if (res.success) {
            setState(!state);
            setDropValue(type);
            setErrorServer(false);
            setAddState(false);
          } else {
            setErrorServer(true);
            setAddState(true);
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  const DivAddAccount = (
    <ModalInput
      show={addState}
      handleInputCustom={handleInputCustom}
      content={
        <AddAccount
          handleInputCustom={handleInputCustom}
          handleConfirmAddAccount={handleConfirmAddAccount}
          errorServer={errorServer}
        />
      }
    />
  );

  const handleConfirmUpdateAccount = (allValue) => {
    if (dropValue === "admin") {
      AccountService.updateAccountAdmin(
        {
          admin_username: allValue.name,
          admin_password: allValue.password,
          admin_email: allValue.email,
        },
        id
      )
        .then((res) => {
          if (res.success) {
            setState(!state);
            setErrorServer(false);
            setUpdateState(false);
          } else {
            setErrorServer(true);
            setUpdateState(true);
          }
        })
        .catch((error) => console.log("error", error));
    } else if (dropValue === "teacher") {
      console.log(allValue);
      var formData = new FormData();
      formData.append("teacher_name", allValue.name);
      formData.append("teacher_age", allValue.age);
      formData.append("teacher_gender", allValue.gender);
      formData.append("teacher_phone", allValue.phone);
      formData.append("teacher_email", allValue.email);
      formData.append("teacher_password", allValue.password);
      if (!!allValue.img)
        formData.append("teacher_img", allValue.img, allValue.img.name);
      AccountService.updateAccountTeacher(formData, id)
        .then((res) => {
          console.log(res);
          if (res.success) {
            setState(!state);
            setErrorServer(false);
            setUpdateState(false);
          } else {
            setErrorServer(true);
            setUpdateState(true);
          }
        })
        .catch((error) => console.log("error", error));
    } else if (dropValue === "parents") {
      console.log(allValue);
      var formData = new FormData();
      formData.append("parent_name", allValue.name);
      formData.append("parent_dateofbirth", allValue.dateOfBirth);
      formData.append("parent_gender", allValue.gender);
      formData.append("parent_phone", allValue.phone);
      formData.append("parent_email", allValue.email);
      formData.append("parent_password", allValue.password);
      formData.append("parent_job", allValue.job);
      formData.append("parent_address", allValue.address);
      if (!!allValue.img)
        formData.append("parent_img", allValue.img, allValue.img.name);
      AccountService.updateAccountParents(formData, id)
        .then((res) => {
          if (res.success) {
            setState(!state);
            setErrorServer(false);
            setUpdateState(false);
          } else {
            console.log(res);
            setErrorServer(true);
            setUpdateState(true);
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  const DivUpdateAccount = (
    <ModalInput
      show={updateState}
      handleInputCustom={handleInputCustom}
      content={
        <UpdateAccount
          AccountId={id}
          handleInputCustom={handleInputCustom}
          handleConfirmUpdateAccount={handleConfirmUpdateAccount}
          errorServer={errorServer}
          dropValue={dropValue}
        />
      }
    />
  );

  const handleAddAccount = () => {
    setAddState(true);
  };

  const searchAccount = (account) => {
    if (dropValue === "admin") {
      return account.filter(
        (account) =>
          account.name.toLowerCase().includes(keyword.toLowerCase()) ||
          account.email.toLowerCase().includes(keyword.toLowerCase())
      );
    } else if (dropValue === "parents") {
      return account.filter(
        (account) =>
          account.name.toLowerCase().includes(keyword.toLowerCase()) ||
          account.email.toLowerCase().includes(keyword.toLowerCase())
      );
    } else if (dropValue === "teacher") {
      return account.filter(
        (account) =>
          account.name.toLowerCase().includes(keyword.toLowerCase()) ||
          account.email.toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      return account;
    }
  };

  const handleChangeSearch = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="main-container">
      <header>
        <div>
          <h3>Manage Account</h3>
          <Dropdown
            options={options}
            value={dropValue}
            onChange={handleChange}
          />
        </div>
        <div className="right-header">
          <button onClick={handleAddAccount} className="btn-account">
            Add account
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
        {dropValue === "parents" ? (
          <TableAccounts accounts={searchAccount(parents)} value={dropValue} />
        ) : dropValue === "admin" ? (
          <TableAccounts accounts={searchAccount(admin)} value={dropValue} />
        ) : (
          <TableAccounts accounts={searchAccount(teacher)} value={dropValue} />
        )}
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
        {addState ? DivAddAccount : null}
        {updateState ? DivUpdateAccount : null}
      </footer>
      <Loading isLoading={isLoading} />
    </div>
  );
}

export default AccountAdmin;
