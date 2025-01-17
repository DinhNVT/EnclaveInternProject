import React, { useEffect, useRef, useState } from "react";
import "./UserHeader.css";
import AuthenticationService from "../../../config/service/AuthenticationService";
import ROUTES from "../../../constants/routes";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../../assets/image/Logo.png";
import AvatarDropdown from "../AvatarDropdown/AvatarDropdown";
function useOutsideAlerter(ref, handle) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handle(event);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, handle]);
}

function UserHeader() {
    let history = useHistory();
    const REACT_APP_API_ENDPOINT = "http://localhost:8000/";
    const [avatar, setAvatar] = useState(Logo);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, () => {
        setOpen(false);
    });

    useEffect(() => {
        if (AuthenticationService.isTeacher()) {
            if (
                !!JSON.parse(localStorage.getItem("@Login")).teacher.teacher_img
            ) {
                setAvatar(
                    `${REACT_APP_API_ENDPOINT}${JSON.parse(localStorage.getItem("@Login")).teacher
                        .teacher_img
                    }`
                );
            }
        } else if (AuthenticationService.isParents()) {
            if (
                !!JSON.parse(localStorage.getItem("@Login")).parent.parent_img
            ) {
                setAvatar(
                    `${REACT_APP_API_ENDPOINT}${JSON.parse(localStorage.getItem("@Login")).parent
                        .parent_img
                    }`
                );
            }
        }
    }, []);
    const optionsParents = [
        { key: 1, label: "Home", link: ROUTES.HOME_PAGE.HOME_PATH },
        {
            key: 2,
            label: "Student",
            link: ROUTES.PARENTS_PAGE.PARENTS_STUDENT_PATH,
        },
        {
            key: 3,
            label: "Parents",
            link: ROUTES.PARENTS_PAGE.PARENTS_PARENTS_PATH,
        },
        {
            key: 4,
            label: "Score",
            link: ROUTES.PARENTS_PAGE.PARENTS_SCORE_PATH,
        },
        {
            key: 5,
            label: "Notification",
            link: ROUTES.PARENTS_PAGE.PARENTS_NOTIFICATION_PATH,
        },
    ];

    const optionsTeacher = [
        { key: 1, label: "Home", link: ROUTES.HOME_PAGE.HOME_PATH },
        {
            key: 2,
            label: "Class",
            link: ROUTES.TEACHER_PAGE.TEACHER_CLASS_PATH,
        },
        {
            key: 3,
            label: "Score",
            link: ROUTES.TEACHER_PAGE.TEACHER_SCORE_PATH,
        },
        {
            key: 4,
            label: "Schedule",
            link: ROUTES.TEACHER_PAGE.TEACHER_SCHEDULE_PATH,
        },
        {
            key: 5,
            label: "Notification",
            link: ROUTES.TEACHER_PAGE.TEACHER_NOTIFICATION_PATH,
        },
    ];

    const optionsAdmin = [
        {
            key: 2,
            label: "Admin",
            link: ROUTES.ADMIN_PAGE.ADMIN_HOME,
        },
        {
            key: 3,
            label: "Accounts",
            link: ROUTES.ADMIN_PAGE.ACCOUNT_ADMIN,
        },
        {
            key: 4,
            label: "Class",
            link: ROUTES.ADMIN_PAGE.CLASS_ADMIN,
        },
        {
            key: 5,
            label: "Grade",
            link: ROUTES.ADMIN_PAGE.GRADE_ADMIN,
        },
        {
            key: 6,
            label: "Subject",
            link: ROUTES.ADMIN_PAGE.SUBJECT_ADMIN,
        },
        {
            key: 7,
            label: "Student",
            link: ROUTES.ADMIN_PAGE.STUDENT_ADMIN,
        },
        {
            key: 8,
            label: "Schedule",
            link: ROUTES.ADMIN_PAGE.SCHEDULE_ADMIN,
        },
    ];

    const ItemHeader = ({ options }) => {
        return (
            <div className="item-header">
                {options.map((option) => (
                    <Link
                        className={
                            window.location.pathname == option.link
                                ? "active-menu"
                                : ""
                        }
                        key={option.key}
                        to={option.link}
                    >
                        {option.label}
                    </Link>
                ))}
            </div>
        );
    };

    const HandleLogout = () => {
        AuthenticationService.clearDataLogin();
        history.push("/");
    };

    return (
        <div className="user-header">
            <ItemHeader
                options={
                    AuthenticationService.isAdmin()
                        ? optionsAdmin
                        : AuthenticationService.isParents()
                            ? optionsParents
                            : optionsTeacher
                }
            />
            <div className="info-header">
                <h5>
                    {AuthenticationService.isAdmin()
                        ? AuthenticationService.getData().admin.admin_username.toString()
                        : AuthenticationService.isParents()
                            ? AuthenticationService.getData().parent.parent_name
                            : AuthenticationService.getData().teacher.teacher_name}
                </h5>
                <h6>{AuthenticationService.getData().role.toUpperCase()}</h6>
            </div>
            <div className="avatar" ref={wrapperRef}>
                <img src={avatar} onClick={() => setOpen(!open)} />
                {open ? <AvatarDropdown HandleLogout={HandleLogout} /> : null}
            </div>
        </div>
    );
}

export default UserHeader;
