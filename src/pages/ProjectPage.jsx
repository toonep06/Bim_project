import Template from "../components/Template";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // ใช้ axios ในการดึงข้อมูลจาก API
import '/node_modules/startbootstrap-sb-admin-2/vendor/datatables/jquery.dataTables.min.js';
import '/node_modules/startbootstrap-sb-admin-2/vendor/datatables/dataTables.bootstrap4.min.css';
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { RoleContext } from '../services/RoleContext';
import config from "../../config";

function ProjectPage() {
    const { role } = useContext(RoleContext);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]); // ใช้สำหรับเก็บข้อมูลที่ถูกค้นหา
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(''); // ใช้สำหรับเก็บข้อความค้นหา
    const [createProjects, setCreateProjects] = useState({ status: 'active' });
    const [imageFile, setImageFile] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem('token');


    //createProjects.status = 'Active';
    // ฟังก์ชันสำหรับเปลี่ยนสถานะและปรับเปลี่ยน class
    const [fileName, setFileName] = useState(''); // สร้าง state สำหรับเก็บชื่อไฟล์
    const editSet =(data)=>{
        console.log(data)
        setCreateProjects(data);
    }
    const handleChangeFile2 = (files) => {
        if (files.length > 0) {
            setFileName(files[0].name); // เก็บชื่อไฟล์ที่ถูกเลือก
        } else {
            setFileName(''); // ถ้าไม่มีไฟล์ถูกเลือกก็ให้เคลียร์ค่า
        }
    }

    const handleRowClick = (project_name, projectId) => {
        // ลิ้งไปยังหน้าที่เกี่ยวข้องกับ Task ของโปรเจคที่คลิ๊ก
        navigate(`/tasks/${project_name}/${projectId}`);
    };
    // ดึงข้อมูลจาก API เมื่อ component ถูก mount
    useEffect(() => {

        fetchProjects();

    }, []); // ดึงข้อมูลแค่ครั้งแรกที่หน้าโหลด
    const clearData = () => {
        setCreateProjects(
            {
                project_name: '',
                description: '',
                start_date: '',
                end_date: '',
                status: 'active'
            }
        );
    }
    const handleClose = () => {
        const btns = document.getElementsByClassName('close');
        for (let i = 0; i < btns.length; i++) {
            btns[i].click();
        }
    }
    const fetchProjects = async () => {
        try {
            // ดึง token จาก LocalStorage

            // หากไม่มี token ให้แจ้ง error
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            // ส่งคำขอ API พร้อม Authorization Header
            const response = await axios.get(config.api_path + '/api/projects', config.headers());

            setProjects(response.data); // เก็บข้อมูลโปรเจกต์ใน state
            setFilteredProjects(response.data); // เก็บข้อมูลโปรเจกต์ในตัวกรอง
            if ($.fn.DataTable.isDataTable('#dataTable')) {
                $('#dataTable').DataTable().destroy();
            }
            $('#dataTable').DataTable().destroy()
            setTimeout(() => {
                $('#dataTable').DataTable({
                    paging: true,
                    searching: true,
                    ordering: true,
                    destroy: true,
                    language: {
                        paginate: {
                            previous: "Previous ", // เปลี่ยนปุ่ม Previous
                            next: " Next", // เปลี่ยนปุ่ม Next
                        },
                        search: "_INPUT_", // ใช้ช่องค้นหาแบบ Input
                        searchPlaceholder: "Search projects...", // ข้อความในช่องค้นหา
                    },
                    dom:
                        "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6 'f>>" + // จัดการค้นหาและการเลือกหน้า
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>", // จัดวาง pagination
                });
            }, 100);
        } catch (error) {
            setError('Failed to fetch projects. please login'); // หากเกิดข้อผิดพลาด
            navigate('/login');
            console.error(error);
        }
    };
    // ฟังก์ชันสำหรับจัดการการค้นหา
    const handleSearch = (e) => {
        setSearch(e.target.value);
        const filtered = projects.filter((project) =>
            project.project_name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredProjects(filtered);
    };
    const delelteProject = async (projectId) => {
        console.log(projectId)
        event.stopPropagation();
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await axios.delete(config.api_path + '/api/projects/' + projectId, config.headers());  // เรียก API ลบ Task
                Swal.fire('Deleted!', 'Your task has been deleted.', 'success');

                // อัพเดตรายการ Task หลังจากลบ
                setFilteredProjects(filteredProjects.filter(project => project.id !== projectId));
                fetchProjects();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            Swal.fire('Error', 'There was an error deleting the task.', 'error');
        }
    };

    const handleChangeFile = (files) => {
        if (files.length > 0) {
            setImageFile(files[0]); // อัปเดตสถานะเพื่อเก็บไฟล์ภาพที่เลือก
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        console.log(e)
        const formData = new FormData();
        formData.append('project_name', createProjects.project_name);
        formData.append('description', createProjects.description);
        formData.append('status', createProjects.status);
        formData.append('start_date', createProjects.start_date);
        formData.append('end_date', createProjects.end_date);

        if (imageFile) {
            formData.append('images', imageFile); // อัปโหลดไฟล์รูปภาพ
        }

        try {
            let response = {};
            if (createProjects.project_id !== undefined) {
                console.log(createProjects.project_id)
                response = await axios.put(config.api_path + '/api/projects/'+createProjects.project_id, formData, config.headers());
            }
            else {
                response = await axios.post(config.api_path + '/api/projects', formData, config.headers());
                console.log('Create');
            }
            if (response.status === 201) {
                Swal.fire({ title: 'Success', text: 'Project created successfully', icon: 'success', timer: 2000 });
                clearData();
                handleClose();
                fetchProjects();
                // สามารถทำการอัปเดตรายการ Project หรือรีเฟรชข้อมูลหลังจากสร้างสำเร็จได้
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to create project', 'error');
            console.error('Error creating project:', error);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }
    const filterDataTable = (status) => {
        const table = $('#dataTable').DataTable();
        if (status === 'all') {
            table.search('').columns().search('').draw();
        } else {
            table.column(2).search(status ? `^${status}$` : '', true, false).draw();  // กรองโดยสถานะ (status)
        }
    };
    /*     if (!projects.length) {
            return <div>Loading projects...</div>; // แสดงข้อความขณะรอข้อมูล
        } */

    return (
        <>
            <Template title="Projects">
                <div className="d-flex flex-column mx-3">
                    {/* ฟอร์มค้นหา */}
                    <div className="row mt-3">
                        <div className="col-xl-3 col-md-6 mb-3">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                Earnings</div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 mb-3">
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
                        <div className="col-xl-3 col-md-6 mb-3">
                            <div className="card border-left-info shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Projects
                                            </div>
                                            <div className="row no-gutters align-items-center">
                                                <div className="col-auto">
                                                    <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{projects.length}</div>
                                                </div>
                                                <div className="col">
                                                    <div className="progress progress-sm mr-2">
                                                        <div className="progress-bar bg-info" role="progressbar" style={{ width: `${projects.length}%` }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
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
                        <div className="col-xl-3 col-md-6 mb-3">
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

                    {/* ตารางแสดงผลโปรเจกต์ */}
                    <div className="card shadow mb-4">
                        <div className="card-header py-1">
                            <div className="d-sm-flex align-items-center justify-content-between mb-1 flex-wrap">
                                <div className="d-flex flex-column flex-md-row mx-3 mb-2">
                                    <span className="m-0 font-weight-bold text-primary mb-2 mb-md-0 mr-md-5">Project</span>

                                    {/* ปุ่มกรองข้อมูล */}
                                    <div className="d-flex flex-wrap">
                                        <span
                                            onClick={() => filterDataTable('all')}
                                            className="btn btn-sm btn-primary shadow-sm mr-2 mb-2 mb-md-0"
                                        >
                                            ALL : {projects.length}
                                        </span>
                                        <span
                                            onClick={() => filterDataTable('active')}
                                            className="btn btn-sm btn-success shadow-sm mr-2 mb-2 mb-md-0"
                                        >
                                            Active : {projects.filter(project => project.status === 'active').length}
                                        </span>
                                        <span
                                            onClick={() => filterDataTable('inactive')}
                                            className="btn btn-sm btn-secondary shadow-sm mr-2 mb-2 mb-md-0"
                                        >
                                            Inactive : {projects.filter(project => project.status === 'inactive').length}
                                        </span>
                                    </div>
                                </div>

                                {/* ปุ่ม Generate Task */}
                                <a
                                    onClick={clearData}
                                    className="btn btn-sm btn-primary shadow-sm"
                                    data-toggle="modal"
                                    data-target="#modalUser"
                                >
                                    <i className="fas fa-plus fa-sm text-white-50"></i> Generate Project
                                </a>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" width="95%" cellSpacing="0" style={{ tableLayout: "fixed", borderCollapse: "collapse" }}>
                                    <thead className="text-dark " style={{ fontSize: "14px" }}>
                                        <tr>
                                            <th style={{ width: '90px', textAlign: 'center', verticalAlign: 'middle' }}>Company</th>
                                            <th style={{ width: '110px', textAlign: 'center', verticalAlign: 'middle' }}>Description</th>
                                            <th style={{ width: '50px', textAlign: 'center', verticalAlign: 'middle' }}>Status</th>
                                            <th style={{ width: '50px', textAlign: 'center', verticalAlign: 'middle' }}>Tasks</th>
                                            <th style={{ width: '50px', textAlign: 'center', verticalAlign: 'middle' }}>Issues</th>
                                            <th style={{ width: '90px', textAlign: 'center', verticalAlign: 'middle' }}>Start Date</th>
                                            <th style={{ width: '90px', textAlign: 'center', verticalAlign: 'middle' }}>Due Date</th>
                                            <th style={{ width: '50px', textAlign: 'center', verticalAlign: 'middle' }}>Action</th>

                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {filteredProjects.map((project) => (
                                            <tr key={project.project_id} onClick={() => handleRowClick(project.project_name, project.project_id)}>
                                                <td className="text-center">
                                                    {project.Images[0] ? (
                                                        <img
                                                            src={`http://localhost:3000${project.Images[0].url}`}
                                                            alt={`Project ${project.project_name}`}
                                                            className="img-fluid"
                                                            width="50px"
                                                        />
                                                    ) : (
                                                        'No images'
                                                    )}
                                                    <div> {project.project_name}</div>
                                                </td>
                                                <td style={{ verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word' }}>{project.description}</td>
                                                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                                                    {project.status === 'active' ? (
                                                        <span className="badge badge-success">Active</span>
                                                    ) : (
                                                        <span className="badge badge-secondary">Inactive</span>
                                                    )}
                                                </td>
                                                <td className="text-center h5" style={{ verticalAlign: 'middle' }}>
                                                    {project.Tasks.length > 0 ? (
                                                        <span className="badge badge-warning">{project.Tasks.length}</span>
                                                    ) : (
                                                        <span className="badge badge-success">{project.Tasks.length}</span>
                                                    )}
                                                </td>
                                                <td className="text-center h5" style={{ verticalAlign: 'middle' }}>
                                                    {project.Issues.length > 0 ? (
                                                        <span className="badge badge-danger">{project.Issues.length}</span>
                                                    ) : (
                                                        <span className="badge badge-secondary">{project.Issues.length}</span>
                                                    )}
                                                </td>
                                                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                                                    {new Date(project.start_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                                                    {new Date(project.end_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                                                    <button className="btn btn-sm btn-circle btn-success mr-3"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            editSet(project);
                                                            $('#modalUser').modal('show'); // ใช้ jQuery ในการเปิด modal
                                                        }}
                                                    >
                                                        <i className="fa fa-pen"></i>
                                                    </button>
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation(); // หยุด onClick ของ tr
                                                            delelteProject(project.project_id);
                                                        }}
                                                        className="btn btn-sm btn-circle btn-danger"
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </Template>
            <Modal id="modalUser" title='Generate Project' modalSize="modal-lg">
                <form onSubmit={handleCreateProject}>
                    <div>
                        <label>Project Name</label>
                        <input
                            className="form-control"
                            value={createProjects.project_name || ''}
                            onChange={(e) => setCreateProjects({ ...createProjects, project_name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <label>Description</label>
                        <input
                            className="form-control"
                            value={createProjects.description || ''}
                            onChange={(e) => setCreateProjects({ ...createProjects, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <label className="mr-3">Status</label>
                        <select
                            className={`badge ${createProjects.status === 'active' ? 'badge-success' : 'badge-secondary'}`}
                            value={createProjects.status || ''}
                            onChange={(e) => setCreateProjects({ ...createProjects, status: e.target.value })}

                        >
                            <option onClick={(e) => setCreateProjects({ ...createProjects, status: e.target.value })} className="badge-success" value="active">
                                Active
                            </option>
                            <option onClick={(e) => setCreateProjects({ ...createProjects, status: e.target.value })} className="badge-secondary" value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>
                    <div className="mt-3 input-group">
                        <label className="input-group-text mr-1 bg-info text-white">Start Date</label>
                        <input
                            type="date"
                            className="form-control mr-2"
                            value={createProjects.start_date ? new Date(createProjects.start_date).toISOString().substring(0, 10) : ' '}
                            onChange={(e) => setCreateProjects({ ...createProjects, start_date: e.target.value })}
                            required
                        />
                        <label className="input-group-text bg-info text-white">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={createProjects.end_date ? new Date(createProjects.end_date).toISOString().substring(0, 10) : ' '}
                            onChange={(e) => setCreateProjects({ ...createProjects, end_date: e.target.value })}
                            placeholder="dd/mm/yyyy" 
                            required
                        />
                    </div>
                    <div className="mt-4 input-group">
                        <input
                            id="file-input"
                            onChange={(e) => handleChangeFile(e.target.files)}
                            type="file"
                            name="imageName"
                            className="form-control "
                        />
                        <div className="input-group-text">Upload Image</div>
                    </div>
                    <div className="mt-4 text-right ">
                        <button type="submit" className="btn btn-success">
                            <i className="fa fa-check me-2 mr-2"></i>
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default ProjectPage;