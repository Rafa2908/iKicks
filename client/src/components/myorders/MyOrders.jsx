import React, { useEffect, useState } from "react";
import { userOrders } from "../../service/client.service";
import "./MyOrder.css";

const MyOrders = () => {
  const token = localStorage.getItem("token");

  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (token) {
      userOrders(token)
        .then((res) => setMyOrders(res.orders))
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <>
      {token ? (
        <div className="container">
          <div>
            <h2 className="text-center display-3 mt-5 mb-5">My Orders</h2>
            <table className="table table-dark table-bordered text-center order-table">
              <thead>
                <tr>
                  <th>Order#</th>
                  <th>Order Amount</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((order) => {
                  return (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>${order.amount.toFixed(2)}</td>
                      <td>{order.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default MyOrders;
