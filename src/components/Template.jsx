import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Footer from './Footer';
function Template(props) {
    return (
        <>
            <div id="page-top" className=''>
                <div id="wrapper">
                    <Sidebar />
                    <div id="content-wrapper" className="d-inline-flex flex-column">
                        <div id="content">
                            <Topbar title={props.title} />
                            {props.children}
                        </div>
                        <Footer/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Template;