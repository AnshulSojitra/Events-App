import React, { useState, useEffect } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export const Post = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", body: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [TitleError, setTitleError] = useState("");
  const [BodyError, setBodyError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // READ - get posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user types
    if (name === "title" && value.trim()) {
      setTitleError("");
    }
    if (name === "body" && value.trim()) {
      setBodyError("");
    }
  };

  // CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    let hasError = false;

    if (!form.title.trim()) {
      setTitleError("*Title is required");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (!form.body.trim()) {
      setBodyError("*Body is required");
      hasError = true;
    } else {
      setBodyError("");
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      setLoading(true);
      if (editingId === null) {
        // CREATE - POST
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title.trim(),
            body: form.body.trim(),
            userId: 1,
          }),
        });
        const newPost = await res.json();

        newPost.id = Date.now();
        setPosts((prev) => [newPost, ...prev]);
      } else {
        // UPDATE - PUT
        const isLocalPost = editingId > 100;

        let updatedPost = {
          id: editingId,
          title: form.title,
          body: form.body,
          userId: 1,
        };

        if (!isLocalPost) {
          try {
            const res = await fetch(`${API_URL}/${editingId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedPost),
            });

            if (res.ok) {
              const apiUpdated = await res.json();
              updatedPost = { ...apiUpdated, id: editingId };
            }
          } catch (err) {
            console.error("PUT failed, updating locally anyway");
          }
        }

        setPosts((prev) =>
          prev.map((p) => (p.id === editingId ? updatedPost : p))
        );
        setEditingId(null);
      }

      // Clear form after submit
      setForm({ title: "", body: "" });
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Start editing
  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({ title: post.title, body: post.body });
    setTitleError("");
    setBodyError("");
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            placeholder="Post title"
          />
          {TitleError && <p className="text-danger">{TitleError}</p>}
        </div>

        <div className="mb-3">
          <label className="form-label">Body</label>
          <textarea
            name="body"
            className="form-control"
            rows="3"
            value={form.body}
            onChange={handleChange}
            placeholder="Post content"
          />
          {BodyError && <p className="text-danger">{BodyError}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {editingId === null
            ? isSubmitting
              ? "Loading..."
              : "Create Post"
            : isSubmitting
            ? "Loading..."
            : "Update Post"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", body: "" });
              setTitleError("");
              setBodyError("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Error & Loading */}
      {error && <p className="text-danger">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Posts List */}
      <table className="table table-bordered table-striped mt-4">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th style={{ width: "160px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.body}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No posts available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
