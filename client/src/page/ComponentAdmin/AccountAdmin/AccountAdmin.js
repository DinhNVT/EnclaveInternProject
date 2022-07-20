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

function AccountAdmin() {
  const [parents, setParents] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [dropValue, setDropValue] = useState("admin");
  const [state, setState] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [addState, setAddState] = useState(true);

  useEffect(() => {
    getParents();
    getAdmins();
    getTeachers();
  }, [dropValue, state]);

  const options = [
    // { label: 'All', value: 'all' },
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
    setDropValue(event.target.value);
  };

  const getParents = () => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAdmins = () => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTeachers = () => {
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
          <i className="fa-regular fa-eye btn-view"></i>
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
        console.log("edit");
      } else if (e.target.className.includes("btn-view")) {
        console.log("view");
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
      AccountService.deleteAccountAdminById(id).then((res) => res);
    else if (dropValue === "parents")
      AccountService.deleteAccountParentsById(id).then((res) => res);
    else AccountService.deleteAccountTeacherById(id).then((res) => res);
    setState(!state);
    setIsDelete(false);
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
  };

 const handleConfirmAddAccount = (allValue) => {

  console.log(allValue)
    AccountService.addAccountAdmin({
      admin_username: allValue.name,
      admin_password: allValue.password,
      admin_email:allValue.email
    //   admin_username: "dinhsss",
    // admin_password: "123456",
    // admin_email: "dinh5@gmail.com",
    }).then((res)=>{if(res.success) setState(!state);})
  };

  const DivAddAccount = (
    <ModalInput
      show={addState}
      handleInputCustom={handleInputCustom}
      content={<AddAccount handleInputCustom={handleInputCustom}
      handleConfirmAddAccount={handleConfirmAddAccount} />}
    />
  );

  const handleAddAccount = () => {
    setAddState(true);
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
              className="input-search"
              type="text"
              placeholder="Search..."
            ></input>
          </div>
        </div>
      </header>
      <div className="table-content">
        {dropValue === "parents" ? (
          <TableAccounts accounts={parents} value={dropValue} />
        ) : dropValue === "admin" ? (
          <TableAccounts accounts={admin} value={dropValue} />
        ) : (
          <TableAccounts accounts={teacher} value={dropValue} />
        )}
      </div>
      <footer>
        <hr></hr>
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
        </div>
        {isDelete ? ConfirmDelete : null}
        {addState ? DivAddAccount : null}
      </footer>
    </div>
  );
}

export default AccountAdmin;
