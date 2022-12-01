import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./Profile.module.css";

export default function Profile() {
  let baseUrl = "https://route-egypt-api.herokuapp.com/";
  let token = localStorage.getItem("userToken");
  let decoded = jwtDecode(token);
  const [userNotes, setUserNotes] = useState([]);
  let [searchResult, setSearchResult] = useState([]);
  let [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState({
    title: "",
    desc: "",
    token,
    userID: decoded._id,
  });
  const [titleField, setTitleField] = useState("");
  const [descField, setDescField] = useState("");
  const areAllFieldsFilled = titleField !== "" && descField !== "";

  function checkTitle(e) {
    if (e.target.value !== "") {
      setTitleField(e.target.value);
    } else {
      setTitleField("");
    }
  }
  function checkDesc(e) {
    if (e.target.value !== "") {
      setDescField(e.target.value);
    } else {
      setDescField("");
    }
  }
  async function getNotes() {
    let { data } = await axios.get(`${baseUrl}getUserNotes`, {
      headers: { token, userID: decoded._id },
    });
    if (data.message === "success") {
      setUserNotes(data.Notes);
      setIsLoading(false);
    }
    if (data.message === "no notes found") {
      setUserNotes([]);
      setSearchText("");
      setIsLoading(false);
    }
  }
  function getNoteValue(e) {
    let currentnote = { ...note };
    currentnote[e.target.name] = e.target.value;
    setNote(currentnote);
  }
  async function sendNote(e) {
    e.preventDefault();
    setIsLoading(true);
    let { data } = await axios.post(`${baseUrl}addNote`, note);
    if (data.message === "success") {
      document.getElementById("sendNote").reset();
      getNotes().then(() => {
        setIsLoading(false);
        setTitleField("");
        setDescField("");
        Swal.fire({ title: "Added!", text: "Your note has been added.", icon: "success", customClass: { confirmButton: `${styles.btnGreen}` } });
      });
    } else {
      document.getElementById("sendNote").reset();
      setIsLoading(false);
      setTitleField("");
      setDescField("");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "not authentication or error in token!",
        customClass: {
          confirmButton: `${styles.btnGreen}`,
        },
      });
    }
  }
  function deleteNote(NoteID) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: `${styles.btnGreen}`,
        cancelButton: `${styles.btnRed}`,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        axios
          .delete(`${baseUrl}deleteNote`, {
            data: {
              NoteID,
              token,
            },
          })
          .then((response) => {
            if (response.data.message === "deleted") {
              getNotes().then(() => {
                setIsLoading(false);
                Swal.fire({ title: "Deleted!", text: "Your file has been deleted.", icon: "success", customClass: { confirmButton: `${styles.btnGreen}` } });
              });
            } else {
              setIsLoading(false);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "not authentication or error in token!",
                customClass: {
                  confirmButton: `${styles.btnGreen}`,
                },
              });
            }
          });
      }
    });
  }
  function getNoteIndex(noteId) {
    let selectedNote = userNotes.filter((note) => {
      return note._id === noteId;
    });
    let titleValue = selectedNote[0].title;
    let descValue = selectedNote[0].desc;
    document.querySelector("#editNote input").value = titleValue;
    document.querySelector("#editNote textarea").value = descValue;
    setTitleField(titleValue);
    setDescField(descValue);
    let currentNote = { ...note, NoteID: "" };
    currentNote.title = selectedNote[0].title;
    currentNote.desc = selectedNote[0].desc;
    currentNote.NoteID = selectedNote[0]._id;
    setNote(currentNote);
  }
  async function editNote(e) {
    e.preventDefault();
    setIsLoading(true);
    let { data } = await axios.put(`${baseUrl}updateNote`, note);
    if (data.message === "updated") {
      getNotes().then(() => {
        setIsLoading(false);
        setTitleField("");
        setDescField("");
        Swal.fire({ title: "Updated", text: "Your note has been updated.", icon: "success", customClass: { confirmButton: `${styles.btnGreen}` } });
      });
    } else {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "not authentication or error in token!",
        customClass: {
          confirmButton: `${styles.btnGreen}`,
        },
      });
    }
  }
  function search(e) {
    setSearchText(e.target.value);
    searchNotes(e.target.value, [...userNotes]);
  }
  function searchNotes(text, currentNotes) {
    let result = currentNotes.filter((note) => {
      return note.title.toLowerCase().includes(text.toLowerCase());
    });
    if (text) {
      setSearchResult(result);
    } else {
      setSearchResult([]);
      setSearchText("");
    }
  }

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    if (userNotes) {
      searchNotes(searchText, [...userNotes]);
    }
  }, [userNotes]);

  function clearFormOnClose() {
    document.getElementById("sendNote").reset();
  }

  return (
    <>
      <div className="navHeight"></div>
      <button type="button" className={`btn text-white border-0 d-flex flex-column align-items-center ${styles.addPosition}`} data-bs-toggle="modal" data-bs-target="#addNote">
        <span className={`py-2 ${styles.moving}`}>ADD NOTE</span>
        <i className="fa-solid fa-plus fa-2x"></i>
      </button>
      {isLoading ? (
        <span className={styles.loadingIndex}>
          <i className={`fa fa-spinner fa-spin fa-3x p-2 ${styles.textGray}`}></i>
        </span>
      ) : (
        ""
      )}
      <div className="container p-5 mt-3">
        <div className="row g-3">
          {userNotes.length > 0 ? (
            <div>
              <input type="text" className="form-control" placeholder="Search...." onKeyUp={search} />
            </div>
          ) : !isLoading && userNotes && userNotes.length === 0 ? (
            <div className="alert alert-dark text-center">There are no notes for showing</div>
          ) : (
            ""
          )}
          {searchText
            ? searchResult && (
                <>
                  <div className="d-flex justify-content-between">
                    <span className={`text-white px-3 py-2 rounded-2 ${searchResult.length === 0 ? styles.bgRed : styles.bgGreen}`}>Notes Count: {searchResult.length}</span>
                  </div>
                  {searchResult.map((note, index) => {
                    return (
                      <div key={index} className="col-md-6 col-xl-4">
                        <div className="card text-bg-light">
                          <div className="card-header position-relative px-4 text-center">
                            <h2 className={`h6 mb-0 ${styles.noteTitle}`}>{note.title}</h2>
                            <div className={`dropdown ${styles.menuPosition}`}>
                              <button className="border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button onClick={() => getNoteIndex(note._id)} className={`dropdown-item d-flex justify-content-between align-items-center ${styles.warning}`} data-bs-toggle="modal" data-bs-target="#editNote">
                                    Edit
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </li>
                                <li>
                                  <button onClick={() => deleteNote(note._id)} className={`dropdown-item d-flex justify-content-between align-items-center ${styles.danger}`}>
                                    Delete
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="card-body">
                            <p className="card-text">{note.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )
            : userNotes && (
                <>
                  {userNotes.length > 0 ? (
                    <div className="d-flex justify-content-between">
                      <span className={`text-white px-3 py-2 rounded-2 ${userNotes.length === 0 ? styles.bgRed : styles.bgGreen}`}>Notes Count: {userNotes.length}</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {userNotes.map((note, index) => {
                    return (
                      <div key={index} className="col-md-6 col-xl-4">
                        <div className="card text-bg-light">
                          <div className="card-header position-relative px-4 text-center">
                            <h2 className={`h6 mb-0 ${styles.noteTitle}`}>{note.title}</h2>
                            <div className={`dropdown ${styles.menuPosition}`}>
                              <button className="border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button onClick={() => getNoteIndex(note._id)} className={`dropdown-item d-flex justify-content-between align-items-center ${styles.warning}`} data-bs-toggle="modal" data-bs-target="#editNote">
                                    Edit
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </li>
                                <li>
                                  <button onClick={() => deleteNote(note._id)} className={`dropdown-item d-flex justify-content-between align-items-center ${styles.danger}`}>
                                    Delete
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="card-body">
                            <p className="card-text">{note.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
        </div>
      </div>
      <form onSubmit={sendNote} id="sendNote">
        <div className="modal fade" id="addNote" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5" id="exampleModalLabel">
                  Add Note
                </h2>
                <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close" onClick={clearFormOnClose}></button>
              </div>
              <div className="modal-body">
                <input
                  onChange={(e) => {
                    getNoteValue(e);
                    checkTitle(e);
                  }}
                  type="text"
                  className={`form-control my-2 shadow-none ${styles.inputFoucus}`}
                  placeholder="Note title"
                  name="title"
                />
                <textarea
                  onChange={(e) => {
                    getNoteValue(e);
                    checkDesc(e);
                  }}
                  className={`form-control mt-2 shadow-none ${styles.textareaFoucus}`}
                  placeholder="Type your note"
                  rows="10"
                  name="desc"></textarea>
              </div>
              <div className="modal-footer">
                <button type="submit" className={`btn shadow-none border-0 ${styles.btnGreen}`} disabled={!areAllFieldsFilled} data-bs-dismiss="modal">
                  Add
                </button>
                <button onClick={clearFormOnClose} type="button" className={`btn shadow-none border-0 ${styles.btnRed}`} data-bs-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <form onSubmit={editNote}>
        <div className="modal fade" id="editNote" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5" id="exampleModalLabel">
                  Edit
                </h2>
                <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input
                  onChange={(e) => {
                    getNoteValue(e);
                    checkTitle(e);
                  }}
                  type="text"
                  className={`form-control my-2 shadow-none ${styles.inputFoucus}`}
                  placeholder="Note title"
                  name="title"
                />
                <textarea
                  onChange={(e) => {
                    getNoteValue(e);
                    checkDesc(e);
                  }}
                  className={`form-control mt-2 shadow-none ${styles.textareaFoucus}`}
                  placeholder="Type your note"
                  rows="10"
                  name="desc"></textarea>
              </div>
              <div className="modal-footer">
                <button type="submit" className={`btn shadow-none border-0 ${styles.btnGreen}`} disabled={!areAllFieldsFilled} data-bs-dismiss="modal">
                  Update
                </button>
                <button type="button" className={`btn shadow-none border-0 ${styles.btnRed}`} data-bs-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
