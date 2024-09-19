import React from 'react'
import "../doctormain.css"

const Doctormain = () => {
  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-light">
        <p className="navbar-brand">Doctor Dashboard</p>
        <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link text-light"><i className="fas fa-user-md"></i> Profile</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-light"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </li>
            </ul>
        </div>
    </nav>
    <div className="container dashboard">
        <h2 className="text-center">Upcoming Appointments</h2>
        <div className="row">
            <div className="col-md-12 appointment-list">
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">John Doe - 12:30 PM, 20th Sept</h5>
                        <p className="card-text">Reason: Regular Checkup</p>
                        <div className="action-buttons">
                            <button className="btn btn-accept"><i className="fas fa-check"></i> Accept</button>
                            <button className="btn btn-cancel"><i className="fas fa-times"></i> Cancel</button>
                            <button className="btn btn-reject"><i className="fas fa-exclamation-circle"></i> Reject</button>
                        </div>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">Jane Smith - 02:00 PM, 20th Sept</h5>
                        <p className="card-text">Reason: Headache Consultation</p>
                        <div className="action-buttons">
                            <button className="btn btn-accept"><i className="fas fa-check"></i> Accept</button>
                            <button className="btn btn-cancel"><i className="fas fa-times"></i> Cancel</button>
                            <button className="btn btn-reject"><i className="fas fa-exclamation-circle"></i> Reject</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    </div>
  )
}

export default Doctormain