import React from 'react'
import { API_URL } from '../service/config'

const TicketDetails = ({ticket,OpenImage}) => {
  return (
       <div className="space-y-4">
          {ticket ? (<div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 cursor-pointer">
            <h3 className="text-xl font-bold text-gray-800">Title: {ticket.title}</h3>
            <p className="text-lg text-gray-600 mt-2">Email: {ticket.email}</p>
            <p className="text-lg text-gray-600 mt-2">Reason: {ticket.reason}</p>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Attached Photo</h3>
              <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                <img
                  onClick={() => OpenImage(ticket.photo)}
                  src={API_URL + `/uploads/tickets/${ticket.photo}`}
                  alt="Attached"
                  className="w-full h-full object-cover shadow-md hover:shadow-2xl"
                />
              </div>
            </div>
          </div>) : (
            <div>Loading ticket details...</div>
          )}
        </div>
  )
}

export default TicketDetails
