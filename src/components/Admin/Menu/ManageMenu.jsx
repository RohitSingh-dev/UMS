import AdminLayout from "../AdminLayout.jsx";
import dragSvg from '../../../assets/drag.svg';
import {useState} from "react";

const ManageMenu = () => {
    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "Menu"}
    ];

    const initialMenuItems = [
        { id: "0", label: "Privacy Policy", selected: false },
        { id: "1", label: "Contact Us", selected: false },
        { id: "2", label: "Important Information", selected: false },
        { id: "3", label: "About Us", selected: false },
        { id: "4", label: "Dummy Co", selected: false },
    ];

    const initialPages = [
        { id: "5", label: "Important Information" },
        { id: "6", label: "Contact Us" },
        { id: "7", label: "Privacy Policy" },
        { id: "8", label: "About Us" },
        { id: "9", label: "Dummy Co" },
    ];

    const [menuItems, setMenuItems] = useState(initialMenuItems);
    const [pages, setPages] = useState(initialPages);

    const handleCheckboxChange = (id) => {
        setMenuItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleDragStart = (event, index) => {
        event.dataTransfer.setData("draggedIndex", index);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event, dropIndex, listType) => {
        const draggedIndex = parseInt(event.dataTransfer.getData("draggedIndex"), 10);
        if (draggedIndex === dropIndex) return;

        if (listType === "menuItems") {
            const updatedMenuItems = [...menuItems];
            const [draggedItem] = updatedMenuItems.splice(draggedIndex, 1);
            updatedMenuItems.splice(dropIndex, 0, draggedItem);
            setMenuItems(updatedMenuItems);
        } else if (listType === "pages") {
            const updatedPages = [...pages];
            const [draggedItem] = updatedPages.splice(draggedIndex, 1);
            updatedPages.splice(dropIndex, 0, draggedItem);
            setPages(updatedPages);
        }
    };

  return (
      <AdminLayout breadcrumbItems={breadcrumbData}>
          <div className="row mt-4">
              <div className="col-md-12">
                  <div className="card">
                      <div className="card-body min-h-auto">
                          <div className="row mt-3">
                              <div className="col-md-3">
                                  <div className="form-group text-middle">
                                      <label>Select a menu to edit: *</label>
                                  </div>
                              </div>
                              <div className="col-md-5">
                                  <div className="form-group">
                                      <select className="form-select form-select-sm form-control"
                                              aria-label=".form-select-sm example">
                                          <option selected="">Select once ...</option>
                                          <option value="1">English</option>
                                          <option value="2">Bengali</option>
                                      </select>
                                  </div>
                              </div>
                              <div className="col-md-4">
                                  <a href="#" className="btn btn-primary">Select</a>
                                  <span className="mx-3">or</span>
                                  <a href="#">Create new menu</a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="col-md-6">
                  <div className="card">
                      <div className="card-header mb-3">
                          <h5 className="card-title">Menu Structure</h5>
                          <p className="font-14 color-gray">Add menu items from the column on the left.</p>
                      </div>
                      <div className="card-body">
                          <ul id="sortable1" className="sub-menu-list list-item-style m-0">
                              {menuItems.map((item,index) => (
                                  <li
                                      key={item.id}
                                      draggable="true"
                                      onDragStart={(e) => handleDragStart(e, index)}
                                      onDragOver={handleDragOver}
                                      onDrop={(e) => handleDrop(e, index, "menuItems")}
                                      className={`form-check ${item.selected ? 'selected' : ''}`}
                                  >
                                      <img src={dragSvg} alt="drag" className="menu-dragging-svg" />
                                      <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={item.selected}
                                          id={item.id}
                                          onChange={() => handleCheckboxChange(item.id)}
                                      />
                                      <label className="form-check-label mx-2" htmlFor={item.id}>
                                          {item.label}
                                      </label>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>
              <div className="col-md-6">
                  <div className="card">
                      <div className="card-header mb-3">
                          <h5 className="card-title">Menus</h5>
                      </div>
                      <div className="card-body">
                          <div className="accordion" id="accordionExample">
                              <div className="accordion-item">
                                  <h2 className="accordion-header" id="headingOne">
                                      <button className="accordion-button collapsed" type="button"
                                              data-bs-toggle="collapse" data-bs-target="#collapseOne"
                                              aria-expanded="false" aria-controls="collapseOne" onClick={(e) => e.currentTarget.blur()}>
                                          Page
                                      </button>
                                  </h2>
                                  <div id="collapseOne" className="accordion-collapse collapse"
                                       aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                      <div className="accordion-body">
                                          <div className="form-group">
                                              <label>Search</label>
                                              <input type="text" className="form-control" placeholder="Type menu name"></input>
                                          </div>
                                          <ul id="sortable" className="sub-menu-list m-0">
                                              {pages.map((page, index) => (
                                                  <li key={page.id}
                                                      draggable="true"
                                                      onDragStart={(e) => handleDragStart(e, index)}
                                                      onDragOver={handleDragOver}
                                                      onDrop={(e) => handleDrop(e, index, "pages")}
                                                      className="form-check">
                                                      <img src={dragSvg} alt="drag" className="menu-dragging-svg" />
                                                      <input className="form-check-input" type="checkbox" value="" id={page.id} />
                                                      <label className="form-check-label mx-2" htmlFor={page.id}>
                                                          {page.label}
                                                      </label>
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="accordion">
                              <div className="accordion-item">
                                  <h2 className="accordion-header" id="headingTwo">
                                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                              data-bs-target="#collapseTwo" aria-expanded="false"
                                              aria-controls="collapseTwo" onClick={(e) => e.currentTarget.blur()}>
                                          Links
                                      </button>
                                  </h2>
                                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                                       data-bs-parent="#accordionExample">
                                      <div className="accordion-body">
                                          <div className="row align-items-center">
                                              <div className="col-3 mb-3">
                                                  <label className="form-label mb-0">URL :</label>
                                              </div>
                                              <div className="col-9 mb-3">
                                                  <input type="text" className="form-control solid" placeholder=""></input>
                                              </div>
                                              <div className="col-3">
                                                  <label className="form-label mb-0">Icon :</label>
                                              </div>
                                              <div className="col-9">
                                                  <i className="fas fa-compress-arrows-alt font-20"></i><span
                                                  className="ms-2">(fas fa-compress-arrows-alt)</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="row ">
              <div className="col-12">
                  <button className="btn btn-primary" type="submit">Save</button>
              </div>
          </div>
      </AdminLayout>
  )
};

export default ManageMenu