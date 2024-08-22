import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container } from "react-bootstrap";

const Transaction = () => {
  const [orderList, setOrderList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const orderResponse = await axios.get("http://172.16.100.39:8000/order", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Order response:", orderResponse);
      setOrderList(orderResponse.data.data);

      const menuResponse = await axios.get("http://172.16.100.39:8000/coffee", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Menu response:", menuResponse);
      setMenuList(menuResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (order) => {
    let totalPrice = 0;
    order.order_detail.forEach((detail) => {
      totalPrice += detail.price;
    });
    return totalPrice;
  };

  const findMenuItem = (coffeeId) => {
    return menuList.find((item) => item.id === coffeeId);
  };

  return (
    <Container>
      <h4 className="mt-3 mb-3">Order History</h4>

      {loading? (
        <p>Loading...</p>
      ) : (
        <Table stripped bordered hover className="mt-3 custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order Date</th>
              <th>Customer Name</th>
              <th>Order Type</th>
              <th>Detail Order</th>
              <th>Total Price</th>
            </tr>
          </thead>

          <tbody>
            {orderList?.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.order_date}</td>
                <td>{order.customer_name}</td>
                <td>{order.order_type}</td>
                <td>
                  <ul>
                    {order.order_detail?.map((detail) => (
                      <li key={detail.id}>
                        {findMenuItem(detail.coffee_id) && findMenuItem(detail.coffee_id).name}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{calculateTotalPrice(order)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {error && <p>Error: {error.message}</p>}
    </Container>
  );
};

export default Transaction;