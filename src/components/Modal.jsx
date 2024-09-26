function Modal(props) {
    let modalSize = 'modal-dialog';
    if (props, modalSize) {
        modalSize += ' ' + props.modalSize;
    }
    return (
        <>
            <div className="modal fade" id={props.id} tabIndex="-1" aria-labelledby={`${props.id}-label`} aria-modal="true" role="dialog">
                <div className={modalSize}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title fs-5 m-0 font-weight-bold text-primary" id="staticBackdropLabel">{props.title}</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal;