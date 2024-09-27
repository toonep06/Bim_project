import Template from "../components/Template";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ใช้ axios ในการดึงข้อมูลจาก API
import '/node_modules/startbootstrap-sb-admin-2/vendor/datatables/jquery.dataTables.min.js';
import '/node_modules/startbootstrap-sb-admin-2/vendor/datatables/dataTables.bootstrap4.min.css';
import Modal from "../components/Modal";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

function TaskPage() {
    const [projects, setProjects] = useState([]);
    const { project_id, project_name } = useParams();
    const [filteredProjects, setFilteredProjects] = useState([]); // ใช้สำหรับเก็บข้อมูลที่ถูกค้นหา
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(''); // ใช้สำหรับเก็บข้อความค้นหา
    const [status, setStatus] = useState('active');
    const [createProjects, setCreateProjects] = useState({ status: 'active' });
    const [imageFile, setImageFile] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [selectedImage, setSelectedImage] = useState("");

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
                status: 'in-progress'
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
            const response = await axios.get('http://localhost:3000/api/tasks/project_id/' + project_id, {
                headers: {
                    Authorization: `Bearer ${token}`, // แนบ token ใน Authorization header
                },
            });

            setProjects(response.data); // เก็บข้อมูลโปรเจกต์ใน state
            setFilteredProjects(response.data); // เก็บข้อมูลโปรเจกต์ในตัวกรอง
            setFilteredProjects(response.data); // เก็บข้อมูลโปรเจกต์ในตัวกรอง
            if ($.fn.DataTable.isDataTable('#dataTable2')) {
                $('#dataTable2').DataTable().destroy();
            }
            $('#dataTable2').DataTable().destroy()
            setTimeout(() => {
                $('#dataTable2').DataTable({
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
                await axios.delete('http://localhost:3000/api/tasks/' + projectId, {
                    headers: {
                        Authorization: `Bearer ${token}`, // แนบ token ใน Authorization header
                    },
                });  // เรียก API ลบ Task
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
        formData.append('task_name', createProjects.task_name);
        formData.append('description', createProjects.description);
        formData.append('status', createProjects.status);
        formData.append('start_date', createProjects.startDate);
        formData.append('end_date', createProjects.endDate);
        formData.append('project_id', project_id);

        if (imageFile) {
            formData.append('images', imageFile); // อัปโหลดไฟล์รูปภาพ
        }

        try {
            const response = await axios.post('http://localhost:3000/api/tasks', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);  // เก็บ URL ของภาพใน state
    };
    const filterDataTable = (status) => {
        const table = $('#dataTable2').DataTable();
        if (status === 'all') {
            table.search('').columns().search('').draw();
        } else {
            table.column(3).search(status).draw();  // กรองโดยสถานะ (status)
        }
    };
    return (
        <>
            <Template title={"TASKS PROJECT > " + project_name.toLocaleUpperCase()}>
                <div className="d-flex flex-column mx-3">

                    {/* ตารางแสดงผลโปรเจกต์ */}
                    <div className="card shadow mb-4">
                        <div className="card-header py-1">
                            <div className="d-sm-flex align-items-center justify-content-between mb-1 flex-wrap">
                                <div className="d-flex flex-column flex-md-row mx-3 mb-2">
                                    <span className="m-0 font-weight-bold text-primary mb-2 mb-md-0 mr-md-5">Tasks</span>

                                    {/* ปุ่มกรองข้อมูล */}
                                    <div className="d-flex flex-wrap">
                                        <span
                                            onClick={() => filterDataTable('all')}
                                            className="btn btn-sm btn-primary shadow-sm mr-2 mb-2 mb-md-0"
                                        >
                                            ALL : {projects.length}
                                        </span>
                                        <span
                                            onClick={() => filterDataTable('Complete')}
                                            className="btn btn-sm btn-success shadow-sm mr-2 mb-2 mb-md-0"
                                        >
                                            Complete : {projects.filter(project => project.status === 'complete').length}
                                        </span>
                                        <span
                                            onClick={() => filterDataTable('In progress')}
                                            className="btn btn-sm btn-info shadow-sm mr-2 mb-2 mb-md-0"
                                        >
                                            In Progress : {projects.filter(project => project.status === 'in-progress').length}
                                        </span>
                                        <span
                                            onClick={() => filterDataTable('Pending')}
                                            className="btn btn-sm btn-secondary shadow-sm mr-2 mb-2 mb-md-0"
                                        >
                                            Pending : {projects.filter(project => project.status === 'pending').length}
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
                                    <i className="fas fa-plus fa-sm text-white-50"></i> Generate Task
                                </a>
                            </div>

                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable2" width="95%" cellSpacing="0" style={{ tableLayout: "fixed", borderCollapse: "collapse" }}>
                                    <thead className="text-dark " style={{ fontSize: "14px" }}>
                                        <tr>
                                            <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>Image</th>
                                            <th style={{ width: '120px', textAlign: 'center', verticalAlign: 'middle' }}>Task</th>
                                            <th style={{ width: '140px', textAlign: 'center', verticalAlign: 'middle' }}>Description</th>
                                            <th style={{ width: '50px', textAlign: 'center', verticalAlign: 'middle' }}>Status</th>
                                            <th style={{ width: '90px', textAlign: 'center', verticalAlign: 'middle' }}>Start Date</th>
                                            <th style={{ width: '90px', textAlign: 'center', verticalAlign: 'middle' }}>Due Date</th>
                                            <th style={{ width: '90px', textAlign: 'center', verticalAlign: 'middle' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {filteredProjects.map((project) => (
                                            <tr key={project.task_id} >
                                                <td className="text-center">
                                                    {project.Images[0] ? (
                                                        <img
                                                            src={`http://localhost:3000${project.Images[0].url}`}
                                                            alt={`Project ${project.task_name}`}
                                                            className="img-fluid rounded"
                                                            width="100px"
                                                            onClick={() => handleImageClick(`http://localhost:3000${project.Images[0].url}`)}  // คลิกเพื่อแสดงภาพใน Modal
                                                            style={{ cursor: 'pointer' }}  // เปลี่ยน cursor ให้เป็น pointer
                                                            data-toggle="modal" data-target="#modalImage"
                                                        />
                                                    ) : (
                                                        'No images'
                                                    )}
                                                </td>
                                                <td style={{ verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                    {project.task_name}
                                                </td>
                                                <td style={{ verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word' }}>{project.description}</td>
                                                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                                                    {project.status === 'complete' ? (
                                                        <span className="badge badge-success">Complete</span>
                                                    ) : project.status === 'in-progress' ? (
                                                        <span className="badge badge-info">In Progress</span>
                                                    ) : (
                                                        <span className="badge badge-secondary">Pending</span>
                                                    )
                                                    }

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
                                                            event.stopPropagation(); // หยุด onClick ของ tr
                                                            //delelteProject(project.project_id);
                                                        }}
                                                    >
                                                        <i className="fa fa-pen"></i>
                                                    </button>
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation(); // หยุด onClick ของ tr
                                                            delelteProject(project.task_id);
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
            <Modal id="modalUser" title='Generate Task' modalSize="modal-lg">
                <form onSubmit={handleCreateProject}>
                    <div>
                        <label>Task Name</label>
                        <input
                            className="form-control"
                            value={createProjects.task_name || ''}
                            onChange={(e) => setCreateProjects({ ...createProjects, task_name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <label>Description</label>
                        <input
                            className="form-control"
                            value={createProjects.description || ''}
                            onChange={(e) => setCreateProjects({ ...createProjects, description: e.target.value })}
                           
                        />
                    </div>
                    <div className="mt-3">
                        <label className="mr-3">Status</label>
                        <select
                            className={`badge ${createProjects.status === 'complete'
                                ? 'badge-success'
                                : createProjects.status === 'in-progress'
                                    ? 'badge-info'
                                    : createProjects.status === 'pending'
                                        ? 'badge-secondary'
                                        : ''
                                }`}
                            value={createProjects.status || ''}
                            onChange={(e) => setCreateProjects({ ...createProjects, status: e.target.value })}

                        >
                            <option onClick={(e) => setCreateProjects({ ...createProjects, status: e.target.value })} className="badge-success" value="complete">
                                Complete
                            </option>
                            <option onClick={(e) => setCreateProjects({ ...createProjects, status: e.target.value })} className="badge-info" value="in-progress">
                                In Progress
                            </option>
                            <option onClick={(e) => setCreateProjects({ ...createProjects, status: e.target.value })} className="badge-secondary" value="pending">
                                Pending
                            </option>
                        </select>
                    </div>
                    <div className="mt-3 input-group">
                        <label className="input-group-text mr-1 bg-info text-white">Start Date</label>
                        <input
                            type="date"
                            className="form-control mr-2"
                            value={createProjects.startDate || ''}
                            onChange={(e) => setCreateProjects({ ...createProjects, startDate: e.target.value })}
                            required
                        />
                        <label className="input-group-text bg-info text-white">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={createProjects.endDate || ''}
                            onChange={(e) => setCreateProjects({ ...createProjects, endDate: e.target.value })}
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
            <Modal id="modalImage" title="Image Task" modalSize="modal-lg">
                <div className="text-center">
                    <img src={selectedImage} alt="Selected" className="img-fluid"
                        style={{ width: '100%', height: 'auto', maxHeight: '500px', maxWidth: '800px' }}
                    />
                </div>
            </Modal>
        </>
    )
}

export default TaskPage;