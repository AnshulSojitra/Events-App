import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_API } from "../config/api";
import { saveEvent, getEventById } from "../services/eventService";

export function EventForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        const data = await getEventById(id);

        setForm({
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
        });

        if (data.imageUrl) {
          setImagePreview(`${BASE_API}${data.imageUrl}`);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id, isEdit]);

  function toSqlDateOnly(value) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError("");
    setImageFile(file || null);
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Only image files (jpg, png, gif, etc.) are allowed.");
        setImageFile(null);
        setImagePreview(null);
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const validate = () => {
    const newErr = {};
    if (!form.name) newErr.name = "*Event name is required";
    if (!form.description) newErr.description = "*Description is required";
    if (!form.startDate) newErr.startDate = "*Start date is required";
    if (!form.endDate) newErr.endDate = "*End date is required";
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.startDate) > new Date(form.endDate)
    ) {
      newErr.endDate = "*End date must be later than Start date";
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (imageError) return;

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("startDate", form.startDate);
      fd.append("endDate", form.endDate);

      if (imageFile) fd.append("image", imageFile);

      //central service
      await saveEvent({
        id,
        isEdit,
        formData: fd,
      });

      //success
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-4 shadow p-4 rounded"
      style={{ maxWidth: 700 }}
    >
      <h2>{isEdit ? "Edit Event" : "Create Event"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Event Name</label>
          <input
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <small className="text-danger">{errors.name}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && (
            <small className="text-danger">{errors.description}</small>
          )}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Start Date</label>
            <input
              min={isEdit ? 0 : toSqlDateOnly(new Date())}
              type="date"
              name="startDate"
              className="form-control"
              value={form.startDate}
              onChange={handleChange}
            />
            {errors.startDate && (
              <small className="text-danger">{errors.startDate}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-control"
              value={form.endDate}
              onChange={handleChange}
            />
            {errors.endDate && (
              <small className="text-danger">{errors.endDate}</small>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
          />
          {imageError && <small className="text-danger">{imageError}</small>}
        </div>

        {imagePreview && (
          <div className="mb-3">
            <label className="form-label">Preview</label>
            <div>
              <img
                src={imagePreview}
                alt="preview"
                style={{ maxWidth: "100%", maxHeight: 300 }}
              />
            </div>
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
}
