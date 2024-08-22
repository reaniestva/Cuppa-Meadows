import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Menu.css"; // Import custom CSS file for styling
import axios from "axios";

const MenuPage = () => {
  const [menuList, setMenuList] = useState([]); // Initialize menuList as an empty array
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected menu item for editing
  const [editedMenu, setEditedMenu] = useState({
    name: "",
    image: "",
    size: "",
    price: "",
  }); // State to store edited menu data

  const [newMenu, setNewMenu] = useState({
    name: "",
    image: "",
    size: 0,
    price: null,
  });

  // Function to handle deletion of a menu item
  const handleDelete = async (menuName) => {
    try {
      await axios.delete(`http://172.16.100.39:8000/coffee/${menuName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  // Function to add a new menu item
  const addMenu = async () => {
    const formData = new FormData();
    formData.append("name", newMenu.name);
    formData.append("image", newMenu.image);
    formData.append("size", newMenu.size);
    formData.append("price", newMenu.price);

    try {
      const response = await axios.post(
        "http://172.16.100.39:8000/coffee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setNewMenu({
        name: "",
        image: "",
        size: 0,
        price: null,
      });
    } catch (error) {
      console.error("Error adding menu:", error);
    }
  };

  // Function to handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle opening the modal for editing a menu item
  const handleEdit = (item) => {
    setEditedMenu({
      name: item.name,
      image: item.image,
      price: item.price,
      size: item.size,
    });
    setSelectedItem(item);
    setIsModalOpen(true); // Open modal when editing
  };

  // Function to handle opening the modal for adding a new menu item
  const handleAddMenu = () => {
    setEditedMenu({ name: "", image: "", size: "", price: "" });
    setIsModalOpen(true);
  };

  // Function to handle form submission for editing a menu item
  const handleSave = (e) => {
    e.preventDefault();
    // Update the menu item in the menu list
    const updatedMenuList = [...menuList]; // Copy the original menu list
    if (selectedItem) {
      // If editing an existing item
      const index = updatedMenuList.findIndex((item) => item.name === selectedItem.name);
      if (index !== -1) {
        // If the item is found
        updatedMenuList[index] = editedMenu; // Update the item
      }
    } else {
      // If adding a new item
      updatedMenuList.push(editedMenu); // Add the new item
    }
    setMenuList(updatedMenuList);
    // Close the modal
    setIsModalOpen(false);
    // Reset the state
    setSelectedItem(null);
    setEditedMenu({ name: "", image: "", size: "", price: "" });
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setEditedMenu({ name: "", image: "", size: "", price: "" });
  };


  // Function to fetch coffee menu data from the provided URL
  const fetchData = async () => {
    try {
      const response = await axios.get(searchTerm ? `http://172.16.100.39:8000/coffee?search=${searchTerm}` : "http://172.16.100.39:8000/coffee");
      setMenuList(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData()
  }, [searchTerm])

  // Filter the menu list based on the search term
  const filteredMenuList = Array.isArray(menuList)
    ? menuList.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  return (
    <div className="container">
      {/* Content */}
      <div className="row mt-3">
        <div className="col text-center">
          <h1 className="menu-title">Coffee Menu</h1>
          <input
            type="text"
            placeholder="Search menu items"
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control mt-3"
          />
          <button
            className="btn btn-outline-dark mt-3"
            onClick={handleAddMenu}
          >
            Add Menu Item
          </button>
        </div>
      </div>
      {/* Menu List */}
      <div className="row mt-3">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>Menu Name</th>
                <th>Image</th>
                <th>Size</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenuList.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>{item.size}</td>
                  <td>{item.price}</td>
                  <td>
                    <button
                      className="btn btn-outline-dark btn-sm mr-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(item.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for editing menu items */}
      {isModalOpen && (
        <div className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={handleModalClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label htmlFor="menuName">Menu Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="menuName"
                      placeholder="Enter menu name"
                      value={editedMenu.name}
                      onChange={(e) =>
                        setEditedMenu({ ...editedMenu, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="menuImage">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      id="menuImage"
                      placeholder="Enter image URL"
                      value={editedMenu.image}
                      onChange={(e) =>
                        setEditedMenu({ ...editedMenu, image: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="menuSize">Size</label>
                    <input
                      type="text"
                      className="form-control"
                      id="menuSize"
                      placeholder="Enter size"
                      value={editedMenu.size}
                      onChange={(e) =>
                        setEditedMenu({ ...editedMenu, size: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="menuPrice">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      id="menuPrice"
                      placeholder="Enter price"
                      value={editedMenu.price}
                      onChange={(e) =>
                        setEditedMenu({ ...editedMenu, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      !editedMenu.name ||
                      !editedMenu.image ||
                      !editedMenu.size ||
                      !editedMenu.price
                    }
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;