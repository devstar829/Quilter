import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadNetlist: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any | null>(null);

  const { name, description } = formData;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (
        selectedFile.type !== "application/json" &&
        !selectedFile.name.endsWith(".json")
      ) {
        setError("Please upload a JSON file");
        setFile(null);
        setFileContent("");
        setPreviewData(null);
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const content = event.target.result as string;
          setFileContent(content);

          try {
            const parsedData = JSON.parse(content);
            setPreviewData(parsedData);
            setError(null);
          } catch (err) {
            setError("Invalid JSON format");
            setPreviewData(null);
          }
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a netlist file");
      return;
    }

    if (!previewData) {
      setError("Invalid netlist data");
      return;
    }

    if (!previewData.components || !Array.isArray(previewData.components)) {
      setError("Netlist must include components array");
      return;
    }

    if (!previewData.nets || !Array.isArray(previewData.nets)) {
      setError("Netlist must include nets array");
      return;
    }

    setLoading(true);

    try {
      const netlistData = {
        name,
        description,
        components: previewData.components,
        nets: previewData.nets,
      };

      const res = await axios.post("/netlists", netlistData);

      navigate(`/netlists/${res.data._id}`);
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Error uploading netlist");
      }
    }
  };


  return (
    <div className="upload-netlist">
      <h1 className="mb-4">Upload Netlist</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Netlist Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={name}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={description}
                onChange={onChange}
                rows={3}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="file">Netlist File (JSON) *</label>
              <div className="custom-file">
                <input
                  type="file"
                  id="file"
                  className="custom-file-input"
                  onChange={onFileChange}
                  accept=".json,application/json"
                />
                <label className="custom-file-label" htmlFor="file">
                  {file ? file.name : "Choose file"}
                </label>
              </div>
              <small className="form-text text-muted">
                Upload a JSON file containing components and nets data
              </small>
            </div>

            <div className="d-flex justify-content-between">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Netlist"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {previewData && (
        <div className="card">
          <div className="card-header">
            <h3 className="mb-0">Netlist Preview</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h4>Components ({previewData.components?.length || 0})</h4>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Pins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.components?.map((component: any) => (
                        <tr key={component.id}>
                          <td>{component.id}</td>
                          <td>{component.name}</td>
                          <td>{component.type}</td>
                          <td>{component.pins?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-6">
                <h4>Nets ({previewData.nets?.length || 0})</h4>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Connections</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.nets?.map((net: any) => (
                        <tr key={net.id}>
                          <td>{net.id}</td>
                          <td>{net.name}</td>
                          <td>{net.connections?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h4>JSON Preview</h4>
              <pre className="bg-light p-3 rounded">
                <code>{fileContent}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadNetlist;
