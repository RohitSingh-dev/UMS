import AdminLayout from "../../AdminLayout.jsx";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {useEffect, useState} from "react";
import axios from 'axios';
import CookieHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../Util/AppConstant.jsx";
import {InputText} from "primereact/inputtext";
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';

const QuestionType = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "Question Type"}
    ];

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [questionTypes, setQuestionTypes] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {
            type: {value: '', matchMode: 'contains'},  // Match the field name with the DataTable column field
            is_active: {value: null, matchMode: 'equals'}  // Use null to match boolean fields
        }
    });

    useEffect(() => {
        const delay = setTimeout(() => {
            // Update lazy state only after user has stopped typing
            setLazyState((prevState) => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    type: { value: globalFilterValue, matchMode: 'contains' }
                },
                page: 0, // Reset to the first page
            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delay); // Clear timeout if the component re-renders
    }, [globalFilterValue]); // Only trigger when globalFilterValue changes

    useEffect(() => {
        loadLazyData();
    }, [lazyState]);

    const loadLazyData = () => {
        setLoading(true);

        const params = {
            page: lazyState.page,
            size: lazyState.rows,
            sortField: lazyState.sortField,
            sortOrder: lazyState.sortOrder,
            type: lazyState.filters.type.value || '',  // Ensure default value if undefined
            is_active: lazyState.filters.is_active.value  // Boolean field, no default needed
        };

        axios.get('/search_data/search-question-types', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: params
        })
            .then(response => {
                setTotalRecords(response.data.total_elements);
                setQuestionTypes(response.data.content);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
                setLoading(false);
            });
    };

    const onPage = (event) => {
        setLazyState(prevState => ({...prevState, ...event}));
    };

    const onSort = (event) => {
        setLazyState(prevState => ({...prevState, ...event}));
    };

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value); // Update the input value state
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <div>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search Question Type" />
                    </IconField>
                </div>
                <div>
                    <NavLink to="add" className="btn btn-primary-violet mb-4">
                        <FontAwesomeIcon icon={faPlusCircle}/> Add Question Type
                    </NavLink>
                </div>
            </div>
        );
    };

    const toggleStatus = (rowData) => {
        const updatedStatus = !rowData.is_active;
        axios.put('/crud/question_type/change_status',
            {
                id: rowData.id,
                is_active: updatedStatus
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                setQuestionTypes(questionTypes.map(customer =>
                    customer.id === rowData.id ? {...customer, is_active: updatedStatus} : customer
                ));
            })
            .catch(error => {
                console.error("Error updating status:", error);
            });
    };

    const isActiveTemplate = (rowData) => {
        return (
            <button className={`btn ${rowData.is_active ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => toggleStatus(rowData)}>
                {rowData.is_active ? 'Active' : 'Inactive'}
            </button>
        );
    };
    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };

    const onRowEditComplete = (e) => {
        const rowData = e.newData
        console.log(rowData.type, typeof rowData.type)
        axios.put('/crud/question_type/update_type',
            {
                id: rowData.id,
                type: rowData.type
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                setQuestionTypes(questionTypes.map(customer =>
                    customer.id === rowData.id ? {...customer, type: rowData.type} : customer
                ));
            })
            .catch(error => {
                console.error("Error updating status:", error);
            });
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
    };

    const header = renderHeader();

    return (
        <AdminLayout breadcrumbItems={breadcrumbData}>
            <div className='card'>
                <DataTable value={questionTypes} showGridlines lazy dataKey="id" paginator
                           paginatorClassName="p-paginator-top" header={header}
                           editMode="row" onRowEditComplete={onRowEditComplete}
                           first={lazyState.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                           onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                           globalFilterFields={['type']} loading={loading}
                           tableStyle={{minWidth: '100%'}}>
                    <Column header="No." body={(rowData, options) => lazyState.first + options.rowIndex + 1}
                            headerStyle={{width: '3rem'}}/>
                    <Column field="type" header="Question Type" sortable
                            editor={(options) => textEditor(options)}/>
                    <Column field="is_active" header="Status" body={isActiveTemplate} sortable
                            headerStyle={{width: '10%', minWidth: '4rem'}} bodyStyle={{textAlign: 'center'}}/>
                    <Column rowEditor={allowEdit} headerStyle={{width: '10%', minWidth: '4rem'}}
                            bodyStyle={{textAlign: 'center'}}></Column>
                </DataTable>
            </div>
        </AdminLayout>
    );
}

export default QuestionType;
