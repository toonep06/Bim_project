import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ใช้ axios ในการดึงข้อมูลจาก API
import DataTable from 'datatables.net-dt';


function Projects() {
    let table = new DataTable('#myTable', {
        responsive: true
    });
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]); // ใช้สำหรับเก็บข้อมูลที่ถูกค้นหา
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(''); // ใช้สำหรับเก็บข้อความค้นหา

    // ดึงข้อมูลจาก API เมื่อ component ถูก mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // ดึง token จาก LocalStorage
                const token = localStorage.getItem('token');

                // หากไม่มี token ให้แจ้ง error
                if (!token) {
                    setError('No token found. Please log in.');
                    return;
                }

                // ส่งคำขอ API พร้อม Authorization Header
                const response = await axios.get('http://localhost:3000/api/projects', {
                    headers: {
                        Authorization: `Bearer ${token}`, // แนบ token ใน Authorization header
                    },
                });

                setProjects(response.data); // เก็บข้อมูลโปรเจกต์ใน state
                setFilteredProjects(response.data); // เก็บข้อมูลโปรเจกต์ในตัวกรอง
            } catch (error) {
                setError('Failed to fetch projects.'); // หากเกิดข้อผิดพลาด
                console.error(error);
            }
        };

        fetchProjects();
    }, []); // ดึงข้อมูลแค่ครั้งแรกที่หน้าโหลด

    // ฟังก์ชันสำหรับจัดการการค้นหา
    const handleSearch = (e) => {
        setSearch(e.target.value);
        const filtered = projects.filter((project) =>
            project.project_name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredProjects(filtered);
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!projects.length) {
        return <div>Loading projects...</div>; // แสดงข้อความขณะรอข้อมูล
    }

    return (
        <div className="container mt-">
            <h2 className="mb-3">Project List</h2>
            {/* ฟอร์มค้นหา */}
            <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Earnings (Monthly)</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Earnings (Annual)</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">$215,000</div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Projects
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-auto">
                                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">2</div>
                                        </div>
                                        <div className="col">
                                            <div className="progress progress-sm mr-2">
                                                <div className="progress-bar bg-info" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-list fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Tasks
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-auto">
                                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">60</div>
                                        </div>
                                        <div className="col">
                                            <div className="progress progress-sm mr-2">
                                                <div className="progress-bar bg-info" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                    <input type="text" className="form-control bg-white border-1 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2"
                        value={search}
                        onChange={handleSearch}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                            <i className="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div>
            </form>
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">DataTables Example</h6>
                </div>
                <div class="card-body">
                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead className="thead-dark">
                            <tr>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Images</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr key={project.project_id}>
                                    <td>{project.project_name}</td>
                                    <td>{project.description}</td>
                                    <td>{project.status}</td>
                                    <td>{new Date(project.start_date).toLocaleDateString()}</td>
                                    <td>{new Date(project.end_date).toLocaleDateString()}</td>
                                    <td>
                                        {/* ถ้ามีรูปภาพให้แสดง */}
                                        {project.image_url ? (
                                            <img
                                                src={`http://localhost:3000${project.image_url}`} // เปลี่ยนเป็น URL รูปภาพจริง
                                                alt={`Project ${project.project_name}`}
                                                className="img-fluid"
                                                width="100px"
                                            />
                                        ) : (
                                            'No images'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Projects;
