import { useAppDispatch } from "@/redux/hooks";
import { openModal, closeModal } from "@/redux/uireducers/modalstrip";

const useModalStrip = () => {
    const dispatch = useAppDispatch();

    const showModalStrip = (modalType: string, message: string, timeout: number = 3000) => {
        dispatch(openModal({ modalType, message }));
        
        // Use a timeout to clear the message
        if (timeout > 0) {
            setTimeout(() => {
                dispatch(closeModal());
            }, timeout);
        }
    };

    return { showModalStrip, closeModal: () => dispatch(closeModal()) };
};

export default useModalStrip;
