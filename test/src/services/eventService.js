import { EVENTS_API } from "../config/api";

// GET events (with pagination + search)
export const getEvents = async ({ page, limit, search, sortBy, sortOrder }) => {
  const res = await fetch(
    `${EVENTS_API}?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );

  if (!res.ok) throw new Error("Failed to fetch events");

  return res.json();
};

// GET single event
export const getEventById = async (id) => {
  const res = await fetch(`${EVENTS_API}/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }

  return res.json();
};

// CREATE event
export const createEvent = async (formData) => {
  const res = await fetch(EVENTS_API, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create event");
  }

  return res.json();
};

// UPDATE event
export const updateEvent = async (id, formData) => {
  const res = await fetch(`${EVENTS_API}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update event");
  }

  return res.json();
};

// DELETE event
export const deleteEvent = async (id) => {
  const res = await fetch(`${EVENTS_API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete event");
  }

  return res.json();
};

// CREATE or UPDATE event
export const saveEvent = async ({ id, isEdit, formData }) => {
  const url = isEdit ? `${EVENTS_API}/${id}` : EVENTS_API;
  const method = isEdit ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    body: formData,
  });

  if (!res.ok) {
    throw new Error(
      isEdit ? "Failed to update event" : "Failed to create event"
    );
  }

  return res.json();
};
