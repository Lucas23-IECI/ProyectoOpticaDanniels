import Form from "@components/Form";
import "@styles/popup.css";
import CloseIcon from "@assets/XIcon.svg";

const Popup = ({ show, setShow, title, fields, onSubmit, buttonText = "Enviar" }) => {
    const handleSubmit = (formData) => {
        onSubmit(formData);
    };

    return (
        show && (
            <div className="popup-bg">
                <div className="popup-content">
                    <button className="popup-close" onClick={() => setShow(false)}>
                        <img src={CloseIcon} alt="Cerrar" />
                    </button>
                    <Form
                        title={title}
                        fields={fields}
                        onSubmit={handleSubmit}
                        buttonText={buttonText}
                        backgroundColor="#fff"
                    />
                </div>
            </div>
        )
    );
};

export default Popup;
