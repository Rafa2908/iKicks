import { useState } from "react";
import "./MyOrder.css";

const MyOrders = () => {
  const token = localStorage.getItem("token");

  const [myOrders] = useState([]);

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
