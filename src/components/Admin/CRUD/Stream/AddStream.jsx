import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";

const AddStream = () => {
    const toast = useRef(null);
    const navigate = useNavigate();

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "Master Settings", url: '/admin/crud'},
        {name: "Area", url: '/admin/crud/stream'},
        {name: "Add Area"}
    ];

    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    useEffect(() => {
        // Reset the form when the component is unmounted
        return () => {
            reset();
        };
    }, []);
    const onSubmitForm = (data) => {
        apiCall({
            url:'/crud/stream/add',
            method: 'POST',
            data: data,
            showLoadingIndicator: false
        }).then((res) => {
            console.log(res);
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Stream successfully created',
                life: 3000
            });
            reset();
            navigate("/admin/crud/stream");
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)} header='Details'>
                <div className='row'>
                    <div className='col-md-4'>
                        <label>Name*</label>
                        <InputText name='name'
                                   className={`${errors.name && 'p-invalid'} form-control`} {...register('name', {required: true})}/>
                        {errors.name && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <label>Short Name*</label>
                        <InputText name='shortName'
                                   className={`${errors.shortName && 'p-invalid'} form-control`} {...register('shortName', {required: true})}/>
                        {errors.shortName && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <label>Area Code*</label>
                        <InputText name='streamCode'
                                   className={`${errors.streamCode && 'p-invalid'} form-control`} {...register('streamCode', {required: true})}/>
                        {errors.streamCode && <span className='text-danger'>This field is required</span>}
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddStream