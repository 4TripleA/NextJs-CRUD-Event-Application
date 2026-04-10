"use client";

import Navbar from '@/components/navbar'
import React, { useState } from 'react'

const AddEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    organizer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Event created successfully!');
        setFormData({
          title: '',
          description: '',
          date: '',
          location: '',
          category: '',
          organizer: ''
        });

        window.location.href = '/';

      } else {
        setMessage(data.error || 'Failed to create event');
      }
    } catch (error) {
      setMessage('An error occurred while creating the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className='bg-[whitesmoke] border border-gray-500 rounded-[8px] mx-7 my-4 py-3 px-5'>
        <h1>Add New Event</h1>

        {message && (
          <div className={`mt-3 p-2 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div> 
        )}

        <form onSubmit={handleSubmit}>
          <div className='mt-3'>
            <label htmlFor="title">TITLE</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder='e.g NextJs Summit Course 2026'
              className='mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white'
              required
            />
          </div>

          <div className='mt-3'>
            <label htmlFor="description">DESCRIPTION</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder='Describe the event....'
              className='mt-2 w-full h-[100px] border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white resize-none'
              required
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4'>
            <div className='mt-3'>
              <label htmlFor="date">DATE</label>
              <input
                type="text"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                placeholder='dd/mm/yyyy'
                className='mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white'
                required
              />
            </div>
            <div className='mt-3'>
              <label htmlFor="location">LOCATION</label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                placeholder='city, country..'
                className='mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white'
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4'>
            <div className='mt-3'>
              <label htmlFor="category">CATEGORY</label>
              <input
                type="text"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                placeholder='category'
                className='mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white'
                required
              />
            </div>
            <div className='mt-3'>
              <label htmlFor="organizer">ORGANIZER</label>
              <input
                type="text"
                name="organizer"
                id="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder='person or organization name'
                className='mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white'
                required
              />
            </div>
          </div>

          <div className="border border-gray-300 w-full h-[0] my-4"></div>

          <div className='flex flex-row gap-3'>
            <a href={'/'} className="border border-gray-500 rounded-[7px] p-2 mb-2.5 mt-3 ml-auto">Cancel</a>
            <button
              type="submit"
              disabled={isSubmitting}
              className="border border-gray-500 rounded-[7px] p-2 mb-2.5 mt-3 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEvent