import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";

const AddTerm = () => {
    const toast = useRef(null);
    const navigate = useNavigate();

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "Master Settings", url: '/admin/crud'},
        {name: "Term", url: '/admin/crud/term'},
        {name: "Add Term"}
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
            url:'/crud/term/add',
            method:'POST',
            data: data,
            showLoadingIndicator: false
        }).then((res) => {
            console.log(res);
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Term successfully created',
                life: 3000
            });
            reset();
            navigate("/admin/crud/term");
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
                        <label>Description*</label>
                        <InputText name='description'
                                   className={`${errors.description && 'p-invalid'} form-control`} {...register('description', {required: true})}/>
                        {errors.description && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <label>Numeric Value*</label>
                        <InputText name='numericValue'
                                   className={`${errors.numericValue && 'p-invalid'} form-control`} {...register('numericValue', {required: true})}/>
                        {errors.numericValue && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <label>Term Code*</label>
                        <InputText name='termCode'
                                   className={`${errors.termCode && 'p-invalid'} form-control`} {...register('termCode', {required: true})}/>
                        {errors.termCode && <span className='text-danger'>This field is required</span>}
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddTerm