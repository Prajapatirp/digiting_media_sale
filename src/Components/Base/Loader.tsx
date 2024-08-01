import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Loader = (props:any) => {
    return (
        <div className="loader-overlay">
            <Spinner color="primary" />
            {toast.error(props.error, { position: "top-right", hideProgressBar: false, progress: undefined, toastId: "" })}
        </div>
    );
};

export default Loader;

